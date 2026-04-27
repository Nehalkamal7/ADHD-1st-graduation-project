import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Instructions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-5rem)] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-secondary hover:text-secondary-dark transition-colors"
          >
            <ArrowRight className="h-5 w-5 ml-1" />
            <span>رجوع</span>
          </button>
          <h1 className="text-2xl font-bold text-secondary-dark mr-4">تعليمات الاختبار</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-secondary-dark">الجزء الأول: الاستبيان</h2>
          <ul className="space-y-3 text-gray-700 mb-6">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>سيتم عرض 10 أسئلة متعددة الاختيارات</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>لكل سؤال، اختر إجابة من 1 إلى 10 حسب ما ينطبق عليك</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>1 تعني "لا ينطبق أبداً" و 10 تعني "ينطبق دائماً"</span>
            </li>
          </ul>

          <h2 className="text-xl font-semibold mb-4 text-secondary-dark">الجزء الثاني: اختبار القراءة</h2>
          <ul className="space-y-3 text-gray-700 mb-6">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>سيُطلب منك قراءة نص قصير بصوت عالٍ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>سيتم تسجيل وجهك أثناء القراءة لتتبع حركة عينيك</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>حاول القراءة بشكل طبيعي كما تقرأ عادةً</span>
            </li>
          </ul>

          <div className="bg-secondary/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-secondary-dark">ملاحظات مهمة:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                <span>تأكد من وجود إضاءة جيدة في المكان</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                <span>اجلس في وضعية مريحة أمام الكاميرا</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full mt-2"></span>
                <span>سيتم حفظ التسجيل بشكل آمن وسري</span>
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => navigate('/questions')}
          className="w-full max-w-md bg-primary text-white rounded-lg py-3 px-4 font-medium hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all mx-auto block"
        >
          متابعة
        </button>
      </div>
    </div>
  );
}