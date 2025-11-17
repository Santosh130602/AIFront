# 🤖 AI Chat Application (Full-Stack AI Chat with Tool Calling)

A fully functional **AI-powered chat application** built using **Next.js**, **Node.js**, and **MongoDB**, featuring authentication, real-time AI messaging, and a sidebar-based chat history system similar to ChatGPT.

This project includes:

- Modern Dark UI  
- AI tool-calling system  
- JWT authentication  
- Conversation & message storage  
- Responsive sidebar with beautiful mobile drawer  
- Fully deployed live demo  

---

# 🌐 Live Demo

### 🚀 **Frontend (Next.js)**
https://ai-front-phi.vercel.app *(replace with your deployed domain)*

### ⚙️ **Backend (Express API)**
https://aibackend-jy68.onrender.com *(replace with your Render URL)*

---

# 📥 Clone Repositories

### 🔹 **Frontend Repo**
git clone https://github.com/Santosh130602/AIFront.git

cd AIFront

### 🔹 **Backend Repo**
git clone https://github.com/Santosh130602/AIBackend.git

cd AIBackend



---

# ⚙️ Environment Variables

Create a file named **`.env`** in the backend folder:

### **Backend `.env`**
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/aichat
JWT_SECRET=your_jwt_secret_key


Create a file **`.env.local`** in the frontend folder:

### **Frontend `.env.local`**


---

# 🛠️ Run the Project Locally

## 1️⃣ Start the Backend

```bash
cd AIBackend
npm install
nodemon index.js


## 1️⃣ Start the Backend

```bash
cd AIFront
npm install
npm run dev
