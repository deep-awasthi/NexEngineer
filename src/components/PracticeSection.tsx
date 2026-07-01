import Link from "next/link";
import styles from "./PracticeSection.module.css";
import { Code2, Layers, Building2 } from "lucide-react";

const practices = [
  {
    title: "Practice DSA",
    description:
      "Sharpen your problem-solving skills with curated Data Structures & Algorithms challenges — arrays, trees, graphs, DP and more.",
    icon: Code2,
    color: "#ec4899",
    gradient: "linear-gradient(135deg, rgba(236,72,153,0.12), rgba(168,85,247,0.06))",
    border: "rgba(236,72,153,0.2)",
    href: "#",
    label: "Start Practicing",
  },
  {
    title: "Practice LLD",
    description:
      "Design real-world systems at the class level — SOLID principles, design patterns, OOP case studies like Parking Lot, BookMyShow.",
    icon: Layers,
    color: "#a855f7",
    gradient: "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(59,130,246,0.06))",
    border: "rgba(168,85,247,0.2)",
    href: "#",
    label: "Start Practicing",
  },
  {
    title: "Practice HLD",
    description:
      "Architect scalable distributed systems — design URL shorteners, social feeds, payment systems, and more at scale.",
    icon: Building2,
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(16,185,129,0.06))",
    border: "rgba(59,130,246,0.2)",
    href: "#",
    label: "Start Practicing",
  },
];

export default function PracticeSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2>Practice Arena</h2>
          <p>Level up your skills with hands-on challenges and real interview problems.</p>
        </div>

        <div className={styles.grid}>
          {practices.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className={styles.card}
                style={{
                  background: item.gradient,
                  borderColor: item.border,
                }}
              >
                <div className={styles.iconWrapper} style={{ color: item.color, borderColor: item.border }}>
                  <Icon size={28} />
                </div>
                <div className={styles.cardBody}>
                  <h3 style={{ color: item.color }}>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.cta} style={{ color: item.color }}>
                    {item.label} →
                  </span>
                  <span className={styles.comingSoon}>Coming Soon</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
