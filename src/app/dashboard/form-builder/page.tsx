"use client";

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import RatingCard from '@/components/RatingCard';
// import FormBuilderSidebar from '@/components/FormBuilderSidebar';
import NegativeFeedbackCard from '@/components/NegativeFeedbackCard';
import QuestionCard from '@/components/QuestionCard';
import PrivateFeedbackCard from '@/components/PrivateFeedbackCard';
import ConsentCard from '@/components/ConsentCard';
import AboutYouCard from '@/components/AboutYouCard';
import ReadyToSendCard from '@/components/ReadyToSendCard';
import ThankYouCard from '@/components/ThankYouCard';
import WelcomeCard from '@/components/WelcomeCard';
import { Reorder } from "framer-motion";

import { FormConfig, FormBlock, FormBlockType } from '@/types/form-config';
import { createDefaultFormConfig } from '@/lib/default-form-config';
import FormBuilderEditPanel from '@/components/edit-panels/FormBuilderEditPanel';
import { toast, Toaster } from 'sonner';

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

export interface FormCardProps {
    // page: PageItem; - This will be replaced by a specific block config
    config: FormBlock;
    currentPage: number;
    totalPages: number;
    onNext: () => void;
    onPrevious: () => void;
    onFieldFocus: (blockId: string, fieldPath: string) => void;
    // onToggle: (id: string) => void; - This will be handled in the main page
    // onDelete?: (id: string) => void; - This will be handled in the main page
    // isDeletable?: boolean;
}

