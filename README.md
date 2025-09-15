# 🏢 Employee Management System

A comprehensive full-stack application for managing employees with dynamic forms, built with Django REST Framework and Next.js.

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Frontend Components](#-frontend-components)
- [Authentication](#-authentication)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration & Login** with JWT tokens
- **Secure Authentication** using Django REST Framework Simple JWT
- **User Profile Management** with custom user model
- **Password Change** functionality
- **Token-based Authentication** for API access

### 📝 Dynamic Form Builder
- **Create Custom Forms** with various field types:
  - Text Input
  - Email Input
  - Number Input
  - Date Picker
  - Password Field
  - Select Dropdown
- **Drag & Drop Interface** for field reordering
- **Field Validation** with required/optional settings
- **Dynamic Options** for select fields
- **Form Templates** for reusable form structures

### 👥 Employee Management
- **Create Employee Records** using dynamic forms
- **Update Employee Information** with validation
- **Employee Listing** with search and filtering
- **Bulk Operations** (delete multiple employees)
- **Data Validation** against form templates
- **Search Functionality** across employee data

### �� API Documentation
- **Interactive Swagger UI** documentation
- **ReDoc Documentation** for better readability
- **OpenAPI 3.0 Schema** generation
- **Try-it-out Functionality** for testing endpoints
- **Comprehensive Examples** for all endpoints

## 🛠 Technology Stack

### Backend
- **Django 5.2.6** - Web framework
- **Django REST Framework 3.16.1** - API development
- **Django REST Framework Simple JWT 5.2.2** - JWT authentication
- **Djoser 2.2.0** - Authentication endpoints
- **DRF Spectacular 0.27.0** - API documentation
- **Django CORS Headers 4.8.0** - CORS handling
- **Django Filter 25.1** - API filtering
- **SQLite** - Database (development)

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React DnD** - Drag and drop functionality

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+**
- **Node.js 18+**
- **npm** or **yarn**
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/employee-management.git
cd employee-management
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
cd backend
python -m venv env

# On Windows
env\Scripts\activate

# On macOS/Linux
source env/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Environment Configuration
Create a `.env` file in the `backend` directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

#### Database Setup
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

#### Run Backend Server
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../frontend
```

#### Install Dependencies
```bash
npm install
```

#### Run Frontend Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📚 API Documentation

### Access Documentation

Once your backend server is running, you can access the API documentation:

- **Swagger UI**: `http://localhost:8000/api/docs/`
- **ReDoc**: `http://localhost:8000/api/redoc/`
- **OpenAPI Schema**: `http://localhost:8000/api/schema/`

### Authentication in Documentation

1. Go to the Swagger UI at `http://localhost:8000/api/docs/`
2. Click the **"Authorize"** button
3. Use the JWT authentication:
   - First, login via the `/api/auth/jwt/create/` endpoint
   - Copy the access token from the response
   - In the authorization dialog, enter: `Bearer <your_access_token>`
4. Click **"Authorize"** to authenticate

## �� Usage Guide

### 1. User Registration & Login

#### Register a New User
```bash
curl -X POST http://localhost:8000/api/auth/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securepassword123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8000/api/auth/jwt/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### 2. Create Form Templates

#### Create a New Form Template
```bash
curl -X POST http://localhost:8000/api/forms/templates/ \
  -H "Authorization: Bearer <your_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Employee Registration Form",
    "description": "Form for new employee registration",
    "fields": [
      {
        "field_type": "TEXT",
        "label": "Full Name",
        "placeholder": "Enter full name",
        "is_required": true,
        "order": 0,
        "options": []
      },
      {
        "field_type": "EMAIL",
        "label": "Email Address",
        "placeholder": "Enter email",
        "is_required": true,
        "order": 1,
        "options": []
      },
      {
        "field_type": "SELECT",
        "label": "Department",
        "placeholder": "Select department",
        "is_required": true,
        "order": 2,
        "options": ["IT", "HR", "Finance", "Marketing"]
      }
    ]
  }'
```

### 3. Create Employee Records

#### Create an Employee
```bash
curl -X POST http://localhost:8000/api/employees/employees/ \
  -H "Authorization: Bearer <your_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "form_template": 1,
    "data": {
      "field_1": "Jane Smith",
      "field_2": "jane@example.com",
      "field_3": "IT"
    }
  }'
```

### 4. Frontend Usage

1. **Access the Application**: Go to `http://localhost:3000`
2. **Register/Login**: Use the authentication forms
3. **Create Forms**: Navigate to Forms section to create dynamic forms
4. **Manage Employees**: Use the Employees section to create and manage employee records
5. **Search & Filter**: Use the search and filter options in the employee list

