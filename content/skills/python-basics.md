---
title: "Python Basics"
description: "Learn Python fundamentals from scratch including variables, data types, functions, loops, conditionals, and basic data structures. Use when learning Python, writing simple scripts, or building foundational programming knowledge."
categories: ["development"]
tags: ["python", "beginner", "scripting", "fundamentals", "learning", "programming", "data-structures"]
author: "pawgrammer-community"
repoUrl: ""
featured: false
date: "2026-03-20T10:00:00Z"
version: "1.0.0"
---

<Callout type="tip">
This skill is ideal for complete beginners learning Python from scratch, or anyone who wants a quick refresher on Python fundamentals for writing simple scripts and automation.
</Callout>

# Python Basics

A comprehensive guide to Python fundamentals — variables, data types, control flow, functions, and core data structures. Everything you need to start writing Python scripts and building small programs.

## When to Use This Skill

- Learning Python as your first programming language
- Writing simple automation scripts
- Understanding variables, types, and basic operations
- Working with lists, dictionaries, and other collections
- Building small command-line tools
- Preparing for more advanced Python topics

## Variables and Data Types

### Declaring Variables

Python uses dynamic typing — no need to declare types explicitly.

```python
# Strings
name = "Alice"
greeting = 'Hello, World!'
multiline = """This spans
multiple lines"""

# Numbers
age = 30            # int
price = 19.99       # float
big_number = 1_000_000  # underscores for readability

# Booleans
is_active = True
is_deleted = False

# None (null equivalent)
result = None
```

### Type Checking and Conversion

```python
# Check types
type(42)        # <class 'int'>
type("hello")   # <class 'str'>
isinstance(42, int)  # True

# Convert between types
int("42")       # 42
str(42)         # "42"
float("3.14")   # 3.14
bool(0)         # False
bool(1)         # True
list("abc")     # ['a', 'b', 'c']
```

### String Operations

```python
name = "Alice"

# f-strings (Python 3.6+)
print(f"Hello, {name}!")        # Hello, Alice!
print(f"Length: {len(name)}")   # Length: 5

# Common methods
"hello world".upper()           # "HELLO WORLD"
"HELLO".lower()                 # "hello"
"  spaced  ".strip()            # "spaced"
"hello world".split()           # ["hello", "world"]
", ".join(["a", "b", "c"])      # "a, b, c"
"hello".replace("l", "r")       # "herro"
"hello world".startswith("hello")  # True

# Slicing
text = "Python"
text[0]      # "P"
text[-1]     # "n"
text[0:3]    # "Pyt"
text[::2]    # "Pto"
text[::-1]   # "nohtyP" (reversed)
```

## Operators

<Card title="Common Operators">

- **Arithmetic**: `+`, `-`, `*`, `/`, `//` (floor div), `%` (modulo), `**` (power)
- **Comparison**: `==`, `!=`, `<`, `>`, `<=`, `>=`
- **Logical**: `and`, `or`, `not`
- **Membership**: `in`, `not in`
- **Identity**: `is`, `is not`

</Card>

```python
# Arithmetic
10 / 3      # 3.333...
10 // 3     # 3 (floor division)
10 % 3      # 1 (remainder)
2 ** 10     # 1024 (power)

# Membership
"a" in "abc"          # True
3 in [1, 2, 3]        # True
"key" in {"key": 1}   # True

# Identity (checks same object, not equality)
a = [1, 2]
b = [1, 2]
a == b    # True (same value)
a is b    # False (different objects)
```

## Control Flow

### Conditionals

```python
age = 18

if age < 13:
    print("Child")
elif age < 18:
    print("Teenager")
else:
    print("Adult")

# Ternary expression
status = "adult" if age >= 18 else "minor"

# Match statement (Python 3.10+)
match command:
    case "start":
        begin()
    case "stop":
        end()
    case _:
        print("Unknown command")
```

### For Loops

