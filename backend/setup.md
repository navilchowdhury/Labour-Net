# Backend Setup Guide

## Environment Variables Required

Create a `.env` file in the backend directory with the following variables:

```
MONGO_URI=mongodb://localhost:27017/labour_net
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

## Steps to Run:

1. Make sure MongoDB is installed and running on your system
2. Create the `.env` file with the above variables
3. Run `npm install` (already done)
4. Run `npm run dev` to start the development server

## Common Issues:

1. **MongoDB not running**: Install MongoDB or use MongoDB Atlas
2. **Port already in use**: Change PORT in .env file
3. **Connection refused**: Check if MongoDB is running on the correct port 