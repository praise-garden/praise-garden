"use client";

import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
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
import { Reorder, motion, AnimatePresence } from "framer-motion";

import { type FormConfig, type FormBlock, FormBlockType, type FormTheme } from '@/types/form-config';
import FormBuilderEditPanel from '@/components/edit-panels/FormBuilderEditPanel';
import { toast, Toaster } from 'sonner';
import { FontPicker } from '@/components/ui/font-picker';
import { useSearchParams } from 'next/navigation';
import { uploadImageToStorage } from '@/lib/storage';

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
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Outer ring */}
    <circle cx="12" cy="12" r="7.25" stroke="currentColor" />

    {/* Inner ring for depth */}
    <circle cx="12" cy="12" r="4.6" stroke="currentColor" />

    {/* Hub */}
    <circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" />

    {/* Teeth (12) */}
    <g fill="currentColor" stroke="none">
      <rect x="11.2" y="1.2" width="1.6" height="3" rx="0.6" />
      <rect x="11.2" y="19.8" width="1.6" height="3" rx="0.6" transform="rotate(180 12 21.3)" />

      <rect x="11.2" y="1.2" width="1.6" height="3" rx="0.6" transform="rotate(30 12 12)" />
      <rect x="11.2" y="1.2" width="1.6" height="3" rx="0.6" transform="rotate(60 12 12)" />
      <rect x="11.2" y="1.2" width="1.6" height="3" rx="0.6" transform="rotate(90 12 12)" />
      <rect x="11.2" y="1.2" width="1.6" height="3" rx="0.6" transform="rotate(120 12 12)" />
      <rect x="11.2" y="1.2" width="1.6" height="3" rx="0.6" transform="rotate(150 12 12)" />
      <rect x="11.2" y="1.2" width="1.6" height="3" rx="0.6" transform="rotate(210 12 12)" />
      <rect x="11.2" y="1.2" width="1.6" height="3" rx="0.6" transform="rotate(240 12 12)" />
      <rect x="11.2" y="1.2" width="1.6" height="3" rx="0.6" transform="rotate(270 12 12)" />
      <rect x="11.2" y="1.2" width="1.6" height="3" rx="0.6" transform="rotate(300 12 12)" />
      <rect x="11.2" y="1.2" width="1.6" height="3" rx="0.6" transform="rotate(330 12 12)" />
    </g>
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

const FormIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
  
const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const PRIMARY_COLOR_PRESETS = ['#A855F7', '#6366F1', '#22C55E', '#F97316', '#EC4899', '#0EA5E9', '#FACC15', '#111827'];
const SECONDARY_COLOR_PRESETS = ['#22C55E', '#14B8A6', '#F97316', '#EF4444', '#8B5CF6', '#0EA5E9', '#F59E0B', '#1F2937'];

const defaultTheme: FormTheme = {
  backgroundColor: '#0A0A0A',
  logoUrl: '/icon.png',
  primaryColor: '#A855F7',
  secondaryColor: '#22C55E',
  headingFont: 'Inter',
  bodyFont: 'Inter',
};

const clampColorValue = (value: number) => Math.min(255, Math.max(0, value));

const updateTheme = (
  updater: (theme: FormTheme) => FormTheme,
  setFormConfig: React.Dispatch<React.SetStateAction<FormConfig | null>>,
) => {
  setFormConfig((prev) => {
    if (!prev) {
      return prev;
    }

    const currentTheme = {
      ...defaultTheme,
      ...(prev.theme ?? {}),
    };

    return {
      ...prev,
      theme: updater(currentTheme),
    };
  });
};

