import { useState } from "react";
import "./App.css"
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error("Please fill in both username and password fields.");
            return;
        }

        try {
            const response = await Axios.post("/login", {
                username,
                password,
            });

            if (response.data.message === "Login successful!") {
                localStorage.setItem('username', username);
                console.log("Login Successful!");
                toast.success("Login successful! Redirecting...");
                setTimeout(() => navigate('/home'), 2000);
            } else if (response.data.message === "User does not exist!") {
                toast.error("User does not exist!");
            } else if (response.data.message === "Invalid password!") {
                toast.error("Invalid password!");
            }
        } catch (err) {
            console.error("Error during login:", err);
            toast.error("An unexpected error occurred. Please try again later.");
        } finally {
            setUsername("");
            setPassword("");
        }
    };

    return (
        <div className="auth-form-container">
            <form className="login-form">
                <h2 className="passwords-title" style={{ color: 'green' }}>Login</h2>
                <label htmlFor="username">Username</label>
                <input type="username" placeholder="Enter your username" value={username} onChange={(e) => { setUsername(e.target.value) }} />

                <label htmlFor="password">Password</label>
                <input type="password" placeholder="Enter your password" value={password} onChange={(e) => { setPassword(e.target.value) }} />

                <button className="form-submit-buttons" onClick={handleSubmit}>Log In</button>
                <Link to='/app-register' className="navigate-link">
                    <h6>Don't have an account? Register</h6>
                </Link>
            </form>
            <ToastContainer
                position="top-center"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default Login;