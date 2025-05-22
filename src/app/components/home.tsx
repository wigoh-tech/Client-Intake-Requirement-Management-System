
import { useAuth, useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import RegisterClient from './register-client';
import axios from "axios";

export default function Home() {
  const { userId, sessionId } = useAuth();
  const { user } = useUser();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [users, setUsers] = useState<{ id: string; email: string; username: string; status?: string; clients?: any[] }[]>([]);
  const [clientList, setClientList] = useState<{ userName: string; email: string }[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const handlePopupToggle = () => {
    setIsPopupVisible(!isPopupVisible);
  }

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await axios.get("/api/client");
        setClientList(res.data);
      } catch (err) {
        console.error("Error fetching clients:", err);
      } finally {
        setLoadingClients(false);
      }
    }
    fetchClients();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/user');
        const data = await res.json();
        setUsers(data);
        console.log(data)

        const currentUser = data.find((u: any) => u.email === user?.primaryEmailAddress?.emailAddress);
        console.log("Current User:", currentUser);

        if (currentUser?.status === 'clientloggedin') {
          setIsDisabled(true);
        }
      } catch (error) {
        console.error('Error loading users:', error);
      }
    }
    if (userId) {
      fetchUsers();
    }
  }, [userId]);
  return (
    <div className="bg-gradient-to-br p-6">
      <div className="max-w-7xl mx-auto mt-16 flex flex-col-reverse lg:flex-row items-center justify-between gap-12">

        <div className="lg:w-1/2">
          <h1 className="text-5xl font-extrabold text-blue-800 leading-tight mb-6">
          {userId && (`Welcome to the Client Intake App "${user?.username}"`)}
          </h1>
          <p className="text-lg mb-6">
            This platform helps you collect and manage client intake forms efficiently. Whether you're a therapist, consultant, or agency — streamline the intake process with our customizable forms and client tracking system.
          </p>
          <p className="text-lg text-blue-900 font-semibold mb-4">
            👉 Start by registering your account, then add your project requirements to begin the intake process.
          </p>
          <p
            onClick={() => {
              if (!isDisabled) handlePopupToggle();
            }}
            className={`inline-block px-6 py-3 font-medium rounded-xl shadow transition ${isDisabled
              ? "bg-gray-400 text-white cursor-not-allowed pointer-events-none"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            Client Login
          </p>


          <div className="mt-8">
            {userId && (
              <p>Hello,{user?.username} <span className="font-semibold text-blue-700">{userId}</span> — your active session is <span className="font-semibold">{sessionId}</span>.</p>
            )}
          </div>

        </div>


        <div className="w-full md:w-1/2 py-8">
            <img src="https://www.svgrepo.com/show/493509/person-who-invests.svg" className="g-image" />
          </div>
      </div>

      {isPopupVisible && (
        <div
          className="fixed inset-0  bg-opacity-10 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={handlePopupToggle}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <RegisterClient />
            <button
              onClick={handlePopupToggle}
              className="absolute top-2 right-2 text-xl font-bold"
            >
              &times;
            </button>
            <div
              className="group p-4 flex items-center space-x-3 cursor-pointer relative overflow-hidden
                      bg-neutral-800 text-gray-50 font-bold rounded-lg
                      before:absolute before:w-12 before:h-12 before:content-[''] before:right-1 before:top-1
                      before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg
                      after:absolute after:z-10 after:w-20 after:h-20 after:content-[''] after:bg-rose-300
                      after:right-8 after:top-3 after:rounded-full after:blur-lg
                      hover:before:right-12 hover:before:-bottom-8 hover:after:-right-8
                      hover:border-rose-300 hover:text-rose-300 hover:decoration-2
                      duration-500 before:duration-500 after:duration-500
                      group-hover:before:duration-500 group-hover:after:duration-500
                      transition">
            </div>
          </div>

        </div>
      )}      
    </div>
  );
}

