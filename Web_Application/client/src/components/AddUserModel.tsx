import React, { useState } from "react";
import { Modal } from "../components/Modal";

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  password: string;
  confirmPassword: string;
  profileImage?: File | null;
}

interface AddUserModalProps {
  onClose: () => void;
  onSave: (userData: UserFormData) => void;
}

// Location options for user selection
const LOCATION_OPTIONS = [
  "Colombo",
  "Kandy",
  "Galle",
  "Jaffna",
  "Batticaloa",
  "Negombo",
  "Other",
] as const;

// Common CSS classes for form inputs
const INPUT_CLASSES =
  "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";
const BUTTON_CLASSES = {
  primary:
    "px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
  secondary:
    "px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
};

// Password validation constants
const MIN_PASSWORD_LENGTH = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    location: "Colombo",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const [passwordError, setPasswordError] = useState("");
  const [fileError, setFileError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation errors when user types
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const validateFile = (file: File): string => {
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB";
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Only JPEG, PNG, GIF, and WebP images are allowed";
    }

    return "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    setFileError("");

    if (files && files.length > 0) {
      const file = files[0];
      const validationError = validateFile(file);

      if (validationError) {
        setFileError(validationError);
        e.target.value = ""; // Clear file input
        return;
      }

      setFormData((prev) => ({ ...prev, profileImage: file }));
    }
  };

  const validatePassword = (password: string): string => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password strength
    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    onSave(formData);
  };

  return (
    <Modal title="Add New User" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name*
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className={INPUT_CLASSES}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email*
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className={INPUT_CLASSES}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number*
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className={INPUT_CLASSES}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location*
            </label>
            <select
              name="location"
              required
              value={formData.location}
              onChange={handleInputChange}
              className={INPUT_CLASSES}
            >
              {LOCATION_OPTIONS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password*
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className={INPUT_CLASSES}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password*
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={INPUT_CLASSES}
            />
          </div>
        </div>

        {/* Error Messages */}
        {passwordError && (
          <div className="text-red-500 text-sm" role="alert">
            {passwordError}
          </div>
        )}

        {/* Profile Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Photo
          </label>
          <input
            type="file"
            name="profileImage"
            onChange={handleFileChange}
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {fileError && (
            <div className="text-red-500 text-sm mt-1" role="alert">
              {fileError}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className={BUTTON_CLASSES.secondary}
          >
            Cancel
          </button>
          <button type="submit" className={BUTTON_CLASSES.primary}>
            Add User
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
