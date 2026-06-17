import styles from "./FeaturedTopics.module.css";

const topics = [
  {
    title: "JVM Internals",
    category: "Java",
  },
  {
    title: "Kafka Architecture",
    category: "Spring Boot",
  },
  {
    title: "CAP Theorem",
    category: "HLD",
  },
  {
    title: "Redis Caching",
    category: "HLD",
  },
  {
    title: "Kubernetes Networking",
    category: "Kubernetes",
  },
  {
    title: "Design WhatsApp",
    category: "System Design",
  },
];

export default function FeaturedTopics() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2>Featured Topics</h2>

        <div className={styles.grid}>
          {topics.map((topic) => (
            <div
              key={topic.title}
              className={styles.card}
            >
              <span>{topic.category}</span>

              <h3>{topic.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}