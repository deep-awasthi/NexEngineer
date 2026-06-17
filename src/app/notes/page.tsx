import Link from "next/link";
import styles from "./page.module.css";

const sections = [
  {
    title: "Java",
    notes: [
      "Collections Cheat Sheet",
      "Streams Cheat Sheet",
      "JVM Cheat Sheet",
      "Concurrency Cheat Sheet",
    ],
  },
  {
    title: "DSA",
    notes: [
      "Complexity Cheat Sheet",
      "Tree Traversal Cheat Sheet",
      "Graph Algorithms Cheat Sheet",
      "DP Patterns",
    ],
  },
  {
    title: "Spring Boot",
    notes: [
      "Annotations Cheat Sheet",
      "Security Cheat Sheet",
      "JPA Cheat Sheet",
      "Kafka Integration Notes",
    ],
  },
  {
    title: "Docker & Kubernetes",
    notes: [
      "Docker Commands",
      "Docker Compose Commands",
      "Kubectl Commands",
      "Helm Commands",
    ],
  },
  {
    title: "System Design",
    notes: [
      "Caching Cheat Sheet",
      "Database Cheat Sheet",
      "CAP Theorem",
      "Load Balancer Notes",
    ],
  },
  {
    title: "Go",
    notes: [
      "Goroutines Cheat Sheet",
      "Channels Cheat Sheet",
      "Go Syntax Revision",
      "Context API Notes",
    ],
  },
  {
    title: "Python",
    notes: [
      "Generators & Iterators",
      "Decorators Cheat Sheet",
      "AsyncIO Cheatsheet",
      "Virtual Envs & PIP",
    ],
  },
  {
    title: "AI",
    notes: [
      "Prompt Engineering Tips",
      "RAG Pipeline Cheat Sheet",
      "Vector DB Comparison",
      "Model Context Protocol",
    ],
  },
];

export default function NotesPage() {
  return (
    <main className={styles.page}>
      <div className="pageBackground" style={{ backgroundImage: "url('/backgrounds/notes_icon.png')" }} />
      <div className="container">
        <h1>Quick Revision Notes</h1>

        <p className={styles.subtitle}>
          Fast revision guides for interviews and daily work.
        </p>

        {sections.map((section) => {
          const sectionId = section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return (
            <section
              key={section.title}
              id={sectionId}
              className={styles.section}
            >
              <h2>{section.title}</h2>

              <div className={styles.grid}>
                {section.notes.map((note) => {
                  const noteSlug = note.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                  return (
                    <Link
                      key={note}
                      href={`/notes/${sectionId}/${noteSlug}`}
                      className={styles.card}
                    >
                      {note}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}