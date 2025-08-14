import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const result = await signIn(email, password);
    if (result.success) {
      // Use userData returned from signIn to determine portal destination
      const userData = result.userData;

      // Check which portal to navigate to based on user role
      if (userData && userData.role.toLowerCase() === "provider") {
        navigate("/provider-portal");
      } else if (userData && userData.role.toLowerCase() === "client") {
        navigate("/customer-portal");
      } else {
        // Default to home if user role not specified
        navigate("/");
      }
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");
    const result = await signInWithGoogle();
    if (!result.success) {
      setError(result.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first");
      setSuccess("");
      return;
    }
    setError("");
    setSuccess("");

    const result = await forgotPassword(email);
    if (result.success) {
      setSuccess("Password reset email sent! Check your inbox.");
    } else {
      setError(result.message);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="/auth-image-1.png"
          alt="Sign in"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-600/70 flex items-center justify-center p-8">
          <div className="text-center text-white">
            <div className="flex items-center justify-center space-x-2 mb-8">
              <img
                src="/images/icon_no_text.png"
                alt="icon"
                className="h-16 w-16"
              />
              <span className="text-5xl font-bold">HandsOff</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-xl text-blue-100">
              Access your trusted handyman and cleaning services
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img
                src="/images/icon_no_text.png"
                alt="icon"
                className="h-8 w-8"
              />
              <span className="text-2xl font-bold text-gray-900">HandsOff</span>
            </div>
          </div>

          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your HandsOff account to manage your services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-green-600 text-sm text-center">
                    {success}
                  </div>
                )}
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
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="remember" className="rounded" />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-blue-600 p-0"
                    onClick={handleForgotPassword}>
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg">
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

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
                onClick={handleGoogleLogin}
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

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="text-blue-600 p-0 h-auto font-normal"
                  onClick={() => {
                    navigate("/sign-up");
                  }}>
                  Sign up here
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
