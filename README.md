# Student Organization Management Website

This project is a student organization management system that runs through a Svelte-based web application that provides a graphical user interface. 
It allows both organizations and its members to manage memberships, fees, and organization details. Members can also have multiple organizations.

## Database Configuration
The database definition language statements can be found in: `database\dbconfig.sql`  
Queries for SELECT, INSERT, UPDATE, and DELETE are in orgController.js and memberController.js

## Tech Stack
- Frontend: Svelte  
- Server: Express, Node js  
- Used mysql npm package for database communication  
- Database: MySQL

## Mock Data
**Member Account**  
Username: janlevinson  
Password: jl123

**Organization Account**  
Username: mathsoc  
Password: msoc123

## Getting Started

To run this project, you must have mysql installed. Follow these steps:

1. **Open the studentorg-management-system folder in the command prompt**  
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run dbconfig.sql in MariaDB to set up the database**
   ```sql
   source studentorg-management-system\database\dbconfig.sql
   ```
4. **In connect.js, change the password to your own mysql password**
   ```javascript
   var pass = '<your-password>'
   ```
5. **In the api folder, run**
   ```bash
   node server.js
   ```
6. **Run the development server:**
   ```bash
   cd src
   npm run dev
   ```
7. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```
   
## Features
- Organization Features
  - View members, fees, transactions, and status updates
  - Add members
  - Add, update, delete fees and transactions
  - Add, update, delete status updates per member every semester
  - View financial reports
- Member Features
  - View organizations
  - Track paid and unpaid fees
  - Update own personal details

## Main Routes

### Public Routes
- `/home` - Home page
- `/login` - Login page
- `/register`: Register

### Organization Routes
- `/organization-dashboard` - Organization dashboard\
- `/fees` - Fees
- `/members` - Members (Card View)
- `/members-list` - Members (List View)
- `/transactions` - Transactions

### Member Routes
- `/member-dashboard` - Member dashboard
- `/member-fees` - Fees

## Authentication

The application supports two types of users:
1. **Organization**
3. **Members**

## Configuration Files

- **package.json**: Contains project metadata and dependencies
- **svelte.config.js**: Configuration settings for Svelte
- **rollup.config.js**: Configuration for Rollup, the module bundler
- **routes.js**: Route configuration for the application.

## Developers
CMSC 127 - ST28L  
Eugenio, Dana Katril S.  
Solis, Adrianne D.  
Victoria, Jan Clarisse B.  


