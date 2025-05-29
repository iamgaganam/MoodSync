import React, { useState, useEffect, useCallback } from "react";
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

// Constants NO NEED OF DATABASE FETCH
const EMERGENCY_NUMBERS = [
  {
    name: "Sri Lanka Mental Health Helpline",
    description: "24/7 Crisis Support & Counseling",
    number: "1926",
    href: "tel:1926",
  },
  {
    name: "Emergency Services",
    description: "Police/Ambulance/Fire",
    number: "1990",
    href: "tel:1990",
  },
  {
    name: "Sumithrayo Sri Lanka",
    description: "Suicide Prevention & Emotional Support",
    number: "011-2696666",
    href: "tel:0112696666",
  },
  {
    name: "National Institute of Mental Health",
    description: "Professional Clinical Services",
    number: "011-2578234",
    href: "tel:0112578234",
  },
  {
    name: "Women's Helpline",
    description: "Support for Gender-Based Violence",
    number: "1938",
    href: "tel:1938",
  },
] as const;

const SPECIALIZED_CONTACTS = [
  {
    name: "National Institute of Mental Health",
    number: "011-2578234",
    href: "tel:0112578234",
  },
  { name: "Women's Helpline", number: "1938", href: "tel:1938" },
  { name: "Child Protection Authority", number: "1929", href: "tel:1929" },
] as const;

const CRISIS_CONTACTS = [
  { name: "Mental Health Helpline", number: "1926", href: "tel:1926" },
  {
    name: "Sumithrayo Helpline",
    number: "011-2696666",
    href: "tel:0112696666",
  },
  { name: "Emergency Services", number: "1990", href: "tel:1990" },
] as const;

const MESSAGE_TIMEOUT = 5000;
const DEFAULT_USER_ID = "current-user";

// Interfaces
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

interface EmergencyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  onClick: () => void;
  ariaLabel: string;
}

interface ContactItemProps {
  contact: EmergencyContact;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

interface AddContactFormProps {
  name: string;
  phone: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

// Utility functions
const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/(\d{3})(?=\d)/g, "$1 ");
};

const getStoredUserId = (): string => {
  return localStorage.getItem("userId") || DEFAULT_USER_ID;
};

// Components
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

const EmergencyCard: React.FC<EmergencyCardProps> = ({
  icon,
  title,
  description,
  bgColor,
  onClick,
  ariaLabel,
}) => (
  <div
    className={`${bgColor} p-4 rounded-lg hover:opacity-90 transition-all duration-200 cursor-pointer hover:shadow-lg`}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        onClick();
      }
    }}
    role="button"
    tabIndex={0}
    aria-label={ariaLabel}
  >
    <div className="flex items-start">
      <div className="bg-white bg-opacity-50 p-2 rounded-full">{icon}</div>
      <div className="ml-3">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

