import Head from "next/head";
import styles from "../styles/Home.module.css";
import { graphql } from "../gql";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

const GET_ALL_TASKS = graphql(`
  query GetAllTasks {
    getAllTasks {
      title
      status
      id
      description
    }
  }
`);

const CREATE_TASK = graphql(`
  mutation CreateTask($title: String!, $status: String!, $description: String) {
    createTask(title: $title, status: $status, description: $description) {
      title
      status
      description
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

export default function Home() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(STATUS_OPTIONS[0].value);
  const [description, setDescription] = useState("");
  const {
    data: taskData,
    loading: loadingTask,
    error: errorTask,
  } = useQuery(GET_ALL_TASKS);
  const [
    createTask,
    {
      data: deleteTaskData,
      loading: loadingDeleteTask,
      error: errorDeleteTask,
    },
  ] = useMutation(CREATE_TASK, {
    refetchQueries: [GET_ALL_TASKS],
  });

  if (loadingTask) {
    return <h2>Loading...</h2>;
  }

  if (errorTask) {
    console.error(errorTask);
    return null;
  }
  if (!taskData) {
    return null;
  }
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      title,
      status,
      description: description.length > 0 ? description : undefined,
    };
    createTask({
      variables: data,
    });
    setTitle("");
    setStatus(STATUS_OPTIONS[0].value);
    setDescription("");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Task Manager App</title>
        <meta name="description" content="Manage your tasks!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to the Task Manager</h1>

        <h2>Create a task</h2>
        <form className={styles.card} onSubmit={onSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Title
            </label>
            <input
              type="title"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              className={styles.input}
              placeholder="Task Title"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="status" className={styles.label}>
              Status
            </label>
            <select
              className={styles.select}
              name="status"
              id="status-select"
              value={status}
              onChange={(e) => setStatus(e.currentTarget.value)}
            >
              {STATUS_OPTIONS.map((status) => {
                return (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              className={styles.textarea}
              placeholder="Task Description"
            />
          </div>
          <button type="submit">Create Task</button>
        </form>
        <h2>All tasks</h2>
        {taskData.getAllTasks.map((task) => {
          return (
            <div key={task.id} className={styles.card}>
              <h2>Title: {task.title}</h2>
              <p>{task.id}</p>
              <p>Description: {task.description}</p>
              <p>Status {task.status}</p>
              <button>x</button>
            </div>
          );
        })}
      </main>
    </div>
  );
}
