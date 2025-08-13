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
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/utils/apiClient";

export function SignUpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp, signInWithGoogle, checkUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupas, setSignupas] = useState("Customer");
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if this is Google OAuth profile completion
  const isProfileCompletion = searchParams.get("complete") === "true";
  const oauthData = isProfileCompletion
    ? JSON.parse(sessionStorage.getItem("oauthUser") || "{}")
    : null;

  // Parse name from Google OAuth if available
  const nameParts = oauthData?.full_name?.split(" ") || [];

  // Form fields
  const [firstName, setFirstName] = useState(nameParts[0] || "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") || "");
  const [email, setEmail] = useState(oauthData?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Helper function to handle navigation based on role
  const navigateBasedOnRole = (role: string | undefined | null) => {
    const normalizedRole = role?.toLowerCase() || "";
    
    // Check if there's a pending redirect after auth
    const redirectPath = sessionStorage.getItem('redirectAfterAuth');
    const pendingService = sessionStorage.getItem('pendingService');
    
    if (redirectPath && pendingService) {
      // Clear the stored redirect path
      sessionStorage.removeItem('redirectAfterAuth');
      const service = JSON.parse(pendingService);
      // Navigate back to book-service with the service data
      navigate(redirectPath, { state: { service }, replace: true });
      return;
    }

    // On the backend, roles are stored as "provider" or "client"
    if (normalizedRole === "provider") {
      navigate("/provider-portal", { replace: true });
    } else if (normalizedRole === "client") {
      navigate("/customer-portal", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    // If this is OAuth completion but no OAuth data, redirect to sign-in
    if (isProfileCompletion && !oauthData?.supabase_id) {
      navigate("/sign-in");
    }
  }, [isProfileCompletion, oauthData, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // For Google OAuth profile completion
    if (isProfileCompletion && oauthData?.supabase_id) {
      try {
        // Create profile for Google OAuth user
        // Note: supabase_id is extracted from the JWT token on the backend
        await apiClient.post("/profiles/", {
          email: oauthData.email,
          first_name: firstName,
          last_name: lastName,
          street_address: address,
          city,
          state,
          zip_code: zipCode,
          // Convert UI selection "Service Provider"/"Customer" to backend role "provider"/"client"
          role:
            signupas.toLowerCase() === "service provider"
              ? "provider"
              : "client",
          provider_type:
            signupas === "Service Provider" ? skill.toLowerCase() : null,
        });

        // Clear OAuth data from sessionStorage
        sessionStorage.removeItem("oauthUser");

        // Small delay to ensure profile is committed to database
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Refresh user data in AuthContext to include the new profile
        await checkUser();

        // Add a small delay to ensure auth state is fully updated
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Refresh user data
        await checkUser();

        // Convert UI selection to backend role format for navigation
        const backendRole =
          signupas === "Service Provider" ? "provider" : "client";

        // Use our helper function to navigate based on role
        navigateBasedOnRole(backendRole);
      } catch (err: unknown) {
        // Profile creation error
        const errorMessage =
          err instanceof Error
            ? err.message
            : typeof err === "object" && err && "response" in err
            ? err.response &&
              typeof err.response === "object" &&
              "data" in err.response &&
              typeof err.response.data === "object" &&
              err.response.data &&
              "message" in err.response.data
              ? String(err.response.data.message)
              : "Failed to create profile. Please try again."
            : "Failed to create profile. Please try again.";

        setError(errorMessage);
      }
      setLoading(false);
      return;
    }

    // Regular signup flow
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    const result = await signUp({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      street_address: address,
      city,
      state,
      zip_code: zipCode,
    });

    if (result.success) {
      // result.userData.role should already be in backend format ("provider" or "client")
      // from the API response, so we pass it directly to the navigation helper
      navigateBasedOnRole(result.userData?.role);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    const result = await signInWithGoogle();
    if (!result.success) {
      setError(result.message);
    }
  };

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
        }}>
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
            className="mb-4 text-white hover:text-gray-200 hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              {isProfileCompletion ? "Complete Your Profile" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isProfileCompletion
                ? "Please provide your address information to complete your HandsOff account"
                : "Join HandsOff and get access to trusted handyman and cleaning services"}
            </CardDescription>
            {isProfileCompletion && oauthData?.email && (
              <p className="text-sm text-gray-600 mt-2">
                Signed in as:{" "}
                <span className="font-medium">{oauthData.email}</span>
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    className="h-12"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    className="h-12"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {!isProfileCompletion && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="h-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St"
                  className="h-12"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Los Angeles"
                    className="h-12"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="CA"
                    className="h-12"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="90210"
                  className="h-12"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                />
              </div>

              {!isProfileCompletion && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="h-12 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}>
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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }>
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="signupas">Sign Up as</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 justify-between text-left font-normal"
                      id="signupas">
                      <span
                        className={
                          signupas ? "text-gray-900" : "text-gray-500"
                        }>
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
                        strokeLinejoin="round">
                        <polyline points="6,9 12,15 18,9" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem
                      className="h-10"
                      onClick={() => setSignupas("Customer")}>
                      <span>Customer</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="h-10"
                      onClick={() => setSignupas("Service Provider")}>
                      <span>Service Provider</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {signupas === "Service Provider" && (
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 justify-between text-left font-normal"
                        id="skill">
                        <span
                          className={skill ? "text-gray-900" : "text-gray-500"}>
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
                          strokeLinejoin="round">
                          <polyline points="6,9 12,15 18,9" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuItem
                        className="h-10"
                        onClick={() => setSkill("Cleaning")}>
                        <span>Cleaning</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="h-10"
                        onClick={() => setSkill("Maintenance")}>
                        <span>Maintenance</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="rounded"
                  required
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="text-blue-600 p-0 h-auto text-sm">
                    Terms of Service
                  </Button>{" "}
                  and{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="text-blue-600 p-0 h-auto text-sm">
                    Privacy Policy
                  </Button>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg">
                {loading
                  ? isProfileCompletion
                    ? "Completing Profile..."
                    : "Creating Account..."
                  : isProfileCompletion
                  ? "Complete Profile"
                  : "Create Account"}
              </Button>
            </form>

            {!isProfileCompletion && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignUp}
                  className="w-full h-12">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </>
            )}

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Button
                type="button"
                variant="link"
                className="text-blue-600 p-0 h-auto font-normal"
                onClick={() => navigate("/sign-in")}>
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
