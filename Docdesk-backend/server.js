require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const { swaggerUi, specs } = require("./swagger");

const helmet = require("helmet");

// express app
const app = express();

// Security Headers: Helmet helps secure the app by setting various HTTP headers
// This mitigates risks like XSS, Clickjacking, etc.
app.use(helmet());

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration: Restrict access to specific allowed origins
// The ALLOWED_ORIGINS environment variable defines which domains can access the API
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if the incoming origin is in our allowed list
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Swagger documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// routes
const RoutesIndex = require("./routes/routesIndex");
app.use("/api", RoutesIndex);

//connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to db");
  })
  .catch((error) => {
    console.log(error);
  });

// Test Routes

// app.get("/AuthTest", requireAuth, (req, res) => {
//   res.send(`your email : ${req.user.email}`);
// });
// app.use("/api", Auth,  RoutesIndex);
// app.use("/api/admin", AdminAuth,  RoutesIndex);
