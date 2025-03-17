// EmergencyAlerts.tsx
import React, { useState } from "react";
import { AlertCircle, Phone, MessageSquare, Bell, Zap } from "lucide-react";

const EmergencyAlerts: React.FC = () => {
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto my-8">
      {/* Header */}
      <div className="border-b border-red-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-red-600 flex items-center">
          <AlertCircle className="mr-2" />
          Emergency & Support Resources
        </h2>
        <p className="text-gray-600 mt-1">
          Access immediate help and support when you need it most
        </p>
      </div>

      {/* Get Help Now - Prominent Button */}
      <div className="mb-8">
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center transition-colors duration-200"
          onClick={() => (window.location.href = "tel:1990")}
        >
          <Zap className="mr-2" size={24} />
          Get Help Now
        </button>
        <p className="text-sm text-center mt-2 text-gray-500">
          Press this button to call the emergency helpline immediately
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Emergency Contact Card */}
        <div
          className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
          onClick={() => setShowEmergencyContacts(!showEmergencyContacts)}
        >
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full">
              <Phone className="text-blue-600" size={20} />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-blue-700">Emergency Contact</h3>
              <p className="text-sm text-gray-600">
                Quickly reach out to your designated emergency contacts
              </p>
            </div>
          </div>
        </div>

        {/* Crisis Help Card */}
        <div className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors duration-200 cursor-pointer">
          <div className="flex items-start">
            <div className="bg-purple-100 p-2 rounded-full">
              <MessageSquare className="text-purple-600" size={20} />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-purple-700">Crisis Help</h3>
              <p className="text-sm text-gray-600">
                Connect with a mental health professional immediately
              </p>
            </div>
          </div>
        </div>

        {/* Real-Time Alerts Card */}
        <div className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors duration-200 cursor-pointer">
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full">
              <Bell className="text-green-600" size={20} />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-green-700">Real-Time Alerts</h3>
              <p className="text-sm text-gray-600">
                Manage notifications for your loved ones
              </p>
            </div>
          </div>
        </div>

        {/* Immediate Support Card */}
        <div className="bg-amber-50 p-4 rounded-lg hover:bg-amber-100 transition-colors duration-200 cursor-pointer">
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
        <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200 animate-fadeIn">
          <h3 className="font-semibold mb-3">Your Emergency Contacts</h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
              <div>
                <span className="font-medium">
                  Sri Lanka Mental Health Helpline
                </span>
                <p className="text-sm text-gray-600">National Service</p>
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
                <p className="text-sm text-gray-600">Police/Ambulance</p>
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
                <span className="font-medium">Sumithrayo Sri Lanka</span>
                <p className="text-sm text-gray-600">Suicide Prevention</p>
              </div>
              <a
                href="tel:0112696666"
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
              >
                Call 011-2696666
              </a>
            </li>
          </ul>
          <button
            className="mt-4 text-blue-600 text-sm font-medium flex items-center"
            onClick={() => {
              /* Navigate to add contacts page */
            }}
          >
            + Add personal emergency contact
          </button>
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
            • National Institute of Mental Health: <strong>011-2578234</strong>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyAlerts;
