import React, { useState, useEffect } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { Video, FileText, BookOpen, ExternalLink, Download, Play, X, AlertCircle, Home, Calendar, User } from 'lucide-react';
import { EducationalResource, ResourceType, SectorType } from '../types';
import { VideoPlayer } from './VideoPlayer';

const motion = motionBase as any;

interface EducationalResourcesProps {
  resources: EducationalResource[];
  onNavigate: (view: any) => void;
  initialTab?: ResourceType;
}

export const EducationalResources: React.FC<EducationalResourcesProps> = ({ resources, onNavigate, initialTab }) => {
  const [activeTab, setActiveTab] = useState<ResourceType>(initialTab || 'video');
  const [selectedCategory, setSelectedCategory] = useState<SectorType | 'All'>('All');
  const [selectedResource, setSelectedResource] = useState<EducationalResource | null>(null);
  const [playerError, setPlayerError] = useState(false);

  // Sync activeTab if initialTab changes prop (e.g. navigation from preview)
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const filteredResources = resources.filter(r =>
    r.type === activeTab &&
    (selectedCategory === 'All' || r.category === selectedCategory)
  );

  const handleResourceSelect = (resource: EducationalResource) => {
    setPlayerError(false);
    setSelectedResource(resource);
  };

  const tabs = [
    { id: 'video', label: 'Video Library', icon: Video, color: 'text-red-500', bgColor: 'bg-red-500' },
    { id: 'blog', label: 'Community Blogs', icon: FileText, color: 'text-orange-500', bgColor: 'bg-orange-500' },
  ];

  // Helper to render Markdown-like content safely (simplified for this demo)
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-white mt-6 mb-3">{line.replace('### ', '')}</h3>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-4">{line.replace('# ', '')}</h1>;
      if (line.startsWith('*') && line.endsWith('*')) return <p key={i} className="text-slate-400 italic my-4 pl-4 border-l-2 border-slate-600">{line.replace(/\*/g, '')}</p>;
      if (line.match(/^\d\./)) return <li key={i} className="text-slate-300 ml-6 list-decimal my-2">{line.replace(/^\d\.\s/, '')}</li>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-slate-300 leading-relaxed mb-3">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen pt-40 pb-20 container mx-auto px-6 relative z-10">

      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/10"><Home size={16} /></div>
          <span className="text-sm font-bold uppercase tracking-wider">Back to Home</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Educational Resources</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Curated content to support your learning journey across all mediums.
        </p>
      </motion.div>

      {/* Type Selection Tabs */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ResourceType)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all border ${activeTab === tab.id
              ? `${tab.bgColor} border-transparent text-white shadow-lg scale-105`
              : 'bg-slate-900/50 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {(['All', ...Object.values(SectorType)] as const).map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${selectedCategory === category
              ? 'bg-white/10 border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
              : 'bg-transparent border-transparent text-slate-500 hover:text-white'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredResources.map(resource => (
            <motion.div
              key={resource.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => handleResourceSelect(resource)}
              className={`group relative glass-card rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer hover:-translate-y-2 transition-transform duration-300 border border-white/5 ${resource.type === 'video' ? 'hover:border-red-500/30' :
                resource.type === 'blog' ? 'hover:border-orange-500/30' : 'hover:border-blue-500/30'
                }`}
            >
              {/* Card Thumbnail Area */}
              <div className="relative aspect-video overflow-hidden bg-slate-800">
                {resource.type === 'video' ? (
                  <>
                    <img src={resource.thumbnailUrl} alt={resource.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="text-white fill-white ml-1" size={20} />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">{resource.duration}</span>
                  </>
                ) : resource.type === 'blog' ? (
                  <>
                    {resource.thumbnailUrl ? (
                      <img src={resource.thumbnailUrl} alt={resource.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-900/40 to-slate-900" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText size={40} className="text-white/80 drop-shadow-lg group-hover:scale-110 transition-transform" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-900/40 to-slate-900 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <BookOpen size={40} className="text-blue-400 group-hover:scale-110 transition-transform relative z-10" />
                  </div>
                )}

                <div className="absolute top-3 right-3 z-20">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md text-white uppercase tracking-wider shadow-lg
                      ${resource.type === 'video' ? 'bg-red-500' : resource.type === 'blog' ? 'bg-orange-500' : 'bg-blue-500'}
                    `}>
                    {resource.type}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded uppercase tracking-wider">{resource.category}</span>
                </div>
                <h3 className="font-bold text-white text-base mb-2 line-clamp-2 leading-snug group-hover:text-cyan-400 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-2 mb-4 flex-1">
                  {resource.description}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-3 mt-auto">
                  <span className="flex items-center gap-1"><User size={12} /> {resource.author}</span>
                  {resource.date && <span className="flex items-center gap-1"><Calendar size={12} /> {resource.date}</span>}
                  {resource.fileSize && <span className="flex items-center gap-1"><Download size={12} /> {resource.fileSize}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* UNIFIED RESOURCE MODAL */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedResource(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-5xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-slate-800/50">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`p-2 rounded-lg ${selectedResource.type === 'video' ? 'bg-red-500/20 text-red-400' :
                    selectedResource.type === 'blog' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                    {selectedResource.type === 'video' && <Video size={20} />}
                    {selectedResource.type === 'blog' && <FileText size={20} />}
                    {selectedResource.type === 'ebook' && <BookOpen size={20} />}
                  </div>
                  <h3 className="text-xl font-bold text-white truncate">{selectedResource.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors font-medium border border-white/10 shrink-0 ml-4"
                >
                  <X size={20} /> <span className="hidden sm:inline">Close</span>
                </button>
              </div>

              <div className="overflow-y-auto custom-scrollbar p-6">
                {/* Media Section */}
                <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-white/5 mb-8 bg-black">
                  {selectedResource.type === 'video' ? (
                    <div className="aspect-video">
                      <VideoPlayer
                        url={selectedResource.url}
                        playing
                        onError={() => setPlayerError(true)}
                      />
                    </div>
                  ) : selectedResource.type === 'blog' && selectedResource.content ? (
                    <div className="bg-slate-900 p-8 md:p-12">
                      <div className="max-w-3xl mx-auto prose prose-invert prose-lg">
                        {renderContent(selectedResource.content)}
                      </div>
                      <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-white/10 text-center">
                        <p className="text-slate-500 text-sm mb-4">Original source: Reddit</p>
                        <a href={selectedResource.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors">
                          View original thread <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  ) : selectedResource.type === 'blog' ? (
                    // Fallback for blogs without content field
                    <div className="aspect-video bg-slate-800 flex flex-col items-center justify-center text-center p-10 relative">
                      {selectedResource.thumbnailUrl && (
                        <div className="absolute inset-0 opacity-20">
                          <img src={selectedResource.thumbnailUrl} className="w-full h-full object-cover blur-sm" alt="" />
                        </div>
                      )}
                      <div className="relative z-10 bg-slate-900/90 p-8 rounded-3xl border border-white/10 max-w-lg">
                        <FileText size={64} className="text-orange-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-4">Read on Source</h2>
                        <a href={selectedResource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold shadow-lg transition-all">
                          Read Now <ExternalLink size={18} />
                        </a>
                      </div>
                    </div>
                  ) : (
                    // eBook
                    <div className="aspect-video bg-slate-800 flex flex-col items-center justify-center text-center p-10 relative">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 to-slate-900"></div>
                      <div className="relative z-10 bg-slate-900/90 p-8 rounded-3xl border border-white/10 max-w-lg">
                        <BookOpen size={64} className="text-blue-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-4">Download eBook</h2>
                        <p className="text-slate-400 mb-8">Access the PDF via Google Drive.</p>
                        <a href={selectedResource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg transition-all">
                          Download <Download size={18} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Details Footer */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-white font-bold text-lg">About this content</h4>
                    <p className="text-slate-300 text-base leading-relaxed">{selectedResource.description}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5 space-y-4">
                    <div className="flex justify-between"><span className="text-slate-500 text-sm">Author</span><span className="text-white text-sm">{selectedResource.author}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 text-sm">Category</span><span className="text-cyan-400 text-sm">{selectedResource.category}</span></div>
                    {selectedResource.date && <div className="flex justify-between"><span className="text-slate-500 text-sm">Date</span><span className="text-white text-sm">{selectedResource.date}</span></div>}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};