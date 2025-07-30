import ServiceCard from "@/components/ServiceCard";
import { serviceData } from "@/examples/data";
import type { serviceType } from "@/Types";
import { useEffect, useState } from "react";


const ServiceDetailsPage = () => {
  const [services, setServices] = useState<serviceType[]>(serviceData); 

  useEffect(()=> {

  }, [])
 

  return (
    <div className="flex w-full h-full gap-4">
      <div className="flex flex-col flex-1 w-1/2 h-full justify-center border-2 rounded-md">
      <div className="flex flex-wrap gap-2 justify-center">
         {services.map((service: serviceType, key: number) => (
          
          <ServiceCard
            key={key}
            service={service}
            button_action={() => console.log("Redirect to booking")}
          />
          
        ))}
        </div>
      </div>
      <div className="flex flex-col flex-1 w-1/2 h-full justify-center gap-2">
        <div className="w-full h-full border-2 rounded-md">Service Details</div>
        <div className="w-full h-full border-2 rounded-md">Service Reviews</div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
