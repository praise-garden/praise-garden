import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Upload, RotateCcw, ArrowRight, X, Play } from 'lucide-react';

interface MobileVideoCaptureProps {
    onCancel: () => void;
    onComplete: (videoBlob: Blob) => void;
    theme?: { primaryColor?: string };
}

const MobileVideoCapture: React.FC<MobileVideoCaptureProps> = ({ onCancel, onComplete, theme }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [capturedVideo, setCapturedVideo] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Clean up video URL on unmount
    useEffect(() => {
        return () => {
            if (videoUrl) URL.revokeObjectURL(videoUrl);
        };
    }, [videoUrl]);

    // Handle file selection from native camera
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCapturedVideo(file);
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
        }
    };

    // Trigger file input (opens native camera)
    const handleOpenCamera = () => {
        fileInputRef.current?.click();
    };

    // Retake - clear the captured video and open camera again
    const handleRetake = () => {
        if (videoUrl) URL.revokeObjectURL(videoUrl);
        setVideoUrl(null);
        setCapturedVideo(null);
        setIsPlaying(false);

        // Reset the file input so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Open camera again
        setTimeout(() => {
            fileInputRef.current?.click();
        }, 100);
    };

    // Continue - pass the video blob to parent
    const handleContinue = () => {
        if (capturedVideo) {
            onComplete(capturedVideo);
        }
    };

    // Toggle video playback
    const togglePlayback = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-6">
            {/* Hidden file input for native camera capture */}
            <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
            />

            <AnimatePresence mode="wait">
                {!capturedVideo ? (
                    // Initial state - Show capture options
                    <motion.div
                        key="capture-options"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-md text-center"
                    >
                        {/* Close button */}
                        <div className="flex justify-start mb-6">
                            <button
                                onClick={onCancel}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Icon */}
                        <div
                            className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 border"
                            style={{
                                background: `linear-gradient(to bottom right, ${theme?.primaryColor || '#A855F7'}33, ${theme?.primaryColor || '#A855F7'}33)`,
                                borderColor: `${theme?.primaryColor || '#A855F7'}4D`
                            }}
                        >
                            <Video className="w-12 h-12" style={{ color: theme?.primaryColor || '#A855F7' }} />
                        </div>

                        {/* Title & Description */}
                        <h2 className="text-xl font-semibold text-white mb-2">Record Your Testimonial</h2>
                        <p className="text-sm text-gray-400 mb-8">
                            Tap the button below to open your camera and record a short video testimonial.
                        </p>

                        {/* Record Button */}
                        <button
                            onClick={handleOpenCamera}
                            className="w-full py-4 px-6 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-3"
                            style={{
                                backgroundColor: theme?.primaryColor || '#A855F7',
                                boxShadow: `0 10px 15px -3px ${theme?.primaryColor || '#A855F7'}40`
                            }}
                        >
                            <Video className="w-5 h-5" />
                            <span>Open Camera to Record</span>
                        </button>

                        {/* Alternative: Upload existing video */}
                        <div className="mt-4">
                            <button
                                onClick={() => {
                                    // Remove capture attribute to allow file selection
                                    if (fileInputRef.current) {
                                        fileInputRef.current.removeAttribute('capture');
                                        fileInputRef.current.click();
                                        // Restore capture attribute after click
                                        setTimeout(() => {
                                            fileInputRef.current?.setAttribute('capture', 'environment');
                                        }, 100);
                                    }
                                }}
                                className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 font-semibold rounded-xl transition-all flex items-center justify-center gap-3"
                            >
                                <Upload className="w-5 h-5 text-gray-400" />
                                <span>Upload Video File</span>
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    // Preview state - Show captured video
                    <motion.div
                        key="video-preview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-md"
                    >
                        {/* Video Preview */}
                        <div className="relative w-full aspect-[9/16] max-h-[50vh] rounded-2xl overflow-hidden bg-black shadow-2xl mb-6">
                            <video
                                ref={videoRef}
                                src={videoUrl || undefined}
                                className="w-full h-full object-contain"
                                playsInline
                                controls
                                onEnded={() => setIsPlaying(false)}
                            />
                        </div>

                        {/* Preview Label */}
                        <div className="text-center mb-6">
                            <p className="text-sm text-gray-400">
                                Preview your video. You can retake if needed.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between gap-4">
                            <button
                                onClick={handleRetake}
                                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-all"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span>Retake</span>
                            </button>

                            <button
                                onClick={handleContinue}
                                className="flex-1 group flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all"
                                style={{
                                    backgroundColor: theme?.primaryColor || '#A855F7',
                                    boxShadow: `0 10px 15px -3px ${theme?.primaryColor || '#A855F7'}33`
                                }}
                            >
                                <span>Continue</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MobileVideoCapture;
