import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { serviceData } from "@/examples/data";
import type { serviceType } from "@/Types";
import { useEffect, useState } from "react";

// TODO:
// we need to decide how to handle reviews and details data retrieval
const ServiceDetailsPage = () => {
  const [services, setServices] = useState<serviceType[]>(serviceData); 
  const [selectedService, setSelectedService] = useState<serviceType>();

  // use this to update the selected service details and reviews
  useEffect(()=> {

  }, []) 
  

  return (
    <div className="flex w-full h-full gap-4">
      <div className="flex flex-col flex-1 w-1/2 h-full justify-center border-2 rounded-md">
      <div className="flex flex-wrap gap-4 justify-center">
         {services.map((service: serviceType, key: number) => (
          <ServiceCard
            key={key}
            service={service}
            button_action={() => console.log("Redirect to booking")}
            card_action_click={() => setSelectedService(service)}
          />
          
        ))}
        </div>
      </div>
      <div className="flex flex-col flex-1 w-1/2 h-full justify-center gap-2">
        <div className="w-full h-full border-2 rounded-md">
          <div className="flex flex-col w-full h-full justify-center items-center">
            <div className="flex w-full h-full justify-center items-center">{selectedService?.details}</div>
            <div className="flex w-full h-full justify-end items-end p-4">
              <Button>
                Book now
              </Button>
              </div>
          </div>
        </div>
        <div className="w-full h-full border-2 rounded-md">Service Reviews</div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
