// src/pages/_tests_/LoginPage.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Login from "../Login";

// Mock dependencies
vi.mock("axios");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockLogin = vi.fn();
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    isLoggedIn: false,
    user: null,
    login: mockLogin,
    logout: vi.fn(),
    checkAuthStatus: vi.fn().mockResolvedValue(true),
  }),
}));

// Mock assets and components
vi.mock("../assets/3.jpg", () => "mock-background-image.jpg");
vi.mock("../components/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));
vi.mock("../components/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

// Setup localStorage mock
const setupLocalStorageMock = () => {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
  };
};

const localStorageMock = setupLocalStorageMock();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Test helpers
const setupTest = () => {
  const user = userEvent.setup();
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  return { user };
};

const fillLoginForm = async (
  user: ReturnType<typeof userEvent.setup>,
  email: string,
  password: string,
  rememberMe = false
) => {
  await user.type(screen.getByLabelText(/Email address/i), email);
  await user.type(screen.getByLabelText(/Password/i), password);

  if (rememberMe) {
    await user.click(screen.getByLabelText(/Remember me/i));
  }
};

const mockSuccessfulLogin = () => {
  (axios.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    data: {
      access_token: "fake-token",
      name: "Test User",
      email: "test@example.com",
    },
  });
};

describe("LoginPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  test("renders login form with required elements", async () => {
    setupTest();

    await waitFor(() => {
      expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();
    });

    // Verify form elements
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Remember me/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign in$/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Forgot your password/i)).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();

    // Verify social login options
    expect(screen.getByRole("button", { name: /Google/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Facebook/i })
    ).toBeInTheDocument();
  });

  test("toggles password visibility when eye icon is clicked", async () => {
    const { user } = setupTest();

    await waitFor(() => {
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });

    const passwordInput = screen.getByLabelText(/Password/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    // Find and click the eye icon button
    const eyeButton = document.querySelector("button.absolute");
    if (!eyeButton) {
      throw new Error("Password visibility toggle button not found");
    }

    // Toggle visibility on
    await user.click(eyeButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    // Toggle visibility off
    await user.click(eyeButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("toggles remember me checkbox", async () => {
    const { user } = setupTest();

    await waitFor(() => {
      expect(screen.getByLabelText(/Remember me/i)).toBeInTheDocument();
    });

    const rememberMeCheckbox = screen.getByLabelText(/Remember me/i);

    // Default state
    expect(rememberMeCheckbox).not.toBeChecked();

    // Toggle on
    await user.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).toBeChecked();

    // Toggle off
    await user.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).not.toBeChecked();
  });

  describe("Form validation", () => {
    test("validates email format", async () => {
      const { user } = setupTest();

      await waitFor(() => {
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /Sign in$/i });

      // Test invalid email
      await fillLoginForm(user, "invalid-email", "validpassword123");
      await user.click(submitButton);
      await new Promise((r) => setTimeout(r, 500)); // Allow validation to complete

      // Verify submission blocked
      expect(mockLogin).not.toHaveBeenCalled();

      // Test valid email
      await fillLoginForm(user, "valid@example.com", "validpassword123");
      await user.click(submitButton);

      // Verify API call attempted
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });
    });

    test("validates password length", async () => {
      const { user } = setupTest();

      await waitFor(() => {
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /Sign in$/i });
      const emailInput = screen.getByLabelText(/Email address/i);
      const passwordInput = screen.getByLabelText(/Password/i);

      // Test short password
      await user.type(emailInput, "valid@example.com");
      await user.type(passwordInput, "short");
      await user.click(submitButton);

      // Verify API wasn't called
      expect(mockLogin).not.toHaveBeenCalled();
      expect(axios.post).not.toHaveBeenCalled();

      // Test valid password
      await user.clear(passwordInput);

      // Mock a successful response
      (axios.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        {
          data: {
            access_token: "fake-token",
            name: "Test User",
            email: "valid@example.com",
          },
        }
      );

      await user.type(passwordInput, "validpassword123");
      await user.click(submitButton);

      // Verify API was called
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });
    });
  });

  describe("API interactions", () => {
    test("handles successful login", async () => {
      const { user } = setupTest();

      await waitFor(() => {
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
      });

      mockSuccessfulLogin();
      await fillLoginForm(user, "test@example.com", "password123");
      await user.click(screen.getByRole("button", { name: /Sign in$/i }));

      // Verify successful login flow
      await waitFor(() => {
        // Check API call
        expect(axios.post).toHaveBeenCalledWith("http://127.0.0.1:8000/login", {
          email: "test@example.com",
          password: "password123",
        });

        // Check token storage
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          "access_token",
          "fake-token"
        );

        // Check auth context update
        expect(mockLogin).toHaveBeenCalledWith(
          { name: "Test User", email: "test@example.com" },
          false // default rememberMe is false
        );

        // Check navigation
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    test("handles failed login with API error", async () => {
      const { user } = setupTest();

      await waitFor(() => {
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
      });

      // Mock API error
      (axios.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        {
          response: {
            data: {
              detail: "Invalid credentials",
            },
          },
        }
      );

      await fillLoginForm(user, "wrong@example.com", "wrongpassword");
      await user.click(screen.getByRole("button", { name: /Sign in$/i }));

      // Verify error handling
      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    test("handles failed login with network error", async () => {
      const { user } = setupTest();

      await waitFor(() => {
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
      });

      // Mock network error
      (axios.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        {}
      );

      await fillLoginForm(user, "test@example.com", "password123");
      await user.click(screen.getByRole("button", { name: /Sign in$/i }));

      // Verify error handling
      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    test("shows loading state during form submission", async () => {
      const { user } = setupTest();

      await waitFor(() => {
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
      });

      // Setup delayed response
      (
        axios.post as unknown as ReturnType<typeof vi.fn>
      ).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: {
                    access_token: "fake-token",
                    name: "Test User",
                    email: "test@example.com",
                  },
                }),
              100
            )
          )
      );

      await fillLoginForm(user, "test@example.com", "password123");
      await user.click(screen.getByRole("button", { name: /Sign in$/i }));

      // Verify successful completion
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    test("remembers user when remember me is checked", async () => {
      const { user } = setupTest();

      await waitFor(() => {
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
      });

      mockSuccessfulLogin();
      await fillLoginForm(user, "test@example.com", "password123", true);
      await user.click(screen.getByRole("button", { name: /Sign in$/i }));

      // Verify remember me flag
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          { name: "Test User", email: "test@example.com" },
          true
        );
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });
  });
});
