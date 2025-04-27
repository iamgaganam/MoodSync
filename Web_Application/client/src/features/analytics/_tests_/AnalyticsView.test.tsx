// src/features/analytics/_tests_/AnalyticsView.test.tsx

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, beforeEach, vi } from "vitest";
import AnalyticsView from "../AnalyticsView";
import * as Helpers from "../../../utils/Helpers";
// Import the actual types from mockData to ensure compatibility
import { Patient, MoodData } from "../../../data/mockData";

// Mock the helper functions
vi.mock("../../../utils/Helpers", () => ({
  formatDate: vi.fn(() => "April 27, 2025"),
  getSentimentColor: vi.fn(() => "bg-green-500"),
}));

// Mock the date-fns format function
vi.mock("date-fns", () => ({
  format: vi.fn(() => "Apr 27"),
}));

// Create mock data with correct types
// Note: lastActivity is now a string instead of Date to match your component props
const mockPatient: Patient = {
  id: "123",
  name: "John Doe",
  age: 30,
  gender: "Male",
  profilePic: undefined,
  sentimentScore: 0.7,
  lastActivity: "2025-04-26T10:00:00Z", // Using string format instead of Date
  riskLevel: "low",
};

const mockPatientWithPic: Patient = {
  ...mockPatient,
  profilePic: "https://example.com/profile.jpg",
};

const mockMoodData: MoodData[] = [
  {
    date: "2025-04-20",
    sentiment: 0.8,
    anxiety: 6,
    depression: 3,
  },
  {
    date: "2025-04-21",
    sentiment: 0.6,
    anxiety: 7,
    depression: 4,
  },
  {
    date: "2025-04-22",
    sentiment: 0.9,
    anxiety: 5,
    depression: 2,
  },
];

// Mock set function
const mockSetSelectedPatient = vi.fn();

