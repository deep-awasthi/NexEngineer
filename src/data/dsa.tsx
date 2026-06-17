export const roadmap = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Stacks",
  "Queues",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Greedy"
];

export const topics = [
  {
    title: "Arrays & Strings",
    description: "Master foundational sequences, contiguous memory allocation, and traversal algorithms.",
    details: [
      "Sliding Window pattern for contiguous subarrays",
      "Two Pointers technique for sorted arrays and search problems",
      "Prefix Sum arrays for fast range queries",
      "String processing algorithms, anagrams, palindromes, and substring search"
    ]
  },
  {
    title: "Linked Lists",
    description: "Understand node-based linear data structures, pointer manipulation, and sorting.",
    details: [
      "Singly vs. Doubly vs. Circular Linked Lists",
      "Fast and Slow pointer pattern (Floyd's Cycle Detection)",
      "Reversing lists, merging sorted lists, and list reordering",
      "Memory layouts and reference handling vs Arrays"
    ]
  },
  {
    title: "Stacks & Queues",
    description: "Implement LIFO and FIFO structures, monotonic behaviors, and priority scheduling.",
    details: [
      "Standard and dynamic Stack / Queue implementations",
      "Monotonic Stack pattern (Next Greater Element, Histograms)",
      "Min-Stack and Max-Stack trackers",
      "Queues: Deques, Circular Queues, and Priority Queues (Heaps)"
    ]
  },
  {
    title: "Trees & Binary Search Trees (BST)",
    description: "Learn hierarchical structures, node relationships, traversals, and self-balancing BSTs.",
    details: [
      "Tree traversals: Pre-order, In-order, Post-order, and Level-order (BFS)",
      "Binary Search Trees: search, insertion, deletion, and validation properties",
      "Lowest Common Ancestor (LCA) and tree depth algorithms",
      "Balanced trees concepts: AVL, Red-Black Trees, and Trie (prefix tree) traversal"
    ]
  },
  {
    title: "Graphs",
    description: "Represent network connections, explore paths, and find shortest routing strategies.",
    details: [
      "Graph representations: Adjacency List and Adjacency Matrix",
      "Traversals: Depth-First Search (DFS) and Breadth-First Search (BFS)",
      "Topological Sorting for dependency resolutions (Kahn's algorithm)",
      "Shortest Path algorithms: Dijkstra, Bellman-Ford, and Union Find (Disjoint Set Union)"
    ]
  },
  {
    title: "Dynamic Programming (DP)",
    description: "Solve complex problems by breaking them down into sub-problems, storing results to avoid recomputation.",
    details: [
      "Identifying DP: Overlapping subproblems and Optimal Substructure properties",
      "Memoization (Top-Down) vs. Tabulation (Bottom-Up) approaches",
      "Classic patterns: 0/1 Knapsack, Longest Common Subsequence, Fibonacci variants",
      "Grid DP (Unique Paths, Min Path Sum) and Interval DP"
    ]
  },
  {
    title: "Greedy & Divide & Conquer",
    description: "Optimize choices at each step locally, and partition problems recursively for divide-and-conquer solutions.",
    details: [
      "Greedy choice property: Interval Scheduling, Huffman Coding, Fractional Knapsack",
      "Divide & Conquer: Binary Search, Merge Sort, and Quick Sort mechanics",
      "Greedy vs Dynamic Programming trade-offs"
    ]
  }
];

export const interviewQuestions = [
  {
    question: "What is the time complexity of HashMap?",
    answer: "Average O(1), worst-case O(n)."
  },
  {
    question: "Difference between BFS and DFS?",
    answer: "BFS explores level by level while DFS explores depth first."
  }
];

export const pageData = {
  title: "DSA",
  badge: "Data Structures & Algorithms",
  description:
    "Learn Data Structures and Algorithms from fundamentals to advanced interview patterns used by top technology companies.",
  stats: [
    { value: "15+", label: "Learning Modules" },
    { value: "200+", label: "Interview Questions" },
    { value: "50+", label: "Problem Patterns" },
    { value: "Beginner → Advanced", label: "Learning Path" }
  ],
  roadmap,
  learnConcepts: [
    "Arrays",
    "Strings",
    "Linked Lists",
    "Stacks",
    "Queues",
    "Trees",
    "Binary Search",
    "Heaps",
    "Graphs",
    "Greedy",
    "Dynamic Programming",
    "Backtracking"
  ],
  additionalGrids: [
    {
      title: "Problem Solving Patterns",
      items: [
        "Two Pointers",
        "Sliding Window",
        "Fast & Slow Pointer",
        "Merge Intervals",
        "Binary Search",
        "DFS",
        "BFS",
        "Topological Sort",
        "Union Find",
        "Monotonic Stack",
        "Prefix Sum",
        "Dynamic Programming"
      ]
    }
  ],
  topics,
  interviewQuestions,
  resources: [
    "LeetCode",
    "NeetCode",
    "GeeksForGeeks",
    "AlgoMonster",
    "InterviewBit",
    "Codeforces",
    "HackerRank",
    "AtCoder",
    "CP Handbook",
    "CLRS",
    "Striver Sheet",
    "Blind 75"
  ],
  ctaTitle: "Crack Coding Interviews",
  ctaDescription:
    "Master data structures, algorithms and problem solving techniques used in top product company interviews."
};