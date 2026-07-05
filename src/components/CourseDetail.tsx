import { useState } from 'react';
import { X, Play, ShieldAlert, Award, Star, BookOpen, Check, ArrowRight, Video, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Course } from '../types';

interface CourseDetailProps {
  course: Course;
  isOwned: boolean;
  onClose: () => void;
  onBuy: (course: Course) => void;
  onStartLearning: (course: Course) => void;
}

export default function CourseDetail({ course, isOwned, onClose, onBuy, onStartLearning }: CourseDetailProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>(course.modules[0]?.id || null);

  const toggleModule = (id: string) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/50 backdrop-blur-sm flex items-center justify-end p-0 sm:p-4">
      <div 
        className="w-full max-w-2xl h-full sm:h-[90vh] bg-white rounded-none sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        id="course-detail-panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 bg-zinc-50">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase font-mono">{course.category}</span>
            <h2 className="font-display text-lg font-bold text-zinc-900 line-clamp-1">{course.title}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Banner */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
            <img 
              src={course.image} 
              alt={course.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {!isOwned && (
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent flex items-end p-5">
                <div className="text-white">
                  <span className="text-xs font-semibold text-indigo-300">LIFETIME ACCESS</span>
                  <p className="text-2xl font-black">${course.price} <span className="text-sm font-normal text-zinc-300 line-through">${course.originalPrice}</span></p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 mb-2 font-display">Overview</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">{course.longDescription}</p>
          </div>

          {/* What You'll Learn Outcomes */}
          <div className="bg-zinc-50 border border-zinc-200/60 rounded-xl p-5">
            <h3 className="text-sm font-bold text-zinc-900 mb-3.5 flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-indigo-500" />
              What you will master
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {course.outcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-700">
                  <span className="mt-0.5 rounded-full bg-emerald-100 p-0.5 text-emerald-600 flex-shrink-0">
                    <Check className="h-3 w-3" />
                  </span>
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-zinc-900 font-display">Course Curriculum</h3>
              <span className="text-xs text-zinc-500 font-medium">{course.lessonsCount} syllabus lectures</span>
            </div>

            <div className="space-y-3">
              {course.modules.map((module) => (
                <div 
                  key={module.id} 
                  className="rounded-xl border border-zinc-200 overflow-hidden bg-white"
                >
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-zinc-50/50 hover:bg-zinc-50 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-zinc-400" />
                      <span className="text-xs font-semibold text-zinc-800">{module.title}</span>
                    </div>
                    {expandedModule === module.id ? (
                      <ChevronUp className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-zinc-400" />
                    )}
                  </button>

                  {expandedModule === module.id && (
                    <div className="divide-y divide-zinc-100 px-4 py-2 border-t border-zinc-150">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between py-2.5 text-xs">
                          <div className="flex items-center gap-2.5 text-zinc-700">
                            {lesson.type === 'video' ? (
                              <Video className="h-4 w-4 text-indigo-500" />
                            ) : (
                              <FileText className="h-4 w-4 text-indigo-500" />
                            )}
                            <span className="font-medium">{lesson.title}</span>
                            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold text-zinc-500 capitalize">
                              {lesson.type}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-zinc-400">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructor Bio */}
          <div className="border-t border-zinc-200 pt-6">
            <h3 className="text-sm font-bold text-zinc-900 mb-3.5 font-display">Your Instructor</h3>
            <div className="flex gap-4">
              <img 
                src={course.instructor.avatar} 
                alt={course.instructor.name} 
                className="h-14 w-14 rounded-full object-cover border border-zinc-200 flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1 text-xs text-zinc-600">
                <p className="font-bold text-zinc-950 text-sm leading-none">{course.instructor.name}</p>
                <p className="text-zinc-500 font-medium">{course.instructor.role}</p>
                <div className="flex items-center gap-3 py-1">
                  <span className="flex items-center gap-0.5 font-semibold text-zinc-900">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    {course.instructor.rating} rating
                  </span>
                  <span>•</span>
                  <span>{course.instructor.studentsCount.toLocaleString()} Students</span>
                </div>
                <p className="leading-relaxed text-zinc-500 pt-1">{course.instructor.bio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-zinc-200 px-6 py-4 bg-zinc-50 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Total Pricing</p>
            <p className="text-xl font-extrabold text-zinc-950 leading-none">${course.price}</p>
          </div>

          {isOwned ? (
            <button
              onClick={() => onStartLearning(course)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10"
            >
              Start Learning Now
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => onBuy(course)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10 active:scale-95"
            >
              Unlock course with Stripe
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
