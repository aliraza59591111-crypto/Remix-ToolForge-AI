import React, { useState } from 'react';
import { Sparkles, Dices, ArrowRight, X, Wand2, Lightbulb, CheckCircle2 } from 'lucide-react';
import { INSPIRATION_PROMPTS } from '../utils/sampleTools';

interface HeroGeneratorProps {
  onGenerate: (prompt: string, category?: string) => void;
  isLoading: boolean;
  initialPrompt?: string;
}

export const HeroGenerator: React.FC<HeroGeneratorProps> = ({
  onGenerate,
  isLoading,
  initialPrompt = '',
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Productivity', 'Finance', 'Developer', 'Utility', 'Design'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate(prompt.trim(), selectedCategory !== 'All' ? selectedCategory : undefined);
  };

  const handleSurpriseMe = () => {
    const randomItem = INSPIRATION_PROMPTS[Math.floor(Math.random() * INSPIRATION_PROMPTS.length)];
    setPrompt(randomItem.prompt);
    setSelectedCategory(randomItem.category);
  };

  const handleSelectInspiration = (itemPrompt: string, category: string) => {
    setPrompt(itemPrompt);
    setSelectedCategory(category);
    // Smooth scroll down to textarea if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-12">
      {/* Hero Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold mb-4 shadow-sm animate-in fade-in duration-500">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Powered by Gemini AI • Sandboxed & Instant</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
          Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-400">AI Tool</span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Describe any utility, calculator, conversion widget, or interactive workflow in plain language.
          Gemini will forge a fully functioning, mobile-ready mini web tool in seconds.
        </p>
      </div>

      {/* Main Generator Form Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          {/* Category Chips */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1.5 flex-nowrap">
              <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Category:</span>
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap active:scale-95 ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSurpriseMe}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-800/50 hover:bg-cyan-950/70 transition whitespace-nowrap"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Surprise Me</span>
            </button>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the tool you want to build... (e.g. A loan payoff calculator with extra payment comparison and visual balance payoff schedule, or a color contrast validator with accessible suggestions)"
              rows={4}
              disabled={isLoading}
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition resize-y min-h-[120px] sm:min-h-[140px]"
            />

            {prompt.length > 0 && !isLoading && (
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/80 hover:bg-slate-700 transition"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Generates standalone HTML, Tailwind CSS & offline JavaScript</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition-all duration-200 active:scale-98 ${
                isLoading || !prompt.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/30 cursor-pointer hover:shadow-indigo-500/40'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Forging Tool with Gemini...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-cyan-200" />
                  <span>Generate Tool</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Quick Inspiration Cards Grid */}
      <div className="mt-10 sm:mt-12">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs uppercase font-bold tracking-wider text-slate-400">
            Popular Tool Inspirations (Click to test)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {INSPIRATION_PROMPTS.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectInspiration(item.prompt, item.category)}
              className="group p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-600/50 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 group-hover:bg-indigo-950 group-hover:text-indigo-300">
                  {item.category}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {item.prompt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
