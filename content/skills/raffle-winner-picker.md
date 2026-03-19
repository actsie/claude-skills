---
title: "Raffle Winner Picker"
description: "Picks random winners from lists, spreadsheets, or Google Sheets for giveaways, raffles, and contests with fair, unbiased selection."
author: "ComposioHQ"
repoUrl: "https://github.com/ComposioHQ/awesome-claude-skills/tree/master/raffle-winner-picker"
categories: ["development"]
tags: ["raffle", "giveaway", "random", "contest", "selection"]
date: "2026-03-19T07:10:12Z"
---

<Callout type="tip">
Who this is for: Marketers, event organizers, and creators running giveaways or contests who need fair, transparent winner selection from entry lists.
</Callout>

## What This Skill Does

Randomly selects winners from lists, spreadsheets, or Google Sheets for giveaways and contests with cryptographically secure randomness.

<Card title="Core Capabilities">

- **Random Selection** — Uses cryptographically secure random number generation
- **Multiple Sources** — Works with CSV, Excel, Google Sheets, or plain lists
- **Multiple Winners** — Can pick one or multiple winners
- **Duplicate Prevention** — Ensures same person can't win twice
- **Transparent Results** — Shows selection process with timestamps
- **Winner Details** — Displays all relevant information about winners

</Card>

## Usage

### From Google Sheets

```
Pick a random row from this Google Sheet to select a winner: [Sheet URL]
```

### From Local File

```
Pick 3 random winners from entries.csv
```

### From List

```
Pick a random winner from this list:
- Alice (alice@email.com)
- Bob (bob@email.com)
- Carol (carol@email.com)
```

### Multiple Winners

```
Pick 5 random winners from contest-entries.xlsx, no duplicates
```

### With Exclusions

```
Pick a random winner excluding previous winners: Alice, Bob, Carol
```

### Example Output

**User**: "Pick a random winner from this Google Sheet for a giveaway"

**Output**:
```markdown
Accessing Google Sheet...
Total entries found: 247

Randomly selecting winner...

🎉 WINNER SELECTED! 🎉

Row #142
Name: Sarah Johnson
Email: sarah.j@email.com
Entry Date: March 10, 2024
Comment: "Love your newsletter!"

Selection method: Cryptographically random
Timestamp: 2024-03-15 14:32:18 UTC

Would you like to:
- Pick another winner (excluding Sarah)?
- Export winner details?
- Pick runner-ups?
```

## Features

### Fair Selection
- Uses secure random number generation
- No bias or patterns possible
- Transparent process documented
- Repeatable with seed for verification

### Multiple Winner Selection
```
Pick 3 winners from the list, ensure no duplicates
```

### Runner-ups
```
Pick 1 winner and 3 runner-ups from the list
```

### Weighted Selection
```
Pick a winner with weighted probability based on the "entries" column
```

## Example Workflows

### Social Media Giveaway
1. Export entries from Google Form to Sheets
2. Run: "Pick a random winner from [Sheet URL]"
3. Verify winner details
4. Announce publicly with timestamp

### Event Raffle
1. Create CSV of attendee names and emails
2. Run: "Pick 10 random winners from attendees.csv"
3. Export winner list
4. Email winners directly

### Team Assignment
1. Have list of participants
2. Run: "Randomly split this list into 4 equal teams"
3. Review assignments
4. Share team rosters

## Tips

1. **Document the process** — Save timestamp and method for records
2. **Public announcement** — Share selection details for transparency
3. **Check eligibility** — Verify winner meets contest rules
4. **Have backups** — Pick runner-ups in case winner is ineligible
5. **Export results** — Save winner list for future reference

## Privacy & Fairness

| Feature | Benefit |
|---------|---------|
| **Cryptographically secure** | No manipulation possible |
| **Timestamp recorded** | Verification available |
| **Seed provided** | Third-party verification possible |
| **Data privacy** | Respects entrant information |

## Common Use Cases

| Use Case | Recommended Approach |
|----------|---------------------|
| **Newsletter Giveaways** | Google Sheets + public announcement |
| **Product Launch Raffles** | CSV export + multiple winners |
| **Conference Drawings** | Attendee list + live selection |
| **Beta Tester Selection** | Random selection from applicants |
| **Focus Groups** | Random participant selection |
| **Event Prizes** | Multiple winners from attendee list |

## Related Use Cases

- Running social media contests fairly
- Selecting beta testers from applicant pool
- Random team assignments for workshops
- Distributing limited spots fairly
- Picking survey participants randomly
