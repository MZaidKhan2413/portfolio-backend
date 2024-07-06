const express = require("express");
const app = express();
const Contact = require("./models/contact.js");

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

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/api/v1/contact", async (req, res) => {
  let { name, email, subject, message } = req.body;
  const contact = new Contact({ name, email, subject, message });
  await contact.save();
  res.status(200).json({
    message: "Form submitted successfully",
    success: true,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
