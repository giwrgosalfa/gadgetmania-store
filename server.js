
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/create-checkout-session", async (req, res) => {
  const items = JSON.parse(req.body.items);
  const line_items = items.map(item => ({
    price_data: {
      currency: "eur",
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100)
    },
    quantity: 1
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: "https://example.com/success.html",
    cancel_url: "https://example.com/cancel.html"
  });

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log("Server running on port 4242"));
