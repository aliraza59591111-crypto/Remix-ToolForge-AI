import React, { useState, useRef } from 'react';
import { MiniTool, DeviceMode } from '../types/tool';
import {
  RotateCcw,
  Edit3,
  Copy,
  Maximize2,
  Smartphone,
  Tablet,
  Monitor,
  Download,
  Check,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Code2,
  Eye,
  ListChecks,
  RefreshCw,
  ExternalLink,
  MessageSquarePlus,
  Send,
  Wand2,
} from 'lucide-react';
import { downloadStandaloneHtml } from '../utils/storage';

interface ToolPreviewProps {
  tool: MiniTool;
  onRegenerate: () => void;
  onOpenEdit: () => void;
  onOpenTry: () => void;
  onSaveToggle: (tool: MiniTool) => void;
  isSaved: boolean;
  onRefine: (refinementText: string) => Promise<void>;
  isRefining: boolean;
}

export const ToolPreview: React.FC<ToolPreviewProps> = ({
  tool,
  onRegenerate,
  onOpenEdit,
  onOpenTry,
  onSaveToggle,
  isSaved,
  onRefine,
  isRefining,
}) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'specs' | 'refine'>('preview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCopyDropdown, setShowCopyDropdown] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [refinePrompt, setRefinePrompt] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(tool.html);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      setShowCopyDropdown(false);
    } catch {
      // Fallback
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCopyEmbed = async () => {
    const embedSnippet = `<!-- ToolForge AI: ${tool.title} -->\n<iframe srcdoc="${tool.html.replace(/"/g, '&quot;')}" width="100%" height="600" frameborder="0" sandbox="allow-scripts allow-forms allow-modals allow-downloads"></iframe>`;
    try {
      await navigator.clipboard.writeText(embedSnippet);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      setShowCopyDropdown(false);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleReloadIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinePrompt.trim() || isRefining) return;
    await onRefine(refinePrompt.trim());
    setRefinePrompt('');
  };

  // Viewport width helper
  const getContainerWidthClass = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-[390px] mx-auto shadow-2xl rounded-3xl border-4 border-slate-700/80';
      case 'tablet':
        return 'max-w-[768px] mx-auto shadow-xl rounded-2xl border-2 border-slate-700/80';
      default:
        return 'w-full rounded-2xl border border-slate-800';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16 animate-in fade-in duration-300">
      {/* Tool Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 mb-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                {tool.category || 'Utility'}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">Sandboxed Environment</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {tool.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              {tool.tagline}
            </p>
          </div>

          {/* Action Buttons: Try Tool, Edit, Regenerate, Copy */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Try Tool Button */}
            <button
              onClick={onOpenTry}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition active:scale-95"
              title="Open full-screen interactive test mode"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Try Tool</span>
            </button>

            {/* Edit Button */}
            <button
              onClick={onOpenEdit}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 border border-slate-700 transition active:scale-95"
              title="Edit HTML & JS code directly"
            >
              <Edit3 className="w-4 h-4 text-indigo-400" />
              <span>Edit</span>
            </button>

            {/* Regenerate Button */}
            <button
              onClick={onRegenerate}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 border border-slate-700 transition active:scale-95"
              title="Regenerate with Gemini"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>Regenerate</span>
            </button>

            {/* Copy / Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCopyDropdown(!showCopyDropdown)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 border border-slate-700 transition active:scale-95"
                title="Copy or export tool"
              >
                {copiedCode ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-amber-400" />
                )}
                <span>Copy</span>
              </button>

              {showCopyDropdown && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-slate-900 border border-slate-700 rounded-2xl p-1.5 shadow-2xl z-30 animate-in fade-in zoom-in-95">
                  <button
                    onClick={handleCopyCode}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                  >
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Copy Full HTML Code</span>
                  </button>
                  <button
                    onClick={() => {
                      downloadStandaloneHtml(tool);
                      setShowCopyDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download Offline .html</span>
                  </button>
                  <button
                    onClick={handleCopyEmbed}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Copy Iframe Embed</span>
                  </button>
                </div>
              )}
            </div>

            {/* Save to My Tools */}
            <button
              onClick={() => onSaveToggle(tool)}
              className={`p-2.5 rounded-xl border transition active:scale-95 ${
                isSaved
                  ? 'bg-indigo-950/80 border-indigo-700 text-indigo-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title={isSaved ? 'Saved in My Tools' : 'Save to My Tools'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-indigo-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Tab & Device Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-800/80">
          {/* Main Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'preview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'code'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'specs'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              <span>Features</span>
            </button>

            <button
              onClick={() => setActiveTab('refine')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'refine'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Refine with AI</span>
            </button>
          </div>

          {/* Device Preview Switchers & Reload (only when preview tab is active) */}
          {activeTab === 'preview' && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 hidden sm:inline">Viewport:</span>
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`p-1.5 rounded-lg transition ${
                    deviceMode === 'mobile'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Mobile preview (390px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceMode('tablet')}
                  className={`p-1.5 rounded-lg transition ${
                    deviceMode === 'tablet'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Tablet preview (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceMode('desktop')}
                  className={`p-1.5 rounded-lg transition ${
                    deviceMode === 'desktop'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Desktop responsive (100%)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleReloadIframe}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 transition"
                title="Reset/Reload Tool"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'preview' && (
        <div className="bg-slate-950/60 p-2 sm:p-4 rounded-3xl border border-slate-800/80">
          <div className={`transition-all duration-300 overflow-hidden ${getContainerWidthClass()}`}>
            {/* Device mock header if in mobile/tablet mode */}
            {deviceMode === 'mobile' && (
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">9:41</span>
                <div className="w-16 h-3 bg-slate-800 rounded-full" />
                <div className="flex items-center gap-1 font-mono">100% 🔋</div>
              </div>
            )}

            {/* Sandboxed Safe Iframe */}
            <div className="w-full h-[620px] bg-slate-950 overflow-hidden relative">
              <iframe
                key={iframeKey}
                ref={iframeRef}
                srcDoc={tool.html}
                title={tool.title}
                sandbox="allow-scripts allow-forms allow-modals allow-downloads"
                className="w-full h-full border-0 bg-slate-950"
                loading="eager"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'code' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono text-slate-300">standalone_app.html</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {tool.html.length} chars
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenEdit}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Open Editor</span>
              </button>
              <button
                onClick={handleCopyCode}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
          <pre className="p-4 bg-slate-950 rounded-2xl text-xs font-mono text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed border border-slate-800">
            <code>{tool.html}</code>
          </pre>
        </div>
      )}

      {activeTab === 'specs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Generated Specification & Capabilities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs uppercase font-semibold text-slate-400 mb-2">Original Prompt</h4>
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
                  "{tool.prompt}"
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-semibold text-slate-400 mb-2">How to Use</h4>
                <p className="text-xs text-slate-300 leading-relaxed p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                  {tool.instructions}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase font-semibold text-slate-400 mb-2">Core Features</h4>
              <ul className="space-y-2">
                {tool.features.map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                      {i + 1}
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'refine' && (
        <div className="bg-slate-900 border border-indigo-900/40 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Refine Tool with AI</h3>
              <p className="text-xs text-slate-400">
                Ask Gemini to add new features, adjust calculations, tweak styles, or improve usability.
              </p>
            </div>
          </div>

          <form onSubmit={handleRefineSubmit} className="space-y-4">
            <textarea
              value={refinePrompt}
              onChange={(e) => setRefinePrompt(e.target.value)}
              placeholder="e.g. Add a CSV export button, add support for currency exchange rates, make the chart interactive, or add a reset state..."
              rows={3}
              disabled={isRefining}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y"
            />

            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-1.5">
                {['Add CSV export', 'Add dark mode toggle', 'Add input validation', 'Make it more colorful'].map(
                  (suggestion) => (
                    <button
                      type="button"
                      key={suggestion}
                      onClick={() => setRefinePrompt(suggestion)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                    >
                      + {suggestion}
                    </button>
                  )
                )}
              </div>

              <button
                type="submit"
                disabled={isRefining || !refinePrompt.trim()}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 text-white transition ${
                  isRefining || !refinePrompt.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30'
                }`}
              >
                {isRefining ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Refining...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply AI Refinement</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
