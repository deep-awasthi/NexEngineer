import styles from "./page.module.css";
import SocialCTA from "@/components/SocialCTA";

export const metadata = {
  title: "About",
  description:
    "Learn more about DevOrbit and its mission.",
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <div className="container">
        <h1>About DevOrbit</h1>

        <p className={styles.intro}>
          DevOrbit is a software engineering learning
          platform focused on Java, DSA, Spring Boot,
          Docker, Kubernetes, System Design, AI and
          interview preparation.
        </p>

        <section className={styles.section}>
          <h2>Mission</h2>

          <p>
            Help engineers learn faster through
            structured roadmaps, practical concepts,
            interview questions and quick revision
            notes.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Topics Covered</h2>

          <ul>
            <li>Java</li>
            <li>DSA</li>
            <li>Spring Boot</li>
            <li>Docker</li>
            <li>Kubernetes</li>
            <li>LLD</li>
            <li>HLD</li>
            <li>Python</li>
            <li>AI</li>
            <li>Go</li>
          </ul>
        </section>
      </div>
      <SocialCTA />
    </main>
  );
}