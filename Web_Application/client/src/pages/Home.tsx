import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Smile,
  Heart,
  Activity,
  Users,
  Clock,
  Brain,
  MessageCircle,
  AlertTriangle,
  BarChart2,
  Shield,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TESTIMONIAL_ROTATION_INTERVAL = 5000;
const MOCK_MOOD_DATA = {
  emotionalBalance: 78,
  stressLevel: 35,
  energy: 65,
} as const;

// Types
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor: string;
}

interface Testimonial {
  id: number;
  author: string;
  joinDate: string;
  reviewDate: string;
  location: string;
  rating: number;
  title: string;
  content: string;
  helpfulCount: number;
  profileImage: string;
}

interface WorkStep {
  number: string;
  title: string;
  description: string;
  position: "left" | "right";
}

interface Statistic {
  icon: React.ReactNode;
  number: string;
  label: string;
}

interface MoodMetric {
  label: string;
  value: number;
  color: string;
}

// Data
const FEATURES: FeatureCardProps[] = [
  {
    icon: <Brain className="w-full h-full" />,
    title: "Sentiment Analysis",
    description:
      "Our AI analyzes your texts and social media posts to help you understand your emotional patterns.",
    iconColor: "indigo",
  },
  {
    icon: <MessageCircle className="w-full h-full" />,
    title: "Anonymous Chat",
    description:
      "Connect with mental health professionals anonymously when you need support but aren't ready to share your identity.",
    iconColor: "purple",
  },
  {
    icon: <AlertTriangle className="w-full h-full" />,
    title: "Real-time Alerts",
    description:
      "Notify trusted contacts when our system detects concerning patterns in your mental health data.",
    iconColor: "amber",
  },
  {
    icon: <BarChart2 className="w-full h-full" />,
    title: "Health Insights",
    description:
      "Visualize your mental health trends over time with intuitive graphs and meaningful metrics.",
    iconColor: "blue",
  },
  {
    icon: <Shield className="w-full h-full" />,
    title: "Privacy Focused",
    description:
      "Your data is protected with state-of-the-art encryption and strict privacy controls.",
    iconColor: "teal",
  },
  {
    icon: <Heart className="w-full h-full" />,
    title: "Tailored Support",
    description:
      "Receive personalized coping strategies and resources based on your specific needs.",
    iconColor: "rose",
  },
] as const;

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    author: "Dinesh Perera",
    joinDate: "June 2021",
    reviewDate: "February 12, 2023",
    location: "Colombo",
    rating: 5,
    title: "A blessing during difficult times",
    content:
      "MoodSync has been a true companion during one of the most challenging periods of my life. After losing my job due to company restructuring, I fell into a pattern of negative thoughts and anxiety about the future. The daily check-ins and personalized coping strategies helped me recognize my thought patterns and develop healthier responses.",
    helpfulCount: 27,
    profileImage:
      "https://media.istockphoto.com/id/1199571022/photo/young-happy-and-successful-south-east-asian-islamic-business-woman-with-arms-crossed-in.jpg?s=612x612&w=0&k=20&c=dNH6PE2iifhJnJaGjtvkLz1Qj3d9-DHrGKKM2cgkjQ4=",
  },
  {
    id: 2,
    author: "Rosella Raymond",
    joinDate: "March 2025",
    reviewDate: "November 5, 2023",
    location: "Central Colombo",
    rating: 4,
    title: "Helpful for university students",
    content:
      "As a final year student, the pressure can be overwhelming. Between work rotations, exams, and thesis work, my anxiety levels were through the roof. MoodSync's stress tracking feature helped me identify exactly which situations triggered my panic attacks, and the cognitive behavioral exercises taught me how to manage them effectively.",
    helpfulCount: 4,
    profileImage:
      "https://cdn-images.dzcdn.net/images/cover/47743030deffbd6efd88ed5b77fbad7e/1900x1900-000000-80-0-0.jpg",
  },
  {
    id: 3,
    author: "Dr. Ranjith Fernando",
    joinDate: "January 2021",
    reviewDate: "August 18, 2023",
    location: "Galle",
    rating: 5,
    title: "Perfect for clinical support",
    content:
      "As a psychiatrist practicing in southern Sri Lanka, I often recommend MoodSync to my patients as a complementary tool between therapy sessions. The app's mood tracking provides invaluable data that helps my patients visualize their emotional patterns, making our in-person sessions more productive.",
    helpfulCount: 34,
    profileImage: "/docs/images/people/profile-picture-3.jpg",
  },
  {
    id: 4,
    author: "Amali Senaratne",
    joinDate: "September 2022",
    reviewDate: "January 23, 2024",
    location: "Negombo",
    rating: 5,
    title: "Transformed my relationship with emotions",
    content:
      "After years of bottling up my emotions and practicing 'toxic positivity,' MoodSync taught me how to actually process my feelings in a healthy way. The emotional intelligence modules were eye-opening—I never realized how poorly I was identifying and expressing my emotions.",
    helpfulCount: 42,
    profileImage: "/docs/images/people/profile-picture-2.jpg",
  },
] as const;

