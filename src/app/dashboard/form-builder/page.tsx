"use client";

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import RatingCard from '@/components/RatingCard';
import FormBuilderSidebar from '@/components/FormBuilderSidebar';
import NegativeFeedbackCard from '@/components/NegativeFeedbackCard';
import QuestionCard from '@/components/QuestionCard';
import PrivateFeedbackCard from '@/components/PrivateFeedbackCard';
import ConsentCard from '@/components/ConsentCard';
import AboutYouCard from '@/components/AboutYouCard';
import ReadyToSendCard from '@/components/ReadyToSendCard';
import ThankYouCard from '@/components/ThankYouCard';
import WelcomeCard from '@/components/WelcomeCard';
import { Reorder } from "framer-motion";

const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
    <path d="M10 11v6"></path>
    <path d="M14 11v6"></path>
    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const PagesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
      <polyline points="2 17 12 22 22 17"></polyline>
      <polyline points="2 12 12 17 22 12"></polyline>
    </svg>
);
  
const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const RewardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 12 20 22 4 22 4 12"></polyline>
      <rect x="2" y="7" width="20" height="5"></rect>
      <line x1="12" y1="22" x2="12" y2="7"></line>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </svg>
  );
  
  const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
  );

  type NavItemProps = {
    children: React.ReactNode;
    icon: React.ReactNode;
    active?: boolean;
  };
  const NavItem = ({ children, icon, active = false }: NavItemProps) => (
    <button className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}>
      {icon}
      <span className="hidden xl:inline">{children}</span>
    </button>
  );

export type PageItem = { 
  id: string; 
  type: 'welcome' | 'rating' | 'negative' | 'question' | 'private' | 'consent' | 'about' | 'ready' | 'thankyou';
  title: string; 
  enabled: boolean;
  content?: {
    question?: string;
    description?: string;
    testimonial?: string;
    examples?: string[];
    tips?: string[];
  }
};

const defaultQuestionTips = [
  'Share specific results, e.g. "Our conversion rate increased by 30%"',
  'Mention your timeline, e.g. "In just 2 months of using this..."',
  'Highlight a favorite feature, e.g. "The automation saved us 10 hours/week"',
];

const initialPages: PageItem[] = [
  { id: crypto.randomUUID(), type: 'welcome', title: 'Welcome page', enabled: true },
  { id: crypto.randomUUID(), type: 'rating', title: 'Rating page', enabled: true },
  { id: crypto.randomUUID(), type: 'negative', title: 'Negative feedback page', enabled: true },
  { id: crypto.randomUUID(), type: 'question', title: 'Question #1', enabled: true, content: { question: 'Share your success story with us', description: 'Help others discover the value you\'ve experienced', tips: defaultQuestionTips } },
  { id: crypto.randomUUID(), type: 'private', title: 'Private Feedback', enabled: true },
  { id: crypto.randomUUID(), type: 'consent', title: 'Consent page', enabled: true },
  { id: crypto.randomUUID(), type: 'about', title: 'About you page', enabled: true },
  { id: crypto.randomUUID(), type: 'ready', title: 'Ready to send page', enabled: true },
  { id: crypto.randomUUID(), type: 'thankyou', title: 'Thank you page', enabled: true },
];

export interface FormCardProps {
    page: PageItem;
    currentPage: number;
    totalPages: number;
    onNext: () => void;
    onPrevious: () => void;
    onToggle: (id: string) => void;
    onDelete?: (id: string) => void;
    isDeletable?: boolean;
}

