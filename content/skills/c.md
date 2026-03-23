---
title: "C++"
description: "Comprehensive C++ guide covering all standard versions (C++98 through C++23) — modern idioms, memory management, templates, STL, concurrency, build systems, and practical patterns for building console apps, desktop applications, and high-performance software."
categories: ["development"]
tags: ["c++", "cpp", "systems-programming", "performance", "templates", "stl", "concurrency", "memory-management", "cmake", "desktop-apps", "console-apps"]
author: "pawgrammer-community"
repoUrl: ""
featured: false
date: "2026-03-20T10:00:00Z"
version: "1.0.0"
---

<Callout type="tip">
This skill covers C++ from the ground up through modern C++23 — ideal for building console applications, desktop apps, games, system tools, and high-performance software. Use it when writing, reviewing, or learning C++ at any level.
</Callout>

# C++

A complete guide to C++ across all standard versions. Covers fundamentals, modern idioms (C++11 through C++23), the Standard Template Library, memory management, templates, concurrency, build systems, and practical patterns for real-world applications.

## When to Use This Skill

- Writing console applications and command-line tools in C++
- Building desktop applications (with Qt, wxWidgets, or similar)
- Systems programming and performance-critical code
- Game development and graphics programming
- Understanding modern C++ features (C++11/14/17/20/23)
- Working with templates, the STL, and generic programming
- Managing memory safely with smart pointers and RAII
- Setting up C++ projects with CMake or other build systems

## C++ Standards Overview

<Card title="Standard Versions">

| Standard | Year | Key Additions |
|----------|------|---------------|
| **C++98/03** | 1998/2003 | Original standard, STL, templates, exceptions |
| **C++11** | 2011 | `auto`, lambdas, move semantics, smart pointers, `nullptr`, range-for, `constexpr`, threads |
| **C++14** | 2014 | Generic lambdas, `auto` return types, `std::make_unique`, relaxed `constexpr` |
| **C++17** | 2017 | Structured bindings, `std::optional`, `std::variant`, `std::filesystem`, `if constexpr`, fold expressions |
| **C++20** | 2020 | Concepts, ranges, coroutines, modules, `std::format`, three-way comparison (`<=>`) |
| **C++23** | 2023 | `std::expected`, `std::print`, `std::mdspan`, deducing `this`, `std::generator` |

</Card>

## Fundamentals

### Hello World

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

Compile and run:

```bash
# GCC
g++ -std=c++17 -o hello hello.cpp && ./hello

# Clang
clang++ -std=c++17 -o hello hello.cpp && ./hello

# MSVC (Windows)
cl /std:c++17 /EHsc hello.cpp
```

### Variables and Types

```cpp
#include <cstdint>
#include <string>

// Fundamental types
int count = 42;
double price = 19.99;
char letter = 'A';
bool is_active = true;

// Fixed-width integers (prefer these for portability)
int32_t id = 100;
uint64_t big_number = 9'000'000'000ULL;  // digit separators (C++14)

// auto type deduction (C++11)
auto name = std::string("Alice");
auto pi = 3.14159;
auto result = compute();  // deduced from return type

// Constants
const int MAX_SIZE = 100;
constexpr int BUFFER_SIZE = 1024;  // compile-time constant (C++11)
```

### String Handling

```cpp
#include <string>
#include <string_view>  // C++17

// std::string — heap-allocated, owning
std::string greeting = "Hello";
greeting += ", World!";
auto length = greeting.size();          // 13
auto pos = greeting.find("World");      // 7
auto sub = greeting.substr(0, 5);       // "Hello"

// std::string_view — non-owning reference (C++17, prefer for read-only)
std::string_view sv = "lightweight";
auto first3 = sv.substr(0, 3);         // "lig"

// Raw string literals
std::string path = R"(C:\Users\name\file.txt)";
std::string json = R"({"key": "value"})";

// std::format (C++20) and std::print (C++23)
#include <format>
auto msg = std::format("Name: {}, Age: {}", "Alice", 30);

#include <print>  // C++23
std::println("Name: {}, Age: {}", "Alice", 30);
```

