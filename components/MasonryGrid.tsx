import React from 'react';

interface MasonryGridProps {
  children: React.ReactNode;
  className?: string;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ children, className = '' }) => {
  return (
    <div className={`columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6 ${className}`}>
      {children}
    </div>
  );
};

export default MasonryGrid;