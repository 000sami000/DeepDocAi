# RAG PDF Chatbot

## Overview

This project is a **Retrieval-Augmented Generation (RAG) chatbot** that allows users to upload PDF documents and interact with them through a conversational interface. The system extracts text from uploaded PDFs, converts it into embeddings, stores them in a vector database, and uses semantic search to provide context-aware answers based strictly on the uploaded documents.

The chatbot uses a combination of large language models and vector search to ensure responses are grounded in user-provided data rather than general knowledge.

---

## Features

- Upload and manage multiple PDF documents
- Automatic text extraction and chunking from PDFs
- Semantic search over document content using embeddings
- Context-aware question answering using RAG architecture
- Real-time chat interface for querying documents
- Background processing for PDF ingestion using job queues
- Secure authentication system
- Scalable backend architecture with separation of concerns

---

## Tech Stack

### Frontend
- Next.js (React framework)
- Clerk Authentication
- REST API communication with backend

### Backend
- Node.js
- Express.js
- Google Gemini API (LLM + Embeddings)
- BullMQ for asynchronous job processing
- Redis for queue management
- PostgreSQL for relational data storage
- Qdrant as vector database for embeddings

### Infrastructure
- PostgreSQL for storing users, documents, and metadata
- Qdrant for storing and querying vector embeddings
- Redis for managing background job queues

---

## System Architecture

1. User uploads a PDF file from the frontend.
2. Backend receives the file and stores metadata in PostgreSQL.
3. A background job is created using BullMQ.
4. Worker service extracts text from the PDF.
5. Text is split into smaller chunks for better retrieval.
6. Each chunk is converted into embeddings using the Gemini Embedding Model.
7. Embeddings are stored in Qdrant vector database.
8. When a user asks a question:
   - Query is converted into embedding
   - Similar chunks are retrieved from Qdrant
   - Relevant context is sent to Gemini LLM
   - Model generates a response based only on retrieved context

---

# ⚙️ Environment Variables

This project uses separate environment configurations for **Backend** and **Frontend**.

---

## 🖥️ Backend Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=8000

GEMINI_API_KEY=
MODEL_ID=gemini-3.1-flash-lite-preview
EMBEDDING_MODEL_ID=gemini-embedding-001

BULL_MQ_REDIS_HOST=localhost
BULL_MQ_REDIS_PORT=6379

QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION_NAME=pdf_chunks

DB_HOST=
DB_PORT=
DB_USER=pguser
DB_PASSWORD=
DB_NAME=

CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
