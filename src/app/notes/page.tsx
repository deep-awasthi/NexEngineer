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
];

export default function NotesPage() {
  return (
    <main className={styles.page}>
      <div className="container">
        <h1>Quick Revision Notes</h1>

        <p className={styles.subtitle}>
          Fast revision guides for interviews and daily work.
        </p>

        {sections.map((section) => (
          <section
            key={section.title}
            className={styles.section}
          >
            <h2>{section.title}</h2>

            <div className={styles.grid}>
              {section.notes.map((note) => (
                <div
                  key={note}
                  className={styles.card}
                >
                  {note}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}