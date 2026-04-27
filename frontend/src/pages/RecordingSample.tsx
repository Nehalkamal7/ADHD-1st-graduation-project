import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import Distractions from '../components/Distractions';

const sampleText = `كان يا ما كان في قديم الزمان أرنب صغير يعيش في جحر دافئ قرب الغابة. وفي كل صباح، كان الأرنب يخرج للبحث عن الجزر الطازج والخس الأخضر لتناول الفطور. كان الأرنب يحب مشاهدة شروق الشمس والشعور بندى الصباح على أقدامه الناعمة.`;

const API_URL = import.meta.env.VITE_API_URL;

interface AssessmentResult {
  questionnaire_results: {
    raw_score: number;
    percentage: number;
    likelihood: string;
  };
  video_results: {
    prediction: string;
    probability: number;
  };
  final_score: number;
  final_likelihood: string;
}

export default function RecordingSample() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const [mediaRecorderSupported, setMediaRecorderSupported] = useState(true);
  const [showADHDTips, setShowADHDTips] = useState(false);

  const updateButtonText = (text: string) => {
    if (buttonRef.current) {
      buttonRef.current.textContent = text;
      // Force a reflow to ensure iOS updates the text
      buttonRef.current.style.display = 'none';
      buttonRef.current.offsetHeight;
      buttonRef.current.style.display = '';
    }
  };

  useEffect(() => {
    const checkMediaRecorderSupport = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // Check if MediaRecorder is supported
        const supported = typeof MediaRecorder !== 'undefined';
        setMediaRecorderSupported(supported);
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Error checking MediaRecorder support:', error);
        setMediaRecorderSupported(false);
      }
    };
    
    checkMediaRecorderSupport();
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' }, 
          audio: true 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // For iOS, we need to play the video right after getting user media
          if (isIOS) {
            videoRef.current.play().catch(err => {
              console.error('Error playing video:', err);
            });
          }
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        alert('الرجاء السماح بالوصول إلى الكاميرا للتسجيل');
      }
    };
    
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isIOS]);

  const startRecording = () => {
    console.log('Starting recording...');
    if (!videoRef.current?.srcObject) {
      console.error('No video source available');
      return;
    }

    try {
      chunksRef.current = [];
      const stream = videoRef.current.srcObject as MediaStream;
      
      // For iOS, ensure tracks are enabled
      stream.getTracks().forEach(track => {
        track.enabled = true;
      });

      // Configure MediaRecorder with options that work well on iOS
      const options = { mimeType: 'video/webm;codecs=vp8,opus' };
      
      // Check if the mime type is supported, fallback to default if not
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log('Fallback to default mime type');
        mediaRecorderRef.current = new MediaRecorder(stream);
      } else {
        mediaRecorderRef.current = new MediaRecorder(stream, options);
      }
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        console.log('Data available, size:', e.data.size);
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      // Request data every 1 second (helps with iOS)
      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      console.log('Recording started successfully');
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('حدث خطأ أثناء بدء التسجيل. الرجاء المحاولة مرة أخرى.');
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording...');
    if (!mediaRecorderRef.current || !isRecording) {
      console.error('No active recording to stop');
      return;
    }

    return new Promise<void>((resolve) => {
      mediaRecorderRef.current!.onstop = async () => {
        console.log('Recording stopped, chunks:', chunksRef.current.length);
        
        if (chunksRef.current.length === 0) {
          console.error('No data recorded');
          alert('لم يتم تسجيل أي بيانات. الرجاء المحاولة مرة أخرى.');
          setIsRecording(false);
          resolve();
          return;
        }
        
        const answers = JSON.parse(sessionStorage.getItem('questionAnswers') || '[]');
        const totalScore = answers.reduce((sum: number, score: number) => sum + score, 0);

        const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('questionnaire_score', totalScore.toString());
        formData.append('video', videoBlob, 'recording.webm');

        setIsProcessing(true);

        try {
          const response = await axios.post(API_URL, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          setResult(response.data);
        } catch (error) {
          console.error('Error processing assessment:', error);
          alert('حدث خطأ أثناء معالجة التقييم. الرجاء المحاولة مرة أخرى.');
        } finally {
          setIsProcessing(false);
        }

        resolve();
      };

      // Request data one last time before stopping
      if (mediaRecorderRef.current!.state === 'recording') {
        mediaRecorderRef.current!.requestData();
        mediaRecorderRef.current!.stop();
      }
      
      setIsRecording(false);
      console.log('Recording stopped successfully');
    });
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] p-4">
      <Distractions isActive={isRecording} />
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/questions')}
            className="flex items-center text-secondary hover:text-secondary-dark transition-colors"
          >
            <ArrowRight className="h-5 w-5 ml-1" />
            <span>رجوع</span>
          </button>
          <h1 className="text-2xl font-bold text-secondary-dark mr-4">عينة القراءة</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-secondary/5 rounded-tr-full" />
          <h2 className="text-xl font-semibold mb-4 text-secondary-dark">الرجاء قراءة النص التالي:</h2>
          <p className="text-gray-700 leading-relaxed text-right relative z-10 text-lg md:text-2xl">{sampleText}</p>
        </div>

        <div className="flex flex-col items-center">
          {!mediaRecorderSupported && (
            <div className="w-full max-w-md mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-medium text-center">
                متصفحك لا يدعم تسجيل الفيديو. الرجاء استخدام متصفح آخر مثل Chrome أو Firefox أو Safari.
              </p>
            </div>
          )}
          
          {mediaRecorderSupported && !isProcessing && !result && (
            <div className="flex gap-4 w-full max-w-md mb-4">
              <button
                onClick={startRecording}
                disabled={isRecording}
                className="flex-1 text-white rounded-lg py-4 px-6 font-medium bg-primary"
                style={{
                  opacity: isRecording ? 0.5 : 1,
                  pointerEvents: isRecording ? 'none' : 'auto',
                  minHeight: '50px'
                }}
              >
                بدء التسجيل
              </button>
              
              <button
                onClick={stopRecording}
                disabled={!isRecording}
                className="flex-1 text-white rounded-lg py-4 px-6 font-medium bg-red-500"
                style={{
                  opacity: !isRecording ? 0.5 : 1,
                  pointerEvents: !isRecording ? 'none' : 'auto',
                  minHeight: '50px'
                }}
              >
                إيقاف التسجيل
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
              <p className="text-gray-600">جاري معالجة التقييم...</p>
            </div>
          )}

          {result && (
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">نتائج التقييم</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-1">نتيجة الاستبيان:</p>
                  <p>النسبة: {result.questionnaire_results.percentage}%</p>
                  <p>الاحتمالية: {result.questionnaire_results.likelihood}</p>
                </div>
                
                <div>
                  <p className="font-semibold mb-1">نتيجة تحليل العين:</p>
                  <p>التشخيص: {result.video_results.prediction}</p>
                  <p>نسبة الاحتمال: {(result.video_results.probability * 100).toFixed(2)}%</p>
                </div>
                
                <div className="border-t pt-4">
                  <p className="font-semibold mb-1">النتيجة النهائية:</p>
                  <p>الدرجة الكلية: {result.final_score}%</p>
                  <p>التقييم النهائي: {result.final_likelihood}</p>
                </div>
              </div>
              
              {result.video_results.prediction === 'ADHD' && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => setShowADHDTips(prev => !prev)}
                    className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {showADHDTips ? 'إخفاء النصائح' : 'عرض نصائح للتعامل مع فرط الحركة وتشتت الانتباه'}
                  </button>
                </div>
              )}
              
              {showADHDTips && result.video_results.prediction === 'ADHD' && (
                <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3">نصائح وإرشادات للتعامل مع اضطراب فرط الحركة وتشتت الانتباه:</h4>
                  <ul className="space-y-2 text-gray-700 list-disc list-inside">
                    <li>تنظيم جدول يومي ثابت والالتزام به قدر الإمكان.</li>
                    <li>تقسيم المهام الكبيرة إلى خطوات صغيرة يمكن إدارتها بسهولة.</li>
                    <li>استخدام تقنيات إدارة الوقت مثل تقنية بومودورو (العمل لمدة 25 دقيقة ثم أخذ استراحة قصيرة).</li>
                    <li>الحد من المشتتات في بيئة العمل أو الدراسة.</li>
                    <li>ممارسة التمارين الرياضية بانتظام لتحسين التركيز وتقليل فرط النشاط.</li>
                    <li>تطبيق تقنيات التأمل والتنفس العميق للمساعدة في تهدئة العقل.</li>
                    <li>الحصول على قسط كافٍ من النوم والحفاظ على نظام غذائي متوازن.</li>
                    <li>استشارة أخصائي نفسي أو طبيب مختص للحصول على برنامج علاجي مناسب.</li>
                    <li>الانضمام إلى مجموعات الدعم للتواصل مع آخرين يواجهون نفس التحديات.</li>
                    <li>استخدام تطبيقات وأدوات رقمية مصممة خصيصًا للمساعدة في إدارة أعراض اضطراب فرط الحركة وتشتت الانتباه.</li>
                  </ul>
                  <p className="mt-4 text-sm text-gray-500">ملاحظة: هذه النصائح عامة وقد تحتاج إلى تعديل حسب الاحتياجات الفردية. يُنصح دائمًا بمتابعة الحالة مع المختصين.</p>
                </div>
              )}
            </div>
          )}

          <div className="relative w-full max-w-[240px] mx-auto mt-6">
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