```python
# Iterate over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Range-based loops
for i in range(5):          # 0, 1, 2, 3, 4
    print(i)

for i in range(2, 8):       # 2, 3, 4, 5, 6, 7
    print(i)

for i in range(0, 10, 2):   # 0, 2, 4, 6, 8
    print(i)

# Enumerate (get index + value)
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

# Iterate over dictionary
scores = {"Alice": 95, "Bob": 87}
for name, score in scores.items():
    print(f"{name}: {score}")
```

### While Loops

```python
count = 0
while count < 5:
    print(count)
    count += 1

# Break and continue
for i in range(10):
    if i == 3:
        continue   # skip 3
    if i == 7:
        break      # stop at 7
    print(i)       # prints 0, 1, 2, 4, 5, 6
```

## Functions

### Defining Functions

```python
def greet(name):
    """Return a greeting message."""
    return f"Hello, {name}!"

print(greet("Alice"))  # Hello, Alice!

# Default parameters
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

greet("Alice")            # Hello, Alice!
greet("Alice", "Hey")     # Hey, Alice!

# Multiple return values
def divide(a, b):
    quotient = a // b
    remainder = a % b
    return quotient, remainder

q, r = divide(17, 5)  # q=3, r=2
```

### Args and Kwargs

```python
# *args — variable positional arguments
def total(*numbers):
    return sum(numbers)

total(1, 2, 3)      # 6
total(10, 20)        # 30

# **kwargs — variable keyword arguments
def build_profile(**info):
    return info

build_profile(name="Alice", age=30)
# {'name': 'Alice', 'age': 30}
```

### Lambda Functions

```python
# Short anonymous functions
double = lambda x: x * 2
double(5)  # 10

# Common with built-in functions
numbers = [3, 1, 4, 1, 5]
sorted(numbers, key=lambda x: -x)  # [5, 4, 3, 1, 1]

names = ["alice", "Bob", "CHARLIE"]
sorted(names, key=lambda s: s.lower())  # ['alice', 'Bob', 'CHARLIE']
```

## Data Structures

### Lists

```python
# Create
fruits = ["apple", "banana", "cherry"]
numbers = list(range(1, 6))  # [1, 2, 3, 4, 5]

# Access and modify
fruits[0]           # "apple"
fruits[-1]          # "cherry"
fruits[1] = "blueberry"

# Add items
fruits.append("date")         # add to end
fruits.insert(1, "avocado")   # insert at index
fruits.extend(["fig", "grape"])  # add multiple

# Remove items
fruits.remove("banana")   # remove by value
fruits.pop()               # remove last item
fruits.pop(0)              # remove by index
del fruits[0]              # delete by index

# List comprehensions
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
pairs = [(x, y) for x in range(3) for y in range(3)]

# Useful operations
len(fruits)          # length
sorted(fruits)       # sorted copy
fruits.sort()        # sort in place
fruits.reverse()     # reverse in place
"apple" in fruits    # membership check
```

### Dictionaries

```python
# Create
person = {"name": "Alice", "age": 30, "city": "NYC"}
also_valid = dict(name="Alice", age=30)

# Access
person["name"]              # "Alice"
person.get("email", "N/A")  # "N/A" (default if key missing)

# Modify
person["age"] = 31                  # update
person["email"] = "alice@mail.com"  # add new key
del person["city"]                  # remove

# Iterate
for key in person:
    print(key)

for key, value in person.items():
    print(f"{key}: {value}")

# Dictionary comprehension
squares = {x: x**2 for x in range(6)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Useful methods
person.keys()     # dict_keys(['name', 'age', 'email'])
person.values()   # dict_values(['Alice', 31, 'alice@mail.com'])
person.items()    # key-value pairs
person.update({"age": 32, "role": "dev"})  # merge
```

### Tuples and Sets

```python
# Tuples — immutable, ordered
point = (3, 4)
x, y = point        # unpacking
single = (42,)       # single-element tuple needs trailing comma

# Sets — unique, unordered
colors = {"red", "green", "blue"}
colors.add("yellow")
colors.discard("red")

# Set operations
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
a | b    # union: {1, 2, 3, 4, 5, 6}
a & b    # intersection: {3, 4}
a - b    # difference: {1, 2}
a ^ b    # symmetric difference: {1, 2, 5, 6}
```