export const FormCard: React.FC<React.PropsWithChildren<FormCardProps>> = ({
    children,
    page,
    currentPage,
    totalPages,
    onNext,
    onPrevious,
    onToggle,
    onDelete,
    isDeletable = false
}) => {
    return (
        <div className="w-[94%] max-w-[1200px] xl:max-w-[1320px] h-[78vh] xl:h-[82vh] max-h-[820px] mx-auto bg-[#121212] rounded-2xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col">
            <div className="relative px-6 py-4 border-b border-gray-800 flex items-center flex-none">
                {/* Left Side: Page Number and Title */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="bg-green-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center flex-none">
                        {currentPage}
                    </span>
                    <span className="text-gray-300 font-semibold tracking-wider text-xs uppercase truncate">{page.title}</span>
                </div>
                
                {/* Center: Navigation (Absolutely Centered) */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
                    <button
                        onClick={onPrevious}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-700 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        aria-label="Previous page"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 px-2">
                        <span className="text-sm font-semibold text-white">{currentPage}</span>
                        <span className="text-sm text-gray-600">/</span>
                        <span className="text-sm text-gray-400">{totalPages}</span>
                    </div>
                    <button
                        onClick={onNext}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-700 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        aria-label="Next page"
                    >
                        <ArrowRightIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-2 flex-1 justify-end">
                    {onDelete && isDeletable && (
                        <button
                            onClick={() => onDelete(page.id)}
                            aria-label="Delete question"
                            className="rounded-md text-gray-400 hover:bg-white/10 p-1.5"
                        >
                            <TrashIcon />
                        </button>
                    )}
                     <div className="relative flex-none" onClick={(e) => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            id={`page-toggle-card-${page.id}`}
                            className="sr-only peer"
                            checked={page.enabled}
                            onChange={() => onToggle(page.id)}
                        />
                        <label
                            htmlFor={`page-toggle-card-${page.id}`}
                            className="flex items-center cursor-pointer w-9 h-5 bg-gray-700 rounded-full p-0.5 transition-colors peer-checked:bg-purple-600"
                        >
                            <span className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 translate-x-0 peer-checked:translate-x-4"></span>
                        </label>
                    </div>
                </div>
            </div>
            {children}
        </div>
    )
}

const FormBuilderPage = () => {
  const [pages, setPages] = useState<PageItem[]>(initialPages);
  const [activeTab, setActiveTab] = useState<'pages' | 'edit'>('pages');

  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const handleTogglePage = (id: string) => {
    setPages(prev => prev.map(p => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  const enabledPages = useMemo(() => pages.filter(p => p.enabled), [pages]);
  
  const handleNextPage = useCallback(() => {
    setCurrentPageIndex(currentIndex => {
        if (currentIndex < enabledPages.length - 1) {
            return currentIndex + 1;
        }
        return currentIndex;
    });
  }, [enabledPages.length]);

  const handlePreviousPage = useCallback(() => {
      setCurrentPageIndex(currentIndex => {
          if (currentIndex > 0) {
              return currentIndex - 1;
          }
          return currentIndex;
      });
  }, []);

  const handlePageClick = (index: number) => {
    setCurrentPageIndex(index);
  };

  const handleReorder = (newOrder: PageItem[]) => {
    // Preserve the currently selected page after reordering
    const currentEnabledPage = enabledPages[currentPageIndex];
    setPages(newOrder);
    const newEnabledPages = newOrder.filter(p => p.enabled);
    const newPageIndex = newEnabledPages.findIndex(p => p.id === currentEnabledPage?.id);
    
    if (newPageIndex !== -1) {
      setCurrentPageIndex(newPageIndex);
    } else if (newEnabledPages.length > 0) {
      setCurrentPageIndex(0);
    } else {
      setCurrentPageIndex(-1); // No enabled pages
    }
  };

  const handleAddPage = () => {
    const questionPagesCount = pages.filter(p => p.type === 'question').length;
    const newPage: PageItem = {
      id: crypto.randomUUID(),
      type: 'question',
      title: `Question #${questionPagesCount + 1}`,
      enabled: true,
      content: {
        question: `Your new question...`,
        description: 'A new description...'
      }
    };

    const updatedPages = [...pages];
    // Add new page after the last question or at the end of the form
    const lastQuestionIndex = pages.map(p => p.type).lastIndexOf('question');
    const insertIndex = lastQuestionIndex !== -1 ? lastQuestionIndex + 1 : pages.length - 2; // before ready/thank you
    
    updatedPages.splice(insertIndex, 0, newPage);

    setPages(updatedPages);

    const newEnabledPages = updatedPages.filter(p => p.enabled);
    const newPageIndex = newEnabledPages.findIndex(p => p.id === newPage.id);

    if (newPageIndex !== -1) {
      setCurrentPageIndex(newPageIndex);
    }
  };

  const handleDeletePage = (id: string) => {
    setPages(pages.filter(p => p.id !== id));
    // Adjust current page if the deleted one was selected
    if (enabledPages[currentPageIndex]?.id === id) {
        setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
    }
  };

  const handleUpdatePageContent = (id: string, content: PageItem['content']) => {
    setPages(pages.map(p => p.id === id ? { ...p, content } : p));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement;
      const isTextInput = activeElement && 
        (activeElement.tagName === 'INPUT' ||
         activeElement.tagName === 'TEXTAREA' ||
         activeElement.isContentEditable);

      if (isTextInput) {
        return; // Do not navigate if typing in a field
      }

      if (event.key === 'ArrowRight') {
        handleNextPage();
      } else if (event.key === 'ArrowLeft') {
        handlePreviousPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNextPage, handlePreviousPage]);

  return (
    <div className="flex flex-col w-full h-screen bg-[#0A0A0A] text-white">
        <header className="relative flex-none flex items-center justify-between h-16 px-6 bg-[#121212] border-b border-gray-800 z-20">
            <div className="flex items-center gap-3">
                <button className="text-gray-400 rounded-md p-1 hover:bg-white/10">
                    <ArrowLeftIcon />
                </button>
                <div className="flex items-center gap-2 group cursor-pointer">
                    <h1 className="text-lg font-medium">My testimonial form</h1>
                    <EditIcon className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>

            <div className="flex items-center">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg text-sm">
                    Save changes
                </Button>
            </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-hidden bg-[#232325]">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Main content area */}
            <div className="relative z-10 h-full w-full flex flex-col">
                {/* Card display area - single card at a time */}
                <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                    {(() => {
                        const page = enabledPages[currentPageIndex];
                        if (!page) return null;

                        const cardProps = {
                            page,
                            currentPage: currentPageIndex + 1,
                            totalPages: enabledPages.length,
                            onNext: handleNextPage,
                            onPrevious: handlePreviousPage,
                            onToggle: handleTogglePage,
                        };

                        switch (page.type) {
                            case 'rating': return <RatingCard {...cardProps} />;
                            case 'negative': return <NegativeFeedbackCard {...cardProps} />;
                            case 'welcome': return <WelcomeCard {...cardProps} />;
                            case 'question': {
                                const questionPages = enabledPages.filter(p => p.type === 'question');
                                const questionIndex = questionPages.findIndex(p => p.id === page.id);
                                return <QuestionCard 
                                    {...cardProps}
                                    questionNumber={questionIndex + 1}
                                    totalQuestions={questionPages.length}
                                    onUpdate={handleUpdatePageContent}
                                    onDelete={handleDeletePage}
                                />;
                            }
                            case 'private': return <PrivateFeedbackCard {...cardProps} />;
                            case 'consent': return <ConsentCard {...cardProps} />;
                            case 'about': return <AboutYouCard {...cardProps} />;
                            case 'ready': return <ReadyToSendCard {...cardProps} />;
                            case 'thankyou': return <ThankYouCard {...cardProps} />;
                            default: return null;
                        }
                    })()}
            </div>
            </div>
        </main>
        
        {/* PowerPoint-style thumbnail sidebar */}
        <aside className="w-80 flex-none flex flex-col bg-[#1A1A1A] border-l border-gray-800">
           <div className="grid grid-cols-2 divide-x divide-gray-800 border-b border-gray-800">
             <button
               onClick={() => setActiveTab('pages')}
               className={`flex items-center justify-center gap-2 px-4 py-3 text-center transition-colors ${
                 activeTab === 'pages' ? 'bg-[#2A2A2A]' : 'bg-transparent'
               }`}
             >
               <PagesIcon className={activeTab === 'pages' ? 'text-purple-400' : 'text-gray-500'} />
               <span className={`text-sm font-medium ${activeTab === 'pages' ? 'text-white' : 'text-gray-400'}`}>Pages</span>
             </button>
             <button
               onClick={() => setActiveTab('edit')}
               className={`flex items-center justify-center gap-2 px-4 py-3 text-center transition-colors ${
                 activeTab === 'edit' ? 'bg-[#2A2A2A]' : 'bg-transparent'
               }`}
             >
               <SettingsIcon className={activeTab === 'edit' ? 'text-purple-400' : 'text-gray-500'} />
               <span className={`text-sm font-medium ${activeTab === 'edit' ? 'text-white' : 'text-gray-400'}`}>Edit</span>
             </button>
           </div>
           
           {activeTab === 'pages' && (
             <>
               <Reorder.Group axis="y" values={pages} onReorder={handleReorder} className="flex-1 overflow-y-auto p-3 space-y-2">
                 {pages.map((page) => {
                   const enabledIndex = enabledPages.findIndex(p => p.id === page.id);
                   const isCurrentPage = enabledIndex === currentPageIndex && page.enabled;
                   
                   return (
                     <Reorder.Item
                       key={page.id}
                       value={page}
                       className={`group relative rounded-lg border-2 transition-colors cursor-grab active:cursor-grabbing ${
                         isCurrentPage
                           ? 'border-purple-500 bg-purple-500/10'
                           : 'border-gray-700 hover:border-gray-600'
                       } ${!page.enabled ? 'opacity-40' : ''}`}
                       onClick={() => page.enabled && handlePageClick(enabledIndex)}
                     >
                       {/* Thumbnail preview */}
                       <div className="aspect-video bg-[#121212] rounded-t-md border-b border-gray-700 overflow-hidden relative pointer-events-none">
                          <ThumbnailPreview pageType={page.type} />
                           
                           {/* Page number badge */}
                         <div className="absolute top-1.5 left-1.5">
                           <span className={`inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded ${
                             page.enabled ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
                           }`}>
                             {page.enabled ? enabledIndex + 1 : '—'}
                           </span>
                         </div>
                       </div>

                       {/* Page info and toggle */}
                       <div className="p-2 flex items-center justify-between">
                         <div className="flex-1 min-w-0">
                           <p className="text-xs font-medium text-gray-300 truncate pointer-events-none">
                             {page.title}
                           </p>
                         </div>
                         <div className="relative flex-none ml-2" onClick={(e) => e.stopPropagation()}>
                           <input
                             type="checkbox"
                             id={`page-toggle-thumb-${page.id}`}
                             className="sr-only peer"
                             checked={page.enabled}
                             onChange={() => handleTogglePage(page.id)}
                           />
                           <label
                             htmlFor={`page-toggle-thumb-${page.id}`}
                             className="flex items-center cursor-pointer w-9 h-5 bg-gray-700 rounded-full p-0.5 transition-colors peer-checked:bg-purple-600"
                           >
                             <span className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 translate-x-0 peer-checked:translate-x-4"></span>
                           </label>
                         </div>
                       </div>
                     </Reorder.Item>
                   );
                 })}
               </Reorder.Group>

               {/* Add page button */}
               <div className="p-3 border-t border-gray-800">
                 <button 
                   onClick={handleAddPage}
                   className="w-full py-2 px-3 text-xs font-medium text-gray-400 border border-dashed border-gray-700 rounded-lg hover:border-gray-600 hover:text-gray-300 transition-colors"
                 >
                   + Add Question Page
                 </button>
               </div>
             </>
           )}
 
           {activeTab === 'edit' && (
             <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {enabledPages[currentPageIndex] ? (
                    <div>
                        <h3 className="text-base font-medium text-gray-300 mb-4">
                            Editing: <span className="text-purple-400">{enabledPages[currentPageIndex].title}</span>
                        </h3>
                        {/* Placeholder for page-specific editing controls */}
                        <div className="text-center text-gray-500 border border-dashed border-gray-700 rounded-lg py-12">
                            <p>Page editing options will appear here.</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 pt-12">
                        <p>Select a page to see editing options.</p>
                    </div>
                )}
             </div>
           )}
        </aside>
      </div>
    </div>
  );
};

const ThumbnailPreview = ({ pageType }: { pageType: PageItem['type'] }) => {
  const baseClasses = "w-full h-full p-3 flex flex-col items-center justify-center gap-1.5 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:12px_12px]";

  const content = () => {
    switch (pageType) {
      case 'welcome':
        return (
          <>
            <div className="text-2xl">👋</div>
            <div className="space-y-1 w-3/4">
              <div className="h-1.5 bg-gray-700 rounded w-5/6 mx-auto"></div>
              <div className="h-1.5 bg-gray-700 rounded w-2/3 mx-auto"></div>
              <div className="h-2 bg-lime-400 rounded w-1/3 mx-auto mt-2"></div>
            </div>
          </>
        );
      case 'rating':
        return (
          <>
            <div className="text-2xl">⭐️</div>
            <div className="flex gap-1">
              {Array(5).fill(0).map((_, i) => <div key={i} className="w-2 h-2 bg-yellow-400/90 rounded-full"></div>)}
            </div>
            <div className="h-2 bg-purple-600 rounded w-1/2 mt-2"></div>
          </>
        );
      case 'negative':
        return (
          <>
            <div className="text-2xl">💬</div>
             <div className="space-y-1 w-3/4">
              <div className="h-1.5 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-800 border border-gray-700 rounded w-full mt-1"></div>
            </div>
          </>
        );
      case 'question':
        return (
          <>
            <div className="text-2xl">❓</div>
            <div className="space-y-1 w-3/4">
              <div className="h-1.5 bg-gray-700 rounded w-full"></div>
               <div className="h-2 bg-purple-600 rounded w-1/2 mx-auto mt-2"></div>
               <div className="h-2 bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          </>
        );
      case 'private':
        return (
          <>
            <div className="text-2xl">🔒</div>
            <div className="space-y-1 w-3/4">
              <div className="h-1.5 bg-gray-700 rounded w-2/3 mx-auto"></div>
              <div className="h-4 bg-gray-800 border border-gray-700 rounded w-full mt-1"></div>
            </div>
          </>
        );
      case 'consent':
        return (
          <>
            <div className="text-2xl">✅</div>
            <div className="space-y-1.5 w-3/4">
              <div className="flex items-center gap-1.5 w-full">
                <div className="w-2 h-2 border-2 border-gray-600 rounded-full"></div>
                <div className="h-1.5 bg-gray-700 rounded w-4/5"></div>
              </div>
              <div className="flex items-center gap-1.5 w-full">
                <div className="w-2 h-2 border-2 border-purple-500 bg-purple-500 rounded-full"></div>
                <div className="h-1.5 bg-gray-700 rounded w-4/5"></div>
              </div>
            </div>
          </>
        );
      case 'about':
        return (
          <>
            <div className="text-2xl">👤</div>
            <div className="space-y-1.5 w-3/4">
              <div className="w-5 h-5 bg-purple-500/50 rounded-full mx-auto"></div>
              <div className="h-2 bg-gray-800 border border-gray-700 rounded w-full"></div>
              <div className="h-2 bg-gray-800 border border-gray-700 rounded w-full"></div>
            </div>
          </>
        );
      case 'ready':
         return (
          <>
            <div className="text-2xl">📤</div>
            <div className="space-y-1 w-3/4">
              <div className="h-3 bg-gray-800 border border-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-800 border border-gray-700 rounded w-full"></div>
              <div className="h-2 bg-green-500 rounded w-1/2 mx-auto mt-2"></div>
            </div>
          </>
        );
      case 'thankyou':
        return (
          <>
            <div className="text-2xl">🎉</div>
            <div className="space-y-1 w-3/4">
              <div className="h-1.5 bg-gray-700 rounded w-5/6 mx-auto"></div>
              <div className="h-1.5 bg-gray-700 rounded w-2/3 mx-auto"></div>
                 <div className="flex gap-1.5 justify-center pt-1">
                    <div className="w-2.5 h-2.5 bg-sky-500 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-gray-700 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-gray-700 rounded-full"></div>
                 </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return <div className={baseClasses}>{content()}</div>;
};

export default FormBuilderPage;
