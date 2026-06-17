export const roadmap = [
  "LLMs",
  "Prompt Engineering",
  "Embeddings",
  "RAG",
  "Vector Databases",
  "Agents",
  "MCP"
];

export const topics = [
  {
    title: "Large Language Models (LLMs)",
    description: "Understand the core architecture of LLMs, Transformer networks, self-attention, and text generation.",
    details: [
      "Transformer Architecture: Encoder-only, Decoder-only (GPT), and Encoder-Decoder (T5)",
      "Tokenization, Word Embeddings, and Position Encodings",
      "Self-Attention mechanism, Multi-Head Attention, and context windows",
      "Temperature, Top-P, Top-K, and decoding strategies for generation control"
    ]
  },
  {
    title: "Prompt Engineering",
    description: "Master techniques to guide and query LLMs effectively for robust and deterministic outputs.",
    details: [
      "Zero-shot, Few-shot, and Chain-of-Thought (CoT) prompting styles",
      "System prompts, context framing, and formatting directives",
      "Output parsing, JSON formatting, and structured output schemas",
      "Prompt injection risks, mitigation, and guardrails (NeMo Guardrails)"
    ]
  },
  {
    title: "Text Embeddings & Vector Databases",
    description: "Represent data numerically as vector embeddings, store them, and perform semantic searches.",
    details: [
      "Generating embeddings using models (e.g. OpenAI text-embedding-3, Cohere, Hugging Face)",
      "Cosine Similarity, Euclidean Distance, and Dot Product metrics",
      "Vector Databases: Pinecone, Weaviate, Milvus, ChromaDB, and pgvector",
      "Indexing strategies: HNSW (Hierarchical Navigable Small World), IVF (Inverted File Indexing)"
    ]
  },
  {
    title: "Retrieval-Augmented Generation (RAG)",
    description: "Combine external search/retrieval systems with LLMs to ground generation in private domain data.",
    details: [
      "RAG pipeline: Document ingestion, chunking strategies, metadata tagging, and indexing",
      "Retrieval techniques: Keyword search (BM25), Semantic search, and Hybrid search",
      "Re-ranking retrieved context (Cohere Re-rank, Cross-encoders) to improve relevance",
      "Naïve RAG vs. Advanced RAG (Query translation, Sub-queries, Context compression)"
    ]
  },
  {
    title: "Autonomous AI Agents",
    description: "Build goal-oriented systems that plan, use tools, and collaborate to execute complex workflows.",
    details: [
      "Agent architectures: ReAct (Reasoning and Action) loops, Plan-and-Execute",
      "Tool calling: function calling, API integration, and execution sandboxes",
      "State management, long-term and short-term agent memory structures",
      "Multi-agent frameworks: Autogen, LangGraph, CrewAI"
    ]
  },
  {
    title: "Model Context Protocol (MCP)",
    description: "Learn Anthropic's open standard for connecting LLMs securely to external data sources and tools.",
    details: [
      "MCP architecture: Client, Server, and Host relations",
      "Exposing local databases, filesystems, and APIs as MCP tools",
      "Securing tool execution and transport (stdio, SSE transports)",
      "Integrating MCP servers with Cursor, Claude Desktop, and custom applications"
    ]
  }
];

export const interviewQuestions = [
  {
    question: "What is RAG?",
    answer: "Combining retrieval systems with language models."
  },
  {
    question: "What are embeddings?",
    answer: "Vector representations of data."
  }
];

export const pageData = {
  title: "AI",
  badge: "Artificial Intelligence",
  description:
    "Learn AI from Machine Learning fundamentals to Generative AI, LLMs, RAG Systems, AI Agents and Production AI Platforms.",
  stats: [
    { value: "15", label: "Learning Modules" },
    { value: "30+", label: "Interview Questions" },
    { value: "40+", label: "Core Concepts" },
    { value: "25+", label: "Real Projects" }
  ],
  roadmap,
  learnConcepts: [
    "Machine Learning",
    "Deep Learning",
    "Neural Networks",
    "Transformers",
    "LLMs",
    "Prompt Engineering",
    "Embeddings",
    "Vector Databases",
    "RAG",
    "AI Agents",
    "Fine Tuning",
    "MLOps"
  ],
  additionalGrids: [
    {
      title: "Modern AI Stack",
      items: [
        "OpenAI",
        "Claude",
        "Gemini",
        "Llama",
        "LangChain",
        "LlamaIndex",
        "Pinecone",
        "Weaviate",
        "ChromaDB",
        "Ollama",
        "vLLM",
        "LangGraph"
      ]
    },
    {
      title: "Projects You will Build",
      items: [
        "AI Chatbot",
        "RAG System",
        "Document Search",
        "AI Code Assistant",
        "Resume Analyzer",
        "AI Agent",
        "Knowledge Base",
        "Multi-Agent Workflow",
        "Vector Search Engine",
        "LLM Gateway",
        "AI SaaS",
        "MLOps Pipeline"
      ]
    }
  ],
  topics,
  interviewQuestions,
  resources: [
    "OpenAI Docs",
    "Anthropic Docs",
    "Hugging Face",
    "LangChain",
    "LlamaIndex",
    "DeepLearning.AI",
    "FastAI",
    "Papers With Code",
    "ArXiv",
    "Ollama",
    "vLLM",
    "Weights & Biases"
  ],
  ctaTitle: "Become Production Ready with AI",
  ctaDescription:
    "Explore LLMs, RAG, Agents, Fine-Tuning, MLOps and real-world AI architectures."
};