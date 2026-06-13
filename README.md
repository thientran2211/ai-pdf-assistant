<div align="center">

# 📚 AI PDF Assistant

### Your Intelligent Document Learning Companion

[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-pdf-assistant-ten.vercel.app)
[![Backend on Render](https://img.shields.io/badge/Backend-Render-46E3B0?style=for-the-badge&logo=render&logoColor=white)](https://ai-pdf-assistant-xmnf.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

[Live Demo](https://ai-pdf-assistant-ten.vercel.app) • [Features](#-features) • [Tech Stack](#️-tech-stack) • [Installation](#-installation)

</div>

---

## 📖 Overview

**AI PDF Assistant** is a full-stack web application that transforms static PDF documents into interactive learning experiences. Powered by dual AI engines (Google Gemini & Groq Llama 3), it enables users to chat with documents, generate flashcards, create quizzes, and receive intelligent summaries — all in both Vietnamese and English.

The system supports three user roles (Admin, User, Guest) and features an intelligent AI orchestration layer that automatically selects the optimal model for each task.

---

## ✨ Features

### 🤖 AI-Powered Capabilities
- **💬 Smart Chat** — Ask questions about your PDF and get contextual answers
- **📝 Auto Summary** — Generate concise, structured summaries of long documents
- **🎴 Flashcard Generation** — Create study flashcards with difficulty levels (easy/medium/hard)
- **📋 Quiz Builder** — Generate multiple-choice quizzes based on Barrett's Taxonomy (Literal, Inferential, Evaluative)
- **💡 Concept Explanation** — Get detailed explanations of specific concepts from the document

### 🎨 User Experience
- **🌐 Bilingual Support** — Full Vietnamese & English interface with i18next
- **👤 Guest Mode** — Try all features without registration (with session management)
- **📱 Responsive Design** — Optimized for desktop, tablet, and mobile
- **🎭 Modern UI** — Glassmorphism design with TailwindCSS

### 🔐 User Management
- **👑 Admin Dashboard** — User management, statistics, quota control
- **🚫 Block/Delete Users** — Full control over user accounts with cascade deletion
- **📊 API Quota System** — Daily limits with automatic reset
- **🔑 JWT Authentication** — Secure token-based auth with role-based access

### 🏗️ Architecture Highlights
- **🤖 Multi-AI Orchestration** — Automatic model selection with fallback mechanism
- **🗄️ Cascade Delete** — Clean data removal across all related entities
- **💾 Persistent Chat History** — Conversations saved and restored across sessions
- **🐳 Docker Support** — Easy deployment with docker-compose

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **TailwindCSS** | Utility-first styling |
| **React Router** | Client-side routing |
| **i18next** | Internationalization (VI/EN) |
| **Axios** | HTTP client |
| **Lucide React** | Icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js 20** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Authentication |
| **Multer** | File upload handling |
| **pdf-parse** | PDF text extraction |
| **bcryptjs** | Password hashing |

### AI Services
| Service | Models | Use Cases |
|---------|--------|-----------|
| **Google Gemini** | gemini-2.5-flash-lite | Summaries, Flashcards (large context) |
| **Groq** | llama-3.3-70b-versatile | Chat, Quiz, Explanations (fast response) |

### Deployment
- **Frontend**: [Vercel](https://vercel.com) — Auto-deploy on push
- **Backend**: [Render](https://render.com) — Docker container deployment
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — Cloud-hosted MongoDB

---

## 🚀 Installation

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas connection string)
- API keys for Gemini and Groq

### 1. Clone the Repository

```bash
git clone https://github.com/thientran2211/ai-pdf-assistant.git
cd ai-pdf-assistant
