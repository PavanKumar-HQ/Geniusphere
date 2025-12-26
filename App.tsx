
import React, { useState, useEffect } from 'react';
import { LayoutGrid, User, Menu, X, ShieldCheck, Sparkles, Video, ChevronLeft, Home, Mail } from 'lucide-react';
import { SectorTiles } from './components/SectorTiles';
import { CourseCard } from './components/CourseCard';
import { ServicesGrid } from './components/ServicesGrid';
import { DashboardPreview } from './components/DashboardPreview';
import { AiAssistant } from './components/AiAssistant';
import { LoadingScreen } from './components/LoadingScreen';
import { LoginFlow } from './components/LoginFlow';
import { WhatIsGeniusphere } from './components/WhatIsGeniusphere';
import { SocialLinks, CommunityEvents } from './components/InstagramGallery';
import { InteractiveLearning } from './components/InteractiveLearning';
import { BackgroundEffects } from './components/BackgroundEffects';
import { TrainerProfile } from './components/TrainerProfile';
import { PhotoGallery } from './components/PhotoGallery';
import { VideoTestimonials } from './components/VideoTestimonials';
import { FAQSection } from './components/FAQSection';
import { EducationalResources } from './components/EducationalResources';
import { ResourcesPreview } from './components/ResourcesPreview';
import { CoursePlayer } from './components/CoursePlayer';
import { LocalCommunitySpace } from './components/LocalCommunitySpace';
import { ContactSection } from './components/ContactSection';

