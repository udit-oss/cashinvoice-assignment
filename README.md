# Student Management System

Full-stack application for managing student records with role-based access control and JWT authentication.

---

## Overview

A complete student management system where administrators can perform CRUD operations on student records, while regular users have read-only access. Features server-side search, client-side pagination, and comprehensive input validation.

**Key Features:**
- JWT-based authentication with bcrypt password hashing
- Role-based access control (Admin vs User)
- Server-side search with debouncing
- Client-side pagination
- Type-safe development with TypeScript

---

## Tech Stack

**Frontend:** React 18, TypeScript, React Router v6, Axios, Context API, CSS3  
**Backend:** Node.js, Express, TypeScript, PostgreSQL, JWT, bcrypt, Joi, pg

---

## Project Structure
```
CASHINVOICE-ASSIGNMENT/
├── ca-backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   └── validations/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── enums/
│   │   ├── types/
│   │   ├── utils/
│   │   └── app.ts
│   └── scripts/
│       ├── schema.sql
│       └── seed.sql
│
└── ca-frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   ├── contexts/
    │   ├── styles/
    │   ├── types/
    │   ├── utils/
    │   ├── App.tsx
    │   └── index.tsx
    └── public/
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- npm

### Database Setup

1. **Create database:**
```sql
   CREATE DATABASE cashinvoice_db;
```

2. **Run schema:** Execute `ca-backend/scripts/schema.sql` in pgAdmin

3. **Run seed data:** Execute `ca-backend/scripts/seed.sql` in pgAdmin

### Backend Setup
```bash
cd ca-backend
npm install
```

**Create `.env` file:**
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cashinvoice_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_generated_secret
```

**Generate JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
```

**Start server:**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup
```bash
cd ca-frontend
npm install
```

**Create `.env` file:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Start app:**
```bash
npm start
```

Application opens at `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/students` | Get all students | Auth Required |
| GET | `/api/students/search?term=john` | Search students | Auth Required |
| GET | `/api/students/:id` | Get student by ID | Auth Required |
| POST | `/api/students` | Create student | Admin Only |
| PUT | `/api/students/:id` | Update student | Admin Only |
| DELETE | `/api/students/:id` | Delete student | Admin Only |

**All protected routes require:** `Authorization: Bearer <token>`

**Example Request:**
```bash
POST /api/students
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 20,
  "course": "React",
  "status": "Active"
}
```

---

## Database Schema

**Users Table:**
```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Students Table:**
```sql
CREATE TABLE students (
  student_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INTEGER,
  course VARCHAR(20) NOT NULL CHECK (course IN ('React', 'Node', 'Java', 'Python')),
  status VARCHAR(10) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_by INTEGER REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Test Credentials

**Admin (Full Access):**
- Email: `admin@cashinvoice.com`
- Password: `admin123`
- Permissions: Create, Read, Update, Delete

**User (Read-Only):**
- Email: `user@cashinvoice.com`
- Password: `admin123`
- Permissions: Read only

---

## Architecture

**Backend - Layered Architecture:**
```
Routes → Controllers → Validations → Services → Repositories → Database
```

- **Routes:** API endpoint definitions with middleware
- **Controllers:** HTTP request/response handling
- **Validations:** Joi schema validation
- **Services:** Business logic layer
- **Repositories:** Database query execution
- **Database:** PostgreSQL with connection pooling

**Frontend - Component Architecture:**
```
App → AuthProvider → Router → Protected Routes → Components
```

- **Context API:** Global authentication state
- **React Hooks:** useState, useEffect, useContext
- **Axios Interceptors:** Automatic JWT token injection
- **Debouncing:** 500ms delay for search optimization

**Security:**
- JWT tokens (24h expiration, HS256 algorithm)
- bcrypt password hashing (10 salt rounds)
- Role-based middleware (authMiddleware + checkRole)
- Parameterized SQL queries (prevent injection)
- Input validation (Joi schemas on backend, HTML5 on frontend)

---

## Author

**Udit Singh**  
Software Engineer

- GitHub: [@udit-oss](https://github.com/udit-oss)
- LinkedIn: [uditsingh-official](https://www.linkedin.com/in/udit-singh-43862b187/)
- Portfolio: [uditsingh.vercel.app](https://portfolio-teal-beta-nyalsynphd.vercel.app/)
- Email: udit9503@gmail.com

---

**Built with React, Node.js, PostgreSQL, and TypeScript**