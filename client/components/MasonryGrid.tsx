import React from 'react';

interface MasonryGridProps {
  children: React.ReactNode;
  className?: string;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`
        w-full 
        columns-1 md:columns-2 xl:columns-3 
        gap-6 
        ${className}
      `}
    >
      {/* We rely on the children (TaskCards) to have 'mb-6' and 'break-inside-avoid' 
        which handles the spacing naturally without forcing vertical gaps 
      */}
      {children}
    </div>
  );
};

export default MasonryGrid;