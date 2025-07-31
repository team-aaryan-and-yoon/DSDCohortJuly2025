import type { serviceType } from "@/Types"
import cleaningImage from "./images/cleaning.jpg"
const serviceData:serviceType[] = [
     {name: "Service 1", price:100, description:"Cleaning normally", img_url:cleaningImage,
      details:'This service cleans your room with a normal speed and quality', 
      reviews: [{reviewer:"John S", comment:"cool service", rating:5}, {reviewer:"Bob M", comment:"meh service", rating:3}, {reviewer:"Jane K", comment:"she ate my burrito", rating:1}]},
     {name: "Service 2", price:200, description:"Cleaning extra", img_url:cleaningImage, 
      details:'This service cleans your room with a fast speed and quality', 
      reviews: [{reviewer:"John M", comment:"fine service", rating:4}, {reviewer:"Bob K", comment:"fast service", rating:4}, {reviewer:"Jane L", comment:"could be better", rating:3}]},
     {name: "Service 3", price:300, description:"Cleaning special", img_url:cleaningImage, 
      details:'This service cleans your room with a fast speed and better quality', 
      reviews: []},
     {name: "Service 4", price:400, description:"Cleaning extreme", img_url:cleaningImage, 
      details:'This service cleans your room with a extremely fast speed and best quality', 
      reviews: []}
]
export {serviceData};