const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex justify-center items-center p-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-4xl font-semibold text-indigo-700 text-center mb-8">
          Your Mental Health Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mood Tracking Card */}
          <div className="bg-indigo-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-medium text-indigo-700 mb-4">
              Mood Tracker
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg text-gray-600">Current Mood:</p>
                <h4 className="text-3xl font-bold text-indigo-600">😊 Happy</h4>
              </div>
              <div>
                <span className="text-lg text-gray-500">
                  Last Updated: 2 hours ago
                </span>
              </div>
            </div>
          </div>

          {/* Sentiment Analysis Card */}
          <div className="bg-indigo-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-medium text-indigo-700 mb-4">
              Sentiment Analysis
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg text-gray-600">Overall Sentiment:</p>
                <h4 className="text-3xl font-bold text-green-600">Positive</h4>
              </div>
              <div>
                <span className="text-lg text-gray-500">
                  Last Analyzed: 1 hour ago
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {/* Mental Health Recommendations */}
          <h3 className="text-2xl font-medium text-indigo-700 mb-4">
            Mental Health Recommendations
          </h3>
          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>Take a walk outside and enjoy some fresh air.</li>
            <li>Try practicing mindfulness or meditation for 10 minutes.</li>
            <li>Speak to a therapist or a counselor if you need support.</li>
            <li>Write down your thoughts and feelings in a journal.</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          {/* Button to view full analysis */}
          <button className="bg-indigo-600 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-indigo-700 transition duration-300">
            View Full Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