## Control Flow

```cpp
// if-else
if (x > 0) {
    // positive
} else if (x == 0) {
    // zero
} else {
    // negative
}

// if with initializer (C++17)
if (auto it = map.find(key); it != map.end()) {
    use(it->second);
}

// switch
switch (direction) {
    case Direction::North: move_north(); break;
    case Direction::South: move_south(); break;
    default: stay(); break;
}

// Range-based for loop (C++11)
std::vector<int> nums = {1, 2, 3, 4, 5};
for (const auto& n : nums) {
    std::cout << n << "\n";
}

// Structured bindings (C++17)
std::map<std::string, int> scores = {{"Alice", 95}, {"Bob", 87}};
for (const auto& [name, score] : scores) {
    std::cout << name << ": " << score << "\n";
}
```

## Functions

```cpp
// Basic function
int add(int a, int b) {
    return a + b;
}

// Pass by reference (avoid copying)
void modify(std::vector<int>& data) {
    data.push_back(42);
}

// Pass by const reference (read-only, no copy)
double average(const std::vector<double>& values) {
    double sum = 0;
    for (auto v : values) sum += v;
    return sum / values.size();
}

// Default arguments
void log(const std::string& msg, int level = 0) {
    std::cout << "[" << level << "] " << msg << "\n";
}

// Auto return type (C++14)
auto multiply(double a, double b) {
    return a * b;
}

// constexpr functions (compile-time evaluation)
constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}
static_assert(factorial(5) == 120);

// Trailing return type
auto divide(int a, int b) -> std::pair<int, int> {
    return {a / b, a % b};
}
```

### Lambda Expressions (C++11+)

```cpp
// Basic lambda
auto greet = [](const std::string& name) {
    return "Hello, " + name + "!";
};
std::cout << greet("Alice") << "\n";

// Capture variables
int multiplier = 3;
auto times = [multiplier](int x) { return x * multiplier; };
// [=] capture all by value, [&] capture all by reference

// Generic lambda (C++14)
auto add = [](auto a, auto b) { return a + b; };
add(1, 2);        // int
add(1.5, 2.5);    // double

// Lambda with std::algorithm
std::vector<int> nums = {5, 2, 8, 1, 9};
std::sort(nums.begin(), nums.end(), [](int a, int b) { return a > b; });
// nums: {9, 8, 5, 2, 1}

// Immediately invoked lambda (useful for complex initialization)
const auto config = [&]() {
    Config c;
    c.load_from_file("settings.ini");
    return c;
}();
```

## Classes and Object-Oriented Programming

### Basic Class

```cpp
class Rectangle {
public:
    Rectangle(double w, double h) : width_(w), height_(h) {}

    double area() const { return width_ * height_; }
    double perimeter() const { return 2 * (width_ + height_); }

    // Getters
    double width() const { return width_; }
    double height() const { return height_; }

private:
    double width_;
    double height_;
};

Rectangle rect(10.0, 5.0);
std::cout << rect.area() << "\n";  // 50
```

### Rule of Five / Rule of Zero

```cpp
// Rule of Zero — prefer this when possible
// If you don't manage raw resources, don't define any special members.
class Person {
    std::string name_;
    int age_;
public:
    Person(std::string name, int age) : name_(std::move(name)), age_(age) {}
    // Compiler-generated copy/move/destructor are correct
};

// Rule of Five — when you must manage a resource manually
class Buffer {
public:
    explicit Buffer(size_t size) : data_(new char[size]), size_(size) {}
    ~Buffer() { delete[] data_; }

    // Copy constructor
    Buffer(const Buffer& other) : data_(new char[other.size_]), size_(other.size_) {
        std::copy(other.data_, other.data_ + size_, data_);
    }

    // Copy assignment
    Buffer& operator=(const Buffer& other) {
        if (this != &other) {
            Buffer tmp(other);
            swap(tmp);
        }
        return *this;
    }

    // Move constructor (C++11)
    Buffer(Buffer&& other) noexcept : data_(other.data_), size_(other.size_) {
        other.data_ = nullptr;
        other.size_ = 0;
    }

    // Move assignment (C++11)
    Buffer& operator=(Buffer&& other) noexcept {
        Buffer tmp(std::move(other));
        swap(tmp);
        return *this;
    }

private:
    void swap(Buffer& other) noexcept {
        std::swap(data_, other.data_);
        std::swap(size_, other.size_);
    }
    char* data_;
    size_t size_;
};
```

