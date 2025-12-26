import React, { useState, useEffect, useRef } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { Camera, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { GalleryItem } from '../types';

const motion = motionBase as any;

interface PhotoGalleryProps {
  galleryData: GalleryItem[];
  onNavigate: (view: any) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ galleryData, onNavigate }) => {
  const [activeGallery, setActiveGallery] = useState<GalleryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = activeGallery ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activeGallery]);

  if (!galleryData || galleryData.length === 0) {
    return null;
  }

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(galleryData.map(item => item.eventCategory).filter(Boolean)))];

  // Filter by category
  const filteredData = selectedCategory === 'All'
    ? galleryData
    : galleryData.filter(item => item.eventCategory === selectedCategory);

  // Duplicate for density, but we'll use standard scrolling now
  const ITEMS = [...filteredData, ...filteredData, ...filteredData];

  const handleNav = (view: string) => {
    setActiveGallery(null);
    onNavigate(view);
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -420 : 420;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="py-24 relative bg-transparent overflow-hidden">
        <style>{`
            .hide-scrollbar::-webkit-scrollbar {
            display: none;
            }
            .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
            }
        `}</style>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <span className="text-purple-400 font-bold tracking-widest uppercase text-sm mb-2 block">
              Events & Workshops
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Our Community in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Action</span>
            </h2>
          </motion.div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full group/gallery">
          {/* Nav Buttons */}
          <div className="absolute top-1/2 left-4 md:left-12 -translate-y-1/2 z-20 opacity-0 group-hover/gallery:opacity-100 transition-opacity">
            <button onClick={() => scroll('left')} className="p-3 rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-white hover:text-black shadow-xl transition-all backdrop-blur-md">
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute top-1/2 right-4 md:right-12 -translate-y-1/2 z-20 opacity-0 group-hover/gallery:opacity-100 transition-opacity">
            <button onClick={() => scroll('right')} className="p-3 rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-white hover:text-black shadow-xl transition-all backdrop-blur-md">
              <ChevronRight size={24} />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-8 hide-scrollbar pb-8"
          >
            {ITEMS.map((item, i) => (
              <motion.div
                key={`${item.id}-${i}`}
                onClick={() => setActiveGallery(item)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveGallery(item)}
                role="button"
                tabIndex={0}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                aria-label={`View gallery: ${item.schoolName}`}
                className="group relative w-[400px] h-[300px] flex-shrink-0 glass-card rounded-2xl overflow-hidden cursor-pointer snap-center border border-white/10 hover:border-purple-500/50 transition-all"
              >
                <img src={item.marqueeImageUrl} alt={item.schoolName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{item.schoolName}</h3>
                  <p className="text-sm text-slate-300 line-clamp-1">{item.description}</p>
                </div>
                <div className="absolute top-4 right-4 p-2 bg-white/10 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} className="text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pt-24 pb-8 px-4 md:px-8 bg-slate-900/95 backdrop-blur-xl flex flex-col overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto w-full">
              {/* Navigation Control */}
              <div className="mb-8 flex items-center justify-between">
                <motion.button
                  whileHover={{ x: -5 }}
                  onClick={() => setActiveGallery(null)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-all shadow-lg"
                >
                  <ChevronLeft size={20} /> Back to Gallery
                </motion.button>
              </div>

              {/* Main Title Block */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
              >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{activeGallery.schoolName}</h2>
                <p className="text-slate-400 max-w-3xl text-lg leading-relaxed">{activeGallery.description}</p>
              </motion.div>

              {activeGallery.detailImageUrls && activeGallery.detailImageUrls.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                  initial="hidden"
                  animate="visible"
                >
                  {activeGallery.detailImageUrls.map((url, idx) => (
                    <motion.div
                      key={`${url}-${idx}`}
                      className="group aspect-[4/3] bg-slate-800 rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all relative shadow-2xl"
                      variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        visible: { opacity: 1, scale: 1 }
                      }}
                    >
                      <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-64 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-slate-500">No photos available for this event.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};