import ReviewComment from "@/components/ReviewComment";
import ServiceCard from "@/components/ServiceCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { reviewType, serviceType } from "@/Types";
import AutoScroll from 'embla-carousel-auto-scroll'
import { Award, Calendar, CheckCircle, ChevronRight, Clock, Shield, Star } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";



const HomePage = () => {
    const navigate = useNavigate();
    const services:serviceType[] = [
        {name: "Cleaning", price:'Starting at $100', description: "Our cleaning service description", details:"", img_url:"/images/cleaning.png",reviews:[]},
        {name: "Maintenance", price:'Starting at $100', description: "Our plumbing service description", details:"", img_url:"/images/handyman.png",reviews:[]},
        
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
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}  
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                        Your home, our  
                        <span className="text-blue-600"> hands-off </span>
                        promise...
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                        Professional handyman and cleaning services for all your home
                        repair and maintenance needs. Fast, reliable, and affordable
                        solutions delivered by certified experts.
                        </p>
                    </div>

                    <div className="flex items-center space-x-8 pt-4">
                            <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">24/7</div>
                            <div className="text-sm text-gray-600">Support</div>
                        </div>
                            <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">100%</div>
                            <div className="text-sm text-gray-600">Satisfaction</div>
                        </div>
                            <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">2Hr</div>
                            <div className="text-sm text-gray-600">Response</div>
                        </div>
                    </div>
                    </div>
                    <div className="relative">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 ">
                        <img
                        src="/images/logo.png"
                        alt="Professional handyman"
                        className="w-full h-96 object-cover rounded-xl"
                        />
                    </div>
                    </div>
                </div>
            </div>
        </section>
        {/* Services */}
        <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Expert Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From minor repairs to major installations, we handle it all with
              precision and care.
            </p>
          </div>
          <div className={`grid md:grid-cols-2 lg:grid-cols-${services.length} gap-8`}>
            {services.map((service, key) => (
                <ServiceCard key={key} service={service} card_action_click={()=> navigate(`services/${service.name.toLowerCase()}`)} size={{width:200, height:200}}/>
            ))}
          </div>
        </div>
        </section>

         <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Fast Response
              </h3>
              <p className="text-gray-600">
                We respond to all service requests within 2 hours and can often
                provide same-day service.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Fully Insured
              </h3>
              <p className="text-gray-600">
                All our technicians are licensed, bonded, and insured for your
                complete peace of mind.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Quality Guaranteed
              </h3>
              <p className="text-gray-600">
                We stand behind our work with a 100% satisfaction guarantee and
                comprehensive warranty.
              </p>
            </div>
          </div>
        </div>
      </section>
        {/* Reviews */}
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    What Our Customers Say
                    </h2>
                    <p className="text-xl text-gray-600">
                    Real reviews from satisfied homeowners
                    </p>
                </div>
                <Carousel  
                    plugins={[plugin.current]}
                    opts={{ loop: true, align: "start" }}>
                    <CarouselContent className="w-full py-4">
                        {reviews.map((review, key)=> (
                            <CarouselItem key={key} className="basis-full sm:basis-1/2">
                                <ReviewComment  reviewer={review.reviewer} comment={review.comment} rating={review.rating} avatar_url={review.avatar_url}/>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div> 
        </section>
      
        {/* Service Provider of the Month Section */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <div className="flex items-center justify-center space-x-2 mb-4">
                <Award className="h-8 w-8 text-yellow-500" />
                <h2 className="text-4xl font-bold text-gray-900">
                    Service Provider of the Month
                </h2>
                </div>
                <p className="text-xl text-gray-600">
                Recognizing excellence in our community
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">JD</span>
                    </div>
                    <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                        John Davis
                    </h3>
                    <p className="text-blue-600 font-semibold">
                        Master Electrician
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className="h-4 w-4 text-yellow-400 fill-current"
                        />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                        4.9 (127 reviews)
                        </span>
                    </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-lg text-gray-700 leading-relaxed">
                    "John has been with HandsOff for over 5 years and consistently
                    delivers exceptional service. His attention to detail and
                    commitment to safety make him our top-rated electrician."
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-semibold text-gray-900">
                            Projects Completed
                        </span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">342</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <span className="font-semibold text-gray-900">
                            Avg. Response Time
                        </span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">1.2hr</p>
                    </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                    <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                    >
                        Residential Wiring
                    </Badge>
                    <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                    >
                        Panel Upgrades
                    </Badge>
                    <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                    >
                        Smart Home Install
                    </Badge>
                    <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                    >
                        Emergency Repairs
                    </Badge>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={()=> navigate("/services/maintenance")}>
                    Book John Now
                    <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
                </div>

                <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="absolute -top-4 -right-4 bg-yellow-500 text-white p-3 rounded-full">
                    <Award className="h-6 w-6" />
                    </div>
                    <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop"
                    alt="John Davis - Service Provider of the Month"
                    className="w-full h-96 object-cover rounded-xl mb-6"
                    />
                    <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Why John Stands Out
                    </h4>
                    <p className="text-gray-600 text-sm">
                        Licensed master electrician with 15+ years of experience.
                        Specializes in residential electrical work with a focus on
                        safety and code compliance.
                    </p>
                    </div>
                </div>
                </div>
            </div>  
            </div>
        </section>

        </div>
    );
}
export default HomePage;