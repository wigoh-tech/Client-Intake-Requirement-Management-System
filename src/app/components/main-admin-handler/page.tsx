'use client';
import React, { useEffect } from 'react';

export default function Mainadminpage() {
  useEffect(() => {
    const animateProgressBars = () => {
      document.querySelectorAll<HTMLElement>('.progress-bar').forEach(bar => {
        const width = bar.getAttribute('data-width');
        if (width) bar.style.width = width;
      });

      const setCounter = (id: string, end: number, prefix = '', suffix = '') => {
        const el = document.getElementById(id);
        if (!el) return;

        let count = 0;
        const increment = end / 60;
        const interval = setInterval(() => {
          count += increment;
          if (count >= end) {
            count = end;
            clearInterval(interval);
          }
          el.innerText = `${prefix}${Math.round(count)}${suffix}`;
        }, 15);
      };

      setCounter('earnings-counter', 12834, '$');
      setCounter('revenue-counter', 2480, '$');
      setCounter('sales-percent', 64, '', '%');
      setCounter('direct-percent', 80, '', '%');
      setCounter('social-percent', 50, '', '%');
      setCounter('referral-percent', 20, '', '%');
      setCounter('bounce-percent', 60, '', '%');
      setCounter('internet-percent', 40, '', '%');
    };

    animateProgressBars();
  }, []);

  return (
    <div className="font-sans">
      <div className="container mx-auto p-4 md:p-6">

        {/* Earnings Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white mb-8 shadow-lg card-hover animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-medium mb-1">All Earnings</h2>
          <p className="text-3xl font-bold mb-4" id="earnings-counter">$0</p>
          <div className="flex justify-between items-center">
            <span className="text-indigo-100">IDX changes on profit</span>
            <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-medium hover:scale-110 transition">+3.2%</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card title="Sales Per Day" icon="fas fa-chart-line" iconBg="bg-green-100" iconColor="text-green-600" valueId="sales-percent" subtitle="+1.2% from yesterday" />
          <Card title="Revenue" icon="fas fa-shopping-bag" iconBg="bg-blue-100" iconColor="text-blue-600" valueId="revenue-counter" subtitle="321 Today Sales" />
        </div>

        {/* Social Media */}
        <SocialCard title="YouTube" icon="fab fa-youtube" color="red" change="+1/8 REVX" stat="Views: 12.4K" />
        <SocialCard title="Facebook" icon="fab fa-facebook-f" color="blue" change="+4/5 26.9K" stat="Engagement: 8.2%" />
        <SocialCard title="Twitter" icon="fab fa-twitter" color="sky" change="-6/10 6.9K" stat="Impressions: 24.1K" />

        {/* Traffic */}
        <TrafficProgress label="Direct" id="direct-percent" width="80%" color="bg-indigo-600" />
        <TrafficProgress label="Social" id="social-percent" width="50%" color="bg-blue-500" />
        <TrafficProgress label="Referral" id="referral-percent" width="20%" color="bg-green-500" />
        <TrafficProgress label="Bounce" id="bounce-percent" width="60%" color="bg-yellow-500" />
        <TrafficProgress label="Internet" id="internet-percent" width="40%" color="bg-purple-500" />
      </div>
    </div>
  );
}

// Components
const Card = ({ title, icon, iconBg, iconColor, valueId, subtitle }: any) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover animate-fadeIn">
    <h3 className="text-lg font-medium text-gray-700 mb-4">{title}</h3>
    <div className="flex justify-between items-end">
      <div>
        <p className="text-2xl font-bold text-gray-800" id={valueId}>0</p>
        <p className="text-sm font-medium text-gray-500">{subtitle}</p>
      </div>
      <div className={`${iconBg} p-3 rounded-lg hover:rotate-12 transition`}>
        <i className={`${icon} ${iconColor} text-xl`}></i>
      </div>
    </div>
  </div>
);

const SocialCard = ({ title, icon, color, change, stat }: any) => (
  <div className={`flex justify-between items-center p-3 bg-${color}-50 rounded-lg card-hover animate-fadeIn`}>
    <div className="flex items-center space-x-3">
      <div className={`bg-${color}-100 p-2 rounded-lg hover:rotate-12 transition`}>
        <i className={`${icon} text-${color}-600`}></i>
      </div>
      <span className="font-medium">{title}</span>
    </div>
    <div className="text-right">
      <p className={`font-medium ${change.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>{change}</p>
      <p className="text-xs text-gray-500">{stat}</p>
    </div>
  </div>
);

const TrafficProgress = ({ label, id, width, color }: any) => (
  <div className="flex items-center justify-between mt-4">
    <span className="w-24 font-medium">{label}</span>
    <div className="flex-1 mx-4">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full progress-bar ${color}`} data-width={width} style={{ width: '0%' }}></div>
      </div>
    </div>
    <span className="w-10 text-right font-medium" id={id}>0%</span>
  </div>
);
