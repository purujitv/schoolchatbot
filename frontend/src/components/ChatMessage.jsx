import React from 'react';

export function ChatMessage({ message, timestamp, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isOwn
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message}</p>
        <span className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'} block mt-1`}>
          {timestamp}
        </span>
      </div>
    </div>
  );
}
