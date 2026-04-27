import React from 'react';

export default function Logo() {
  return (
    <svg width="120" height="60" viewBox="0 0 1000 500" className="fill-current">
      <path
        className="text-primary"
        d="M400 50 L600 50 L500 200 Z M300 150 L500 300 L200 400 Z"
      />
      <path
        className="text-secondary"
        d="M600 250 L800 150 L700 400 Z M500 350 L600 450 L400 450 Z"
      />
    </svg>
  );
}