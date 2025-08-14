# DSDCohortJuly2025

<img width="598" height="478" alt="image" src="https://github.com/user-attachments/assets/d53f526c-e845-49ba-8ed4-ba4b9aa43eb7" />

Welcome to the official repository for the **"Dallas Software Developers Cohort – July 2025 | team-aaryan-and-yoon"**. This project is a collaborative full-stack web application built by cohort members to demonstrate backend and frontend integration, containerized workflows, and modern development practices.

The goal of this application is to **connect people with service providers** in their local area. It’s an all-in-one solution that allows users to request services from verified providers in three categories:

- Cleaning
- Gardening
- Handyman Work

---

## Tech Stack

- **Backend**: Python, Django, DRF
- **Frontend**: React, HTML, CSS
- **Database**: Supabase
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git & GitHub

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/team-aaryan-and-yoon/DSDCohortJuly2025.git
cd DSDCohortJuly2025
```

## 2. Prepare your environment

- Before bringing up the containers, make sure you have docker, docker-compose, and python installed in your local environmnet.
- You will also need set .env files for the backend (/api) and the frontend (/web) directories.

```
backend example:

DATABASE_URL=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
POOL_MODE=
DB_PASSWORD=

SECRET_KEY=
DEBUG=true

STRIPE_API_SECRET=
STRIPE_API_PUBLIC=

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
SUPABASE_JWT_SECRET=
```
```
Frontend example:

VITE_API_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Contact Aaryan for details ¯\\(ツ)/¯

## 3. Start the Application
```bash
docker-compose up --build
```

This will launch both the backend and frontend services in isolated containers.





## Project Goals
- Practice full-stack development in a team setting
- Learn containerized workflows with Docker
- Implement RESTful APIs and frontend integration
- Collaborate using GitHub and agile methodologies
- Build a real-world service platform for local providers
- Manage tasks and sprints using Jira for project trackin


