import React, { useState } from 'react';
import { MiniTool, DeviceMode } from '../types/tool';
import { X, RefreshCw, Smartphone, Tablet, Monitor, Download, Copy, Check } from 'lucide-react';
import { downloadStandaloneHtml } from '../utils/storage';

interface FullScreenTryModalProps {
  tool: MiniTool;
  isOpen: boolean;
  onClose: () => void;
}

export const FullScreenTryModal: React.FC<FullScreenTryModalProps> = ({
  tool,
  isOpen,
  onClose,
}) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [key, setKey] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tool.html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getContainerStyle = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-[420px] h-[92vh] mx-auto rounded-3xl border-4 border-slate-700 shadow-2xl overflow-hidden';
      case 'tablet':
        return 'max-w-[800px] h-[92vh] mx-auto rounded-2xl border-2 border-slate-700 shadow-xl overflow-hidden';
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 animate-in fade-in duration-200">
      {/* Floating Modern Header */}
      <div className="h-14 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between backdrop-blur-md z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 hidden sm:inline">
            Interactive Test Mode
          </span>
          <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
            {tool.title}
          </h2>
        </div>

        {/* Viewport switcher */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-lg transition ${
                deviceMode === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mobile"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded-lg transition ${
                deviceMode === 'tablet' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tablet"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-lg transition ${
                deviceMode === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Full Desktop"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setKey((k) => k + 1)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Reload Tool"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => downloadStandaloneHtml(tool)}
            className="hidden sm:flex p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Download Standalone HTML"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            className="hidden sm:flex p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Copy HTML"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 transition ml-1"
          >
            <X className="w-4 h-4" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-slate-950 p-2 sm:p-4 overflow-auto flex items-center justify-center">
        <div className={`w-full transition-all duration-300 ${getContainerStyle()}`}>
          <iframe
            key={key}
            srcDoc={tool.html}
            title={tool.title}
            sandbox="allow-scripts allow-forms allow-modals allow-downloads"
            className="w-full h-full border-0 bg-slate-950"
          />
        </div>
      </div>
    </div>
  );
};
