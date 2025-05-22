'use client';

import { useEffect, useState } from 'react';
import { FiMenu, FiHome, FiX, FiPhone } from 'react-icons/fi';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Home from './home';
import { useUser } from '@clerk/nextjs';
import IntakeForm from './intakeForm';
import OurServices from './ourServices/page';
import ContactUs from './contactUs/page';
import Hero from './hero';
import Details from './details/page';
import LogintoClient from './additional/logintoClient';
import { FaBarsProgress, FaWpforms, FaCircleInfo } from "react-icons/fa6";
import { GrServices } from "react-icons/gr";
import { ModeToggle } from './mode-toggle';
export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const { isSignedIn } = useUser();
  const [hasClientId, setHasClientId] = useState<boolean | null>(null)
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
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
  useEffect(() => {
    const checkAccess = async () => {
      try {
        // 1. Fetch the user role
        const resRole = await fetch('/api/user/user-role');
        if (!resRole.ok) throw new Error('Could not get role');
        const dataRole = await resRole.json();
        const isAdminUser = dataRole.role === 'admin';
        setIsAdmin(isAdminUser);

        // 2. Only check for client ID if not admin
        if (!isAdminUser) {
          const resClient = await fetch('/api/get-client-id');
          if (!resClient.ok) throw new Error('Client not found');
          const dataClient = await resClient.json();
          console.log("Client Data:", dataClient);
          setHasClientId(!!dataClient.clientId);
        }
      } catch (err) {
        console.error(err);
        setHasClientId(false);
        setIsAdmin(false);
      }
    };

    if (isSignedIn) {
      checkAccess();
    }
  }, [isSignedIn]);

  return (
    <div className="min-h-screen">
      {/* Sidebar (Fixed) */}
      <div className={`fixed top-0 left-0 h-screen duration-500 group overflow-hidden rounded-2xl bg-neutral-800 text-neutral-50 z-50 ${isOpen ? 'w-64' : 'w-24'}`}>

        {/* Toggle Button */}
        <div
          className={`p-4 md:flex items-center hidden space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''}`}
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

        {/* Intake Question */}
        {!isAdmin === true && (
          <div
            className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('intake-form')}`}
            onClick={() => handleMenuClick('intake-form')}>
            <FaWpforms size={24} />
            {isOpen && <span>Intake Question</span>}
          </div>
        )}
        {/* About */}
        <div
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('hero')}`}
          onClick={() => handleMenuClick('hero')}>
          <FaCircleInfo size={24} />
          {isOpen && <span>About</span>}
        </div>

        {/* Our Services */}
        <div
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('our-services')}`}
          onClick={() => handleMenuClick('our-services')}>
          <GrServices size={24} />
          {isOpen && <span>Our-Services</span>}
        </div>



        {/* Contact Us */}
        <div
          className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('contact-us')}`}
          onClick={() => handleMenuClick('contact-us')}>
          <FiPhone size={24} />
          {isOpen && <span>Contact Us</span>}
        </div>

        {/* Settings */}
        {isAdmin === true && (
          <div
            className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('details')}`}
            onClick={() => handleMenuClick('details')}>
            <FaBarsProgress size={24} />
            {isOpen && <span>Admin Page</span>}
          </div>
        )}

        <div className="p-4 flex flex-col items-center gap-4 mb-4">
          <ModeToggle />
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
        {currentPage === 'home' && (isSignedIn ? <Home /> : <LogintoClient />)}
        {currentPage === 'hero' && <Hero />}
        {currentPage === 'our-services' && <OurServices />}
        {currentPage === 'intake-form' && (isSignedIn && hasClientId ? <IntakeForm /> : <LogintoClient />)}
        {currentPage === 'details' && <Details />}
        {currentPage === 'contact-us' && <ContactUs />}
      </div>


    </div>
  );
}
