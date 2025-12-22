import Navbar from '@/components/Navbar';
import React from 'react';

// You would import your Navbar and Footer components here
// import Navbar from './Navbar';
// import Footer from './Footer';

const AboutUsPage = () => {
  const bgImage = "asset/about.png";

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar homePage={true}/>
      
      {/* Main section with background image */}
      <main 
        className="grow relative bg-cover bg-center bg-no-repeat min-h-[80vh]"
        style={{ backgroundImage: `url('${bgImage}')` }}
      >
        {/* Dark Overlay for text readability */}
        {/* Using the previous background color #2e2725 with opacity */}
        <div className="absolute inset-0 bg-[#2e2725]/20 mix-blend-multiply"></div>

        {/* Content Container positioned relatively on top of the overlay */}
        {/* Constrained width (md:w-2/3 lg:w-1/2) to keep text on the left, similar to original design */}
        <div className="relative z-10 h-full w-full md:w-2/3 lg:w-1/2 p-8 md:p-16 lg:px-24 lg:py-20 flex flex-col justify-center text-[#E8E0D9]">
          <span className="text-xs uppercase tracking-widest mb-10 text-white/60">Frame 51</span>
          
          <h1 className="font-serif text-4xl md:text-5xl mb-6 tracking-wide">About Us</h1>
          
          {/* Horizontal Line */}
          <div className="w-full h-px bg-[#E8E0D9]/40 mb-10"></div>
          
          <div className="space-y-6 text-base md:text-lg leading-relaxed font-light text-[#E8E0D9]/90">
            <p>
              This is an About Us page for this conceptual jewelry website, helping viewers become accustomed to Eternals and its purpose, if it were real.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna <span className="font-bold text-[#E8E0D9]">aliqua.</span> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
              Vel eros donec ac odio tempor orci dapibus ultrices. Mauris vitae ultricies leo integer. <span className="font-bold text-[#E8E0D9]">Placerat duis ultricies lacus sed turpis tincidunt id.</span>
            </p>
            <p>
              Augue mauris augue neque gravida in fermentum et.
            </p>
          </div>
        </div>
      </main>
      
      {/* <Footer /> */}
    </div>
  );
};

export default AboutUsPage;