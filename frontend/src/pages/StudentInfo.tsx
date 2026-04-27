import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function StudentInfo() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    fullName: '',
    school: '',
    grade: '',
  });
  const [ageError, setAgeError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate age before submission
    const age = parseInt(studentData.grade);
    if (isNaN(age) || age < 1 || age > 20) {
      setAgeError('الرجاء إدخال رقم بين 1 و 20');
      return;
    }
    
    sessionStorage.setItem('studentData', JSON.stringify(studentData));
    navigate('/questions');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'grade') {
      // Only allow numbers for age field
      if (value === '' || /^\d+$/.test(value)) {
        const numValue = value === '' ? '' : parseInt(value);
        
        if (value === '' || (numValue >= 1 && numValue <= 20)) {
          setStudentData(prev => ({ ...prev, [name]: value }));
          setAgeError('');
        } else {
          setAgeError('الرجاء إدخال رقم بين 1 و 20');
        }
      }
    } else {
      setStudentData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/instructions')}
            className="flex items-center text-secondary hover:text-secondary-dark transition-colors"
          >
            <ArrowRight className="h-5 w-5 ml-1" />
            <span>رجوع</span>
          </button>
          <h1 className="text-2xl font-bold text-secondary-dark mr-4">معلومات الطالب</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              الاسم الكامل
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={studentData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-secondary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-right bg-white/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              المدرسة
            </label>
            <input
              type="text"
              name="school"
              required
              value={studentData.school}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-secondary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-right bg-white/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              السن
            </label>
            <input
              type="number"
              name="grade"
              required
              min="1"
              max="20"
              value={studentData.grade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-secondary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-right bg-white/50"
            />
            {ageError && (
              <p className="text-red-500 text-sm mt-1">{ageError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white rounded-lg py-3 px-4 font-medium hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            متابعة للاستبيان
          </button>
        </form>
      </div>
    </div>
  );
}