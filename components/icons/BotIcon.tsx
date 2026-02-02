
import React from 'react';

export const BotIcon: React.FC = () => (
    <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-300">
            <path d="M12 8V4H8" />
            <rect x="4" y="12" width="16" height="8" rx="2" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="M12 12v.01" />
        </svg>
    </div>
);
