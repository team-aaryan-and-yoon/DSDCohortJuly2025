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
import type { serviceType } from "@/Types";


interface ServiceProps {
  service: serviceType;
  button_action: () => void;
  card_action_click?: () => void;
}

const ServiceCard = ({ service, button_action, card_action_click }: ServiceProps) => {

  return (
    <Card className="w-full h-full max-w-xs shadow-lg hover:shadow-2xl hover:shadow-blue-400 transition-shadow duration-300" onClick={card_action_click}>
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
      <CardContent className="flex aspect-square items-center justify-center p-6">
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
