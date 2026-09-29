import React, { useState, useEffect } from 'react';
import { MiniTool, ViewTab } from './types/tool';
import { getSavedTools, saveTool, deleteTool, toggleFavoriteTool } from './utils/storage';
import { SAMPLE_TOOLS } from './utils/sampleTools';
import { Navbar } from './components/Navbar';
import { HeroGenerator } from './components/HeroGenerator';
import { ToolPreview } from './components/ToolPreview';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { CodeEditorModal } from './components/CodeEditorModal';
import { FullScreenTryModal } from './components/FullScreenTryModal';
import { MyToolsView } from './components/MyToolsView';
import { AboutView } from './components/AboutModal';
import { AuditModal } from './components/AuditModal';
import { AlertCircle, RotateCcw, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('home');
  const [savedTools, setSavedTools] = useState<MiniTool[]>([]);
  const [activeTool, setActiveTool] = useState<MiniTool | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isTryModalOpen, setIsTryModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Initialize saved tools from storage or sample tools
  useEffect(() => {
    const tools = getSavedTools();
    setSavedTools(tools);
    // If no active tool is set, display the first tool as ready-to-test
    if (!activeTool && tools.length > 0) {
      setActiveTool(tools[0]);
    }
  }, []);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Generate Tool handler (calls server-side /api/generate-tool)
  const handleGenerate = async (promptText: string, category?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentPrompt(promptText);

    try {
      const response = await fetch('/api/generate-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, category }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate tool with Gemini.');
      }

      const generatedTool: MiniTool = data.tool;
      setActiveTool(generatedTool);

      // Automatically persist the newly generated tool to My Tools
      const updated = saveTool(generatedTool);
      setSavedTools(updated);

      showToast(`✨ Generated "${generatedTool.title}"!`);

      // Scroll smoothly to preview
      setTimeout(() => {
        const previewElement = document.getElementById('preview-section');
        if (previewElement) {
          previewElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    } catch (err: any) {
      console.error('Tool generation error:', err);
      setErrorMessage(err?.message || 'An error occurred during tool generation. Please check your prompt and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate current tool
  const handleRegenerate = () => {
    if (activeTool?.prompt) {
      handleGenerate(activeTool.prompt, activeTool.category);
    } else if (currentPrompt) {
      handleGenerate(currentPrompt);
    } else {
      showToast('Enter a prompt above to regenerate.');
    }
  };

  // Refine tool with Gemini AI
  const handleRefine = async (refinementText: string) => {
    if (!activeTool) return;
    setIsRefining(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/refine-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentTool: activeTool,
          refinement: refinementText,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to refine tool.');
      }

      const refinedTool: MiniTool = data.tool;
      setActiveTool(refinedTool);

      // Update in saved tools
      const updated = saveTool(refinedTool);
      setSavedTools(updated);

      showToast('🎉 Tool refined and updated successfully!');
    } catch (err: any) {
      console.error('Refinement error:', err);
      setErrorMessage(err?.message || 'Failed to refine tool. Please try again.');
    } finally {
      setIsRefining(false);
    }
  };

  // Save/favorite toggle
  const handleSaveToggle = (tool: MiniTool) => {
    const updated = saveTool(tool);
    setSavedTools(updated);
    showToast(`Saved "${tool.title}" to My Tools.`);
  };

  const handleDeleteTool = (toolId: string) => {
    const updated = deleteTool(toolId);
    setSavedTools(updated);
    if (activeTool?.id === toolId) {
      setActiveTool(updated[0] || null);
    }
    showToast('Tool deleted.');
  };

  const handleToggleFavorite = (toolId: string) => {
    const updated = toggleFavoriteTool(toolId);
    setSavedTools(updated);
  };

  const handleSelectToolFromGallery = (tool: MiniTool) => {
    setActiveTool(tool);
    setCurrentTab('home');
    showToast(`Loaded "${tool.title}".`);
    setTimeout(() => {
      const previewElement = document.getElementById('preview-section');
      if (previewElement) {
        previewElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleSaveCodeFromEditor = (newHtml: string) => {
    if (!activeTool) return;
    const updatedTool = {
      ...activeTool,
      html: newHtml,
      updatedAt: new Date().toISOString(),
    };
    setActiveTool(updatedTool);
    const updated = saveTool(updatedTool);
    setSavedTools(updated);
    showToast('Code updated & applied.');
  };

  const handleImportTools = (imported: MiniTool[]) => {
    let current = [...savedTools];
    imported.forEach((tool) => {
      if (!current.some((t) => t.id === tool.id)) {
        current = [tool, ...current];
      }
    });
    localStorage.setItem('toolforge_saved_tools_v1', JSON.stringify(current));
    setSavedTools(current);
    showToast(`Imported ${imported.length} tools.`);
  };

  const handleNewToolClick = () => {
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCurrentToolSaved = Boolean(
    activeTool && savedTools.some((t) => t.id === activeTool.id)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-indigo-950/95 border border-indigo-700/80 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        savedToolsCount={savedTools.length}
        onNewToolClick={handleNewToolClick}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div>
            {/* Hero / Builder Section */}
            <HeroGenerator
              onGenerate={handleGenerate}
              isLoading={isLoading}
              initialPrompt={currentPrompt}
            />

            {/* Error Banner */}
            {errorMessage && (
              <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-8">
                <div className="bg-rose-950/80 border border-rose-800 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-3 text-rose-200 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white mb-0.5">Generation Issue</h4>
                      <p className="leading-relaxed">{errorMessage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRegenerate}
                      className="px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-900 text-white font-semibold text-xs flex items-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry</span>
                    </button>
                    <button
                      onClick={() => setErrorMessage(null)}
                      className="p-1.5 rounded-lg hover:bg-rose-900/60 text-rose-400 hover:text-white transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && <LoadingSkeleton userPrompt={currentPrompt} />}

            {/* Active Tool Preview & Workbench */}
            {!isLoading && activeTool && (
              <div id="preview-section" className="pt-4 border-t border-slate-900">
                <ToolPreview
                  tool={activeTool}
                  onRegenerate={handleRegenerate}
                  onOpenEdit={() => setIsEditorOpen(true)}
                  onOpenTry={() => setIsTryModalOpen(true)}
                  onSaveToggle={handleSaveToggle}
                  isSaved={isCurrentToolSaved}
                  onRefine={handleRefine}
                  isRefining={isRefining}
                />
              </div>
            )}
          </div>
        )}

        {currentTab === 'my-tools' && (
          <MyToolsView
            tools={savedTools}
            onSelectTool={handleSelectToolFromGallery}
            onDeleteTool={handleDeleteTool}
            onToggleFavorite={handleToggleFavorite}
            onNewToolClick={handleNewToolClick}
            onImportTools={handleImportTools}
          />
        )}

        {currentTab === 'about' && (
          <AboutView
            onBackToHome={() => setCurrentTab('home')}
            onOpenAuditModal={() => setIsAuditModalOpen(true)}
          />
        )}
      </main>

      {/* Code Editor Modal */}
      {activeTool && (
        <CodeEditorModal
          tool={activeTool}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSaveCode={handleSaveCodeFromEditor}
        />
      )}

      {/* Fullscreen Interactive Try Modal */}
      {activeTool && (
        <FullScreenTryModal
          tool={activeTool}
          isOpen={isTryModalOpen}
          onClose={() => setIsTryModalOpen(false)}
        />
      )}

      {/* Live System & Security Audit Modal */}
      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 px-4 bg-slate-950/80 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">ToolForge AI</span>
            <span>•</span>
            <span>Instant Sandboxed Web Tools</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setCurrentTab('home')} className="hover:text-white transition">
              Home
            </button>
            <button onClick={() => setCurrentTab('my-tools')} className="hover:text-white transition">
              My Tools ({savedTools.length})
            </button>
            <button onClick={() => setCurrentTab('about')} className="hover:text-white transition">
              About & Safety
            </button>
            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 font-medium"
            >
              <span>Security Audit</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
