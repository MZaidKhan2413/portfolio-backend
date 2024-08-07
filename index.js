if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const cors = require("cors");
const Contact = require("./models/contact.js");
const methodOverride = require("method-override");
const truncateString = require("./utils/truncateStr.js");

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.ATLAS_URL || "mongodb://127.0.0.1:27017/contact";

// Mongoose connection setup
main()
  .then(() => {
    console.log("Connection established with DB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ["https://zaid-khan.vercel.app"],
  methods: ['GET', 'POST'],
  credentials: true,
}));

// Setting up EJS
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));

// Routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/api/v1/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    res.status(200).json({
      message: "Form submitted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({
      message: "An error occurred while submitting the form",
      success: false,
    });
  }
});

app.get("/api/v1/contact", async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.render("contactPage.ejs", { contacts, truncate: truncateString });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      message: "An error occurred while fetching contacts",
      success: false,
    });
  }
});

app.get("/api/v1/contact/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
        success: false,
      });
    }
    res.render("message.ejs", { contact });
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({
      message: "An error occurred while fetching contact",
      success: false,
    });
  }
});

app.delete("/api/v1/contact/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
        success: false,
      });
    }
    res.redirect("/api/v1/contact");
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({
      message: "An error occurred while deleting contact",
      success: false,
    });
  }
})

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
