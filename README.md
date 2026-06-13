SeatWise

SeatWise is a smart library seat booking and management system designed to help students find, reserve, and manage study spaces efficiently. The platform provides an interactive interface for viewing available seats, making reservations, and improving the overall study experience.

Features

* Interactive library seat map
* Real-time seat availability tracking
* Seat reservation and booking system
* User-friendly dashboard
* Study space information page
* Responsive design for desktop and mobile devices
* Backend API for seat management
* SQLite database integration



Setup & Installation

Prerequisites

* Node.js (v18 or higher)
* npm (v8 or higher)

Clone the Repository

git clone <repository-url>
cd seatwise

Install Dependencies

npm install

⸻

Environment Variables

Create a .env file in the project root directory and add the following variable:

VITE_API_URL=http://localhost:3001

Environment Variable Reference

Variable	Description
VITE_API_URL	Base URL of the backend API used by the frontend application

For production deployments, replace the local URL with your deployed backend URL:

VITE_API_URL=https://your-backend-domain.com

⸻

Running the Application

SeatWise consists of two parts:

1. Frontend (React + Vite)
2. Backend (Node.js + Express)

Both services must be running for the application to function correctly.

Start the Backend

Open a terminal and run:

npm run serve:server

Backend server will start at:

http://localhost:3001

Start the Frontend

Open a second terminal and run:

npm run dev

Frontend application will start at:

http://localhost:5173

Open the frontend URL in your browser to access SeatWise.

⸻

Available Scripts

npm run dev

Starts the Vite development server.

npm run serve:server

Starts the Express backend server.

npm run build

Creates an optimized production build.

npm run preview

Previews the production build locally.

⸻

Author

Shivanshi Agarwal

License

This project is developed for educational and portfolio purposes.
