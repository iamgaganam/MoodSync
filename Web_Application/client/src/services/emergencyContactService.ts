import axios from "axios";

const API_URL = "http://localhost:8000/api";

export interface EmergencyContact {
  id?: string;
  name: string;
  phone: string;
  userId: string;
}

/**
 * Emergency contact service for managing user emergency contacts
 */
export const emergencyContactService = {
  /**
   * Retrieves all emergency contacts for the current user
   */
  getContacts: async (): Promise<EmergencyContact[]> => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User authentication required");
      }

      const response = await axios.get(
        `${API_URL}/emergency-contacts/user/${userId}`
      );

      // Handle different response formats
      const contactsData = Array.isArray(response.data)
        ? response.data
        : response.data.emergency_contacts || response.data;

      return contactsData.map((contact: any) => ({
        id: contact._id || contact.id,
        name: contact.name,
        phone: contact.phone,
        userId: contact.userId,
      }));
    } catch (error: any) {
      console.error("Error fetching emergency contacts:", error);
      throw error;
    }
  },

  /**
   * Adds a new emergency contact
   */
  addContact: async (contact: EmergencyContact): Promise<EmergencyContact> => {
    try {
      const response = await axios.post(`${API_URL}/emergency-contacts`, {
        name: contact.name,
        phone: contact.phone,
        userId: contact.userId,
      });

      const addedContact = response.data.emergency_contact;
      return {
        id: addedContact._id || addedContact.id,
        name: addedContact.name,
        phone: addedContact.phone,
        userId: addedContact.userId,
      };
    } catch (error: any) {
      console.error("Error adding emergency contact:", error);
      throw error;
    }
  },

  /**
   * Deletes an emergency contact by ID
   */
  deleteContact: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/emergency-contacts/${id}`);
    } catch (error: any) {
      console.error("Error deleting emergency contact:", error);
      throw error;
    }
  },
};
