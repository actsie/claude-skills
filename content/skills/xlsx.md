---
title: XLSX Spreadsheet Tool
slug: xlsx
description: Official Anthropic skill for comprehensive Excel operations including formula management, financial modeling, data analysis, and automated recalculation.
categories:
  - business
  - data-analysis
  - finance
tags:
  - excel
  - xlsx
  - spreadsheets
  - formulas
  - financial-modeling
  - data-analysis
featured: false
author: Anthropic
repoUrl: https://github.com/anthropics/skills/tree/main/document-skills/xlsx
externalUrl: https://www.anthropic.com
date: 2025-10-24
version: 1.0.0
---

# XLSX Spreadsheet Tool

Official Anthropic skill for comprehensive Excel operations emphasizing formula-driven calculations, financial modeling standards, and zero-error deliverables through automated validation.

<Callout type="tip">
Essential for financial analysts, data scientists, and automation engineers who need to create formula-driven spreadsheets with professional standards and complete accuracy.
</Callout>

## Core Purpose

This tool enables professional Excel operations with emphasis on formulas over hardcoded values:

- **Create new spreadsheets** with formula-driven calculations
- **Modify existing files** while preserving formulas and formatting
- **Analyze data** using pandas and openpyxl
- **Recalculate formulas** automatically via LibreOffice
- **Ensure zero errors** through comprehensive validation

## Fundamental Principle

<Callout type="warning">

**Always Use Formulas:**

"Always use Excel formulas instead of calculating values in Python and hardcoding them."

This ensures:
- Transparency in calculations
- Easy auditing and debugging
- Dynamic updates when inputs change
- Professional spreadsheet standards

</Callout>

## File Format Support

**Supported Types:**
- **.xlsx**: Modern Excel format (primary)
- **.xlsm**: Macro-enabled workbooks
- **.csv**: Comma-separated values
- **.tsv**: Tab-separated values

**Library Selection:**
- **pandas**: Data analysis and manipulation
- **openpyxl**: Formula-based operations and formatting

## Financial Modeling Standards

<Card title="Industry Standard Color Coding">

**Cell Color Conventions:**
- **Blue**: Input cells (user enters data here)
- **Black**: Formula cells (calculations)
- **Green**: Internal links (references to other sheets)
- **Red**: External links (references to other files)

This standard enables quick identification of cell types and data flow.

</Card>

### Number Formatting Rules

**Financial Displays:**
- Currency: `$#,##0.00` or appropriate locale format
- Percentages: `0.0%` or `0.00%` based on precision needs
- Thousands: `#,##0` with appropriate separators
- Accounting: Use accounting format for financial statements

### Assumption Placement

**Best Practices:**
- Place all assumptions at the top of the worksheet
- Clearly label assumption cells
- Use blue font color for input assumptions
- Group related assumptions together
- Document sources for hardcoded values

## Zero Error Requirement

<Callout type="info">

**Critical Deliverable Standard:**

All Excel deliverables must contain **zero formula errors**:
- No #DIV/0! errors
- No #REF! errors
- No #VALUE! errors
- No #N/A errors (unless intentional)
- No #NAME? errors

Use automated validation before delivery.

</Callout>

## Formula Management

### Automatic Recalculation

**recalc.py Workflow:**
```python
# Opens file in LibreOffice
# Triggers full recalculation
# Saves updated file
# Ensures all formulas compute correctly
```

**When to Use:**
- After creating new formulas
- Before delivering spreadsheets
- When formulas don't update automatically
- To verify calculation accuracy

### Formula Best Practices

**Structure:**
- Use named ranges for clarity
- Avoid circular references
- Structure complex formulas with helper columns
- Document unusual formulas with comments

**Common Formulas:**
```excel
=SUM(A1:A10)              # Basic aggregation
=VLOOKUP(A2,Table,2,0)    # Lookup operations
=IF(A1>0,A1,0)            # Conditional logic
=INDEX(MATCH(...))        # Advanced lookups
=SUMIFS(...)              # Conditional sums
```

## Error Prevention Checklist

<Card title="Comprehensive Verification">

**Before Delivery:**

1. **Cell References:**
   - All references point to correct cells
   - No broken links to other files
   - Named ranges properly defined

2. **Column Mapping:**
   - Data columns align correctly
   - Headers match expectations
   - No misaligned data

3. **Division Operations:**
   - Check for division by zero
   - Add IF statements for protection
   - Handle edge cases

4. **Circular References:**
   - Identify and resolve cycles
   - Use iterative calculation if needed
   - Document intentional circularity

5. **Formula Coverage:**
   - All required cells have formulas
   - No missing calculations
   - Complete computational logic

</Card>

## Data Operations

### Using pandas

**Data Analysis:**
```python
import pandas as pd

# Read Excel file
df = pd.read_excel('data.xlsx', sheet_name='Sheet1')

# Analyze data
summary = df.describe()
grouped = df.groupby('Category').sum()

# Write results (data only, not formulas)
df.to_excel('output.xlsx', index=False)
```

