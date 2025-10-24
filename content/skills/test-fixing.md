---
title: Test Fixing Workflow
slug: test-fixing
description: Systematic test debugging workflow that runs test suites, groups related failures, identifies root causes, applies minimal fixes, and verifies resolution.
categories:
  - development
  - testing
tags:
  - testing
  - debugging
  - workflow
  - quality
featured: false
author: mhattingpete
repoUrl: https://github.com/mhattingpete/claude-skills-marketplace/tree/main/engineering-workflow-plugin/skills/test-fixing
externalUrl: https://github.com/mhattingpete
date: 2025-10-24
version: 1.0.0
---

# Test Fixing Workflow

Transform failing tests into passing ones through systematic debugging. This skill runs test suites, groups related failures, identifies root causes, applies minimal focused fixes, and verifies complete resolution.

<Callout type="tip">
Perfect for developers who want to debug test failures methodically without trial-and-error guessing or missing related issues.
</Callout>

## Core Features

<Card title="Test Debugging Workflow">

**Test Execution:**
- Run full test suite with `make test`
- Execute specific test files with pytest
- Filter tests by pattern or marker
- Capture detailed failure output

**Failure Analysis:**
- Group related test failures
- Identify common root causes
- Distinguish between symptoms vs. actual bugs
- Prioritize fixes by impact

**Minimal Fixes:**
- Apply smallest change to fix issue
- Follow project coding conventions
- Avoid feature expansion during fixes
- Maintain code clarity

**Verification:**
- Re-run affected tests
- Ensure no new failures introduced
- Verify fix addresses root cause
- Check for regressions

</Card>

## How It Works

**1. Run Test Suite**
```bash
make test
# or
uv run pytest tests/ -v
```

**2. Analyze Failures**
```
Test Results:
✓ 142 passing
✗ 5 failing

Grouped Failures:
Group 1 (3 tests): Authentication errors
  - test_login_with_expired_token
  - test_refresh_token_flow
  - test_logout_clears_session
  Root cause: Token validation logic changed

Group 2 (2 tests): Database fixtures
  - test_user_creation
  - test_user_deletion
  Root cause: Missing migration for new column
```

**3. Apply Fixes**
```
Fix 1: Update token validation
  File: auth/validator.py:45
  Change: Use new jwt.decode() signature
  Tests affected: 3

Fix 2: Run missing migration
  Command: alembic upgrade head
  Tests affected: 2
```

**4. Verify Resolution**
```bash
uv run pytest tests/auth/ -v  # Group 1 tests
uv run pytest tests/models/ -v  # Group 2 tests

Result: All 147 tests passing ✓
```

## Usage Examples

**Fix all failing tests:**
```
Run the test suite and fix any failures you find
```

**Focus on specific module:**
```
Run tests for the authentication module and fix any issues:
uv run pytest tests/auth/ -v
```

**Fix by pattern:**
```
Run tests matching "user" and debug any failures:
uv run pytest -k "user" -v
```

**Verify specific fix:**
```
I fixed the token validation. Re-run those 3 auth tests
to verify they now pass.
```

## Test Failure Patterns

### Common Root Causes

**API Changes:**
```
Failure: AttributeError: 'User' object has no attribute 'name'

Root Cause: User model renamed 'name' to 'full_name'

Fix: Update test to use user.full_name
Location: tests/models/test_user.py:23
```

**Missing Dependencies:**
```
Failure: ImportError: cannot import name 'validate_email'

Root Cause: Function moved to new utils module

Fix: Update import: from utils.validators import validate_email
Location: tests/auth/test_registration.py:5
```

**Database State:**
```
Failure: IntegrityError: duplicate key value violates unique constraint

Root Cause: Test not cleaning up fixtures

Fix: Add teardown to reset database state
Location: tests/conftest.py:18
```

**Timing Issues:**
```
Failure: AssertionError: expected True, got False (intermittent)

Root Cause: Race condition in async test

Fix: Add await for async operation completion
Location: tests/integration/test_websocket.py:42
```

## Minimal Fix Philosophy

<Callout type="warning">

**Do:**
- ✅ Fix only the failing test
- ✅ Make the smallest change possible
- ✅ Follow existing code patterns
- ✅ Add comments for non-obvious fixes