### Inheritance and Polymorphism

```cpp
class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;           // pure virtual
    virtual std::string name() const = 0;

    void print() const {
        std::cout << name() << ": area = " << area() << "\n";
    }
};

class Circle : public Shape {
public:
    explicit Circle(double radius) : radius_(radius) {}
    double area() const override { return 3.14159265 * radius_ * radius_; }
    std::string name() const override { return "Circle"; }
private:
    double radius_;
};

class Square : public Shape {
public:
    explicit Square(double side) : side_(side) {}
    double area() const override { return side_ * side_; }
    std::string name() const override { return "Square"; }
private:
    double side_;
};

// Polymorphic usage
std::vector<std::unique_ptr<Shape>> shapes;
shapes.push_back(std::make_unique<Circle>(5.0));
shapes.push_back(std::make_unique<Square>(4.0));
for (const auto& s : shapes) {
    s->print();
}
```

### Enums

```cpp
// Scoped enum (C++11, prefer this)
enum class Color { Red, Green, Blue };
Color c = Color::Red;

// With underlying type
enum class Status : uint8_t { OK = 0, Error = 1, Pending = 2 };

// Unscoped enum (C++98, avoid in new code)
enum Direction { North, South, East, West };
```

## Memory Management

### Smart Pointers (C++11)

```cpp
#include <memory>

// unique_ptr — sole ownership, zero overhead
auto ptr = std::make_unique<std::string>("Hello");
std::cout << *ptr << "\n";
// Automatically deleted when ptr goes out of scope

// shared_ptr — shared ownership, reference counted
auto shared = std::make_shared<std::vector<int>>(std::initializer_list<int>{1, 2, 3});
auto copy = shared;  // reference count = 2

// weak_ptr — non-owning observer of shared_ptr
std::weak_ptr<std::vector<int>> weak = shared;
if (auto locked = weak.lock()) {
    // safe to use locked
}

// Passing smart pointers
void process(const std::string& data);       // doesn't need ownership
void consume(std::unique_ptr<Widget> widget); // takes ownership
void share(std::shared_ptr<Config> config);   // shares ownership
```

<Callout type="warning">
Never use raw `new` and `delete` in modern C++. Use `std::make_unique` and `std::make_shared` instead. If you must interact with C APIs that return raw pointers, wrap them in a smart pointer with a custom deleter immediately.
</Callout>

### RAII (Resource Acquisition Is Initialization)

```cpp
// RAII ensures resources are cleaned up when scope exits
class FileHandle {
public:
    explicit FileHandle(const std::string& path) : file_(std::fopen(path.c_str(), "r")) {
        if (!file_) throw std::runtime_error("Failed to open file");
    }
    ~FileHandle() { if (file_) std::fclose(file_); }

    // Prevent copying
    FileHandle(const FileHandle&) = delete;
    FileHandle& operator=(const FileHandle&) = delete;

    // Allow moving
    FileHandle(FileHandle&& other) noexcept : file_(other.file_) { other.file_ = nullptr; }

    FILE* get() const { return file_; }
private:
    FILE* file_;
};
```

## Standard Template Library (STL)

### Containers

