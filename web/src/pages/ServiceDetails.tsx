const ServiceDetailsPage = () => {
  return (
    <div className="flex w-full h-full gap-4">
      <div className="flex flex-col flex-1 w-1/2 h-full justify-center border-2 rounded-md">
        Service Cards
      </div>
      <div className="flex flex-col flex-1 w-1/2 h-full justify-center gap-2">
        <div className="w-full h-full border-2 rounded-md">Service Details</div>
        <div className="w-full h-full border-2 rounded-md">Service Reviews</div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
