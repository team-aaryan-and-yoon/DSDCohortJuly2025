import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cleaningServiceData, maintenanceServiceData } from "@/examples/data";
import type { serviceType } from "@/Types";
import { useEffect, useState } from "react";
import ReviewComment from "@/components/ReviewComment";
import { Rating } from "@smastrom/react-rating";
import { useNavigate, useParams } from "react-router-dom";

/* TODO:
 - we need to decide how to handle reviews and details data retrieval
 - add the fetching mechanism/logic
 - improve UI/UX 
*/


const VALID = ["cleaning", "maintenance"] as const;
type RouteType = (typeof VALID)[number];

const ServiceDetailsPage = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const urlType = (type ?? "").toLowerCase() as RouteType;

  // Redirect invalid types to a default
  useEffect(() => {
    if (urlType && !VALID.includes(urlType)) {
      navigate("/services/cleaning", { replace: true });
    }
  }, [urlType, navigate]);

  const [services, setServices] = useState<serviceType[]>(cleaningServiceData); 
  const [selectedService, setSelectedService] = useState<serviceType>();

  // use this to update the selected service details and reviews through axios or fetch
  useEffect(()=> {
    if (urlType == "maintenance") {
      setServices(maintenanceServiceData);
      setSelectedService(maintenanceServiceData[0])
    }
    else{ 
      setServices(cleaningServiceData);
      setSelectedService(cleaningServiceData[0])
    }
  }, [urlType]) 
  

  return (
    <div className="flex w-full h-full gap-4 ">
      <div className="flex flex-col h-full w-1/2 border-2 rounded-md ">
        <div className="flex  h-full w-full items-center justify-center gap-4 p-4">
          <Carousel 
          orientation="vertical"
          opts={{
          align: "start", 
          }}
          className="w-full">
             <CarouselContent className="h-[600px] w-full">
              {services.map((service: serviceType, key: number) => (
              <CarouselItem className="flex flex-grow basis-full justify-center items-center"key={key}>
                <ServiceCard
                  service={service}
                  button_action={() => console.log("Redirect to booking")} // Need to update to fit purpose
                  card_action_click={() => setSelectedService(service)}
                  size={{width:500,height:500}}
                />
              </CarouselItem>
               ))}
      
            </CarouselContent>

        </Carousel>
        </div>
      </div>
      <div className="flex flex-col flex-1 w-1/2 h-full justify-center gap-2">
        <div className="w-full h-full border-2 rounded-md">
          <div className="flex flex-col w-full h-full justify-center items-center">
            {/* Need to update to fit purpose */}
            <div className="flex flex-col w-full h-full ">
              <div className="flex w-full justify-between p-4"> 
                <div className="font-bold">
                  {selectedService?.name}
                </div>
                <div>
                {selectedService?.reviews && selectedService.reviews.length > 0
                    ? <Rating style={{ maxWidth: 125 }} value={selectedService.reviews.reduce((sum, review) => sum + review.rating, 0) /
                      selectedService.reviews.length} readOnly isDisabled/>: ""}
                </div>
              </div>
            </div>
            <div>
              {selectedService?.details } 
            </div>
            <div className="flex w-full h-full justify-end items-end p-4">
              <Button>
                Book now
              </Button>
              </div>
          </div>
        </div>
        {/*Need to create reviews component*/}
        <div className="flex flex-col w-full h-full border-2 rounded-md gap-4 p-4">{selectedService?.reviews.map((review, key) => 
          <div key={key} className="w-full border-2 rounded-md">
            <ReviewComment rating={review.rating} reviewer={review.reviewer} comment={review.comment}/>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;

