import Axios from 'axios';
import { React, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Handle Submit called");

        if (!username || !password) {
            toast.error("Please fill in both username and password fields.");
            return;
        }

        try {
            const response = await Axios.post("/register", {
                username,
                password,
            });

            if (response.data.message === "User created successfully!") {
                localStorage.setItem('username', username);
                console.log("User registered!");
                toast.success("Registration successful! Redirecting...");
                setTimeout(() => navigate('/home'), 2000);
            } else if (response.data.message === "Username already exists!") {
                toast.error("Username already exists! Please try a different username.");
                console.log(response.data.message);
            } else {
                console.log(response.data.message || "Registration failed!");
                toast.error("Registration failed!");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            toast.error("An unexpected error occurred. Please try again later.");
        } finally {
            setUsername("");
            setPassword("");
        }
    };

    return (
        <div className='auth-form-container'>
            <form className='login-form'>
                <h2 className='passwords-title' style={{ color: 'green' }}>Register</h2>
                <label htmlFor="username">Username</label>
                <input type="username" placeholder='Enter your username' value={username} onChange={(e) => { setUsername(e.target.value) }} />

                <label htmlFor="password">Password</label>
                <input type="password" placeholder='Enter your password' value={password} onChange={(e) => { setPassword(e.target.value) }} />

                <button className='form-submit-buttons' onClick={handleSubmit}>Register</button>
 
                <Link to='/' className='navigate-link'>
                    <h6>Already have an account? Login</h6> 
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
    )
}

export default Register;