```cpp
#include <vector>
#include <array>
#include <map>
#include <unordered_map>
#include <set>
#include <deque>
#include <stack>
#include <queue>

// vector — dynamic array (most common)
std::vector<int> v = {1, 2, 3};
v.push_back(4);
v.emplace_back(5);              // construct in-place
v.reserve(100);                  // pre-allocate capacity
auto& front = v.front();
auto& back = v.back();

// array — fixed-size (C++11)
std::array<int, 5> arr = {1, 2, 3, 4, 5};

// map — ordered key-value pairs (red-black tree)
std::map<std::string, int> ages;
ages["Alice"] = 30;
ages.insert({"Bob", 25});
ages.emplace("Charlie", 35);
if (ages.contains("Alice")) {   // C++20
    std::cout << ages["Alice"];
}

// unordered_map — hash table (O(1) average lookup)
std::unordered_map<std::string, int> fast_lookup;
fast_lookup["key"] = 42;

// set — unique sorted elements
std::set<int> unique_nums = {3, 1, 4, 1, 5};  // {1, 3, 4, 5}

// deque — double-ended queue
std::deque<int> dq;
dq.push_front(1);
dq.push_back(2);

// stack and queue (container adapters)
std::stack<int> stack;
stack.push(1); stack.push(2);
auto top = stack.top();  // 2

std::queue<int> queue;
queue.push(1); queue.push(2);
auto front = queue.front();  // 1
```

### Algorithms

```cpp
#include <algorithm>
#include <numeric>

std::vector<int> v = {5, 2, 8, 1, 9, 3};

// Sort
std::sort(v.begin(), v.end());
std::sort(v.begin(), v.end(), std::greater<>());  // descending

// Search
auto it = std::find(v.begin(), v.end(), 8);
bool found = std::binary_search(v.begin(), v.end(), 5);  // must be sorted

// Transform
std::vector<int> doubled(v.size());
std::transform(v.begin(), v.end(), doubled.begin(), [](int x) { return x * 2; });

// Accumulate
int sum = std::accumulate(v.begin(), v.end(), 0);

// Remove-erase idiom (pre-C++20)
v.erase(std::remove_if(v.begin(), v.end(), [](int x) { return x < 3; }), v.end());

// std::erase_if (C++20, much cleaner)
std::erase_if(v, [](int x) { return x < 3; });

// Min/max
auto [min_it, max_it] = std::minmax_element(v.begin(), v.end());
```

### Ranges (C++20)

```cpp
#include <ranges>
#include <vector>

std::vector<int> nums = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

// Pipe syntax — composable, lazy transformations
auto result = nums
    | std::views::filter([](int n) { return n % 2 == 0; })
    | std::views::transform([](int n) { return n * n; })
    | std::views::take(3);
// result lazily yields: 4, 16, 36

for (int n : result) {
    std::cout << n << " ";
}

// Range-based algorithms (no begin/end needed)
std::ranges::sort(nums);
auto it = std::ranges::find(nums, 5);
bool all_pos = std::ranges::all_of(nums, [](int n) { return n > 0; });
```

## Templates and Generic Programming

### Function Templates

```cpp
template<typename T>
T max_of(T a, T b) {
    return (a > b) ? a : b;
}

max_of(3, 7);          // int
max_of(3.14, 2.71);    // double
max_of<std::string>("abc", "xyz");  // string
```

### Class Templates

```cpp
template<typename T, size_t MaxSize = 64>
class Stack {
public:
    void push(const T& value) {
        if (data_.size() >= MaxSize) throw std::overflow_error("Stack full");
        data_.push_back(value);
    }

    T pop() {
        if (data_.empty()) throw std::underflow_error("Stack empty");
        T val = std::move(data_.back());
        data_.pop_back();
        return val;
    }

    bool empty() const { return data_.empty(); }
    size_t size() const { return data_.size(); }

private:
    std::vector<T> data_;
};

Stack<int> int_stack;
Stack<std::string, 128> str_stack;
```

### Concepts (C++20)

