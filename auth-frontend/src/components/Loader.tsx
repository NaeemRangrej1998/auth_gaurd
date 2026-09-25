import React from 'react';
export const Loader = ({ message = "Loading permissions..." }: { message?: string }) => {
    return (
        <div className="absolute h-full w-full inset-0 bg-backGround/80 z-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent absolute top-0"></div>
                </div>
                <div className="text-indigo-600 font-medium animate-pulse">{message}</div>
            </div>
        </div>
    );
}; 