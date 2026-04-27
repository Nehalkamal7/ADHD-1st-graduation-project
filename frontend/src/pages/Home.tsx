import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoAboutADHD from '../components/InfoAboutADHD';

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'test' | 'info'>('test');

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <div className="relative mb-8">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/20 rounded-lg transform rotate-12" />
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-secondary/20 rounded-lg transform -rotate-12" />
          <img src="/logo.png" alt="Logo" className="w-24 h-auto mx-auto relative" />
        </div>
        <h1 className="text-3xl font-bold text-secondary-dark mb-4">
          اختبار تتبع حركة العين للكشف عن ADHD
        </h1>
        
        {/* Tab navigation */}
        <div className="flex rounded-lg overflow-hidden mb-6 max-w-md mx-auto border border-gray-200">
          <button 
            className={`flex-1 py-3 px-4 ${activeTab === 'test' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('test')}
          >
            الاختبار
          </button>
          <button 
            className={`flex-1 py-3 px-4 ${activeTab === 'info' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('info')}
          >
            معلومات عن ADHD
          </button>
        </div>
        
        {/* Test tab content */}
        {activeTab === 'test' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <p className="text-gray-700 mb-4 text-lg">
                مرحباً بك في اختبار تتبع حركة العين للكشف عن اضطراب فرط الحركة ونقص الانتباه (ADHD).
              </p>
              <p className="text-gray-700 mb-4">
                يتكون هذا الاختبار من جزئين:
              </p>
              <ul className="text-right text-gray-700 mb-4 space-y-2">
                <li className="flex items-center justify-end gap-2">
                  <span>استبيان قصير يتكون من 10 أسئلة</span>
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                </li>
                <li className="flex items-center justify-end gap-2">
                  <span>اختبار تتبع حركة العين أثناء القراءة</span>
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                </li>
              </ul>
              <p className="text-gray-700">
                سيستغرق الاختبار حوالي 15 دقيقة لإكماله. نتائج هذا الاختبار ستساعد في تحسين فهمنا لأنماط القراءة المرتبطة بـ ADHD.
              </p>
            </div>
            <button
              onClick={() => navigate('/instructions')}
              className="w-full max-w-md bg-primary text-white rounded-lg py-3 px-4 font-medium hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all mx-auto"
            >
              بدء الاختبار
            </button>
          </>
        )}
        
        {/* ADHD Info tab content */}
        {activeTab === 'info' && (
          <InfoAboutADHD isActive={true} />
        )}
      </div>
    </div>
  );
}