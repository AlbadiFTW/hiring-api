# 🚀 Hiring API

A production-ready RESTful API for managing job postings and applications. Built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## 🌐 Live Demo

- **API Base URL:** https://hiring-api-jp8x.onrender.com
- **Interactive Docs:** https://hiring-api-jp8x.onrender.com/api-docs
- **Health Check:** https://hiring-api-jp8x.onrender.com/health

> 💡 Try out the API endpoints directly in the interactive Swagger documentation!

## ✨ Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (Candidate/Employer)
- **Job Management**: Full CRUD operations for job postings
- **Application System**: Apply to jobs, track applications, and update statuses
- **Advanced Search & Filtering**: Search jobs by title, company, type, and location
- **Pagination**: Efficient data retrieval with page and limit query parameters
- **Rate Limiting**: Protection against abuse with configurable rate limits
- **Input Validation**: Comprehensive validation using Zod
- **Global Error Handling**: Centralized error handling middleware
- **API Documentation**: Interactive Swagger UI documentation
- **Type Safety**: Full TypeScript implementation
- **Security**: Bcrypt password hashing, JWT tokens, CORS enabled

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Password Hashing**: Bcryptjs
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Rate Limiting**: express-rate-limit
- **Development**: Nodemon, ts-node

## 📁 Project Structure

```
hiring-api/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controllers/           # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── jobs.controller.ts
│   │   └── applications.controller.ts
│   ├── middleware/            # Custom middleware
│   │   ├── auth.ts           # JWT authentication
│   │   └── errorHandler.ts  # Global error handler
│   ├── routes/               # API routes
│   │   ├── auth.routes.ts
│   │   ├── jobs.routes.ts
│   │   └── applications.routes.ts
│   ├── lib/                  # Utility libraries
│   │   ├── prisma.ts        # Prisma client instance
│   │   ├── jwt.ts           # JWT utilities
│   │   └── swagger.ts       # Swagger configuration
│   └── index.ts             # Application entry point
├── .env                      # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **PostgreSQL**: v14 or higher
- **npm** or **yarn**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hiring-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hiring_db?schema=public"

# JWT Secret (use a strong random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important**: Never commit your `.env` file to version control!

### 4. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

### 5. Run the Application

**Development Mode** (with hot reload):
```bash
npm run dev
```

**Production Build**:
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

Once the server is running, access the interactive Swagger documentation at:

```
http://localhost:5000/api-docs
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login and get JWT token | ❌ |

### Jobs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/jobs` | Get all jobs (with pagination) | ❌ |
| GET | `/api/jobs/:id` | Get job by ID | ✅ |
| POST | `/api/jobs` | Create a new job (employers only) | ✅ |
| PATCH | `/api/jobs/:id` | Update a job | ✅ |
| DELETE | `/api/jobs/:id` | Delete a job | ✅ |

### Applications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/applications/:jobId` | Apply to a job | ✅ |
| GET | `/api/applications/my` | Get user's applications | ✅ |
| PATCH | `/api/applications/:id/status` | Update application status | ✅ |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Check API health status | ❌ |

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### Example: Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "employer"
  }'
```

### Example: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

### Example: Create a Job (with authentication)

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "Senior Backend Developer",
    "company": "Tech Corp",
    "location": "New York, NY",
    "type": "Full-time",
    "salary": "$120k - $150k",
    "description": "We are looking for an experienced backend developer..."
  }'
```

## 📄 Pagination

The `GET /api/jobs` endpoint supports pagination:

```bash
GET /api/jobs?page=1&limit=10
```

**Query Parameters**:
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `search` - Search in title and company
- `type` - Filter by job type (Full-time, Part-time, Contract, Remote)
- `location` - Filter by location

**Response Format**:
```json
{
  "jobs": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

## 🔍 Search & Filtering

```bash
# Search by keyword
GET /api/jobs?search=developer

# Filter by type
GET /api/jobs?type=Remote

# Filter by location
GET /api/jobs?location=New York

# Combine filters
GET /api/jobs?search=backend&type=Full-time&location=Remote&page=1&limit=20
```

## ⚠️ Error Handling

The API uses a global error handler that returns consistent error responses:

```json
{
  "error": "Error message",
  "issues": [...] // For validation errors (Zod)
}
```

**HTTP Status Codes**:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🛡️ Rate Limiting

API requests are limited to:
- **100 requests per 15 minutes** per IP address

When rate limit is exceeded, the API returns:
```json
{
  "error": "Too many requests, please try again later."
}
```

## 🗄️ Database Schema

### User
- `id`: String (CUID)
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `role`: String (candidate/employer)
- `createdAt`: DateTime

### Job
- `id`: String (CUID)
- `title`: String
- `company`: String
- `location`: String
- `type`: String
- `salary`: String (optional)
- `description`: String
- `userId`: String (foreign key)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Application
- `id`: String (CUID)
- `status`: String (Pending/Reviewed/Interview/Rejected/Accepted)
- `coverNote`: String (optional)
- `userId`: String (foreign key)
- `jobId`: String (foreign key)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## 🚢 Deployment

### Option 1: Render (Recommended for beginners)
1. Push your code to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Connect your repository
4. Add environment variables
5. Deploy!

### Option 2: Railway
1. Push code to GitHub
2. Import project on [Railway](https://railway.app)
3. Add PostgreSQL database
4. Set environment variables
5. Deploy automatically

### Option 3: Fly.io
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Launch: `fly launch`
4. Deploy: `fly deploy`

### Environment Variables for Production

Ensure these are set in your deployment platform:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong random secret
- `NODE_ENV=production`
- `PORT` (usually auto-configured)

## 🧪 Testing the API

Use tools like:
- **Swagger UI**: Built-in at `/api-docs`
- **Postman**: Import the API collection
- **cURL**: Command-line testing
- **Thunder Client**: VS Code extension
- **Insomnia**: API client

## 📝 Scripts

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate Prisma Client
npm run prisma:generate

# Run Prisma Studio (database GUI)
npx prisma studio

# Create a new migration
npx prisma migrate dev --name <migration-name>

# Reset database
npx prisma migrate reset
```


## 📜 License

ISC

---

**Built with  using Node.js, TypeScript, and PostgreSQL**

For issues or questions, please open an issue on GitHub.
