'use client';

import { useEffect, useState } from 'react';
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
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Home from './home';
import { useUser } from '@clerk/nextjs';
import IntakeForm from './intakeForm';
import OurServices from './ourServices/page';
import ContactUs from './contactUs/page';
import Hero from './hero';
import Details from './details/page';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const { isSignedIn } = useUser();

  const [currentPage, setCurrentPage] = useState<string>('home');

  useEffect(() => {
    const savedPage = sessionStorage.getItem('currentPage');
    if (savedPage) {
      setCurrentPage(savedPage);
    }
  }, []);

  
  const handleMenuClick = (page: string) => {
    setCurrentPage(page);
    sessionStorage.setItem('currentPage', page);
    setIsOpen(false);
  };

  const getActiveClass = (page: string) => {
    return currentPage === page ? 'text-blue-500' : '';
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar (Fixed) */}
      <div className={`fixed top-0 left-0 h-screen duration-500 group overflow-hidden rounded-2xl bg-neutral-800 text-neutral-50 z-50 ${isOpen ? 'w-64' : 'w-24'}`}>
      
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
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('hero')}`}
          onClick={() => handleMenuClick('hero')}>
          <FiMail size={24} />
          {isOpen && <span>About</span>}
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
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('details')}`}
          onClick={() => handleMenuClick('details')}>
          <FiSettings size={24} />
          {isOpen && <span>Settings</span>}
        </div>

        {/* LogIn SignUp signIn */}
        <div className="p-4 flex flex-col items-center gap-4 mb-4">
          <SignedOut>
            <SignInButton>
              <button className="w-full px-4 py-2 rounded-full border border-black bg-white text-black text-sm font-medium hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:-translate-y-[1px] transition-all duration-200">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="w-full px-4 py-2 rounded-full border border-black bg-black text-white text-sm font-medium hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:-translate-y-[1px] transition-all duration-200">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
            {isOpen && <span>USER</span>}
          </SignedIn>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ml-24 ${isOpen ? 'ml-64' : 'ml-24'} p-6`}>
        {currentPage === 'home' && (isSignedIn ? <Home /> : <Home />)}
        {currentPage === 'hero' && <Hero />}
        {currentPage === 'our-services' && <OurServices />}
        {currentPage === 'intake-form' && (isSignedIn ? <IntakeForm /> : <Home />)}
        {currentPage === 'details' && <Details />}
        {currentPage === 'contact-us' && <ContactUs />}
      </div>


    </div>
  );
}
