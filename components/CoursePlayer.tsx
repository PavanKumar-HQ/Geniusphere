




import React, { useState, useEffect } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { 
    Play, CheckCircle, Lock, Menu, ChevronLeft, Award, 
    Download, Clock, AlertCircle, FileText, Youtube, Zap
} from 'lucide-react';
import { Course, CourseModule } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { InteractiveLearning } from './InteractiveLearning';

const motion = motionBase as any;

interface CoursePlayerProps {
    course: Course;
    onExit: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ course, onExit }) => {
    const [currentModuleId, setCurrentModuleId] = useState<string>(course.modules?.[0]?.id || "");
    const [progress, setProgress] = useState<Record<string, boolean>>({}); // moduleId -> watched
    const [viewState, setViewState] = useState<'video' | 'quiz' | 'certificate' | 'simulation'>('video');
    const [isVideoCompleted, setIsVideoCompleted] = useState(false);
    
    // Quiz State
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [quizScore, setQuizScore] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>((course.quiz?.timeLimit || 30) * 60);
    const [isQuizActive, setIsQuizActive] = useState(false);

    // Certificate State
    const [studentName, setStudentName] = useState("");

    const activeModule = course.modules?.find(m => m.id === currentModuleId);
    const activeModuleIndex = course.modules?.findIndex(m => m.id === currentModuleId) || 0;
    
    const allModulesWatched = course.modules?.every(m => progress[m.id]);
    
    // Reset video completion state when changing modules
    useEffect(() => {
        setIsVideoCompleted(false);
    }, [currentModuleId]);

    // Quiz Timer
    useEffect(() => {
        let timer: any;
        if (isQuizActive && timeLeft > 0 && quizScore === null) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isQuizActive) {
            handleQuizSubmit(); // Auto submit
        }
        return () => clearInterval(timer);
    }, [isQuizActive, timeLeft, quizScore]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleVideoEnded = () => {
        setIsVideoCompleted(true);
    };

    const handleMarkWatched = () => {
        if (!activeModule) return;
        setProgress(prev => ({ ...prev, [activeModule.id]: true }));
        
        // Auto advance if next exists
        const nextIndex = activeModuleIndex + 1;
        if (course.modules && nextIndex < course.modules.length) {
             setCurrentModuleId(course.modules[nextIndex].id);
        }
    };

    const startQuiz = () => {
        setIsQuizActive(true);
        setTimeLeft((course.quiz?.timeLimit || 30) * 60);
    }

    const handleQuizSubmit = () => {
        if (!course.quiz) return;
        setIsQuizActive(false);
        let correct = 0;
        course.quiz.questions.forEach((q, idx) => {
            if (quizAnswers[idx] === q.correctIndex) correct++;
        });
        const score = (correct / course.quiz.questions.length) * 100;
        setQuizScore(score);
        if (score >= course.quiz.passThreshold) {
            setTimeout(() => setViewState('certificate'), 2000);
        }
    };

    const handleDownloadCertificate = () => {
        if(!studentName) {
            alert("Please enter your full name for the certificate.");
            return;
        }
        alert(`Generating PDF Certificate for ${studentName}... (Simulated Download)`);
    };

    const renderVideoPlayer = () => {
        const isSimulationModule = activeModuleIndex === (course.modules?.length || 0) - 1 || activeModuleIndex === 10;

        return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
                        {activeModule && (
                            <VideoPlayer 
                                url={activeModule.videoUrl} 
                                playing={false} 
                                onEnded={handleVideoEnded}
                            />
                        )}
                        {!activeModule && (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                                Select a module to begin
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold bg-blue-600/20 text-blue-400 px-2 py-1 rounded">Module {activeModuleIndex + 1}</span>
                                <h2 className="text-2xl font-bold text-white">{activeModule?.title}</h2>
                            </div>
                            <p className="text-slate-400">{activeModule?.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <button 
                                onClick={handleMarkWatched}
                                disabled={progress[currentModuleId] || !isVideoCompleted}
                                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all w-full justify-center ${
                                    progress[currentModuleId] 
                                    ? 'bg-green-500/20 text-green-400 cursor-default border border-green-500/30' 
                                    : isVideoCompleted
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5 opacity-50'
                                }`}
                                title={!isVideoCompleted && !progress[currentModuleId] ? "Watch full video to unlock" : ""}
                            >
                                {progress[currentModuleId] ? <><CheckCircle size={20}/> Completed</> : isVideoCompleted ? "Mark as Watched" : <><Lock size={16} /> Locked</>}
                            </button>
                            
                            {/* Persistent Simulation Button */}
                            {course.simulationId && (
                                <button 
                                    onClick={() => setViewState('simulation')}
                                    className="px-6 py-2 rounded-xl font-bold flex items-center gap-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600 hover:text-white transition-all w-full justify-center"
                                >
                                     <Zap size={16} /> Lab
                                </button>
                            )}

                            {!isVideoCompleted && !progress[currentModuleId] && (
                                <span className="text-[10px] text-orange-400 flex items-center gap-1"><AlertCircle size={10}/> Finish video to continue</span>
                            )}
                        </div>
                    </div>
                    
                    {/* Special Section for Simulation Module */}
                    {isSimulationModule && (
                        <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-6 rounded-2xl border border-purple-500/30 animate-pulse-slow">
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Zap size={20} className="text-yellow-400"/> Interactive Particle Simulation</h3>
                            <p className="text-slate-300 text-sm mb-4">Engage with the practical concepts through our real-time particle simulation lab.</p>
                            <button 
                                onClick={() => setViewState('simulation')}
                                className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg flex items-center gap-2 hover:scale-105 transform duration-200"
                            >
                                Launch Simulation <Play size={16} fill="black" />
                            </button>
                        </div>
                    )}

                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FileText size={18} className="text-cyan-400"/> Video Notes & Summary</h3>
                        <div className="prose prose-invert max-w-none text-slate-300">
                             <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                {activeModule?.contentMarkdown || "No additional notes for this module."}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    };

    const renderQuiz = () => (
        <div className="flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar flex justify-center">
            <div className="max-w-2xl w-full space-y-8 pb-10">
                <div className="text-center">
                    <div className="inline-block p-3 rounded-full bg-purple-500/10 mb-4">
                        <Award size={32} className="text-purple-400"/>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Final Certification Exam</h2>
                    <p className="text-slate-400">Score at least {course.quiz?.passThreshold}% to earn your certificate.</p>
                </div>

                {!isQuizActive && quizScore === null ? (
                    <div className="bg-slate-900/60 p-8 rounded-2xl border border-white/10 text-center">
                        <div className="text-4xl mb-4">⏱️</div>
                        <h3 className="text-xl font-bold text-white mb-2">Time Limit: {course.quiz?.timeLimit || 30} Minutes</h3>
                        <p className="text-slate-400 mb-6">Once you start, the timer will begin. Good luck!</p>
                        <button 
                            onClick={startQuiz}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all"
                        >
                            Start Exam Now
                        </button>
                    </div>
                ) : (
                    <>
                        {isQuizActive && (
                             <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md p-4 rounded-xl border border-white/10 flex justify-between items-center mb-6 shadow-xl">
                                <span className="text-slate-400 font-bold">Exam in Progress</span>
                                <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
                                    <Clock size={20}/> {formatTime(timeLeft)}
                                </div>
                            </div>
                        )}

                        {course.quiz?.questions.map((q, idx) => (
                            <div key={idx} className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 shadow-sm">
                                <p className="text-white font-semibold mb-4 text-lg">
                                    <span className="text-slate-500 mr-2">{idx + 1}.</span>
                                    {q.text}
                                </p>
                                <div className="space-y-2">
                                    {q.options.map((opt, optIdx) => (
                                        <button 
                                            key={optIdx}
                                            disabled={quizScore !== null}
                                            onClick={() => !quizScore && setQuizAnswers(prev => ({...prev, [idx]: optIdx}))}
                                            className={`w-full text-left p-4 rounded-xl border transition-all relative ${
                                                quizAnswers[idx] === optIdx 
                                                ? 'bg-blue-600/20 border-blue-500 text-white' 
                                                : 'bg-black/20 border-white/5 text-slate-300 hover:bg-white/5'
                                            } ${quizScore !== null && q.correctIndex === optIdx ? 'bg-green-500/20 border-green-500 !text-green-400' : ''}
                                            ${quizScore !== null && quizAnswers[idx] === optIdx && q.correctIndex !== optIdx ? 'bg-red-500/20 border-red-500 !text-red-400' : ''}
                                            `}
                                        >
                                            {opt}
                                            {quizScore !== null && q.correctIndex === optIdx && (
                                                <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"/>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {quizScore === null ? (
                            <button 
                                onClick={handleQuizSubmit}
                                disabled={Object.keys(quizAnswers).length < (course.quiz?.questions.length || 0)}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-purple-500/20 transition-all text-lg"
                            >
                                Submit Exam
                            </button>
                        ) : (
                            <div className={`p-8 rounded-2xl text-center border-2 ${quizScore >= (course.quiz?.passThreshold || 70) ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'}`}>
                                <h3 className={`text-3xl font-bold mb-2 ${quizScore >= (course.quiz?.passThreshold || 70) ? 'text-green-400' : 'text-red-400'}`}>
                                    You Scored {quizScore.toFixed(0)}%
                                </h3>
                                <p className="text-slate-300 mb-6">
                                    {quizScore >= (course.quiz?.passThreshold || 70) 
                                    ? "Congratulations! You have passed the exam." 
                                    : "You didn't reach the passing threshold. Please review the material and try again."}
                                </p>
                                {quizScore < (course.quiz?.passThreshold || 70) && (
                                    <button onClick={() => { setQuizScore(null); setQuizAnswers({}); setIsQuizActive(false); }} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors">
                                        Retake Exam
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );

    const renderCertificate = () => (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] overflow-y-auto">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 border-4 double border-yellow-500 p-8 md:p-12 rounded-xl max-w-3xl w-full text-center shadow-[0_0_50px_rgba(234,179,8,0.2)] relative overflow-hidden my-auto"
            >
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-yellow-500 m-4"/>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-yellow-500 m-4"/>

                <Award size={64} className="text-yellow-400 mx-auto mb-6" />
                <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">Certificate of Completion</h1>
                <p className="text-slate-400 mb-8 uppercase tracking-widest text-sm">Geniusphere Academy Verified</p>
                
                <p className="text-slate-300 mb-2">This is to certify that</p>
                
                <input 
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter Your Full Name"
                    className="w-full max-w-md mx-auto bg-transparent border-b-2 border-slate-600 text-center text-3xl font-serif text-white focus:border-yellow-500 outline-none placeholder-slate-600 py-2 mb-8"
                />

                <p className="text-slate-300 mb-4">has successfully completed the course</p>

                <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 mb-12 inline-block max-w-xl">
                    {course.title}
                </h2>

                <div className="flex justify-between items-end mt-8 px-4 md:px-12 gap-8">
                    <div className="text-left">
                        <div className="w-32 md:w-48 border-b border-slate-600 mb-2 pb-1 font-['cursive'] text-xl text-white">Dr. Evelyn Reed</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500">Lead Instructor</div>
                    </div>
                    <div className="w-16 h-16 md:w-24 md:h-24 opacity-80">
                         <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Seal_of_the_Department_of_Homeland_Security.svg/1200px-Seal_of_the_Department_of_Homeland_Security.svg.png" className="w-full h-full object-contain opacity-20 grayscale" alt="Seal"/>
                    </div>
                    <div className="text-right">
                        <div className="w-32 md:w-48 border-b border-slate-600 mb-2 pb-1 text-white">{new Date().toLocaleDateString()}</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500">Date Issued</div>
                    </div>
                </div>
            </motion.div>
            
            <div className="mt-8 flex gap-4">
                <button 
                    onClick={handleDownloadCertificate}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                >
                    <Download size={18}/> Download PDF
                </button>
                 <button 
                    onClick={onExit}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full flex items-center gap-2 transition-all"
                >
                    Back to Catalog
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[60] bg-black text-white flex flex-col md:flex-row">
            {/* Sidebar (Responsive) */}
            <div className="w-full md:w-96 bg-slate-900 border-r border-white/10 flex flex-col h-[30vh] md:h-auto overflow-hidden">
                <div className="p-4 md:p-6 border-b border-white/10 bg-slate-950">
                    <button onClick={onExit} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 text-xs font-bold uppercase tracking-wider">
                        <ChevronLeft size={14}/> Back to Dashboard
                    </button>
                    <h1 className="font-bold text-lg md:text-xl leading-tight text-white">{course.title}</h1>
                    <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
                        <Clock size={12}/> <span>{course.duration}</span>
                        <span>•</span>
                        <span>{course.modules?.length} Modules</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500" 
                            style={{width: `${(Object.keys(progress).length / (course.modules?.length || 1)) * 100}%`}}
                        />
                    </div>
                    <div className="text-right text-xs text-cyan-400 mt-1 font-bold">
                        {Math.round((Object.keys(progress).length / (course.modules?.length || 1)) * 100)}% Complete
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900/50">
                    {course.modules?.map((mod, idx) => (
                        <button 
                            key={mod.id}
                            onClick={() => { setViewState('video'); setCurrentModuleId(mod.id); }}
                            className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-all flex gap-3 group relative ${
                                currentModuleId === mod.id ? 'bg-blue-600/10' : ''
                            }`}
                        >
                            {/* Active Indicator Strip */}
                            {currentModuleId === mod.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"/>}

                            <div className="mt-1 shrink-0">
                                {progress[mod.id] 
                                    ? (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -90 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                        >
                                            <CheckCircle size={18} className="text-green-500"/>
                                        </motion.div>
                                    )
                                    : <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${currentModuleId === mod.id ? 'border-blue-400' : 'border-slate-600'}`}>
                                        <span className={`text-[10px] font-bold ${currentModuleId === mod.id ? 'text-blue-400' : 'text-slate-500'}`}>{idx+1}</span>
                                      </div>
                                }
                            </div>
                            <div>
                                <div className={`text-sm font-medium ${currentModuleId === mod.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                    {mod.title}
                                </div>
                                <div className="text-xs text-slate-600 mt-1 flex items-center gap-1 group-hover:text-slate-500">
                                    <Clock size={10}/> {mod.duration}
                                </div>
                                {(idx === 10 || idx === (course.modules?.length || 0) - 1) && <span className="text-[10px] text-purple-400 mt-1 block">★ Particle Simulation</span>}
                            </div>
                        </button>
                    ))}

                    <button
                        disabled={!allModulesWatched}
                        onClick={() => setViewState('quiz')}
                        className={`w-full text-left p-4 flex gap-3 border-t border-white/10 ${
                            viewState === 'quiz' || viewState === 'certificate' ? 'bg-purple-600/10' : ''
                        } ${!allModulesWatched ? 'opacity-50 cursor-not-allowed bg-slate-950/50' : 'hover:bg-purple-500/5 cursor-pointer bg-slate-950'}`}
                    >
                         {viewState === 'quiz' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"/>}
                         <div className="mt-1">
                            {allModulesWatched ? <Award size={18} className="text-purple-400"/> : <Lock size={18} className="text-slate-600"/>}
                         </div>
                         <div>
                            <div className="text-sm font-bold text-white">Final Certification Exam</div>
                            <div className="text-xs text-slate-500 mt-1">
                                {allModulesWatched ? "Ready to start" : "Unlock by completing all modules"}
                            </div>
                         </div>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gradient-to-br from-slate-900 to-black flex flex-col h-[70vh] md:h-auto overflow-hidden">
                {viewState === 'video' && renderVideoPlayer()}
                {viewState === 'quiz' && renderQuiz()}
                {viewState === 'certificate' && renderCertificate()}
                {viewState === 'simulation' && (
                    <InteractiveLearning 
                        simulationId={course.simulationId || 'default'} 
                        onClose={() => setViewState('video')}
                        onNavigate={() => {}} 
                    />
                )}
            </div>
        </div>
    );
};