'use client';

import { useState } from 'react';
import {
  FiMenu,
  FiHome,
  FiSettings,
  FiX,
  FiMail,
  FiDatabase,
  FiServer,
  FiPhone,
} from 'react-icons/fi';
import Home from './home';
import { useUser } from '@clerk/nextjs';
import IntakeForm from './intakeForm';
import OurServices from './ourServices/page';
import ContactUs from './contactUs/page';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const { user, isSignedIn } = useUser();
  const [currentPage, setCurrentPage] = useState('home');

  const handleMenuClick = (page: string) => {
    setCurrentPage(page);
    setIsOpen(false);
  };

  const getActiveClass = (page: string) => {
    return currentPage === page ? 'text-blue-500' : '';
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar (Fixed) */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-900 text-white transition-all duration-300 z-50 ${isOpen ? 'w-64' : 'w-24'}`}
      >
        {/* Toggle Button */}
        <div
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''}`}
          onClick={toggleMenu}>
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </div>

        {/* Home */}
        <div
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('home')}`}
          onClick={() => handleMenuClick('home')}>
          <FiHome size={24} />
          {isOpen && <span className="text-xl font-semibold">Home</span>}
        </div>

        {/* Mail */}
        <div
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''}`}
          onClick={() => handleMenuClick('')}>
          <FiMail size={24} />
          {isOpen && <span>Mail</span>}
        </div>

        {/* Our Services */}
        <div
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('our-services')}`}
          onClick={() => handleMenuClick('our-services')}>
          <FiServer size={24} />
          {isOpen && <span>Our-Services</span>}
        </div>

        {/* Intake Question */}
        <div
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('intake-form')}`}
          onClick={() => handleMenuClick('intake-form')}>
          <FiDatabase size={24} />
          {isOpen && <span>Intake Question</span>}
        </div>

        {/* Contact Us */}
        <div
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('contact-us')}`}
          onClick={() => handleMenuClick('contact-us')}>
          <FiPhone size={24} />
          {isOpen && <span>Contact Us</span>}
        </div>

        {/* Settings */}
        <div
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('settings')}`}
          onClick={() => handleMenuClick('settings')}>
          <FiSettings size={24} />
          {isOpen && <span>Settings</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ml-24 ${isOpen ? 'ml-64' : 'ml-24'} p-6`}>
        {currentPage === 'home' && (isSignedIn ? <Home /> : <Home />)}
        {currentPage === 'our-services' && <OurServices />}
        {currentPage === 'intake-form' && (isSignedIn ? <IntakeForm /> : <Home />)}
        {currentPage === 'contact-us' && <ContactUs />}
      </div>
    </div>
  );
}
