# Full-Stack Library Management System (LMS)

A modern, role-based web application designed to digitize, secure, and streamline library operations with automated transaction logic and real-time reporting.

## Project Overview

The Library Management System is a comprehensive full-stack application built to transition physical library records into a secure digital environment.

**Why it exists:** Traditional libraries rely on manual tracking, leading to lost inventory, uncollected fines, and administrative bottlenecks. This system eliminates manual data entry errors, automatically enforces library policies (like 15-day return limits), and strictly separates administrative controls from self-service user features.

### Key Use Cases

- **Role-Based Access Control (RBAC):** Librarians (Admins) have full control over inventory and transactions. Patrons (Users) have a restricted, self-service view to check catalog availability and pay their own fines.
- **Automated Transactions:** Issuing a book automatically calculates the strict 15-day return date. Returning a book automatically routes the user to a fine-payment portal if dues are owed.
- **Smart Membership Management:** Automatically generates formatted IDs (e.g., M-001) and calculates exact expiration dates for 6-month, 1-year, or 2-year terms.

## Tech Stack

### Frontend (Client-Side)
- React 18: Core UI library.
- Vite: Blazing fast build tool and development server.
- Tailwind CSS v4: Utility-first framework for responsive, Light/Dark mode styling.
- Axios: Promise-based HTTP client for backend communication.
- React Router DOM: Client-side routing.
- JWT Decode: For parsing authentication tokens locally to determine user roles.

### Backend (Server-Side)
- Python 3.10+: Core programming language.
- FastAPI: High-performance, async-ready web framework for building APIs.
- SQLAlchemy: Object-Relational Mapper (ORM) for database interactions.
- Pydantic: Data validation and settings management using Python type annotations.
- Passlib & Bcrypt: Secure password hashing.
- PyJWT: JSON Web Token encoding and decoding for stateless authentication.

### Database
- PostgreSQL: Advanced, enterprise-grade relational database system.

## Project Structure

Understanding the folder structure is critical for navigating the codebase. The project is split into two entirely separate domains: Frontend and Backend.

```
library-management-system/
│
├── backend/                     # Python / FastAPI Backend
│   ├── app/
│   │   ├── api/                 
│   │   │   ├── dependencies.py  # Auth guards (e.g., get_current_admin_user)
│   │   │   └── routers/         # API Endpoints (auth.py, maintenance.py, transactions.py, reports.py)
│   │   ├── core/
│   │   │   └── security.py      # JWT token generation and password hashing
│   │   ├── db/
│   │   │   └── database.py      # PostgreSQL connection setup (SessionLocal, engine)
│   │   ├── models/
│   │   │   └── models.py        # SQLAlchemy database tables (User, CatalogItem, Member, Transaction)
│   │   ├── schemas/
│   │   │   └── schemas.py       # Pydantic models for request/response validation
│   │   └── main.py              # Application entry point & CORS configuration
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Backend environment variables
│
├── frontend/                    # React / Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── modules/         # Reusable UI widgets (IssueBook.jsx, SystemReports.jsx, PayFine.jsx)
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global state management for user login sessions
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx # Protected route for Librarians
│   │   │   └── UserDashboard.jsx  # Protected route for Patrons
│   │   ├── services/
│   │   │   └── api.js           # Axios instance with auth interceptors
│   │   ├── App.jsx              # Root component & Route definitions
│   │   └── main.jsx             # React DOM entry point
│   ├── package.json             # Node.js dependencies and scripts
│   ├── tailwind.config.js       # Tailwind theme configuration
│   └── .env                     # Frontend environment variables
```

## Prerequisites

Before touching the code, ensure your local development machine has the following software installed and running.

- **Node.js** (v18.0.0 or higher): Required to run the React development server and install packages.  
  Verify installation: Run `node -v` in your terminal.

- **Python** (v3.10 or higher): Required for the FastAPI backend.  
  Verify installation: Run `python --version` or `python3 --version`.

- **PostgreSQL** (v13 or higher): The relational database that stores all library data.  
  Verify installation: Run `psql -V`.

**⚠️ CRITICAL:** Ensure the PostgreSQL service is actively running in your system's background before attempting to start the backend server.

- **pgAdmin 4** (Optional but recommended): A visual GUI to inspect your database tables without using command-line SQL.

**💡 Tip:** Use a modern code editor like Visual Studio Code (VS Code) and install the "Python" and "ES7+ React/Redux/React-Native snippets" extensions for the best development experience.

---

# 🔧 Installation Guide (Step-by-Step)

Follow these steps exactly to configure your local development environment. 

### Step 1: Clone the Repository
Open your terminal and clone the project to your local machine:

```
git clone https://github.com/your-username/library-management-system.git
cd library-management-system
```

### Step 2: Backend Setup (FastAPI & PostgreSQL)
We strongly recommend using a virtual environment to prevent package conflicts.

```
# Navigate to the backend directory
cd backend

# 1. Create a virtual environment
python -m venv venv

# 2. Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# 3. Install the required Python packages
pip install fastapi uvicorn sqlalchemy psycopg2-binary passlib bcrypt pyjwt pydantic
```

