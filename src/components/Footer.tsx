import { FaMedium, FaLinkedin, FaGithub } from "react-icons/fa";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <h3>DevOrbit</h3>

        <p>
          Master Software Engineering through structured learning paths.
        </p>

        <div className={styles.links}>
          <a
            href="https://medium.com/@deepawasthi"
            target="_blank"
            rel="noreferrer"
            className={styles.iconLink}
            aria-label="Medium"
          >
            <FaMedium size={22} />
          </a>

          <a
            href="https://www.linkedin.com/in/deep-awasthi/"
            target="_blank"
            rel="noreferrer"
            className={styles.iconLink}
            aria-label="LinkedIn"
          >
            <FaLinkedin size={22} />
          </a>

          <a
            href="https://github.com/deep-awasthi"
            target="_blank"
            rel="noreferrer"
            className={styles.iconLink}
            aria-label="GitHub"
          >
            <FaGithub size={22} />
          </a>
        </div>
      </div>
    </footer>
  );
}