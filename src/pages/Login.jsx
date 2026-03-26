// src/pages/Login.jsx

import { useState, useEffect } from "react";
import { Shield, BarChart3, Palette, Rocket, Link2, Cloud } from "lucide-react";
import webseederLogo from "/logo.png";
import { useLoginMutation } from "../services/authApi";
import { useNavigate } from "react-router-dom";

const slidesData = [
  {
    image: "/slide1.png",
    title: "Welcome Back",
    subtitle: "Sign in to access your dashboard",
    features: [
      { icon: Shield, heading: "Secure Access", description: "Your data is protected with enterprise-grade security" },
      { icon: BarChart3, heading: "Real-time Analytics", description: "Monitor your performance with live data insights" },
    ],
  },
  {
    image: "/slide2.png",
    title: "Modern Interface",
    subtitle: "Experience our redesigned, intuitive platform",
    features: [
      { icon: Palette, heading: "Intuitive Design", description: "Navigate effortlessly with a user-friendly layout" },
      { icon: Rocket, heading: "Boost Productivity", description: "Streamline your workflows and achieve more" },
    ],
  },
  {
    image: "/slide3.png",
    title: "Seamless Integration",
    subtitle: "Connect with your favorite tools effortlessly",
    features: [
      { icon: Link2, heading: "Easy Connectivity", description: "Integrate with third-party services seamlessly" },
      { icon: Cloud, heading: "Cloud-Powered", description: "Access your data anytime, anywhere with cloud support" },
    ],
  },
];

export function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slidesData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentSlide = slidesData[currentSlideIndex];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    if (!formData.email || !formData.password) {
      setErrorMessage("Please enter email and password");
      return;
    }

    try {
      const res = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      // ✅ STORE TOKEN
      localStorage.setItem("token", res.token);

      // ✅ STORE USER (IMPORTANT FOR RBAC)
      localStorage.setItem("user", JSON.stringify(res.user));

      // optional
      localStorage.setItem("isAuthenticated", "true");

      console.log("LOGIN USER:", res.user);

      // redirect
      navigate("/dashboard", { replace: true });

    } catch (error) {
      setErrorMessage(error?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left - Slideshow */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {slidesData.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${idx === currentSlideIndex ? "opacity-100" : "opacity-0"
              }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}

        <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
          <div className="max-w-md px-12 text-white space-y-10">

            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight">{currentSlide.title}</h2>
              <p className="mt-3 text-lg text-gray-300">{currentSlide.subtitle}</p>
            </div>

            <div className="space-y-8">
              {currentSlide.features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="flex items-start gap-5">
                    <div className="rounded-lg bg-gray-800/80 p-3 flex-shrink-0">
                      <Icon className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-white">{feature.heading}</h4>
                      <p className="mt-1 text-gray-300 text-sm">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8 pb-4 text-center border-b border-gray-100">
            <div className="flex justify-center mb-6">
              <img src={webseederLogo} alt="Logo" className="h-10 w-auto" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Dynasty Premium
            </h1>

            <p className="mt-2 text-gray-600">
              Sign in to your account
            </p>
          </div>

          {errorMessage && (
            <div className="px-8 pt-4">
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md py-2 text-center">
                {errorMessage}
              </div>
            </div>
          )}

          <div className="p-8 space-y-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 text-white font-medium bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}