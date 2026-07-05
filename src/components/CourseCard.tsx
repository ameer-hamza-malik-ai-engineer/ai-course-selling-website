import { Star, Clock, BookOpen, CheckCircle2 } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  key?: any;
  course: Course;
  isOwned: boolean;
  onSelect: (course: Course) => void;
  onBuy: (course: Course) => void | Promise<void>;
}

export default function CourseCard({ course, isOwned, onSelect, onBuy }: CourseCardProps) {
  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#111111] transition-all duration-300"
      id={`course-card-${course.id}`}
    >
      {/* Background glow behind card on hover */}
      <div className="absolute -inset-px bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-0 group-hover:opacity-15 transition duration-500 -z-10"></div>
      
      {/* Course Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
        <img
          src={course.image}
          alt={course.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Course Badge */}
        {course.badge && (
          <span className="absolute top-3 left-3 rounded bg-indigo-500/20 px-2.5 py-1 text-[9px] font-bold tracking-wider text-indigo-400 uppercase shadow-md backdrop-blur-md border border-indigo-500/10">
            {course.badge}
          </span>
        )}

        {/* Owned status overlay */}
        {isOwned && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-400 shadow-xl">
              <CheckCircle2 className="h-4 w-4" />
              Syllabus Unlocked
            </span>
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Category */}
          <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
            {course.category}
          </span>
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-white">{course.rating}</span>
            <span className="text-[10px] text-white/40">({course.reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-base font-bold text-white line-clamp-1 mb-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-white/50 line-clamp-2 mb-5 leading-relaxed">
          {course.description}
        </p>

        {/* Course details metadata */}
        <div className="mt-auto flex items-center gap-4 border-t border-white/5 pt-4 mb-5 text-[11px] font-medium text-white/40">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-white/30" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5 text-white/30" />
            {course.lessonsCount} lessons
          </span>
          <span className="rounded bg-white/5 px-2 py-0.5 text-[9px] font-bold text-white/60 uppercase border border-white/5">
            {course.level}
          </span>
        </div>

        {/* Purchase bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-[11px] text-white/40 line-through">
              ${course.originalPrice}
            </span>
            <span className="text-xl font-black text-white">
              ${course.price}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onSelect(course)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/80 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              Curriculum
            </button>
            
            {isOwned ? (
              <button
                onClick={() => onSelect(course)}
                className="rounded-lg bg-emerald-500/15 border border-emerald-500/20 px-3 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/25 transition-all cursor-pointer"
              >
                Study LMS
              </button>
            ) : (
              <button
                onClick={() => onBuy(course)}
                className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500 hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Buy Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
