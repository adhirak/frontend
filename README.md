# EduMatrix Frontend – React + TypeScript + TailwindCSS

EduMatrix is a modern web application that lets users create, manage, and visualize university courses with dependencies and scheduled instances across semesters. This repository contains the **React-based frontend** of the project.

---

## 🌐 Live Frontend Setup (via Docker)

- **Frontend DockerHub Image**: [`adhirak/frontend`](https://hub.docker.com/r/adhirak/frontend)
- **Backend GitHub Repo**: [adhirak/backend](https://github.com/adhirak/backend)
- **Backend Docker Image**: [`adhirak/backend`](https://hub.docker.com/r/adhirak/backend)

---

## 🛠️ Tech Stack

- **React** (with hooks and functional components)
- **TypeScript** for type-safe development
- **Tailwind CSS** for styling with a neubrutalistic design theme
- **React Router** for navigation
- **Axios** (optional) or fetch for API calls
- **Docker** for deployment

---

## 🐳 Docker Integration

This project is fully containerized. The `Dockerfile` inside this repo builds and serves the frontend app using Vite.

### 📁 Folder Overview

project/
├── frontend/ # This repo
│ ├── Dockerfile # Used to containerize the app
│ └── src/ # All React app source code
├── backend/ # Spring Boot backend (separate repo)
└── docker-compose.yaml # Docker orchestration file (in backend repo)


### Docker Build & Push

# Build the image
docker build -t adhirak/frontend .

# Push to DockerHub
docker push adhirak/frontend

## Docker Compose Setup
The docker-compose.yaml file (included in the backend repo) pulls the images for both frontend and backend.

To run both together:
docker-compose up
Then visit: http://localhost:5173

## Features
Course Management: Create, delete, view all courses with validation.

Prerequisite Logic: Shows if a course depends on another.

Course Instances: Schedule when courses are offered by year/semester.

Error Handling: Toast system for validation messages.

Dynamic Routing: URL updates with course and instance details.

Neubrutalistic UI: Bold borders, sharp edges, and high contrast UI.

# Project Structure
bash
Copy
Edit
src/
├── components/      # Reusable UI (Button, Card, Input, etc.)
├── pages/           # Home, Courses, CreateCourse, Instances, etc.
├── services/        # API calls
├── types/           # TypeScript interfaces
├── index.css        # Tailwind base styles
└── main.tsx         # Entry point
🧪 Local Development
If not using Docker:

npm install
npm run dev
