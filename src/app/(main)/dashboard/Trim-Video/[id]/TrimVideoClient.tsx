"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Stream } from "@cloudflare/stream-react";

import { ArrowLeft, Play, Pause, Scissors, RotateCcw } from "lucide-react";
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
    const [currentTime, setCurrentTime] = useState<number>(0);

    const streamRef = useRef<any>(null);
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
                    // Try lifecycle API for duration
                    const lifecycleResponse = await fetch(`https://videodelivery.net/${videoUrl}/lifecycle`);
                    if (lifecycleResponse.ok) {
                        const data = await lifecycleResponse.json();
                        if (data.duration && data.duration > 0) {
                            setDuration(data.duration);
                            setRange([0, data.duration]);
                            return;
                        }
                    }

                    // Fallback to Meta if needed
                    const metaResponse = await fetch(`https://videodelivery.net/${videoUrl}/meta`);
                    if (metaResponse.ok) {
                        const metaData = await metaResponse.json();
                        if (metaData.duration) {
                            setDuration(metaData.duration);
                            setRange([0, metaData.duration]);
                            return;
                        }
                    }

                    // Fallback to server action
                    try {
                        const response = await fetch(`/api/cloudflare/video-info?uid=${videoUrl}`);
                        if (response.ok) {
                            const data = await response.json();
                            if (data.duration && data.duration > 0) {
                                setDuration(data.duration);
                                setRange([0, data.duration]);
                                return;
                            }
                        }
                    } catch (apiErr) {
                        // ignore
                    }
                } catch (err) {
                    console.error("Failed to fetch video duration:", err);
                    setDuration(60);
                    setRange([0, 60]);
                }
            };
            fetchDuration();
        } else if (!isCloudflare) {
            setDuration(60);
            setRange([0, 60]);
        }
    }, [isCloudflare, videoUrl]);

    // Playback Controls
    const togglePlayback = () => {
        if (!streamRef.current) return;

        if (isPlaying) {
            streamRef.current.pause();
        } else {
            let startFrom = currentTime;
            // Buffer of 0.1s to handle end-of-loop cases
            if (startFrom < range[0] || startFrom >= range[1] - 0.1) {
                startFrom = range[0];
            }
            streamRef.current.currentTime = startFrom;
            streamRef.current.play();
        }
    };

    // Called by Stream player on time update
    const handleTimeUpdate = (e: any) => {
        // Attempt to get time from event detail (Cloudflare custom event) or fall back to ref
        const time = e.detail?.currentTime ?? streamRef.current?.currentTime ?? 0;
        setCurrentTime(time);

        // Check Loop/Stop condition
        if (rangeRef.current && time >= rangeRef.current[1]) {
            streamRef.current?.pause();
        }
    };

    const handleSaveTrim = async () => {
        toast.promise(
            async () => {
                await new Promise(resolve => setTimeout(resolve, 2000)); // Mock
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

                {/* Video Preview Container */}
                <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl ring-1 ring-zinc-800 relative group">

                    {/* Cloudflare Stream Player */}
                    <Stream
                        src={videoUrl}
                        streamRef={streamRef}
                        controls={false}
                        responsive={true}
                        className="w-full h-full"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetaData={(e: any) => {
                            if (e.detail.duration > 0 && duration === 0) {
                                setDuration(e.detail.duration);
                                setRange([0, e.detail.duration]);
                            }
                        }}
                    />

                    {/* Centered Play/Pause Control Overlay */}
                    <div
                        className={`absolute inset-0 z-20 flex items-center justify-center cursor-pointer transition-colors duration-200 ${isPlaying ? 'bg-transparent hover:bg-black/20' : 'bg-transparent hover:bg-black/10'}`}
                        onClick={togglePlayback}
                    >
                        {/* Play/Pause Button Icon */}
                        <div className={`size-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 hover:bg-white/30`}>
                            {isPlaying ? (
                                <Pause className="size-8 text-white fill-white" />
                            ) : (
                                <Play className="size-8 text-white fill-white ml-1" />
                            )}
                        </div>
                    </div>
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

                        {/* Waveform - Gray Background Layer */}
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

                        {/* Waveform - Blue Highlighted Layer (clipped) */}
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
                            {/* Start Handle */}
                            <div
                                className="absolute top-1 bottom-1 w-3 rounded-md z-50 flex items-center justify-center cursor-ew-resize touch-none group"
                                style={{
                                    left: `calc(${duration > 0 ? (range[0] / duration) * 100 : 0}% - 6px)`,
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
                                        // Minimum gap of 12px in terms of time
                                        const minGapPixels = 12;
                                        const minGapTime = (minGapPixels / rect.width) * duration;
                                        const newStartTime = Math.max(0, Math.min(percentage * duration, range[1] - Math.max(0.5, minGapTime)));
                                        setRange([newStartTime, range[1]]);

                                        // Keep playhead within range - if start moves past playhead, snap it
                                        if (currentTime < newStartTime) {
                                            setCurrentTime(newStartTime);
                                            if (streamRef.current) {
                                                streamRef.current.currentTime = newStartTime;
                                            }
                                        }
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
                                <div className="flex flex-col gap-0.5 opacity-80 group-hover:opacity-100">
                                    <div className="w-1 h-0.5 bg-white/90 rounded-full"></div>
                                    <div className="w-1 h-0.5 bg-white/90 rounded-full"></div>
                                    <div className="w-1 h-0.5 bg-white/90 rounded-full"></div>
                                </div>
                            </div>

                            {/* End Handle */}
                            <div
                                className="absolute top-1 bottom-1 w-3 rounded-md z-50 flex items-center justify-center cursor-ew-resize touch-none group"
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
                                        // Minimum gap of 12px in terms of time
                                        const minGapPixels = 12;
                                        const minGapTime = (minGapPixels / rect.width) * duration;
                                        const newEndTime = Math.min(duration, Math.max(percentage * duration, range[0] + Math.max(0.5, minGapTime)));
                                        setRange([range[0], newEndTime]);

                                        // Keep playhead within range - if end moves before playhead, snap it
                                        if (currentTime > newEndTime) {
                                            setCurrentTime(newEndTime);
                                            if (streamRef.current) {
                                                streamRef.current.currentTime = newEndTime;
                                            }
                                        }
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
                                <div className="flex flex-col gap-0.5 opacity-80 group-hover:opacity-100">
                                    <div className="w-1 h-0.5 bg-white/90 rounded-full"></div>
                                    <div className="w-1 h-0.5 bg-white/90 rounded-full"></div>
                                    <div className="w-1 h-0.5 bg-white/90 rounded-full"></div>
                                </div>
                            </div>

                            {/* Playhead Indicator - Draggable */}
                            <div
                                className="absolute top-0 bottom-0 w-5 z-30 cursor-ew-resize flex justify-center touch-none group"
                                style={{
                                    left: `calc(${duration > 0 ? Math.min(
                                        Math.max((currentTime / duration) * 100, (range[0] / duration) * 100),
                                        (range[1] / duration) * 100
                                    ) : 0}% - 10px)`
                                }}
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const track = e.currentTarget.parentElement;
                                    if (!track) return;
                                    const rect = track.getBoundingClientRect();

                                    const moveHandler = (moveEvent: PointerEvent) => {
                                        const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
                                        const percentage = x / rect.width;
                                        const newTime = percentage * duration;

                                        // Seeking logic
                                        const clampedTime = Math.max(range[0], Math.min(range[1], newTime));

                                        if (streamRef.current) {
                                            streamRef.current.currentTime = clampedTime;
                                        }
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
                                <div
                                    className="w-0.5 h-full"
                                    style={{
                                        background: 'linear-gradient(to bottom, #c084fc, #a855f7, #9333ea)',
                                        boxShadow: '0 0 12px rgba(168, 85, 247, 0.8), 0 0 24px rgba(168, 85, 247, 0.4)',
                                    }}
                                />
                                <div
                                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 rounded-sm"
                                    style={{
                                        background: 'linear-gradient(135deg, #c084fc, #a855f7)',
                                        boxShadow: '0 0 8px rgba(168, 85, 247, 0.8)',
                                    }}
                                />
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
                            onClick={togglePlayback}
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
                                if (streamRef.current) {
                                    streamRef.current.currentTime = 0;
                                    streamRef.current.pause();
                                }
                            }}
                        >
                            <RotateCcw className="size-4 mr-2" />
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
