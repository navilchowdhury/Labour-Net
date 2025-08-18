# 🚀 Labour NET

A comprehensive job marketplace platform connecting skilled workers with employers. Built with modern web technologies for seamless job searching, application management, and hiring processes.

## ✨ Features

- **👷 Worker Features:**
  - Browse available jobs by category
  - Apply for jobs matching your expertise
  - Track application status
  - Manage profile and preferences
  - View job history

- **🏢 Employer Features:**
  - Post job listings
  - Review worker applications
  - Assign workers to jobs
  - Manage job status
  - View worker profiles

- **🔍 Job Categories:**
  - Plumbing
  - Cooking
  - Painting
  - Electrical
  - Cleaning

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS-in-JS** - Styling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Labour-Net
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### 4. Environment Setup
Create a `.env` file in the backend directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 5. Start the application

#### Start Backend Server
```bash
cd backend
npm run dev
```

#### Start Frontend Development Server
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Usage

### For Workers
1. **Register** with your skills and preferences
2. **Browse** available jobs in your area
3. **Apply** for jobs that match your expertise
4. **Track** your application status
5. **Manage** your profile and preferences

### For Employers
1. **Register** as an employer
2. **Post** job listings with requirements
3. **Review** worker applications
4. **Assign** workers to jobs
5. **Manage** job completion status

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications
- `POST /api/applications/apply` - Apply for a job
- `GET /api/applications/job/:jobId` - Get applications for a job
- `POST /api/applications/assign` - Assign worker to job
- `GET /api/applications/worker` - Get worker's applications

## 🎨 Features

- **Responsive Design** - Works on all devices
- **Modern UI/UX** - Beautiful gradients and animations
- **Real-time Updates** - Instant application status updates
- **Smart Matching** - Expertise-based job recommendations
- **Secure Authentication** - JWT-based security
- **Profile Management** - Comprehensive user profiles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ for connecting workers with opportunities worldwide** 