import React, { useState } from 'react';
import { PlusCircle, ShieldAlert, CheckCircle, Sparkles } from 'lucide-react';

interface CreatorPanelProps {
  onCourseCreated: (course: any) => void;
}

export default function CreatorPanel({ onCourseCreated }: CreatorPanelProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Development');
  const [price, setPrice] = useState('79');
  const [level, setLevel] = useState('All Levels');
  const [instructorName, setInstructorName] = useState('Elena Rivera');
  const [imageIndex, setImageIndex] = useState(0);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Set of premium default graphics to cycle from
  const sampleGraphics = [
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800', // code dev
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', // analytics charts
    'https://images.unsplash.com/photo-1541462608141-27b2c7453c6e?auto=format&fit=crop&q=80&w=800', // design system UI
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', // digital marketing
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price) {
      alert('Please fill out all required course fields.');
      return;
    }

    setStatus('loading');

    const coursePayload = {
      title,
      description,
      category,
      price: Number(price),
      level,
      image: sampleGraphics[imageIndex],
      instructorName,
      longDescription: `Unleash your professional capabilities with this comprehensive guide to ${title}. Master modular techniques, structural pipelines, and hands-on exercises carefully engineered to fast-track your skills to elite standards.`,
    };

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coursePayload),
      });

      if (res.ok) {
        const createdCourse = await res.json();
        setStatus('success');
        
        // Let it display success state for 1 second, then invoke callback to refresh list
        setTimeout(() => {
          onCourseCreated(createdCourse);
          setStatus('idle');
          // Reset form
          setTitle('');
          setDescription('');
          setPrice('79');
        }, 1200);
      } else {
        alert('Failed to publish course to server.');
        setStatus('idle');
      }
    } catch (err) {
      console.error(err);
      alert('Server error while saving course.');
      setStatus('idle');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      <div className="border-b border-white/5 pb-5">
        <h2 className="font-display text-xl font-bold text-white uppercase tracking-wider">Instructor Academy Center</h2>
        <p className="text-xs text-white/50 mt-1">Design, configure, and publish course SKUs directly into our server catalog in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Form */}
        <div className="lg:col-span-7 bg-[#111111] rounded-3xl border border-white/10 p-6 shadow-sm">
          {status === 'success' ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="rounded-full bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-400 animate-bounce">
                <CheckCircle className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Course SKU Registered Successfully!</h3>
                <p className="text-xs text-white/50 mt-1">Stripe payment listings created. Redirecting to course list...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/60">Course Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Masterclass in Advanced Kubernetes Orchestration"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none placeholder-white/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/60">Course Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Development" className="bg-[#111111]">Development</option>
                    <option value="Artificial Intelligence" className="bg-[#111111]">Artificial Intelligence</option>
                    <option value="Design & UX" className="bg-[#111111]">Design & UX</option>
                    <option value="Business & Finance" className="bg-[#111111]">Business & Finance</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/60">Course Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="All Levels" className="bg-[#111111]">All Levels</option>
                    <option value="Beginner" className="bg-[#111111]">Beginner</option>
                    <option value="Intermediate" className="bg-[#111111]">Intermediate</option>
                    <option value="Advanced" className="bg-[#111111]">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/60">Listing Price (USD) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-white/40">$</span>
                    <input
                      type="number"
                      required
                      min="1"
                      max="1000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="99"
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-8 pr-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/60">Instructor Name</label>
                  <input
                    type="text"
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Lin"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/60">Course cover graphic</label>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    {sampleGraphics.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageIndex(idx)}
                        className={`relative h-12 w-16 overflow-hidden rounded-lg border-2 transition-all flex-shrink-0 cursor-pointer ${
                          imageIndex === idx ? 'border-indigo-500 scale-105 z-10' : 'border-[#111111] opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={url} 
                          alt="Cover" 
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-white/40 font-medium">Select a premium thumbnail style</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/60">Short Description Paragraph *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline what skills your students will gain and what milestones they will achieve in this course..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none resize-none leading-relaxed placeholder-white/20"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3.5 transition-all cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                {status === 'loading' ? 'Publishing Course...' : 'Publish Course to Live Catalog'}
              </button>
            </form>
          )}
        </div>

        {/* Right column: Info & preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#111111] p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" /> Live Card Preview
            </h3>

            {/* Simulated live preview of card */}
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/40">
              <img 
                src={sampleGraphics[imageIndex]} 
                alt="Preview cover" 
                className="aspect-video w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{category}</span>
                <h4 className="text-xs font-bold text-white truncate">{title || 'Your Course Title Here'}</h4>
                <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed">{description || 'Your description preview outline will display here dynamically as you write it.'}</p>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-extrabold text-white">
                  <span>Price</span>
                  <span className="text-indigo-400 font-mono">${price || '0'}.00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Dynamic SKU creation info</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              When you add a course, the server dynamically registers the item in the in-memory store. 
              The application instantly creates a Stripe transaction-ready SKU.
            </p>
            <div className="rounded-xl bg-black/30 border border-white/5 p-4 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-white/40 flex-shrink-0 mt-0.5" />
              <span className="text-[10px] text-white/40 leading-normal">
                Course modules are automatically generated with a default syllabus structure (including introductory videos, quiz checklists, and manuals) so students can explore the LMS dashboard immediately.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
