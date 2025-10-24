---
title: PDF Processing Toolkit
slug: pdf
description: Official Anthropic skill for comprehensive PDF manipulation including text extraction, table parsing, merging, splitting, OCR, and document creation.
categories:
  - business
  - document
  - data-analysis
tags:
  - pdf
  - document-processing
  - ocr
  - data-extraction
  - automation
  - python
featured: false
author: Anthropic
repoUrl: https://github.com/anthropics/skills/tree/main/document-skills/pdf
externalUrl: https://www.anthropic.com
date: 2025-10-24
version: 1.0.0
---

# PDF Processing Toolkit

Official Anthropic skill enabling comprehensive PDF manipulation through Python libraries and command-line tools, supporting extraction, creation, transformation, and form processing at scale.

<Callout type="tip">
Essential for data analysts, document processors, and automation engineers who need to extract data from PDFs, create reports, or manipulate PDF documents programmatically.
</Callout>

## Core Purpose

This toolkit provides end-to-end PDF processing capabilities:

- **Extract text and data** with layout preservation
- **Parse tables** and convert to structured formats
- **OCR scanned documents** for text recognition
- **Merge and split** PDF documents
- **Create new PDFs** with custom content
- **Encrypt and protect** sensitive documents

## Key Capabilities

### Text & Data Extraction

<Card title="Advanced Text Extraction">

**pdfplumber for Precision:**
- Text extraction with layout preservation
- Column detection and ordering
- Whitespace and formatting retention
- Character-level positioning data

**Table Extraction:**
- Automatic table detection
- Export to Excel or pandas DataFrames
- Handle complex table structures
- Preserve cell formatting

**OCR for Scanned Documents:**
- pytesseract integration
- Multi-language support
- Image preprocessing for accuracy
- Batch processing capabilities

</Card>

### Document Manipulation

<Card title="PDF Operations">

**Merging:**
- Combine multiple PDFs into one
- Preserve bookmarks and metadata
- Maintain page quality
- Handle large document sets

**Splitting:**
- Extract specific pages or ranges
- Create individual page files
- Split by bookmarks or criteria
- Batch extraction

**Transformation:**
- Rotate pages programmatically
- Extract metadata (author, creation date)
- Apply watermarks to pages
- Resize and crop pages

</Card>

### PDF Creation

<Card title="Document Generation">

**reportlab Canvas:**
- Draw text, shapes, and images
- Precise positioning control
- Custom fonts and styling
- Low-level PDF construction

**Platypus Framework:**
- Multi-page report generation
- Flowable content layout
- Built-in style sheets
- Tables, paragraphs, and images

</Card>

## Primary Python Libraries

### pypdf

**Core Operations:**
```python
from pypdf import PdfReader, PdfWriter

# Merge PDFs
writer = PdfWriter()
for pdf_file in pdf_files:
    reader = PdfReader(pdf_file)
    for page in reader.pages:
        writer.add_page(page)
writer.write("merged.pdf")

# Split pages
reader = PdfReader("document.pdf")
for i, page in enumerate(reader.pages):
    writer = PdfWriter()
    writer.add_page(page)
    writer.write(f"page_{i}.pdf")

# Encrypt
writer.encrypt(user_password="user123",
               owner_password="owner456")
```

### pdfplumber

**Advanced Extraction:**
```python
import pdfplumber

# Extract text with layout
with pdfplumber.open("document.pdf") as pdf:
    for page in pdf.pages:
        text = page.extract_text()

# Extract tables
with pdfplumber.open("data.pdf") as pdf:
    page = pdf.pages[0]
    tables = page.extract_tables()

    # Convert to DataFrame
    import pandas as pd
    df = pd.DataFrame(tables[0][1:],
                     columns=tables[0][0])
```

### reportlab

**PDF Creation:**
```python
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

# Simple document
c = canvas.Canvas("output.pdf", pagesize=letter)
c.drawString(100, 750, "Hello World")
c.save()

# Multi-page report with Platypus
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

doc = SimpleDocTemplate("report.pdf")
styles = getSampleStyleSheet()
story = [Paragraph("Title", styles['Title']),
         Paragraph("Content here", styles['Normal'])]
doc.build(story)
```

## Command-Line Utilities

<Card title="qpdf">

**PDF Manipulation:**
```bash
# Merge PDFs
qpdf --empty --pages file1.pdf file2.pdf -- merged.pdf

# Extract pages
qpdf input.pdf --pages . 1-5 -- output.pdf

# Decrypt
qpdf --decrypt --password=pass input.pdf output.pdf
```

</Card>

<Card title="pdftotext">

