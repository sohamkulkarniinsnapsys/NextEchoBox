# API Route Test Report: `/api/send-message`

**Project:** FeedbackAppNext  
**Test Framework:** Jest  
**Test File:** `tests/send-message.test.ts`  
**Date:** 2025-12-09  
**Coverage:** 100%  

---

## Summary

| Metric | Value |
|--------|-------|
| Test Suites | 1 |
| Total Tests | 9 |
| Passed | 9 |
| Failed | 0 |
| Coverage (Statements) | 100% |
| Coverage (Branches) | 100% |
| Coverage (Functions) | 100% |
| Coverage (Lines) | 100% |

---

## Test Details

### POST `/api/send-message`

| Test Case | Result | Notes |
|-----------|--------|-------|
| Should return 400 if JSON is invalid | ✅ Passed | API returns proper error for invalid JSON |
| Should return 400 if username is missing | ✅ Passed | Validates that username is required |
| Should return 400 if username is not a string | ✅ Passed | Handles invalid username type |
| Should return 400 if content is missing | ✅ Passed | Validates that message content is required |
| Should return 400 if content is empty string | ✅ Passed | Prevents sending empty messages |
| Should return 404 if user not found | ✅ Passed | Correctly handles missing users |
| Should return 403 if user is not accepting messages | ✅ Passed | Ensures users not accepting messages cannot receive them |
| Should return 201 on successful message send | ✅ Passed | Confirms successful message creation and save |
| Should return 500 if an unexpected error occurs | ✅ Passed | Gracefully handles unexpected errors |

---

## Notes

- All tests use **mocks** for `UserModel` and `dbConnect` to avoid hitting the real database.  
- The tests cover **all edge cases** and ensure the API response format is consistent.  
- This setup can be reused for other API route tests.  
- Test coverage is **100%**, including statements, branches, functions, and lines.

---

## Conclusion

The `/api/send-message` route is **fully tested and stable**.  
All validation, business logic, and error handling scenarios are verified.  

This test suite can now be included in **CI/CD pipelines** to ensure future changes do not break the route functionality.

