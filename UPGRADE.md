# Project Proposal: Part A — Project Specification & Requirements

**PIC:** [Group Member 1 Name]  
**Submission Date:** Week 7  

### Group Members:
1. **[Name 1]** — [Student ID 1] *(PIC / Leader)*
2. **[Name 2]** — [Student ID 2]
3. **[Name 3]** — [Student ID 3]
4. **[Name 4]** — [Student ID 4]

**Project Title:**  
**Enhanced iPhone Shop Management System**

---

## 1. Introduction

This project aims to upgrade an existing iPhone shop management system. The upgraded version focuses on improving user interaction through a clean Graphical User Interface (GUI), adding proper exception handling to prevent system crashes, and applying software design patterns to make the code easier to maintain and expand. 

The application allows shop staff and managers to easily view available iPhone models, search and filter items, update stock and prices, and keep track of favorite products through a visual web dashboard.

---

## 2. Background of the Project

The previous system was a simple, console-based inventory program developed using Java / PHP. It allowed users to type commands in a text terminal to add products, update prices, and list stored items.

However, the previous system had several weaknesses:
* Users had to type commands manually in a command prompt with no visual buttons or cards.
* It had no search or filter options, making it hard to find specific phone models.
* It stored data in simple text files rather than a proper database.
* The code was written in a single file without any clear structure or design patterns.

---

## 3. Problem Statements (Limitations of the Current Project)

1. **No Graphical Interface (GUI):**  
   The text-only console made it hard and slow for non-technical shop employees to view and manage products.
2. **No Exception Handling:**  
   If a user entered invalid data (such as letters instead of numbers for price or stock), the program would crash immediately without showing helpful error messages.
3. **Lack of Design Patterns:**  
   The code was tightly mixed together, making it difficult to add new features or fix bugs without breaking existing code.

---

## 4. Scope of the Project

### a. Existing Modules (Improved)

1. **Product Listing Module:**  
   Upgraded from a plain text list into a visual grid of product cards showing the phone name, color, storage, stock, and price in Ringgit Malaysia (RM).

2. **Search and Filter Module:**  
   Improved by adding a real-time search box, category dropdown (Pro Models, Standard Models, Budget, Previous Gen), and a sort dropdown (by price, name, or stock).

3. **Product Management Module (Add / Edit / Delete):**  
   Upgraded with pop-up forms that validate user input and confirm before deleting an item to prevent accidental loss of data.

4. **Favorites Module:**  
   Allows users to bookmark items with a heart icon (❤️) and view their favorite items in a dedicated list.

### b. New Proposed Modules

1. **Low Stock Alert Module:**  
   Automatically checks inventory levels and displays a warning badge (e.g., `⚠️ Low Stock`) when a phone has fewer than 5 units left, helping managers restock on time.

2. **Inventory Summary & Reporting Module:**  
   Displays a summary dashboard showing total inventory value, total phones in stock, and product counts per category to help managers make sales decisions.

---

## 5. Design Considerations

### • Interface Implementation (GUI)
* The user interface will be built with responsive, clean web components including a navigation header, search bar, product cards, and pop-up forms for adding and editing products.
* Simple visual cues such as loading spinners, category tags, and heart icons make the app friendly and easy to use.

### • Exception Handling in the UI
Instead of crashing when an error occurs, the system will catch errors and show clear messages on screen:
* **Invalid Input:** If a user types a negative price or leaves a required box empty, the form highlights the field in red and explains what to fix.
* **Server Connection Error:** If the database or server is unavailable, the screen shows a friendly message (e.g., *"Unable to load products. Please check your connection."*) instead of a blank screen.
* **Delete Confirmation:** A pop-up asks *"Are you sure you want to delete this product?"* to avoid accidental deletions.

### • Design Patterns Involved
* **Model-View-Controller (MVC):**  
  Separates the database data (Model), the web user interface (View), and the server logic (Controller) so each part can be modified independently.
* **Singleton Pattern:**  
  Used for database and network connections so that only one connection instance is shared across the app, saving system memory.
* **Observer Pattern:**  
  Ensures that whenever a product is added, updated, or marked as a favorite, the user interface automatically refreshes without requiring the user to reload the page.

---

## 6. Expected Outcome

The upgraded project will deliver:
1. A user-friendly, visual web application that is easy for shop staff to use.
2. A reliable system with proper error handling that guides users with friendly messages instead of crashing.
3. A clean and well-organized code structure built using established design patterns.

---

## 7. Tools and Technologies

* **Programming Language:** JavaScript / HTML / CSS / SQL
* **Frontend:** ReactJS
* **Backend:** Node.js API (with GraphQL)
* **Database:** PostgreSQL (with pgAdmin 4)
* **Application Type:** Web Application
* **Development Tools:** Visual Studio Code, Git