export const FormCard: React.FC<React.PropsWithChildren<Omit<FormCardProps, 'config' | 'onFieldFocus'>>> = ({
    children,
    currentPage,
    totalPages,
    onNext,
    onPrevious,
}) => {
    return (
        <div className="w-[94%] max-w-[1200px] xl:max-w-[1320px] h-[78vh] xl:h-[82vh] max-h-[820px] mx-auto bg-[#121212] rounded-2xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col">
            <div className="relative px-6 py-4 border-b border-gray-800 flex items-center flex-none">
                {/* Left Side: Page Number and Title */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="bg-green-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center flex-none">
                        {currentPage}
                    </span>
                    {/* <span className="text-gray-300 font-semibold tracking-wider text-xs uppercase truncate">{page.title}</span> */}
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

                {/* Right Side: Actions are now in the sidebar */}
                <div className="flex items-center gap-2 flex-1 justify-end">
                </div>
            </div>
            {children}
        </div>
    )
}

const FormBuilderPage = () => {
    const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
    const [activeTab, setActiveTab] = useState<'pages' | 'edit'>('pages');
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [focusedField, setFocusedField] = useState<{ blockId: string; fieldPath: string } | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const formId = 'd1b2c3a4-e5f6-7890-1234-567890abcdef'; // Hardcoded for now
    
        const fetchFormConfig = async () => {
          try {
            const response = await fetch(`/api/forms/${formId}`);
            if (!response.ok) {
              if (response.status === 404) {
                // If not found, create a default one to start with.
                // In a real app, you might redirect or show an error.
                console.warn(`Form ${formId} not found, creating a default config.`);
                const projectId = '123e4567-e89b-12d3-a456-426614174000' as any;
                const defaultConfig = createDefaultFormConfig({ projectId, formId });
                setFormConfig(defaultConfig);
              } else {
                throw new Error('Failed to fetch form configuration');
              }
            } else {
              const data = await response.json();
              setFormConfig(data);
            }
          } catch (error) {
            console.error(error);
            toast.error('Could not load form data.');
          }
        };
    
        fetchFormConfig();
      }, []);

    const handleFieldFocus = (blockId: string, fieldPath: string) => {
        setFocusedField({ blockId, fieldPath });
        setActiveTab('edit');
    };

    const enabledBlocks = useMemo(() => formConfig?.blocks.filter(b => b.enabled) || [], [formConfig]);
  
    const handleNextPage = useCallback(() => {
    setCurrentPageIndex(currentIndex => Math.min(currentIndex + 1, enabledBlocks.length - 1));
  }, [enabledBlocks.length]);

    const handlePreviousPage = useCallback(() => {
        setCurrentPageIndex(currentIndex => Math.max(currentIndex - 1, 0));
    }, []);

    const handleSave = async () => {
        if (!formConfig || !formConfig.id) {
            toast.error('Cannot save form without an ID.');
            return;
        }
        setIsSaving(true);
        try {
            const response = await fetch(`/api/forms/${formConfig.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formConfig),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Save failed');
            }

            toast.success('Form saved successfully!');
        } catch (error: any) {
            toast.error(`Failed to save form: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

  const handlePageClick = (index: number) => {
    setCurrentPageIndex(index);
  };

  const handleTogglePage = (blockId: string) => {
    setFormConfig(prevConfig => {
      if (!prevConfig) return null;
      return {
        ...prevConfig,
        blocks: prevConfig.blocks.map(block =>
          block.id === blockId
            ? { ...block, enabled: !block.enabled }
            : block
        ),
      };
    });
  };

  const handleReorder = (newOrder: FormBlock[]) => {
    // This logic needs to be updated for the new structure
  };

  const handleAddPage = () => {
    // This logic needs to be updated for the new structure
  };

  const handleDeletePage = (id: string) => {
    // This logic needs to be updated for the new structure
  };

  const handleUpdatePageContent = (id: string, content: any) => {
    // This logic needs to be updated for the new structure
  };

  const handleUpdateBlock = (blockId: string, updatedProps: any) => {
    setFormConfig(prevConfig => {
        if (!prevConfig) return null;
        return {
            ...prevConfig,
            blocks: prevConfig.blocks.map(block => 
                block.id === blockId 
                    ? { ...block, props: { ...block.props, ...updatedProps } } 
                    : block
            ),
        };
    });
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

  if (!formConfig) {
      return <div className="flex items-center justify-center h-screen bg-[#0A0A0A] text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full h-screen bg-[#0A0A0A] text-white">
        <Toaster position="bottom-right" theme="dark" />
        <header className="relative flex-none flex items-center justify-between h-16 px-6 bg-[#121212] border-b border-gray-800 z-20">
            <div className="flex items-center gap-3">
                <button className="text-gray-400 rounded-md p-1 hover:bg-white/10">
                    <ArrowLeftIcon />
                </button>
                <div className="flex items-center gap-2 group cursor-pointer">
                    <h1 className="text-lg font-medium">{formConfig.name}</h1>
                    <EditIcon className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>

            <div className="flex items-center">
                <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save changes'}
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
                        const block = enabledBlocks[currentPageIndex];
                        if (!block) return null;

                        const cardProps = {
                            config: block,
                            currentPage: currentPageIndex + 1,
                            totalPages: enabledBlocks.length,
                            onNext: handleNextPage,
                            onPrevious: handlePreviousPage,
                            onFieldFocus: handleFieldFocus,
                        };

                        switch (block.type) {
                            case FormBlockType.Welcome: return <WelcomeCard key={block.id} {...cardProps} config={block as any} />;
                            case FormBlockType.Rating: return <RatingCard key={block.id} {...cardProps} config={block as any} />;
                            case FormBlockType.Question: return <QuestionCard key={block.id} {...cardProps} config={block as any} />;
                            case FormBlockType.NegativeFeedback: return <NegativeFeedbackCard key={block.id} {...cardProps} config={block as any} />;
                            case FormBlockType.PrivateFeedback: return <PrivateFeedbackCard key={block.id} {...cardProps} config={block as any} />;
                            case FormBlockType.Consent: return <ConsentCard key={block.id} {...cardProps} config={block as any} />;
                            case FormBlockType.AboutYou: return <AboutYouCard key={block.id} {...cardProps} config={block as any} />;
                            case FormBlockType.ReadyToSend: return <ReadyToSendCard key={block.id} {...cardProps} config={block as any} />;
                            case FormBlockType.ThankYou: return <ThankYouCard key={block.id} {...cardProps} config={block as any} />;
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
               <Reorder.Group axis="y" values={formConfig.blocks} onReorder={handleReorder} className="flex-1 overflow-y-auto p-3 space-y-2">
                 {formConfig.blocks.map((block) => {
                   const enabledIndex = enabledBlocks.findIndex(b => b.id === block.id);
                   const isCurrentPage = enabledIndex === currentPageIndex && block.enabled;
                   
                   return (
                     <Reorder.Item
                       key={block.id}
                       value={block}
                       className={`group relative rounded-lg border-2 transition-colors cursor-grab active:cursor-grabbing ${
                         isCurrentPage
                           ? 'border-purple-500 bg-purple-500/10'
                           : 'border-gray-700 hover:border-gray-600'
                       } ${!block.enabled ? 'opacity-40' : ''}`}
                       onClick={() => block.enabled && handlePageClick(enabledIndex)}
                     >
                       {/* Thumbnail preview */}
                       <div className="aspect-video bg-[#121212] rounded-t-md border-b border-gray-700 overflow-hidden relative pointer-events-none">
                          <ThumbnailPreview pageType={block.type} />
                           
                           {/* Page number badge */}
                         <div className="absolute top-1.5 left-1.5">
                           <span className={`inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded ${
                             block.enabled ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
                           }`}>
                             {block.enabled ? enabledIndex + 1 : '—'}
                           </span>
                         </div>
                       </div>

                       {/* Page info and toggle */}
                       <div className="p-2 flex items-center justify-between">
                         <div className="flex-1 min-w-0">
                           <p className="text-xs font-medium text-gray-300 truncate pointer-events-none">
                             {/* Need a title on the base block */}
                             {block.type}
                           </p>
                         </div>
                         <div className="relative flex-none ml-2" onClick={(e) => e.stopPropagation()}>
                           <input
                             type="checkbox"
                             id={`page-toggle-thumb-${block.id}`}
                             className="sr-only peer"
                             checked={block.enabled}
                             onChange={() => handleTogglePage(block.id)}
                           />
                           <label
                             htmlFor={`page-toggle-thumb-${block.id}`}
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
            <FormBuilderEditPanel
                focusedBlock={enabledBlocks[currentPageIndex] || null}
                onUpdateBlock={handleUpdateBlock}
            />
           )}
        </aside>
      </div>
    </div>
  );
};

const ThumbnailPreview = ({ pageType }: { pageType: FormBlockType }) => {
  const baseClasses = "w-full h-full p-3 flex flex-col items-center justify-center gap-1.5 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:12px_12px]";

  const content = () => {
    switch (pageType) {
      case FormBlockType.Welcome:
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
      case FormBlockType.Rating:
        return (
          <>
            <div className="text-2xl">⭐️</div>
            <div className="flex gap-1">
              {Array(5).fill(0).map((_, i) => <div key={i} className="w-2 h-2 bg-yellow-400/90 rounded-full"></div>)}
            </div>
            <div className="h-2 bg-purple-600 rounded w-1/2 mt-2"></div>
          </>
        );
      case FormBlockType.NegativeFeedback:
        return (
          <>
            <div className="text-2xl">💬</div>
             <div className="space-y-1 w-3/4">
              <div className="h-1.5 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-800 border border-gray-700 rounded w-full mt-1"></div>
            </div>
          </>
        );
      case FormBlockType.Question:
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
      case FormBlockType.PrivateFeedback:
        return (
          <>
            <div className="text-2xl">🔒</div>
            <div className="space-y-1 w-3/4">
              <div className="h-1.5 bg-gray-700 rounded w-2/3 mx-auto"></div>
              <div className="h-4 bg-gray-800 border border-gray-700 rounded w-full mt-1"></div>
            </div>
          </>
        );
      case FormBlockType.Consent:
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
      case FormBlockType.AboutYou:
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
      case FormBlockType.ReadyToSend:
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
      case FormBlockType.ThankYou:
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
