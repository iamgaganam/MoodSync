import React, { useState, useEffect } from "react";
import {
  Brain,
  MessageCircle,
  Smile,
  AlertTriangle,
  BarChart2,
  Heart,
  Shield,
  Activity,
  ArrowRight,
  Users,
  Calendar,
  Clock,
} from "lucide-react";

const HomePage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isLoggedIn] = useState(false);

  // Sample testimonials
  const testimonials = [
    {
      id: 1,
      content:
        "MoodSync has completely changed how I manage my mental health. The insights and early warnings helped me identify patterns I never noticed before.",
      author: "Samantha K.",
      role: "Student, Colombo",
    },
    {
      id: 2,
      content:
        "As someone who struggled to express my feelings, the sentiment analysis feature has been transformative. It helped me communicate better with my therapist.",
      author: "Ravi T.",
      role: "Software Engineer, Kandy",
    },
    {
      id: 3,
      content:
        "The anonymous chat feature made it possible for me to reach out for help when I was at my lowest. I'm grateful for the support I received.",
      author: "Niroshi P.",
      role: "Teacher, Galle",
    },
  ];

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-2 text-xl font-bold text-gray-800">
                MoodSync
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-6">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Testimonials
                </a>
                <a
                  href="#resources"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Resources
                </a>
                <a
                  href="#contact"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <a
                  href="/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Dashboard
                </a>
              ) : (
                <>
                  <a
                    href="/login"
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Sign Up
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-500 to-indigo-600 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Track, Understand, and Improve Your Mental Wellbeing
              </h1>
              <p className="mt-4 text-lg md:text-xl text-blue-100">
                MoodSync uses advanced sentiment analysis to help you monitor
                your mental health patterns and connect with support when you
                need it most.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href="/register"
                  className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium text-center hover:bg-blue-50 transition-colors"
                >
                  Get Started Free
                </a>
                <a
                  href="#how-it-works"
                  className="border border-white text-white px-6 py-3 rounded-md font-medium text-center hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="bg-white p-6 rounded-lg shadow-xl">
                  <div className="flex items-center mb-4">
                    <Smile className="h-10 w-10 text-blue-500" />
                    <div className="ml-4">
                      <h3 className="text-xl font-medium text-gray-800">
                        Today's Mood
                      </h3>
                      <p className="text-gray-500">
                        Let MoodSync track your emotional wellbeing
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 font-medium">
                          Happiness
                        </span>
                        <span className="text-blue-600 font-medium">75%</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 font-medium">
                          Anxiety
                        </span>
                        <span className="text-blue-600 font-medium">30%</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "30%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 font-medium">
                          Energy
                        </span>
                        <span className="text-blue-600 font-medium">65%</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <a
                      href="/track-mood"
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-center font-medium block hover:bg-blue-700 transition-colors"
                    >
                      Check In Now
                    </a>
                  </div>
                </div>
                <div className="absolute top-4 right-4 h-24 w-24 bg-blue-100 rounded-full -z-10"></div>
                <div className="absolute -bottom-4 -left-4 h-16 w-16 bg-indigo-100 rounded-full -z-10"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              MoodSync combines advanced technology with compassionate care to
              help you manage your mental wellbeing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-10 w-10 text-blue-600" />}
              title="Sentiment Analysis"
              description="Our AI analyzes your texts and social media posts to help you understand your emotional patterns."
            />
            <FeatureCard
              icon={<MessageCircle className="h-10 w-10 text-blue-600" />}
              title="Anonymous Chat"
              description="Connect with mental health professionals anonymously when you need support but aren't ready to share your identity."
            />
            <FeatureCard
              icon={<AlertTriangle className="h-10 w-10 text-blue-600" />}
              title="Real-time Alerts"
              description="Notify trusted contacts when our system detects concerning patterns in your mental health data."
            />
            <FeatureCard
              icon={<BarChart2 className="h-10 w-10 text-blue-600" />}
              title="Health Insights"
              description="Visualize your mental health trends over time with intuitive graphs and meaningful metrics."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-blue-600" />}
              title="Privacy Focused"
              description="Your data is protected with state-of-the-art encryption and strict privacy controls."
            />
            <FeatureCard
              icon={<Heart className="h-10 w-10 text-blue-600" />}
              title="Tailored Support"
              description="Receive personalized coping strategies and resources based on your specific needs."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              How MoodSync Works
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              MoodSync uses a combination of AI, machine learning, and human
              expertise to help you understand and improve your mental health.
            </p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 z-0"></div>
            <div className="space-y-12">
              <StepCard
                number="1"
                title="Connect Your Accounts"
                description="Securely link your social media accounts or start journaling directly in the app to provide data for analysis."
                isLeft={true}
              />
              <StepCard
                number="2"
                title="AI Analyzes Your Data"
                description="Our machine learning algorithms process your text to identify emotional patterns, stress indicators, and potential concerns."
                isLeft={false}
              />
              <StepCard
                number="3"
                title="Receive Personalized Insights"
                description="View your mental health trends, receive tailored recommendations, and track your progress over time."
                isLeft={true}
              />
              <StepCard
                number="4"
                title="Connect with Support"
                description="When needed, connect anonymously with mental health professionals or allow the system to alert your trusted contacts."
                isLeft={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Making a Difference</h2>
            <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
              MoodSync is helping thousands of users in Sri Lanka and beyond
              improve their mental wellbeing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
              number="10,000+"
              label="Active Users"
              icon={<Users className="h-8 w-8" />}
            />
            <StatCard
              number="85%"
              label="User Satisfaction"
              icon={<Smile className="h-8 w-8" />}
            />
            <StatCard
              number="24/7"
              label="Support Available"
              icon={<Clock className="h-8 w-8" />}
            />
            <StatCard
              number="15+"
              label="Partner Hospitals"
              icon={<Activity className="h-8 w-8" />}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              What Our Users Say
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from people whose lives have been impacted by
              MoodSync.
            </p>
          </div>
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${activeTestimonial * 100}%)`,
                }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="min-w-full px-4">
                    <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex items-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-xl">
                            {testimonial.author.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            {testimonial.author}
                          </h4>
                          <p className="text-gray-600">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 italic">
                        {testimonial.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-3 w-3 rounded-full mx-2 ${
                    index === activeTestimonial ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Mental Health Resources
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Access helpful resources and professional support services in Sri
              Lanka.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ResourceCard
              title="Crisis Helplines"
              items={[
                "Sri Lanka Sumithrayo: 011-2696666",
                "National Mental Health Helpline: 1926",
                "CCCline: 1333 (24/7 Support)",
              ]}
            />
            <ResourceCard
              title="Hospital Services"
              items={[
                "National Institute of Mental Health",
                "Lady Ridgeway Hospital - Child Guidance Centre",
                "Teaching Hospital Colombo - Psychiatry Unit",
              ]}
            />
            <ResourceCard
              title="Self-Help Resources"
              items={[
                "Guided Meditation Sessions",
                "Stress Management Techniques",
                "CBT Workbooks and Exercises",
              ]}
            />
          </div>
          <div className="mt-12 text-center">
            <a
              href="/resources"
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
            >
              View All Resources
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-gray-900">
                  Ready to start your mental wellness journey?
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Join thousands of Sri Lankans who are taking control of their
                  mental health with MoodSync.
                </p>
                <div className="mt-8">
                  <a
                    href="/register"
                    className="inline-block bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    Get Started Free
                  </a>
                  <p className="mt-3 text-sm text-gray-500">
                    No credit card required. Free plan includes all basic
                    features.
                  </p>
                </div>
              </div>
              <div className="hidden md:block relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center px-8">
                    <Calendar className="h-16 w-16 mx-auto opacity-75" />
                    <h3 className="mt-4 text-2xl font-bold">
                      Track your progress
                    </h3>
                    <p className="mt-2 text-blue-100">
                      Monitor your mental health trends daily, weekly, and
                      monthly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">MoodSync</span>
              </div>
              <p className="mt-4 text-gray-400">
                Empowering Sri Lankans to monitor, understand, and improve their
                mental health through technology.
              </p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Product</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-400 hover:text-white"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="text-gray-400 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-gray-400 hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="/articles"
                    className="text-gray-400 hover:text-white"
                  >
                    Mental Health Articles
                  </a>
                </li>
                <li>
                  <a
                    href="/providers"
                    className="text-gray-400 hover:text-white"
                  >
                    Find a Therapist
                  </a>
                </li>
                <li>
                  <a
                    href="/emergency"
                    className="text-gray-400 hover:text-white"
                  >
                    Emergency Resources
                  </a>
                </li>
                <li>
                  <a href="/support" className="text-gray-400 hover:text-white">
                    Support Groups
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium">Contact</h3>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-gray-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-gray-400">info@moodsync.com</p>
                    <p className="text-gray-400">+94 11 234 5678</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500">
            © {new Date().getFullYear()} MoodSync. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// ----- Subcomponents -----

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
      <div>{icon}</div>
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
};

const StepCard = ({
  number,
  title,
  description,
  isLeft,
}: {
  number: string;
  title: string;
  description: string;
  isLeft: boolean;
}) => {
  return (
    <div
      className={`flex ${
        isLeft ? "flex-row" : "flex-row-reverse"
      } items-center`}
    >
      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <div className={`mx-4 ${isLeft ? "text-left" : "text-right"}`}>
        <h4 className="text-lg font-bold">{title}</h4>
        <p className="mt-1 text-gray-600">{description}</p>
      </div>
    </div>
  );
};

interface StatCardProps {
  number: string;
  label: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, icon }) => {
  return (
    <div className="bg-blue-500 p-6 rounded-lg text-center">
      <div className="flex items-center justify-center">
        {icon}
        <h3 className="text-2xl font-bold ml-2">{number}</h3>
      </div>
      <p className="mt-2">{label}</p>
    </div>
  );
};

interface ResourceCardProps {
  title: string;
  items: string[];
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, items }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
      <h3 className="text-xl font-bold">{title}</h3>
      <ul className="mt-4 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-gray-600">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
