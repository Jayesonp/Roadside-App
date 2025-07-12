# Task Management API

A secure and scalable RESTful API for task management built with Node.js, Express, and Supabase.

## 🚀 Features

- **RESTful API Design** - Clean, intuitive endpoints following REST principles
- **JWT Authentication** - Secure token-based authentication and authorization
- **Role-based Access Control** - User and admin roles with appropriate permissions
- **Data Validation** - Comprehensive input validation and sanitization
- **Security Best Practices** - Rate limiting, CORS, helmet, and more
- **Database Integration** - PostgreSQL with Supabase for scalability
- **API Documentation** - Interactive Swagger/OpenAPI documentation
- **Error Handling** - Consistent error responses and logging
- **Testing Suite** - Comprehensive unit and integration tests
- **Environment Configuration** - Flexible configuration management

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile
- `POST /api/v1/auth/logout` - Logout user

### Tasks
- `POST /api/v1/tasks` - Create a new task
- `GET /api/v1/tasks` - Get all tasks (with pagination and filtering)
- `GET /api/v1/tasks/:id` - Get a specific task
- `PUT /api/v1/tasks/:id` - Update a task
- `DELETE /api/v1/tasks/:id` - Delete a task
- `GET /api/v1/tasks/stats` - Get task statistics

### System
- `GET /api/v1/health` - Health check endpoint
- `GET /api-docs` - API documentation

## 🛠 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest
- **Logging**: Winston
- **Environment**: dotenv

## 🏗 Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- email (Text, Unique, Not Null)
- password_hash (Text, Not Null)
- first_name (Text, Not Null)
- last_name (Text, Not Null)
- role (Text, Default: 'user')
- is_active (Boolean, Default: true)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Tasks Table
```sql
- id (UUID, Primary Key)
- title (Text, Not Null)
- description (Text)
- status (Text, Default: 'pending')
- priority (Text, Default: 'medium')
- due_date (Timestamp)
- tags (Text Array)
- user_id (UUID, Foreign Key)
- created_at (Timestamp)
- updated_at (Timestamp)
```

## 🔐 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure token-based authentication
- **Rate Limiting** - Prevent abuse and DDoS attacks
- **Input Validation** - Comprehensive data validation
- **SQL Injection Protection** - Parameterized queries
- **CORS Configuration** - Cross-origin resource sharing
- **Security Headers** - Helmet.js for security headers
- **Row Level Security** - Database-level access control

## 📊 Error Handling

The API uses a consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "data": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🧪 Testing

The API includes comprehensive tests covering:
- Authentication endpoints
- Task management endpoints
- Input validation
- Error handling
- Security features

Run tests with:
```bash
npm test
npm run test:watch
```

## 📈 Monitoring and Logging

- **Winston Logger** - Structured logging with multiple transports
- **Request Logging** - Morgan middleware for HTTP request logging
- **Error Tracking** - Comprehensive error logging and monitoring
- **Health Checks** - System health monitoring endpoint

## 🚀 Deployment Considerations

### Environment Variables
Ensure all required environment variables are set:
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `SUPABASE_URL` - Database connection URL
- `SUPABASE_SERVICE_ROLE_KEY` - Database service key
- `JWT_SECRET` - JWT signing secret

### Production Optimizations
- Enable compression middleware
- Set up proper logging levels
- Configure rate limiting
- Set up monitoring and alerting
- Use HTTPS in production
- Set up database connection pooling
- Configure proper CORS origins

### Scaling Considerations
- Horizontal scaling with load balancers
- Database read replicas for read-heavy workloads
- Redis for session storage and caching
- CDN for static assets
- Container orchestration (Docker/Kubernetes)

## 📚 API Documentation

Interactive API documentation is available at `/api-docs` when the server is running. The documentation includes:
- Endpoint descriptions
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Error codes and descriptions

## 🔧 Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure
4. Set up Supabase database and run migrations
5. Start development server: `npm run dev`
6. Access API documentation: `http://localhost:3000/api-docs`

## 📝 API Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Create a task
```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete project",
    "description": "Finish the API implementation",
    "priority": "high",
    "dueDate": "2024-12-31T23:59:59Z",
    "tags": ["work", "urgent"]
  }'
```

This API provides a solid foundation for building scalable task management applications with enterprise-grade security and performance considerations.