import { COURSES, SECTORS, VIDEOS, GALLERY_DATA, FAQS, VIDEO_TESTIMONIALS, TRAINERS_DATA, EDUCATIONAL_RESOURCES, MOCK_AMBASSADORS } from './constants';
import { VideoResource, GalleryItem, FAQItem, VideoTestimonial, Student, EducationalResource, ResourceType, Course, Trainer, Ambassador } from './types';
import { motion as motionBase, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const motion = motionBase as any;

type View = 'home' | 'courses' | 'services' | 'resources' | 'dashboard' | 'course-player' | 'local-space';
type ViewMode = 'explorer' | 'workspace';
type AppState = 'loading' | 'login' | 'app';

function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [currentView, setCurrentView] = useState<View>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('explorer');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  // State to handle which tab to open in resources view (video, blog, ebook)
  const [resourceViewTab, setResourceViewTab] = useState<ResourceType>('video');

  // Dynamic Content State
  const [videos, setVideos] = useState<VideoResource[]>(VIDEOS); // Kept for legacy compatibility if needed
  const [resources, setResources] = useState<EducationalResource[]>(EDUCATIONAL_RESOURCES);
  const [galleryData, setGalleryData] = useState<GalleryItem[]>(GALLERY_DATA);
  const [faqs, setFaqs] = useState<FAQItem[]>(FAQS);
  const [testimonials, setTestimonials] = useState<VideoTestimonial[]>(VIDEO_TESTIMONIALS);
  const [trainers, setTrainers] = useState<Trainer[]>(TRAINERS_DATA);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>(MOCK_AMBASSADORS);

  // Parallax Hooks for Hero Section
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 1000], [0, 300]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleLoadingComplete = () => {
    setAppState('login');
  };

  const handleLoginComplete = (mode: ViewMode) => {
    setViewMode(mode);
    setAppState('app');
    if (mode === 'workspace') {
      setCurrentView('dashboard');
    }
  };

  const handleNavigation = (view: View) => {
    setCurrentView(view);
    setActiveSimulation(null); // Ensure simulation modal closes on nav
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSectorExplore = (sectorName: string) => {
    setSelectedSector(sectorName);
    handleNavigation('courses');
  };

  // Updated to accept type for deep linking
  const handleViewLibrary = (type?: ResourceType) => {
    if (type) setResourceViewTab(type);
    handleNavigation('resources');
  }

  // Opens the specific simulation ID (legacy logic)
  const handleStartSim = (courseId: string) => {
    setActiveSimulation(courseId);
  }

  // Opens the Course Player with full module access
  const handleOpenCourse = (course: Course) => {
    setActiveCourse(course);
    handleNavigation('course-player');
  }

  const handleModeChange = () => {
    if (viewMode === 'explorer') {
      setViewMode('workspace');
      handleNavigation('dashboard');
    } else {
      setViewMode('explorer');
      handleNavigation('home');
    }
    setIsMobileMenuOpen(false);
  }

  const filteredCourses = selectedSector === 'All'
    ? courses
    : courses.filter(c => c.sector === selectedSector);

  const Navbar = () => (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/10"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => handleNavigation('home')}
            >
              <img
                src="/images/geniusphere-logo.jpg"
                alt="Geniusphere Logo"
                className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform border border-white/10"
              />
              <span className="text-xl font-bold text-white tracking-tight group-hover:text-cyanGlow transition-colors">Geniusphere</span>
            </div>
          </div>


          <div className="hidden md:flex items-center gap-8">
            {/* Always show navigation links in explorer mode */}
            {viewMode === 'explorer' && (
              <>
                {['home', 'courses', 'services', 'resources'].map((item) => (
                  <button
                    key={item}
                    onClick={() => handleNavigation(item as View)}
                    className={`capitalize text-sm font-medium hover:text-cyanGlow transition-colors ${currentView === item ? 'text-cyanGlow' : 'text-slate-300'}`}
                  >
                    {item}
                  </button>
                ))}
                <div className="h-4 w-px bg-white/10"></div>
              </>
            )}

            <button
              onClick={handleModeChange}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group hover:border-cyanGlow/30"
            >
              <motion.div
                initial={false}
                animate={{ rotate: viewMode === 'explorer' ? 0 : 180 }}
              >
                {viewMode === 'explorer' ? <User size={16} className="text-blue-400" /> : <LayoutGrid size={16} className="text-softMint" />}
              </motion.div>
              <span className="text-xs font-medium text-white">
                {viewMode === 'explorer' ? 'Student View' : 'Admin Dashboard'}
              </span>
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-black border-b border-white/10 px-6 overflow-hidden"
          >
            <div className="py-4 space-y-4">
              {viewMode === 'explorer' ? (
                <>
                  <button onClick={() => handleNavigation('home')} className="block text-slate-300 hover:text-white w-full text-left">Home</button>
                  <button onClick={() => handleNavigation('courses')} className="block text-slate-300 hover:text-white w-full text-left">Courses</button>
                  <button onClick={() => handleNavigation('services')} className="block text-slate-300 hover:text-white w-full text-left">Services</button>
                  <button onClick={() => handleNavigation('resources')} className="block text-slate-300 hover:text-white w-full text-left">Resources</button>
                </>
              ) : (
                <button onClick={() => { handleNavigation('home'); setViewMode('explorer') }} className="flex items-center gap-2 text-cyanGlow w-full text-left font-bold">
                  <Home size={16} /> Back to Home
                </button>
              )}
              <div className="pt-4 mt-4 border-t border-white/10">
                <button onClick={handleModeChange} className="block text-slate-300 hover:text-white w-full text-left">
                  Switch to {viewMode === 'explorer' ? 'Admin Dashboard' : 'Student View'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );

  const Hero = () => (
    <section className="pt-40 pb-32 px-6 relative overflow-hidden min-h-[90vh] flex items-center justify-center">
      <div className="container mx-auto text-center relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-800/30 border border-white/10 backdrop-blur-md text-blue-300 text-xs font-bold uppercase tracking-widest mb-10 shadow-xl shadow-black/50"
        >
          <ShieldCheck size={14} className="text-cyanGlow" />
          <span>Verified Educational Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "backOut" }}
          className="text-6xl md:text-8xl font-extrabold text-white mb-8 tracking-tight leading-[1.1] drop-shadow-2xl"
        >
          Unlock Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyanGlow to-softMint text-glow">
            Digital Potential
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-14 leading-relaxed drop-shadow-md"
        >
          Geniusphere is your gateway to future-ready skills. Master AI, Finance, and Professional Development in a verified, immersive ecosystem.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 40px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('courses')}
            className="px-10 py-5 rounded-2xl bg-electric text-white font-bold shadow-2xl shadow-blue-600/30 w-full sm:w-auto flex items-center justify-center gap-3 text-lg"
          >
            Start Learning <Sparkles size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewLibrary('video')}
            className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold w-full sm:w-auto hover:border-white/20 text-lg backdrop-blur-md flex items-center justify-center gap-2"
          >
            <Video size={20} /> Resource Hub
          </motion.button>
        </motion.div>
      </div>
    </section>
  );

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-50 selection:bg-cyanGlow/30 selection:text-white overflow-x-hidden relative">
      {/* GLOBAL BACKGROUND - Z-Index 0 */}
      <BackgroundEffects />

      {appState === 'loading' && (
        <div className="relative z-50">
          <LoadingScreen onComplete={handleLoadingComplete} />
        </div>
      )}

      {appState === 'login' && (
        <div className="relative z-40">
          <LoginFlow onComplete={handleLoginComplete} />
        </div>
      )}

      {appState === 'app' && (
        <div className="relative z-10">
          {/* Show Navbar on all pages except Course Player and Local Space. */}
          {currentView !== 'course-player' && currentView !== 'local-space' && <Navbar />}

          <main className="min-h-screen">
            <AnimatePresence mode="wait">
              {viewMode === 'workspace' && currentView === 'dashboard' ? (
                <motion.div
                  key="dashboard"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="pt-20"
                >
                  <DashboardPreview
                    videos={videos} setVideos={setVideos}
                    galleryData={galleryData} setGalleryData={setGalleryData}
                    faqs={faqs} setFaqs={setFaqs}
                    testimonials={testimonials} setTestimonials={setTestimonials}
                    trainers={trainers} setTrainers={setTrainers}
                    resources={resources} setResources={setResources}
                    courses={courses} setCourses={setCourses}
                    ambassadors={ambassadors} setAmbassadors={setAmbassadors}
                    onSwitchMode={handleModeChange}
                  />
                </motion.div>
              ) : (
                <>
                  {currentView === 'home' && (
                    <motion.div
                      key="home"
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Hero />
                      <WhatIsGeniusphere />
                      <SectorTiles onExplore={handleSectorExplore} />
                      <VideoTestimonials items={testimonials} />
                      <ServicesGrid />
                      <ResourcesPreview onViewAll={handleViewLibrary} />
                      <TrainerProfile trainer={trainers[0]} />
                      <PhotoGallery galleryData={galleryData} onNavigate={handleNavigation} />
                      <CommunityEvents ambassadors={ambassadors} />
                      <FAQSection items={faqs} />
                      <SocialLinks />
                      <ContactSection />
                    </motion.div>
                  )}

                  {currentView === 'course-player' && activeCourse && (
                    <motion.div
                      key="course-player"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <CoursePlayer course={activeCourse} onExit={() => handleNavigation('courses')} />
                    </motion.div>
                  )}

                  {currentView === 'local-space' && (
                    <motion.div
                      key="local-space"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <LocalCommunitySpace onExit={() => handleNavigation('home')} />
                    </motion.div>
                  )}

                  {currentView === 'courses' && (
                    <motion.div
                      key="courses"
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="pt-32 pb-20 container mx-auto px-6"
                    >
                      <button onClick={() => handleNavigation('home')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group">
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/10"><ChevronLeft size={16} /></div>
                        <span className="text-sm font-bold uppercase tracking-wider">Back to Home</span>
                      </button>

                      <div className="mb-12">
                        <h2 className="text-4xl font-bold text-white mb-8">Course Catalog</h2>

                        <div className="flex flex-wrap gap-3 mb-12">
                          {['All', ...SECTORS.map(s => s.name)].map(sector => (
                            <button
                              key={sector}
                              onClick={() => setSelectedSector(sector)}
                              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 border ${selectedSector === sector
                                ? 'bg-electric border-electric text-white shadow-lg shadow-blue-500/30'
                                : 'bg-slate-900/50 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                              {sector}
                            </button>
                          ))}
                        </div>

                        <motion.div
                          layout
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                          <AnimatePresence>
                            {filteredCourses.map(course => (
                              <CourseCard
                                key={course.course_id}
                                course={course}
                                onStartSim={handleStartSim}
                                onClick={handleOpenCourse}
                              />
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {currentView === 'services' && (
                    <motion.div
                      key="services"
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="pt-32 pb-20 container mx-auto px-6"
                    >
                      <button onClick={() => handleNavigation('home')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group">
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/10"><ChevronLeft size={16} /></div>
                        <span className="text-sm font-bold uppercase tracking-wider">Back to Home</span>
                      </button>
                      <ServicesGrid />
                    </motion.div>
                  )}

                  {currentView === 'resources' && (
                    <motion.div
                      key="resources"
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <EducationalResources
                        resources={resources}
                        onNavigate={handleNavigation}
                        initialTab={resourceViewTab}
                      />
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </main>

          {/* Interactive Learning Modal */}
          <AnimatePresence>
            {activeSimulation && (
              <InteractiveLearning
                simulationId={activeSimulation}
                onClose={() => setActiveSimulation(null)}
                onNavigate={handleNavigation}
              />
            )}
          </AnimatePresence>

          <AiAssistant />

          {currentView !== 'course-player' && currentView !== 'local-space' && (
            <footer className="bg-black/80 backdrop-blur-md border-t border-white/5 py-16 text-center relative z-10">
              <div className="container mx-auto px-6">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <img
                    src="/images/geniusphere-logo.jpg"
                    alt="Geniusphere Logo"
                    className="w-16 h-16 rounded-xl object-cover border border-white/10"
                  />
                  <span className="text-2xl font-bold text-white">Geniusphere</span>
                </div>

                <div className="mb-8 text-slate-500 text-sm">
                  <a href="mailto:geniusphereofficial@gmail.com" className="hover:text-white transition-colors flex items-center justify-center gap-2">
                    <Mail size={14} /> geniusphereofficial@gmail.com
                  </a>
                </div>

                <p className="text-slate-600 text-sm">
                  © 2025 Geniusphere. Built for the next generation.
                </p>
              </div>
            </footer>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
