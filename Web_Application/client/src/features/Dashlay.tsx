// src/components/layout/DashboardLayout.tsx
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Navbar, Sidebar, Avatar, Dropdown, Button } from "flowbite-react";
import {
  HiChartPie,
  HiChatAlt,
  HiHeart,
  HiLightBulb,
  HiOutlineMenuAlt1,
  HiQuestionMarkCircle,
  HiSparkles,
  HiUserGroup,
  HiX,
} from "react-icons/hi";
import { MdContactSupport, MdArticle } from "react-icons/md";
import logo from "../assets/1.jpg"; // Create and add your logo

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar
        fluid
        className="border-b bg-white px-4 py-2.5 fixed w-full z-20 top-0 left-0"
      >
        <div className="flex md:order-2 gap-2">
          <Button color="light" onClick={toggleSidebar} className="md:hidden">
            {isSidebarOpen ? <HiX /> : <HiOutlineMenuAlt1 />}
          </Button>
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User profile"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">John Doe</span>
              <span className="block truncate text-sm font-medium">
                john@example.com
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Profile</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
        </div>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} className="mr-3 h-6 sm:h-9" alt="MoodSync Logo" />
          <span className="self-center whitespace-nowrap text-xl font-semibold">
            MoodSync
          </span>
        </Navbar.Brand>
      </Navbar>

      <div className="flex pt-16 flex-1">
        {/* Sidebar */}
        <div
          className={`fixed h-full z-10 transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:w-64`}
        >
          <Sidebar
            aria-label="MoodSync Dashboard Sidebar"
            className="h-full overflow-y-auto border-r"
          >
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item as={Link} to="/dashboard" icon={HiChartPie}>
                  Dashboard
                </Sidebar.Item>
                <Sidebar.Item as={Link} to="/mood-tracker" icon={HiHeart}>
                  Mood Tracker
                </Sidebar.Item>
                <Sidebar.Item as={Link} to="/chat" icon={HiChatAlt}>
                  Chat Support
                </Sidebar.Item>
                <Sidebar.Item as={Link} to="/insights" icon={HiSparkles}>
                  Insights
                </Sidebar.Item>
              </Sidebar.ItemGroup>
              <Sidebar.ItemGroup>
                <Sidebar.Item as={Link} to="/quotes" icon={HiLightBulb}>
                  Inspirational Quotes
                </Sidebar.Item>
                <Sidebar.Item as={Link} to="/tips" icon={HiQuestionMarkCircle}>
                  Mental Health Tips
                </Sidebar.Item>
                <Sidebar.Item as={Link} to="/resources" icon={HiUserGroup}>
                  Resources & Helplines
                </Sidebar.Item>
                <Sidebar.Item as={Link} to="/blog" icon={MdArticle}>
                  Blog & Articles
                </Sidebar.Item>
                <Sidebar.Item as={Link} to="/about" icon={HiSparkles}>
                  About Us
                </Sidebar.Item>
                <Sidebar.Item as={Link} to="/contact" icon={MdContactSupport}>
                  Contact Us
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "md:ml-64" : "md:ml-64"
          } ml-0 p-4`}
        >
          <div className="container mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
