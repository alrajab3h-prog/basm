/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Moon, 
  BookOpen, 
  Heart, 
  Scroll, 
  Lightbulb, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Calendar,
  Clock,
  Wind
} from 'lucide-react';
import { getDailyContent } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DailyContent {
  introduction: {
    verse: string;
    reflection: string;
  };
  mihrab: {
    dua_passage: string;
    reflection: string;
  };
  sira: {
    title: string;
    story: string;
    modern_application: string;
  };
  fiqh: {
    question: string;
    answer: string;
  };
  zad: string;
  closing_prayer: string;
}

export default function App() {
  const [day, setDay] = useState(1);
  const [content, setContent] = useState<DailyContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getDailyContent(day);
        setContent(data);
      } catch (err) {
        console.error(err);
        setError('عذراً، حدث خطأ أثناء تحميل المحتوى. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [day]);

  const nextDay = () => day < 30 && setDay(day + 1);
  const prevDay = () => day > 1 && setDay(day - 1);

  return (
    <div className="min-h-screen chiaroscuro-bg relative overflow-x-hidden">
      {/* Laser Beams (Cinematic Lighting) */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="laser-beam left-1/4" />
        <div className="laser-beam left-1/2" />
        <div className="laser-beam left-3/4" />
      </div>

      {/* Feature Wall (Background Pattern) */}
      <div className="fixed inset-0 arabesque-pattern opacity-10 pointer-events-none" />

      {/* Header: The Set Entrance */}
      <header className="relative h-[40vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10"
        >
          <h1 className="font-amiri text-7xl md:text-8xl mb-4 text-copper drop-shadow-[0_0_15px_rgba(184,115,51,0.5)]">مائدة النور</h1>
          <div className="flex items-center justify-center gap-4 text-sand-beige/60 uppercase tracking-[0.3em] text-xs font-bold">
            <div className="h-px w-12 bg-copper/40" />
            برنامج رمضاني بروحية أهل البيت (ع)
            <div className="h-px w-12 bg-copper/40" />
          </div>
        </motion.div>
        
        {/* Day Selector: The Marble Hub */}
        <div className="absolute bottom-0 translate-y-1/2 z-30">
          <div className="marble-surface rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] px-8 py-4 flex items-center gap-8 border-4 border-copper/30 copper-glow">
            <button 
              onClick={prevDay} 
              disabled={day === 1}
              className="p-3 hover:bg-copper/10 rounded-full transition-all disabled:opacity-20 group"
            >
              <ChevronRight className="w-8 h-8 text-deep-teal group-hover:scale-110 transition-transform" />
            </button>
            <div className="flex flex-col items-center min-w-[140px]">
              <span className="text-xs text-copper font-bold uppercase tracking-widest mb-1">المجلس</span>
              <span className="text-3xl font-amiri font-bold text-deep-teal">{day} رمضان</span>
            </div>
            <button 
              onClick={nextDay} 
              disabled={day === 30}
              className="p-3 hover:bg-copper/10 rounded-full transition-all disabled:opacity-20 group"
            >
              <ChevronLeft className="w-8 h-8 text-deep-teal group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-32 pb-32">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-copper/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-copper rounded-full animate-spin" />
                <Moon className="absolute inset-0 m-auto w-8 h-8 text-copper animate-pulse" />
              </div>
              <p className="mt-8 text-copper font-amiri text-2xl tracking-widest">جاري إيقاد شموع المائدة...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              className="text-center py-20 velvet-card border-red-500/30"
            >
              <p className="text-red-400 mb-6 text-xl">{error}</p>
              <button 
                onClick={() => setDay(day)}
                className="px-10 py-3 bg-copper text-deep-teal font-bold rounded-full hover:bg-burnt-orange transition-colors"
              >
                إعادة المحاولة
              </button>
            </motion.div>
          ) : content && (
            <motion.div 
              key={day}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-20"
            >
              {/* Introduction: The Spotlight Verse */}
              <section className="text-center space-y-8 relative">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-block p-6 rounded-full bg-copper/10 copper-glow mb-4"
                >
                  <Sparkles className="w-10 h-10 text-copper" />
                </motion.div>
                <h2 className="font-amiri text-5xl md:text-6xl text-sand-beige leading-tight drop-shadow-lg">
                  "{content.introduction.verse}"
                </h2>
                <p className="text-xl text-sand-beige/70 leading-relaxed max-w-3xl mx-auto font-light">
                  {content.introduction.reflection}
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Mihrab al-Layla: The LED Screen Effect */}
                <div className="md:col-span-7 velvet-card p-10 space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-copper to-transparent opacity-50" />
                  <div className="flex items-center gap-4 text-copper mb-4">
                    <Moon className="w-8 h-8" />
                    <h3 className="font-amiri text-3xl tracking-wide">محراب الليلة</h3>
                  </div>
                  <div className="bg-deep-teal/60 p-8 rounded-2xl border-r-4 border-copper copper-glow italic font-amiri text-2xl leading-relaxed text-sand-beige/90">
                    {content.mihrab.dua_passage}
                  </div>
                  <p className="text-sand-beige/60 text-lg leading-relaxed font-light">
                    {content.mihrab.reflection}
                  </p>
                </div>

                {/* Zad al-Sa'im: The Incense Burner Tip */}
                <div className="md:col-span-5 velvet-card p-10 space-y-6 bg-gradient-to-br from-burnt-orange/20 to-copper/10 border-copper/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-copper mb-6">
                      <Wind className="w-8 h-8 animate-pulse" />
                      <h3 className="font-amiri text-3xl">زاد الصائم</h3>
                    </div>
                    <p className="text-xl leading-relaxed text-sand-beige font-medium">
                      {content.zad}
                    </p>
                  </div>
                  <div className="pt-8 border-t border-copper/20 flex items-center justify-between">
                    <span className="text-xs text-copper font-bold uppercase tracking-widest">نصيحة صحية</span>
                    <div className="w-12 h-1 bg-copper/30 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Sira wa Mawqif: The Feature Wall Story */}
              <section className="velvet-card p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full arabesque-pattern opacity-5 pointer-events-none" />
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4 text-copper">
                    <Heart className="w-10 h-10" />
                    <h3 className="font-amiri text-4xl">سيرة وموقف: {content.sira.title}</h3>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-2xl leading-relaxed text-sand-beige/90 font-amiri">
                      {content.sira.story}
                    </p>
                  </div>
                  <div className="bg-copper/10 p-8 rounded-3xl border-l-8 border-copper copper-glow">
                    <h4 className="font-bold text-copper mb-4 flex items-center gap-3 text-lg">
                      <Lightbulb className="w-6 h-6" />
                      رؤية معاصرة (القرن الـ21)
                    </h4>
                    <p className="text-sand-beige/80 text-lg leading-relaxed">
                      {content.sira.modern_application}
                    </p>
                  </div>
                </div>
              </section>

              {/* Fiqh & Manuscript: The Floating Shelves */}
              <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-8 velvet-card p-10 space-y-8">
                  <div className="flex items-center gap-4 text-copper">
                    <BookOpen className="w-8 h-8" />
                    <h3 className="font-amiri text-3xl">فقه الحياة</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="text-2xl font-bold text-sand-beige border-b border-copper/20 pb-4">
                      {content.fiqh.question}
                    </div>
                    <div className="text-xl text-sand-beige/70 leading-relaxed bg-deep-teal/40 p-6 rounded-2xl border border-copper/10">
                      {content.fiqh.answer}
                    </div>
                  </div>
                </div>

                {/* Manuscript: The Floating Visual */}
                <div className="md:col-span-4 velvet-card p-8 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-2 border-copper/30 group">
                  <div className="relative">
                    <Scroll className="w-12 h-12 text-copper floating-calligraphy mb-4" />
                    <div className="absolute -inset-4 bg-copper/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-amiri text-2xl text-copper">تراث المخطوطات</h3>
                  <div className="w-full aspect-[3/4] rounded-2xl bg-[url('https://picsum.photos/seed/manuscript/600/800')] bg-cover bg-center copper-glow grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-teal via-transparent to-transparent opacity-60" />
                  </div>
                  <p className="text-xs text-sand-beige/40 uppercase tracking-widest">مخطوطة نادرة من القرن الرابع</p>
                </div>
              </section>

              {/* Closing Prayer: The Final Spotlight */}
              <footer className="text-center py-20 space-y-10 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-copper to-transparent" />
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="font-amiri text-4xl text-copper italic drop-shadow-[0_0_10px_rgba(184,115,51,0.3)] max-w-2xl mx-auto leading-loose"
                >
                  {content.closing_prayer}
                </motion.p>
                <div className="flex flex-col items-center gap-4">
                  <div className="h-px w-48 bg-copper/20" />
                  <p className="text-sm text-sand-beige/40 font-bold tracking-[0.5em] uppercase">تقبل الله صيامكم وقيامكم</p>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar: The Velvet Rail */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-velvet-teal/80 backdrop-blur-xl text-sand-beige px-10 py-5 rounded-full shadow-[0_25px_50px_rgba(0,0,0,0.6)] flex items-center gap-16 z-50 border border-copper/30 copper-glow">
        <button className="flex flex-col items-center gap-2 group transition-all">
          <Calendar className="w-6 h-6 text-sand-beige/40 group-hover:text-copper transition-colors" />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100">التقويم</span>
        </button>
        <button className="relative">
          <div className="absolute -inset-4 bg-copper/20 blur-xl rounded-full animate-pulse" />
          <div className="relative p-4 bg-copper rounded-full -mt-14 shadow-2xl border-4 border-deep-teal group hover:scale-110 transition-transform">
            <Moon className="w-8 h-8 text-deep-teal" />
          </div>
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-[10px] font-bold uppercase tracking-widest text-copper">الرئيسية</span>
        </button>
        <button className="flex flex-col items-center gap-2 group transition-all">
          <Clock className="w-6 h-6 text-sand-beige/40 group-hover:text-copper transition-colors" />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100">المواقيت</span>
        </button>
      </nav>
    </div>
  );
}