**Don't:**
- ❌ Refactor unrelated code
- ❌ Add new features during fix
- ❌ Change working tests
- ❌ Fix failures by skipping tests

</Callout>

## Workflow Integration

<Card title="Engineering Workflow Sequence">

**Part of larger development cycle:**

1. **Feature Planning** - Define requirements
2. **Implementation** - Write code
3. **Test Validation** - Fix failures ← **You are here**
4. **Code Review** - Get feedback ([review-implementing](/skills/review-implementing))
5. **Git Operations** - Commit and push ([git-pushing](/skills/git-pushing))

</Card>

## Example Debugging Session

**Initial Run:**
```bash
$ make test

tests/auth/test_login.py::test_valid_credentials FAILED
tests/auth/test_login.py::test_invalid_password FAILED
tests/auth/test_login.py::test_missing_email PASSED
tests/models/test_user.py::test_user_creation FAILED

3 failed, 1 passed
```

**Analysis:**
```
Failure Pattern 1 (2 tests):
  test_valid_credentials
  test_invalid_password

Error:
  TypeError: check_password() missing 1 required positional argument: 'hash_type'

Root Cause:
  check_password() signature changed to include hash_type parameter

Affected Files:
  - auth/service.py:34 (2 calls)
```

**Fix:**
```python
# Before:
if check_password(password, user.password_hash):

# After:
if check_password(password, user.password_hash, hash_type='bcrypt'):
```

**Re-run:**
```bash
$ uv run pytest tests/auth/test_login.py -v

tests/auth/test_login.py::test_valid_credentials PASSED
tests/auth/test_login.py::test_invalid_password PASSED
tests/auth/test_login.py::test_missing_email PASSED

3 passed ✓
```

**Remaining Failure:**
```
Failure Pattern 2 (1 test):
  test_user_creation

Error:
  OperationalError: no such column: users.created_at

Root Cause:
  Missing database migration

Fix:
  Run migrations: alembic upgrade head
```

**Final Verification:**
```bash
$ make test
147 passed ✓
```

## Git Diff Analysis

**For understanding changes:**
```bash
git diff
```

**Helps identify:**
- What code changed since tests last passed
- Which files might have broken tests
- API signature changes
- Removed/renamed functions

## Project Convention Following

**The skill respects:**
- Existing code formatting
- Import organization
- Naming conventions
- Test structure patterns
- Documentation style

**Example:**
```python
# Project uses dataclasses, skill follows:
@dataclass
class UserFixture:
    email: str
    password: str
    is_active: bool = True

# Project uses pytest fixtures, skill follows:
@pytest.fixture
def authenticated_user(db_session):
    return create_test_user(db_session)
```

## Best Practices

<Callout type="info">

**Before Fixing:**
- ✅ Read full error messages (not just first line)
- ✅ Check git diff for recent changes
- ✅ Group related failures
- ✅ Understand root cause before coding

**During Fixing:**
- ✅ Fix one group at a time
- ✅ Run affected tests after each fix
- ✅ Keep changes minimal and focused
- ✅ Add explanatory comments

**After Fixing:**
- ✅ Run full test suite to check for regressions
- ✅ Verify fix addresses root cause
- ✅ Update documentation if needed
- ✅ Consider if fix reveals larger issue

</Callout>

## Common Commands

**Full suite:**
```bash
make test
pytest
```

**Specific file:**
```bash
uv run pytest tests/path/to/test_file.py -v
```

**Pattern matching:**
```bash
uv run pytest -k "login" -v  # Run tests with "login" in name
```

**Failed tests only:**
```bash
pytest --lf  # Last failed
pytest --ff  # Failed first, then others
```

**With coverage:**
```bash
pytest --cov=app tests/
```

## About This Skill

<Callout type="info">
This skill was created by **mhattingpete** as part of the [Engineering Workflow Plugin](https://github.com/mhattingpete/claude-skills-marketplace/tree/main/engineering-workflow-plugin).

**Philosophy:** Test failures are signals, not noise. Fix them systematically with minimal changes that address root causes, not symptoms.

**Part of a suite:** Works alongside [review-implementing](/skills/review-implementing) for quality and [git-pushing](/skills/git-pushing) for final delivery.
</Callout>

---

*Systematic test debugging workflow that runs test suites, groups related failures, identifies root causes, applies minimal fixes, and verifies resolution.*
