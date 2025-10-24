---
title: Invoice Organizer
slug: invoice-organizer
description: Automatically extracts data from invoice PDFs and images, organizes files by vendor and date, generates expense reports, and maintains searchable CSV records.
categories:
  - productivity
  - finance
tags:
  - invoices
  - finance
  - automation
  - document-processing
featured: false
author: ComposioHQ
repoUrl: https://github.com/ComposioHQ/awesome-claude-skills/tree/master/invoice-organizer
externalUrl: https://github.com/ComposioHQ
date: 2025-10-24
version: 1.0.0
---

# Invoice Organizer

Stop manually sorting invoices and expense receipts. This skill extracts key data from PDFs and images, organizes files by vendor and date, generates expense reports, and maintains a searchable CSV database.

<Callout type="tip">
Perfect for freelancers, small business owners, accountants, and anyone drowning in invoice PDFs scattered across folders.
</Callout>

## Core Features

<Card title="Invoice Processing">

**Data Extraction:**
- Invoice dates and numbers
- Vendor names and details
- Line items and totals
- Tax amounts and categories
- Payment terms and due dates

**File Organization:**
- Standardized naming: `YYYY-MM-DD_Vendor_InvoiceNumber.pdf`
- Folder structure: `Invoices/YYYY/Category/Vendor/`
- Duplicate detection and merging
- Backup of original files

**Report Generation:**
- CSV exports with all extracted data
- Monthly expense summaries
- Vendor spending analysis
- Category breakdowns
- Tax-ready reports

</Card>

## How It Works

**1. Scan Invoice Folder**
```bash
# Skill searches for invoice files:
find ~/Documents/Invoices -type f \
  \( -name "*.pdf" -o -name "*.jpg" -o -name "*.png" \)
```

**2. Extract Data**
- Read PDF text content
- OCR images if needed
- Parse dates, amounts, vendors
- Identify invoice numbers
- Categorize expenses

**3. Organize Files**
```bash
# Create structured folders:
mkdir -p "Invoices/2024/Software/Adobe"

# Rename and move:
mv "invoice_final_v2.pdf" \
   "Invoices/2024/Software/Adobe/2024-03-15_Adobe_INV-12345.pdf"
```

**4. Generate Reports**
```csv
Date,Vendor,Invoice Number,Description,Amount,Category,File Path
2024-03-15,Adobe,INV-12345,Creative Cloud Subscription,52.99,Software,Invoices/2024/Software/Adobe/2024-03-15_Adobe_INV-12345.pdf
2024-03-20,AWS,784392,Cloud Hosting,127.45,Infrastructure,Invoices/2024/Infrastructure/AWS/2024-03-20_AWS_784392.pdf
```

## Usage Examples

**Initial setup:**
```
Scan my ~/Documents/Invoices folder. Extract data from all PDFs and images,
organize by year and vendor, and create a master CSV.
```

**Monthly processing:**
```
Process new invoices from March 2024. Add them to the existing
structure and update the expense report CSV.
```

**Vendor analysis:**
```
Show me all Adobe invoices from 2024. Calculate total spent
and check for any missing months.
```

**Tax preparation:**
```
Generate a year-end report for 2024 with all business expenses
categorized for tax filing. Include totals by category.
```

## Folder Structure

```
Invoices/
├── 2024/
│   ├── Software/
│   │   ├── Adobe/
│   │   │   ├── 2024-01-15_Adobe_INV-11111.pdf
│   │   │   ├── 2024-02-15_Adobe_INV-11112.pdf
│   │   │   └── 2024-03-15_Adobe_INV-12345.pdf
│   │   ├── GitHub/
│   │   └── Figma/
│   ├── Infrastructure/
│   │   ├── AWS/
│   │   ├── Vercel/
│   │   └── DigitalOcean/
│   └── Services/
│       ├── Legal/
│       └── Accounting/
└── 2023/
    └── [similar structure]
```

## Data Extraction Examples

**Invoice Recognition:**
```
PDF: "adobe_invoice_march.pdf"

Extracted:
- Date: March 15, 2024
- Vendor: Adobe Inc.
- Invoice #: INV-12345
- Amount: $52.99
- Description: Creative Cloud All Apps
- Category: Software (auto-detected)
```

**OCR from Images:**
```
JPG: "receipt_photo.jpg"

Extracted via OCR:
- Date: March 20, 2024
- Vendor: Office Depot
- Amount: $43.76
- Items: Paper, Pens, Folders
- Category: Office Supplies
```

**Handling Edge Cases:**
```
Partial data found:
- Vendor: Clear (Amazon)
- Date: Clear (2024-03-10)
- Amount: Unclear (multiple line items)

Action: Prompt user to verify total amount
```

## Expense Categories

