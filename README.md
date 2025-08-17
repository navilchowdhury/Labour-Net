# Labour Net - Job Portal Platform

A full-stack web application that connects workers and employers for various job opportunities. Built with React.js frontend and Node.js/Express.js backend with MongoDB database.

## 🚀 Features

### For Workers:
- **User Registration & Profile Management**: Complete profile with job preferences, availability, and work history
- **Job Search**: Browse available jobs with filtering by category and salary
- **Contact Employers**: Direct access to employer contact information
- **Profile Editing**: Update personal information and job preferences

### For Employers:
- **Company Registration**: Register as an employer or company
- **Job Posting**: Create and manage job listings
- **Hiring Preferences**: Set specific requirements for job candidates
- **Profile Management**: Manage company information and hiring preferences

### General Features:
- **Authentication**: Secure login/logout with JWT tokens
- **Role-based Access**: Different interfaces for workers and employers
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Dynamic job listings and profile updates

## 🛠️ Tech Stack

### Frontend:
- **React.js**: User interface and components
- **React Router**: Navigation and routing
- **Axios**: HTTP client for API calls
- **CSS**: Styling and responsive design

### Backend:
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd labour-net
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
# Create a .env file in the backend directory with the following variables:
MONGO_URI=mongodb://localhost:27017/labour_net
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000

# Start the development server
npm run dev
```

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 4. Database Setup
Make sure MongoDB is running on your system:
- **Local MongoDB**: Start MongoDB service
- **MongoDB Atlas**: Use the connection string from your Atlas cluster

## 📁 Project Structure

```
labour-net/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── jobController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── user.js
│   │   └── Job.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── job.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Authform.js
│   │   │   ├── Joblist.js
│   │   │   ├── JobPostForm.js
│   │   │   └── Navbar.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Jobs.js
│   │   │   ├── Login.js
│   │   │   ├── Profile.js
│   │   │   └── Register.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── .gitignore
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Jobs
- `POST /api/jobs` - Create new job (employers only)
- `GET /api/jobs` - Get all jobs with optional filtering

## 👥 User Roles

### Worker
- Can browse and search jobs
- Can view employer contact information
- Can manage their profile and job preferences
- Cannot post jobs

### Employer
- Can post job listings
- Can manage company profile
- Can set hiring preferences
- Can view all posted jobs

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin request protection
- **Environment Variables**: Sensitive data stored in environment variables

## 🎨 UI/UX Features

- **Responsive Design**: Works on all device sizes
- **Clean Interface**: Modern and intuitive user interface
- **Role-based Navigation**: Different menus for workers and employers
- **Form Validation**: Real-time form validation and error messages
- **Loading States**: Visual feedback during operations

## 🚀 Deployment

### Backend Deployment (Heroku/Netlify)
1. Set up environment variables in your hosting platform
2. Configure MongoDB connection (Atlas recommended for production)
3. Deploy the backend code

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the build folder to your hosting platform
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

[Your Name] - [Your Email]

## 🙏 Acknowledgments

- React.js community
- Node.js and Express.js documentation
- MongoDB documentation
- All contributors and testers

---

**Note**: Make sure to replace placeholder values like `<your-repository-url>`, `[Your Name]`, and `[Your Email]` with your actual information before pushing to GitHub. 