const adjustColor = (hex: string, amount: number) => {
  if (!hex) return hex;
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((char) => `${char}${char}`).join('');
  }
  if (clean.length !== 6) {
    return hex;
  }
  const numeric = parseInt(clean, 16);
  const r = clampColorValue((numeric >> 16) + amount);
  const g = clampColorValue(((numeric >> 8) & 0xff) + amount);
  const b = clampColorValue((numeric & 0xff) + amount);
  const toHex = (value: number) => value.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const createGradient = (color: string) => {
  const light = adjustColor(color, 35);
  return `linear-gradient(135deg, ${light}, ${color})`;
};
  
  const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
  );

  type NavItemProps = {
    children: React.ReactNode;
    icon: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
  };
  
  const NavItem = ({ children, icon, active = false, onClick }: NavItemProps) => (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-600/25' 
          : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
      }`}
    >
      <div className={`transition-colors ${active ? 'text-white' : 'text-gray-500'}`}>
      {icon}
      </div>
      <span className="font-medium">{children}</span>
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
        <div className="w-[96%] max-w-[1400px] 2xl:max-w-[1600px] h-[70vh] min-h-[600px] max-h-[700px] mx-auto bg-gray-950 rounded-3xl shadow-2xl overflow-hidden border border-gray-800/50 flex flex-col">
            <div className="relative px-8 py-3 border-b border-gray-800/50 flex items-center flex-none">
                {/* Left Side: Page Number and Title */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="bg-green-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center flex-none">
                        {currentPage}
                    </span>
                </div>
                
                {/* Center: Navigation (Absolutely Centered) */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <button
                        onClick={onPrevious}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg border border-gray-700/50 hover:bg-gray-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        aria-label="Previous page"
                    >
                        <ArrowLeftIcon className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1.5 px-2">
                        <span className="text-xs font-semibold text-white">{currentPage}</span>
                        <span className="text-xs text-gray-600">/</span>
                        <span className="text-xs text-gray-400">{totalPages}</span>
                    </div>
                    <button
                        onClick={onNext}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg border border-gray-700/50 hover:bg-gray-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        aria-label="Next page"
                    >
                        <ArrowRightIcon className="w-3.5 h-3.5" />
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
    const searchParams = useSearchParams();
    const formId = searchParams.get('id');
    
    const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
    const [activeTab, setActiveTab] = useState<'pages' | 'edit'>('pages');
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [focusedField, setFocusedField] = useState<{ blockId: string; fieldPath: string } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [activeNavTab, setActiveNavTab] = useState<'form' | 'settings' | 'rewards'>('settings');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    
    useEffect(() => {
        if (!formId) {
            toast.error('No form ID provided');
            setIsLoading(false);
            return;
        }
    
        const fetchFormConfig = async () => {
          setIsLoading(true);
          setError(null);
          try {
            const response = await fetch(`/api/forms/${formId}`);
            if (!response.ok) {
              if (response.status === 404) {
                throw new Error("Form not found. It might have been deleted, or you may not have permission to view it.");
              } else {
                throw new Error('Failed to fetch form configuration');
              }
            } else {
              const data = await response.json();
              const mergedConfig = {
                ...data.settings,
                id: data.id ?? data.settings?.id ?? formId,
                name: data.name ?? data.settings?.name ?? 'Untitled Form',
                projectId: data.project_id,
                theme: {
                  ...defaultTheme,
                  ...(data.settings?.theme ?? {}),
                },
              } as FormConfig;
              setFormConfig(mergedConfig);
            }
          } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Could not load form data.');
            setError(error.message);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchFormConfig();
      }, [formId]);

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

    const handleCopyColor = useCallback(async (value: string) => {
        if (!value) {
            return;
        }

        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(value);
                toast.success('Color copied to clipboard');
            }
        } catch (error) {
            console.error(error);
            toast.error('Unable to copy color');
        }
    }, []);

    const handleSave = async () => {
        if (!formConfig) {
            toast.error('Cannot save form without an ID.');
            return;
        }
        if (!formId) {
            toast.error('No form ID provided');
            return;
        }
        setIsSaving(true);
        try {
            const response = await fetch(`/api/forms/${formId}`, {
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

  if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="size-12 border-4 border-gray-700 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="text-gray-400">Loading form builder...</p>
          </div>
        </div>
      );
  }

  if (error || !formConfig) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
            <div className="flex flex-col items-center gap-4 text-center p-4">
                <div className="text-5xl mb-4">😢</div>
                <h1 className="text-2xl font-bold">Something went wrong</h1>
                <p className="text-gray-400 max-w-md">{error || "The form configuration could not be loaded. It might not exist."}</p>
                <a href="/dashboard/forms">
                    <Button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white">
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Back to Forms
                    </Button>
                </a>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen bg-gray-950 text-white">
        <Toaster position="bottom-right" theme="dark" />
        <header className="relative flex-none flex items-center justify-between h-16 px-6 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 z-20">
            {/* Left Section: Back button and Form Name */}
                <div className="flex items-center gap-3">
                <button className="text-gray-400 rounded-md p-1 hover:bg-white/10 transition-colors">
                        <ArrowLeftIcon />
                    </button>
                    <div className="flex items-center gap-2 group cursor-pointer">
                    <h1 className="text-lg font-medium text-white">{formConfig.name}</h1>
                    <button className="text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-white hover:scale-110">
                        <EditIcon />
                    </button>
                    </div>
                </div>

            {/* Center Section: Navigation Tabs */}
            <div className="flex items-center gap-1 bg-gray-900 rounded-xl p-1 backdrop-blur-sm border border-gray-800">
                <NavItem 
                    icon={<SettingsIcon />} 
                    active={activeNavTab === 'settings'}
                    onClick={() => setActiveNavTab('settings')}
                >
                    Settings
                </NavItem>
                <NavItem 
                    icon={<FormIcon />} 
                    active={activeNavTab === 'form'}
                    onClick={() => setActiveNavTab('form')}
                >
                    Form
                </NavItem>
                <NavItem 
                    icon={<RewardIcon />} 
                    active={activeNavTab === 'rewards'}
                    onClick={() => setActiveNavTab('rewards')}
                >
                    Rewards
                </NavItem>
                </div>

            {/* Right Section: Save Button */}
                <div className="flex items-center">
                    <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/25"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save changes'}
                    </Button>
            </div>
        </header>
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area with Smooth Transitions */}
        <AnimatePresence mode="wait">
          {activeNavTab === 'form' && (
            <motion.main
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-1 relative overflow-hidden bg-gray-900"
            >
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
            </motion.main>
          )}

           {/* Settings Tab Content */}
           {activeNavTab === 'settings' && (
             <motion.main
               key="settings"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3, ease: "easeInOut" }}
               className="flex-1 relative overflow-hidden bg-gray-900"
             >
                 <div className="relative z-10 h-full w-full flex items-center justify-center p-12">
                     <motion.div 
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.1, duration: 0.4 }}
                       className="w-full max-w-3xl"
                     >
                         {/* Header */}
                         <div className="mb-8">
                             <h2 className="text-3xl font-bold text-white mb-2">Global Settings</h2>
                             <p className="text-gray-400">Configure branding and styling for your entire form</p>
                         </div>

                         {/* Settings Grid */}
                         <div className="space-y-5">
                             {/* Logo Upload */}
                             <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-5 hover:border-gray-700/50 transition-all duration-200">
                                 <div className="flex justify-between items-center">
                                     <div>
                                         <label className="text-sm font-medium text-gray-300 block">Brand Logo</label>
                                         <p className="text-xs text-gray-500 mt-1">Click image to upload</p>
                                     </div>
                                     <div className="relative group w-20 h-20 rounded-xl bg-gray-950 border border-gray-700/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                                         <img 
                                             src={formConfig.theme?.logoUrl ?? defaultTheme.logoUrl} 
                                             alt="Logo" 
                                             className="w-16 h-16 object-contain transition-opacity duration-300 group-hover:opacity-40"
                                             onError={(e) => {
                                                 const target = e.currentTarget;
                                                 target.style.display = 'none';
                                                 const fallback = target.nextElementSibling as HTMLElement;
                                                 if (fallback) fallback.style.display = 'flex';
                                             }}
                                         />
                                         <div className="absolute inset-0 hidden flex-col items-center justify-center text-gray-500 pointer-events-none">
                                             <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                             <p className="text-xs font-medium">No Logo</p>
                                         </div>
                                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center cursor-pointer">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) {
                                                      console.warn('[FormBuilder] Logo upload aborted: no file selected');
                                                      return;
                                                    }

                                                    console.info('[FormBuilder] Logo upload initiated', {
                                                      formId,
                                                      projectId: formConfig?.projectId,
                                                      file: {
                                                        name: file.name,
                                                        size: file.size,
                                                        type: file.type,
                                                      },
                                                    });

                                                    if (!formConfig?.projectId) {
                                                      console.error('[FormBuilder] Missing projectId in formConfig during logo upload');
                                                      toast.error('Unable to upload logo: missing project context. Please reload the form.');
                                                      if (fileInputRef.current) {
                                                        fileInputRef.current.value = '';
                                                      }
                                                      return;
                                                    }

                                                    setIsUploadingLogo(true);
                                                    try {
                                                        const uploadResult = await uploadImageToStorage({
                                                          file,
                                                          context: {
                                                            type: 'project',
                                                            projectId: formConfig.projectId,
                                                            namespace: 'form-assets/logos',
                                                          },
                                                        });

                                                        console.info('[FormBuilder] Logo upload completed', {
                                                          uploadResult,
                                                        });

                                                        updateTheme(
                                                          (theme) => ({
                                                            ...theme,
                                                            logoUrl: uploadResult.url,
                                                          }),
                                                          setFormConfig,
                                                        );

                                                        toast.success('Logo uploaded successfully');
                                                    } catch (uploadError: any) {
                                                        console.error('[FormBuilder] Logo upload failed', {
                                                          errorMessage: uploadError?.message,
                                                          error: uploadError,
                                                        });
                                                        toast.error(uploadError.message || 'Failed to upload logo');
                                                    } finally {
                                                        setIsUploadingLogo(false);
                                                    }

                                                    if (fileInputRef.current) {
                                                      fileInputRef.current.value = '';
                                                    }
                                                }}
                                            />
                                             <div className="text-center pointer-events-none">
                                                {isUploadingLogo ? (
                                                  <>
                                                    <div className="w-6 h-6 border-2 border-white/50 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                                    <p className="text-xs text-white font-semibold">Uploading…</p>
                                                  </>
                                                ) : (
                                                  <>
                                                    <svg className="w-6 h-6 text-white mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                    <p className="text-xs text-white font-semibold">Change</p>
                                                  </>
                                                )}
                                             </div>
                                         </div>
                                     </div>
                                 </div>

                             {/* Colors Grid */}
                             <div className="grid grid-cols-2 gap-5">
                                 {/* Primary Color */}
                                 <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-5 hover:border-gray-700/50 transition-all duration-200">
                                     <div className="flex items-start justify-between mb-4">
                                         <div>
                                             <label className="text-sm font-medium text-gray-300 block">Primary Color</label>
                                             <p className="text-xs text-gray-500 mt-1">Brand accents & CTAs</p>
                                         </div>
                                         <button
                                             onClick={() => handleCopyColor(formConfig.theme?.primaryColor ?? defaultTheme.primaryColor)}
                                             className="p-1.5 rounded-lg border border-gray-700/60 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                                             aria-label="Copy primary color"
                                         >
                                             <CopyIcon />
                                         </button>
                                     </div>
                                     <div className="grid grid-cols-[auto,1fr] gap-3 items-center">
                                         <label className="relative w-14 h-14 rounded-xl shadow-inner overflow-hidden">
                                             <input
                                                 type="color"
                                                 value={formConfig.theme?.primaryColor ?? defaultTheme.primaryColor}
                                                 onChange={(e) => updateTheme(
                                                   (theme) => ({
                                                     ...theme,
                                                     primaryColor: e.target.value,
                                                   }),
                                                   setFormConfig,
                                                 )}
                                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                 aria-label="Select primary color"
                                             />
                                             <span
                                                 className="absolute inset-0 rounded-xl border border-gray-700/60"
                                                 style={{ background: createGradient(formConfig.theme?.primaryColor ?? defaultTheme.primaryColor) }}
                                             ></span>
                                         </label>
                                         <div className="flex items-center gap-2">
                                             <input
                                                 type="text"
                                                 value={formConfig.theme?.primaryColor ?? defaultTheme.primaryColor}
                                                 onChange={(e) => updateTheme(
                                                   (theme) => ({
                                                     ...theme,
                                                     primaryColor: e.target.value,
                                                   }),
                                                   setFormConfig,
                                                 )}
                                                 className="flex-1 bg-gray-950 border border-gray-700/50 rounded-lg px-3 py-2.5 text-white font-mono text-sm focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all duration-200"
                                             />
                                         </div>
                                     </div>
                                     <div className="mt-4">
                                         <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Presets</p>
                                         <div className="flex flex-wrap gap-2">
                                             {PRIMARY_COLOR_PRESETS.map((color) => (
                                                 <button
                                                     key={color}
                                                     onClick={() => updateTheme(
                                                       (theme) => ({
                                                         ...theme,
                                                         primaryColor: color,
                                                       }),
                                                       setFormConfig,
                                                     )}
                                                     className={`w-8 h-8 rounded-full border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                                                         (formConfig.theme?.primaryColor ?? defaultTheme.primaryColor) === color
                                                             ? 'border-white ring-2 ring-purple-500/50'
                                                             : 'border-transparent hover:scale-105'
                                                     }`}
                                                     style={{ background: createGradient(color) }}
                                                     aria-label={`Select ${color} preset`}
                                                 />
                                             ))}
                                         </div>
                                     </div>
                                 </div>

                                 {/* Secondary Color */}
                                 <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-5 hover:border-gray-700/50 transition-all duration-200">
                                     <div className="flex items-start justify-between mb-4">
                                         <div>
                                             <label className="text-sm font-medium text-gray-300 block">Secondary Color</label>
                                             <p className="text-xs text-gray-500 mt-1">Status chips & highlights</p>
                                         </div>
                                         <button
                                             onClick={() => handleCopyColor(formConfig.theme?.secondaryColor ?? defaultTheme.secondaryColor)}
                                             className="p-1.5 rounded-lg border border-gray-700/60 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                                             aria-label="Copy secondary color"
                                         >
                                             <CopyIcon />
                                         </button>
                                     </div>
                                     <div className="grid grid-cols-[auto,1fr] gap-3 items-center">
                                         <label className="relative w-14 h-14 rounded-xl shadow-inner overflow-hidden">
                                             <input
                                                 type="color"
                                                 value={formConfig.theme?.secondaryColor ?? defaultTheme.secondaryColor}
                                                 onChange={(e) => updateTheme(
                                                   (theme) => ({
                                                     ...theme,
                                                     secondaryColor: e.target.value,
                                                   }),
                                                   setFormConfig,
                                                 )}
                                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                 aria-label="Select secondary color"
                                             />
                                             <span
                                                 className="absolute inset-0 rounded-xl border border-gray-700/60"
                                                 style={{ background: createGradient(formConfig.theme?.secondaryColor ?? defaultTheme.secondaryColor) }}
                                             ></span>
                                         </label>
                                         <div className="flex items-center gap-2">
                                             <input
                                                 type="text"
                                                 value={formConfig.theme?.secondaryColor ?? defaultTheme.secondaryColor}
                                                 onChange={(e) => updateTheme(
                                                   (theme) => ({
                                                     ...theme,
                                                     secondaryColor: e.target.value,
                                                   }),
                                                   setFormConfig,
                                                 )}
                                                 className="flex-1 bg-gray-950 border border-gray-700/50 rounded-lg px-3 py-2.5 text-white font-mono text-sm focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all duration-200"
                                             />
                                         </div>
                                     </div>
                                     <div className="mt-4">
                                         <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Presets</p>
                                         <div className="flex flex-wrap gap-2">
                                             {SECONDARY_COLOR_PRESETS.map((color) => (
                                                 <button
                                                     key={color}
                                                     onClick={() => updateTheme(
                                                       (theme) => ({
                                                         ...theme,
                                                         secondaryColor: color,
                                                       }),
                                                       setFormConfig,
                                                     )}
                                                     className={`w-8 h-8 rounded-full border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                                                         (formConfig.theme?.secondaryColor ?? defaultTheme.secondaryColor) === color
                                                             ? 'border-white ring-2 ring-purple-500/50'
                                                             : 'border-transparent hover:scale-105'
                                                     }`}
                                                     style={{ background: createGradient(color) }}
                                                     aria-label={`Select ${color} preset`}
                                                 />
                                             ))}
                                         </div>
                                     </div>
                                 </div>
                             </div>

                             {/* Fonts Grid */}
                             <div className="grid grid-cols-2 gap-5">
                                 {/* Heading Font */}
                                 <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-5 hover:border-gray-700/50 transition-all duration-200">
                                     <label className="text-sm font-medium text-gray-300 mb-3 block">Heading Font</label>
                                     <FontPicker
                                         value={formConfig.theme?.headingFont ?? defaultTheme.headingFont}
                                         onChange={(value) => updateTheme(
                                           (theme) => ({
                                             ...theme,
                                             headingFont: theme.headingFont === value ? defaultTheme.headingFont : value,
                                           }),
                                           setFormConfig,
                                         )}
                                     />
                                 </div>
 
                                 {/* Body Font */}
                                 <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-5 hover:border-gray-700/50 transition-all duration-200">
                                     <label className="text-sm font-medium text-gray-300 mb-3 block">Body Font</label>
                                     <FontPicker
                                         value={formConfig.theme?.bodyFont ?? defaultTheme.bodyFont}
                                         onChange={(value) => updateTheme(
                                           (theme) => ({
                                             ...theme,
                                             bodyFont: theme.bodyFont === value ? defaultTheme.bodyFont : value,
                                           }),
                                           setFormConfig,
                                         )}
                                     />
                                 </div>
                                 </div>
                             </div>
                         </div>
                     </motion.div>
                 </div>
             </motion.main>
           )}

          {/* Rewards Tab Content */}
          {activeNavTab === 'rewards' && (
            <motion.main
              key="rewards"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-1 relative overflow-hidden bg-gray-900"
            >
                <div className="relative z-10 h-full w-full flex flex-col items-center justify-center p-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="text-center max-w-md"
                    >
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                        >
                          <RewardIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        </motion.div>
                        <motion.h2 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.3 }}
                          className="text-2xl font-semibold text-white mb-2"
                        >
                          Rewards & Incentives
                        </motion.h2>
                        <motion.p 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                          className="text-gray-400 mb-6"
                        >
                          Motivate users to leave testimonials with rewards and incentives.
                        </motion.p>
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.3 }}
                          className="bg-gray-800/50 rounded-lg p-6 text-left border border-gray-700/50"
                        >
                            <p className="text-sm text-gray-300">Coming soon: Gift cards, Discounts, Free trials, Custom rewards</p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.main>
          )}
        </AnimatePresence>
        
        {/* PowerPoint-style thumbnail sidebar - Only show for Form tab */}
        <AnimatePresence>
          {activeNavTab === 'form' && (
            <motion.aside
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-96 flex-none flex flex-col bg-gray-950 border-l border-gray-800"
            >
           <div className="grid grid-cols-2 divide-x divide-gray-800 border-b border-gray-800">
             <button
               onClick={() => setActiveTab('pages')}
               className={`flex items-center justify-center gap-2.5 px-4 py-5 text-center transition-all duration-200 ${
                 activeTab === 'pages' 
                   ? 'bg-gray-900 shadow-inner' 
                   : 'bg-transparent hover:bg-gray-900/30'
               }`}
             >
               <div className={`transition-all duration-200 ${activeTab === 'pages' ? 'scale-110' : ''}`}>
                 <PagesIcon className={activeTab === 'pages' ? 'text-purple-400' : 'text-gray-500'} />
               </div>
               <span className={`text-sm font-semibold transition-colors ${activeTab === 'pages' ? 'text-white' : 'text-gray-400'}`}>
                 Pages
               </span>
             </button>
             <button
               onClick={() => setActiveTab('edit')}
               className={`flex items-center justify-center gap-2.5 px-4 py-5 text-center transition-all duration-200 ${
                 activeTab === 'edit' 
                   ? 'bg-gray-900 shadow-inner' 
                   : 'bg-transparent hover:bg-gray-900/30'
               }`}
             >
               <div className={`transition-all duration-200 ${activeTab === 'edit' ? 'scale-110' : ''}`}>
                 <SettingsIcon className={activeTab === 'edit' ? 'text-purple-400' : 'text-gray-500'} />
               </div>
               <span className={`text-sm font-semibold transition-colors ${activeTab === 'edit' ? 'text-white' : 'text-gray-400'}`}>
                 Edit
               </span>
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
                       <div className="aspect-video bg-gray-900 rounded-t-md border-b border-gray-700 overflow-hidden relative pointer-events-none">
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
          </motion.aside>
          )}
        </AnimatePresence>
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