```cpp
#include <concepts>

// Define constraints on template parameters
template<typename T>
concept Numeric = std::integral<T> || std::floating_point<T>;

template<Numeric T>
T safe_divide(T a, T b) {
    if (b == 0) throw std::invalid_argument("Division by zero");
    return a / b;
}

// Shorthand syntax
auto add(std::integral auto a, std::integral auto b) {
    return a + b;
}

// Custom concept
template<typename T>
concept Printable = requires(T t) {
    { std::cout << t } -> std::same_as<std::ostream&>;
};

template<Printable T>
void print(const T& value) {
    std::cout << value << "\n";
}
```

## Concurrency (C++11+)

### Threads

```cpp
#include <thread>
#include <mutex>

std::mutex mtx;
int shared_counter = 0;

void increment(int times) {
    for (int i = 0; i < times; ++i) {
        std::lock_guard<std::mutex> lock(mtx);
        ++shared_counter;
    }
}

// Launch threads
std::thread t1(increment, 10000);
std::thread t2(increment, 10000);
t1.join();
t2.join();
// shared_counter == 20000
```

### Async and Futures

```cpp
#include <future>

auto future = std::async(std::launch::async, []() {
    // expensive computation in another thread
    return compute_result();
});

// Do other work...
auto result = future.get();  // blocks until ready
```

### Scoped Lock and Jthread (C++20)

```cpp
#include <thread>
#include <mutex>

std::mutex m1, m2;

void safe_operation() {
    std::scoped_lock lock(m1, m2);  // deadlock-free multi-lock
    // work with both protected resources
}

// jthread — auto-joining, supports cooperative cancellation
std::jthread worker([](std::stop_token st) {
    while (!st.stop_requested()) {
        do_work();
    }
});
// jthread automatically joins on destruction
```

## Error Handling

```cpp
#include <stdexcept>
#include <expected>  // C++23
#include <optional>  // C++17

// Exceptions
void parse_int(const std::string& str) {
    try {
        int value = std::stoi(str);
        std::cout << "Parsed: " << value << "\n";
    } catch (const std::invalid_argument& e) {
        std::cerr << "Invalid input: " << e.what() << "\n";
    } catch (const std::out_of_range& e) {
        std::cerr << "Out of range: " << e.what() << "\n";
    }
}

// std::optional — value or nothing (C++17)
std::optional<int> find_index(const std::vector<int>& v, int target) {
    for (size_t i = 0; i < v.size(); ++i) {
        if (v[i] == target) return static_cast<int>(i);
    }
    return std::nullopt;
}

if (auto idx = find_index(nums, 42)) {
    std::cout << "Found at: " << *idx << "\n";
}

// std::expected — value or error (C++23)
std::expected<int, std::string> safe_divide(int a, int b) {
    if (b == 0) return std::unexpected("division by zero");
    return a / b;
}

auto result = safe_divide(10, 0);
if (result) {
    std::cout << *result << "\n";
} else {
    std::cerr << result.error() << "\n";
}
```

## File I/O

```cpp
#include <fstream>
#include <sstream>
#include <filesystem>  // C++17

// Write to file
std::ofstream out("output.txt");
out << "Line 1\n" << "Line 2\n";
out.close();

// Read entire file
std::ifstream in("output.txt");
std::stringstream buffer;
buffer << in.rdbuf();
std::string content = buffer.str();

// Read line by line
std::ifstream file("data.txt");
std::string line;
while (std::getline(file, line)) {
    std::cout << line << "\n";
}

// Filesystem operations (C++17)
namespace fs = std::filesystem;

fs::path p = "project/src/main.cpp";
std::cout << p.filename() << "\n";      // main.cpp
std::cout << p.extension() << "\n";     // .cpp
std::cout << p.parent_path() << "\n";   // project/src

if (fs::exists("output.txt")) {
    auto size = fs::file_size("output.txt");
}

// Iterate directory
for (const auto& entry : fs::directory_iterator(".")) {
    if (entry.is_regular_file()) {
        std::cout << entry.path() << " (" << entry.file_size() << " bytes)\n";
    }
}

fs::create_directories("build/output");
fs::copy("src.txt", "dst.txt");
fs::remove("tmp.txt");
```