## �� Project Structure
employee-management/
├── backend/
│ ├── apps/
│ │ ├── authentication/ # User authentication app
│ │ │ ├── models.py # Custom user model
│ │ │ ├── serializers.py # User serializers
│ │ │ ├── views.py # Authentication views
│ │ │ └── urls.py # Auth URL patterns
│ │ ├── employees/ # Employee management app
│ │ │ ├── models.py # Employee model
│ │ │ ├── serializers.py # Employee serializers
│ │ │ ├── views.py # Employee views
│ │ │ └── urls.py # Employee URL patterns
│ │ └── forms/ # Dynamic forms app
│ │ ├── models.py # Form template and field models
│ │ ├── serializers.py # Form serializers
│ │ ├── views.py # Form views
│ │ └── urls.py # Form URL patterns
│ ├── employee_management/ # Django project settings
│ │ ├── settings.py # Project settings
│ │ ├── urls.py # Main URL configuration
│ │ └── wsgi.py # WSGI configuration
│ ├── requirements.txt # Python dependencies
│ ├── manage.py # Django management script
│ └── db.sqlite3 # SQLite database
├── frontend/
│ ├── src/
│ │ ├── app/ # Next.js app directory
│ │ │ ├── auth/ # Authentication pages
│ │ │ ├── employees/ # Employee management pages
│ │ │ ├── forms/ # Form builder pages
│ │ │ └── globals.css # Global styles
│ │ ├── components/ # React components
│ │ │ ├── auth/ # Authentication components
│ │ │ ├── employee/ # Employee components
│ │ │ ├── forms/ # Form builder components
│ │ │ └── general/ # General components
│ │ ├── services/ # API service functions
│ │ ├── types/ # TypeScript type definitions
│ │ └── utils/ # Utility functions
│ ├── package.json # Node.js dependencies
│ └── next.config.ts # Next.js configuration
└── README.md # This file


## 🔗 API Endpoints

### Authentication Endpoints
- `POST /api/auth/users/` - User registration
- `POST /api/auth/jwt/create/` - Login (get JWT tokens)
- `POST /api/auth/jwt/refresh/` - Refresh JWT token
- `POST /api/auth/jwt/verify/` - Verify JWT token
- `GET /api/user/me/` - Get current user profile
- `PUT /api/user/me/` - Update user profile

### Form Template Endpoints
- `GET /api/forms/templates/` - List form templates
- `POST /api/forms/templates/` - Create form template
- `GET /api/forms/templates/{id}/` - Get form template details
- `PUT /api/forms/templates/{id}/` - Update form template
- `DELETE /api/forms/templates/{id}/` - Delete form template
- `GET /api/forms/templates/{id}/fields/` - Get template fields
- `POST /api/forms/templates/{id}/fields/` - Add field to template
- `PUT /api/forms/fields/{id}/` - Update form field
- `DELETE /api/forms/fields/{id}/` - Delete form field

### Employee Endpoints
- `GET /api/employees/employees/` - List employees
- `POST /api/employees/employees/` - Create employee
- `GET /api/employees/employees/{id}/` - Get employee details
- `PUT /api/employees/employees/{id}/` - Update employee
- `PATCH /api/employees/employees/{id}/` - Partial update employee
- `DELETE /api/employees/employees/{id}/` - Delete employee
- `GET /api/employees/employees/by_template/` - Get employees by template
- `GET /api/employees/employees/search/` - Search employees
- `POST /api/employees/employees/{id}/validate_data/` - Validate employee data
- `DELETE /api/employees/employees/bulk_delete/` - Bulk delete employees

## �� Frontend Components

### Authentication Components
- **LoginForm** - User login form
- **RegisterForm** - User registration form

### Form Builder Components
- **FormBuilder** - Main form builder interface
- **FieldEditor** - Individual field editor
- **CreateForm** - Form creation interface
- **FormEdit** - Form editing interface
- **FormView** - Form preview/viewer
- **Forms** - Form listing component

### Employee Components
- **EmployeeForm** - Employee creation/editing form
- **EmployeeList** - Employee listing with search/filter
- **EmployeeView** - Employee detail view

### General Components
- **Navbar** - Navigation bar
- **Dashboard** - Main dashboard
- **Loading** - Loading spinner

## 🔐 Authentication

The application uses JWT (JSON Web Token) authentication:

1. **Registration**: Users register with username, email, and password
2. **Login**: Users login with email and password to receive JWT tokens
3. **Token Usage**: Access tokens are included in API requests via Authorization header
4. **Token Refresh**: Refresh tokens are used to get new access tokens
5. **Security**: Tokens have expiration times and can be blacklisted

### JWT Token Structure
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## 🧪 Testing the API

### Using Swagger UI
1. Go to `http://localhost:8000/api/docs/`
2. Click "Authorize" and enter your JWT token
3. Use the "Try it out" feature to test endpoints

### Using cURL
```bash
# Get access token
TOKEN=$(curl -X POST http://localhost:8000/api/auth/jwt/create/ \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}' \
  | jq -r '.access')

# Use token in API calls
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/employees/employees/
```

### Using Postman
1. Import the API collection (if available)
2. Set up environment variables for base URL and tokens
3. Use the pre-configured requests

## 🚀 Deployment

### Backend Deployment (Django)
1. Set `DEBUG=False` in production
2. Configure production database (PostgreSQL recommended)
3. Set up static file serving
4. Configure environment variables
5. Use a production WSGI server (Gunicorn)

### Frontend Deployment (Next.js)
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/employee-management/issues) page
2. Create a new issue with detailed information
3. Check the API documentation at `http://localhost:8000/api/docs/`

## 🎯 Quick Start Checklist

- [ ] Clone the repository
- [ ] Set up Python virtual environment
- [ ] Install backend dependencies
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Start backend server
- [ ] Install frontend dependencies
- [ ] Start frontend development server
- [ ] Access the application at `http://localhost:3000`
- [ ] Register a new user account
- [ ] Create your first form template
- [ ] Add an employee record
- [ ] Explore the API documentation

---

**Happy Coding! 🚀**

For more detailed information, please refer to the API documentation at `http://localhost:8000/api/docs/` or `http://localhost:8000/api/redoc/`  when the backend server is running.