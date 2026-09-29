import React, { useState, useEffect } from 'react';
import { X, Check, Save, RotateCcw, Copy, Download, Code } from 'lucide-react';
import { MiniTool } from '../types/tool';
import { downloadStandaloneHtml } from '../utils/storage';

interface CodeEditorModalProps {
  tool: MiniTool;
  isOpen: boolean;
  onClose: () => void;
  onSaveCode: (newHtml: string) => void;
}

export const CodeEditorModal: React.FC<CodeEditorModalProps> = ({
  tool,
  isOpen,
  onClose,
  onSaveCode,
}) => {
  const [editedCode, setEditedCode] = useState(tool.html);
  const [copied, setCopied] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedCode(tool.html);
    setHasChanges(false);
  }, [tool.id, tool.html, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedCode(e.target.value);
    setHasChanges(e.target.value !== tool.html);
  };

  const handleApply = () => {
    onSaveCode(editedCode);
    setHasChanges(false);
    onClose();
  };

  const handleRevert = () => {
    setEditedCode(tool.html);
    setHasChanges(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Edit Tool Source Code</span>
                {hasChanges && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                    Unsaved edits
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">{tool.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={() => downloadStandaloneHtml({ ...tool, html: editedCode })}
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 p-4 bg-slate-950 overflow-hidden flex flex-col">
          <div className="text-[11px] text-slate-400 mb-2 flex justify-between items-center font-mono">
            <span>Direct HTML/CSS/JS Source Editor</span>
            <span>Lines: {editedCode.split('\n').length} • Length: {editedCode.length}</span>
          </div>

          <textarea
            value={editedCode}
            onChange={handleChange}
            spellCheck={false}
            className="w-full flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 selection:bg-indigo-500 selection:text-white leading-relaxed resize-none"
          />
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleRevert}
            disabled={!hasChanges}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Revert Changes</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
            >
              <Save className="w-4 h-4" />
              <span>Apply & Update Preview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
