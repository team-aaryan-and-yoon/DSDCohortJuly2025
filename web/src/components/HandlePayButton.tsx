import { Button } from "./ui/button";
import axios from "axios";
export default function HandlePayButton({ priceId }: { priceId: string }) {
  const handlePayNow = () => {
    axios.post("http://localhost:8000/stripe/checkout/", {
      priceId: priceId,
    });
  };

  return (
    <Button
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
      onClick={handlePayNow}
    >
      {" "}
      Click to Pay Now
    </Button>
  );
}
