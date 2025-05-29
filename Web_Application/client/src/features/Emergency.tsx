// client/src/pages/EmergencyAlerts.tsx
import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Phone,
  MessageSquare,
  Bell,
  Zap,
  X,
  Trash2,
  Heart,
  Shield,
  Info,
  ExternalLink,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundImage from "../assets/emergency.jpg";
import {
  emergencyContactService,
  EmergencyContact,
} from "../services/emergencyContactService";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fadeIn">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
};

const EmergencyAlerts: React.FC = () => {
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const [personalContacts, setPersonalContacts] = useState<EmergencyContact[]>(
    []
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal state for cards
  const [crisisHelpOpen, setCrisisHelpOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  // Set default userId if not already present (for development/testing)
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", "current-user");
      console.log("Set default userId for testing");
    }
  }, []);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Test API endpoint for debugging
  useEffect(() => {
    const testApi = async () => {
      try {
        const userId = localStorage.getItem("userId") || "current-user";
        console.log("Testing API with userId:", userId);
        await emergencyContactService.getContacts();
        console.log("API test completed successfully");
      } catch (err: any) {
        console.error("API test failed:", err);
        console.error(
          "Error details:",
          err.response ? err.response.data : err.message
        );
      }
    };

    if (showEmergencyContacts) {
      testApi();
    }
  }, [showEmergencyContacts]);

  // Fetch existing contacts when component mounts or when showEmergencyContacts changes
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching emergency contacts...");
        const contacts = await emergencyContactService.getContacts();
        console.log("Fetched contacts:", contacts);
        setPersonalContacts(contacts);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching contacts:", err);
        console.error(
          "Error details:",
          err.response ? err.response.data : err.message
        );
        setError(
          `Failed to load your emergency contacts: ${
            err.response ? err.response.data.detail : err.message
          }`
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if the emergency contacts section is shown
    if (showEmergencyContacts) {
      fetchContacts();
    }
  }, [showEmergencyContacts]);

  const handleAddContact = async () => {
    if (newContactName && newContactPhone) {
      try {
        setIsLoading(true);
        // Get the user ID from localStorage or context
        const userId = localStorage.getItem("userId") || "current-user"; // Fallback

        console.log("Adding new contact:", {
          name: newContactName,
          phone: newContactPhone,
          userId,
        });

        // Save to database
        const newContact = await emergencyContactService.addContact({
          name: newContactName,
          phone: newContactPhone,
          userId,
        });

        console.log("Contact added successfully:", newContact);

        // Update local state with the returned contact (includes ID from database)
        setPersonalContacts([...personalContacts, newContact]);

        // Show success message
        setSuccessMessage(
          `${newContactName} has been added to your emergency contacts.`
        );

        // Reset form
        setNewContactName("");
        setNewContactPhone("");
        setShowAddForm(false);
        setError(null);
      } catch (err: any) {
        console.error("Error adding contact:", err);
        console.error(
          "Error details:",
          err.response ? err.response.data : err.message
        );
        setError(
          `Failed to save contact: ${
            err.response ? err.response.data.detail : err.message
          }`
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please enter both name and phone number.");
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      setIsLoading(true);
      console.log("Deleting contact with ID:", id);
      await emergencyContactService.deleteContact(id);
      console.log("Contact deleted successfully");

      const deletedContact = personalContacts.find(
        (contact) => contact.id === id
      );
      setPersonalContacts(
        personalContacts.filter((contact) => contact.id !== id)
      );
      setSuccessMessage(
        deletedContact
          ? `${deletedContact.name} has been removed from your contacts.`
          : "Contact has been removed successfully."
      );
      setError(null);
    } catch (err: any) {
      console.error("Error deleting contact:", err);
      console.error(
        "Error details:",
        err.response ? err.response.data : err.message
      );
      setError(
        `Failed to delete contact: ${
          err.response ? err.response.data.detail : err.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Format phone number for display (with spaces for readability)
  const formatPhoneNumber = (phone: string) => {
    // Simple formatting - insert spaces every 3 digits
    return phone.replace(/(\d{3})(?=\d)/g, "$1 ");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Navbar />
      {/* Add top padding to prevent overlapping with fixed navbar */}
      <div className="pt-20">
        <div className="py-8">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto my-8">
            {/* Header */}
            <div className="border-b border-red-200 pb-4 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-red-600 flex items-center">
                    <AlertCircle className="mr-2" />
                    Emergency &amp; Support Resources
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Access immediate help and support when you need it most
                  </p>
                </div>
                <button
                  onClick={() => setInfoModalOpen(true)}
                  className="text-blue-500 hover:text-blue-700 flex items-center"
                  aria-label="Learn more about emergency resources"
                >
                  <Info size={18} className="mr-1" />
                  <span className="text-sm">Learn More</span>
                </button>
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-md border border-green-200 flex items-start">
                <div className="mr-2 mt-0.5">
                  <Shield size={16} />
                </div>
                <div className="flex-1">{successMessage}</div>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-green-700"
                  aria-label="Dismiss message"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md border border-red-200 flex items-start">
                <div className="mr-2 mt-0.5">
                  <AlertCircle size={16} />
                </div>
                <div className="flex-1">{error}</div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600"
                  aria-label="Dismiss error"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Get Help Now Button */}
            <div className="mb-8">
              <button
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg"
                onClick={() => (window.location.href = "tel:1990")}
                aria-label="Call emergency helpline immediately"
              >
                <Zap className="mr-2" size={24} />
                Get Help Now
              </button>
              <p className="text-sm text-center mt-2 text-gray-500">
                Press this button to call the emergency helpline immediately
                (1990)
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Emergency Contact Card */}
              <div
                className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer hover:shadow-lg"
                onClick={() => setShowEmergencyContacts(!showEmergencyContacts)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setShowEmergencyContacts(!showEmergencyContacts);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Toggle emergency contacts list"
                aria-expanded={showEmergencyContacts}
              >
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Phone className="text-blue-600" size={20} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-blue-700">
                      Emergency Contacts
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quickly reach out to your trusted emergency contacts and
                      national helplines
                    </p>
                  </div>
                </div>
              </div>

              {/* Crisis Help Card */}
              <div
                className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors duration-200 cursor-pointer hover:shadow-lg"
                onClick={() => setCrisisHelpOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setCrisisHelpOpen(true);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Get crisis help"
              >
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <MessageSquare className="text-purple-600" size={20} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-purple-700">
                      Crisis Support
                    </h3>
                    <p className="text-sm text-gray-600">
                      Connect with mental health professionals for immediate
                      crisis intervention
                    </p>
                  </div>
                </div>
              </div>

              {/* Real-Time Alerts Card */}
              <div
                className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors duration-200 cursor-pointer hover:shadow-lg"
                onClick={() => setAlertsOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setAlertsOpen(true);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Manage real-time alerts"
              >
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Bell className="text-green-600" size={20} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-green-700">
                      Safety Alerts
                    </h3>
                    <p className="text-sm text-gray-600">
                      Set up automated check-ins and location sharing for safety
                      monitoring
                    </p>
                  </div>
                </div>
              </div>

              {/* Immediate Support Card */}
              <div
                className="bg-amber-50 p-4 rounded-lg hover:bg-amber-100 transition-colors duration-200 cursor-pointer hover:shadow-lg"
                onClick={() => setSupportOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSupportOpen(true);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Get immediate support"
              >
                <div className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Heart className="text-amber-600" size={20} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-amber-700">
                      Self-Care Tools
                    </h3>
                    <p className="text-sm text-gray-600">
                      Access coping strategies, grounding exercises, and mental
                      health resources
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contacts Expandable Section */}
            {showEmergencyContacts && (
              <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200 animate-slideDown">
                <h3 className="font-semibold mb-3 text-lg">
                  Emergency Contacts
                </h3>
                <div>
                  <h4 className="font-semibold mb-2 text-blue-700">
                    National Helplines
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
                      <div>
                        <span className="font-medium">
                          Sri Lanka Mental Health Helpline
                        </span>
                        <p className="text-sm text-gray-600">
                          24/7 Crisis Support &amp; Counseling
                        </p>
                      </div>
                      <a
                        href="tel:1926"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm transition-colors"
                      >
                        Call 1926
                      </a>
                    </li>
                    <li className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
                      <div>
                        <span className="font-medium">Emergency Services</span>
                        <p className="text-sm text-gray-600">
                          Police/Ambulance/Fire
                        </p>
                      </div>
                      <a
                        href="tel:1990"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm transition-colors"
                      >
                        Call 1990
                      </a>
                    </li>
                    <li className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
                      <div>
                        <span className="font-medium">
                          Sumithrayo Sri Lanka
                        </span>
                        <p className="text-sm text-gray-600">
                          Suicide Prevention &amp; Emotional Support
                        </p>
                      </div>
                      <a
                        href="tel:0112696666"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm transition-colors"
                      >
                        Call 011-2696666
                      </a>
                    </li>
                    <li className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
                      <div>
                        <span className="font-medium">
                          National Institute of Mental Health
                        </span>
                        <p className="text-sm text-gray-600">
                          Professional Clinical Services
                        </p>
                      </div>
                      <a
                        href="tel:0112578234"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm transition-colors"
                      >
                        Call 011-2578234
                      </a>
                    </li>
                    <li className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
                      <div>
                        <span className="font-medium">Women's Helpline</span>
                        <p className="text-sm text-gray-600">
                          Support for Gender-Based Violence
                        </p>
                      </div>
                      <a
                        href="tel:1938"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm transition-colors"
                      >
                        Call 1938
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold mb-2 text-blue-700">
                    Personal Emergency Contacts
                  </h4>
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  ) : personalContacts.length > 0 ? (
                    <ul className="space-y-3">
                      {personalContacts.map((contact) => (
                        <li
                          key={contact.id}
                          className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
                        >
                          <div>
                            <span className="font-medium">{contact.name}</span>
                            <p className="text-sm text-gray-600">
                              {formatPhoneNumber(contact.phone)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <a
                              href={`tel:${contact.phone}`}
                              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm transition-colors"
                              aria-label={`Call ${contact.name}`}
                            >
                              <Phone size={16} />
                            </a>
                            <button
                              onClick={() => handleDeleteContact(contact.id!)}
                              className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1 rounded transition-colors"
                              aria-label={`Delete ${contact.name} from contacts`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6 bg-blue-50 rounded-lg">
                      <p className="text-gray-600 mb-2">
                        You haven't added any personal emergency contacts yet.
                      </p>
                      <p className="text-sm text-gray-500">
                        Add trusted friends and family members who can help in
                        case of an emergency.
                      </p>
                    </div>
                  )}
                </div>
                {!showAddForm ? (
                  <button
                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded transition-colors"
                    onClick={() => setShowAddForm(true)}
                  >
                    + Add personal emergency contact
                  </button>
                ) : (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <h4 className="font-semibold mb-3 text-blue-700">
                      Add Personal Contact
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Contact Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          placeholder="Enter full name"
                          value={newContactName}
                          onChange={(e) => setNewContactName(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Phone Number
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          placeholder="Enter phone number"
                          value={newContactPhone}
                          onChange={(e) => setNewContactPhone(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={handleAddContact}
                          disabled={isLoading}
                          className={`${
                            isLoading
                              ? "bg-green-400"
                              : "bg-green-500 hover:bg-green-600"
                          } text-white py-2 px-4 rounded flex items-center justify-center transition-colors flex-1`}
                        >
                          {isLoading ? (
                            <>
                              <span className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></span>
                              Saving...
                            </>
                          ) : (
                            "Add Contact"
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setShowAddForm(false);
                            setNewContactName("");
                            setNewContactPhone("");
                            setError(null);
                          }}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mental Health Resources */}
            <div className="mt-6 bg-blue-50 p-5 rounded-lg border border-blue-200">
              <h3 className="font-semibold mb-3 text-lg text-blue-800">
                Sri Lanka Mental Health Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-700 mb-2">
                    24/7 Emergency Support
                  </h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <strong>National Mental Health Helpline: </strong>
                        <a
                          href="tel:1926"
                          className="text-blue-600 hover:underline"
                        >
                          1926
                        </a>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Professional emotional support and crisis intervention
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <strong>Sumithrayo Suicide Prevention: </strong>
                        <a
                          href="tel:0112696666"
                          className="text-blue-600 hover:underline"
                        >
                          011-2696666
                        </a>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Confidential support for anyone in suicidal crisis
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <strong>Emergency Services: </strong>
                        <a
                          href="tel:1990"
                          className="text-blue-600 hover:underline"
                        >
                          1990
                        </a>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Police, ambulance, and immediate emergency response
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-700 mb-2">
                    Specialized Support
                  </h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <strong>National Institute of Mental Health: </strong>
                        <a
                          href="tel:0112578234"
                          className="text-blue-600 hover:underline"
                        >
                          011-2578234
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <strong>Women's Helpline: </strong>
                        <a
                          href="tel:1938"
                          className="text-blue-600 hover:underline"
                        >
                          1938
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <strong>Child Protection Authority: </strong>
                        <a
                          href="tel:1929"
                          className="text-blue-600 hover:underline"
                        >
                          1929
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600 bg-white p-3 rounded-lg">
                <p className="font-medium text-gray-700">
                  If you're experiencing a mental health emergency:
                </p>
                <ol className="list-decimal ml-5 mt-2 space-y-1">
                  <li>
                    Stay in a safe environment; remove any harmful objects
                  </li>
                  <li>Call one of the emergency numbers listed above</li>
                  <li>
                    If possible, have someone stay with you until help arrives
                  </li>
                  <li>
                    Remember that help is available and recovery is possible
                  </li>
                </ol>
              </div>
            </div>

            {/* Modals */}
            <Modal
              isOpen={crisisHelpOpen}
              onClose={() => setCrisisHelpOpen(false)}
              title="Crisis Support"
            >
              <div className="space-y-4">
                <p className="text-gray-700">
                  If you're experiencing a mental health crisis, please connect
                  with a mental health professional immediately.
                </p>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-2">
                    Immediate Options:
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <span className="text-gray-700">
                        Mental Health Helpline
                      </span>
                      <a
                        href="tel:1926"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Call 1926
                      </a>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-700">Sumithrayo Helpline</span>
                      <a
                        href="tel:0112696666"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Call 011-2696666
                      </a>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-700">Emergency Services</span>
                      <a
                        href="tel:1990"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Call 1990
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <h4 className="font-medium mb-2">
                    What to expect when you call:
                  </h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• A trained counselor will answer your call</li>
                    <li>• You'll be asked about your current situation</li>
                    <li>
                      • Guidance on immediate coping strategies will be provided
                    </li>
                    <li>
                      • Further resources or emergency services may be arranged
                    </li>
                  </ul>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setCrisisHelpOpen(false)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Modal>

            <Modal
              isOpen={alertsOpen}
              onClose={() => setAlertsOpen(false)}
              title="Safety Alerts"
            >
              <div className="space-y-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-700 mb-2">
                    Automated Check-in System
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Set up scheduled check-ins that will automatically alert
                    your emergency contacts if you don't respond.
                  </p>

                  <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                    <div>
                      <span className="font-medium text-gray-700">
                        Daily Check-in
                      </span>
                      <p className="text-xs text-gray-500">
                        Alerts sent if no response by 9:00 PM
                      </p>
                    </div>
                    <button className="bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-3 rounded">
                      Configure
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Location Sharing
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Share your real-time location with trusted contacts during
                    emergencies.
                  </p>

                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center">
                    <Bell size={16} className="mr-2" />
                    Set Up Safety Alerts
                  </button>
                </div>

                <div className="text-sm text-gray-500 border-t border-gray-200 pt-3 mt-3">
                  <p>
                    Note: Location sharing requires GPS permissions and will
                    only be activated during emergency situations or when you
                    explicitly enable it.
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setAlertsOpen(false)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Modal>

            <Modal
              isOpen={supportOpen}
              onClose={() => setSupportOpen(false)}
              title="Self-Care Tools"
            >
              <div className="space-y-4">
                <p className="text-gray-700">
                  Try these evidence-based techniques to help manage difficult
                  emotions and moments of crisis.
                </p>

                <div className="bg-amber-50 p-3 rounded-lg">
                  <h4 className="font-medium text-amber-700 mb-2">
                    Grounding Exercises
                  </h4>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li className="p-2 bg-white rounded">
                      <span className="font-medium block text-amber-700">
                        5-4-3-2-1 Technique
                      </span>
                      <p>
                        Identify 5 things you can see, 4 things you can touch, 3
                        things you can hear, 2 things you can smell, and 1 thing
                        you can taste.
                      </p>
                    </li>
                    <li className="p-2 bg-white rounded">
                      <span className="font-medium block text-amber-700">
                        Deep Breathing
                      </span>
                      <p>
                        Breathe in slowly through your nose for 4 counts, hold
                        for 2, and exhale through your mouth for 6 counts.
                        Repeat 5-10 times.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-2">
                    Crisis Coping Strategies
                  </h4>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li className="p-2 bg-white rounded">
                      <span className="font-medium block text-blue-700">
                        TIPP Technique
                      </span>
                      <p>
                        <strong>T</strong>emperature: Splash cold water on your
                        face
                        <br />
                        <strong>I</strong>ntense exercise: Quick physical
                        activity
                        <br />
                        <strong>P</strong>aced breathing: Slow, deep breaths
                        <br />
                        <strong>P</strong>rogressive muscle relaxation: Tense
                        and release
                      </p>
                    </li>
                    <li className="p-2 bg-white rounded">
                      <span className="font-medium block text-blue-700">
                        Distress Tolerance
                      </span>
                      <p>
                        Accept your feelings without judgment. Remember that
                        emotions are temporary and will pass.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="mt-3 border-t border-gray-200 pt-3">
                  <h4 className="font-medium mb-2">Additional Resources:</h4>
                  <a
                    href="https://www.nimh.health.gov.lk/en/mental-health"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center text-sm"
                  >
                    <span>Sri Lanka Mental Health Resources</span>
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setSupportOpen(false)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Modal>

            <Modal
              isOpen={infoModalOpen}
              onClose={() => setInfoModalOpen(false)}
              title="About Emergency Resources"
            >
              <div className="space-y-4">
                <p className="text-gray-700">
                  This page provides quick access to emergency mental health
                  resources and support services in Sri Lanka.
                </p>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Available Features:
                  </h4>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <strong>Emergency Contacts:</strong> Store personal
                        contacts for quick access during emergencies
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <strong>Crisis Support:</strong> Direct connection to
                        mental health professionals
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <strong>Safety Alerts:</strong> Set up automated
                        check-ins and location sharing
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <div>
                        <strong>Self-Care Tools:</strong> Access coping
                        strategies and grounding techniques
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <p className="text-sm text-gray-600">
                    If you're experiencing a mental health emergency, don't
                    hesitate to use the "Get Help Now" button or call one of the
                    emergency numbers listed. Help is available 24/7.
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setInfoModalOpen(false)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmergencyAlerts;
