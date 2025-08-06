import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowLeft, Wrench } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupas, setSignupas] = useState("Customer");
  const [skill, setSkill] = useState("");

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/auth-image-2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Wrench className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">HandsOff</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 text-white hover:text-gray-200 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Join HandsOff and get access to trusted handyman and cleaning
              services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" className="h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" className="h-12" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="123 Main St, City, State"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="h-12 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="h-12 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signupas">Sign Up as</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-between text-left font-normal"
                    id="signupas"
                  >
                    <span
                      className={signupas ? "text-gray-900" : "text-gray-500"}
                    >
                      {signupas || "Select account type"}
                    </span>
                    <svg
                      className="h-4 w-4 opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6,9 12,15 18,9" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem
                    className="h-10"
                    onClick={() => setSignupas("Customer")}
                  >
                    <span>Customer</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="h-10"
                    onClick={() => setSignupas("Service Provider")}
                  >
                    <span>Service Provider</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {signupas === "Service Provider" && (
              <div className="space-y-2">
                <Label htmlFor="signupas">Skills</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-12 justify-between text-left font-normal"
                      id="skill"
                    >
                      <span
                        className={signupas ? "text-gray-900" : "text-gray-500"}
                      >
                        {skill || "Select skill"}
                      </span>
                      <svg
                        className="h-4 w-4 opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6,9 12,15 18,9" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem
                      className="h-10"
                      onClick={() => setSkill("Furniture Repair")}
                    >
                      <span>Furniture Repair</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="h-10"
                      onClick={() => setSkill("Cleaning Service")}
                    >
                      <span>Cleaning Service</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="h-10"
                      onClick={() => setSkill("Electrical Service")}
                    >
                      <span>Electrical Service</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="h-10"
                      onClick={() => setSkill("Plumbing Service")}
                    >
                      <span>Plumbing Service</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="h-10"
                      onClick={() => setSkill("Painting & Decorations")}
                    >
                      <span>Painting & Decorations</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" className="rounded" />
              <Label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Button
                  variant="link"
                  className="text-blue-600 p-0 h-auto text-sm"
                >
                  Terms of Service
                </Button>{" "}
                and{" "}
                <Button
                  variant="link"
                  className="text-blue-600 p-0 h-auto text-sm"
                >
                  Privacy Policy
                </Button>
              </Label>
            </div>

            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg">
              Create Account
            </Button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="text-blue-600 p-0 h-auto font-normal"
                onClick={() => {
                  navigate("/sign-in");
                }}
              >
                Sign in here
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SignUpPage;
