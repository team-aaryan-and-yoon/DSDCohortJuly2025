import type { serviceType } from "@/Types"
import cleaningImage from "./images/cleaning.jpg"
const serviceData:serviceType[] = [
    {name: "Service 1", price:100, description:"Cleaning normally", img_url:cleaningImage},
     {name: "Service 2", price:200, description:"Cleaning extra", img_url:cleaningImage},
     {name: "Service 3", price:300, description:"Cleaning special", img_url:cleaningImage},
     {name: "Service 4", price:400, description:"Cleaning extreme", img_url:cleaningImage}
]
export {serviceData};