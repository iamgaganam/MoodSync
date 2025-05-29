import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  X,
  CheckCircle,
} from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

// Fetch from the database.
const API_CONFIG = {
  BASE_URL: "http://localhost:8000/api",
  ENDPOINTS: {
    PROFESSIONALS: "/professionals/",
  },
} as const;

const SPECIALTIES = [
  "All",
  "Psychiatrist",
  "Psychologist",
  "Therapist",
  "Counselor",
  "Mental Health Nurse",
  "Ayurvedic Doctor",
] as const;

const LANGUAGES = ["All", "Sinhala", "Tamil", "English"] as const;

const PRICE_RANGES = [
  { label: "Any price", value: "" },
  { label: "Under LKR 2,500", value: "0-2500" },
  { label: "LKR 2,500 - 3,500", value: "2500-3500" },
  { label: "Over LKR 3,500", value: "3500-5000" },
] as const;

const DEFAULT_DOCTOR_IMAGE =
  "https://img.freepik.com/free-photo/portrait-experienced-professional-therapist-with-stethoscope-looking-camera_1098-19305.jpg";
const TIME_SLOTS = [
  "09:00",
  "10:30",
  "12:00",
  "14:30",
  "16:00",
  "17:30",
] as const;

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
  specialty: string;
  specializations: string[];
  languages: string[];
  education: string;
  joinDate: string;
  availableHours: string;
  profileImagePath: string;
}

interface FilterOptions {
  searchTerm: string;
  specialty: string;
  date: string;
  language: string;
  priceRange: [number, number] | null;
}

interface BookingDetails {
  doctorName: string;
  time: string;
  date: string;
  hospital: string;
}

// Utility Functions
const sanitizeImageUrl = (path: string): string => {
  if (!path) return DEFAULT_DOCTOR_IMAGE;

  if (path.startsWith("http")) return path;
  if (path.includes("uploads/")) return `${API_CONFIG.BASE_URL}/${path}`;

  return DEFAULT_DOCTOR_IMAGE;
};

const generateAvailableTimes = (): string[] => {
  const numSlots = Math.floor(Math.random() * 3) + 3;
  const shuffled = [...TIME_SLOTS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numSlots).sort();
};

const calculatePrice = (specialty: string): number => {
  const basePrices: Record<string, number> = {
    Psychiatrist: 3500,
    Psychologist: 3000,
    Therapist: 2500,
    Counselor: 2000,
    "Mental Health Nurse": 1800,
    "Ayurvedic Doctor": 2200,
  };

  const basePrice = basePrices[specialty] || 2500;
  return basePrice + (Math.floor(Math.random() * 10) - 5) * 100;
};

