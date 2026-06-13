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

Tech Stack

Frontend

* React
* Vite
* JavaScript (ES6+)
* CSS

Backend

* Node.js
* Express.js

Database

* SQLite

Project Structure

seatwise/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── App.jsx
├── server/
│   ├── index.js
│   └── seatwise.db
├── public/
├── package.json
├── vite.config.js
└── README.md

Installation

Clone the repository:

git clone <repository-url>
cd seatwise

Install dependencies:

npm install

Running the Project

Start the Backend Server

npm run serve:server

The backend will run on: http://localhost:3001

Start the Frontend

Open a new terminal and run:

npm run dev

The frontend will be available at: http://localhost:5173

Build for Production

npm run build

The production files will be generated in the dist folder.

Deployment

This project can be deployed using:

* Vercel (Frontend)
* Render / Railway / VPS (Backend)

Future Enhancements

* User authentication
* Login and signup functionality
* Email notifications
* Admin dashboard
* Advanced analytics
* QR-based seat check-in
* Reservation history
* Multiple library support

Author

Shivanshi Agarwal

License

This project is developed for educational and portfolio purposes.
