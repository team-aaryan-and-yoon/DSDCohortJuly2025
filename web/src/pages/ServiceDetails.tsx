import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { serviceData } from "@/examples/data";
import type { serviceType } from "@/Types";
import { useEffect, useState } from "react";

/* TODO:
 - we need to decide how to handle reviews and details data retrieval
 - add the fetching mechanism/logic
 - improve UI/UX 
*/
const ServiceDetailsPage = () => {
  const [services, setServices] = useState<serviceType[]>(serviceData); 
  const [selectedService, setSelectedService] = useState<serviceType>();

  // use this to update the selected service details and reviews through axios or fetch
  useEffect(()=> {

  }, []) 
  

  return (
    <div className="flex w-full h-full gap-4 ">
      <div className="flex flex-col h-full w-1/2 border-2 rounded-md ">
        <div className="flex flex-wrap h-full w-full items-center justify-center gap-4 p-4">
          <Carousel opts={{
    align: "start",
    loop: true,
  }}>
             <CarouselContent>
              {services.map((service: serviceType, key: number) => (
              <CarouselItem className="flex-grow basis-1/2"key={key}>
                <ServiceCard
                  service={service}
                  button_action={() => console.log("Redirect to booking")} // Need to update to fit purpose
                  card_action_click={() => setSelectedService(service)}
                />
              </CarouselItem>
               ))}
      
            </CarouselContent>
      
            <CarouselPrevious className="h-full" />

            <CarouselNext className="h-full" />
        </Carousel>
        </div>
      </div>
      <div className="flex flex-col flex-1 w-1/2 h-full justify-center gap-2">
        <div className="w-full h-full border-2 rounded-md">
          <div className="flex flex-col w-full h-full justify-center items-center">
            {/* Need to update to fit purpose */}
            <div className="flex w-full h-full justify-center items-center">{selectedService?.details } </div>
            <div className="flex w-full h-full justify-end items-end p-4">
              <Button>
                Book now
              </Button>
              </div>
          </div>
        </div>
        {/*Need to create reviews component*/}
        <div className="w-full h-full border-2 rounded-md">Service Reviews</div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
