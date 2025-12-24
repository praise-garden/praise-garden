import React from 'react';

export default function PublicFormLoading() {
    return (
        <div className="w-full h-screen bg-gray-950 flex flex-col items-center justify-center">
            {/* Animated loading indicator */}
            <div className="flex flex-col items-center gap-6">
                {/* Pulse circles */}
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-800 border-t-purple-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400/30 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
                </div>

                {/* Loading text */}
                <div className="text-center">
                    <p className="text-gray-400 text-sm font-medium">Loading your form...</p>
                </div>
            </div>

            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
        </div>
    );
}
