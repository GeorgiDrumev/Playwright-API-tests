<!-- suite
-->

# Enrollments API

<!-- test
-->

## POST /education/api/enrollments — returns 401 for missing auth token

### Steps

- Send a POST request to /education/api/enrollments without an Authorization header
  **Expected Result**: Response status is 401
- Verify the response body contains an error message
  **Expected Result**: Body includes an authentication error description

<!-- test
-->

## POST /education/api/enrollments — returns 400 for missing required fields

### Steps

- Send a POST request to /education/api/enrollments with an empty body {}
  **Expected Result**: Response status is 400
- Verify the response body contains validation error details
  **Expected Result**: Body lists which fields are required

<!-- test
-->

## POST /education/api/enrollments — returns 409 when student is already enrolled in course

### Steps

- Enroll a student in a course via POST /education/api/enrollments
  **Expected Result**: Response status is 201 and enrollment is created
- Send the same POST request again with identical studentId and courseId
  **Expected Result**: Response status is 409
- Clean up — delete the enrollment
  **Expected Result**: Enrollment is deleted successfully

<!-- test
-->

## PUT /education/api/enrollments/:id — returns 404 for non-existent enrollment

### Steps

- Send a PUT request to /education/api/enrollments/999999999 with a valid update payload
  **Expected Result**: Response status is 404

<!-- test
-->

## PATCH /education/api/enrollments/:id — returns 400 for invalid progressPercentage

### Steps

- Send a PATCH request to /education/api/enrollments/:id with progressPercentage set to 150
  **Expected Result**: Response status is 400
- Verify the response body contains a validation error
  **Expected Result**: Body describes the invalid value constraint

<!-- test
-->

## GET /education/api/enrollments — filters enrollments by status

### Steps

- Send a GET request to /education/api/enrollments?status=Completed
  **Expected Result**: Response status is 200
- Verify all returned enrollments have status Completed
  **Expected Result**: Every item in the response array has status equal to "Completed"
