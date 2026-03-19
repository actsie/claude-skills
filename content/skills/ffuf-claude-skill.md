---
title: "FFUF Claude Skill"
description: "Integrates the ffuf web fuzzer for web security testing and reconnaissance. Discover hidden directories, files, subdomains, and API endpoints with intelligent fuzzing."
author: "jthack"
repoUrl: "https://github.com/jthack/ffuf_claude_skill"
categories: ["development"]
tags: ["security", "ffuf", "fuzzing", "reconnaissance", "web-security"]
date: "2026-03-19T07:55:15Z"
---

<Callout type="tip">
Who this is for: Security professionals and developers who need to perform authorized web security testing, directory enumeration, and vulnerability discovery using the ffuf web fuzzer.
</Callout>

## What This Skill Does

Integrates the ffuf (Fuzz Faster U Fool) web fuzzer for intelligent web security testing and reconnaissance tasks, enabling Claude to perform directory discovery, subdomain enumeration, and API endpoint finding.

<Card title="Core Capabilities">

- **Intelligent Fuzzing** — Claude interprets testing goals and configures ffuf appropriately
- **Result Analysis** — Automatic filtering and analysis of ffuf output
- **Safe Defaults** — Includes rate limiting and sensible defaults to avoid aggressive testing
- **Wordlist Management** — Helps select appropriate wordlists for different scenarios
- **Multiple Target Types** — Directories, files, subdomains, API endpoints, parameters
- **Output Filtering** — Filter by status code, size, words, lines for precise results

</Card>

## Usage

### Directory Discovery

```
Fuzz the /api endpoint on example.com for hidden paths
```

```
Find common directories on https://example.com
```

### Subdomain Enumeration

```
Enumerate subdomains for target.com
```

### API Endpoint Discovery

```
Find API endpoints on api.example.com
```

### File Discovery

```
Test for backup files on the /admin path
```

```
Find configuration files on the target
```

### Example Output

**User**: "Find common directories on https://example.com"

**Output**:
```markdown
## FFUF Scan Results

Target: https://example.com/FUZZ
Wordlist: /usr/share/wordlists/dirb/common.txt
Threads: 40

### Discovered Directories (Status 200)

| Path | Status | Size | Words |
|------|--------|------|-------|
| /admin | 200 | 1.2K | 45 |
| /api | 200 | 890B | 32 |
| /images | 200 | 2.1K | 12 |
| /static | 200 | 1.5K | 8 |

### Filtered Results
- Total requests: 4614
- Valid results: 4
- Filtered out: 4610 (by size/words)

Summary: 4 directories discovered with valid content.
```

## Prerequisites

### Install ffuf

**macOS:**
```bash
brew install ffuf
```

**Linux:**
```bash
go install github.com/ffuf/ffuf/v2@latest
```

**Verify Installation:**
```bash
ffuf --version
```

## Installation

```bash
# Clone repository
git clone https://github.com/jthack/ffuf_claude_skill

# Copy to skills directory
mkdir -p ~/.claude/skills
cp -r ffuf_claude_skill/ffuf-skill ~/.claude/skills/
```

## Safety & Ethics

**IMPORTANT**: This skill is for defensive security purposes only.

| Do | Don't |
|----|-------|
| Test systems you own | Test without permission |
| Respect rate limits | Cause service disruption |
| Follow responsible disclosure | Ignore applicable laws |
| Use for authorized testing | Use for malicious purposes |

**Unauthorized testing of systems is illegal and unethical.**

## Common Use Cases

| Task | Example Command |
|------|-----------------|
| **Directory Fuzzing** | `ffuf -u https://target.com/FUZZ -w wordlist.txt` |
| **Subdomain Enum** | `ffuf -u https://FUZZ.target.com -w subdomains.txt` |
| **Parameter Fuzzing** | `ffuf -u https://target.com/page?param=FUZZ -w params.txt` |
| **Vhost Discovery** | `ffuf -u https://target.com -H "Host: FUZZ" -w vhosts.txt` |
| **Extension Fuzzing** | `ffuf -u https://target.com/FUZZ -w wordlist.txt -e .php,.asp,.aspx` |

## Output Options

| Flag | Description |
|------|-------------|
| `-json` | Output in JSON format for parsing |
| `-csv` | Output in CSV format |
| `-of html` | Output in HTML format |
| `-o output.txt` | Save output to file |

## Filtering Options

| Flag | Description |
|------|-------------|
| `-fc 404` | Filter out status 404 |
| `-fs 1234` | Filter by response size |
| `-fw 100` | Filter by word count |
| `-fl 50` | Filter by line count |

## Related Use Cases

- Web application security assessments
- Bug bounty reconnaissance
- Penetration testing engagements
- Security audit preparation
- Attack surface discovery
- API endpoint enumeration
- Hidden resource discovery