const ContactItem: React.FC<ContactItemProps> = ({
  contact,
  onDelete,
  isLoading,
}) => (
  <li className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
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
        onClick={() => onDelete(contact.id!)}
        disabled={isLoading}
        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1 rounded transition-colors disabled:opacity-50"
        aria-label={`Delete ${contact.name} from contacts`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  </li>
);

const AddContactForm: React.FC<AddContactFormProps> = ({
  name,
  phone,
  onNameChange,
  onPhoneChange,
  onSubmit,
  onCancel,
  isLoading,
}) => (
  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
    <h4 className="font-semibold mb-3 text-blue-700">Add Personal Contact</h4>
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
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
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
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="flex space-x-2 pt-2">
        <button
          onClick={onSubmit}
          disabled={isLoading || !name.trim() || !phone.trim()}
          className="bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white py-2 px-4 rounded flex items-center justify-center transition-colors flex-1"
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
          onClick={onCancel}
          disabled={isLoading}
          className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 py-2 px-4 rounded transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const EmergencyAlerts: React.FC = () => {
  // State management
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

  // Modal states
  const [modalStates, setModalStates] = useState({
    crisisHelp: false,
    alerts: false,
    support: false,
    info: false,
  });

  const toggleModal = useCallback((modalName: keyof typeof modalStates) => {
    setModalStates((prev) => ({ ...prev, [modalName]: !prev[modalName] }));
  }, []);

  // Initialize user ID
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", DEFAULT_USER_ID);
    }
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), MESSAGE_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch contacts when section is shown
  useEffect(() => {
    const fetchContacts = async () => {
      if (!showEmergencyContacts) return;

      try {
        setIsLoading(true);
        const contacts = await emergencyContactService.getContacts();
        setPersonalContacts(contacts);
        setError(null);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to load contacts";
        setError(`Failed to load your emergency contacts: ${errorMessage}`);
        console.error("Error fetching contacts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [showEmergencyContacts]);

  const handleAddContact = useCallback(async () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      setError("Please enter both name and phone number.");
      return;
    }

    if (!validatePhoneNumber(newContactPhone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      setIsLoading(true);
      const userId = getStoredUserId();

      const newContact = await emergencyContactService.addContact({
        name: newContactName.trim(),
        phone: newContactPhone.trim(),
        userId,
      });

      setPersonalContacts((prev) => [...prev, newContact]);
      setSuccessMessage(
        `${newContactName} has been added to your emergency contacts.`
      );

      // Reset form
      setNewContactName("");
      setNewContactPhone("");
      setShowAddForm(false);
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.detail || err?.message || "Failed to save contact";
      setError(`Failed to save contact: ${errorMessage}`);
      console.error("Error adding contact:", err);
    } finally {
      setIsLoading(false);
    }
  }, [newContactName, newContactPhone]);

  const handleDeleteContact = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        await emergencyContactService.deleteContact(id);

        const deletedContact = personalContacts.find(
          (contact) => contact.id === id
        );
        setPersonalContacts((prev) =>
          prev.filter((contact) => contact.id !== id)
        );
        setSuccessMessage(
          deletedContact
            ? `${deletedContact.name} has been removed from your contacts.`
            : "Contact has been removed successfully."
        );
        setError(null);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to delete contact";
        setError(`Failed to delete contact: ${errorMessage}`);
        console.error("Error deleting contact:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [personalContacts]
  );

  const handleFormCancel = useCallback(() => {
    setShowAddForm(false);
    setNewContactName("");
    setNewContactPhone("");
    setError(null);
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Navbar />
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
                  onClick={() => toggleModal("info")}
                  className="text-blue-500 hover:text-blue-700 flex items-center"
                  aria-label="Learn more about emergency resources"
                >
                  <Info size={18} className="mr-1" />
                  <span className="text-sm">Learn More</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            {successMessage && (
              <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-md border border-green-200 flex items-start">
                <Shield size={16} className="mr-2 mt-0.5" />
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

            {error && (
              <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md border border-red-200 flex items-start">
                <AlertCircle size={16} className="mr-2 mt-0.5" />
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

            {/* Emergency Button */}
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

            {/* Emergency Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <EmergencyCard
                icon={<Phone className="text-blue-600" size={20} />}
                title="Emergency Contacts"
                description="Quickly reach out to your trusted emergency contacts and national helplines"
                bgColor="bg-blue-50 hover:bg-blue-100"
                onClick={() => setShowEmergencyContacts(!showEmergencyContacts)}
                ariaLabel="Toggle emergency contacts list"
              />

              <EmergencyCard
                icon={<MessageSquare className="text-purple-600" size={20} />}
                title="Crisis Support"
                description="Connect with mental health professionals for immediate crisis intervention"
                bgColor="bg-purple-50 hover:bg-purple-100"
                onClick={() => toggleModal("crisisHelp")}
                ariaLabel="Get crisis help"
              />

              <EmergencyCard
                icon={<Bell className="text-green-600" size={20} />}
                title="Safety Alerts"
                description="Set up automated check-ins and location sharing for safety monitoring"
                bgColor="bg-green-50 hover:bg-green-100"
                onClick={() => toggleModal("alerts")}
                ariaLabel="Manage real-time alerts"
              />

              <EmergencyCard
                icon={<Heart className="text-amber-600" size={20} />}
                title="Self-Care Tools"
                description="Access coping strategies, grounding exercises, and mental health resources"
                bgColor="bg-amber-50 hover:bg-amber-100"
                onClick={() => toggleModal("support")}
                ariaLabel="Get immediate support"
              />
            </div>

            {/* Expandable Emergency Contacts Section */}
            {showEmergencyContacts && (
              <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200 animate-slideDown">
                <h3 className="font-semibold mb-3 text-lg">
                  Emergency Contacts
                </h3>

                {/* National Helplines */}
                <div>
                  <h4 className="font-semibold mb-2 text-blue-700">
                    National Helplines
                  </h4>
                  <ul className="space-y-3">
                    {EMERGENCY_NUMBERS.map((contact) => (
                      <li
                        key={contact.number}
                        className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
                      >
                        <div>
                          <span className="font-medium">{contact.name}</span>
                          <p className="text-sm text-gray-600">
                            {contact.description}
                          </p>
                        </div>
                        <a
                          href={contact.href}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm transition-colors"
                        >
                          Call {contact.number}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Personal Contacts */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold mb-2 text-blue-700">
                    Personal Emergency Contacts
                  </h4>

                  {isLoading && !showAddForm ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  ) : personalContacts.length > 0 ? (
                    <ul className="space-y-3">
                      {personalContacts.map((contact) => (
                        <ContactItem
                          key={contact.id}
                          contact={contact}
                          onDelete={handleDeleteContact}
                          isLoading={isLoading}
                        />
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

                  {/* Add Contact Form/Button */}
                  {!showAddForm ? (
                    <button
                      className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded transition-colors"
                      onClick={() => setShowAddForm(true)}
                    >
                      + Add personal emergency contact
                    </button>
                  ) : (
                    <AddContactForm
                      name={newContactName}
                      phone={newContactPhone}
                      onNameChange={setNewContactName}
                      onPhoneChange={setNewContactPhone}
                      onSubmit={handleAddContact}
                      onCancel={handleFormCancel}
                      isLoading={isLoading}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Mental Health Resources Section */}
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
                    {CRISIS_CONTACTS.map((contact) => (
                      <li key={contact.number} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <div>
                          <strong>{contact.name}: </strong>
                          <a
                            href={contact.href}
                            className="text-blue-600 hover:underline"
                          >
                            {contact.number}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-700 mb-2">
                    Specialized Support
                  </h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    {SPECIALIZED_CONTACTS.map((contact) => (
                      <li key={contact.number} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <div>
                          <strong>{contact.name}: </strong>
                          <a
                            href={contact.href}
                            className="text-blue-600 hover:underline"
                          >
                            {contact.number}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Emergency Guidelines */}
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
              isOpen={modalStates.crisisHelp}
              onClose={() => toggleModal("crisisHelp")}
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
                    {CRISIS_CONTACTS.map((contact) => (
                      <li
                        key={contact.number}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-700">{contact.name}</span>
                        <a
                          href={contact.href}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                        >
                          Call {contact.number}
                        </a>
                      </li>
                    ))}
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
                    onClick={() => toggleModal("crisisHelp")}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Modal>

            <Modal
              isOpen={modalStates.alerts}
              onClose={() => toggleModal("alerts")}
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
                    onClick={() => toggleModal("alerts")}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Modal>

            <Modal
              isOpen={modalStates.support}
              onClose={() => toggleModal("support")}
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
                    onClick={() => toggleModal("support")}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Modal>

            <Modal
              isOpen={modalStates.info}
              onClose={() => toggleModal("info")}
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
                    onClick={() => toggleModal("info")}
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
