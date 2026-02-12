# Student Management API - Quick Start Guide

## 🚀 Quick Start

### 1. Start the Server
```powershell
cd C:\Users\pck00\Documents\MachineTest
npm start
```

Server will start on: **http://localhost:8000**

### 2. Test the API

**Option A: Use Postman**
1. Import `postman_collection.json` into Postman
2. Collection includes 9 pre-configured requests
3. Base URL automatically set to `http://localhost:8000`

**Option B: Run Automated Tests**
```powershell
.\test-api.ps1
```

---

## 📡 API Endpoints

**Base URL:** `http://localhost:8000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Database health check |
| POST | `/api/students` | Create new student |
| GET | `/api/students?page=1&limit=10` | Get all students (paginated) |
| GET | `/api/students/:id` | Get student by ID with marks |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

---

## 📝 Example Requests

### Create Student
```bash
POST http://localhost:8000/api/students
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "9876543210",
  "date_of_birth": "2000-05-15",
  "city": "Mumbai",
  "state": "Maharashtra"
}
```

### Get All Students (Paginated)
```bash
GET http://localhost:8000/api/students?page=1&limit=10
```

### Get Student by ID
```bash
GET http://localhost:8000/api/students/1
```

### Update Student
```bash
PUT http://localhost:8000/api/students/1
Content-Type: application/json

{
  "first_name": "Updated Name",
  "status": "graduated"
}
```

### Delete Student
```bash
DELETE http://localhost:8000/api/students/1
```

---

## ✅ Test Results

All 8 automated tests **PASSED**:
- ✅ Health Check
- ✅ Get All Students with Pagination
- ✅ Create New Student
- ✅ Get Student by ID with Marks
- ✅ Update Student
- ✅ Pagination (Page 2)
- ✅ Delete Student
- ✅ Validation Error Handling

See `API_TEST_RESULTS.md` for detailed test results.

---

## 📦 Project Files

- `server.js` - Main application
- `postman_collection.json` - Postman API collection
- `test-api.ps1` - Automated test script
- `database_schema.sql` - Database schema
- `API_TEST_RESULTS.md` - Test results
- `.env` - Configuration (PORT=8000)

---

## 🔧 Configuration

Edit `.env` file to change settings:
```env
PORT=8000
DB_HOST=localhost
DB_NAME=student_management
DB_USER=postgres
DB_PASSWORD=12345678
```

---

## 📚 Documentation

- Full API documentation: `README.md`
- Database schema: `database_schema_documentation.md`
- Implementation details: `walkthrough.md`
