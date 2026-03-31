require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

connectDB();

app.use(require("./routers/authRoutes.js"));
app.use(require("./routers/friendRoutes.js"));
app.use(require("./routers/chatRoutes.js"));
app.use(require("./routers/groupRoutes.js"));
app.use(require("./routers/postRoutes.js"));
app.use(require("./routers/commentRoutes.js"));

app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

const server = app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});

const setupSocket = require("./sockets/socketHandler");
setupSocket(server);