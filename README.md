# WardSonar

## Project Overview
Wardsonar is a web application designed to collect and visualize real-time patient feedback on hospital ward environments. It provides a straightforward interface for patients to submit their mood, direction of change, and contributing factors, while offering staff and managers dedicated dashboards to monitor and analyze this feedback. The goal is to empower healthcare providers with actionable insights to improve patient experience and ward conditions.

## Features
### Patient Feedback Submission:

- Intuitive interface for patients to rate their atmosphere (mood), indicate direction of change (better, same, worse), and provide comments.

- Ability to select contributing factors (e.g., ward environment, staff, other patients).

- Staff Login & Ward-Specific Dashboard:

- Secure login for staff using a unique Ward ID and PIN.

- Dashboard displaying aggregated feedback data specific to their ward.

- Visualizations for mood responses (bar chart), direction of change (meter), and contributing factors (pie chart).

### Manager Login & Multi-Ward Dashboard:

- Secure login for managers with a username and password.

- Ability to select and view dashboards for any ward under their purview.

- Overview of total responses for the selected ward.

- Visualizations mirroring staff dashboards for comprehensive oversight.

- Data Storage: Persistent storage of feedback data using PostgreSQL.

- Responsive Design: Accessible and functional across various devices.

# Netlify

This guide details the process of deploying **WardSonar** to Netlify using a GitHub repository.  
Netlify provides features like continuous deployment, a global CDN, and automated SSL.

---

## Step 1: Log in or Sign up for Netlify
A Netlify account is required.  
Sign up for free using **GitHub**, **GitLab**, **Bitbucket**, or an email address.  
Using an existing **GitHub account** is recommended for seamless integration.

---

## Step 2: Connect to a Git Provider
1. From the dashboard, click **"Add new site"** → **"Import an existing project"**.
2. Netlify will prompt for a Git provider.  
   Choose the one hosting the project’s code (e.g., GitHub, GitLab).
3. Authorize Netlify to access your repositories.

---

## Step 3: Select the Repository
- After connecting to the Git provider, search for and select the repository for deployment.  
  For WardSonar, this would be:

"UoL-Mental-Health-Nursing/WardSonar"
> **Note:**
> Currently, it is not possible to deploy directly from the **UoL-Mental-Health-Nursing** organization due to its private status.  
> The quickest workaround is:
> 1. Download all project files.
> 2. Upload them to your **personal GitHub repository**.
> 3. Deploy from there.

---

## Step 4: Configure the Build Settings
Netlify will auto-detect most settings, but confirm or adjust them:

- **Owner:** Your Netlify account.
- **Branch to deploy:** The branch monitored for new commits (`main` or `master`).
- **Base directory:** Leave blank unless your code is in a subfolder (e.g., `frontend/`).
- **Build command:** 

# Render

This guide details the process of deploying the **WardSonar backend** to **Render**.  
Render is a modern cloud platform that simplifies hosting web services and databases.

---

## Step 1: Log in or Sign Up for Render

