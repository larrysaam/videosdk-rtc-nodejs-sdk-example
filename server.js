require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { default: fetch } = require("node-fetch");
const jwt = require("jsonwebtoken");

const PORT = 4000;
const app = express();



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//
app.get("/get-token", (req, res) => {
  const API_KEY = 'e59a32c2-6ff5-4202-aea3-4a32b000e4c3';
  const SECRET_KEY = '9e7e05dc3524d2d8e708eefb3fa4c5a29b5a7abf78cbe7882ac385c44ceed569';

  const options = { expiresIn: "10m", algorithm: "HS256" };

  const payload = {
    apikey: API_KEY,
    permissions: ["allow_join", "allow_mod"], // also accepts "ask_join"
  };

  const token = jwt.sign(payload, SECRET_KEY, options);
  res.json({ token });
});

//
app.post("/create-meeting/", (req, res) => {
  const { token, region } = req.body;
  const url = `https://api.videosdk.live/api/meetings`;
  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({ region }),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((result) => res.json(result)) // result will contain meetingId
    .catch((error) => console.error("error", error));
});

//
app.post("/validate-meeting/:meetingId", (req, res) => {
  const token = req.body.token;
  const meetingId = req.params.meetingId;

  const url = `https://api.videosdk.live/api/meetings/${meetingId}`;

  const options = {
    method: "POST",
    headers: { Authorization: token },
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((result) => res.json(result)) // result will contain meetingId
    .catch((error) => console.error("error", error));
});

//
app.listen(PORT, () => {
  console.log(`API server listening at http://localhost:${PORT}`);
});