## Build Systems

### CMake (Recommended)

```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.20)
project(MyApp VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Main executable
add_executable(myapp
    src/main.cpp
    src/utils.cpp
)

target_include_directories(myapp PRIVATE include)

# External dependencies (via FetchContent)
include(FetchContent)
FetchContent_Declare(
    fmt
    GIT_REPOSITORY https://github.com/fmtlib/fmt
    GIT_TAG 10.2.1
)
FetchContent_MakeAvailable(fmt)
target_link_libraries(myapp PRIVATE fmt::fmt)
```

Build commands:

```bash
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
./build/myapp
```

### Typical Project Structure

```
myapp/
  CMakeLists.txt
  include/
    myapp/
      app.h
      utils.h
  src/
    main.cpp
    app.cpp
    utils.cpp
  tests/
    CMakeLists.txt
    test_app.cpp
  third_party/
  README.md
```

## Practical Examples

### Example 1: Console To-Do App

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <fstream>
#include <algorithm>

struct Task {
    std::string description;
    bool completed = false;
};

class TodoApp {
public:
    void run() {
        load();
        std::string input;
        while (true) {
            show_menu();
            std::getline(std::cin, input);
            if (input == "1") add_task();
            else if (input == "2") list_tasks();
            else if (input == "3") complete_task();
            else if (input == "4") { save(); break; }
        }
    }

private:
    std::vector<Task> tasks_;
    const std::string filename_ = "todos.txt";

    void show_menu() {
        std::cout << "\n=== Todo App ===\n"
                  << "1. Add task\n2. List tasks\n3. Complete task\n4. Save & Quit\n> ";
    }

    void add_task() {
        std::cout << "Task: ";
        std::string desc;
        std::getline(std::cin, desc);
        tasks_.push_back({desc, false});
    }

    void list_tasks() {
        for (size_t i = 0; i < tasks_.size(); ++i) {
            std::cout << i + 1 << ". [" << (tasks_[i].completed ? "x" : " ")
                      << "] " << tasks_[i].description << "\n";
        }
    }

    void complete_task() {
        std::cout << "Task number: ";
        std::string input;
        std::getline(std::cin, input);
        size_t idx = std::stoul(input) - 1;
        if (idx < tasks_.size()) tasks_[idx].completed = true;
    }

    void save() {
        std::ofstream out(filename_);
        for (const auto& t : tasks_) {
            out << (t.completed ? 1 : 0) << "|" << t.description << "\n";
        }
    }

    void load() {
        std::ifstream in(filename_);
        std::string line;
        while (std::getline(in, line)) {
            auto sep = line.find('|');
            if (sep != std::string::npos) {
                tasks_.push_back({line.substr(sep + 1), line[0] == '1'});
            }
        }
    }
};

int main() {
    TodoApp app;
    app.run();
    return 0;
}
```

### Example 2: HTTP Client with Modern C++ Patterns

```cpp
#include <iostream>
#include <string>
#include <expected>    // C++23
#include <format>      // C++20
#include <memory>
#include <vector>
#include <functional>

// Demonstrates modern C++ patterns: RAII, smart pointers, expected, format

struct HttpResponse {
    int status_code;
    std::string body;
};

class HttpClient {
public:
    using Callback = std::function<void(const HttpResponse&)>;

    std::expected<HttpResponse, std::string> get(const std::string& url) {
        if (url.empty()) {
            return std::unexpected("URL cannot be empty");
        }
        // In a real app, use libcurl or similar
        return HttpResponse{200, std::format("Response from {}", url)};
    }

    void get_async(const std::string& url, Callback on_complete) {
        auto result = get(url);
        if (result) {
            on_complete(*result);
        }
    }
};

