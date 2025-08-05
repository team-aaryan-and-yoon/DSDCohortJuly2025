        
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';  
import { Badge } from '@/components/ui/badge';
import { 
  HeartHandshake, 
  Hammer,
  Star, 
  Shield, 
  Clock, 
  Phone,  
  ChevronRight,
  Zap,
  Droplets,
  Paintbrush, 
  Award,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const services = [
    { icon: Hammer, title: 'Home Repairs', description: 'Expert fixing and maintenance for all your home needs' },
    { icon: Zap, title: 'Electrical Work', description: 'Safe and certified electrical installations and repairs' },
    { icon: Droplets, title: 'Plumbing', description: 'Professional plumbing services from leaks to installations' },
    { icon: Paintbrush, title: 'Painting', description: 'Interior and exterior painting with premium materials' },
    { icon: Star, title: 'Cleaning', description: 'Thorough and reliable cleaning services for your home' }
  ];

  const testimonials = [
    { name: 'Sarah Johnson', rating: 5, text: 'Exceptional service! Fixed my kitchen sink perfectly and on time.' },
    { name: 'Mike Chen', rating: 5, text: 'Professional, reliable, and fair pricing. Highly recommend!' },
    { name: 'Emma Davis', rating: 5, text: 'Great attention to detail. My bathroom renovation looks amazing.' }
  ];

 return(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <HeartHandshake className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">HandsOff</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">Services</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate("/sign-in")}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/sign-up")} className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Star className="h-4 w-4 mr-1" />
                  Trusted by 10,000+ customers
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Your Home's
                  <span className="text-blue-600"> Best Friend</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Professional handyman and cleaning services for all your home repair and maintenance needs. 
                  Fast, reliable, and affordable solutions delivered by certified experts.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                  Book Service Now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  <Phone className="mr-2 h-5 w-5" />
                  Call (555) 123-4567
                </Button>
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
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&h=600&fit=crop" 
                  alt="Professional handyman" 
                  className="w-full h-96 object-cover rounded-xl"
                />
                <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full">
                  <Shield className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Expert Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From minor repairs to major installations, we handle it all with precision and care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                    <service.icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fast Response</h3>
              <p className="text-gray-600">
                We respond to all service requests within 2 hours and can often provide same-day service.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fully Insured</h3>
              <p className="text-gray-600">
                All our technicians are licensed, bonded, and insured for your complete peace of mind.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality Guaranteed</h3>
              <p className="text-gray-600">
                We stand behind our work with a 100% satisfaction guarantee and comprehensive warranty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real reviews from satisfied homeowners</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Provider of the Month Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Award className="h-8 w-8 text-yellow-500" />
              <h2 className="text-4xl font-bold text-gray-900">Service Provider of the Month</h2>
            </div>
            <p className="text-xl text-gray-600">Recognizing excellence in our community</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">JD</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">John Davis</h3>
                  <p className="text-blue-600 font-semibold">Master Electrician</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9 (127 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  "John has been with HandsOff for over 5 years and consistently delivers exceptional service. 
                  His attention to detail and commitment to safety make him our top-rated electrician."
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-semibold text-gray-900">Projects Completed</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">342</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold text-gray-900">Avg. Response Time</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">1.2hr</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Residential Wiring
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Panel Upgrades
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Smart Home Install
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Emergency Repairs
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Book John Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Schedule
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
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Why John Stands Out</h4>
                  <p className="text-gray-600 text-sm">
                    Licensed master electrician with 15+ years of experience. 
                    Specializes in residential electrical work with a focus on safety and code compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Fix Your Home?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands and millions of satisfied customers who trust HandsOff for all their Handy needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Schedule Service
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-blue-500 border-white hover:bg-gray-200 hover:text-blue-600">
              Get Free Quote
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );

  
 
};

export default LandingPage;