import styles from "./loading.module.css";

export default function Loading() {
  return (
    <main className={styles.loading}>
      <div className={styles.spinner} />

      <h2>Loading DevOrbit</h2>

      <p>
        Preparing your learning experience...
      </p>
    </main>
  );
}