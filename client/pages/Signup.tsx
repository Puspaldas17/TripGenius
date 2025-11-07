import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loginAsGuest, isLoading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { errors, touched, handleChange, handleBlur, validateAll } =
    useFormValidation({
      name: { required: true },
      email: { required: true },
      password: { required: true },
    });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    handleChange(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll(formData)) {
      toast.error("Please fix the errors below");
      return;
    }

    try {
      await signup(formData.email, formData.name, formData.password);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(authError || "Signup failed. Please try again.");
    }
  };

  const passwordStrength = formData.password
    ? formData.password.length >= 8 &&
      /[A-Z]/.test(formData.password) &&
      /[0-9]/.test(formData.password)
      ? "strong"
      : formData.password.length >= 6
        ? "medium"
        : "weak"
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <p className="text-sm text-muted-foreground">
            Join TripGenius to start planning smarter trips
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-6 rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex gap-2 items-start">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                  Want to explore first?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                  onClick={() => {
                    loginAsGuest();
                    navigate("/planner");
                  }}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Continue as Guest
                </Button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authError && (
              <div className="rounded-lg bg-red-50 p-3 flex gap-2 dark:bg-red-950/30">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-800 dark:text-red-200">
                  {authError}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={() => handleBlur("name")}
                disabled={isLoading}
                className={
                  touched.has("name") && errors.name
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {touched.has("name") && errors.name && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur("email")}
                disabled={isLoading}
                className={
                  touched.has("email") && errors.email
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {touched.has("email") && errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="•���••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("password")}
                  disabled={isLoading}
                  className={
                    touched.has("password") && errors.password
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {passwordStrength && (
                <div className="text-xs space-y-1">
                  <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          passwordStrength === "strong"
                            ? "bg-green-500"
                            : passwordStrength === "medium" && i < 2
                              ? "bg-yellow-500"
                              : passwordStrength === "weak" && i < 1
                                ? "bg-red-500"
                                : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={
                      passwordStrength === "strong"
                        ? "text-green-600 dark:text-green-400"
                        : passwordStrength === "medium"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-red-600 dark:text-red-400"
                    }
                  >
                    {passwordStrength === "strong"
                      ? "Strong password"
                      : passwordStrength === "medium"
                        ? "Medium strength"
                        : "Weak password"}
                  </p>
                </div>
              )}

              {touched.has("password") && errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 text-xs text-blue-900 dark:text-blue-200">
              <p className="font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Password requirements:
              </p>
              <ul className="space-y-1 ml-6 list-disc">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One number</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
