import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import type { serviceType } from "@/Types";

interface ServiceProps {
  service: serviceType;
  button_action?: () => void;
  card_action_click?: () => void;
  disableButton?: boolean;
}

const ServiceCard = ({
  service,
  button_action,
  card_action_click,
  disableButton = false,
}: ServiceProps) => {
  return (
    <Card
      className="w-full min-w-[300px] shadow-lg hover:shadow-2xl hover:shadow-blue-400 transition-shadow duration-300 overflow-hidden flex flex-col"
      onClick={card_action_click}>
      <CardHeader className="px-5 pt-2 pb-0 flex-shrink-0">
        <CardTitle className="mb-0">
          <div className="flex justify-between items-center w-full">
            <div className="truncate mr-3 text-left py-1 max-w-[70%]">
              {service.name}
            </div>
            <div className="flex-shrink-0 text-right max-w-[25%] truncate py-1 text-blue-600 font-medium">
              {typeof service.price === "number"
                ? `$${service.price.toFixed(2)}`
                : service.price}
            </div>
          </div>
        </CardTitle>
        <div className="flex justify-center items-center p-1">
          <img
            src={service.image_url}
            alt={`${service.name} image`}
            className="w-full object-contain rounded h-40"
          />
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-1 pt-0">
        <CardDescription className="text-center text-sm">
          {service.description}
        </CardDescription>
      </CardContent>
      {!disableButton && (
        <CardFooter className="px-5 pt-1 pb-2">
          <CardAction className="w-full flex justify-end">
            <Button
              onClick={button_action}
              className="bg-blue-600 hover:bg-blue-700">
              Reserve
            </Button>
          </CardAction>
        </CardFooter>
      )}
    </Card>
  );
};

export default ServiceCard;
