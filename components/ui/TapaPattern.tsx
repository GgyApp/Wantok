import React from 'react';

// A CSS pattern simulating the triangular "Tapa" cloth designs common in PNG/Pacific art.
export const TapaPattern = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`w-full h-3 overflow-hidden opacity-80 ${className}`}>
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #000 25%, transparent 25%), 
            linear-gradient(-45deg, #000 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #000 75%), 
            linear-gradient(-45deg, transparent 75%, #000 75%)
          `,
          backgroundSize: '10px 10px',
          backgroundColor: 'transparent'
        }}
      />
    </div>
  );
};

export const TapaBorder = () => (
    <div className="h-2 w-full flex">
        <div className="flex-1 bg-[#CE1126]"></div> {/* PNG Red */}
        <div className="flex-1 bg-[#000000]"></div> {/* Black */}
        <div className="flex-1 bg-[#FAD201]"></div> {/* PNG Gold */}
        <div className="flex-1 bg-[#FFFFFF]"></div> {/* White */}
    </div>
);