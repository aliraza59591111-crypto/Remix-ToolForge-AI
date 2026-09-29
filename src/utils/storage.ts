import { MiniTool } from '../types/tool';
import { SAMPLE_TOOLS } from './sampleTools';

const STORAGE_KEY = 'toolforge_saved_tools_v1';

export function getSavedTools(): MiniTool[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Initialize with sample tools so user has working tools out of the box
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_TOOLS));
      return SAMPLE_TOOLS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : SAMPLE_TOOLS;
  } catch (e) {
    console.error('Error loading saved tools from localStorage:', e);
    return SAMPLE_TOOLS;
  }
}

export function saveTool(tool: MiniTool): MiniTool[] {
  try {
    const current = getSavedTools();
    const existingIndex = current.findIndex((t) => t.id === tool.id);
    let updated: MiniTool[];

    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...tool, updatedAt: new Date().toISOString() };
    } else {
      updated = [tool, ...current];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving tool:', e);
    return getSavedTools();
  }
}

export function deleteTool(toolId: string): MiniTool[] {
  try {
    const current = getSavedTools();
    const updated = current.filter((t) => t.id !== toolId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error deleting tool:', e);
    return getSavedTools();
  }
}

export function toggleFavoriteTool(toolId: string): MiniTool[] {
  try {
    const current = getSavedTools();
    const updated = current.map((t) => (t.id === toolId ? { ...t, isFavorite: !t.isFavorite } : t));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error toggling favorite:', e);
    return getSavedTools();
  }
}

export function exportToolsBackup(): void {
  const tools = getSavedTools();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tools, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `toolforge_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function downloadStandaloneHtml(tool: MiniTool): void {
  const safeFilename = (tool.title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'tool') + '.html';
  const blob = new Blob([tool.html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', safeFilename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
}
