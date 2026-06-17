import Link from "next/link";
import styles from "./TopicCard.module.css";

interface TopicCardProps {
  title: string;
  description: string;
  href: string;
}

export default function TopicCard({
  title,
  description,
  href,
}: TopicCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <h3>{title}</h3>

      <p>{description}</p>

      <span>Explore →</span>
    </Link>
  );
}