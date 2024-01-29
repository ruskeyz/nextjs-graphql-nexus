import Head from "next/head";
import styles from "../styles/Home.module.css";
import { graphql } from "../gql";
import { useQuery } from "@apollo/client";

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

export default function Home() {
  const { data, loading, error } = useQuery(GET_ALL_TASKS);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    console.error(error);
    return null;
  }
  if (!data) {
    return null;
  }

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
        <div className={styles.createTask}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Title
            </label>
            <input
              type="title"
              name="title"
              id="title"
              className={styles.input}
              placeholder="Task Title"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Description
            </label>
            <input
              type="title"
              name="title"
              id="title"
              className={styles.input}
              placeholder="Task Description"
            />
          </div>
          <button type="submit">Create Task</button>
        </div>
        <h2>All tasks</h2>
        {data.getAllTasks.map((task) => {
          return (
            <div key={task.id} className={styles.card}>
              <p>Title: {task.title}</p>
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