const HOW_IT_WORKS_STEPS: WorkStep[] = [
  {
    number: "1",
    title: "Complete Your Assessment",
    description:
      "Take our scientifically-backed mental wellness assessment that analyzes your emotional patterns, stress triggers, and resilience factors.",
    position: "left",
  },
  {
    number: "2",
    title: "Receive Personalized Insights",
    description:
      "Our AI analyzes your responses to create a detailed emotional profile, identifying strengths, challenges, and providing actionable recommendations.",
    position: "right",
  },
  {
    number: "3",
    title: "Follow Your Custom Plan",
    description:
      "Access tailored exercises, guided meditations, and cognitive behavioral techniques designed specifically for your unique mental health needs.",
    position: "left",
  },
  {
    number: "4",
    title: "Track Your Progress",
    description:
      "Monitor improvements through regular check-ins and visualized progress reports, with AI-powered adjustments to your plan as you grow.",
    position: "right",
  },
] as const;

const STATISTICS: Statistic[] = [
  {
    icon: <Users className="h-10 w-10" />,
    number: "10+",
    label: "Active Users",
  },
  {
    icon: <Smile className="h-10 w-10" />,
    number: "85%",
    label: "User Satisfaction",
  },
  {
    icon: <Clock className="h-10 w-10" />,
    number: "24/7",
    label: "Support Available",
  },
  {
    icon: <Activity className="h-10 w-10" />,
    number: "3+",
    label: "Partner Hospitals",
  },
] as const;

// Utility Functions
const getColorClasses = (iconColor: string) => {
  const colorMap: Record<string, string> = {
    indigo: "text-indigo-600",
    purple: "text-purple-600",
    amber: "text-amber-600",
    blue: "text-blue-600",
    teal: "text-teal-600",
    rose: "text-rose-600",
  };
  return colorMap[iconColor] || "text-gray-600";
};

const renderStars = (rating: number) => {
  return Array.from({ length: rating }, (_, i) => (
    <svg
      key={i}
      className="w-4 h-4 text-yellow-400"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.95c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.95a1 1 0 00-.364-1.118L2.07 9.377c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.95z" />
    </svg>
  ));
};

