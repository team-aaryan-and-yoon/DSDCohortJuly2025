import ReviewComment from "@/components/ReviewComment";
import ServiceCard from "@/components/ServiceCard";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { reviewType, serviceType } from "@/Types";
import AutoScroll from 'embla-carousel-auto-scroll'
import { useRef } from "react";

const HomePage = () => {
    const services:serviceType[] = [
        {name: "Cleaning", price:'Starting at $100', description: "Our cleaning service description", details:"", img_url:"/images/cleaning.png",reviews:[]},
        {name: "Plumbing", price:'Starting at $100', description: "Our plumbing service description", details:"", img_url:"/images/handyman.png",reviews:[]},
        
    ]
    const reviews:reviewType[] = [
        {
            reviewer: "John S", comment: "The best cleaning service in town!", rating: 5,
            avatar_url: undefined
        },
        {
            reviewer: "Mary L", comment: "Truely a saver", rating: 5,
            avatar_url: undefined
        },
        {
            reviewer: "Bob H", comment: "Fixed my cleaning OCD", rating: 5,
            avatar_url: "https://github.com/shadcn.png"
        },
    ];

    const plugin = useRef(AutoScroll({
                        speed: 1,             
                        startDelay: 0,      
                        stopOnInteraction: false, 
                        })
    );
    return (
        <div className="w-full h-full">
            {/* Header */}
            <div className="pt-10 bg-cyan-100">
            <span className="font-bold pl-10 text-2xl">Your home, our hands-off promise...</span>
            <div className="flex w-full max-w-full justify-center ">
            
                <img src={"/images/logo.png"}  height={500} width={500}/>
            </div>
            </div>
            {/* Services */}
            <div className="flex flex-col py-5">
                <div>
                    <span className="font-bold pl-10 text-xl">Our services</span>
                </div>
            <div className="flex w-full justify-center gap-16 overflow-x-auto">
                {services.map((service, key) => (
                    <ServiceCard key={key} service={service} button_action={() => console.log(service.name)} size={{width:200, height:200}}/>
                ))}
            </div>  
            </div>
            {/* Reviews */}
            <div className="flex flex-col w-full bg-cyan-100">
                <div><span className="font-bold pl-10 text-xl">Previous clients</span></div>
                <div className="flex w-full justify-center items-center ">
                    <Carousel  
                        plugins={[plugin.current]}
                        opts={{ loop: true, align: "start" }}
                        className="w-11/12 justify-center">
                        <CarouselContent className="w-full py-4">
                            {reviews.map((review, key)=> (
                                <CarouselItem className="basis-1/2">
                                <ReviewComment key={key} reviewer={review.reviewer} comment={review.comment} rating={review.rating} avatar_url={review.avatar_url}/>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
            {/* Provider of the month */}
            <div className="w-full">
                <div>
                  
                    <div><span className="font-bold pl-10 text-xl">Provider of the Month</span>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    );
}
export default HomePage;