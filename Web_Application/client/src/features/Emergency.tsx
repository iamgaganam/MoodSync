// EmergencyAlerts.tsx
import React, { useState } from "react";
import { AlertCircle, Phone, MessageSquare, Bell, Zap, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundImage from "../assets/3.jpg";

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
  const [personalContacts, setPersonalContacts] = useState<
    { name: string; phone: string }[]
  >([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");

  // Modal state for cards
  const [crisisHelpOpen, setCrisisHelpOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const handleAddContact = async () => {
    if (newContactName && newContactPhone) {
      try {
        const response = await fetch(
          "http://localhost:8000/api/emergency_contacts",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newContactName,
              phone: newContactPhone,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add contact");
        }

        const data = await response.json();
        console.log("Contact saved:", data);

        // Optionally update local state to reflect the change immediately:
        setPersonalContacts([
          ...personalContacts,
          { name: newContactName, phone: newContactPhone },
        ]);
        setNewContactName("");
        setNewContactPhone("");
        setShowAddForm(false);
      } catch (error) {
        alert("Error adding contact");
        console.error(error);
      }
    } else {
      alert("Please enter both name and phone number.");
    }
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
              <h2 className="text-2xl font-bold text-red-600 flex items-center">
                <AlertCircle className="mr-2" />
                Emergency &amp; Support Resources
              </h2>
              <p className="text-gray-600 mt-1">
                Access immediate help and support when you need it most
              </p>
            </div>

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
              >
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Phone className="text-blue-600" size={20} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-blue-700">
                      Emergency Contact
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quickly reach out to your designated emergency contacts
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
                      Crisis Help
                    </h3>
                    <p className="text-sm text-gray-600">
                      Connect with a mental health professional immediately
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
                      Real-Time Alerts
                    </h3>
                    <p className="text-sm text-gray-600">
                      Manage notifications for your loved ones
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
                    <Zap className="text-amber-600" size={20} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-amber-700">
                      Immediate Support
                    </h3>
                    <p className="text-sm text-gray-600">
                      Access coping strategies and de-escalation techniques
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contacts Expandable Section */}
            {showEmergencyContacts && (
              <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200 animate-slideDown">
                <h3 className="font-semibold mb-3">Emergency Contacts</h3>
                <div>
                  <h4 className="font-semibold mb-2">National Helplines</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
                      <div>
                        <span className="font-medium">
                          Sri Lanka Mental Health Helpline
                        </span>
                        <p className="text-sm text-gray-600">
                          National Service
                        </p>
                      </div>
                      <a
                        href="tel:1926"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Call 1926
                      </a>
                    </li>
                    <li className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
                      <div>
                        <span className="font-medium">Emergency Services</span>
                        <p className="text-sm text-gray-600">
                          Police/Ambulance
                        </p>
                      </div>
                      <a
                        href="tel:1990"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
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
                          Suicide Prevention
                        </p>
                      </div>
                      <a
                        href="tel:0112696666"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Call 011-2696666
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Personal Contacts</h4>
                  {personalContacts.length > 0 ? (
                    <ul className="space-y-3">
                      {personalContacts.map((contact, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
                        >
                          <div>
                            <span className="font-medium">{contact.name}</span>
                            <p className="text-sm text-gray-600">
                              Personal Contact
                            </p>
                          </div>
                          <a
                            href={`tel:${contact.phone}`}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                          >
                            Call {contact.phone}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No personal contacts added yet.
                    </p>
                  )}
                </div>
                {!showAddForm && (
                  <button
                    className="mt-4 text-blue-600 text-sm font-medium flex items-center"
                    onClick={() => setShowAddForm(true)}
                  >
                    + Add personal emergency contact
                  </button>
                )}
                {showAddForm && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-semibold mb-2">Add Personal Contact</h4>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={newContactName}
                        onChange={(e) => setNewContactName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={newContactPhone}
                        onChange={(e) => setNewContactPhone(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleAddContact}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                      >
                        Add Contact
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Helpline Information */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold mb-2">
                Sri Lanka Mental Health Resources
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                If you're experiencing a mental health emergency, please don't
                hesitate to reach out:
              </p>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>
                  • National Mental Health Helpline: <strong>1926</strong>
                </li>
                <li>
                  • Sumithrayo Suicide Prevention: <strong>011-2696666</strong>
                </li>
                <li>
                  • Emergency Services: <strong>1990</strong>
                </li>
                <li>
                  • National Institute of Mental Health:{" "}
                  <strong>011-2578234</strong>
                </li>
              </ul>
            </div>

            {/* Modals */}
            <Modal
              isOpen={crisisHelpOpen}
              onClose={() => setCrisisHelpOpen(false)}
              title="Crisis Help"
            >
              <p className="text-gray-700">
                Connecting you to a mental health professional. Please wait...
              </p>
            </Modal>
            <Modal
              isOpen={alertsOpen}
              onClose={() => setAlertsOpen(false)}
              title="Real-Time Alerts"
            >
              <p className="text-gray-700">Opening notification settings...</p>
            </Modal>
            <Modal
              isOpen={supportOpen}
              onClose={() => setSupportOpen(false)}
              title="Immediate Support"
            >
              <p className="text-gray-700">
                Take a deep breath and count to 10. You are not alone.
              </p>
            </Modal>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmergencyAlerts;
