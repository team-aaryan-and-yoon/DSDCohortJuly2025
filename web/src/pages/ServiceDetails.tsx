import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
//import { cleaningServiceData, maintenanceServiceData } from "@/examples/data";
import type { serviceType } from "@/Types";
import { useEffect, useState } from "react";
import ReviewComment from "@/components/ReviewComment";
import { Rating } from "@smastrom/react-rating";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import apiClient from "@/utils/apiClient";

const VALID = ["cleaning", "maintenance"] as const;
type RouteType = (typeof VALID)[number];

const ServiceDetailsPage = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const urlType = (type ?? "").toLowerCase() as RouteType;
  const [allServices, setAllServices] = useState<{
    [key: string]: serviceType[];
  } | null>(null);

  //const initialServices = urlType === "maintenance" ? maintenanceServiceData : cleaningServiceData;
  const [services, setServices] = useState<serviceType[]>([]);
  const [selectedService, setSelectedService] = useState<serviceType | null>(
    null
  );

  const { setItems } = useCart();
  const addItem = (item: serviceType) => {
    setItems((prev) => [...prev, item]);
  };

  useEffect(() => {
    apiClient
      .get("services/")
      .then((response) => {
        setAllServices(response.data);
      })
      .catch((error) => {
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
    // Initialize the selected service when services are loaded
    if (services.length > 0 && !selectedService) {
      setSelectedService(services[0]);
    }
  }, [services, selectedService]);

  return (
    <div className="flex w-full h-[100svh] gap-4 px-4 py-8">
      {/* Left: Service List */}
      <div className="flex flex-col h-full w-1/2 border-2 rounded-md overflow-hidden">
        <div className="h-full w-full p-4">
          <div className="w-full h-full overflow-y-auto overflow-x-hidden pr-2">
            <div className="flex flex-col gap-8 pb-8 pt-2 w-full min-w-[320px]">
              {services.map((service: serviceType, i: number) => (
                <div
                  key={i}
                  className="flex justify-center cursor-pointer w-full"
                  onClick={() => setSelectedService(service)}>
                  <div
                    className={`w-full max-w-lg p-2 rounded-lg transition-all duration-200 ${
                      selectedService?.name === service.name
                        ? "bg-blue-100 shadow-md"
                        : ""
                    }`}>
                    <ServiceCard
                      service={service}
                      card_action_click={() => setSelectedService(service)}

                      disableButton={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
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
              <Button
                onClick={() => {
                  if (selectedService) {
                    addItem(selectedService);
                    navigate("/book-service", {
                      state: { service: selectedService, serviceType: urlType },
                    });
                  }
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
