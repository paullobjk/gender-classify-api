const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS header on every response
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Handle preflight OPTIONS requests
app.options("*", (req, res) => res.sendStatus(200));

app.get("/api/classify", async (req, res) => {
  const { name } = req.query;

  // 1. Missing or empty name → 400
  if (name === undefined || name === "") {
    return res.status(400).json({
      status: "error",
      message: "Missing required query parameter: name",
    });
  }

  // 2. Non-string name → 422
  //    Express always parses query params as strings, but arrays come in as arrays
  if (typeof name !== "string") {
    return res.status(422).json({
      status: "error",
      message: "Invalid type for parameter: name must be a string",
    });
  }

  try {
    // Call Genderize API
    const genderizeRes = await axios.get("https://api.genderize.io", {
      params: { name },
      timeout: 4500, // stay well under 500ms processing time
    });

    const apiData = genderizeRes.data;

    // Edge case: no prediction available
    if (!apiData.gender || apiData.count === 0) {
      return res.status(200).json({
        status: "error",
        message: "No prediction available for the provided name",
      });
    }

    // Extract & rename fields
    const gender = apiData.gender;
    const probability = apiData.probability;
    const sample_size = apiData.count;

    // Confidence logic: both conditions must be true
    const is_confident = probability >= 0.7 && sample_size >= 100;

    // UTC ISO 8601 timestamp — generated fresh on every request
    const processed_at = new Date().toISOString();

    return res.status(200).json({
      status: "success",
      data: {
        name,
        gender,
        probability,
        sample_size,
        is_confident,
        processed_at,
      },
    });
  } catch (error) {
    // Genderize API unreachable or bad gateway
    if (error.response) {
      return res.status(502).json({
        status: "error",
        message: "Bad gateway: upstream API returned an unexpected response",
      });
    }

    // Network / timeout errors
    return res.status(500).json({
      status: "error",
      message: "Internal server error while contacting external API",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
