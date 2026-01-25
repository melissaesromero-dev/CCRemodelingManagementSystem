# CCRemodeling-SWE_Capstone_Project

CCRemodeling is a full-stack web application designed for a remodeling contractor business.  
It includes a public customer-facing site () for submitting service requests and a **secure admin dashboard** for managing customers, requests, estimate appointments, and quotes.

This project was developed as a software engineering capstone and deployed using a modern cloud-based architecture.

---

## Live Demo

- Public Site: https://tinyurl.com/CCRemodeling-public
- Admin Dashboard: https://tinyurl.com/CCRemodeling-admin

### Demo Admin Login
Email: admin1@example.com  
Password: Pa$$w0rd1  

> Demo credentials are provided for evaluation and portfolio review purposes only.

---

## Key Features

### Public Site
- Submit service requests without authentication
- Dynamic lookup data (states, budget ranges, contact methods)
- Client-side and server-side validation
- Clean, responsive UI

### Admin Dashboard
- Secure authentication and role-based access
- Manage customers, service requests, estimate appointments, and quotes
- Sample data toggle for testing and demonstrations (New data entered will not be deleted with the sample data toggle)
- Full CRUD operations with validation
- Responsive layout optimized for desktop and tablet

### Backend API
- CQRS pattern using MediatR
- Centralized validation and business rules
- Clean separation of concerns
- Seeded demo data for evaluator testing

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Bootstrap with SCSS
- Material UI (Admin Dashboard)
- React Hook Form
- Zod
- TanStack Query

### Backend
- .NET 9 Web API
- C#
- MediatR (CQRS)
- Entity Framework Core

### Database
- SQLite (development and demo)
- EF Core migrations and seeding

### Cloud & Hosting
- AWS Elastic Beanstalk (API)
- Amazon S3 (static frontend hosting)
- Amazon CloudFront (HTTPS distribution)
- Environment-based configuration

---

## Running the Application Locally

### Prerequisites
- .NET 9 SDK
- Node.js (LTS)
- npm

---

### Run the API
```bash
cd CCRemodelAdmin/API
dotnet restore
dotnet run

### Run the Admin Dashboard
cd CCRemodelAdmin/ClientApps/admin
npm install
npm run dev

Environment variables are required for local and production execution.
.env files are intentionally excluded from this repository.

###Architecture Overview

The application follows a layered architecture with:

Separation between UI, API, and persistence layers
CQRS for scalability and maintainability
Centralized validation and lookup logic
Cloud-ready deployment model

###Author

Melissa Romero
Software Engineering Capstone Project
