import Link from "next/link";

import styles from "./ArticleCard.module.css";

interface Props {
  title: string;

  description: string;

  href: string;

  readTime: string;
}

export default function ArticleCard({
  title,
  description,
  href,
  readTime,
}: Props) {
  return (
    <Link
      href={href}
      className={styles.card}
    >
      <span>{readTime}</span>

      <h3>{title}</h3>

      <p>{description}</p>
    </Link>
  );
}