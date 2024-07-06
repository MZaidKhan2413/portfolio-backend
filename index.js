if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const Contact = require("./models/contact.js");
const ejsMate = require("ejs-mate");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

const mongoose = require("mongoose");
const MONGO_URL = process.env.ATLAS_URL || "mongodb://127.0.0.1:27017/contact";
main()
  .then(() => {
    console.log("Connection established with DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use(express.json());
app.use(cors({
  origin: [process.env.ORIGIN_URL],
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/api/v1/contact", async (req, res) => {
  let { name, email, subject, message } = req.body;
  console.log(name, email, subject, message);
  const contact = new Contact({ name, email, subject, message });
  await contact.save();
  res.status(200).json({
    message: "Form submitted successfully",
    success: true,
  });
});

app.get("/api/v1/contact", async (req, res) => {
  let contacts = await Contact.find({})
  res.render("contactPage.ejs", {contacts});
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
