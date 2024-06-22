import './App.css';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'

const Home = () => {
    const [website, setWebsite] = useState("");
    const [password, setPassword] = useState("");
    const [passwordList, setPasswordList] = useState([])
    const username = localStorage.getItem('username');
    const [viewState, setViewState] = useState({});

    useEffect(() => {
        const fetchPasswords = async () => {
            try {
                const response = await Axios.post('/getpasswords', { username: username });
                console.log(response.data);
                setPasswordList(response.data);
            } catch (error) {
                console.error("Error fetching passwords", error);
            }
        };

        if (username) {
            fetchPasswords();
        }
    }, [username]);

    const addPassword = async () => {
        toast.success("Adding password...");
        Axios.post('/addpassword', { password: password, website: website, username: username });
        const response = await Axios.post('/getpasswords', { username: username });
        setPasswordList(response.data);
    };

    const decryptPassword = (encryption) => {
        const currentView = viewState[encryption.id] || 'website';

        if (currentView === 'password') {
            setViewState({ ...viewState, [encryption.id]: 'website' });
        } else {
            Axios.post('/decryptpassword', { password: encryption.password, iv: encryption.iv }).then((response) => {
                setPasswordList(passwordList.map((val) => {
                    return val.id === encryption.id ? { ...val, decryptedPassword: response.data } : val;
                }));
                setViewState({ ...viewState, [encryption.id]: 'password' });
            });
        }
    };


    return (
        <div className="App">
            <div className="addPassword">
                <h2 className='passwords-title' style={{ color: 'green ' }}>Add Password</h2>
                <input type="text" value={website} placeholder="Enter the website here" onChange={(e) => { setWebsite(e.target.value) }} />
                <input type="password" value={password} placeholder="Enter the password here" onChange={(e) => { setPassword(e.target.value) }} />
                <button type="button" className='form-submit-buttons' onClick={addPassword}>Save Password</button>
            </div>

            <div className='passwords'>
                <h1 className='passwords-title'>Your Passwords:</h1>
                {passwordList && passwordList.map((val, key) => {
                    const currentView = viewState[val.id] || 'website';
                    return (
                        <div className='password' onClick={() => { decryptPassword({ password: val.password, iv: val.iv, id: val.id }) }} key={key}>
                            <h3>{currentView === 'website' ? val.website : val.decryptedPassword}</h3>
                        </div>
                    );
                })}
            </div>
            <Link to='/' className='logout-link'>Log Out</Link>
            <ToastContainer
                position="top-center"
                autoClose={2000}
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
}

export default Home;
