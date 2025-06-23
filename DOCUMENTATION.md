EduMatrix – Full Stack Internship Project Documentation

#Overview
EduMatrix is a full-stack course management system I developed as part of my internship assignment. The system handles creating courses, assigning prerequisites, managing course instances (semester-wise offerings), and preventing invalid deletions (like deleting a course that’s still needed as a prerequisite).

The goal was to build:

A Java Spring Boot backend (REST API)

A React + TypeScript + Tailwind frontend (neubrutalist theme)

Dockerized containers for both

DockerHub image deployment

GitHub Actions CI/CD for automated image creation

A docker-compose.yml to bring it all together

This doc covers what I built, why I built it that way, what broke (a lot), and how I fixed it.

#Tech Stack
Frontend: React + TypeScript + Tailwind CSS

Backend: Java 17 + Spring Boot + H2 in-memory DB

DevOps: Docker, DockerHub, GitHub Actions, Docker Compose

#Project Structure
bash
Copy
Edit
project/
├── backend/               # SpringBoot
│   ├── src/main/java
│   └── Dockerfile
├── frontend/              # React
│   ├── src/
│   └── Dockerfile
├── docker-compose.yml     # pulls from DockerHub
I kept both apps in the same root folder (project) to simplify docker-compose setup.

Backend Development
What it does:
Create courses with ID, title, description

Add prerequisites (with validation)

Add course instances (by year & semester)

Protect against deletion if a course is a prerequisite

H2 DB for storage

RESTful endpoints under /api/courses and /api/instances

Struggles:
Keyword error: Spring Data JPA exploded because I used year as a field — apparently a reserved SQL keyword. I had to rename it to acadyear in the entity but still use getYear() as a getter for consistency.

Join queries failing: Took forever to realize Hibernate can’t deal with year unless properly mapped.

Autowire failures: Forgot to rename all instances of findByYearAndSemester() to match the entity's renamed field. Refactored everything consistently and it finally booted.

Key Decisions:
Chose H2 for fast testing and containerization simplicity

Added custom exception handlers to throw clean error messages

Used DTOs to avoid exposing the whole entity structure

Frontend Development
What it does:
Form to create new courses

Form to create course instances

Auto-validation for inputs

Multi-select for prerequisites

Preview pane before submission

List view for courses and instances

Deletes with dependency protection

Clean loading, success, and error toasts

Design Philosophy:
I went with neubrutalism:

Black outlines

No border radius

Loud box shadows

Inter font

Flat design — no gradients or glassmorphism nonsense

Challenges:
Form bugs: State would randomly not update because of async validation — had to debounce input and validate on submit instead.

Styling: Tailwind is fast, but maintaining spacing logic between responsive classes gets messy.

Toast messages: Tried to centralize them to reduce code duplication, made a Toast component for consistent messages across pages.

Docker Setup
Backend Dockerfile
Dockerfile
Copy
Edit
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
Frontend Dockerfile
Dockerfile
Copy
Edit
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
RUN npm install -g serve
CMD ["serve", "-s", "dist"]
DockerHub
Created an account: adhirak

Built images:

adhirak/backend

adhirak/frontend

Pushed both via terminal

Faced login auth errors initially — turns out I needed to re-authenticate with web-based login. Fixed.

GitHub Actions
Created .github/workflows/docker-backend.yml and docker-frontend.yml

Added DOCKERHUB_USERNAME and DOCKERHUB_TOKEN to repo secrets

These automate Docker image building on push to main

yaml
Copy
Edit
# backend GitHub Actions workflow
jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK
        uses: actions/setup-java@v3
        with:
          java-version: '17'
      - name: Build Jar
        run: ./mvnw clean package -DskipTests
      - name: Docker login
        run: echo "${{ secrets.DOCKERHUB_TOKEN }}" | docker login -u "${{ secrets.DOCKERHUB_USERNAME }}" --password-stdin
      - name: Build & Push
        run: docker build -t adhirak/backend . && docker push adhirak/backend

Docker Compose

How it works:
Run docker-compose up and it:

Pulls both images from DockerHub

Starts backend on localhost:8080

Starts frontend on localhost:5173

Backend auto-creates schema on boot (H2 in-memory)

Testing
Ran docker-compose up

Hit http://localhost:5173 in browser

Created courses, added instances, deleted them — everything worked

Confirmed app behavior for:

Validations

Conflict errors

404 responses

Dependency rejections

All clean.

Final Thoughts
This assignment was NOT easy. A lot of stuff broke in weird ways (JPA query failures, build errors, Docker auth issues), but I got through all of it.

Things that helped:

StackOverflow (a lot)

IntelliJ auto-complete

Reading actual Spring logs instead of rage quitting

I think this project reflects solid fundamentals — full-stack understanding, error handling, deployment, CI/CD, Docker — all done manually without copy-pasting some boilerplate. It’s also cleanly structured enough for a real team to build on.

