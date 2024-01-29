import styles from "../../styles/Task.module.css";

export default function Task() {
  return (
    <div className={styles.container}>
      <p>Create a task</p>
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
      <p>All tasks</p>
    </div>
  );
}
