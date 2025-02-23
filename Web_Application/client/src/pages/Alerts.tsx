import { useState } from "react";

const Alert = () => {
  const [alertStatus, setAlertStatus] = useState(false);

  const toggleAlert = () => {
    setAlertStatus(!alertStatus);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-200 flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full text-center">
        <h2 className="text-3xl font-semibold text-indigo-700 mb-6">
          Emergency Alert System
        </h2>

        <div className="mb-8">
          <p className="text-lg text-gray-700">
            {alertStatus
              ? "Your loved ones will be notified if your condition worsens."
              : "Activate this feature to alert your loved ones in case of an emergency."}
          </p>
        </div>

        {/* Alert Button */}
        <button
          onClick={toggleAlert}
          className={`${
            alertStatus
              ? "bg-red-600 hover:bg-red-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          } text-white py-3 px-6 rounded-full text-lg font-semibold transition duration-300`}
        >
          {alertStatus ? "Deactivate Alert" : "Activate Alert"}
        </button>

        {/* Status Indicator */}
        <div className="mt-6">
          <div
            className={`w-4 h-4 rounded-full mx-auto ${
              alertStatus ? "bg-red-500" : "bg-green-500"
            }`}
          ></div>
          <p
            className={`mt-2 text-sm ${
              alertStatus ? "text-red-500" : "text-green-500"
            }`}
          >
            {alertStatus ? "Alert is Active" : "No Active Alerts"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
