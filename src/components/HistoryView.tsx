import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  History,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  Calendar,
  Layers,
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';
import { HistoryItem, GarmentAnalysisResult } from '../types';
import { ConfirmationModal } from './ConfirmationModal';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelectHistoryItem: (analysis: GarmentAnalysisResult) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onNavigateToAnalyze: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectHistoryItem,
  onDeleteItem,
  onClearAll,
  onNavigateToAnalyze,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'top', label: 'Tops' },
    { id: 'bottom', label: 'Bottoms' },
    { id: 'outerwear', label: 'Outerwear' },
  ];

  const filteredHistory = history.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.garmentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.colorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.material.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vastra-scan-history-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onDeleteItem(itemToDelete);
      setItemToDelete(null);
    }
  };

  const confirmClearAll = () => {
    onClearAll();
    setShowClearAllModal(false);
  };

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <History className="w-6 h-6 text-indigo-400" />
              <span>My Analysis History</span>
            </h1>
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {history.length} {history.length === 1 ? 'Scan' : 'Scans'} Saved
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Locally persisted session database of identified garments, materials, and care guides.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={() => setShowClearAllModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All History</span>
            </button>
          </div>
        )}
      </div>

      {/* Controls Bar: Search & Category Filters */}
      {history.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by garment, color, or material..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {history.length === 0 && (
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-2xl border border-slate-800/80">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <History className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-semibold text-slate-200">No Scans in History Yet</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
            Clothing analyzed via file upload, camera, or the offline demo mode can be saved here for quick reference during your viva.
          </p>
          <button
            type="button"
            onClick={onNavigateToAnalyze}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-950 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Go to Analyze & Scan Garment</span>
          </button>
        </div>
      )}

      {/* Grid of Scanned Garments */}
      {history.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <AnimatePresence>
            {filteredHistory.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail & Badges */}
                  <div className="relative aspect-16/10 w-full bg-slate-950 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.garmentType}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                    <span className="absolute top-2.5 left-2.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-900/90 text-indigo-300 border border-slate-700/60 backdrop-blur-xs uppercase">
                      {item.category}
                    </span>

                    <span className="absolute top-2.5 right-2.5 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                      {Math.round(item.confidence * 100)}% Conf
                    </span>

                    <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5 text-[10px] font-mono text-slate-300">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{formatTimestamp(item.timestamp)}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors truncate">
                      {item.garmentType}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Color:</span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span>{item.colorName}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Material:</span>
                        <span className="font-medium truncate max-w-[170px] text-right">
                          {item.material}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Pattern:</span>
                        <span className="font-medium truncate max-w-[170px] text-right">
                          {item.pattern}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Condition:</span>
                        <span className="text-emerald-400 font-medium truncate max-w-[170px] text-right">
                          {item.condition}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectHistoryItem(item.analysis)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Inspect Results</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setItemToDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!itemToDelete}
        title="Delete Scan Record"
        message="Are you sure you want to delete this clothing scan from your local history? This action cannot be undone."
        confirmLabel="Delete Item"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Clear All Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearAllModal}
        title="Clear All Scan History"
        message="Are you sure you want to wipe all saved clothing records from your local browser storage? You can always run fresh analyses or reload offline benchmarks anytime."
        confirmLabel="Clear All Records"
        isDestructive={true}
        onConfirm={confirmClearAll}
        onCancel={() => setShowClearAllModal(false)}
      />
    </div>
  );
};
