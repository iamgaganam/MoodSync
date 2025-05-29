import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import "@testing-library/jest-dom";
import LoginPage from "../Login";

// Mock dependencies
vi.mock("axios");
const mockedAxios = vi.mocked(axios);

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: null,
    }),
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
    isInitialized: true,
  }),
}));

// Mock assets and components
vi.mock("../../assets/emergency.jpg", () => ({
  default: "mock-background-image.jpg",
}));
vi.mock("../../components/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));
vi.mock("../../components/Footer", () => ({
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
      <LoginPage />
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
  const emailInput = screen.getByLabelText(/Email address/i);
  const passwordInput = screen.getByLabelText(/^Password$/i);

  await user.clear(emailInput);
  await user.clear(passwordInput);

  await user.type(emailInput, email);
  await user.type(passwordInput, password);

  if (rememberMe) {
    await user.click(screen.getByLabelText(/Remember me/i));
  }
};

const mockSuccessfulLogin = () => {
  mockedAxios.post.mockResolvedValueOnce({
    data: {
      token: "fake-token",
      refreshToken: "fake-refresh-token",
      user: {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        role: "user",
      },
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
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
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
      expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    });

    const passwordInput = screen.getByLabelText(/^Password$/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    // Find and click the eye icon button using aria-label
    const eyeButton = screen.getByLabelText(/Show password/i);

    // Toggle visibility on
    await user.click(eyeButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    // Toggle visibility off (button label should change)
    const hideButton = screen.getByLabelText(/Hide password/i);
    await user.click(hideButton);
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
      await waitFor(() => {
        expect(
          screen.getByText(/Email address is invalid/i)
        ).toBeInTheDocument();
      });

      // Verify submission blocked
      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    test("validates password length", async () => {
      const { user } = setupTest();

      await waitFor(() => {
        expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /Sign in$/i });

      // Test short password
      await fillLoginForm(user, "valid@example.com", "short");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Password must be at least 8 characters/i)
        ).toBeInTheDocument();
      });

      // Verify API wasn't called
      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    test("shows required field errors when submitting empty form", async () => {
      const { user } = setupTest();

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /Sign in$/i })
        ).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /Sign in$/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      });

      expect(mockedAxios.post).not.toHaveBeenCalled();
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
        // Check API call with correct endpoint from cleaned component
        expect(mockedAxios.post).toHaveBeenCalledWith(
          "http://localhost:5000/api/auth/login",
          {
            email: "test@example.com",
            password: "password123",
          },
          expect.objectContaining({
            timeout: 15000,
            headers: {
              "Content-Type": "application/json",
            },
          })
        );

        // Check auth context update
        expect(mockLogin).toHaveBeenCalledWith(
          {
            id: "1",
            name: "Test User",
            email: "test@example.com",
            role: "user",
          },
          "fake-token",
          "fake-refresh-token",
          false // default rememberMe is false
        );

        // Check navigation
        expect(mockNavigate).toHaveBeenCalledWith("/userprofile", {
          replace: true,
        });
      });
    });

    test("handles failed login with API error", async () => {
      const { user } = setupTest();

      await waitFor(() => {
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
      });

      // Mock API error
      mockedAxios.post.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          data: {
            message: "Invalid credentials",
          },
        },
      });

      await fillLoginForm(user, "wrong@example.com", "wrongpassword");
      await user.click(screen.getByRole("button", { name: /Sign in$/i }));

      // Verify error handling
      await waitFor(() => {
        expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(mockLogin).not.toHaveBeenCalled();
    });

    test("handles failed login with network error", async () => {
      const { user } = setupTest();

      await waitFor(() => {
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
      });

      // Mock network error
      mockedAxios.post.mockRejectedValueOnce({
        isAxiosError: true,
        code: "ECONNREFUSED",
      });

      await fillLoginForm(user, "test@example.com", "password123");
      await user.click(screen.getByRole("button", { name: /Sign in$/i }));

      // Verify error handling
      await waitFor(() => {
        expect(screen.getByText(/Connection error/i)).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(mockLogin).not.toHaveBeenCalled();
    });

    test("shows loading state during form submission", async () => {
      const { user } = setupTest();

      await waitFor(() => {
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
      });

      // Setup delayed response
      mockedAxios.post.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: {
                    token: "fake-token",
                    refreshToken: "fake-refresh-token",
                    user: {
                      id: "1",
                      name: "Test User",
                      email: "test@example.com",
                      role: "user",
                    },
                  },
                }),
              100
            )
          )
      );

      await fillLoginForm(user, "test@example.com", "password123");
      await user.click(screen.getByRole("button", { name: /Sign in$/i }));

      // Check for loading state
      expect(screen.getByText(/Signing in.../i)).toBeInTheDocument();

      // Verify successful completion
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/userprofile", {
          replace: true,
        });
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
          {
            id: "1",
            name: "Test User",
            email: "test@example.com",
            role: "user",
          },
          "fake-token",
          "fake-refresh-token",
          true // rememberMe should be true
        );
        expect(mockNavigate).toHaveBeenCalledWith("/userprofile", {
          replace: true,
        });
      });
    });

    test("handles form submission with disabled button during loading", async () => {
      const { user } = setupTest();

      await waitFor(() => {
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
      });

      // Setup very delayed response
      mockedAxios.post.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: {
                    token: "fake-token",
                    refreshToken: "fake-refresh-token",
                    user: {
                      id: "1",
                      name: "Test User",
                      email: "test@example.com",
                      role: "user",
                    },
                  },
                }),
              200
            )
          )
      );

      await fillLoginForm(user, "test@example.com", "password123");
      const submitButton = screen.getByRole("button", { name: /Sign in$/i });

      await user.click(submitButton);

      // Button should be disabled during loading
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      // Verify successful completion
      await waitFor(
        () => {
          expect(mockNavigate).toHaveBeenCalledWith("/userprofile", {
            replace: true,
          });
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Accessibility", () => {
    test("has proper labels and ARIA attributes", async () => {
      setupTest();

      await waitFor(() => {
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
      });

      // Check form inputs have proper labels
      const emailInput = screen.getByLabelText(/Email address/i);
      const passwordInput = screen.getByLabelText(/^Password$/i);
      const rememberMeCheckbox = screen.getByLabelText(/Remember me/i);

      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("autoComplete", "email");
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(passwordInput).toHaveAttribute("autoComplete", "current-password");
      expect(rememberMeCheckbox).toHaveAttribute("type", "checkbox");

      // Check password toggle button has proper aria-label
      const passwordToggle = screen.getByLabelText(/Show password/i);
      expect(passwordToggle).toBeInTheDocument();
    });

    test("shows proper error states with aria-invalid", async () => {
      const { user } = setupTest();

      await waitFor(() => {
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /Sign in$/i });
      await user.click(submitButton);

      await waitFor(() => {
        const emailInput = screen.getByLabelText(/Email address/i);
        const passwordInput = screen.getByLabelText(/^Password$/i);

        expect(emailInput).toHaveAttribute("aria-invalid", "true");
        expect(passwordInput).toHaveAttribute("aria-invalid", "true");
      });
    });
  });
});
