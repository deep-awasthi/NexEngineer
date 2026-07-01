"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import styles from "./MediumReferenceButton.module.css";

interface MediumReferenceButtonProps {
  articleId: string;
}

// Medium Monogram Logo SVG declared outside of render to prevent re-creation
function MediumLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42zM24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

export default function MediumReferenceButton({
  articleId,
}: MediumReferenceButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [mediumUrl, setMediumUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("medium-ref-" + articleId);
    
    // Set states asynchronously in next tick to avoid cascading renders warning in React 19 / ESLint
    const timer = setTimeout(() => {
      setMounted(true);
      if (saved) {
        setMediumUrl(saved);
        setInputValue(saved);
      } else {
        setMediumUrl(null);
        setInputValue("");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [articleId]);

  if (!mounted) {
    return null; // Return null on server and before client-side hydration completes
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError("URL cannot be empty");
      return;
    }

    try {
      const url = new URL(trimmed);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        setError("URL must start with http:// or https://");
        return;
      }
    } catch {
      setError("Please enter a valid URL (e.g. https://medium.com/...)");
      return;
    }

    localStorage.setItem("medium-ref-" + articleId, trimmed);
    setMediumUrl(trimmed);
    setIsEditing(false);
    setError("");
  };

  const handleDelete = () => {
    localStorage.removeItem("medium-ref-" + articleId);
    setMediumUrl(null);
    setInputValue("");
    setIsEditing(false);
    setError("");
  };

  const handleCancel = () => {
    setInputValue(mediumUrl || "");
    setIsEditing(false);
    setError("");
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor={`medium-url-input-${articleId}`}>
            Medium Article Reference URL
          </label>
          <input
            id={`medium-url-input-${articleId}`}
            type="text"
            className={styles.input}
            placeholder="https://medium.com/@username/my-awesome-article"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
        <div className={styles.formActions}>
          <button type="button" onClick={handleCancel} className={styles.cancelBtn}>
            Cancel
          </button>
          <button type="submit" className={styles.saveBtn}>
            Save Reference
          </button>
        </div>
      </form>
    );
  }

  if (mediumUrl) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.iconWrapper}>
              <MediumLogo />
            </div>
            <div className={styles.cardText}>
              <div className={styles.cardTitle}>Medium Reference Article</div>
              <div className={styles.cardUrl}>{mediumUrl}</div>
            </div>
          </div>
          <div className={styles.cardActions}>
            <a
              href={mediumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkBtn}
            >
              <MediumLogo />
              <span>Read on Medium</span>
              <ExternalLink size={16} />
            </a>
            <button
              onClick={() => setIsEditing(true)}
              className={`${styles.actionBtn} ${styles.editBtn}`}
              title="Edit Reference Link"
              aria-label="Edit Reference Link"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={handleDelete}
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              title="Remove Reference Link"
              aria-label="Remove Reference Link"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => setIsEditing(true)} className={styles.addBtn}>
        <Plus size={16} />
        <span>Add Medium Article Reference</span>
      </button>
    </div>
  );
}
