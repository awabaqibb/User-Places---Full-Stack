const express = require("express");
const app = express();
const placeRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use("/api/places", placeRoutes);
app.use("/api/users", usersRoutes);

app.use((error, request, response, next) => {
  if (response.headerSent) {
    return next(error);
  }
  response.status(error.code || 500);
  response.json({ message: error.message || "unknown error occurred" });
});

app.listen(5000);
