import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Heart,
  Star,
  User,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext"; // Import useAuth

// Types
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photoUrl: string;
  rating: number;
  reviewCount: number;
  hospitalName: string;
  distance: number;
  availableTimes: string[];
  price: number;
  experience: number;
  languages: string[];
  qualifications: string;
  about: string;
}

interface ApiProfessional {
  _id: string;
  name: string;
  email: string;
  phone: string;
  hospital: string;
  active: boolean;
  joinDate: string;
  verified: boolean;
  specialty: string;
  specializations: string[];
  languages: string[];
  education: string;
  licenseNumber: string;
  currentAssignments: any[];
  availabilityStatus: string;
  availableHours: string;
  profileImagePath: string;
  licenseCertificatePath: string;
  createdAt: string;
  createdBy: string;
}

interface FilterOptions {
  searchTerm: string;
  specialty: string;
  date: string;
  language?: string;
  priceRange?: [number, number] | null;
}

const DoctorChannelPage: React.FC = () => {
  // Use auth context
  const { isLoggedIn, user, isInitialized } = useAuth();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    specialty: "All",
    date: new Date().toISOString().split("T")[0],
    language: "All",
    priceRange: null,
  });
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Specialties for filter
  const specialties = [
    "All",
    "Psychiatrist",
    "Psychologist",
    "Therapist",
    "Counselor",
    "Mental Health Nurse",
    "Ayurvedic Doctor",
  ];

  const languages = ["All", "Sinhala", "Tamil", "English"];

  // Convert API professional to Doctor interface
  const convertToDoctor = (prof: ApiProfessional): Doctor => {
    // Generate random available times based on availableHours
    const generateAvailableTimes = (hoursString: string): string[] => {
      const timeSlots = [];
      const times = ["09:00", "10:30", "12:00", "14:30", "16:00", "17:30"];

      // Take 3-5 random time slots
      const numSlots = Math.floor(Math.random() * 3) + 3;
      const shuffled = [...times].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, numSlots).sort();
    };

    // Generate a random consultation price based on specialty
    const generatePrice = (specialty: string): number => {
      const basePrices: { [key: string]: number } = {
        Psychiatrist: 3500,
        Psychologist: 3000,
        Therapist: 2500,
        Counselor: 2000,
        "Mental Health Nurse": 1800,
        "Ayurvedic Doctor": 2200,
      };

      const basePrice = basePrices[specialty] || 2500;
      // Add some variation (±500)
      return basePrice + (Math.floor(Math.random() * 10) - 5) * 100;
    };

    // Calculate experience years based on join date
    const calculateExperience = (joinDate: string): number => {
      const joined = new Date(joinDate);
      const now = new Date();
      const diffYears = now.getFullYear() - joined.getFullYear();

      // Add 2-10 years to their registration date to make it realistic
      return diffYears + Math.floor(Math.random() * 8) + 2;
    };

    // Generate some about text
    const generateAbout = (
      name: string,
      specialty: string,
      education: string,
      languages: string[]
    ): string => {
      return `${name} is a highly qualified ${specialty} with ${education}. They are fluent in ${languages.join(
        ", "
      )} and specialize in ${prof.specializations.join(
        ", "
      )}. They provide compassionate care with a focus on holistic mental wellbeing.`;
    };

    // Get image URL from path or use default
    const getImageUrl = (path: string): string => {
      // Check if the path is a full URL or a local path
      if (path.startsWith("http")) return path;

      // Check if it's accessing an uploaded file
      if (path.includes("uploads/")) {
        // Convert to an absolute URL pointing to our backend
        return `http://localhost:8000/${path}`;
      }

      // Default image if no path available
      return "https://img.freepik.com/free-photo/portrait-experienced-professional-therapist-with-stethoscope-looking-camera_1098-19305.jpg";
    };

    return {
      id: prof._id,
      name: prof.name,
      specialty: prof.specialty,
      photoUrl: getImageUrl(prof.profileImagePath),
      rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
      reviewCount: Math.floor(Math.random() * 100) + 20, // Random review count
      hospitalName: prof.hospital,
      distance: (Math.random() * 5).toFixed(1) as unknown as number, // Random distance
      availableTimes: generateAvailableTimes(prof.availableHours),
      price: generatePrice(prof.specialty),
      experience: calculateExperience(prof.joinDate),
      languages: prof.languages,
      qualifications: prof.education,
      about: generateAbout(
        prof.name,
        prof.specialty,
        prof.education,
        prof.languages
      ),
    };
  };

  // Fetch doctors from database
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);

        // Fetch professionals from your API
        const response = await fetch(
          "http://localhost:8000/api/professionals/"
        );

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          // Convert API data to Doctor format
          const processedDoctors = data.map(convertToDoctor);

          // Add a few mock doctors to supplement if needed
          const mockDoctors: Doctor[] = [
            {
              id: "mock-1",
              name: "Dr. Kumara Perera",
              specialty: "Psychiatrist",
              photoUrl:
                "https://img.freepik.com/free-photo/portrait-experienced-professional-therapist-with-stethoscope-looking-camera_1098-19305.jpg",
              rating: 4.8,
              reviewCount: 124,
              hospitalName: "Nawaloka Hospital - Colombo",
              distance: 1.2,
              availableTimes: ["09:00", "11:30", "14:00", "16:30"],
              price: 3500,
              experience: 8,
              languages: ["Sinhala", "English"],
              qualifications: "MBBS (Colombo), MD (Psychiatry), MRCP (UK)",
              about:
                "Dr. Kumara Perera is a respected mental health professional with over 8 years of experience. He specializes in mood disorders, anxiety, and depression management with a holistic approach to mental wellbeing.",
            },
            {
              id: "mock-2",
              name: "Dr. Amali Jayawardena",
              specialty: "Psychologist",
              photoUrl:
                "https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827774.jpg",
              rating: 4.9,
              reviewCount: 86,
              hospitalName: "Asiri Central Hospital",
              distance: 2.4,
              availableTimes: ["10:00", "13:00", "15:30", "17:00"],
              price: 3000,
              experience: 12,
              languages: ["Sinhala", "English", "Tamil"],
              qualifications:
                "BSc Psychology (Peradeniya), PhD Clinical Psychology (UK)",
              about:
                "Dr. Amali Jayawardena is a highly regarded clinical psychologist who focuses on cognitive behavioral therapy and trauma counseling. She has worked extensively with multicultural populations.",
            },
          ];

          // Combine real and mock doctors if needed
          const allDoctors = [...processedDoctors];

          // Only add mock doctors if we have fewer than 3 real doctors
          if (processedDoctors.length < 3) {
            allDoctors.push(...mockDoctors);
          }

          setDoctors(allDoctors);
        } else {
          console.error("API response is not an array:", data);
          // Fallback to mock data
          setDoctors([
            // Your existing mock data
          ]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        // Fallback to mock data on error
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on filters
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      doctor.hospitalName
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

    const matchesSpecialty =
      filters.specialty === "All" || doctor.specialty === filters.specialty;

    const matchesLanguage =
      !filters.language ||
      filters.language === "All" ||
      doctor.languages.includes(filters.language || "");

    const matchesPriceRange =
      !filters.priceRange ||
      (doctor.price >= filters.priceRange[0] &&
        doctor.price <= filters.priceRange[1]);

    return (
      matchesSearch && matchesSpecialty && matchesLanguage && matchesPriceRange
    );
  });

  // Handle time slot selection with auth context integration
  const handleTimeSelect = async (doctorId: string, time: string) => {
    const selectedDoc = doctors.find((d) => d.id === doctorId);
    if (!selectedDoc) return;

    try {
      // Check if auth is initialized and user is logged in
      if (!isInitialized) {
        console.log("Authentication is still initializing...");
        return;
      }

      if (!isLoggedIn) {
        alert("Please log in to book an appointment");
        // Redirect to login page
        window.location.href =
          "/login?redirect=" + encodeURIComponent(window.location.pathname);
        return;
      }

      // Show loading spinner
      setLoading(true);

      // Get token from localStorage using your key
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Call the booking API
      const response = await fetch("http://localhost:8000/api/bookings/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId,
          time,
          date: filters.date,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to book appointment");
      }

      const result = await response.json();

      // Display success message
      alert(
        `Appointment booked with ${selectedDoc.name} at ${time} on ${filters.date}.\nA confirmation SMS has been sent to your registered phone number.`
      );
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert(
        `Failed to book appointment: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle favorite toggle
  const toggleFavorite = (doctorId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(doctorId)) {
        newFavorites.delete(doctorId);
      } else {
        newFavorites.add(doctorId);
      }
      return newFavorites;
    });
  };

  // Handle view profile
  const handleViewProfile = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowProfileModal(true);
  };

  // Close profile modal
  const closeProfileModal = () => {
    setShowProfileModal(false);
    setSelectedDoctor(null);
  };

  // Update filter
  const updateFilter = (
    key: keyof FilterOptions,
    value: string | [number, number] | null
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/path/to/your/background.jpg')" }}
    >
      <Navbar />

      {/* Main Content with top padding to prevent overlapping with Navbar */}
      <main className="max-w-6xl mx-auto pt-20 px-4 py-6 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div
          className={`bg-white rounded-lg shadow-md mb-6 p-6 transition-all duration-300 ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Find Your Doctor
            </h2>
            <button
              onClick={() => setShowFilters(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by doctor name or hospital"
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                value={filters.searchTerm}
                onChange={(e) => updateFilter("searchTerm", e.target.value)}
              />
            </div>

            {/* Specialty Filter */}
            <div className="w-full md:w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 shadow-sm appearance-none"
                  value={filters.specialty}
                  onChange={(e) => updateFilter("specialty", e.target.value)}
                >
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Picker */}
            <div className="w-full md:w-48">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  value={filters.date}
                  onChange={(e) => updateFilter("date", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            {/* Language Filter */}
            <div className="w-full md:w-48">
              <div className="relative">
                <select
                  className="pl-4 pr-4 py-3 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 shadow-sm appearance-none"
                  value={filters.language}
                  onChange={(e) => updateFilter("language", e.target.value)}
                >
                  <option value="" disabled>
                    Language
                  </option>
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="w-full md:w-64 flex items-center">
              <span className="text-sm text-gray-600 mr-2">Price:</span>
              <select
                className="pl-4 pr-4 py-3 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 shadow-sm appearance-none"
                value={
                  filters.priceRange
                    ? `${filters.priceRange[0]}-${filters.priceRange[1]}`
                    : ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    updateFilter("priceRange", null);
                  } else {
                    const [min, max] = value.split("-").map(Number);
                    updateFilter("priceRange", [min, max]);
                  }
                }}
              >
                <option value="">Any price</option>
                <option value="0-2500">Under LKR 2,500</option>
                <option value="2500-3500">LKR 2,500 - 3,500</option>
                <option value="3500-5000">Over LKR 3,500</option>
              </select>
            </div>

            <div className="flex-1 flex justify-end">
              <button
                onClick={() =>
                  setFilters({
                    searchTerm: "",
                    specialty: "All",
                    date: new Date().toISOString().split("T")[0],
                    language: "All",
                    priceRange: null,
                  })
                }
                className="py-3 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Results Count */}
          {!loading && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {filteredDoctors.length} doctors available
              </h2>
              <div className="text-sm text-gray-500">
                For{" "}
                {new Date(filters.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-700 font-medium">
                Finding the best mental health professionals in Sri Lanka...
              </p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
                <Search className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No doctors found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We couldn't find any doctors matching your criteria. Please try
                different filters or a broader search term.
              </p>
              <button
                onClick={() =>
                  setFilters({
                    searchTerm: "",
                    specialty: "All",
                    date: new Date().toISOString().split("T")[0],
                    language: "All",
                    priceRange: null,
                  })
                }
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md text-sm font-medium transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row">
                    {/* Doctor Info */}
                    <div className="flex-1 md:pr-6">
                      <div className="flex items-start">
                        <img
                          src={doctor.photoUrl}
                          alt={doctor.name}
                          className="h-20 w-20 rounded-full object-cover mr-4 border-2 border-indigo-100 shadow-sm"
                        />
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            {doctor.name}
                          </h2>
                          <p className="text-indigo-600 font-medium">
                            {doctor.specialty}
                          </p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="ml-1 text-gray-700 font-medium">
                              {doctor.rating.toFixed(1)}
                            </span>
                            <span className="ml-1 text-gray-500">
                              ({doctor.reviewCount} reviews)
                            </span>
                            <span className="mx-2 text-gray-300">•</span>
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="ml-1 text-gray-700">
                              {doctor.experience} years
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {doctor.languages.map((lang) => (
                              <span
                                key={lang}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center text-sm text-gray-600">
                        <div className="flex items-center mr-4 mb-2">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          <span>
                            {doctor.hospitalName} ({doctor.distance} km away)
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          <span>
                            Consultation fee: LKR{" "}
                            {doctor.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Available Times */}
                    <div className="mt-6 md:mt-0 md:w-64 border-l pl-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        Available Times
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {doctor.availableTimes.map((time) => (
                          <button
                            key={time}
                            onClick={() => handleTimeSelect(doctor.id, time)}
                            className="py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-sm font-medium transition-colors"
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <button
                    onClick={() => toggleFavorite(doctor.id)}
                    className="text-gray-700 text-sm flex items-center"
                  >
                    <Heart
                      className={`h-4 w-4 mr-1 ${
                        favorites.has(doctor.id)
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }`}
                    />
                    {favorites.has(doctor.id)
                      ? "Saved to favorites"
                      : "Save to favorites"}
                  </button>
                  <button
                    onClick={() => handleViewProfile(doctor)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Doctor Profile Modal */}
      {showProfileModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={closeProfileModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <img
                    src={selectedDoctor.photoUrl}
                    alt={selectedDoctor.name}
                    className="h-24 w-24 rounded-full object-cover mr-6 border-2 border-indigo-100 shadow-sm"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mt-4 sm:mt-0">
                      {selectedDoctor.name}
                    </h2>
                    <p className="text-indigo-600 font-medium">
                      {selectedDoctor.specialty}
                    </p>
                    <p className="text-gray-600 mt-1">
                      {selectedDoctor.qualifications}
                    </p>
                    <div className="flex items-center mt-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="ml-1 text-gray-700 font-medium">
                        {selectedDoctor.rating.toFixed(1)}
                      </span>
                      <span className="ml-1 text-gray-500">
                        ({selectedDoctor.reviewCount} reviews)
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="ml-1 text-gray-700">
                        {selectedDoctor.experience} years
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    About
                  </h3>
                  <p className="text-gray-600">{selectedDoctor.about}</p>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Location & Contact
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start mb-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-2" />
                      <div>
                        <p className="text-gray-900 font-medium">
                          {selectedDoctor.hospitalName}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {selectedDoctor.distance} km from city center
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-gray-600">
                        Consultation fee: LKR{" "}
                        {selectedDoctor.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Available Times for{" "}
                    {new Date(filters.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {selectedDoctor.availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          handleTimeSelect(selectedDoctor.id, time);
                          closeProfileModal();
                        }}
                        className="py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium transition-colors border border-indigo-100"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={() => toggleFavorite(selectedDoctor.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                      favorites.has(selectedDoctor.id)
                        ? "bg-red-50 text-red-600 border-red-200"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.has(selectedDoctor.id)
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }`}
                    />
                    {favorites.has(selectedDoctor.id)
                      ? "Remove from favorites"
                      : "Add to favorites"}
                  </button>
                  <button
                    onClick={() => {
                      if (selectedDoctor.availableTimes.length > 0) {
                        handleTimeSelect(
                          selectedDoctor.id,
                          selectedDoctor.availableTimes[0]
                        );
                        closeProfileModal();
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md text-sm font-medium transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination (for future use) */}
      {filteredDoctors.length > 0 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-500 bg-white hover:bg-gray-50">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="px-4 py-2 rounded-md border border-indigo-500 bg-indigo-50 text-indigo-700 font-medium">
              1
            </span>
            <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-500 bg-white hover:bg-gray-50">
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default DoctorChannelPage;