**Text Extraction:**
```bash
# Basic extraction
pdftotext document.pdf output.txt

# Preserve layout
pdftotext -layout document.pdf output.txt

# Specific pages
pdftotext -f 1 -l 10 document.pdf output.txt
```

</Card>

## OCR Processing

<Callout type="info">

**Scanned Document Workflow:**

1. **Extract images** from PDF pages
2. **Preprocess images** (enhance contrast, denoise)
3. **Run OCR** with pytesseract
4. **Post-process text** (clean up errors)
5. **Create searchable PDF** with text layer

This enables full-text search on scanned documents.

</Callout>

### OCR Implementation

```python
import pytesseract
from PIL import Image
from pdf2image import convert_from_path

# Convert PDF to images
images = convert_from_path('scanned.pdf')

# OCR each page
text_pages = []
for image in images:
    text = pytesseract.image_to_string(image)
    text_pages.append(text)

# Combine results
full_text = '\n\n--- Page Break ---\n\n'.join(text_pages)
```

## Security & Protection

### Password Encryption

**User vs. Owner Passwords:**
- **User password**: Required to open document
- **Owner password**: Controls editing permissions

```python
from pypdf import PdfWriter

writer = PdfWriter()
# Add pages...

writer.encrypt(
    user_password="view_only",
    owner_password="full_access",
    permissions_flag=0b0100  # Allow printing only
)
writer.write("protected.pdf")
```

### Decryption

**Remove Password Protection:**
```python
from pypdf import PdfReader, PdfWriter

reader = PdfReader("encrypted.pdf", password="password123")
writer = PdfWriter()

for page in reader.pages:
    writer.add_page(page)

writer.write("decrypted.pdf")
```

## Practical Use Cases

<Card title="Data Extraction Pipeline">

**Scenario**: Extract tables from financial reports

1. Load PDF with pdfplumber
2. Detect tables automatically
3. Extract to pandas DataFrames
4. Clean and validate data
5. Export to Excel or database

**Benefits**: Automate manual data entry, reduce errors, process hundreds of documents

</Card>

<Card title="Report Generation">

**Scenario**: Generate monthly business reports

1. Query data from databases
2. Create charts and visualizations
3. Build PDF with reportlab Platypus
4. Apply company branding
5. Distribute automatically

**Benefits**: Consistent formatting, automated distribution, time savings

</Card>

<Card title="Document Archival">

**Scenario**: Digitize paper records with OCR

1. Scan documents to PDF
2. Run OCR on each page
3. Create searchable PDFs
4. Extract metadata
5. Index in document management system

**Benefits**: Searchable archives, space savings, disaster recovery

</Card>

## Performance Optimization

<Callout type="warning">

**Large Document Handling:**

- **Stream processing**: Process pages one at a time
- **Parallel processing**: Use multiprocessing for batch operations
- **Memory management**: Close files after processing
- **Caching**: Cache extracted data for reuse

For 1000+ page documents, process in chunks to avoid memory issues.

</Callout>

## Table Extraction Best Practices

**Improving Accuracy:**
- Use pdfplumber's explicit table settings
- Define table boundaries manually if needed
- Handle merged cells appropriately
- Validate extracted data against known patterns

**Example:**
```python
with pdfplumber.open("data.pdf") as pdf:
    page = pdf.pages[0]

    # Explicit table settings
    table_settings = {
        "vertical_strategy": "lines",
        "horizontal_strategy": "lines",
        "intersection_tolerance": 3
    }

    tables = page.extract_tables(table_settings)
```

## Error Handling

**Common Issues:**
- **Corrupted PDFs**: Use qpdf for repair
- **Password protection**: Handle decryption errors gracefully
- **Malformed tables**: Fallback to text extraction
- **OCR errors**: Implement spell-checking post-processing

## Technical Requirements

<Callout type="warning">

**Dependencies:**

**Python Libraries:**
- pypdf: Core PDF operations
- pdfplumber: Advanced extraction
- reportlab: PDF generation
- pytesseract: OCR capabilities
- pdf2image: Image conversion
- Pillow: Image processing

**System Tools:**
- Tesseract OCR engine
- Poppler utilities
- qpdf command-line tool

</Callout>

## About This Skill

<Callout type="info">
This skill is an **official Anthropic skill** from the [Anthropic Skills Repository](https://github.com/anthropics/skills). It represents best practices for PDF processing in Claude Code.

**Official Skills** are maintained by Anthropic and provide production-ready, well-tested functionality for document workflows.
</Callout>

---

*Official Anthropic skill for comprehensive PDF manipulation including text extraction, table parsing, merging, splitting, OCR, and document creation.*