## File I/O

```python
# Read a file
with open("data.txt", "r") as f:
    content = f.read()           # entire file as string
    # or
    lines = f.readlines()       # list of lines

# Write a file
with open("output.txt", "w") as f:
    f.write("Hello, World!\n")

# Append to a file
with open("log.txt", "a") as f:
    f.write("New log entry\n")

# Read line by line (memory-efficient for large files)
with open("data.txt") as f:
    for line in f:
        print(line.strip())
```

<Callout type="info">
Always use the `with` statement when working with files. It automatically closes the file when the block ends, even if an error occurs.
</Callout>

## Error Handling

```python
# Basic try/except
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")

# Multiple exceptions
try:
    value = int(input("Enter a number: "))
    result = 100 / value
except ValueError:
    print("That's not a valid number!")
except ZeroDivisionError:
    print("Cannot divide by zero!")
except Exception as e:
    print(f"Unexpected error: {e}")
finally:
    print("This always runs")

# Raise exceptions
def validate_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative")
    return age
```

## Modules and Imports

```python
# Import entire module
import os
import json

# Import specific items
from pathlib import Path
from datetime import datetime, timedelta

# Import with alias
import numpy as np

# Common standard library modules
import os           # file paths, environment variables
import sys          # system-specific parameters
import json         # JSON encoding/decoding
import csv          # CSV file reading/writing
import math         # mathematical functions
import random       # random number generation
import datetime     # date and time handling
import pathlib      # object-oriented file paths
import re           # regular expressions
import collections  # specialized container types
```

## Practical Script Examples

### Example 1: Word Counter

```python
from collections import Counter

def count_words(filename):
    """Count word frequency in a text file."""
    with open(filename) as f:
        words = f.read().lower().split()
    counts = Counter(words)
    for word, count in counts.most_common(10):
        print(f"{word}: {count}")

count_words("my_text.txt")
```

### Example 2: Simple CSV Processor

```python
import csv

def process_csv(input_file, output_file):
    """Read a CSV, filter rows, and write results."""
    with open(input_file) as infile, open(output_file, "w", newline="") as outfile:
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()

        for row in reader:
            if int(row["score"]) >= 80:
                writer.writerow(row)

process_csv("students.csv", "passing_students.csv")
```

### Example 3: File Organizer

```python
from pathlib import Path
import shutil

def organize_files(directory):
    """Sort files into folders by extension."""
    folder = Path(directory)
    for file in folder.iterdir():
        if file.is_file():
            ext = file.suffix.lower().lstrip(".")
            dest = folder / ext
            dest.mkdir(exist_ok=True)
            shutil.move(str(file), str(dest / file.name))

organize_files("~/Downloads")
```

## Tips for Beginners

<Card title="Best Practices">

- **Use descriptive names**: `user_count` not `uc`
- **Follow PEP 8**: Python's official style guide
- **Use f-strings**: Cleaner than `.format()` or `%` formatting
- **Prefer `with` for files**: Automatic resource cleanup
- **Use list comprehensions**: More Pythonic than manual loops for transforms
- **Start with the standard library**: It covers most common needs

</Card>

<Callout type="warning">
Common beginner mistakes: using mutable default arguments (`def f(items=[])`), confusing `==` with `is`, forgetting that `range()` excludes the end value, and modifying a list while iterating over it.
</Callout>

## Next Steps

Once you're comfortable with these fundamentals, explore:

- **Object-Oriented Programming** — classes, inheritance, encapsulation
- **Virtual environments** — `python -m venv` for project isolation
- **Package management** — `pip install` and `requirements.txt`
- **Type hints** — `def greet(name: str) -> str:` for better tooling
- **Testing** — `pytest` for writing and running tests
- **Async Python** — `asyncio` for concurrent I/O operations
