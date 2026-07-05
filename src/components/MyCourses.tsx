import { useState } from 'react';
import { BookOpen, CheckCircle2, Circle, Play, ArrowLeft, ArrowRight, Video, FileText, HelpCircle, Trophy, Check } from 'lucide-react';
import { Course, Lesson, UserEnrollment } from '../types';

interface MyCoursesProps {
  purchasedCourses: Course[];
  enrollments: { [courseId: string]: UserEnrollment };
  updateEnrollment: (courseId: string, completedLessonIds: string[], lastActiveLessonId?: string) => void;
}

export default function MyCourses({ purchasedCourses, enrollments, updateEnrollment }: MyCoursesProps) {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  
  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIdx: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleStartStudying = (course: Course) => {
    setActiveCourse(course);
    setActiveLesson(course.modules[0]?.lessons[0] || null);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  if (purchasedCourses.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center animate-fade-in">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
          <BookOpen className="h-8 w-8" />
        </div>
        <h2 className="font-display text-xl font-bold text-white mb-2">No active courses unlocked yet</h2>
        <p className="text-white/50 text-xs max-w-md mx-auto mb-6">
          Explore our premium catalogs, configure your Stripe credentials or trigger our high-fidelity checkout sandbox to instantly buy and learn!
        </p>
      </div>
    );
  }

  // Active Course Viewer (LMS Player)
  if (activeCourse && activeLesson) {
    const enrollment = enrollments[activeCourse.id] || {
      courseId: activeCourse.id,
      unlockedAt: new Date().toISOString(),
      completedLessons: [],
      progress: 0,
    };

    const isLessonCompleted = enrollment.completedLessons.includes(activeLesson.id);

    const handleLessonToggle = (lessonId: string) => {
      let updatedList = [...enrollment.completedLessons];
      if (updatedList.includes(lessonId)) {
        updatedList = updatedList.filter(id => id !== lessonId);
      } else {
        updatedList.push(lessonId);
      }
      
      updateEnrollment(activeCourse.id, updatedList, activeLesson.id);
    };

    const handleSelectLesson = (lesson: Lesson) => {
      setActiveLesson(lesson);
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);
    };

    // Find next lesson to study
    const allLessonsInCourse: Lesson[] = activeCourse.modules.flatMap(m => m.lessons);
    const activeLessonIndex = allLessonsInCourse.findIndex(l => l.id === activeLesson.id);
    const nextLesson = activeLessonIndex < allLessonsInCourse.length - 1 ? allLessonsInCourse[activeLessonIndex + 1] : null;

    // Quiz evaluation
    const handleQuizOptionSelect = (qIdx: number, oIdx: number) => {
      if (quizSubmitted) return;
      setSelectedAnswers({ ...selectedAnswers, [qIdx]: oIdx });
    };

    const handleSubmitQuiz = () => {
      if (!activeLesson.quizQuestions) return;
      let correctCount = 0;
      activeLesson.quizQuestions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswer) {
          correctCount++;
        }
      });
      
      setQuizScore(correctCount);
      setQuizSubmitted(true);

      // Automatically complete quiz lesson if score is perfect or high
      if (correctCount === activeLesson.quizQuestions.length) {
        if (!enrollment.completedLessons.includes(activeLesson.id)) {
          handleLessonToggle(activeLesson.id);
        }
      }
    };

    return (
      <div className="fixed inset-0 z-40 flex flex-col bg-zinc-900 text-zinc-100 overflow-hidden" id="lms-classroom-root">
        {/* LMS Header */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setActiveCourse(null);
                setActiveLesson(null);
              }}
              className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Exit Dashboard
            </button>
            <div className="h-6 w-px bg-zinc-800" />
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none">Aura LMS Player</span>
              <p className="text-sm font-bold text-white leading-tight line-clamp-1">{activeCourse.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress bar */}
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-zinc-400">{Math.round(enrollment.progress)}% COMPLETED</span>
              <div className="h-2 w-32 rounded-full bg-zinc-800 overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300" 
                  style={{ width: `${enrollment.progress}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* LMS Dashboard Columns */}
        <div className="flex flex-1 overflow-hidden">
          {/* Syllabus Sidebar */}
          <aside className="w-80 border-r border-zinc-800 bg-zinc-950 flex flex-col overflow-y-auto hidden md:flex">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Course Syllabus</h3>
            </div>
            <div className="flex-1 divide-y divide-zinc-900">
              {activeCourse.modules.map((mod) => (
                <div key={mod.id} className="p-2">
                  <div className="px-3 py-2">
                    <p className="text-[11px] font-bold text-zinc-500 uppercase">{mod.title}</p>
                  </div>
                  <div className="space-y-0.5">
                    {mod.lessons.map((les) => {
                      const completed = enrollment.completedLessons.includes(les.id);
                      const isCurrentlyActive = les.id === activeLesson.id;

                      return (
                        <button
                          key={les.id}
                          onClick={() => handleSelectLesson(les)}
                          className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-all ${
                            isCurrentlyActive 
                              ? 'bg-indigo-600/10 border border-indigo-500/20 text-white font-semibold' 
                              : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {completed ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 text-zinc-600 flex-shrink-0" />
                            )}
                            {les.type === 'video' ? (
                              <Video className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                            ) : les.type === 'article' ? (
                              <FileText className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                            ) : (
                              <HelpCircle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                            )}
                            <span className="line-clamp-1">{les.title}</span>
                          </div>
                          <span className="font-mono text-[10px] text-zinc-500 ml-2">{les.duration}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Core Lesson Player Container */}
          <main className="flex-1 bg-zinc-900 flex flex-col overflow-y-auto">
            {/* Visual Classroom Frame */}
            <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6">
              {/* Media Player or Reader Frame */}
              {activeLesson.type === 'video' ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-2xl flex items-center justify-center">
                  {/* Using standard reliable sample video */}
                  <video 
                    src={activeLesson.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'} 
                    controls 
                    className="w-full h-full object-contain"
                    poster={activeCourse.image}
                  />
                </div>
              ) : activeLesson.type === 'article' ? (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 shadow-2xl space-y-6">
                  <div className="prose prose-invert prose-sm max-w-none text-zinc-300 leading-relaxed font-sans">
                    {/* Render plain high-contrast text content cleanly */}
                    <div className="space-y-4">
                      {activeLesson.content?.split('\n\n').map((para, i) => {
                        if (para.startsWith('###')) {
                          return <h3 key={i} className="text-lg font-bold text-white border-b border-zinc-800 pb-2 mt-6 font-display">{para.replace('###', '').trim()}</h3>;
                        }
                        if (para.startsWith('####')) {
                          return <h4 key={i} className="text-base font-semibold text-indigo-400 mt-4">{para.replace('####', '').trim()}</h4>;
                        }
                        if (para.startsWith('-')) {
                          return (
                            <ul key={i} className="list-disc pl-5 space-y-1 text-zinc-300">
                              {para.split('\n').map((item, keyIdx) => (
                                <li key={keyIdx}>{item.replace('-', '').trim()}</li>
                              ))}
                            </ul>
                          );
                        }
                        if (para.startsWith('```')) {
                          return (
                            <pre key={i} className="bg-zinc-900 border border-zinc-800 text-indigo-300 rounded-lg p-4 font-mono text-xs overflow-x-auto my-4 whitespace-pre-wrap leading-tight">
                              {para.replace(/```typescript|```/g, '').trim()}
                            </pre>
                          );
                        }
                        return <p key={i}>{para}</p>;
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Interactive Quiz Component */
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 shadow-2xl space-y-6">
                  <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                    <Trophy className="h-6 w-6 text-amber-500" />
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">Interactive Lesson Quiz</h3>
                      <p className="text-xs text-zinc-400">Earn your completion badge by scoring 100% on this topic.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {activeLesson.quizQuestions?.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-3">
                        <p className="text-sm font-semibold text-zinc-200">
                          {qIdx + 1}. {q.question}
                        </p>
                        <div className="grid grid-cols-1 gap-2.5">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selectedAnswers[qIdx] === oIdx;
                            let btnStyle = 'border-zinc-800 hover:bg-zinc-900 text-zinc-300';
                            
                            if (isSelected) {
                              btnStyle = 'border-indigo-500 bg-indigo-500/10 text-white font-medium';
                            }
                            
                            if (quizSubmitted) {
                              if (oIdx === q.correctAnswer) {
                                btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
                              } else if (isSelected && selectedAnswers[qIdx] !== q.correctAnswer) {
                                btnStyle = 'border-rose-500 bg-rose-500/10 text-rose-400';
                              } else {
                                btnStyle = 'border-zinc-900 text-zinc-600 opacity-60';
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={quizSubmitted}
                                onClick={() => handleQuizOptionSelect(qIdx, oIdx)}
                                className={`flex items-center justify-between rounded-xl border p-3.5 text-xs text-left transition-all ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && oIdx === q.correctAnswer && (
                                  <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Submit / Results Board */}
                  <div className="border-t border-zinc-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      {quizSubmitted ? (
                        <p className="text-sm font-semibold">
                          Result:{' '}
                          <span className={quizScore === activeLesson.quizQuestions?.length ? 'text-emerald-400' : 'text-rose-400'}>
                            {quizScore}/{activeLesson.quizQuestions?.length} Correct Answers
                          </span>
                        </p>
                      ) : (
                        <p className="text-xs text-zinc-500 font-medium">Answer all questions to submit.</p>
                      )}
                    </div>

                    {!quizSubmitted ? (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(selectedAnswers).length < (activeLesson.quizQuestions?.length || 0)}
                        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50 transition-all shadow-lg"
                      >
                        Submit Quiz
                      </button>
                    ) : (
                      quizScore !== activeLesson.quizQuestions?.length && (
                        <button
                          onClick={() => {
                            setSelectedAnswers({});
                            setQuizSubmitted(false);
                            setQuizScore(null);
                          }}
                          className="rounded-xl border border-zinc-700 hover:bg-zinc-800 px-5 py-2.5 text-xs font-bold text-white transition-all"
                        >
                          Try Again
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Progress & Lesson Checklist Panel */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white font-display mb-1">Finished studying this unit?</h4>
                  <p className="text-xs text-zinc-400">Unlock your progress by checking the completion status.</p>
                </div>
                
                <button
                  onClick={() => handleLessonToggle(activeLesson.id)}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                    isLessonCompleted
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'border border-zinc-700 hover:bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {isLessonCompleted ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Completed! Click to Undo
                    </>
                  ) : (
                    <>
                      <Circle className="h-4 w-4" />
                      Mark Lesson Completed
                    </>
                  )}
                </button>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                  disabled={activeLessonIndex === 0}
                  onClick={() => handleSelectLesson(allLessonsInCourse[activeLessonIndex - 1])}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous Lesson
                </button>

                {nextLesson ? (
                  <button
                    onClick={() => handleSelectLesson(nextLesson)}
                    className="flex items-center gap-1.5 rounded-xl bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-xs font-bold text-white px-4 py-2"
                  >
                    Next Lesson <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="h-4 w-4" /> Course syllabus finished!
                  </span>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
      <div className="border-b border-white/5 pb-5">
        <h2 className="font-display text-xl font-bold text-white uppercase tracking-wider">My Unlocked Curriculums</h2>
        <p className="text-xs text-white/50 mt-1">Access and continue your premium lectures. Progress is saved automatically.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {purchasedCourses.map((course) => {
          const enrollment = enrollments[course.id] || { progress: 0 };
          return (
            <div 
              key={course.id} 
              className="flex border border-white/10 bg-[#111111] rounded-3xl overflow-hidden transition-all duration-300 hover:border-white/20"
            >
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-1/3 object-cover bg-zinc-900 hidden sm:block"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{course.category}</span>
                  <span className="text-xs font-semibold text-white/60 font-mono">{Math.round(enrollment.progress)}% completed</span>
                </div>
                <h3 className="text-sm font-bold text-white font-display line-clamp-1 mb-2">{course.title}</h3>
                
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-5">
                  <div 
                    className="h-full bg-indigo-500 transition-all" 
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-white/40 font-medium">{course.lessonsCount} lessons</span>
                  <button
                    id={`resume-course-${course.id}`}
                    onClick={() => handleStartStudying(course)}
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 transition-all cursor-pointer"
                  >
                    Start Studying
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
