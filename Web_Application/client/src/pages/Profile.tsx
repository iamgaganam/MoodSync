import React, { useState } from "react";

const Profile = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");

  const handleSave = () => {
    // Here you can handle saving the changes
    alert("Changes saved!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex justify-center items-center p-6">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-4xl font-semibold text-indigo-700 text-center mb-8">
          Your Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Info Card */}
          <div className="bg-indigo-50 p-6 rounded-xl shadow-md">
            <h3 className="text-2xl font-medium text-indigo-700 mb-4">
              Personal Information
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-600 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-600 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-indigo-50 p-6 rounded-xl shadow-md">
            <h3 className="text-2xl font-medium text-indigo-700 mb-4">
              Account Settings
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-600 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="input w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-600 mb-2">
                  Notifications
                </label>
                <select className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500">
                  <option>Receive Email Notifications</option>
                  <option>Do Not Receive Notifications</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
