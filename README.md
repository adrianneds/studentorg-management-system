# Student Organization Management Website

This project is a Svelte-based web application that provides a graphical user interface for student organization management. It allows both organization administrators and members to manage memberships, fees, and organization details.

## Mock Data
**Member Account**
Username: johndoe
Password: password

**Organization Account**
Username: compsoc
Password: password

## Project Structure

```
studentorg-management-system
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── components
│   │   └── Navbar.svelte
│   ├── routes
│   │   ├── Home.svelte
│   │   ├── Login.svelte
│   │   ├── Register.svelte
│   │   ├── OrganizationDashboard.svelte
│   │   ├── MemberDashboard.svelte
│   │   ├── Members.svelte
│   │   ├── Fees.svelte
│   │   ├── MemberFees.svelte
│   │   └── NotFound.svelte
│   ├── stores
│   │   └── auth.js
│   ├── App.svelte
│   ├── main.js
│   └── routes.js
├── package.json
├── svelte.config.js
├── rollup.config.js
└── README.md
```

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/studentorg-management-system.git
   cd studentorg-management-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run dbconfig.sql in MariaDB**
``bash
source studentorg-management-system\database\dbconfig.sql
``

5. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```

## Features

### Organization Features
- Organization Dashboard
  - View organization statistics
  - Manage members
  - Manage fees
  - View organization details
- Member Management
  - View all members
  - Search and filter members
  - View member details
- Fee Management
  - View fee statistics
  - Process payments
  - Track payment status

### Member Features
- Member Dashboard
  - View organization memberships
  - Access organization details
  - View fee status
- Fee Management
  - View personal fees
  - Make payments
  - Track payment history

## Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

### Organization Routes
- `/organization-dashboard` - Organization dashboard
- `/members` - View all members
- `/members/:orgId` - View specific organization's members
- `/fees` - Fee management
- `/fees/:orgId` - View specific organization's fees

### Member Routes
- `/member-dashboard` - Member dashboard
- `/member-fees` - View personal fees
- `/member-fees/:orgId` - View fees for specific organization

## Authentication

The application supports two types of users:
1. **Organization Administrators**
   - Manage organization details
   - Handle member management
   - Process fee payments

2. **Members**
   - View organization details
   - Access personal fee information
   - Make payments

## Components

- **Navbar.svelte**: Navigation component with conditional rendering based on user type
- **OrganizationDashboard.svelte**: Dashboard for organization administrators
- **MemberDashboard.svelte**: Dashboard for organization members
- **Members.svelte**: Member management interface
- **Fees.svelte**: Fee management interface
- **MemberFees.svelte**: Member fee view interface

## Configuration Files

- **package.json**: Contains project metadata and dependencies
- **svelte.config.js**: Configuration settings for Svelte
- **rollup.config.js**: Configuration for Rollup, the module bundler
- **routes.js**: Route configuration for the application

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
