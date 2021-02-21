const express = require("express");
const stripe = require("stripe")(
  "sk_test_51ILWL9E1amG94aMaXxQPoSqWVZHjkCeG8qsqlh3qEyYqoU5cwkxxzY6QFhGn5fSPQ45jfuDA77BNlKYKtBTkwGEF00qybU5Fq8"
);
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/stripe_checkout", async (req, res) => {
  const stripeToken = req.body.stripeToken;
  const cantidad = req.body.cantidad;
  const cantidadInEur = Math.round(cantidad * 100);
  const chargeObject = await stripe.charges.create({
    amount: cantidadInEur,
    currency: "eur",
    source: stripeToken,
    capture: false,
    description: "descripcion de prueba",
    receipt_email: "tricardo003@gmail.com",
  });
  try {
    await stripe.charges.capture(chargeObject.id);
    res.json(chargeObject);
  } catch (error) {
    await stripe.refunds.create({ charge: chargeObject.id });
    res.json(chargeObject);
  }
});
app.listen(3000, () => {
  console.log("server on port", 3000);
});
