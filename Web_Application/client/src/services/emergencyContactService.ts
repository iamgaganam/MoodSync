// client/src/services/emergencyContactService.ts
import axios from "axios";

const API_URL = "http://localhost:8000/api";

export interface EmergencyContact {
  id?: string;
  name: string;
  phone: string;
  userId: string;
}

export const emergencyContactService = {
  getContacts: async (): Promise<EmergencyContact[]> => {
    try {
      // Get user ID from localStorage (adjust if you use a different auth system)
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in localStorage");
        throw new Error("User is not authenticated");
      }

      console.log(`Fetching contacts for user: ${userId}`);
      console.log(`API URL: ${API_URL}/emergency-contacts/user/${userId}`);

      const response = await axios.get(
        `${API_URL}/emergency-contacts/user/${userId}`
      );

      console.log("Raw API response:", response.data);

      // Transform the response to match our interface
      // This handles both array format and object with data property format
      const contactsData = Array.isArray(response.data)
        ? response.data
        : response.data.emergency_contacts || response.data;

      const transformedContacts = contactsData.map((contact: any) => ({
        id: contact._id || contact.id,
        name: contact.name,
        phone: contact.phone,
        userId: contact.userId,
      }));

      console.log("Transformed contacts:", transformedContacts);
      return transformedContacts;
    } catch (error: any) {
      console.error("Error fetching emergency contacts:", error);
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);
      throw error;
    }
  },

  addContact: async (contact: EmergencyContact): Promise<EmergencyContact> => {
    try {
      console.log("Adding contact:", contact);
      console.log(`API URL: ${API_URL}/emergency-contacts`);

      const formData = new FormData();
      formData.append("name", contact.name);
      formData.append("phone", contact.phone);
      formData.append("userId", contact.userId);

      const response = await axios.post(
        `${API_URL}/emergency-contacts`,
        formData
      );

      console.log("Raw add contact response:", response.data);

      const addedContact = {
        id:
          response.data.emergency_contact._id ||
          response.data.emergency_contact.id,
        name: response.data.emergency_contact.name,
        phone: response.data.emergency_contact.phone,
        userId: response.data.emergency_contact.userId,
      };

      console.log("Transformed added contact:", addedContact);
      return addedContact;
    } catch (error: any) {
      console.error("Error adding emergency contact:", error);
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);
      throw error;
    }
  },

  deleteContact: async (id: string): Promise<void> => {
    try {
      console.log(`Deleting contact with ID: ${id}`);
      console.log(`API URL: ${API_URL}/emergency-contacts/${id}`);

      const response = await axios.delete(
        `${API_URL}/emergency-contacts/${id}`
      );
      console.log("Delete response:", response.data);
    } catch (error: any) {
      console.error("Error deleting emergency contact:", error);
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);
      throw error;
    }
  },
};
