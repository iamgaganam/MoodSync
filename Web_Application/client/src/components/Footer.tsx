import { useState, FC, FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faWhatsapp,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { Brain } from "lucide-react";

const Footer: FC = () => {
  // State to manage email input and feedback message
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  /**
   * Handles the newsletter subscription form submission.
   * Currently logs the email and displays a success message.
   * Future integration with a backend API can be added here.
   *
   * @param e - Form submission event
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Simulate the subscription process (e.g., API call)
      console.log("Subscribed email:", email);
      setMessage("Thank you for subscribing!");
      setEmail("");
    } catch (error) {
      setMessage("Subscription failed. Please try again.");
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          {/* Brand and Subscription Section */}
          <div className="mb-6 md:mb-0 md:w-1/3">
            <a href="" className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="self-center text-2xl ml-2 font-semibold whitespace-nowrap dark:text-white">
                MoodSync
              </span>
            </a>
            {/* Tagline */}
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Your mental health companion
            </p>
            {/* Newsletter Subscription Form */}
            <div className="mt-8">
              <h2 className="mb-2 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Subscribe to our newsletter
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                  type="email"
                  className="w-3/4 px-3 py-2 mb-2 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-1/4 text-xs text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg px-2 py-2 text-center"
                >
                  Subscribe
                </button>
              </form>
              {message && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* Navigation Links Section */}
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-6">
            {/* Resources Links */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Resources
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="/blog" className="hover:underline">
                    Mental Health Blog
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/guides" className="hover:underline">
                    Wellness Guides
                  </a>
                </li>
                <li>
                  <a href="/self-care" className="hover:underline">
                    Self-Care Tips
                  </a>
                </li>
              </ul>
            </div>

            {/* Follow Us Links */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Follow Us
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="https://github.com" className="hover:underline">
                    GitHub
                  </a>
                </li>
                <li className="mb-4">
                  <a href="https://linkedin.com" className="hover:underline">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" className="hover:underline">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Support
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="/faq" className="hover:underline">
                    Help Center
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/contact" className="hover:underline">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/forum" className="hover:underline">
                    Community Forum
                  </a>
                </li>
              </ul>
            </div>

            {/* About Us Links */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                About Us
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="/mission" className="hover:underline">
                    Our Mission
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/team" className="hover:underline">
                    Meet the Team
                  </a>
                </li>
                <li>
                  <a href="/partners" className="hover:underline">
                    Partnerships
                  </a>
                </li>
              </ul>
            </div>

            {/* Emergency Links */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Emergency
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="/hotlines" className="hover:underline">
                    24/7 Hotlines
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/crisis" className="hover:underline">
                    Crisis Resources
                  </a>
                </li>
                <li>
                  <a href="/local" className="hover:underline">
                    Local Services
                  </a>
                </li>
              </ul>
            </div>

            {/* Tools Links */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Tools
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="/doctorlogin" className="hover:underline">
                    Doctor Login
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/adminlogin" className="hover:underline">
                    Admin Login
                  </a>
                </li>
                <li>
                  <a href="/meditation" className="hover:underline">
                    Meditation Guide
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

        {/* Footer Bottom: Copyright and Social Media */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025 MoodSync by GM. All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-4">
            {/* Social Media Icons with Accessible Labels */}
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 dark:hover:text-white"
              aria-label="Facebook"
            >
              <FontAwesomeIcon icon={faFacebook} className="w-5 h-5" />
              <span className="sr-only">Facebook page</span>
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-pink-600 dark:hover:text-white"
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} className="w-5 h-6" />
              <span className="sr-only">Instagram page</span>
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-black dark:hover:text-white"
              aria-label="Twitter"
            >
              <FontAwesomeIcon icon={faXTwitter} className="w-6 h-6" />
              <span className="sr-only">Twitter page</span>
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-green-600 dark:hover:text-white"
              aria-label="WhatsApp"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="w-6 h-6" />
              <span className="sr-only">WhatsApp page</span>
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-700 dark:hover:text-white"
              aria-label="LinkedIn"
            >
              <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />
              <span className="sr-only">LinkedIn page</span>
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-red-600 dark:hover:text-white"
              aria-label="YouTube"
            >
              <FontAwesomeIcon icon={faYoutube} className="w-6 h-6" />
              <span className="sr-only">YouTube page</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
