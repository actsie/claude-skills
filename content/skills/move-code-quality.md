---
title: Move Code Quality Checker
slug: move-code-quality
description: Comprehensive code review guidance for Move language packages against Move Book standards, covering naming, structure, testing, documentation, and best practices.
categories:
  - development
  - code-quality
tags:
  - move-language
  - code-review
  - blockchain
  - aptos
  - sui
featured: false
author: 1NickPappas
repoUrl: https://github.com/1NickPappas/move-code-quality-skill
externalUrl: https://github.com/1NickPappas
date: 2025-10-24
version: 1.0.0
---

# Move Code Quality Checker

Comprehensive code review for Move language packages against official Move Book standards. Analyzes naming conventions, module structure, testing coverage, documentation quality, and blockchain-specific best practices.

<Callout type="tip">
Perfect for Move developers building on Aptos, Sui, or other Move-based blockchains who want to ensure code quality and adherence to community standards.
</Callout>

## Core Capabilities

<Card title="11 Quality Categories">

**1. Naming Conventions**
- Module names (snake_case)
- Struct names (PascalCase)
- Function names (snake_case)
- Constant names (SCREAMING_SNAKE_CASE)

**2. Module Structure**
- Proper imports organization
- Logical code ordering
- Friend declarations placement
- Visibility modifiers usage

**3. Testing Coverage**
- Unit test presence
- Test naming conventions
- Edge case coverage
- Error condition testing

**4. Documentation**
- Module-level doc comments
- Function documentation
- Parameter descriptions
- Return value documentation

**5. Error Handling**
- Proper assert usage
- Error code definitions
- Meaningful error messages
- Abort conditions

**6. Resource Safety**
- Move/copy/drop abilities
- Resource lifecycle management
- Proper ownership transfer
- Memory safety guarantees

**7. Access Control**
- Public vs. friend vs. internal
- Capability patterns
- Permission checks
- Authorization logic

**8. Gas Optimization**
- Efficient storage usage
- Minimal computation
- Batch operations
- Reference vs. value passing

**9. Security Patterns**
- Reentrancy protection
- Integer overflow checks
- Access control validation
- Input sanitization

**10. Code Organization**
- Separation of concerns
- Helper function extraction
- Module cohesion
- Dependency management

**11. Best Practices**
- Generics usage
- Type safety
- Immutability preferences
- Standard library usage

</Card>

## How It Works

**1. Package Detection**
```
Scanning project...
✓ Found Move.toml
✓ Detected 8 .move files in sources/
✓ Found 3 test modules
```

**2. Analysis**
```
Analyzing against Move Book standards...
✓ Naming conventions (15/18 rules)
⚠ Module structure (12/14 rules)
✗ Testing coverage (6/12 rules)
✓ Documentation (18/20 rules)
```

**3. Report Generation**
```
Critical Issues (must fix):
  - Missing unit tests for transfer_ownership()
  - Public function lacks access control check
  - Resource not properly moved in withdraw()

Recommended Improvements:
  - Add doc comments to 3 public functions
  - Consider extracting validation logic
  - Use const for magic numbers

Enhancements:
  - Could optimize storage with packed fields
  - Generic type parameter would improve reusability
```

## Usage Examples

**Full package review:**
```
Review my Move package for code quality issues
```

**Focus on specific category:**
```
Check my Move code for security issues and proper
resource safety patterns
```

**Pre-commit check:**
```
Quick quality check before I commit. Focus on critical
issues only.
```

**Explain specific issue:**
```
You flagged "public function lacks access control".
Can you explain why this is critical and show me how to fix it?
```

## Example Analysis

### Naming Conventions

```move
// ✓ Good
module my_package::token_manager {
    const MAX_SUPPLY: u64 = 1_000_000;

    struct TokenMetadata has key {
        total_supply: u64,
    }

    public fun get_total_supply(): u64 { ... }
}

// ✗ Issues found
module my_package::TokenManager {  // Should be snake_case
    const maxSupply: u64 = 1_000_000;  // Should be SCREAMING_SNAKE_CASE

    struct token_metadata has key {  // Should be PascalCase
        TotalSupply: u64,  // Should be snake_case
    }

    public fun GetTotalSupply(): u64 { ... }  // Should be snake_case
}
```

