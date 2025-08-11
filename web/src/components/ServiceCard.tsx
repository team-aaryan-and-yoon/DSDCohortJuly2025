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
  button_action?: () => void;
  card_action_click?: () => void;
  size: {width:number, height:number};
  disableButton?: boolean;
}

const ServiceCard = ({ service, button_action, card_action_click, size, disableButton=false }: ServiceProps) => {

  return (
    <Card className="w-full mb-16 max-w-lg shadow-lg hover:shadow-2xl hover:shadow-blue-400 transition-shadow duration-300" onClick={card_action_click}>
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between">
            <div>{service.name}</div>
            <div>{service.price}</div>
          </div>
        </CardTitle>
        <div className="flex justify-center">
        <img
          src={service.img_url}
          alt={service.name + "_image"}
          className="flex object-contain rounded"
          width={size.width}
          height={size.height}
        />
        </div>
      </CardHeader>
      <CardContent className="flex justify-center" >
        <CardDescription>{service.description}</CardDescription>
      </CardContent>
      <CardFooter className="w-full justify-end">
        {!disableButton &&
        <CardAction>
          <Button onClick={button_action} className="bg-blue-600 hover:bg-blue-700">Reserve</Button>
        </CardAction>
        }
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
