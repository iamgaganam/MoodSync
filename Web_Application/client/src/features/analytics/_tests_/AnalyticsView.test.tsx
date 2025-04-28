// src/features/analytics/_tests_/AnalyticsView.test.tsx

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, beforeEach, vi } from "vitest";
import AnalyticsView from "../AnalyticsView";
import * as Helpers from "../../../utils/Helpers";
import { Patient, MoodData } from "../../../data/mockData";

// Mock dependencies
vi.mock("../../../utils/Helpers", () => ({
  formatDate: vi.fn(() => "April 27, 2025"),
  getSentimentColor: vi.fn(() => "bg-green-500"),
}));

vi.mock("date-fns", () => ({
  format: vi.fn(() => "Apr 27"),
}));

// Test data setup
const createMockPatient = (withProfilePic = false): Patient => ({
  id: "123",
  name: "John Doe",
  age: 30,
  gender: "Male",
  profilePic: withProfilePic ? "https://example.com/profile.jpg" : undefined,
  sentimentScore: 0.7,
  lastActivity: "2025-04-26T10:00:00Z",
  riskLevel: "low",
});

const mockMoodData: MoodData[] = [
  { date: "2025-04-20", sentiment: 0.8, anxiety: 6, depression: 3 },
  { date: "2025-04-21", sentiment: 0.6, anxiety: 7, depression: 4 },
  { date: "2025-04-22", sentiment: 0.9, anxiety: 5, depression: 2 },
];

describe("AnalyticsView Component", () => {
  const mockSetSelectedPatient = vi.fn();

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

    expect(screen.getByText(/No patient selected/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Select a patient to view their analytics/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /View Patients/i })
    ).toBeInTheDocument();
  });

  test("renders patient analytics when a patient is selected", () => {
    const mockPatient = createMockPatient();

    render(
      <AnalyticsView
        selectedPatient={mockPatient}
        moodData={mockMoodData}
        setSelectedPatient={mockSetSelectedPatient}
      />
    );

    // Patient info display
    expect(screen.getByText(mockPatient.name)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockPatient.age} years, ${mockPatient.gender}`)
    ).toBeInTheDocument();

    // Sections rendering
    expect(screen.getByText(/Mental Health Trends/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Chart visualization would go here/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Content Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Key Topics/i)).toBeInTheDocument();
    expect(screen.getByText(/Sentiment Timeline/i)).toBeInTheDocument();

    // Key topics verification
    const keyTopicsSection = screen.getByText(/Key Topics/i).closest(".border");
    if (keyTopicsSection instanceof HTMLElement) {
      const topicsContainer = within(keyTopicsSection);
      ["anxiety", "work stress", "sleep", "family", "loneliness"].forEach(
        (topic) => {
          expect(
            topicsContainer.getByText(new RegExp(`^${topic}$`))
          ).toBeInTheDocument();
        }
      );
    }

    // Action buttons
    expect(
      screen.getByRole("button", { name: /Chat with Patient/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Export Report/i })
    ).toBeInTheDocument();
  });

  test("close button calls setSelectedPatient with null", async () => {
    const user = userEvent.setup();
    const mockPatient = createMockPatient();

    render(
      <AnalyticsView
        selectedPatient={mockPatient}
        moodData={mockMoodData}
        setSelectedPatient={mockSetSelectedPatient}
      />
    );

    const closeButton = screen.getByRole("button", { name: "" });
    await user.click(closeButton);
    expect(mockSetSelectedPatient).toHaveBeenCalledWith(null);
  });

  test("renders profile picture when available", () => {
    const mockPatientWithPic = createMockPatient(true);

    render(
      <AnalyticsView
        selectedPatient={mockPatientWithPic}
        moodData={mockMoodData}
        setSelectedPatient={mockSetSelectedPatient}
      />
    );

    const profilePic = screen.getByAltText(mockPatientWithPic.name);
    expect(profilePic).toBeInTheDocument();
    expect(profilePic).toHaveAttribute("src", mockPatientWithPic.profilePic);
  });

  test("renders patient initial when no profile pic is available", () => {
    const mockPatient = createMockPatient();

    render(
      <AnalyticsView
        selectedPatient={mockPatient}
        moodData={mockMoodData}
        setSelectedPatient={mockSetSelectedPatient}
      />
    );

    expect(screen.getByText("J")).toBeInTheDocument(); // First letter of John
  });

  test("correctly displays average sentiment, anxiety, and depression", () => {
    const mockPatient = createMockPatient();

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

    expect(screen.getByText(avgSentiment)).toBeInTheDocument();
    expect(screen.getByText(`${avgAnxiety}/10`)).toBeInTheDocument();
    expect(screen.getByText(`${avgDepression}/10`)).toBeInTheDocument();
  });

  test("renders message when no mood data is available", () => {
    const mockPatient = createMockPatient();

    render(
      <AnalyticsView
        selectedPatient={mockPatient}
        moodData={[]}
        setSelectedPatient={mockSetSelectedPatient}
      />
    );

    expect(
      screen.getByText(/No mood data available for this patient/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No sentiment data available/i)
    ).toBeInTheDocument();
  });

  test("helper functions are called with correct parameters", () => {
    const mockPatient = createMockPatient();

    render(
      <AnalyticsView
        selectedPatient={mockPatient}
        moodData={mockMoodData}
        setSelectedPatient={mockSetSelectedPatient}
      />
    );

    expect(Helpers.formatDate).toHaveBeenCalledWith(mockPatient.lastActivity);
    expect(Helpers.getSentimentColor).toHaveBeenCalledWith(
      mockPatient.sentimentScore
    );
  });

  test("action buttons are clickable", async () => {
    const user = userEvent.setup();
    const mockPatient = createMockPatient();

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
    const exportButton = screen.getByRole("button", { name: /Export Report/i });

    await user.click(chatButton);
    await user.click(exportButton);

    expect(chatButton).toBeInTheDocument();
    expect(exportButton).toBeInTheDocument();
  });
});