### Testing Coverage

```move
// ✗ Missing tests
public fun transfer_ownership(new_owner: address) { ... }

// ✓ Well-tested
public fun transfer_ownership(new_owner: address) { ... }

#[test]
fun test_transfer_ownership_success() { ... }

#[test]
#[expected_failure(abort_code = E_NOT_OWNER)]
fun test_transfer_ownership_unauthorized() { ... }

#[test]
#[expected_failure(abort_code = E_INVALID_ADDRESS)]
fun test_transfer_ownership_zero_address() { ... }
```

### Resource Safety

```move
// ✗ Resource leaked
public fun withdraw(account: &signer): Token {
    let token = borrow_global<Token>(@owner);
    token  // Error: can't copy resource
}

// ✓ Proper move
public fun withdraw(account: &signer): Token
    acquires Token
{
    move_from<Token>(signer::address_of(account))
}
```

### Access Control

```move
// ✗ Missing authorization
public fun set_admin(new_admin: address) {
    // Anyone can call this!
    borrow_global_mut<AdminCap>(@owner).admin = new_admin;
}

// ✓ Proper capability check
public fun set_admin(
    admin_cap: &AdminCap,
    new_admin: address
) acquires AdminCap {
    assert!(admin_cap.is_valid, E_INVALID_ADMIN);
    borrow_global_mut<AdminCap>(@owner).admin = new_admin;
}
```

## Review Output Format

**Structured by severity:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 CRITICAL (3 issues)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Missing Access Control
   Location: token_manager.move:45
   Function: mint_tokens()
   Issue: Public function allows anyone to mint
   Fix: Add AdminCap requirement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟡 RECOMMENDED (5 improvements)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. Missing Documentation
   Location: utils.move:12
   Function: calculate_reward()
   Suggestion: Add doc comment explaining formula

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔵 ENHANCEMENTS (8 opportunities)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. Gas Optimization
   Location: batch.move:67
   Opportunity: Use vector operations instead of loop
   Impact: 30% gas reduction
```

## Best Practices Checked

<Callout type="info">

**The skill verifies:**
- ✅ All public functions documented
- ✅ Resources have proper abilities
- ✅ Tests cover happy and error paths
- ✅ Access control on privileged operations
- ✅ Constants used for magic numbers
- ✅ Error codes defined and descriptive
- ✅ Module structure follows conventions
- ✅ Generics used appropriately
- ✅ No unused imports or code
- ✅ Gas-efficient patterns

</Callout>

## Interactive Explanation

**Ask for details:**
```
User: "Why is using references more gas-efficient?"

Skill: "In Move, passing by reference (&T or &mut T) avoids copying
the value, which saves both computation and storage costs. For large
structs, this can significantly reduce gas:

Example:
  fun process_token(token: &Token) { ... }  // Gas: ~100 units
  vs.
  fun process_token(token: Token) { ... }   // Gas: ~500 units

The difference grows with struct size. Always prefer references
unless you need to move ownership."
```

## Automated Fix Offers

**For simple issues:**
```
Issue: Missing doc comment on public function

Offer: Would you like me to add a template doc comment?

Generated:
/// Transfers tokens from one account to another
///
/// # Arguments
/// * `from` - Source account signer
/// * `to` - Destination address
/// * `amount` - Number of tokens to transfer
///
/// # Aborts
/// * `E_INSUFFICIENT_BALANCE` if from lacks funds
/// * `E_INVALID_RECIPIENT` if to is zero address
public fun transfer(from: &signer, to: address, amount: u64) { ... }
```

## Move-Specific Patterns

**The skill knows Move idioms:**
- Capability-based access control
- Resource-oriented programming
- Module-level storage patterns
- Event emission best practices
- Standard library preferences
- Blockchain-specific optimizations

## About This Skill

<Callout type="info">
This skill was created by **1NickPappas** for the Move developer community.

**Philosophy:** Code quality in blockchain development is critical. This skill helps Move developers write secure, efficient, and maintainable smart contracts that follow community standards.

**Coverage:** Works with Aptos, Sui, and other Move-based blockchain platforms. Analysis based on official Move Book and established best practices.
</Callout>

---

*Comprehensive code review guidance for Move language packages against Move Book standards, covering naming, structure, testing, documentation, and best practices.*
