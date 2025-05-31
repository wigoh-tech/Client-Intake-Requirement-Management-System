'use client';
import React from "react";

const ContactUs = () => {
  return (
    <div>
      <section className="py-10 h-full flex items-center px-4 ">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Have You Any Project? <br />
              <span>Please Drop a Message</span>
            </h2>
            <p className="mt-4">
              Get in touch and let me know how I can help. Fill out the form and
              I'll be in touch as soon as possible.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start space-x-4">
                <span className="text-xl text-gray-400">📍</span>
                <div>
                  <p className="font-semibold">Address:</p>
                  <p className="text-gray-400">89/9 Mothijheel, Dhaka, Bangladesh.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="text-xl text-gray-400">📞</span>
                <div>
                  <p className="font-semibold">Phone:</p>
                  <p className="text-gray-400">+8801799568976</p>
                  <p className="text-gray-400">+8801904015294</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="text-xl text-gray-400">✉️</span>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p className="text-gray-400">support@abdul.com</p>
                  <p className="text-gray-400">abdulbasetbappy@hotmail.com</p>
                </div>
              </div>
            </div>


            <div className="mt-6 flex justify-center lg:justify-start gap-4">
              <a href="#"
                className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-neutral-200 hover:w-32 transition-all overflow-hidden">
                <span className="hidden group-hover:inline whitespace-nowrap mr-2">GitHub</span>🐙
              </a>
              <a href="#"
                className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-neutral-200 hover:w-36 transition-all overflow-hidden">
                <span className="hidden group-hover:inline whitespace-nowrap mr-2">LinkedIn</span>💼
              </a>
              <a href="#"
                className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-neutral-200 hover:w-36 transition-all overflow-hidden">
                <span className="hidden group-hover:inline whitespace-nowrap mr-2">Facebook</span>📘
              </a>
              <a href="#"
                className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-800 text-neutral-200 hover:w-36 transition-all overflow-hidden">
                <span className="hidden group-hover:inline whitespace-nowrap mr-2">YouTube</span>▶️
              </a>
            </div>
          </div>

          <div className="p-8 rounded-xl shadow-lg border-2">
            <form>
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input type="text" placeholder="e.g John Doe" className="w-full px-4 py-3 text-white rounded-lg border border-gray-600 outline-none" />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Email<span className="text-xs">(Required)</span></label>
                <input type="email" placeholder="e.g johndoe@mail.com" className="w-full px-4 py-3 text-white rounded-lg border border-gray-600 outline-none" />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Phone</label>
                <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 rounded-lg border border-gray-600 outline-none" />
              </div>

              <div className="mb-4">
                <label className="block  mb-2">Message<span className="text-xs">(Required)</span></label>
                <textarea placeholder="Write message..." className="w-full px-4 py-3  rounded-lg border border-gray-600 outline-none h-24"></textarea>
              </div>

              <button type="submit" className="w-full bg-white text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-300 transition">
                SEND
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
