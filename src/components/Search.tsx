"use client";

import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";

import styles from "./Search.module.css";

const searchData = [
  { title: "Java", href: "/java" },
  { title: "DSA", href: "/dsa" },
  { title: "Spring Boot", href: "/springBoot" },
  { title: "Docker", href: "/docker" },
  { title: "Kubernetes", href: "/kubernetes" },
  { title: "LLD", href: "/lld" },
  { title: "HLD", href: "/hld" },
  { title: "Python", href: "/python" },
  { title: "AI", href: "/ai" },
  { title: "Go", href: "/go" },
  { title: "Revision Notes", href: "/notes" },
];

export default function Search() {
  const [query, setQuery] = useState("");

  const results = searchData.filter((item) =>
    item.title
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBox}>
        <SearchIcon
          size={18}
          className={styles.icon}
        />

        <input
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search topics..."
        />
      </div>

      {query.trim() && (
        <div className={styles.dropdown}>
          {results.length > 0 ? (
            results.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.result}
              >
                {item.title}
              </Link>
            ))
          ) : (
            <div className={styles.noResults}>
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}