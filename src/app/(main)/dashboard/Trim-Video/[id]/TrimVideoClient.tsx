"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { ArrowLeft, Play, Pause, Scissors, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface TrimVideoClientProps {
    testimonial: any;
}

export function TrimVideoClient({ testimonial }: TrimVideoClientProps) {
    const router = useRouter();
    const videoUrl = testimonial.attachments?.find((a: any) => a.type === 'video')?.url ||
        (testimonial.type === 'video' ? testimonial.raw?.data?.media?.video_url : null);

    // Check if Cloudflare UID
    const isCloudflare = videoUrl && !videoUrl.includes('/') && !videoUrl.startsWith('http');

    const [duration, setDuration] = useState<number>(0);
    const [range, setRange] = useState<[number, number]>([0, 0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [currentTime, setCurrentTime] = useState<number>(0);

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const playbackRef = useRef<NodeJS.Timeout | null>(null);
    const rangeRef = useRef<[number, number]>([0, 0]);

    // Keep rangeRef in sync with range state
    useEffect(() => {
        rangeRef.current = range;
    }, [range]);

    // Fetch video duration from Cloudflare
    useEffect(() => {
        if (isCloudflare && videoUrl) {
            const fetchDuration = async () => {
                try {
                    // Method 1: Try the public video info endpoint
                    const infoResponse = await fetch(`https://videodelivery.net/${videoUrl}/manifest/video.m3u8`);
                    if (infoResponse.ok) {
                        const manifestText = await infoResponse.text();
                        // Parse duration from HLS manifest if available
                        const durationMatch = manifestText.match(/#EXT-X-STREAM-INF[^\n]*\n[^\n]*/);
                        console.log('Manifest fetched, trying alternative...');
                    }

                    // Method 2: Use the iframe player to get duration via postMessage
                    // This is complex, so let's try lifecycle first
                    const lifecycleResponse = await fetch(`https://videodelivery.net/${videoUrl}/lifecycle`);
                    if (lifecycleResponse.ok) {
                        const data = await lifecycleResponse.json();
                        console.log('Cloudflare lifecycle data:', data);
                        if (data.duration && data.duration > 0) {
                            setDuration(data.duration);
                            setRange([0, data.duration]);
                            setCurrentTime(0);
                            return;
                        }
                    }

                    // Method 3: Try the metadata JSON endpoint
                    const metaResponse = await fetch(`https://videodelivery.net/${videoUrl}/meta`);
                    if (metaResponse.ok) {
                        const metaData = await metaResponse.json();
                        console.log('Cloudflare meta data:', metaData);
                        if (metaData.duration && metaData.duration > 0) {
                            setDuration(metaData.duration);
                            setRange([0, metaData.duration]);
                            setCurrentTime(0);
                            return;
                        }
                    }

                    // Method 4: Fetch via server action (authenticated API)
                    try {
                        const response = await fetch(`/api/cloudflare/video-info?uid=${videoUrl}`);
                        if (response.ok) {
                            const data = await response.json();
                            if (data.duration && data.duration > 0) {
                                console.log('Got duration from API:', data.duration);
                                setDuration(data.duration);
                                setRange([0, data.duration]);
                                setCurrentTime(0);
                                return;
                            }
                        }
                    } catch (apiErr) {
                        console.log('API endpoint not available, using fallback');
                    }

                    // Fallback: Use a reasonable default
                    console.warn('Could not fetch video duration, using 60s fallback');
                    setDuration(60);
                    setRange([0, 60]);
                    setCurrentTime(0);
                } catch (err) {
                    console.error("Failed to fetch video duration:", err);
                    setDuration(60);
                    setRange([0, 60]);
                    setCurrentTime(0);
                }
            };

            fetchDuration();
        } else if (!isCloudflare) {
            setDuration(60);
            setRange([0, 60]);
            setCurrentTime(0);
        }
    }, [isCloudflare, videoUrl]);

    // Update preview URL when range changes (debounced ideally, but simple here)
    useEffect(() => {
        if (!isCloudflare || isPlaying) return; // Don't reset preview while playing
        const start = Math.floor(range[0]);
        const end = Math.ceil(range[1]);
        // Construct iframe URL with start/end time
        setPreviewUrl(`https://iframe.videodelivery.net/${videoUrl}?startTime=${start}&duration=${end - start}&autoplay=false`);
    }, [range, isCloudflare, videoUrl, isPlaying]);


    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
        const val = parseFloat(e.target.value);
        setRange(prev => {
            const newRange = [...prev] as [number, number];
            newRange[index] = val;
            // Validate
            if (newRange[0] < 0) newRange[0] = 0;
            if (newRange[1] > duration) newRange[1] = duration;
            if (newRange[0] > newRange[1]) {
                // If start > end, push end or stop start
                if (index === 0) newRange[1] = newRange[0];
                else newRange[0] = newRange[1];
            }
            return newRange;
        });
    };

    // Start playback animation (simulates playhead moving from start to end)
    const startPlayback = () => {
        // Clear any existing playback timer
        if (playbackRef.current) {
            clearInterval(playbackRef.current);
        }

        // Determine start time: resume if within valid range, otherwise restart
        let startTime = currentTime;
        // If playhead is before start or at/after end (with 0.1s buffer), restart
        if (startTime < range[0] || startTime >= range[1] - 0.1) {
            startTime = range[0];
        }

        setCurrentTime(startTime);
        setIsPlaying(true);

        const intervalMs = 100; // Update every 100ms

        playbackRef.current = setInterval(() => {
            setCurrentTime(prev => {
                const newTime = prev + (intervalMs / 1000);
                const currentEndTime = rangeRef.current[1]; // Get the LATEST end time from ref

                if (newTime >= currentEndTime) {
                    // Stop playback
                    setIsPlaying(false);
                    if (playbackRef.current) clearInterval(playbackRef.current);
                    return currentEndTime;
                }
                return newTime;
            });
        }, intervalMs);
    };

    // Stop playback
    const stopPlayback = () => {
        if (playbackRef.current) {
            clearInterval(playbackRef.current);
        }
        setIsPlaying(false);
    };

    const handleSaveTrim = async () => {
        toast.promise(
            async () => {
                // This would be a server action call
                // await trimVideo(testimonial.id, videoUrl, range[0], range[1]);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Mock
                // router.push('/dashboard');
            },
            {
                loading: 'Processing Trim (Mock)...',
                success: 'Video trimmed! (Mock executed)',
                error: 'Failed to trim'
            }
        );
    };

    if (!isCloudflare) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#09090b] text-white space-y-4">
                <p>Only Cloudflare-hosted videos can be trimmed.</p>
                <Link href="/dashboard" className="text-indigo-400 hover:underline">Go Back</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-50 flex flex-col">
            {/* Header */}
            <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#09090b]">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/Edit-Testimonial/${testimonial.id}`} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
                        <ArrowLeft className="size-5" />
                    </Link>
                    <h1 className="font-semibold text-lg">Trim Video</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="text-zinc-400 hover:text-white" onClick={() => router.back()}>Cancel</Button>
                    <Button
                        onClick={handleSaveTrim}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-medium"
                    >
                        <Scissors className="size-4" />
                        Trim & Save
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6 overflow-y-auto">

                {/* Video Preview - Controlled by Trim Selection */}
                <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl ring-1 ring-zinc-800 relative group">
                    {/* Centered Play/Pause Control Overlay */}
                    <div
                        className={`absolute inset-0 z-20 flex items-center justify-center cursor-pointer transition-colors duration-200 ${isPlaying ? 'bg-transparent hover:bg-black/10' : 'bg-transparent hover:bg-black/20'}`}
                        onClick={() => {
                            if (isPlaying) {
                                stopPlayback();
                            } else {
                                // Start playback logic matching the toolbar button
                                let startFrom = currentTime;
                                if (startFrom < range[0] || startFrom >= range[1] - 0.1) {
                                    startFrom = range[0];
                                }
                                const start = startFrom;
                                const end = range[1];
                                setPreviewUrl(`https://iframe.videodelivery.net/${videoUrl}?startTime=${start}&duration=${end - start}&autoplay=true`);
                                startPlayback();
                            }
                        }}
                    >
                        {/* Play/Pause Button Logic - Visible ONLY on hover */}
                        <div className={`size-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 hover:bg-white/30`}>
                            {isPlaying ? (
                                <Pause className="size-8 text-white fill-white" />
                            ) : (
                                <Play className="size-8 text-white fill-white ml-1" />
                            )}
                        </div>
                    </div>

                    {isPlaying ? (
                        <>
                            <iframe
                                key={previewUrl}
                                src={`${previewUrl}&controls=false&muted=false`}
                                className="w-full h-full pointer-events-none"
                                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                            ></iframe>
                        </>
                    ) : (
                        <>
                            {/* Static Thumbnail when not playing */}
                            <img
                                src={`https://videodelivery.net/${videoUrl}/thumbnails/thumbnail.jpg?time=${Math.floor(currentTime || range[0])}s&height=600`}
                                className="w-full h-full object-cover"
                                alt="Video Preview"
                            />
                        </>
                    )}
                </div>

                {/* Controls Panel */}
                <div className="w-full max-w-4xl bg-[#121214] rounded-xl border border-zinc-800/50 p-6 flex flex-col gap-6 shadow-xl">

                    {/* Time Display Row */}
                    <div className="flex items-center justify-between px-2">
                        <div className="text-zinc-500 font-mono text-xs">{formatTime(0)}</div>

                        <div className="flex gap-16">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Start Time</span>
                                <span className="text-xl font-medium font-mono text-zinc-200">{formatTime(range[0])}</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">End Time</span>
                                <span className="text-xl font-medium font-mono text-zinc-200">{formatTime(range[1])}</span>
                            </div>
                        </div>

                        <div className="text-zinc-500 font-mono text-xs">{formatTime(duration)}</div>
                    </div>

                    {/* Timeline Slider Section */}
                    <div className="relative h-24 w-full flex items-center select-none rounded-lg bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 border border-zinc-800/30">

                        {/* Waveform - Gray Background Layer (always visible) */}
                        <div className="absolute inset-x-6 h-14 flex items-end justify-between gap-[1px] pointer-events-none">
                            {Array.from({ length: 120 }).map((_, i) => {
                                const height = Math.max(20, Math.sin(i * 0.25) * 25 + Math.cos(i * 0.15) * 20 + 30);
                                return (
                                    <div
                                        key={i}
                                        className="flex-1 min-w-[2px] rounded-t-full bg-gradient-to-t from-zinc-800 via-zinc-700 to-zinc-600"
                                        style={{ height: `${height}%`, opacity: 0.4 }}
                                    />
                                );
                            })}
                        </div>

                        {/* Waveform - Blue Highlighted Layer (clipped to selection range) */}
                        <div
                            className="absolute inset-x-6 h-14 flex items-end justify-between gap-[1px] pointer-events-none"
                            style={{
                                clipPath: `inset(0 ${100 - (range[1] / duration) * 100}% 0 ${(range[0] / duration) * 100}%)`
                            }}
                        >
                            {Array.from({ length: 120 }).map((_, i) => {
                                const height = Math.max(20, Math.sin(i * 0.25) * 25 + Math.cos(i * 0.15) * 20 + 30);
                                return (
                                    <div
                                        key={i}
                                        className="flex-1 min-w-[2px] rounded-t-full bg-gradient-to-t from-blue-600 via-blue-400 to-cyan-300"
                                        style={{ height: `${height}%` }}
                                    />
                                );
                            })}
                        </div>

                        {/* Selection Zone Border */}
                        <div
                            className="absolute h-full pointer-events-none z-10"
                            style={{
                                left: `calc(${(range[0] / duration) * 100}% + 24px)`,
                                right: `calc(${100 - (range[1] / duration) * 100}% + 24px)`,
                                borderTop: '2px solid rgba(59, 130, 246, 0.5)',
                                borderBottom: '2px solid rgba(59, 130, 246, 0.5)',
                            }}
                        />

                        {/* Slider Container */}
                        <div className="absolute inset-x-6 h-full" id="slider-track">
                            {/* Start Handle - Premium Design */}
                            <div
                                className="absolute top-1 bottom-1 w-3 rounded-md z-30 flex items-center justify-center cursor-ew-resize touch-none group"
                                style={{
                                    left: `calc(${(range[0] / duration) * 100}% - 6px)`,
                                    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
                                    boxShadow: '0 0 15px rgba(59, 130, 246, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)',
                                }}
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.transform = 'scaleX(1.3)';
                                    e.currentTarget.style.boxShadow = '0 0 25px rgba(59, 130, 246, 0.8), 0 4px 20px rgba(0, 0, 0, 0.4)';
                                    const track = e.currentTarget.parentElement;
                                    if (!track) return;
                                    const rect = track.getBoundingClientRect();
                                    const handle = e.currentTarget;

                                    const moveHandler = (moveEvent: PointerEvent) => {
                                        const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
                                        const percentage = x / rect.width;
                                        const newTime = Math.min(percentage * duration, range[1] - 0.5);
                                        setRange([Math.max(0, newTime), range[1]]);
                                    };

                                    const upHandler = () => {
                                        handle.style.transform = '';
                                        handle.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)';
                                        document.removeEventListener('pointermove', moveHandler);
                                        document.removeEventListener('pointerup', upHandler);
                                    };

                                    document.addEventListener('pointermove', moveHandler);
                                    document.addEventListener('pointerup', upHandler);
                                }}
                            >
                                {/* Handle Grip Lines */}
                                <div className="flex flex-col gap-0.5 opacity-80 group-hover:opacity-100">
                                    <div className="w-1 h-0.5 bg-white/90 rounded-full"></div>
                                    <div className="w-1 h-0.5 bg-white/90 rounded-full"></div>
                                    <div className="w-1 h-0.5 bg-white/90 rounded-full"></div>
                                </div>
                            </div>

                            {/* End Handle - Premium Design */}
                            <div
                                className="absolute top-1 bottom-1 w-3 rounded-md z-30 flex items-center justify-center cursor-ew-resize touch-none group"
                                style={{
                                    left: `calc(${(range[1] / duration) * 100}% - 6px)`,
                                    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
                                    boxShadow: '0 0 15px rgba(59, 130, 246, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)',
                                }}
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.transform = 'scaleX(1.3)';
                                    e.currentTarget.style.boxShadow = '0 0 25px rgba(59, 130, 246, 0.8), 0 4px 20px rgba(0, 0, 0, 0.4)';
                                    const track = e.currentTarget.parentElement;
                                    if (!track) return;
                                    const rect = track.getBoundingClientRect();
                                    const handle = e.currentTarget;

                                    const moveHandler = (moveEvent: PointerEvent) => {
                                        const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
                                        const percentage = x / rect.width;
                                        const newTime = Math.max(percentage * duration, range[0] + 0.5);
                                        setRange([range[0], Math.min(duration, newTime)]);
                                    };

                                    const upHandler = () => {
                                        handle.style.transform = '';
                                        handle.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)';
                                        document.removeEventListener('pointermove', moveHandler);
                                        document.removeEventListener('pointerup', upHandler);
                                    };

                                    document.addEventListener('pointermove', moveHandler);
                                    document.addEventListener('pointerup', upHandler);
                                }}
                            >
                                {/* Handle Grip Lines */}
                                <div className="flex flex-col gap-0.5 opacity-80 group-hover:opacity-100">
                                    <div className="w-1 h-0.5 bg-white/90 rounded-full"></div>
                                    <div className="w-1 h-0.5 bg-white/90 rounded-full"></div>
                                    <div className="w-1 h-0.5 bg-white/90 rounded-full"></div>
                                </div>
                            </div>

                            {/* Playhead Indicator - Premium Draggable */}
                            <div
                                className="absolute top-0 bottom-0 w-5 z-50 cursor-ew-resize flex justify-center touch-none group"
                                style={{
                                    left: `calc(${Math.min(Math.max((currentTime / duration) * 100, (range[0] / duration) * 100), (range[1] / duration) * 100)}% - 10px)`
                                }}
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    // Stop any ongoing playback
                                    if (playbackRef.current) {
                                        clearInterval(playbackRef.current);
                                    }
                                    setIsPlaying(false);

                                    const track = e.currentTarget.parentElement;
                                    if (!track) return;
                                    const rect = track.getBoundingClientRect();

                                    const moveHandler = (moveEvent: PointerEvent) => {
                                        const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
                                        const percentage = x / rect.width;
                                        const newTime = percentage * duration;
                                        // Clamp between start and end
                                        const clampedTime = Math.max(range[0], Math.min(range[1], newTime));
                                        setCurrentTime(clampedTime);
                                    };

                                    const upHandler = () => {
                                        document.removeEventListener('pointermove', moveHandler);
                                        document.removeEventListener('pointerup', upHandler);
                                    };

                                    document.addEventListener('pointermove', moveHandler);
                                    document.addEventListener('pointerup', upHandler);
                                }}
                            >
                                {/* Visual Line with Glow */}
                                <div
                                    className="w-0.5 h-full transition-all duration-150 group-hover:w-1"
                                    style={{
                                        background: 'linear-gradient(to bottom, #c084fc, #a855f7, #9333ea)',
                                        boxShadow: '0 0 12px rgba(168, 85, 247, 0.8), 0 0 24px rgba(168, 85, 247, 0.4)',
                                    }}
                                />

                                {/* Playhead Top Diamond */}
                                <div
                                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 rounded-sm"
                                    style={{
                                        background: 'linear-gradient(135deg, #c084fc, #a855f7)',
                                        boxShadow: '0 0 8px rgba(168, 85, 247, 0.8)',
                                    }}
                                />

                                {/* Current Time Badge */}
                                <div
                                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-white text-[10px] font-mono px-2 py-1 rounded-md whitespace-nowrap font-medium"
                                    style={{
                                        background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                                        boxShadow: '0 2px 8px rgba(168, 85, 247, 0.4)',
                                    }}
                                >
                                    {formatTime(currentTime)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Toolbar */}
                    <div className="flex items-center justify-between pt-2">
                        <Button
                            variant="secondary"
                            className={`${isPlaying ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'} text-zinc-100 border w-36 justify-center transition-colors`}
                            onClick={() => {
                                if (isPlaying) {
                                    stopPlayback();
                                    // Don't reset preview here, let the UI switch to paused thumbnail at currentTime
                                } else {
                                    // Start playback
                                    // Calculate logic to determine start time (resume vs restart)
                                    let startFrom = currentTime;
                                    if (startFrom < range[0] || startFrom >= range[1] - 0.1) {
                                        startFrom = range[0];
                                    }

                                    const start = startFrom;
                                    const end = range[1]; // Play until the end of selection

                                    // We pass the exact start time to the iframe
                                    setPreviewUrl(`https://iframe.videodelivery.net/${videoUrl}?startTime=${start}&duration=${end - start}&autoplay=true`);
                                    startPlayback();
                                }
                            }}
                        >
                            {isPlaying ? (
                                <><Pause className="size-3.5 mr-2 fill-current" />Pause</>
                            ) : (
                                <><Play className="size-3.5 mr-2 fill-current" />Play Preview</>
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            className="text-zinc-500 hover:text-white hover:bg-transparent"
                            onClick={() => {
                                setRange([0, duration]);
                                setPreviewUrl(`https://iframe.videodelivery.net/${videoUrl}?autoplay=false`);
                            }}
                        >
                            {/* RefreshCcw usually used for Reset */}
                            <svg className="size-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74-2.74L3 12" /><path d="M3 3v9h9" /></svg>
                            Reset
                        </Button>
                    </div>

                </div>

            </div>
        </div>
    );
}

function formatTime(seconds: number) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${min}:${sec.toString().padStart(2, '0')}.${ms}`;
}
