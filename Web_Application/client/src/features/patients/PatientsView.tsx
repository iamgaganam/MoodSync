// client/src/features/patients/PatientsView.tsx
import React from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import { Patient } from "../../data/mockData";
import {
  formatDate,
  getSentimentColor,
  getRiskBadge,
} from "../../utils/helpers";

interface PatientsViewProps {
  filteredPatients: Patient[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  riskFilter: "all" | "low" | "medium" | "high";
  setRiskFilter: (filter: "all" | "low" | "medium" | "high") => void;
  handlePatientSelect: (patient: Patient) => void;
}

const PatientsView: React.FC<PatientsViewProps> = ({
  filteredPatients,
  searchQuery,
  setSearchQuery,
  riskFilter,
  setRiskFilter,
  handlePatientSelect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold">My Patients</h2>
          <div className="mt-3 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <StarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="py-2 pl-3 pr-8 border border-gray-300 rounded-md"
              value={riskFilter}
              onChange={(e) =>
                setRiskFilter(
                  e.target.value as "all" | "low" | "medium" | "high"
                )
              }
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sentiment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {patient.profilePic ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={patient.profilePic}
                        alt={patient.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span>{patient.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {patient.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.age} years, {patient.gender}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRiskBadge(patient.riskLevel)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className={`h-3 w-3 rounded-full ${getSentimentColor(
                        patient.sentimentScore
                      )} mr-2`}
                    ></div>
                    <span>{patient.sentimentScore.toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(patient.lastActivity)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handlePatientSelect(patient)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => {
                      // You might switch to analytics view for this patient.
                    }}
                    className="text-green-600 hover:text-green-900"
                  >
                    Analytics
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientsView;
