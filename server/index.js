const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// const _dirname = path.dirname("");
const buildPath = path.join(__dirname, "../client/build");
app.use(express.static(buildPath));

app.use(cors());
app.use(express.json());

const { encrypt, decrypt } = require('./Encryption');

const mysql = require("mysql2/promise");

const db = mysql.createPool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.post("/addpassword", (req, res) => {
    const { password, website, username } = req.body;
    const hashedPassword = encrypt(password);

    db.query("INSERT INTO passwords (password, website, iv, username) VALUES (?,?,?,?)", [hashedPassword.password, website, hashedPassword.iv, username], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Password Entered");
            res.send("Success");
        }
    });
});

app.post("/getpasswords", async (req, res) => {
    const username = req.body.username;
    console.log(username);
    try {
        console.log("Fetching passwords");
        const [passwords] = await db.query("SELECT * FROM passwords where username = ?", [username]);
        console.log(passwords);
        res.send(passwords);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching passwords");
    }
});

app.post("/decryptpassword", (req, res) => {
    res.send(decrypt(req.body));
});

app.post("/deletepassword", async (req, res) => {
    const { id } = req.body;
    try {
        await db.query("DELETE FROM passwords WHERE id = ?", [id]);
        res.send("Password deleted successfully");
    } catch (error) {
        console.error("Error deleting password", error);
        res.status(500).send("Error deleting password");
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    const [user] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    console.log(user);

    if (!user[0]) {
        res.send({ message: "User does not exist!" });
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    // const isPasswordValid = password == user[0].password ? true : false;

    if (!isPasswordValid) {
        res.send({ message: "Invalid password!" });
        return;
    }
    res.send({ message: "Login successful!", user: user[0] });
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    const [existingUser] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    console.log(existingUser);

    if (existingUser.length > 0) {
        res.send({ message: "Username already exists!" });
        return;
    }

    const saltRounds = process.env.SALTROUNDS;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(hashedPassword);
    try {
        await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
        console.log("User entered into database");
        res.send({ message: "User created successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating user!");
    }
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
});