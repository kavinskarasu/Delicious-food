import axios from "axios";

const stripe = Stripe(
  "pk_test_51KsUbhSDMTMOlquGb8WgWWymfSIvz8RYKktfyRIct2m6WgnQduk44xSiWLez0gOwRkypHNBXdg8SD3ZiiiJmRFWf00rHaqn1Nt"
);

export const payment = async () => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/payment/checkout-sessin/`);
    console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
