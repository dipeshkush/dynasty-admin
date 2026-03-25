import { useState, useEffect } from "react";
import { Shield, BarChart3, Palette, Rocket, Link2, Cloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import webseederLogo from "/logo.png";

const slidesData = [
  {
    image: "/slide1.png",
    title: "Reset Your Password",
    subtitle: "Securely recover access to your account",
    features: [
      { icon: Shield, heading: "Secure Process", description: "Password reset is protected with strong encryption" },
      { icon: BarChart3, heading: "Fast Recovery", description: "Get back to managing your dashboard quickly" },
    ],
  },
  {
    image: "/slide2.png",
    title: "Stay Connected",
    subtitle: "Your account security is our priority",
    features: [
      { icon: Palette, heading: "Easy Steps", description: "Reset your password in just a few clicks" },
      { icon: Rocket, heading: "Quick Access", description: "Continue managing your platform without delay" },
    ],
  },
  {
    image: "/slide3.png",
    title: "Reliable Security",
    subtitle: "We keep your account safe",
    features: [
      { icon: Link2, heading: "Protected Login", description: "Only authorized users can access your dashboard" },
      { icon: Cloud, heading: "Cloud Protection", description: "Your data stays safe in our secure cloud" },
    ],
  },
];

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slidesData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentSlide = slidesData[currentSlideIndex];

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // TODO: API call
    setMessage("Password reset link has been sent to your email.");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Left Slideshow */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {slidesData.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              idx === currentSlideIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}

        <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
          <div className="max-w-md px-12 text-white space-y-10">

            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight">
                {currentSlide.title}
              </h2>
              <p className="mt-3 text-lg text-gray-300">
                {currentSlide.subtitle}
              </p>
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
                      <h4 className="font-semibold text-lg text-white">
                        {feature.heading}
                      </h4>

                      <p className="mt-1 text-gray-300 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* Right Form */}
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
              Reset your password
            </p>

          </div>

          {error && (
            <div className="px-8 pt-4">
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md py-2 text-center">
                {error}
              </div>
            </div>
          )}

          {message && (
            <div className="px-8 pt-4">
              <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md py-2 text-center">
                {message}
              </div>
            </div>
          )}

          <div className="p-8 space-y-6">

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-2">

                <label className="block text-sm font-medium text-gray-700">
                  Email address
                </label>

                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />

              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 text-white font-medium bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all"
              >
                Send Reset Link
              </button>

            </form>

            <div className="text-center">

              <button
                onClick={() => navigate("/login")}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Back to Login
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}