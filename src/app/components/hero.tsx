import React, { useState } from 'react';
import Client from './additional/client';

function Hero() {

  return (
    <div>
      <div>
        <div
          className="mx-auto w-full relative flex flex-col items-center justify-center text-center overflow-visible">
          <h3 className="text-3xl font-bold">Where Imaginations <br />Come to Life</h3>
          <div className="w-full relative flex flex-col items-center justify-center">
            <div className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-full blur-sm"></div>
            <div className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-full"></div>
            <div className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent h-[5px] w-1/2 blur-sm"></div>
            <div className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent h-px w-1/2"></div>
            <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(50%_200px_at_top,transparent_20%,white)]"></div>
          </div>
          <p className="mt-6 text-sm">
            To create a supportive and nurturing environment where every child feels understood, <br /> valued, and empowered to build meaningful relationships and thrive emotionally, socially, and academically.
          </p>

          <span
            className="absolute -z-[1] backdrop-blur-sm inset-0 w-full h-full flex before:content-[''] before:h-3/4 before:w-full before:bg-gradient-to-r before:from-black before:to-purple-600 before:blur-[90px] after:content-[''] after:h-1/2 after:w-full after:bg-gradient-to-br after:from-cyan-400 after:to-sky-300 after:blur-[90px]"
          ></span>
        </div>
        <div className='flex flex-row justify-around items-center mt-20'>
          <Client />
          <aside className="bg-black text-white p-6 rounded-lg w-full max-w-lg font-mono">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 text-red-500">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <p className="text-sm">bash</p>
            </div>
            <div className="mt-4">
              <p className="text-green-400">$ the toolthat we have use</p>
              <p className="text-white">+ Parent workshops on emotional regulation and behavior management</p>
              <p className="text-white">+ Collaborating with universities and research institutions</p>
              <p className="text-green-400">$</p>
            </div>
          </aside>
        </div>
      </div>

      <div className='flex justify-around mt-20'>
        <div className="w-full max-w-[570px] rounded-[20px] bg-gray-900 py-12 px-8 text-center md:py-[60px] md:px-[70px]">
          <h3 className="text-white pb-2 text-xl font-bold sm:text-2xl">Much More to Do...</h3>
          <span className="bg-indigo-500 mx-auto mb-6 inline-block h-1 w-[90px] rounded"></span>
          <p className="text-gray-400 mb-10 text-base leading-relaxed">Lorem Ipsum is simply dummy text of the printing and
            typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
          <div className="flex flex-wrap gap-3">
            {/* <button className="text-white block w-full rounded-lg border border-gray-700 p-3 text-center text-base font-medium transition hover:border-red-600 hover:bg-red-600 hover:text-white">Cancel</button>
          <button className="bg-indigo-500 border-indigo-500 block w-full rounded-lg border p-3 text-center text-base font-medium text-white transition hover:bg-opacity-90">View Details</button>
        */}
          </div>
        </div>
      </div>


    </div>
  );
}

export default Hero;