int main() {
    HttpClient client;

    auto result = client.get("https://api.example.com/data");
    if (result) {
        std::cout << std::format("Status: {}\nBody: {}\n",
                                 result->status_code, result->body);
    } else {
        std::cerr << std::format("Error: {}\n", result.error());
    }
    return 0;
}
```

### Example 3: Generic Data Pipeline with Ranges

```cpp
#include <iostream>
#include <vector>
#include <ranges>
#include <string>
#include <algorithm>
#include <numeric>

struct Record {
    std::string name;
    int score;
    std::string department;
};

int main() {
    std::vector<Record> data = {
        {"Alice", 92, "Engineering"},
        {"Bob", 78, "Marketing"},
        {"Charlie", 95, "Engineering"},
        {"Diana", 88, "Marketing"},
        {"Eve", 73, "Engineering"},
    };

    // Filter engineering, sort by score, get top 2 names
    auto top_engineers = data
        | std::views::filter([](const Record& r) {
            return r.department == "Engineering";
          })
        | std::views::transform([](const Record& r) {
            return std::pair{r.name, r.score};
          });

    std::vector<std::pair<std::string, int>> sorted_eng(
        top_engineers.begin(), top_engineers.end());
    std::ranges::sort(sorted_eng, {}, &std::pair<std::string, int>::second);

    for (const auto& [name, score] : sorted_eng | std::views::reverse | std::views::take(2)) {
        std::cout << name << ": " << score << "\n";
    }
    return 0;
}
```

## Common Compiler Flags

```bash
# Debug build
g++ -std=c++20 -g -O0 -Wall -Wextra -Wpedantic -fsanitize=address,undefined -o app main.cpp

# Release build
g++ -std=c++20 -O2 -DNDEBUG -o app main.cpp

# Key flags
# -std=c++20        Set C++ standard version
# -Wall -Wextra     Enable most warnings
# -Wpedantic        Strict standards compliance
# -fsanitize=...    Runtime error detection (address, undefined, thread)
# -O2               Optimize for speed
# -g                Include debug symbols
```

## Tips and Best Practices

<Card title="Modern C++ Guidelines">

- **Use `auto` wisely** — great for iterators and complex types, avoid when the type isn't obvious
- **Prefer stack allocation** — use heap (`new`/smart pointers) only when needed
- **Prefer `const` and `constexpr`** — immutability is your friend
- **Pass by `const&`** for read-only, by value for small/movable types, by `&&` when you need to consume
- **Use smart pointers** — `unique_ptr` by default, `shared_ptr` only when ownership is truly shared
- **Prefer scoped enums** (`enum class`) over unscoped enums
- **Use structured bindings** (C++17) to destructure pairs, tuples, and structs
- **Enable warnings** — compile with `-Wall -Wextra -Wpedantic` and treat warnings as errors in CI
- **Use sanitizers** in development — AddressSanitizer and UndefinedBehaviorSanitizer catch bugs early
- **Prefer standard library** over hand-rolled solutions

</Card>

<Callout type="info">
When starting a new C++ project, target at least C++17 for essential features like `std::optional`, `std::filesystem`, structured bindings, and `if constexpr`. Use C++20 if your compiler supports it for concepts, ranges, and `std::format`.
</Callout>

## Next Steps

Once you're comfortable with these fundamentals, explore:

- **Advanced Templates** — SFINAE, variadic templates, template metaprogramming
- **Coroutines (C++20)** — `co_await`, `co_yield`, `co_return` for async and generators
- **Modules (C++20)** — replace `#include` with `import` for faster compilation
- **GUI Frameworks** — Qt, Dear ImGui, wxWidgets for desktop applications
- **Game Engines** — Unreal Engine (C++), custom engines with SDL2/SFML
- **Package Managers** — vcpkg, Conan for dependency management
- **Testing** — Google Test, Catch2, doctest for unit testing
- **Profiling** — Valgrind, perf, Tracy for performance analysis
