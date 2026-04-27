import React from 'react';

interface InfoAboutADHDProps {
  isActive: boolean;
}

export default function InfoAboutADHD({ isActive }: InfoAboutADHDProps) {
  if (!isActive) return null;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-xl font-semibold mb-4 text-secondary-dark text-center">معلومات عن اضطراب فرط الحركة وتشتت الانتباه</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-lg mb-2 text-secondary-dark">ما هو اضطراب فرط الحركة وتشتت الانتباه؟</h3>
          <p className="text-gray-700 leading-relaxed">
            اضطراب فرط الحركة وتشتت الانتباه (ADHD) هو اضطراب عصبي نمائي يتميز بأنماط مستمرة من عدم الانتباه و/أو فرط النشاط والاندفاع التي تتداخل مع الأداء اليومي والتطور.
          </p>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-2 text-secondary-dark">الأعراض الرئيسية:</h3>
          <div className="space-y-2">
            <div>
              <h4 className="font-semibold">عدم الانتباه:</h4>
              <ul className="space-y-1 text-gray-700 list-disc list-inside pr-4">
                <li>صعوبة في التركيز على المهام</li>
                <li>عدم الانتباه للتفاصيل وارتكاب أخطاء ناتجة عن الإهمال</li>
                <li>صعوبة في تنظيم المهام والأنشطة</li>
                <li>تجنب المهام التي تتطلب جهدًا عقليًا مستدامًا</li>
                <li>فقدان الأشياء بشكل متكرر</li>
                <li>سهولة التشتت والنسيان في الأنشطة اليومية</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold">فرط النشاط والاندفاع:</h4>
              <ul className="space-y-1 text-gray-700 list-disc list-inside pr-4">
                <li>التململ أو النقر باليدين أو القدمين</li>
                <li>صعوبة في البقاء جالسًا لفترات طويلة</li>
                <li>الشعور بالقلق أو عدم الاستقرار الداخلي</li>
                <li>صعوبة في اللعب أو المشاركة في الأنشطة بهدوء</li>
                <li>التحدث بشكل مفرط</li>
                <li>مقاطعة الآخرين أو التطفل عليهم</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-2 text-secondary-dark">طرق التعامل مع ADHD:</h3>
          <ul className="space-y-1 text-gray-700 list-disc list-inside pr-4">
            <li>تنظيم جدول يومي ثابت والالتزام به قدر الإمكان.</li>
            <li>تقسيم المهام الكبيرة إلى خطوات صغيرة يمكن إدارتها بسهولة.</li>
            <li>استخدام تقنيات إدارة الوقت مثل تقنية بومودورو (العمل لمدة 25 دقيقة ثم أخذ استراحة قصيرة).</li>
            <li>الحد من المشتتات في بيئة العمل أو الدراسة.</li>
            <li>ممارسة التمارين الرياضية بانتظام لتحسين التركيز وتقليل فرط النشاط.</li>
            <li>تطبيق تقنيات التأمل والتنفس العميق للمساعدة في تهدئة العقل.</li>
            <li>الحصول على قسط كافٍ من النوم والحفاظ على نظام غذائي متوازن.</li>
            <li>استشارة أخصائي نفسي أو طبيب مختص للحصول على برنامج علاجي مناسب.</li>
          </ul>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2 text-secondary-dark">المساعدة المهنية:</h3>
          <p className="text-gray-700 leading-relaxed">
            إذا كنت تشك في أنك تعاني من ADHD، من المهم استشارة متخصص في الصحة النفسية للحصول على تشخيص دقيق. يمكن أن يشمل العلاج الفعال ما يلي:
          </p>
          <ul className="space-y-1 text-gray-700 list-disc list-inside pr-4 mt-2">
            <li>العلاج الدوائي تحت إشراف طبي</li>
            <li>العلاج السلوكي المعرفي</li>
            <li>التدريب على المهارات الاجتماعية</li>
            <li>الاستشارات التربوية والأسرية</li>
            <li>تعديلات في بيئة العمل أو الدراسة</li>
          </ul>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>ملاحظة: هذه المعلومات عامة ولا تغني عن استشارة المختصين. إذا كنت تعاني من أي أعراض، يرجى التواصل مع طبيب مختص.</p>
        </div>
      </div>
    </div>
  );
} 