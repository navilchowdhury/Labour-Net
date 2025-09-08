@echo off
echo Starting Labour Net Backend Server...
cd /d "c:\Users\ASUS\Labour Net\backend"
set MONGO_URI=mongodb://127.0.0.1:27017/labour-net
set JWT_SECRET=labour-net-secret-key-2024
set PORT=5000
node server.js
pause
