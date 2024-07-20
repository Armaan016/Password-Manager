This project is a secure password manager web application that I developed.

Tech Stack:
Frontend: ReactJS
Backend: NodeJS, ExpressJS
Database: MySQL
Encryption: Custom Encryption Function (using 'crypto' library)
Other: Axios (for making HTTP requests), bcrypt (for password hashing), dotenv (for managing environment variables), React Toastify (for displaying notifications)

Features:
1. User Registration and Login with Username and Password. This functionality protects unauthorized access to password data.
2. Secure Password Storage using Encryption.
3. Adding New Passwords with Website URLs.
4. Viewing Saved Passwords (passwords are decrypted on demand).
5. Deleting Saved Passwords.

Setup Instructions: 
1. Clone Repository: Use 'git clone https://github.com/Armaan016/Password-Manager.git' to clone this project to your local machine.
2. Install Dependencies: Install all required libraries using 'npm install'.
3. Database Setup: Ensure MySQL is installed and running locally. Update database configurations if necessary.
4. Run Application: Start the application with 'npm start'. Access Application: Open http://localhost:3000 in your web browser.
