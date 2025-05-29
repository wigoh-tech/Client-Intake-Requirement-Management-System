'use client';

import { useEffect, useState } from 'react';
import { FiMenu, FiHome, FiX, FiPhone } from 'react-icons/fi';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { FaBarsProgress, FaWpforms, FaCircleInfo } from "react-icons/fa6";
import { GrServices } from "react-icons/gr";
import { ModeToggle } from './mode-toggle';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Mainadminpage from './main-admin-handler/page';

export default function HamburgerMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const { isSignedIn } = useUser();
  const [hasClientId, setHasClientId] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  const pageToPath: Record<string, string> = {
    home: '/',
    'Client-form': '/components/clientpage',
    'our-services': '/components/ourServices',
    'contact-us': '/components/contactUs',
    'hero': '/components/hero',
    'intake-form': '/components/clientpage',
  };

  const handleMenuClick = (page: string) => {
    setCurrentPage(page);
    sessionStorage.setItem('currentPage', page);
    setIsOpen(false);
    const path = pageToPath[page] || '/';
    router.push(path);
  };

  const getActiveClass = (page: string) => {
    return currentPage === page ? 'text-violet-500' : '';
  };

  const checkAccess = async () => {
    try {
      const resRole = await fetch('/api/user/user-role');
      if (!resRole.ok) throw new Error('Could not get role');
      const data = await resRole.json();
      const isAdminUser = data.role === 'admin';

      setIsAdmin(isAdminUser);

      if (!isAdminUser) {
        const resClient = await fetch('/api/get-client-id');
        if (!resClient.ok) throw new Error('Client not found');
        const dataClient = await resClient.json();
        setHasClientId(!!dataClient.clientId);
      }
    } catch (err) {
      console.error(err);
      setHasClientId(false);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const savedPage = sessionStorage.getItem('currentPage');
    if (savedPage) {
      setCurrentPage(savedPage);
    }
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      checkAccess();
    }
  }, [isSignedIn]);

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      {!isAdmin && (
        <>
          <header className="fixed top-0 right-0 h-20 flex items-center justify-between px-6 z-30">
            <img src="/wigoh.png" alt="brand-logo" width={90} height={40} />
          </header>

          <div className={`fixed top-0 left-0 h-screen duration-500 group overflow-hidden rounded-2xl bg-neutral-800 text-neutral-50 z-50 ${isOpen ? 'w-64' : 'w-24'}`}>
            {/* Toggle */}
            <div
              className={`p-4 md:flex items-center hidden space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''}`}
              onClick={toggleMenu}>
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </div>

            {/* Menu Items */}
            <div
              className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('home')}`}
              onClick={() => handleMenuClick('home')}>
              <FiHome size={24} />
              {isOpen && <span className="text-xl font-semibold">Home</span>}
            </div>

            <div
              className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('Client-form')}`}
              onClick={() => handleMenuClick('Client-form')}>
              <FaWpforms size={24} />
              {isOpen && <span>Intake Question</span>}
            </div>

            <div
              className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('hero')}`}
              onClick={() => handleMenuClick('hero')}>
              <FaCircleInfo size={24} />
              {isOpen && <span>About</span>}
            </div>

            <div
              className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('our-services')}`}
              onClick={() => handleMenuClick('our-services')}>
              <GrServices size={24} />
              {isOpen && <span>Our Services</span>}
            </div>

            <div
              className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('contact-us')}`}
              onClick={() => handleMenuClick('contact-us')}>
              <FiPhone size={24} />
              {isOpen && <span>Contact Us</span>}
            </div>

            {isAdmin && (
              <div
                className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg transition ${!isOpen ? 'justify-center' : ''} ${getActiveClass('Admin')}`}
                onClick={() => handleMenuClick('Admin')}>
                <FaBarsProgress size={24} />
                {isOpen && <span>Admin Page</span>}
              </div>
            )}

            {/* Mode toggle */}
            <div className="p-4 flex flex-col items-center gap-4 mb-4">
              <ModeToggle />
            </div>

            {/* Sign In / Sign Out */}
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
        </>
      )}
      {/* Main Content */}
      <div className={`transition-all duration-300 ml-24 ${isOpen ? 'ml-64' : 'ml-24'} p-6`}>
        {isAdmin && <Mainadminpage />}
      </div>
    </div>
  );
}
