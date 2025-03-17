// RecommendationsPage.tsx
import React, { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import {
  HeartHandshake,
  Lightbulb,
  Heart,
  BookOpen,
  Activity,
} from "lucide-react";

// Types for our recommendation data
interface Recommendation {
  id: string;
  title: string;
  description: string;
  source?: string;
  tags: string[];
}

interface Resource {
  id: string;
  name: string;
  description: string;
  contactInfo?: string;
  website?: string;
  location?: string;
  specialties?: string[];
}

interface SelfCareTip {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  timeRequired: string;
  benefits: string[];
}

interface MindfulnessExercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  steps: string[];
  benefits: string[];
}

const RecommendationsPage: React.FC = () => {
  // State for personalized recommendations
  const [personalizedRecommendations, setPersonalizedRecommendations] =
    useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration purposes
  const mockCopingStrategies: Recommendation[] = [
    {
      id: "1",
      title: "Deep Breathing Exercise",
      description:
        "Practice deep breathing for 5 minutes when feeling overwhelmed. Inhale for 4 counts, hold for 2, exhale for 6.",
      tags: ["anxiety", "stress", "immediate relief"],
    },
    {
      id: "2",
      title: "Progressive Muscle Relaxation",
      description:
        "Tense and then relax each muscle group, starting from your toes and working up to your head.",
      tags: ["tension", "stress", "physical symptoms"],
    },
    {
      id: "3",
      title: "Thought Challenging",
      description:
        "Identify negative thoughts and challenge them with evidence-based alternatives.",
      tags: ["depression", "negative thoughts", "cognitive"],
    },
    {
      id: "4",
      title: "5-4-3-2-1 Grounding Technique",
      description:
        "Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
      tags: ["anxiety", "panic", "dissociation"],
    },
  ];

  const selfCareTips: SelfCareTip[] = [
    {
      id: "1",
      title: "Morning Nature Walk",
      description:
        "Take a 15-minute walk in nature before starting your workday. Focus on the sounds, sights, and smells around you.",
      difficulty: "easy",
      timeRequired: "15 minutes",
      benefits: ["Reduces stress", "Increases vitamin D", "Improves focus"],
    },
    {
      id: "2",
      title: "Digital Detox Hour",
      description:
        "Set aside one hour each day to disconnect from all digital devices and social media.",
      difficulty: "medium",
      timeRequired: "1 hour",
      benefits: ["Reduces anxiety", "Improves sleep", "Increases mindfulness"],
    },
    {
      id: "3",
      title: "Gratitude Journaling",
      description:
        "Write down three things you're grateful for each day before bed.",
      difficulty: "easy",
      timeRequired: "5 minutes",
      benefits: [
        "Improves mood",
        "Increases optimism",
        "Enhances sleep quality",
      ],
    },
    {
      id: "4",
      title: "Healthy Meal Preparation",
      description:
        "Dedicate time once a week to prepare nutritious meals that support your mental health.",
      difficulty: "medium",
      timeRequired: "2 hours weekly",
      benefits: [
        "Improves nutrition",
        "Reduces decision fatigue",
        "Creates healthy routine",
      ],
    },
  ];

  const mentalHealthResources: Resource[] = [
    {
      id: "1",
      name: "National Mental Health Helpline - Sri Lanka",
      description:
        "24/7 helpline for mental health support and crisis intervention",
      contactInfo: "1926",
      website: "https://nimh.health.gov.lk",
      specialties: ["Crisis intervention", "Mental health referrals"],
    },
    {
      id: "2",
      name: "Sumithrayo",
      description:
        "Non-profit organization providing emotional support to those experiencing suicidal thoughts or despair",
      contactInfo: "0112 682535 / 0112 682570",
      website: "https://sumithrayo.org",
      location: "Colombo",
      specialties: ["Suicide prevention", "Emotional support"],
    },
    {
      id: "3",
      name: "Shanthi Maargam",
      description: "Counseling and psychosocial support services",
      contactInfo: "0114 722975",
      website: "https://shanthimaargam.org",
      location: "Multiple locations",
      specialties: ["Counseling", "Psychosocial support"],
    },
    {
      id: "4",
      name: "CCC Line",
      description: "Free professional counseling service",
      contactInfo: "1333",
      specialties: ["Counseling", "Crisis intervention"],
    },
  ];

  const mindfulnessExercises: MindfulnessExercise[] = [
    {
      id: "1",
      title: "Body Scan Meditation",
      description:
        "A practice that involves paying attention to parts of the body and bodily sensations in a gradual sequence.",
      duration: "10-20 minutes",
      steps: [
        "Lie down in a comfortable position",
        "Close your eyes and take a few deep breaths",
        "Bring awareness to your feet and notice any sensations",
        "Gradually move your attention up through your body",
        "Notice areas of tension or discomfort without judgment",
        "Complete the scan at the top of your head",
      ],
      benefits: [
        "Reduces stress",
        "Improves body awareness",
        "Helps identify areas of tension",
      ],
    },
    {
      id: "2",
      title: "Mindful Walking",
      description:
        "Walking with awareness of each step and breath, focusing fully on the experience of walking.",
      duration: "10-30 minutes",
      steps: [
        "Choose a quiet place to walk",
        "Stand still and become aware of your body",
        "Begin walking slowly, noticing the sensation of each foot as it touches the ground",
        "Synchronize your breathing with your steps if possible",
        "When your mind wanders, gently bring it back to the physical sensations of walking",
      ],
      benefits: [
        "Reduces anxiety",
        "Improves concentration",
        "Combines physical activity with mindfulness",
      ],
    },
    {
      id: "3",
      title: "Five Senses Awareness",
      description:
        "A quick mindfulness exercise focusing on using all five senses to anchor yourself in the present moment.",
      duration: "5 minutes",
      steps: [
        "Sit comfortably and take a few deep breaths",
        "Notice 5 things you can see around you",
        "Become aware of 4 things you can touch or feel",
        "Listen for 3 distinct sounds in your environment",
        "Identify 2 things you can smell",
        "Notice 1 thing you can taste",
      ],
      benefits: [
        "Quickly grounds you in the present",
        "Helpful during anxiety or stress",
        "Easy to practice anywhere",
      ],
    },
    {
      id: "4",
      title: "Loving-Kindness Meditation",
      description:
        "A practice of directing positive thoughts and well-wishes to yourself and others.",
      duration: "10-15 minutes",
      steps: [
        "Sit comfortably and take a few deep breaths",
        'Begin by directing kind thoughts to yourself ("May I be happy, may I be healthy...")',
        "Extend these wishes to a loved one",
        "Then to a neutral person in your life",
        "Then to someone with whom you have difficulty",
        "Finally, extend loving-kindness to all beings",
      ],
      benefits: [
        "Increases positive emotions",
        "Develops compassion",
        "Reduces negative feelings toward self and others",
      ],
    },
  ];

  // Simulate fetching personalized recommendations
  useEffect(() => {
    const fetchPersonalizedRecommendations = async () => {
      // In a real application, this would be an API call based on user data
      // For now, we'll simulate with a timeout and mock data
      setTimeout(() => {
        const mockPersonalizedRecommendations: Recommendation[] = [
          {
            id: "p1",
            title: "Journal Your Thoughts",
            description:
              "Based on your recent mood patterns, taking 10 minutes to journal your thoughts may help process emotions.",
            tags: ["mood", "reflection", "personalized"],
          },
          {
            id: "p2",
            title: "Connect with a Friend",
            description:
              "Your social interaction has decreased recently. Consider reaching out to a close friend for support.",
            tags: ["social", "connection", "support"],
          },
          {
            id: "p3",
            title: "Try a New Relaxation Technique",
            description:
              "Your anxiety indicators suggest trying progressive muscle relaxation might be helpful.",
            tags: ["anxiety", "relaxation", "technique"],
          },
        ];

        setPersonalizedRecommendations(mockPersonalizedRecommendations);
        setLoading(false);
      }, 1500);
    };

    fetchPersonalizedRecommendations();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-2">
          Recommendations & Coping Strategies
        </h1>
        <p className="text-gray-600">
          Discover personalized resources and techniques to support your mental
          wellbeing journey.
        </p>
      </div>

      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-indigo-100 rounded-xl mb-8">
          <Tab
            className={({ selected }) =>
              `w-full py-3 text-sm leading-5 font-medium rounded-lg
              ${
                selected
                  ? "bg-white text-indigo-700 shadow"
                  : "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
              } flex items-center justify-center transition-all`
            }
          >
            <HeartHandshake className="w-5 h-5 mr-2" />
            <span>Coping Strategies</span>
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full py-3 text-sm leading-5 font-medium rounded-lg
              ${
                selected
                  ? "bg-white text-indigo-700 shadow"
                  : "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
              } flex items-center justify-center transition-all`
            }
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            <span>Personalized</span>
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full py-3 text-sm leading-5 font-medium rounded-lg
              ${
                selected
                  ? "bg-white text-indigo-700 shadow"
                  : "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
              } flex items-center justify-center transition-all`
            }
          >
            <Heart className="w-5 h-5 mr-2" />
            <span>Self-Care Tips</span>
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full py-3 text-sm leading-5 font-medium rounded-lg
              ${
                selected
                  ? "bg-white text-indigo-700 shadow"
                  : "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
              } flex items-center justify-center transition-all`
            }
          >
            <BookOpen className="w-5 h-5 mr-2" />
            <span>Resources</span>
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full py-3 text-sm leading-5 font-medium rounded-lg
              ${
                selected
                  ? "bg-white text-indigo-700 shadow"
                  : "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
              } flex items-center justify-center transition-all`
            }
          >
            <Activity className="w-5 h-5 mr-2" />
            <span>Mindfulness</span>
          </Tab>
        </Tab.List>

        <Tab.Panels className="mt-2">
          {/* Coping Strategies Panel */}
          <Tab.Panel className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
              Effective Coping Strategies
            </h2>
            <p className="text-gray-600 mb-6">
              These evidence-based techniques can help you manage difficult
              emotions and situations. Try different strategies to find what
              works best for you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockCopingStrategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className="border border-indigo-100 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-medium text-indigo-800 mb-2">
                    {strategy.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{strategy.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {strategy.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-indigo-50 rounded-lg">
              <h3 className="text-lg font-medium text-indigo-800 mb-2">
                Important Note
              </h3>
              <p className="text-gray-700">
                These strategies are meant to complement professional care, not
                replace it. If you're experiencing severe distress, please
                contact a mental health professional or use one of the emergency
                resources listed in the Resources tab.
              </p>
            </div>
          </Tab.Panel>

          {/* Personalized Recommendations Panel */}
          <Tab.Panel className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
              Your Personalized Recommendations
            </h2>
            <p className="text-gray-600 mb-6">
              Based on your mood patterns and inputs, here are suggestions that
              may be especially helpful for you.
            </p>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {personalizedRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-50 rounded-r-lg"
                  >
                    <h3 className="text-xl font-medium text-indigo-800 mb-2">
                      {rec.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{rec.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {rec.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                <button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                  Refresh Recommendations
                </button>
              </div>
            )}

            <div className="mt-8 p-5 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">
                How These Work
              </h3>
              <p className="text-gray-700">
                These recommendations are generated based on patterns in your
                mood tracking, journal entries, and other data you've shared
                with MoodSync. The more you interact with the app, the more
                personalized these suggestions will become.
              </p>
            </div>
          </Tab.Panel>

          {/* Self-Care Tips Panel */}
          <Tab.Panel className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
              Self-Care Practices
            </h2>
            <p className="text-gray-600 mb-6">
              Regular self-care is essential for maintaining mental wellbeing.
              Explore these practices to find activities that resonate with you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selfCareTips.map((tip) => (
                <div key={tip.id} className="border rounded-lg overflow-hidden">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-medium text-indigo-800">
                        {tip.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          tip.difficulty === "easy"
                            ? "bg-green-100 text-green-800"
                            : tip.difficulty === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tip.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{tip.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg
                        className="w-5 h-5 mr-1 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span>{tip.timeRequired}</span>
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-4">
                    <h4 className="text-sm font-semibold text-indigo-700 mb-2">
                      Benefits:
                    </h4>
                    <ul className="text-sm space-y-1">
                      {tip.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="w-4 h-4 mt-0.5 mr-2 text-indigo-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                View More Self-Care Tips
              </button>
            </div>
          </Tab.Panel>

          {/* Mental Health Resources Panel */}
          <Tab.Panel className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
              Sri Lankan Mental Health Resources
            </h2>
            <p className="text-gray-600 mb-6">
              These organizations provide support, counseling, and emergency
              services for mental health concerns.
            </p>

            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-5 mb-6">
                <h3 className="text-lg font-semibold text-red-700 mb-2">
                  Emergency Contact
                </h3>
                <p className="text-gray-700 mb-2">
                  If you or someone you know is in immediate danger, please
                  call:
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="tel:1926"
                    className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                    <span>1926 - Mental Health Helpline</span>
                  </a>
                  <a
                    href="tel:1990"
                    className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                    <span>1990 - Suwa Seriya Ambulance</span>
                  </a>
                </div>
              </div>

              <div className="divide-y">
                {mentalHealthResources.map((resource) => (
                  <div key={resource.id} className="py-5">
                    <h3 className="text-xl font-medium text-indigo-800 mb-2">
                      {resource.name}
                    </h3>
                    <p className="text-gray-600 mb-3">{resource.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                      {resource.contactInfo && (
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            ></path>
                          </svg>
                          <span className="text-gray-700">
                            {resource.contactInfo}
                          </span>
                        </div>
                      )}

                      {resource.location && (
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                          </svg>
                          <span className="text-gray-700">
                            {resource.location}
                          </span>
                        </div>
                      )}
                    </div>

                    {resource.website && (
                      <a
                        href={resource.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          ></path>
                        </svg>
                        <span>Visit Website</span>
                      </a>
                    )}

                    {resource.specialties &&
                      resource.specialties.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-2">
                            {resource.specialties.map((specialty) => (
                              <span
                                key={specialty}
                                className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </Tab.Panel>

          {/* Mindfulness & Relaxation Panel */}
          <Tab.Panel className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
              Mindfulness & Relaxation Techniques
            </h2>
            <p className="text-gray-600 mb-6">
              Regular mindfulness practice can reduce stress, improve focus, and
              enhance overall wellbeing. Try these exercises to develop greater
              awareness and calm.
            </p>

            <div className="space-y-8">
              {mindfulnessExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-indigo-50 rounded-lg overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-medium text-indigo-800 mb-2">
                      {exercise.title}
                    </h3>
                    <p className="text-gray-700 mb-4">{exercise.description}</p>

                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <svg
                        className="w-5 h-5 mr-1 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span>{exercise.duration}</span>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-indigo-700 mb-2"></h4>
                      <h4 className="font-medium text-indigo-700 mb-2">
                        Steps:
                      </h4>
                      <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                        {exercise.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="bg-white p-4 border-t border-indigo-100">
                    <h4 className="text-sm font-semibold text-indigo-700 mb-2">
                      Benefits:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {exercise.benefits.map((benefit, index) => (
                        <span
                          key={index}
                          className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-indigo-100 p-5 rounded-lg">
              <h3 className="text-lg font-medium text-indigo-800 mb-2">
                Start a Guided Session
              </h3>
              <p className="text-gray-700 mb-4">
                Would you like to try a guided mindfulness session right now?
                Select a duration and get started.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-white text-indigo-700 font-medium py-2 px-5 rounded-lg hover:bg-indigo-700 hover:text-white transition-colors border border-indigo-200">
                  5 Minutes
                </button>
                <button className="bg-white text-indigo-700 font-medium py-2 px-5 rounded-lg hover:bg-indigo-700 hover:text-white transition-colors border border-indigo-200">
                  10 Minutes
                </button>
                <button className="bg-white text-indigo-700 font-medium py-2 px-5 rounded-lg hover:bg-indigo-700 hover:text-white transition-colors border border-indigo-200">
                  15 Minutes
                </button>
                <button className="bg-white text-indigo-700 font-medium py-2 px-5 rounded-lg hover:bg-indigo-700 hover:text-white transition-colors border border-indigo-200">
                  20 Minutes
                </button>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <div className="mt-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-indigo-800 mb-3">
          Need More Support?
        </h2>
        <p className="text-gray-700 mb-4">
          Remember that seeking help is a sign of strength, not weakness. If
          you're experiencing ongoing difficulties, professional support can
          make a difference.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
            <span>Chat with a Professional</span>
          </button>
          <button className="bg-white hover:bg-gray-50 text-indigo-700 font-medium py-2.5 px-6 rounded-lg transition-colors border border-indigo-200 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <span>Find Local Services</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