💡 **Tip:** If `psycopg2-binary` fails to install on Mac/Linux, ensure you have PostgreSQL development headers installed (e.g., `brew install postgresql` on Mac, or `sudo apt-get install libpq-dev` on Ubuntu).

### Step 3: Configure Environment Variables
Create a file named `.env` inside the `backend/` directory to store your sensitive configuration strings securely:

```
# backend/.env
DATABASE_URL=postgresql://postgres:your_password_here@localhost:5432/library_db
SECRET_KEY=generate_a_secure_random_string_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120
```

⚠️ **Warning:** Never commit your `.env` file to version control (ensure it is in your `.gitignore`). Replace `your_password_here` with your actual local PostgreSQL password.

### Step 4: Frontend Setup (React & Vite)
Open a *new* terminal window (keep the backend terminal open) and navigate to the frontend folder.

```
# Navigate to the frontend directory
cd frontend

# 1. Install Node.js dependencies
npm install
npm install jwt-decode react-router-dom axios lucide-react
```

### Configure Frontend Environment Variables
Create a file named `.env` inside the `frontend/` directory:

```
# frontend/.env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

# ▶️ Running the Project

To run the application locally, you must start both the backend server and the frontend server simultaneously in two different terminal windows.

### Starting the Backend
In your backend terminal (with the virtual environment activated):

```
uvicorn app.main:app --reload
```

* The `--reload` flag enables auto-reloading, so the server restarts automatically when you make code changes.
* Your API is now running at: `http://localhost:8000`
* **Interactive API Docs:** Visit `http://localhost:8000/docs` to see the automated Swagger UI documentation for all endpoints.

### Starting the Frontend
In your frontend terminal:

```
npm run dev
```

* Vite will bundle the React code and start the development server.
* Your web app is now running at: `http://localhost:5173`

---

# 🔄 Workflow Explanation
Understanding the core application flow is vital for debugging and extending the system.

### 1. Authentication Lifecycle
* **Request:** The user submits their credentials via the `/login` route.
* **Processing:** FastAPI hashes the provided password, compares it against the database, and generates a signed JWT (JSON Web Token) containing their `is_admin` status.
* **Response:** The React client receives the JWT, stores it in `localStorage`, and uses `jwt-decode` to instantly route the user to either `AdminDashboard.jsx` or `UserDashboard.jsx`.

### 2. The 2-Step Issue Flow (Admin Only)
* **Step A (Search):** The Admin opens the **Issue Item** tab, which mounts `BookAvailability.jsx`. They query the database by Book Name or Author.
* **Step B (Select & Issue):** Selecting an available book passes the full book object via state to `IssueBook.jsx`. The form auto-populates the Serial Number, Author, and enforces a strict +15 day maximum on the Return Date input. Submitting hits the `POST /transactions/issue` endpoint.

### 3. The Forced Fine-Redirect Flow (Admin Only)
* **Return:** The Admin types a Serial Number into `ReturnBook.jsx`. The system hits `GET /transactions/active/{serial_no}` to fetch the active transaction and auto-populate the details.
* **Redirect:** Upon hitting "Confirm Return", the backend marks the item as returned. The frontend immediately triggers an `onNavigateToFine` callback.
* **Fine Payment:** The UI dynamically swaps the active tab to `PayFine.jsx`, automatically injecting the `membership_id` from the return step into the fine payment input box, ensuring no dues are forgotten.

---

# ❗ Common Errors & Fixes (VERY IMPORTANT)
During development and setup, you might encounter a few specific errors. Here is the exact guide to resolving the most common full-stack integration issues.

### Error 1: `Expected function or class declaration after decorator` (Backend)
* **Cause:** A Python syntax error where a FastAPI routing decorator (e.g., `@router.get("/search")`) is left hanging without a function immediately below it.
* **Solution:** Open the referenced file (e.g., `transactions.py`) and ensure every `@router` line is immediately followed by `def function_name(...):`. Remove any blank spaces, variables, or comments between the decorator and the function.

### Error 2: `404 Not Found` on API Requests (Frontend to Backend)
* **Cause:** The React frontend used Axios to request a URL (like `/api/transactions/search`) that does not exist on the FastAPI backend.
* **Solution:** 1. Verify the endpoint exists in your FastAPI routers.
  2. Check your router prefix (e.g., `router = APIRouter(prefix="/api/transactions")`).
  3. Ensure the router is actually imported and registered in `backend/app/main.py` using `app.include_router(...)`.

### Error 3: `400 Bad Request` on Form Submission (Backend)
* **Cause:** FastAPI's Pydantic schema validation failed. The React frontend either sent missing data or the wrong data type (e.g., forgetting to send the `membership_id` when issuing a book).
* **Solution:** Open the browser's "Network" tab (F12), click the failed request, and look at the "Response" tab. FastAPI will explicitly tell you which field is missing. Update your React `formData` state to include the exact fields required by your `schemas.py` file.

