# API Testing Script
# This script tests all endpoints of the Student Management API

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Student Management API - Testing Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"
$apiUrl = "$baseUrl/api"

# Test 1: Health Check
Write-Host "[TEST 1] Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "PASSED - Database is healthy" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "FAILED - Health check failed" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
Write-Host ""

# Test 2: Get All Students (Page 1)
Write-Host "[TEST 2] Get All Students - Page 1" -ForegroundColor Yellow
try {
    $url = "$apiUrl/students" + "?page=1" + "&limit=5"
    $response = Invoke-RestMethod -Uri $url -Method GET
    Write-Host "PASSED - Retrieved students with pagination" -ForegroundColor Green
    Write-Host "Total Records: $($response.pagination.totalRecords)"
    Write-Host "Current Page: $($response.pagination.currentPage)"
    Write-Host "Students on this page: $($response.data.Count)"
} catch {
    Write-Host "FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
Write-Host ""

# Test 3: Create New Student
Write-Host "[TEST 3] Create New Student" -ForegroundColor Yellow
$randomEmail = "test.student." + (Get-Random) + "@example.com"
$newStudent = @{
    first_name = "Test"
    last_name = "Student"
    email = $randomEmail
    phone = "9876543210"
    date_of_birth = "2000-01-01"
    address = "123 Test Street"
    city = "Test City"
    state = "Test State"
    postal_code = "12345"
    country = "India"
    status = "active"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$apiUrl/students" -Method POST -Body $newStudent -ContentType "application/json"
    $script:createdStudentId = $response.data.student_id
    Write-Host "PASSED - Student created with ID: $script:createdStudentId" -ForegroundColor Green
    Write-Host "Name: $($response.data.first_name) $($response.data.last_name)"
    Write-Host "Email: $($response.data.email)"
} catch {
    Write-Host "FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
Write-Host ""

# Test 4: Get Student by ID
Write-Host "[TEST 4] Get Student by ID" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$apiUrl/students/1" -Method GET
    Write-Host "PASSED - Retrieved student details" -ForegroundColor Green
    Write-Host "Student: $($response.data.first_name) $($response.data.last_name)"
    Write-Host "Total Marks: $($response.data.marks.Count)"
} catch {
    Write-Host "FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
Write-Host ""

# Test 5: Update Student
Write-Host "[TEST 5] Update Student" -ForegroundColor Yellow
if ($script:createdStudentId) {
    $updateData = @{
        first_name = "Updated"
        last_name = "Name"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$apiUrl/students/$script:createdStudentId" -Method PUT -Body $updateData -ContentType "application/json"
        Write-Host "PASSED - Student updated" -ForegroundColor Green
        Write-Host "New Name: $($response.data.first_name) $($response.data.last_name)"
    } catch {
        Write-Host "FAILED" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
} else {
    Write-Host "SKIPPED - No student ID available" -ForegroundColor Gray
}
Write-Host ""

# Test 6: Pagination - Page 2
Write-Host "[TEST 6] Pagination - Page 2" -ForegroundColor Yellow
try {
    $url = "$apiUrl/students" + "?page=2" + "&limit=3"
    $response = Invoke-RestMethod -Uri $url -Method GET
    Write-Host "PASSED - Pagination working" -ForegroundColor Green
    Write-Host "Page: $($response.pagination.currentPage) of $($response.pagination.totalPages)"
    Write-Host "Has Next: $($response.pagination.hasNextPage)"
    Write-Host "Has Previous: $($response.pagination.hasPreviousPage)"
} catch {
    Write-Host "FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
Write-Host ""

# Test 7: Delete Student
Write-Host "[TEST 7] Delete Student" -ForegroundColor Yellow
if ($script:createdStudentId) {
    try {
        $response = Invoke-RestMethod -Uri "$apiUrl/students/$script:createdStudentId" -Method DELETE
        Write-Host "PASSED - Student deleted" -ForegroundColor Green
        Write-Host "Deleted: $($response.data.first_name) $($response.data.last_name)"
    } catch {
        Write-Host "FAILED" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
} else {
    Write-Host "SKIPPED - No student ID available" -ForegroundColor Gray
}
Write-Host ""

# Test 8: Validation Error Test
Write-Host "[TEST 8] Validation Error Test" -ForegroundColor Yellow
$invalidStudent = @{
    first_name = "A"
    last_name = "B"
    email = "invalid-email"
    date_of_birth = "2000-01-01"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$apiUrl/students" -Method POST -Body $invalidStudent -ContentType "application/json"
    Write-Host "FAILED - Should have returned validation error" -ForegroundColor Red
} catch {
    Write-Host "PASSED - Validation working correctly" -ForegroundColor Green
    Write-Host "Error caught as expected"
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
