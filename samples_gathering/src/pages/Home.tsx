import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="relative mb-8">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/20 rounded-lg transform rotate-12" />
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-secondary/20 rounded-lg transform -rotate-12" />
          <img src="/logo.png" alt="Logo" className="w-24 h-auto mx-auto relative" />
        </div>
        <h1 className="text-3xl font-bold text-secondary-dark mb-4">
          جمع عينات القراءة
        </h1>
        <p className="text-gray-600 mb-8">
          جمع عينات القراءة من الطلاب لتحليل أنماط القراءة لديهم
        </p>
        <button
          onClick={() => navigate('/student-info')}
          className="w-full bg-primary text-white rounded-lg py-3 px-4 font-medium hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          بدء اختبار جديد
        </button>
      </div>
    </div>
  );
}