const calculateExperience = (joinDate: string): number => {
  const joined = new Date(joinDate);
  const now = new Date();
  const diffYears = now.getFullYear() - joined.getFullYear();
  return Math.max(1, diffYears + Math.floor(Math.random() * 8) + 2);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const convertApiToDoctor = (prof: ApiProfessional): Doctor => ({
  id: prof._id,
  name: prof.name,
  specialty: prof.specialty,
  photoUrl: sanitizeImageUrl(prof.profileImagePath),
  rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
  reviewCount: Math.floor(Math.random() * 100) + 20,
  hospitalName: prof.hospital,
  distance: Number((Math.random() * 5).toFixed(1)),
  availableTimes: generateAvailableTimes(),
  price: calculatePrice(prof.specialty),
  experience: calculateExperience(prof.joinDate),
  languages: prof.languages,
  qualifications: prof.education,
  about: `${prof.name} is a highly qualified ${prof.specialty} with ${
    prof.education
  }. They are fluent in ${prof.languages.join(
    ", "
  )} and provide compassionate care with a focus on holistic mental wellbeing.`,
});

// Components
interface SearchFiltersProps {
  filters: FilterOptions;
  onFilterChange: (key: keyof FilterOptions, value: any) => void;
  onReset: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  showFilters,
  onToggleFilters,
}) => (
  <div
    className={`bg-white rounded-lg shadow-md mb-6 p-6 transition-all duration-300 ${
      showFilters ? "block" : "hidden md:block"
    }`}
  >
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-medium text-gray-900">Find Your Doctor</h2>
      <button
        onClick={onToggleFilters}
        className="md:hidden text-gray-500 hover:text-gray-700"
        aria-label="Close filters"
      >
        <X className="h-5 w-5" />
      </button>
    </div>

    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by doctor name or hospital"
          className="pl-10 pr-4 py-3 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          value={filters.searchTerm}
          onChange={(e) => onFilterChange("searchTerm", e.target.value)}
        />
      </div>

      {/* Specialty Filter */}
      <div className="w-full md:w-64">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 shadow-sm appearance-none"
            value={filters.specialty}
            onChange={(e) => onFilterChange("specialty", e.target.value)}
          >
            {SPECIALTIES.map((specialty) => (
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
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="date"
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            value={filters.date}
            onChange={(e) => onFilterChange("date", e.target.value)}
          />
        </div>
      </div>
    </div>

    {/* Advanced Filters */}
    <div className="mt-4 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
      {/* Language Filter */}
      <div className="w-full md:w-48">
        <select
          className="pl-4 pr-4 py-3 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 shadow-sm appearance-none"
          value={filters.language}
          onChange={(e) => onFilterChange("language", e.target.value)}
        >
          {LANGUAGES.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="w-full md:w-64">
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
              onFilterChange("priceRange", null);
            } else {
              const [min, max] = value.split("-").map(Number);
              onFilterChange("priceRange", [min, max]);
            }
          }}
        >
          {PRICE_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 flex justify-end">
        <button
          onClick={onReset}
          className="py-3 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  </div>
);

interface DoctorCardProps {
  doctor: Doctor;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onTimeSelect: (id: string, time: string) => void;
  onViewProfile: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  isFavorite,
  onToggleFavorite,
  onTimeSelect,
  onViewProfile,
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="p-6">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 md:pr-6">
          <div className="flex items-start">
            <img
              src={doctor.photoUrl}
              alt={doctor.name}
              className="h-20 w-20 rounded-full object-cover mr-4 border-2 border-indigo-100 shadow-sm"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_DOCTOR_IMAGE;
              }}
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {doctor.name}
              </h2>
              <p className="text-indigo-600 font-medium">{doctor.specialty}</p>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="ml-1 text-gray-700 font-medium">
                  {doctor.rating}
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
              <span>Consultation fee: LKR {doctor.price.toLocaleString()}</span>
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
                onClick={() => onTimeSelect(doctor.id, time)}
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
        onClick={() => onToggleFavorite(doctor.id)}
        className="text-gray-700 text-sm flex items-center hover:text-red-600 transition-colors"
      >
        <Heart
          className={`h-4 w-4 mr-1 ${
            isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
          }`}
        />
        {isFavorite ? "Saved to favorites" : "Save to favorites"}
      </button>
      <button
        onClick={() => onViewProfile(doctor)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
      >
        View Profile
      </button>
    </div>
  </div>
);

interface DoctorProfileModalProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
  onTimeSelect: (id: string, time: string) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
  selectedDate: string;
}

