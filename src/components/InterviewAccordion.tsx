"use client";

import { useState } from "react";
import styles from "./InterviewAccordion.module.css";

interface Question {
  question: string;
  answer: string;
}

interface Props {
  questions: Question[];
}

export default function InterviewAccordion({
  questions,
}: Props) {
  const [openIndex, setOpenIndex] =
    useState<number | null>(null);

  return (
    <div className={styles.wrapper}>
      {questions.map((item, index) => (
        <div
          key={item.question}
          className={styles.card}
        >
          <button
            className={styles.question}
            onClick={() =>
              setOpenIndex(
                openIndex === index ? null : index
              )
            }
          >
            {item.question}
          </button>

          {openIndex === index && (
            <div className={styles.answer}>
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}