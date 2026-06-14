# JobQuest - AI-Powered Full-Stack Job Portal

**JobQuest** is a premium, full-stack MERN (MongoDB, Express.js, React.js, Node.js) job portal designed for candidates and recruiters. It goes beyond traditional job boards by integrating advanced Artificial Intelligence models for **Resume-to-Job Matching**, **Automated Resume Auditing**, and **Interactive Technical Mock Interviews**.

---

## 🚀 Key Features

### 🌟 Candidate Features
1. **AI Resume-to-Job Matcher (`/ai-matching`)**:
   - Generates high-fidelity vector embeddings (768-dimension) of the candidate's profile and resume.
   - Queries active job embeddings and ranks them using **Vector Cosine Similarity**.
   - Integrates **RAG (Retrieval-Augmented Generation)** to construct a detailed markdown analysis explaining the fit alignment and recommending preparation strategies.
2. **Automated Resume Auditor (`/resume-review`)**:
   - Scores profile resumes (0-100) dynamically.
   - Highlights core strengths, identifies technology skills gaps compared to current industry benchmarks, and prints suggestions for enhancement.
3. **Interactive Mock Interview Simulator (`/interview-prep`)**:
   - Tracks: *Frontend, Backend, Fullstack, or AI Engineering*.
   - A simulated CLI terminal delivers technical questions one-by-one.
   - Submissions receive instant grading (1-10), constructive evaluation advice, and ideal model answers.
   - Persists score history in the database, displayed in the Candidate Profile.
4. **AI Career Chatbot Widget**:
   - A floating career bot powered by Gemini answering career advice, CV writing, and interview practice questions.

### 💼 Recruiter Features
1. **Company Profiles**: Register companies and manage branding elements (branding description, location, logo, and website).
2. **Job Board Postings**: Create, edit, and filter active job requirements (salaries, locations, positions, experience levels, and requirements).
3. **Applicant Auditing**: Audit candidate resumes, view details, and change application states (*Pending, Accepted, Rejected*).

---

## 🛠️ Technology Stack

| Component | Technologies Used |
| :--- | :--- |
| **Frontend** | React (Vite), TailwindCSS, Redux Toolkit, Redux Persist, Framer Motion, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), JWT (Secure HttpOnly Cookies), Multer, Cloudinary |
| **AI Layer** | Google Gemini API (`gemini-2.0-flash` & `text-embedding-004`), Vector Cosine Similarity Search |

---

## ⚙️ Robust Dual-Mode Architecture

To guarantee 100% platform uptime and prevent failures under API limits or missing keys, the portal runs a **Dual-Mode Engine**:
* **AI Mode (Gemini)**: Uses active Google AI SDK models to parse documents, compute vector embeddings, and generate generative grading.
* **Smart Local Fallback**: If a Gemini API call is rate-limited (`429 Quota Exceeded`) or the key is absent, the backend invokes local keyword-based parsers, Jaccard-similarity matching, and text analysis to keep the Mock Interview grading, Chatbot, Resume Auditor, and Match Engine fully operational without UI crashes.

---

## 📁 Folder Structure

```text
Job Portal/
├── backend/
│   ├── controller/      # API Controllers (user, company, job, application, chatbot)
│   ├── Models/          # Mongoose Schemas (User, Job, Company, Application)
│   ├── routes/          # Express API Routers
│   ├── utils/           # AI helper, database, Cloudinary & Multer configs
│   ├── index.js         # Express App entry point
│   └── .env             # Server configurations
└── frontend/
    ├── src/
    │   ├── components/  # Page components (AIMatching, ResumeReview, InterviewPrep, etc.)
    │   ├── hooks/       # Axios API integration hooks
    │   ├── redux/       # Store slices (auth, job, company, application)
    │   ├── App.jsx      # React router registration
    │   └── main.jsx     # App mounting
    └── .env             # Client environment variables
```

---

## 🔧 Environment Configurations

### Backend (`backend/.env`)
```env
PORT=8000
MONGODB_URI=your_mongodb_atlas_connection_string
SECRET_KEY=your_jwt_signing_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

## 🛫 Setup & Installation

### 1. Clone & Install Backend
```bash
cd backend
npm install
```

### 2. Configure & Start Backend
Create the `.env` file in the `backend` folder as shown above.
```bash
npm run dev
```
*Console output should verify:*
`Server Running at Port 8000` & `MONGOOSE CONNECTED SUCCESFULLY`

### 3. Install & Start Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎯 Mock Interview Reference Guide

To prepare for mock sessions or review graded questions, the integrated database includes these core tracks:

### 🌐 Frontend Track Q&As
* **Q1: Virtual DOM reconciliation**
  * *Focus*: React keeps an in-memory representation of UI tree nodes, executes diffing algorithms on state modifications, and updates only dirty nodes in the real DOM.
* **Q2: Rendering methods (CSR vs SSR vs SSG)**
  * *Focus*: Client-Side Rendering builds pages inside the browser; Server-Side Rendering compiles HTML on each server request; Static Site Generation pre-builds static files at compile time.

### 💾 Backend Track Q&As
* **Q1: Middleware chaining**
  * *Focus*: Middleware functions execute sequentially, have access to request and response objects, and trigger `next()` to pass execution along or terminate responses.
* **Q2: API Protection mechanisms**
  * *Focus*: Securing routes via verification layers (JWT verification), CORS origin matching, request limiters (throttling requests), and payload sanitization (escaping SQL/NoSQL queries).