**Auto-categorization:**
- Software (Adobe, GitHub, Figma)
- Infrastructure (AWS, Vercel, Heroku)
- Office Supplies (paper, equipment)
- Services (legal, accounting, consulting)
- Marketing (ads, social media)
- Travel (flights, hotels, meals)
- Equipment (computers, monitors)
- Utilities (internet, phone)

**Custom categories:**
```
Define custom categories:
- Client-Specific: Invoices for specific client projects
- R&D: Research and development expenses
- Training: Courses and certifications
```

## CSV Report Format

```csv
Date,Vendor,Invoice Number,Description,Amount,Tax,Category,Payment Status,Due Date,File Path
2024-01-15,Adobe,INV-11111,Creative Cloud,52.99,4.77,Software,Paid,2024-02-14,Invoices/2024/Software/Adobe/2024-01-15_Adobe_INV-11111.pdf
2024-01-20,AWS,456789,Cloud Services,127.45,0.00,Infrastructure,Paid,2024-02-19,Invoices/2024/Infrastructure/AWS/2024-01-20_AWS_456789.pdf
2024-02-01,Legal Services Inc,LS-2024-02,Trademark Filing,850.00,76.50,Services,Pending,2024-03-03,Invoices/2024/Services/Legal/2024-02-01_LegalServicesInc_LS-2024-02.pdf
```

## Monthly Summary Reports

```
Expense Summary: March 2024

By Category:
- Software: $312.47 (6 invoices)
- Infrastructure: $542.19 (3 invoices)
- Services: $1,200.00 (2 invoices)
- Office Supplies: $87.43 (4 invoices)
Total: $2,142.09

By Vendor (Top 5):
1. AWS: $542.19
2. Legal Services Inc: $850.00
3. Accounting LLC: $350.00
4. Adobe: $157.47
5. Office Depot: $87.43

Payment Status:
- Paid: $1,792.09 (13 invoices)
- Pending: $350.00 (2 invoices)
```

## Best Practices

<Callout type="info">

**File Management:**
- ✅ Always backup original files before processing
- ✅ Use consistent naming conventions
- ✅ Keep scanned copies separate from originals
- ✅ Archive old invoices annually

**Data Accuracy:**
- ✅ Review extracted data for accuracy
- ✅ Verify amounts match PDF/image
- ✅ Double-check vendor names for consistency
- ✅ Confirm category assignments

**Privacy & Security:**
- ✅ Store invoices in encrypted folders
- ✅ Limit access to financial directories
- ✅ Regularly backup CSV reports
- ✅ Sanitize data before sharing with accountants

</Callout>

## Handling Special Cases

**Duplicate Invoices:**
```
Found potential duplicate:
- Invoices/Downloads/adobe_march.pdf
- Invoices/2024/Software/Adobe/2024-03-15_Adobe_INV-12345.pdf

MD5 checksums match. Recommend deleting Downloads version.
```

**Missing Information:**
```
Invoice partially processed:
- Date: ✅ 2024-03-15
- Vendor: ❌ Unclear (multiple names on document)
- Amount: ✅ $127.45
- Invoice #: ❌ Not found

Action: Prompt user for vendor name and invoice number
```

**Multi-page Invoices:**
```
Processing multi-page invoice:
- Page 1: Summary and total
- Page 2-3: Line item details
- Page 4: Payment terms

Extracted total from page 1, stored full document.
```

## Tax-Ready Reports

**Annual Summary:**
```
Tax Report: 2024

Business Expenses by Category:
┌──────────────────┬───────────┬────────┐
│ Category         │ Amount    │ Count  │
├──────────────────┼───────────┼────────┤
│ Software         │ $3,749.64 │ 72     │
│ Infrastructure   │ $6,508.28 │ 36     │
│ Services         │ $8,400.00 │ 12     │
│ Office Supplies  │ $1,049.16 │ 48     │
│ Travel           │ $2,847.92 │ 15     │
│ Equipment        │ $4,299.00 │ 3      │
├──────────────────┼───────────┼────────┤
│ Total            │ $26,854.00│ 186    │
└──────────────────┴───────────┴────────┘

Total Tax Collected: $2,416.86
Net Business Expenses: $24,437.14
```

## Integration with Accounting Software

**Export Formats:**
- CSV for Excel/Google Sheets
- QBO for QuickBooks import
- JSON for custom integrations
- PDF summaries for accountants

**Workflow:**
1. Organize invoices with this skill
2. Generate CSV export
3. Import to QuickBooks/Xero
4. Reconcile with bank statements
5. Archive for tax records

## About This Skill

<Callout type="info">
This skill was created by **ComposioHQ** as part of their collection of Claude Code productivity skills.

**Philosophy:** Financial organization should be automated to save time and reduce errors. Extract data once, use it everywhere—from expense tracking to tax preparation.

**Privacy:** All processing happens locally. Your financial documents never leave your machine.
</Callout>

---

*Automatically extracts data from invoice PDFs and images, organizes files by vendor and date, generates expense reports, and maintains searchable CSV records.*
