"""
Complete API Documentation

Base URL: http://localhost:8000

## Authentication
Currently no authentication is implemented. Add JWT/OAuth in production.

## Response Format
All responses are in JSON format.

### Error Response
```json
{
  "detail": "Error message"
}
```

---

## PROJECTS ENDPOINTS

### 1. Create Project (Intake Form)
POST /projects/

**Request:**
```json
{
  "client_name": "string",
  "location": "string",
  "contact_number": "string",
  "total_budget": number,
  "status": "Pending|In Progress|Review|Delivered"
}
```

**Response:** 201 Created
```json
{
  "id": number,
  "client_name": "string",
  "location": "string",
  "contact_number": "string",
  "total_budget": number,
  "status": "string",
  "events": [],
  "deliverables": [],
  "payments": []
}
```

### 2. List All Projects
GET /projects/

**Query Parameters:**
- skip: number (default: 0)
- limit: number (default: 100)

**Response:** 200 OK
```json
[
  {
    "id": number,
    "client_name": "string",
    "location": "string",
    "contact_number": "string",
    "total_budget": number,
    "status": "string",
    "events": [...],
    "deliverables": [...],
    "payments": [...]
  }
]
```

### 3. Get Project Details
GET /projects/{project_id}

**Response:** 200 OK
```json
{
  "id": number,
  "client_name": "string",
  "location": "string",
  "contact_number": "string",
  "total_budget": number,
  "status": "string",
  "events": [...],
  "deliverables": [...],
  "payments": [...]
}
```

### 4. Get Dashboard Summary
GET /projects/dashboard/summary

**Response:** 200 OK
```json
{
  "total_projects": number,
  "active_projects": number,
  "total_revenue": number,
  "pending_payments": number,
  "completed_deliverables": number
}
```

---

## WORKER ENDPOINTS

### 1. Create Task Assignment
POST /worker/tasks

**Request:**
```json
{
  "worker_id": number,
  "project_id": number,
  "task_description": "string",
  "status": "Pending|In Progress|Review|Delivered"
}
```

**Response:** 201 Created
```json
{
  "id": number,
  "worker_id": number,
  "project_id": number,
  "task_description": "string",
  "status": "string"
}
```

### 2. Get Worker Tasks
GET /worker/tasks/{worker_id}

**Response:** 200 OK
```json
[
  {
    "id": number,
    "worker_id": number,
    "project_id": number,
    "task_description": "string",
    "status": "string"
  }
]
```

### 3. Update Task Status
PATCH /worker/tasks/{task_id}

**Request:**
```json
{
  "status": "Pending|In Progress|Review|Delivered"
}
```

**Response:** 200 OK
```json
{
  "id": number,
  "worker_id": number,
  "project_id": number,
  "task_description": "string",
  "status": "string"
}
```

---

## PAYMENT ENDPOINTS

### 1. Create Payment Record
POST /payments/

**Request:**
```json
{
  "project_id": number,
  "milestone": "string",
  "amount": number,
  "is_paid": boolean
}
```

**Response:** 201 Created
```json
{
  "id": number,
  "project_id": number,
  "milestone": "string",
  "amount": number,
  "is_paid": boolean
}
```

### 2. Get Payment Details
GET /payments/{payment_id}

**Response:** 200 OK
```json
{
  "id": number,
  "project_id": number,
  "milestone": "string",
  "amount": number,
  "is_paid": boolean
}
```

### 3. Update Payment Status
PATCH /payments/{payment_id}

**Request:**
```json
{
  "is_paid": boolean
}
```

**Response:** 200 OK
```json
{
  "id": number,
  "project_id": number,
  "milestone": "string",
  "amount": number,
  "is_paid": boolean
}
```

---

## USER ENDPOINTS

### 1. Create User
POST /users/

**Request:**
```json
{
  "name": "string",
  "contact": "string",
  "role": "Admin|Shooter|Editor"
}
```

**Response:** 201 Created
```json
{
  "id": number,
  "name": "string",
  "contact": "string",
  "role": "string"
}
```

### 2. List All Users
GET /users/

**Response:** 200 OK
```json
[
  {
    "id": number,
    "name": "string",
    "contact": "string",
    "role": "string"
  }
]
```

### 3. Get User Details
GET /users/{user_id}

**Response:** 200 OK
```json
{
  "id": number,
  "name": "string",
  "contact": "string",
  "role": "string"
}
```

---

## HEALTH CHECK

### Health Status
GET /health

**Response:** 200 OK
```json
{
  "status": "healthy"
}
```

---

## Common HTTP Status Codes

- 200 OK - Request successful
- 201 Created - Resource created successfully
- 400 Bad Request - Invalid request data
- 404 Not Found - Resource not found
- 500 Internal Server Error - Server error

## Example cURL Requests

### Create a Project
```bash
curl -X POST "http://localhost:8000/projects/" \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_name": "Sharma Wedding",
    "location": "Delhi",
    "contact_number": "9999999999",
    "total_budget": 500000,
    "status": "Pending"
  }'
```

### Get Dashboard Summary
```bash
curl "http://localhost:8000/projects/dashboard/summary"
```

### Get Worker Tasks
```bash
curl "http://localhost:8000/worker/tasks/1"
```

### Update Payment Status
```bash
curl -X PATCH "http://localhost:8000/payments/1" \\
  -H "Content-Type: application/json" \\
  -d '{"is_paid": true}'
```

"""

# Save this file as API_DOCUMENTATION.md in the root directory
