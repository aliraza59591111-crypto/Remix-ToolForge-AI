import React, { useState } from 'react';
import { MiniTool } from '../types/tool';
import {
  FolderHeart,
  Search,
  Trash2,
  Download,
  ExternalLink,
  Sparkles,
  Star,
  FileUp,
  FileDown,
  Wand2,
  X,
} from 'lucide-react';
import { downloadStandaloneHtml, exportToolsBackup } from '../utils/storage';

interface MyToolsViewProps {
  tools: MiniTool[];
  onSelectTool: (tool: MiniTool) => void;
  onDeleteTool: (toolId: string) => void;
  onToggleFavorite: (toolId: string) => void;
  onNewToolClick: () => void;
  onImportTools: (imported: MiniTool[]) => void;
}

export const MyToolsView: React.FC<MyToolsViewProps> = ({
  tools,
  onSelectTool,
  onDeleteTool,
  onToggleFavorite,
  onNewToolClick,
  onImportTools,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const categories = ['All', 'Favorites', 'Finance', 'Productivity', 'Developer', 'Utility'];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.prompt.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Favorites') return Boolean(tool.isFavorite);
    return tool.category?.toLowerCase() === selectedFilter.toLowerCase();
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onImportTools(parsed);
          setImportStatus(`Successfully imported ${parsed.length} tools!`);
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Invalid backup format: expected an array of tools.');
          setTimeout(() => setImportStatus(null), 4000);
        }
      } catch {
        setImportStatus('Could not parse JSON file. Please ensure it is a valid backup.');
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
              <FolderHeart className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">My Generated Tools</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            {tools.length} mini web tools saved locally on your device
          </p>
        </div>

        {/* Action buttons: Import/Export/New */}
        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition">
            <FileUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Import</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={exportToolsBackup}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Export all tools as JSON backup"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Backup</span>
          </button>

          <button
            onClick={onNewToolClick}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/30"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Forge New Tool</span>
          </button>
        </div>
      </div>

      {/* Import Status Alert Banner */}
      {importStatus && (
        <div className="mb-6 p-3.5 bg-indigo-950/70 border border-indigo-700/80 rounded-2xl text-xs font-semibold text-indigo-200 animate-in fade-in duration-200 flex items-center justify-between">
          <span>{importStatus}</span>
          <button onClick={() => setImportStatus(null)} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved tools by title, keyword, or prompt..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedFilter === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-800 flex items-center justify-center text-indigo-400 mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Tools Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
            {searchQuery
              ? 'Try adjusting your search query or clear the filter to see your tools.'
              : 'Generate your very first custom mini tool using Gemini AI on the home tab.'}
          </p>
          <button
            onClick={onNewToolClick}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
          >
            Create Your First Tool
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-5 shadow-lg flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                    {tool.category || 'Utility'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleFavorite(tool.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 transition"
                      title={tool.isFavorite ? 'Unfavorite' : 'Add to favorites'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          tool.isFavorite ? 'text-amber-400 fill-amber-400' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => onDeleteTool(tool.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition"
                      title="Delete tool"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                  {tool.tagline}
                </p>

                {/* Key Features Pill list */}
                {tool.features && tool.features.length > 0 && (
                  <div className="space-y-1 mb-4">
                    {tool.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => onSelectTool(tool)}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-indigo-600/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Workspace</span>
                </button>

                <button
                  onClick={() => downloadStandaloneHtml(tool)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Download offline .html"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