**When to Use pandas:**
- Data exploration and analysis
- Statistical operations
- Data cleaning and transformation
- Creating summary tables

### Using openpyxl

**Formula-Based Operations:**
```python
from openpyxl import load_workbook, Workbook

# Create workbook with formulas
wb = Workbook()
ws = wb.active

# Write formulas (not values)
ws['A1'] = 100
ws['A2'] = 200
ws['A3'] = '=SUM(A1:A2)'

wb.save('formulas.xlsx')

# Modify existing file
wb = load_workbook('existing.xlsx')
ws = wb.active
ws['B1'] = '=A1*1.1'  # Add 10% calculation
wb.save('modified.xlsx')
```

**When to Use openpyxl:**
- Creating formula-driven sheets
- Modifying existing formulas
- Preserving Excel features
- Working with cell formatting

## Template Preservation

<Callout type="warning">

**Respect Existing Conventions:**

When editing existing spreadsheets:
- Don't impose new formatting standards
- Maintain existing color schemes
- Preserve template structure
- Keep existing formula patterns
- Respect column layouts

Templates often encode organizational knowledge and preferences.

</Callout>

## Practical Use Cases

### Financial Modeling

**Scenario**: Three-statement financial model

- Income statement with formulas
- Balance sheet with links
- Cash flow statement calculations
- Assumptions sheet at top
- Sensitivity analysis
- Zero formula errors

**Color Coding:**
- Blue inputs for assumptions
- Black formulas for calculations
- Green links between statements
- Red links to external data

### Data Analysis Reports

**Scenario**: Monthly sales analysis

- Import raw data with pandas
- Create pivot tables
- Add formula-based metrics
- Generate charts
- Automated recalculation
- Consistent formatting

### Automated Reporting

**Scenario**: Weekly performance dashboard

- Fetch data from databases
- Populate Excel template
- Formulas calculate KPIs
- Charts update automatically
- Distribute to stakeholders

## Documentation Requirements

<Card title="Hardcoded Value Documentation">

**For Any Hardcoded Values:**

Always include documentation:
- **Source**: Where the number came from
- **Date**: When it was current
- **Rationale**: Why it's hardcoded
- **Update Schedule**: When to refresh

**Example:**
```
Cell B5: 0.05 (5% discount rate)
Source: CFO memo dated 2024-10-01
Rationale: Company's weighted average cost of capital
Update: Review quarterly
```

</Card>

## Advanced Features

### Charts and Visualizations

**Creating Charts:**
```python
from openpyxl.chart import LineChart, Reference

# Add chart to worksheet
chart = LineChart()
chart.title = "Sales Trend"
data = Reference(ws, min_col=2, min_row=1,
                 max_col=2, max_row=13)
chart.add_data(data, titles_from_data=True)
ws.add_chart(chart, "E5")
```

### Conditional Formatting

**Apply Rules:**
```python
from openpyxl.formatting.rule import ColorScaleRule

# Add color scale
ws.conditional_formatting.add(
    'A1:A10',
    ColorScaleRule(
        start_type='min',
        start_color='FF0000',
        end_type='max',
        end_color='00FF00'
    )
)
```

### Data Validation

**Dropdown Lists:**
```python
from openpyxl.worksheet.datavalidation import DataValidation

# Add dropdown
dv = DataValidation(type="list",
                    formula1='"Option 1,Option 2,Option 3"')
ws.add_data_validation(dv)
dv.add('A1:A10')
```

## Performance Optimization

**Large Files:**
- Use read_only=True when reading
- Write in chunks for large datasets
- Minimize formula complexity
- Use array formulas sparingly
- Consider calculation mode settings

## Technical Requirements

<Callout type="warning">

**Dependencies:**

**Python Libraries:**
- pandas: Data analysis
- openpyxl: Formula operations
- xlrd/xlwt: Legacy format support (optional)

**System Tools:**
- LibreOffice: For recalc.py functionality
- Python 3.7+: Core interpreter

</Callout>

## Validation Workflow

**Standard Process:**

1. Create or modify spreadsheet
2. Run recalc.py to recalculate all formulas
3. Check for formula errors (must be zero)
4. Verify calculations with test cases
5. Review color coding compliance
6. Validate number formatting
7. Check documentation completeness
8. Deliver only after passing all checks

## About This Skill

<Callout type="info">
This skill is an **official Anthropic skill** from the [Anthropic Skills Repository](https://github.com/anthropics/skills). It represents best practices for Excel automation in Claude Code.

**Official Skills** are maintained by Anthropic and provide production-ready, well-tested functionality for spreadsheet workflows.
</Callout>

---

*Official Anthropic skill for comprehensive Excel operations including formula management, financial modeling, data analysis, and automated recalculation.*
