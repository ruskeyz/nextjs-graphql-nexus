import Head from "next/head";
import styles from "../../styles/Home.module.css";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { graphql } from "../../gql";
import { strict } from "assert";

export const CREATE_SUBTASK = graphql(`
  mutation CreateSubtask($taskId: Int!, $body: String!) {
    createSubtask(taskId: $taskId, body: $body) {
      body
      id
    }
  }
`);

export const GET_TASK = graphql(`
  query GetTask($getTaskId: Int!) {
    getTask(id: $getTaskId) {
      status
      title
      id
      description
      subTasks {
        body
        id
      }
    }
  }
`);
export const DELETE_SUBTASK = graphql(`
  mutation DeleteSubTask($deleteSubTaskId: String!) {
    deleteSubTask(id: $deleteSubTaskId) {
      body
      id
    }
  }
`);

export const CHANGE_TASK_STATUS = graphql(`
  mutation ChangeTaskStatus($changeTaskStatusId: Int!, $status: String!) {
    changeTaskStatus(id: $changeTaskStatusId, status: $status) {
      description
      id
      status
      title
      subTasks {
        body
      }
    }
  }
`);

const STATUS_OPTIONS = [
  {
    label: "To Do",
    value: "TO_DO",
  },
  {
    label: "In progress",
    value: "IN_PROGRESS",
  },
  {
    label: "Done",
    value: "DONE",
  },
];

export default function Task() {
  const [subTask, setSubTask] = useState("");
  //const [status, setStatus] = useState(STATUS_OPTIONS[0].value);

  const { query } = useRouter();
  const taskId =
    typeof query["taskId"] === "string" ? query["taskId"] : undefined;

  const {
    data: taskData,
    loading: taskLoading,
    error: taskError,
  } = useQuery(GET_TASK, {
    variables: taskId ? { getTaskId: Number(taskId) } : undefined,
  });
  const [createSubTask, { loading: subTaskLoading, error: subTaskError }] =
    useMutation(CREATE_SUBTASK, {
      refetchQueries: [GET_TASK],
    });

  const [
    deleteSubTask,
    { loading: deleteSubTaskLoading, error: deleteSubTaskError },
  ] = useMutation(DELETE_SUBTASK, {
    refetchQueries: [GET_TASK],
  });

  const [changeTaskStatus, { loading, error }] = useMutation(
    CHANGE_TASK_STATUS,
    {
      refetchQueries: [GET_TASK],
    }
  );

  if (taskLoading || subTaskLoading || deleteSubTaskLoading) {
    return <h2>Loading...</h2>;
  }

  if (taskError || subTaskError || deleteSubTaskError) {
    if (taskError) {
      console.error(taskError);
    } else if (subTaskError) {
      console.error(subTaskError);
    } else {
      console.error(deleteSubTaskError);
    }
    return null;
  }
  if (!taskData) {
    return null;
  }

  const onDelete = (id: string) => {
    deleteSubTask({
      variables: {
        deleteSubTaskId: id,
      },
    });
  };

  const onClick = () => {
    createSubTask({
      variables: {
        taskId: Number(taskId),
        body: subTask,
      },
    });
  };

  const onChangeStatus = (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: number
  ) => {
    console.log(id, e.currentTarget.value);
    changeTaskStatus({
      variables: {
        changeTaskStatusId: id,
        status: e.currentTarget.value,
      },
    });
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Task {taskData.getTask.id}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Task {taskData.getTask.id}</h1>
        <h2 className={styles.description}>{taskData.getTask.title}</h2>
        <p className={styles.description}>{taskData.getTask.description}</p>
        <p className={styles.description}>{taskData.getTask.status}</p>
        <select
          className={styles.select}
          name="status"
          id="status-select"
          value={taskData.getTask.status}
          onChange={(e) => onChangeStatus(e, taskData.getTask.id)}
        >
          {STATUS_OPTIONS.map((status) => {
            return (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            );
          })}
        </select>

        <div className={styles.createSubtask}>
          <input
            type="subTask"
            name="subTask"
            id="subTask"
            value={subTask}
            onChange={(e) => setSubTask(e.currentTarget.value)}
            className={styles.input}
            placeholder="Sub Task Text"
          />

          <button onClick={onClick}>Add sub task</button>
        </div>
        {taskData.getTask.subTasks.map((subTask) => {
          return (
            <ul className={styles.list} key={subTask.id}>
              <li>{subTask.body}</li>
              <button
                className={styles.smCloseButton}
                onClick={() => onDelete(subTask.id)}
              >
                x
              </button>
            </ul>
          );
        })}
      </main>
    </div>
  );
}
