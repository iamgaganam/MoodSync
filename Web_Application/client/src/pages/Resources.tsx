import React from "react";

const Resources = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-teal-200 flex justify-center items-center p-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-4xl font-semibold text-teal-700 text-center mb-8">
          Mental Health Resources
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mental Health Professionals Section */}
          <div className="bg-teal-50 p-6 rounded-xl shadow-md">
            <h3 className="text-2xl font-medium text-teal-700 mb-4">
              Mental Health Professionals
            </h3>
            <ul className="list-disc pl-6 text-lg text-gray-700 space-y-3">
              <li>
                <strong>Dr. John Doe</strong> - Therapist, specializing in
                cognitive behavioral therapy (CBT)
              </li>
              <li>
                <strong>Dr. Jane Smith</strong> - Psychiatrist, specializing in
                anxiety and depression
              </li>
              <li>
                <strong>Dr. Mark Lee</strong> - Clinical Psychologist,
                specializing in trauma recovery
              </li>
              <li>
                <strong>Dr. Emily Clark</strong> - Family Therapist,
                specializing in relationship counseling
              </li>
            </ul>
          </div>

          {/* Hospitals & Clinics Section */}
          <div className="bg-teal-50 p-6 rounded-xl shadow-md">
            <h3 className="text-2xl font-medium text-teal-700 mb-4">
              Hospitals & Clinics
            </h3>
            <ul className="list-disc pl-6 text-lg text-gray-700 space-y-3">
              <li>
                <strong>Health Hospital</strong> - Emergency services, 24/7
                care.
              </li>
              <li>
                <strong>Wellness Clinic</strong> - Specialized in outpatient
                mental health treatments.
              </li>
              <li>
                <strong>MindCare Center</strong> - Offers counseling and therapy
                sessions for individuals and groups.
              </li>
              <li>
                <strong>Peaceful Minds Therapy</strong> - Provides both
                in-person and online therapy services.
              </li>
            </ul>
          </div>
        </div>

        {/* Helplines Section */}
        <div className="mt-8 bg-teal-50 p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-medium text-teal-700 mb-4">
            24/7 Helplines
          </h3>
          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-3">
            <li>
              <strong>SOS Mental Health Helpline:</strong> 123-456-7890
            </li>
            <li>
              <strong>National Suicide Prevention Lifeline:</strong>{" "}
              800-273-8255
            </li>
            <li>
              <strong>International Crisis Hotline:</strong> 112-234-5678
            </li>
            <li>
              <strong>Children's Mental Health Helpline:</strong> 800-555-1234
            </li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          {/* Back to Dashboard Button */}
          <button className="bg-teal-600 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-teal-700 transition duration-300">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resources;
