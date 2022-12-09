const express = require("express");

const app = express();

// Parse incoming request bodies in a middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Set up route for webhook
app.post("/webhook", (req, res) => {
  // Process webhook data here

  console.log(req.body);

  // Return a response
  res.json({ message: "Webhook received" });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Webhook listening on port ${port}`);
});
