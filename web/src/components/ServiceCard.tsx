import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";

interface serviceType {
  name: string;
  price: number;
  description: string;
  img_url: string;
}
interface ServiceProps {
  service: serviceType;
  button_action: () => void;
}

const ServiceCard = ({ service, button_action }: ServiceProps) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between">
            <div>{service.name}</div>
            <div>${service.price}</div>
          </div>
        </CardTitle>
        <img
          src={service.img_url}
          alt={service.name + "_image"}
          className="flex w-full h-full object-contain flex-shrink-0 rounded-md"
        />
      </CardHeader>
      <CardContent>
        <CardDescription>{service.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex w-full justify-end">
        <CardAction>
          <Button onClick={button_action}>Reserve</Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