describe("AnalyticsView Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders no patient selected view when selectedPatient is null", () => {
    render(
      <AnalyticsView
        selectedPatient={null}
        moodData={[]}
        setSelectedPatient={mockSetSelectedPatient}
      />
    );

    // Check that the no patient selected view is rendered
    expect(screen.getByText(/No patient selected/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Select a patient to view their analytics/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /View Patients/i })
    ).toBeInTheDocument();
  });

  test("renders patient analytics when a patient is selected", () => {
    render(
      <AnalyticsView
        selectedPatient={mockPatient}
        moodData={mockMoodData}
        setSelectedPatient={mockSetSelectedPatient}
      />
    );

    // Check that patient info is displayed
    expect(screen.getByText(mockPatient.name)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockPatient.age} years, ${mockPatient.gender}`)
    ).toBeInTheDocument();

    // Check that mood trends section is rendered
    expect(screen.getByText(/Mental Health Trends/i)).toBeInTheDocument();

    // Check for the chart placeholder text
    expect(
      screen.getByText(/Chart visualization would go here/i)
    ).toBeInTheDocument();

    // Check that content analysis section is rendered
    expect(screen.getByText(/Content Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Key Topics/i)).toBeInTheDocument();
    expect(screen.getByText(/Sentiment Timeline/i)).toBeInTheDocument();

    // Find the key topics section and check for topic tags within it
    const keyTopicsHeading = screen.getByText(/Key Topics/i);
    const keyTopicsSection = keyTopicsHeading.closest(".border");

    // Use within to scope our queries to just the key topics section
    if (keyTopicsSection instanceof HTMLElement) {
      const topicsContainer = within(keyTopicsSection);
      expect(topicsContainer.getByText(/^anxiety$/)).toBeInTheDocument();
      expect(topicsContainer.getByText(/^work stress$/)).toBeInTheDocument();
      expect(topicsContainer.getByText(/^sleep$/)).toBeInTheDocument();
      expect(topicsContainer.getByText(/^family$/)).toBeInTheDocument();
      expect(topicsContainer.getByText(/^loneliness$/)).toBeInTheDocument();
    }

    // Check for buttons
    expect(
      screen.getByRole("button", { name: /Chat with Patient/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Export Report/i })
    ).toBeInTheDocument();
  });

  test("close button calls setSelectedPatient with null", async () => {
    const user = userEvent.setup();

    render(
      <AnalyticsView
        selectedPatient={mockPatient}
        moodData={mockMoodData}
        setSelectedPatient={mockSetSelectedPatient}
      />
    );

    // Find the close button by its parent's class and the XIcon it contains
    const closeButton = screen.getByRole("button", {
      name: "", // Empty name for the button with just an icon
    });

    await user.click(closeButton);
    expect(mockSetSelectedPatient).toHaveBeenCalledWith(null);
  });

  test("renders profile picture when available", () => {
    render(
      <AnalyticsView
        selectedPatient={mockPatientWithPic}
        moodData={mockMoodData}
        setSelectedPatient={mockSetSelectedPatient}
      />
    );

    // Check that the profile picture is rendered
    const profilePic = screen.getByAltText(mockPatientWithPic.name);
    expect(profilePic).toBeInTheDocument();
    expect(profilePic).toHaveAttribute("src", mockPatientWithPic.profilePic);
  });

  test("renders patient initial when no profile pic is available", () => {
    render(
      <AnalyticsView
        selectedPatient={mockPatient}
        moodData={mockMoodData}
        setSelectedPatient={mockSetSelectedPatient}
      />
    );

    // Since our mock patient has no profilePic, it should show the first initial
    const initial = screen.getByText("J"); // First letter of John
    expect(initial).toBeInTheDocument();
  });

  test("correctly displays average sentiment, anxiety, and depression", () => {
    render(
      <AnalyticsView
        selectedPatient={mockPatient}
        moodData={mockMoodData}
        setSelectedPatient={mockSetSelectedPatient}
      />
    );

    // Calculate expected averages
    const avgSentiment = (
      mockMoodData.reduce((acc, item) => acc + item.sentiment, 0) /
      mockMoodData.length
    ).toFixed(2);

    const avgAnxiety = (
      mockMoodData.reduce((acc, item) => acc + item.anxiety, 0) /
      mockMoodData.length
    ).toFixed(1);

    const avgDepression = (
      mockMoodData.reduce((acc, item) => acc + item.depression, 0) /
      mockMoodData.length
    ).toFixed(1);

    // Check that averages are displayed correctly
    expect(screen.getByText(avgSentiment)).toBeInTheDocument();
    expect(screen.getByText(`${avgAnxiety}/10`)).toBeInTheDocument();
    expect(screen.getByText(`${avgDepression}/10`)).toBeInTheDocument();
  });

  test("renders message when no mood data is available", () => {
    render(
      <AnalyticsView
        selectedPatient={mockPatient}
        moodData={[]}
        setSelectedPatient={mockSetSelectedPatient}
      />
    );

    // Check for the no data messages
    expect(
      screen.getByText(/No mood data available for this patient/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No sentiment data available/i)
    ).toBeInTheDocument();
  });

  test("formatDate is called with the patient lastActivity date", () => {
    render(
      <AnalyticsView
        selectedPatient={mockPatient}
        moodData={mockMoodData}
        setSelectedPatient={mockSetSelectedPatient}
      />
    );

    // Check that formatDate was called with the correct lastActivity string
    expect(Helpers.formatDate).toHaveBeenCalledWith(mockPatient.lastActivity);
  });

  test("getSentimentColor is called with the patient sentiment score", () => {
    render(
      <AnalyticsView
        selectedPatient={mockPatient}
        moodData={mockMoodData}
        setSelectedPatient={mockSetSelectedPatient}
      />
    );

    // Check that getSentimentColor was called with the correct score
    expect(Helpers.getSentimentColor).toHaveBeenCalledWith(
      mockPatient.sentimentScore
    );
  });

  test("chat with patient button is clickable", async () => {
    const user = userEvent.setup();

    render(
      <AnalyticsView
        selectedPatient={mockPatient}
        moodData={mockMoodData}
        setSelectedPatient={mockSetSelectedPatient}
      />
    );

    const chatButton = screen.getByRole("button", {
      name: /Chat with Patient/i,
    });
    await user.click(chatButton);

    // Since the onClick is not implemented in the component, we just check that the button exists and is clickable
    expect(chatButton).toBeInTheDocument();
  });

  test("export report button is clickable", async () => {
    const user = userEvent.setup();

    render(
      <AnalyticsView
        selectedPatient={mockPatient}
        moodData={mockMoodData}
        setSelectedPatient={mockSetSelectedPatient}
      />
    );

    const exportButton = screen.getByRole("button", { name: /Export Report/i });
    await user.click(exportButton);

    // Since the onClick is not implemented in the component, we just check that the button exists and is clickable
    expect(exportButton).toBeInTheDocument();
  });
});
