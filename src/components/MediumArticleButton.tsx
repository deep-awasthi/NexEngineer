import { ExternalLink } from "lucide-react";
import styles from "./MediumArticleButton.module.css";

// Medium "M" monogram SVG
function MediumLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42zM24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

interface MediumArticleButtonProps {
  url: string;
  label?: string;
}

export default function MediumArticleButton({
  url,
  label = "Read on Medium",
}: MediumArticleButtonProps) {
  return (
    <div className={styles.wrapper}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.btn}
      >
        <MediumLogo />
        <span>{label}</span>
        <ExternalLink size={14} className={styles.external} />
      </a>
      <p className={styles.hint}>
        Reference article curated by the NexEngineer team for deeper reading.
      </p>
    </div>
  );
}
