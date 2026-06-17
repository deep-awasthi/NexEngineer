import styles from "./SocialCTA.module.css";

export default function SocialCTA() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2>
          Continue Learning Beyond DevOrbit
        </h2>

        <p>
          Read deep dives on Medium and
          follow for engineering content.
        </p>

        <div className={styles.buttons}>
          <a
            href="https://medium.com/@deepawasthi"
            target="_blank"
          >
            Read on Medium
          </a>

          <a
            href="https://www.linkedin.com/in/deep-awasthi/"
            target="_blank"
          >
            Follow on LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}