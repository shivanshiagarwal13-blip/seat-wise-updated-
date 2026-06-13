# SeatWise – Library Seat Booking App

## Deploy to Vercel (Step-by-Step)

### Step 1: Install Node.js
Go to https://nodejs.org and download the "LTS" version. Install it like any normal app.

### Step 2: Install Git
Go to https://git-scm.com/downloads and install Git.

### Step 3: Create a GitHub account
Go to https://github.com and sign up for free.

### Step 4: Upload this project to GitHub
1. Open a terminal / command prompt
2. Run these commands one by one:
   ```
   cd seatwise
   git init
   git add .
   git commit -m "first commit"
   ```
3. Go to github.com → click "New repository" → name it "seatwise" → click "Create repository"
4. Copy the commands GitHub shows you (they start with `git remote add origin...`) and paste them in your terminal

### Step 5: Deploy to Vercel
1. Go to https://vercel.com and sign up with your GitHub account
2. Click "Add New Project"
3. Select your "seatwise" repository
4. Under "Framework Preset", select **Vite**
5. Click "Deploy"
6. Wait ~1 minute — your site is live! 🎉

## Login Credentials (Demo)
- **Student**: any ID + any password → goes to Library Map
- **Librarian**: any ID + any password → goes to Librarian Dashboard
