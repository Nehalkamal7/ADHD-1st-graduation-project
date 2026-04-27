import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="w-full py-4 px-6 bg-white/80 backdrop-blur-sm fixed top-0 shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-4 rtl:space-x-reverse hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
          <p className="arabic-quote text-secondary-dark text-xl font-bold">لِأنَّ كلَّ عقلٍ يستحقُ الفهم</p>
        </Link>
      </div>
    </header>
  );
}