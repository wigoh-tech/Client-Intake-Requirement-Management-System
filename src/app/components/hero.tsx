import React, { useState } from 'react';

function Hero() {

  return (
    <div>
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522252234503-e356532cafd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxjb2RlfGVufDB8MHx8fDE2OTQwOTg0MTZ8MA&ixlib=rb-4.0.3&q=80&w=1080')",
            height: '85vh',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>

        <div className="container mx-auto px-6 pt-32 pb-48 relative z-10">
          <div
            className="max-w-3xl transition-all duration-1000"
            style={{
              opacity: 1,
              transform: 'translateY(0)',
            }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Where Imaginations <br />
              Come to Life
            </h1>
            <p className="text-xl text-white mb-8 md:pr-12">
              Premium vinyl playsets designed for endless adventures, built to last for generations of fun.
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
