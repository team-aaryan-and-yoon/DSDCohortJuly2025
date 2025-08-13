import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
//import { cleaningServiceData, maintenanceServiceData } from "@/examples/data";
import type { serviceType } from "@/Types";
import { useEffect, useState } from "react";
import ReviewComment from "@/components/ReviewComment";
import { Rating } from "@smastrom/react-rating";
import { useNavigate, useParams } from "react-router-dom";
import type { EmblaCarouselType } from "embla-carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useCart } from "@/contexts/CartContext";
import apiClient from "@/utils/apiClient";

const VALID = ["cleaning", "maintenance"] as const;
type RouteType = (typeof VALID)[number];

const ServiceDetailsPage = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const urlType = (type ?? "").toLowerCase() as RouteType;
  const [allServices, setAllServices] = useState<{ [key: string]: serviceType[] } | null>(null);

  //const initialServices = urlType === "maintenance" ? maintenanceServiceData : cleaningServiceData;
  const [services, setServices] = useState<serviceType[]>([]);
  const [selectedService, setSelectedService] = useState<serviceType | null>(null);

  const [embla, setEmbla] = useState<EmblaCarouselType | undefined>(undefined);

  const { setItems } = useCart();  
  const addItem = (item: serviceType) => {
    setItems(prev => [...prev, item]); 
  };

  useEffect(() => {
    apiClient.get('services/')
      .then(response => {
        setAllServices(response.data);
      })
      .catch(error => {
        console.error("Failed to fetch services:", error);
      });
  }, []); //runs once on mount

  // Redirect invalid types
  useEffect(() => {
      if (!urlType) {
      navigate("/services/cleaning", { replace: true });
      return;
  }
    if (urlType && !VALID.includes(urlType)) {
      navigate("/services/cleaning", { replace: true });
    }
  }, [urlType, navigate]);

  // Update dataset & selection on route change
  useEffect(() => {
    if (allServices && urlType && allServices[urlType]) {
      const currentServices = allServices[urlType];
      setServices(allServices[urlType]);
      if (currentServices.length > 0) {
        setSelectedService(allServices[urlType][0]);
      }
    } 
  }, [urlType, allServices]);

 useEffect(() => {
  if (!embla) return;

  const onSelect = () => {
    const i = embla.selectedScrollSnap();
    const next = services[i];
    if (next) setSelectedService(next);
  };

  embla.on("select", onSelect);
  onSelect(); // sync on mount

  return () => {
    embla.off("select", onSelect); // ensure cleanup runs, but returns void
  };
}, [embla, services]);

  return (
    <div className="flex w-full h-[100svh] gap-4  px-4 py-8">
      {/* Left: Carousel */}
      <div className="flex flex-col h-full w-1/2 border-2 rounded-md">
        <div className="flex h-full w-full items-center justify-center gap-4 p-4">
          <Carousel
            orientation="vertical"
            opts={{
              align: "center",            // both top & bottom peek
              containScroll: "trimSnaps", // avoid dead zones at ends
            }}
            className="w-full"
            setApi={setEmbla}           
            plugins={[
              WheelGesturesPlugin({
                forceWheelAxis: "y",      // vertical wheel controls the carousel
              }),
            ]}
          >
      
            <CarouselContent className="h-[700px] overscroll-y-contain">
              {services.map((service: serviceType, i: number) => (
                <CarouselItem
                  key={i}
                  className="basis-[50%] flex justify-center items-center cursor-pointer"
                  onClick={() => {
                    setSelectedService(service);
                    embla?.scrollTo(i);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedService(service);
                      embla?.scrollTo(i);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${service.name}`}
                >
                  <ServiceCard
                    service={service}
                    card_action_click={() => {
                      setSelectedService(service);
                      embla?.scrollTo(i);
                    }}
                    size={{ width: 500, height: 500 }}
                    disableButton={true}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

      {/* Right: Details & Reviews */}
      <div className="flex flex-col flex-1 w-1/2 h-full justify-center gap-2">
        <div className="w-full h-full border-2 rounded-md">
          <div className="flex flex-col w-full h-full justify-center items-center">
            {/* Details */}
            <div className="flex flex-col w-full h-full">
              <div className="flex w-full justify-between p-4">
                <div className="font-bold">{selectedService?.name}</div>
                <div>
                  {selectedService?.reviews?.length ? (
                    <Rating
                      style={{ maxWidth: 125 }}
                      value={
                        selectedService?.reviews.reduce(
                          (sum, review) => sum + review.rating,
                          0
                        ) / selectedService?.reviews.length
                      }
                      readOnly
                      isDisabled
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="px-4 pb-2">{selectedService?.details}</div>
            <div className="flex w-full h-full justify-end items-end p-4">
              <Button onClick={()=> {
                addItem(selectedService);
                navigate('/book-service', { state: {service:
                  selectedService }});
                }}>
                  Book now
                </Button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="flex flex-col w-full h-full border-2 rounded-md gap-4 p-4">
          {selectedService?.reviews?.map((review, key) => (
            <div key={key} className="w-full border-2 rounded-md">
              <ReviewComment
                rating={review.rating}
                reviewer={review.reviewer}
                comment={review.comment}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