- Sign up at [render.com](https://render.com) using:
  - **GitHub** (recommended for smoother setup)
  - GitLab
  - Email

---

## Step 2: Connect to a Git Provider

1. From the dashboard, click **"New"** → **"Web Service"**.
2. Choose your Git provider (e.g., GitHub).
3. Authorize Render to access your repositories.

---

## Step 3: Select the Repository

1. After connecting, your repositories will appear.
2. Click **"Connect"** next to your WardSonar repository.

> **Important:**  
> As with Netlify, you cannot directly deploy from the private **UoL-Mental-Health-Nursing** GitHub organization.  
> **Workaround:** Download the project files → Upload them to your **personal repository** → Deploy from there.

---

## Step 4: Configure the Web Service

Render will detect some settings automatically, but confirm these:

- **Name:** Unique service name (e.g., `wardsonar-backend`)
- **Region:** Nearest to your users
- **Branch:** Deployment branch (e.g., `main`)
- **Root Directory:**  
  If `app.py` and `requirements.txt` are in a subdirectory, specify it (e.g., `backend/`)
- **Build Command:**  
  ```bash
  pip install -r requirements.txt

- **Start Command:**
  ```
  gunicorn app:app

This tells Render to use gunicorn to run the Flask app defined in app.py.

## Step 5: Add Environment Variables & Configure CORS

- Edit CORS settings in backend/app.py: Replace the placeholder URL with your deployed Netlify frontend URL:

```
 CORS(app,
     origins=["https://glowing-cassata-16954e.netlify.app"], <--- change this
     methods=["GET", "POST", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True)
```
- Add environment variables in Render's Environment section:
```
SQLALCHEMY_DATABASE_URI → Your NeonDB connection string
SECRET_KEY → A long, random string for the Flask secret key
```

## Step 6: Deploy the Service

- Click "Create Web Service". Render will:

- Clone your repository

- Install dependencies

- Start the web server

- You can monitor progress in the Render logs.

**Note:** Continuous Deployment is enabled by default — pushing new commits to your branch triggers a rebuild and redeploy.

***

# Running WardSonar Locally

When testing WardSonar locally, you need to replace the deployed URLs with your local server addresses.  

---

## 1. Update Backend (Flask)

Open `backend/app.py` and make the following changes:

**Line 25** – Replace frontend URL in the `CORS` config:  

```python
CORS(app,
     origins=["http://127.0.0.1:5173"],  # <-- replace Netlify URL
     methods=["GET", "POST", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True)
```

**Line 33** – Replace frontend URL in the response headers:

```python
@app.after_request
def apply_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://127.0.0.1:5173"  # <-- replace Netlify URL
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response
```
## 2. Update Frontend (React)
Update the fetch requests to point to the local backend (http://127.0.0.1:5000 instead of Render).

**frontend/WardLogin.jsx**
**Line 14:**

```javascript
fetch('http://127.0.0.1:5000/api/wards')
```
**Line 23:**

```javascript
const res = await fetch('http://127.0.0.1:5000/api/staff-login', {
```

**frontend/WardDashboard.jsx**
**Line 47:**

```javascript
fetch(`http://127.0.0.1:5000/api/responses/${encodeURIComponent(ward)}`)
frontend/Step3Stats.jsx and frontend/Step2Stats.jsx
```

**Line 29:**

```javascript
fetch(`http://127.0.0.1:5000/api/responses/${encodeURIComponent(ward)}`)
frontend/Step1Stats.jsx
```
**Line 33:**

```javascript
fetch(`http://127.0.0.1:5000/api/responses/${encodeURIComponent(ward)}`)
```

**frontend/PatientWardEntry.jsx**
**Line 12:**

```javascript
fetch('http://127.0.0.1:5000/api/wards')
```
**frontend/PatientStep3.jsx**

Line 55 → Replace with local backend URL.

**frontend/ManagerLogin.jsx**

Line 15 → Replace with local backend URL.

**frontend/ManagerDashboard.jsx**

Line 39 and Line 47 → Replace with local backend URL.

## 3. Run Locally
**Start backend:**

```bash
cd backend
flask run
```

**Start frontend:**

```bash
cd frontend
npm run dev
```

Your frontend will run at http://127.0.0.1:5173

Your backend will run at http://127.0.0.1:5000

***

# Database Seeding

To quickly populate the PostgreSQL database on **NeonDB** with test data, you can use `curl` commands to send requests to the running backend API.  

## Prerequisites

* Ensure your Flask backend is running locally. 
* Navigate to the `backend/` directory and run:

```bash
flask run
```

Your local backend must be configured to connect to your NeonDB instance.
The connection string should be available in your local environment variables.

## Seeding the Database with curl

Open a new terminal window to execute the following curl commands.

1. **Create a Sample Ward**

This creates a new hospital ward that the patient submissions will be linked to.

``` bash
curl -X POST -H "Content-Type: application/json" \
-d '{"name": "Ward Alpha", "urlkey": "ward-alpha-123"}' \
http://127.0.0.1:5000/api/wards  ---> replace with your backend url if needed
``` 
2.  **Create Sample Submissions**

These commands add a variety of patient feedback entries.
The ward_urlkey in each payload must match the urlkey of the ward you just created.

Negative Submission
```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"ward_urlkey": "ward-alpha-123", "atmosphere": 1, "direction": -1, "comment": "The ward was very loud, it was difficult to rest.", "causes": ["ward environment"]}' \
http://127.0.0.1:5000/api/submissions
```
Neutral Submission
```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"ward_urlkey": "ward-alpha-123", "atmosphere": 3, "direction": 0, "comment": "", "causes": ["personal feelings"]}' \
http://127.0.0.1:5000/api/submissions
```
Positive Submission
```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"ward_urlkey": "ward-alpha-123", "atmosphere": 5, "direction": 1, "comment": "I felt very cared for by the staff.", "causes": ["the staff"]}' \
http://127.0.0.1:5000/api/submissions
```

**Note**

- You can run these commands multiple times to generate more data.


***