### Error 4: `TypeError: 'status' is an invalid keyword argument` (Database)
* **Cause:** SQLAlchemy tried to save data into a column (like `status`) that does not exist in your database table definition (`models.py`).
* **Solution:** Either remove the keyword argument from your database insertion code (e.g., in `maintenance.py`) or update your `models.py` to include the missing column and reset your database.

### Error 5: `Uncaught SyntaxError: ... does not provide an export named 'default'` (Frontend)
* **Cause:** A React component file (like `SystemReports.jsx`) is missing its final export statement.
* **Solution:** Scroll to the very bottom of the mentioned file and ensure it ends with `export default ComponentName;`.

---

# 🧪 Testing Instructions
To ensure the system works perfectly, execute this End-to-End (E2E) test flow:

1. **Boot Both Servers:** Ensure Uvicorn and Vite are running.
2. **Admin Account Setup:** Navigate to `/register`. Create an account and **check** the "Register as Admin" box.
3. **Populate Database:**
   * Login as Admin.
   * Go to **Maintenance -> Add Book/Movie** and add "The Great Gatsby" (Serial: `B001`).
   * Go to **Maintenance -> Add Membership** and register a user. Note their ID (e.g., `M-001`).
4. **Issue an Item:**
   * Go to **Transactions -> Issue Item**.
   * Search for "Gatsby". Select the book and click proceed.
   * Fill in the `M-001` ID. Verify the return date is locked to +15 days maximum. Submit.
5. **Return & Pay Fine:**
   * Go to **Transactions -> Return Item**.
   * Enter Serial `B001`. Confirm the auto-populated details are read-only. Submit.
   * Verify the system automatically routes you to the **Pay Fine** tab with `M-001` pre-filled. Clear the fine.
6. **User Portal Verification:**
   * Logout. Register a new non-admin user. Login.
   * Verify the sidebar **strictly restricts** them from seeing "Issue Item" or "Return Item".
   * Check the **System Reports** tab to ensure they can search the master book list.

---

# 🔐 Environment Variables Summary
For quick reference, here are the required `.env` configurations.

**`backend/.env`**

```
# The connection string to your PostgreSQL database
DATABASE_URL=postgresql://user:password@localhost:5432/library_db

# A long, random string used to sign JWT tokens (e.g., run `openssl rand -hex 32`)
SECRET_KEY=your_super_secret_key_here

# Encryption algorithm
ALGORITHM=HS256

# How long a user remains logged in
ACCESS_TOKEN_EXPIRE_MINUTES=120
```

**`frontend/.env`**

```
# The base URL pointing to your FastAPI backend
VITE_API_BASE_URL=http://localhost:8000/api
```

---

# 📦 Build & Deployment

### Frontend (Production Build)
To prepare the React app for production (e.g., Vercel, Netlify, or AWS S3):

```
cd frontend
npm run build
```

This generates a highly optimized `/dist` folder containing static HTML, CSS, and JS.

### Backend (Production Deployment)
1. Set your `DATABASE_URL` in your production environment (e.g., Render, Railway, Heroku) to point to your managed PostgreSQL instance.
2. Start the server using Uvicorn with multiple workers for production traffic:

```
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

# 🚀 Best Practices & Tips
* **Never commit `.env` files:** Always ensure `.env` is listed in your `.gitignore` file to prevent leaking database passwords and secret keys.
* **Use Alembic for DB Migrations:** If you alter your `models.py` in the future, use Alembic rather than dropping and recreating your database tables to preserve existing library data.
* **Date Handling:** Always use ISO 8601 string formats (`YYYY-MM-DD`) when passing dates between the React frontend and Python backend to avoid timezone mismatches.

---

# 🛠 Troubleshooting Guide
If something breaks, follow this debugging hierarchy:
1. **Check the Frontend Console:** Right-click your browser -> Inspect -> Console. Look for red React errors or Axios network failures.
2. **Check the Network Tab:** In the same DevTools, go to the Network tab. Click the failed API request. Check the **Payload** (what React sent) and the **Response** (what FastAPI replied with).
3. **Check the Backend Terminal:** Look at your Uvicorn terminal logs. Python will print out detailed tracebacks if a database query fails or a 500 Internal Server Error occurs.

---

# ❓ FAQ
**Q: Can normal users issue books to themselves?**  
A: No. By design, this system mimics a real library. Only Admins (Librarians) have access to the Issue/Return transaction modules. Users are restricted to searching the catalog and paying their own fines.

**Q: How are fines calculated?**  
A: Fines are calculated dynamically in the `/reports/overdue` endpoint by finding the difference in days between the `expected_return_date` and `date.today()`, multiplied by the standard fine rate.

---

# 🤝 Contribution Guide
1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/AddEmailNotifications`).
3. Commit your changes (`git commit -m 'Added email notifications for overdue books'`).
4. Push to the branch (`git push origin feature/AddEmailNotifications`).
5. Open a Pull Request.

# 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.