'use client';

import React, { ReactNode } from 'react';

interface CardProps {
  className?: string;
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={`bg-white shadow-lg shadow-gray-200 rounded-2xl p-4 ${className ? className : ''}`}>
      {children}
    </div>
  );
};