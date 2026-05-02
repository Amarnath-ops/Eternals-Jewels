import React, { useState, useRef } from 'react';

const SideBySideMagnifier = ({ 
  src, 
  alt, 
  className = "",
  style = {},
  zoomLevel = 2.5 
}) => {
  const [showZoom, setShowZoom] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);


  const GLASS_SIZE = 200; 

  const handleMouseEnter = () => setShowZoom(true);
  const handleMouseLeave = () => setShowZoom(false);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;

    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    

    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;


    if (x < 0 || y < 0 || x > width || y > height) {
        setShowZoom(false);
        return;
    }


    let glassX = x - (GLASS_SIZE / 2);
    let glassY = y - (GLASS_SIZE / 2);



 


    
    const bgX = -((x * zoomLevel) - GLASS_SIZE / 2);
    const bgY = -((y * zoomLevel) - GLASS_SIZE / 2);

    setCursorPos({ x: glassX, y: glassY });
    setBgPos({ x: bgX, y: bgY });
  };

  return (
    <div 
      className={`relative inline-block overflow-hidden ${className}`} 
      style={{ ...style, cursor: 'none' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <img 
        ref={imgRef}
        src={src} 
        alt={alt} 
        className="block w-full h-full object-cover pointer-events-none"
      />


      {showZoom && (
        <div 
            className="absolute border-2 border-gray-200 shadow-xl bg-white bg-no-repeat pointer-events-none z-50"
            style={{
                left: cursorPos.x,
                top: cursorPos.y,
                width: `${GLASS_SIZE}px`,
                height: `${GLASS_SIZE}px`,
                backgroundImage: `url(${src})`,
                backgroundSize: `${imgRef.current ? imgRef.current.width * zoomLevel : 0}px ${imgRef.current ? imgRef.current.height * zoomLevel : 0}px`,
                backgroundPosition: `${bgPos.x}px ${bgPos.y}px`
            }}
        />
      )}
    </div>
  );
};

export default SideBySideMagnifier;
