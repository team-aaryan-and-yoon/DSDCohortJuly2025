import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { apiClient } from "@/utils/apiClient";

const pk = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = pk ? loadStripe(pk) : Promise.resolve(null);

const API_ROOT = import.meta.env.VITE_API_ROOT ?? "http://localhost:8000";

export default function ConfirmAndPayButton() {
  const handleClick = async () => {
    try {
      const res = await apiClient.post<{ session_id?: string; url?: string }>(
        `${API_ROOT}/stripe/checkout/`,
        { price_id: "price_1RvVkSCGGh5HtGAdPBivjsyv" }
      );

      if (res.data?.url) {
        window.location.href = res.data.url;
        return;
      }

      const sessionId = res.data?.session_id;
      if (!sessionId) {
        alert("No session_id returned from server.");
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        alert("Stripe failed to load (check VITE_STRIPE_PUBLIC_KEY).");
        return;
      }
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) alert(error.message);
    } catch (e: any) {
      console.error("checkout error", e?.response || e);
      alert(
        `Checkout failed: ${e?.response?.status || ""} ${
          e?.response?.data ? JSON.stringify(e.response.data) : e?.message || ""
        }`
      );
    }
  };

  return (
    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleClick}>
      Confirm and Pay
    </Button>
  );
}