// Components
const FeatureCard: React.FC<FeatureCardProps> = React.memo(
  ({ icon, title, description, iconColor }) => {
    const colorClass = getColorClasses(iconColor);

    return (
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center mb-5">
          <div className={`w-10 h-10 ${colorClass} mr-4 flex-shrink-0`}>
            {icon}
          </div>
          <h5 className="text-xl font-semibold tracking-tight text-gray-900">
            {title}
          </h5>
        </div>
        <p className="font-normal text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    );
  }
);

const MoodMetricBar: React.FC<MoodMetric> = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-gray-700 text-xs sm:text-sm mb-1 sm:mb-2">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className={`bg-${color}-100 rounded-full h-2 sm:h-3`}>
      <div
        className={`bg-${color}-500 rounded-full h-2 sm:h-3`}
        style={{ width: `${value}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${value}%`}
      />
    </div>
  </div>
);

const MoodWidget: React.FC = () => {
  const moodMetrics: MoodMetric[] = [
    {
      label: "Emotional Balance",
      value: MOCK_MOOD_DATA.emotionalBalance,
      color: "blue",
    },
    { label: "Stress Level", value: MOCK_MOOD_DATA.stressLevel, color: "red" },
    { label: "Energy", value: MOCK_MOOD_DATA.energy, color: "green" },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-gray-200 space-y-4 sm:space-y-5 md:space-y-6 order-2 w-full">
      <div>
        <div className="flex items-center mb-2">
          <Smile className="text-indigo-600 mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6" />
          <h2 className="text-gray-700 font-semibold text-lg sm:text-xl">
            Today's Mood
          </h2>
        </div>
        <p className="text-gray-500 text-xs sm:text-sm">
          A comprehensive overview of your current emotional and mental state
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        {moodMetrics.map((metric, index) => (
          <MoodMetricBar key={index} {...metric} />
        ))}

        <div className="pt-2 sm:pt-3 md:pt-4">
          <button
            type="button"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs sm:text-sm px-5 py-2.5 focus:outline-none transition-colors"
          >
            Check It Now
          </button>
        </div>
      </div>
    </div>
  );
};

const HeroSection: React.FC = () => (
  <div className="relative min-h-[85vh] bg-gradient-to-br bg-blue-600 flex items-center py-8 sm:py-12 md:py-0">
    <div className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div className="text-white space-y-4 sm:space-y-5 order-1 w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Your Mental Health, Intelligently Understood
        </h1>
        <p className="text-base sm:text-lg text-white/80 max-w-md leading-relaxed">
          MoodSync leverages advanced AI and machine learning to provide
          personalized mental health insights, support, and guidance tailored to
          your unique emotional journey.
        </p>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
          <button className="bg-white text-blue-600 px-5 sm:px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition w-full sm:w-auto text-sm sm:text-base">
            Start Your Journey
          </button>
          <button className="border border-white/50 text-white px-5 sm:px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition w-full sm:w-auto text-sm sm:text-base">
            Learn More
          </button>
        </div>
      </div>
      <MoodWidget />
    </div>
  </div>
);

const FeaturesSection: React.FC = () => (
  <section id="features" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
        <div className="h-1 w-24 bg-blue-600 mx-auto mb-6 rounded-full" />
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          MoodSync combines advanced technology with compassionate care to help
          you manage your mental wellbeing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURES.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  </section>
);

const HowItWorksSection: React.FC = () => (
  <section className="py-12 bg-gray-50">
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          How MoodSync Works
        </h2>
        <div className="h-1 w-24 bg-blue-600 mx-auto mb-4 rounded-full" />
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
          MoodSync uses a combination of AI, machine learning, and human
          expertise to help you understand and improve your mental health.
        </p>
      </div>

      <div className="relative pb-8">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-blue-200" />

        <div className="relative space-y-20">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <div key={index} className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {step.number}
                  </span>
                </div>
              </div>

              <div
                className={`flex ${
                  step.position === "right" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`w-1/2 ${
                    step.position === "right"
                      ? "pl-8 text-right"
                      : "pr-8 text-left"
                  }`}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-lg">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const StatisticsSection: React.FC = () => (
  <section className="py-16 bg-blue-600 text-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Making a Meaningful Difference</h2>
        <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
          MoodSync is transforming mental health support across Sri Lanka
          through innovative technology and compassionate care.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {STATISTICS.map((stat) => (
          <div
            key={stat.label}
            className="bg-blue-500 p-6 rounded-xl text-center hover:bg-blue-400 transition-colors"
          >
            <div className="flex justify-center items-center mb-4">
              {stat.icon}
              <span className="text-3xl font-bold ml-3">{stat.number}</span>
            </div>
            <p className="text-blue-100">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, TESTIMONIAL_ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handlePrevious = useCallback(() => {
    setActiveTestimonial((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveTestimonial((prev) => Math.min(TESTIMONIALS.length - 1, prev + 1));
  }, []);

  const handleDotClick = useCallback((index: number) => {
    setActiveTestimonial(index);
  }, []);

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 relative inline-block">
            What Our Users Say
          </h2>
          <div className="h-1 w-24 bg-blue-600 mx-auto mb-6 rounded-full" />
          <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from people whose lives have been impacted by MoodSync.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
            >
              {TESTIMONIALS.map((testimonial) => (
                <div key={testimonial.id} className="min-w-full px-4">
                  <article className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100 max-w-4xl mx-auto">
                    <div className="flex items-center mb-4">
                      <div className="relative">
                        <img
                          className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300"
                          src={testimonial.profileImage}
                          alt={`${testimonial.author}'s profile`}
                          loading="lazy"
                        />
                        <span className="bottom-0 left-7 absolute w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
                      </div>

                      <div className="font-medium text-gray-900 ml-3">
                        <p>
                          {testimonial.author}
                          <time
                            dateTime={testimonial.joinDate}
                            className="block text-sm text-gray-500"
                          >
                            Joined on {testimonial.joinDate}
                          </time>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center mb-1 space-x-1">
                      {renderStars(testimonial.rating)}
                      <h3 className="ms-2 text-sm font-semibold text-gray-900">
                        {testimonial.title}
                      </h3>
                    </div>

                    <p className="mb-2 text-gray-500">{testimonial.content}</p>

                    <aside>
                      <p className="mt-1 text-xs text-gray-500">
                        {testimonial.helpfulCount} people found this helpful
                      </p>
                    </aside>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            type="button"
            className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={handlePrevious}
            disabled={activeTestimonial === 0}
            aria-label="Previous testimonial"
          >
            <span
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none ${
                activeTestimonial === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <svg
                className="w-4 h-4 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 6 10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </span>
          </button>

          <button
            type="button"
            className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={handleNext}
            disabled={activeTestimonial === TESTIMONIALS.length - 1}
            aria-label="Next testimonial"
          >
            <span
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none ${
                activeTestimonial === TESTIMONIALS.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <svg
                className="w-4 h-4 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 6 10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </span>
          </button>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center mt-8">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-3 w-3 rounded-full mx-2 transition-colors ${
                index === activeTestimonial ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const CallToActionSection: React.FC = () => (
  <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Start Your Mental Wellness Journey Today
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join thousands of individuals taking proactive steps towards
              better mental health with MoodSync.
            </p>
            <div className="mt-8 flex space-x-4">
              <a
                href="/register"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started Free
              </a>
              <a
                href="/demo"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Watch Demo
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required. Free plan includes core features.
            </p>
          </div>

          <div className="hidden md:block relative bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white p-8">
                <Heart className="h-16 w-16 mx-auto mb-4 text-white" />
                <h3 className="text-2xl font-bold mb-3">
                  Your Mental Health Matters
                </h3>
                <p className="text-blue-100">
                  Personalized support, always available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Main Component
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatisticsSection />
      <TestimonialsSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
};

export default HomePage;
