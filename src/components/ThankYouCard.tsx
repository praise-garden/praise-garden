import React from 'react';
import Image from 'next/image';
import { PageItem, FormCardProps } from '@/app/dashboard/form-builder/page';
import { FormCard } from '@/app/dashboard/form-builder/page';
import AppBar from '@/components/ui/app-bar';

interface ThankYouCardProps extends FormCardProps {}

const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 300 300.251" stroke="currentColor" fill="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path fill="currentColor" d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66"></path>
    </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect width="4" height="12" x="2" y="9"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);

const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
);

const ThankYouCard: React.FC<ThankYouCardProps> = (props) => {
    return (
        <FormCard {...props}>
            <div className="flex-grow flex overflow-hidden">
                <div className="flex-grow flex flex-col items-center overflow-y-auto">
                    <AppBar showBackButton={false} maxWidthClass="max-w-3xl" paddingXClass="px-6" />
                    <div className="w-full px-6 pt-8 pb-6">
                    <div className="mx-auto flex w-full max-w-3xl flex-col items-stretch">
                        <h1 className="text-xl sm:text-2xl font-bold leading-normal text-white">Thank you!</h1>
                        <div className="content text-sm text-gray-400 sm:text-base mt-2">
                            <p>Thank you so much for leaving a testimonial! Testimonials help me grow my business. They're the best way of helping me out if you read and enjoy my work.</p>
                        </div>
                        <div className="my-6">
                            <button className="mt-4 flex w-full items-center justify-center gap-4 rounded-lg border border-gray-700 bg-[#1E1E1E] px-4 py-2 text-center text-2xl tracking-wider text-gray-400 font-mono">
                                EXAMPLECODE <CopyIcon className="text-gray-500 w-6 h-6" />
                            </button>
                        </div>
                        
                    </div>
                    </div>
                </div>
                <div className="flex-none lg:w-1/2 bg-[#1E1E1E] border-l border-gray-800">
                    <div className="flex h-full w-full flex-col p-4">
                        <div className="mx-auto my-2 flex max-w-sm flex-col items-center gap-4 text-center">
                            <div className="font-sans mb-2 mt-2 flex items-center gap-4 text-center text-xs font-medium text-gray-500 w-full">
                                <hr className="w-full border-gray-700" />
                                <div className="flex flex-none items-center gap-2">Share on X</div>
                                <hr className="w-full border-gray-700" />
                            </div>
                            <div className="group relative mx-auto flex w-full items-start gap-4 rounded-lg border border-gray-700 bg-black/30 p-4 text-left text-sm text-white shadow-lg">
                                <div className="flex flex-1 flex-wrap items-start justify-start">
                                    <div className="flex flex-1 items-center">
                                        <div className="flex w-full flex-col">
                                            <div className="flex flex-1 items-center gap-2">
                                                <img alt="" src="https://ui-avatars.com/api/Tony%20Stark/200/dcfce7/166534/2/0.34" className="h-10 w-10 rounded-full object-cover" />
                                                <div>
                                                    <div className="mr-2 flex items-center gap-2 font-bold text-gray-200 text-sm">
                                                        <div>Tony Stark</div>
                                                    </div>
                                                    <div className="-mt-1 mr-1 text-xs text-gray-500">CEO at Stark Industries</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <p className="content mt-3 whitespace-pre-line text-sm text-gray-300">
                                            When your customer leaves a testimonial, they will see it here.
                                        </p>
                                    </div>
                                    <button className="mt-4 flex w-full rounded-[8px] p-0.5 shadow-lg bg-sky-600/90">
                                        <span className="flex h-full w-full items-center justify-center gap-2 rounded-[6px] border py-1.5 text-sm font-medium border-sky-400/80 bg-sky-500 ">
                                            <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/x-social-media-white-icon.png" className="h-4 w-4" alt="" />
                                            Post in one click
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className="font-sans mb-2 mt-4 flex items-center gap-4 text-center text-xs font-medium text-gray-500 w-full">
                                <hr className="w-full border-gray-700" />
                                <div className="flex-none">OR</div>
                                <hr className="w-full border-gray-700" />
                            </div>
                            <div className="mt-2 flex flex-col items-center gap-3 rounded-md border border-gray-700 bg-black/30 px-4 py-3 w-full">
                                <div className="flex w-full items-center justify-center gap-4 text-center">
                                    <p className="text-xs font-medium text-gray-300">Share your testimonial</p>
                                </div>
                                <div className="flex w-full justify-center gap-2">
                                    <a href="#" target="_blank" className="w-8 h-8 flex items-center justify-center rounded-full p-2 text-white bg-slate-950" aria-label="Share on X"><XIcon /></a>
                                    <a href="#" target="_blank" className="w-8 h-8 flex items-center justify-center rounded-full p-2 text-white bg-blue-700" aria-label="Share on Facebook"><FacebookIcon /></a>
                                    <a href="#" target="_blank" className="w-8 h-8 flex items-center justify-center rounded-full p-2 text-white bg-sky-700" aria-label="Share on LinkedIn"><LinkedInIcon /></a>
                                    <a href="#" target="_blank" className="w-8 h-8 flex items-center justify-center rounded-full p-2 text-white bg-green-600" aria-label="Share on WhatsApp">
                                        <img alt="whatsapp" width="14" height="14" src="https://ik.imagekit.io/senja/tr:w-32,f-png/Logos/whatsapp-logo_Xt5raTHb3.webp?updatedAt=1683237867825" style={{ filter: 'brightness(0) invert(1)' }} />
                                    </a>
                                </div>
                                <button className="w-full rounded-full border border-gray-600 bg-[#2A2A2A] px-3 py-1.5 text-gray-400">
                                    <div className="flex items-center gap-2 truncate">
                                        <div className="truncate text-xs font-sans">https://praisegarden.io/t/beby7bdb...</div>
                                        <div className="flex-grow"></div>
                                        <LinkIcon className="w-4 h-4" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FormCard>
    );
};

export default ThankYouCard;


