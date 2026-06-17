import { Article } from "@/types/article";

export const javaArticles: Article[] = [
  {
    slug: "collections",

    title: "Java Collections Framework",

    description:
      "Master List, Set, Queue and Map implementations.",

    category: "Java",

    readTime: "12 min",

    content: `
Java Collections Framework provides
data structures and algorithms
for efficient data manipulation.

Main interfaces:

List
Set
Queue
Map
`
  },

  {
    slug: "streams",

    title: "Java Streams",

    description:
      "Functional programming in Java.",

    category: "Java",

    readTime: "10 min",

    content: `
Streams enable declarative data processing.

Common operations:

map
filter
reduce
collect
`
  },

  {
    slug: "jvm",

    title: "Java Virtual Machine",

    description:
      "Understand heap, stack and garbage collection.",

    category: "Java",

    readTime: "15 min",

    content: `
JVM executes Java bytecode.

Memory areas:

Heap
Stack
Metaspace
`
  }
];