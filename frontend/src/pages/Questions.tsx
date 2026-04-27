import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const questions = [
  'أجد صعوبة في الانتباه للتفاصيل في المدرسة أو العمل',
  'أحرك يدي أو قدمي بشكل متكرر أو أتلوى في مقعدي',
  'أجد صعوبة في الاستماع عندما يتحدث شخص ما إلي مباشرة',
  'أترك مقعدي في المواقف التي يتوقع مني فيها البقاء جالساً',
  'لا أتبع التعليمات وأفشل في إنهاء الواجبات',
  'أجد صعوبة في تنظيم المهام والأنشطة',
  'أتجنب المهام التي تتطلب جهداً عقلياً مستمراً',
  'أفقد الأشياء الضرورية للمهام والأنشطة',
  'أنسى الأشياء في الأنشطة اليومية',
  'أجري وأتسلق في مواقف غير مناسبة',
  'أتحدث بشكل مفرط',
  'أجيب قبل اكتمال الأسئلة',
  'أجد صعوبة في انتظار دوري',
  'أقاطع الآخرين أو أتطفل عليهم',
  'أشعر بالتوتر والقلق معظم الوقت',
  'أجد صعوبة في التركيز على مهمة واحدة',
  'أشعر بالملل بسرعة',
  'أفقد أعصابي بسهولة',
  'أتصرف بدون تفكير في العواقب',
  'أشعر بالاندفاع في اتخاذ القرارات',
  'أجد صعوبة في البقاء منظماً',
  'أضيع الوقت في التفاصيل غير المهمة',
  'أنسى المواعيد والالتزامات',
  'أتشتت بسهولة بالأصوات والحركات',
  'أجد صعوبة في إنهاء ما بدأته',
  'أشعر بالتعب بسرعة عند القيام بالمهام',
  'أتجنب المهام التي تتطلب تركيزاً',
  'أفقد الأشياء بشكل متكرر',
  'أجد صعوبة في اتباع التعليمات المتعددة الخطوات',
  'أشعر بالحاجة للحركة المستمرة',
  'أتحدث كثيراً في المواقف غير المناسبة',
  'أقاطع الآخرين في المحادثات',
  'أجد صعوبة في الانتظار بهدوء',
  'أشعر بالتوتر عند الجلوس لفترات طويلة',
  'أجد صعوبة في التركيز أثناء القراءة',
  'أترك مهامي غير مكتملة',
  'أنسى ما كنت أريد قوله في المحادثات',
  'أشعر بالحاجة للحركة عند الجلوس',
  'أجد صعوبة في تنظيم وقتي',
  'أتجنب المهام التي تتطلب صبراً',
  'أشعر بالملل في المواقف الهادئة',
  'أتصرف باندفاع في المواقف الاجتماعية',
  'أجد صعوبة في الانتظار في الطوابير',
  'أشعر بالقلق عند الجلوس بهدوء',
  'أفقد تركيزي بسهولة في البيئات المزدحمة',
  'أجد صعوبة في إكمال المهام بدقة',
  'أشعر بالحاجة للحركة معظم الوقت',
  'أتسرع في الإجابة قبل فهم السؤال كاملاً'
];

const answerOptions = [
  { value: 0, label: 'مطلقاً' },
  { value: 1, label: 'بقدر محدود' },
  { value: 2, label: 'بقدر كبير' },
  { value: 3, label: 'بقدر كبير جداً' }
];

export default function Questions() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<number[]>(new Array(48).fill(-1));
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = () => {
    sessionStorage.setItem('questionAnswers', JSON.stringify(answers));
    navigate('/record-sample');
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/instructions')}
            className="flex items-center text-secondary hover:text-secondary-dark transition-colors"
          >
            <ArrowRight className="h-5 w-5 ml-1" />
            <span>رجوع</span>
          </button>
          <h1 className="text-2xl font-bold text-secondary-dark mr-4">الاستبيان</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-gray-600 mt-2">
              السؤال {currentQuestion + 1} من {questions.length}
            </p>
          </div>

          <h2 className="text-xl font-semibold mb-6 text-center">{questions[currentQuestion]}</h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {answerOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`p-4 rounded-lg text-lg font-medium transition-all ${
                  answers[currentQuestion] === option.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 hover:bg-primary/20'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {currentQuestion === questions.length - 1 && answers[currentQuestion] !== -1 && (
          <button
            onClick={handleSubmit}
            className="w-full max-w-md bg-primary text-white rounded-lg py-3 px-4 font-medium hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all mx-auto block"
          >
            متابعة لاختبار القراءة
          </button>
        )}
      </div>
    </div>
  );
}