const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  isOpen,
  onClose,
  onTimeSelect,
  onToggleFavorite,
  isFavorite,
  selectedDate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <img
                src={doctor.photoUrl}
                alt={doctor.name}
                className="h-24 w-24 rounded-full object-cover mr-6 border-2 border-indigo-100 shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_DOCTOR_IMAGE;
                }}
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mt-4 sm:mt-0">
                  {doctor.name}
                </h2>
                <p className="text-indigo-600 font-medium">
                  {doctor.specialty}
                </p>
                <p className="text-gray-600 mt-1">{doctor.qualifications}</p>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-gray-700 font-medium">
                    {doctor.rating}
                  </span>
                  <span className="ml-1 text-gray-500">
                    ({doctor.reviewCount} reviews)
                  </span>
                  <span className="mx-2 text-gray-300">•</span>
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="ml-1 text-gray-700">
                    {doctor.experience} years
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">About</h3>
              <p className="text-gray-600">{doctor.about}</p>
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
                      {doctor.hospitalName}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {doctor.distance} km from city center
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="text-gray-600">
                    Consultation fee: LKR {doctor.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Available Times for {formatDate(selectedDate)}
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {doctor.availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => onTimeSelect(doctor.id, time)}
                    className="py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium transition-colors border border-indigo-100"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => onToggleFavorite(doctor.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                  isFavorite
                    ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
                  }`}
                />
                {isFavorite ? "Remove from favorites" : "Add to favorites"}
              </button>
              <button
                onClick={() => {
                  if (doctor.availableTimes.length > 0) {
                    onTimeSelect(doctor.id, doctor.availableTimes[0]);
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
  );
};

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: BookingDetails;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
  isOpen,
  onClose,
  bookingDetails,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Booking Confirmed!
          </h2>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-gray-800 font-medium mb-2">
              Appointment details:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <User className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span>Doctor: {bookingDetails.doctorName}</span>
              </li>
              <li className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span>Date: {formatDate(bookingDetails.date)}</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span>Time: {bookingDetails.time}</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span>Location: {bookingDetails.hospital}</span>
              </li>
            </ul>
          </div>

          <p className="text-gray-600 text-center mb-6">
            A confirmation has been sent to your registered contact details.
          </p>

          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-8 rounded-md text-sm font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const DoctorChannelPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );

  // Fetch doctors data
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFESSIONALS}`
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        const processedDoctors = data.map(convertApiToDoctor);
        setDoctors(processedDoctors);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Failed to load doctors. Please try again later.");
      setDoctors([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        doctor.hospitalName
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      const matchesSpecialty =
        filters.specialty === "All" || doctor.specialty === filters.specialty;

      const matchesLanguage =
        filters.language === "All" ||
        doctor.languages.includes(filters.language);

      const matchesPriceRange =
        !filters.priceRange ||
        (doctor.price >= filters.priceRange[0] &&
          doctor.price <= filters.priceRange[1]);

      return (
        matchesSearch &&
        matchesSpecialty &&
        matchesLanguage &&
        matchesPriceRange
      );
    });
  }, [doctors, filters]);

  // Event handlers
  const handleFilterChange = useCallback(
    (key: keyof FilterOptions, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      specialty: "All",
      date: new Date().toISOString().split("T")[0],
      language: "All",
      priceRange: null,
    });
  }, []);

  const handleTimeSelect = useCallback(
    async (doctorId: string, time: string) => {
      const selectedDoc = doctors.find((d) => d.id === doctorId);
      if (!selectedDoc) return;

      try {
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        setBookingDetails({
          doctorName: selectedDoc.name,
          time,
          date: filters.date,
          hospital: selectedDoc.hospitalName,
        });

        setShowSuccessDialog(true);
        setShowProfileModal(false);
      } catch (err) {
        console.error("Error booking appointment:", err);
        setError("Failed to book appointment. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [doctors, filters.date]
  );

  const handleToggleFavorite = useCallback((doctorId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(doctorId)) {
        newFavorites.delete(doctorId);
      } else {
        newFavorites.add(doctorId);
      }
      return newFavorites;
    });
  }, []);

  const handleViewProfile = useCallback((doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowProfileModal(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto pt-20 px-4 py-6 sm:px-6 lg:px-8">
        <SearchFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Results Section */}
        <div className="space-y-4">
          {!loading && !error && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {filteredDoctors.length} doctors available
              </h2>
              <div className="text-sm text-gray-500">
                For {formatDate(filters.date)}
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-700 font-medium">
                Finding the best mental health professionals...
              </p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Error Loading Doctors
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchDoctors}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
                <Search className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No doctors found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                We couldn't find any doctors matching your criteria. Please try
                different filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md text-sm font-medium transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                isFavorite={favorites.has(doctor.id)}
                onToggleFavorite={handleToggleFavorite}
                onTimeSelect={handleTimeSelect}
                onViewProfile={handleViewProfile}
              />
            ))
          )}
        </div>
      </main>

      {/* Modals */}
      {selectedDoctor && (
        <DoctorProfileModal
          doctor={selectedDoctor}
          isOpen={showProfileModal}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedDoctor(null);
          }}
          onTimeSelect={handleTimeSelect}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={favorites.has(selectedDoctor.id)}
          selectedDate={filters.date}
        />
      )}

      {bookingDetails && (
        <SuccessDialog
          isOpen={showSuccessDialog}
          onClose={() => {
            setShowSuccessDialog(false);
            setBookingDetails(null);
          }}
          bookingDetails={bookingDetails}
        />
      )}

      <Footer />
    </div>
  );
};

export default DoctorChannelPage;
