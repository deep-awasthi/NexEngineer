import Link from "next/link";

import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <span>404</span>

        <h1>Page Not Found</h1>

        <p>
          The page you are looking for does not exist or has been moved.
        </p>

        <div className={styles.actions}>
          <Link href="/">
            Go Home
          </Link>

          <Link href="/notes">
            Revision Notes
          </Link>
        </div>
      </div>
    </main>
  );
}