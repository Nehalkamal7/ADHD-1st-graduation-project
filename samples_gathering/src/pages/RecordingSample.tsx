import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Distractions from '../components/Distractions';

const sampleText = `كان يا ما كان في قديم الزمان أرنب صغير يعيش في جحر دافئ قرب الغابة. وفي كل صباح، كان الأرنب يخرج للبحث عن الجزر الطازج والخس الأخضر لتناول الفطور. كان الأرنب يحب مشاهدة شروق الشمس والشعور بندى الصباح على أقدامه الناعمة.`;

export default function RecordingSample() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('studentData');
    if (!data) {
      navigate('/student-info');
      return;
    }
    setStudentData(JSON.parse(data));

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
        alert('الرجاء السماح بالوصول إلى الكاميرا للتسجيل');
      });

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, [navigate]);

  const startRecording = () => {
    if (!videoRef.current?.srcObject) return;

    const chunks: BlobPart[] = [];
    const mediaRecorder = new MediaRecorder(videoRef.current.srcObject as MediaStream, {
      mimeType: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
    });
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      const fileName = `${studentData.school}_${studentData.grade}_${studentData.fullName}.mp4`;
      a.href = url;
      a.download = fileName;
      a.click();

      URL.revokeObjectURL(url);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] p-4">
      <Distractions isActive={isRecording} />
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/student-info')}
            className="flex items-center text-secondary hover:text-secondary-dark transition-colors"
          >
            <ArrowRight className="h-5 w-5 ml-1" />
            <span>رجوع</span>
          </button>
          <h1 className="text-2xl font-bold text-secondary-dark mr-4">عينة القراءة</h1>
        </div>

        {/* Text Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-secondary/5 rounded-tr-full" />
          <h2 className="text-xl font-semibold mb-4 text-secondary-dark">الرجاء قراءة النص التالي:</h2>
          <p className="text-gray-700 leading-relaxed text-right relative z-10 text-lg md:text-2xl">{sampleText}</p>
        </div>

        {/* Recording Controls */}
        <div className="flex flex-col items-center">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="w-full max-w-md bg-primary text-white rounded-lg py-3 px-4 font-medium hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all mb-4"
            >
              بدء التسجيل
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="w-full max-w-md bg-red-500 text-white rounded-lg py-3 px-4 font-medium hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all mb-4"
            >
              إيقاف التسجيل
            </button>
          )}

          {/* Video Preview */}
          <div className="relative w-full max-w-[240px] mx-auto">
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 rounded-lg transform rotate-12" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-secondary/20 rounded-lg transform -rotate-12" />
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-video rounded-lg bg-black relative shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}