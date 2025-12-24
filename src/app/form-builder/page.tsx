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
import AboutCompanyCard from '@/components/AboutCompanyCard';
import ReadyToSendCard from '@/components/ReadyToSendCard';
import ThankYouCard from '@/components/ThankYouCard';
import WelcomeCard from '@/components/WelcomeCard';
import { Reorder, motion, AnimatePresence } from "framer-motion";

import { type FormConfig, type FormBlock, FormBlockType, type FormTheme, type QuestionBlockConfig } from '@/types/form-config';
import FormBuilderEditPanel from '@/components/edit-panels/FormBuilderEditPanel';
import PagesPanel from '@/components/form-builder/PagesPanel';
import GlobalSettingsPanel from '@/components/form-builder/GlobalSettingsPanel';
import { toast, Toaster } from 'sonner';
import { useSearchParams } from 'next/navigation';

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

const PreviewIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);



const defaultTheme: FormTheme = {
  backgroundColor: '#0A0A0A',
  logoUrl: '/logo.svg',
  primaryColor: '#A855F7',
  secondaryColor: '#22C55E',
  headingFont: 'Space Grotesk',
  bodyFont: 'Inter',
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
    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${active
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
  // onDelete?: (id: string) => void; - This will be handled in the main page
  // isDeletable?: boolean;
  theme: FormTheme;
  isPreview?: boolean;
}

export const FormCard: React.FC<React.PropsWithChildren<Omit<FormCardProps, 'config' | 'onFieldFocus'>>> = ({
  children,
  currentPage,
  totalPages,
  onNext,
  onPrevious,
  isPreview = false,
}) => {
  // In preview mode: full screen, no page bar
  // In editor mode: constrained size with page bar
  const containerClass = isPreview
    ? "w-full h-full bg-gray-950 overflow-hidden flex flex-col"
    : "w-[96%] max-w-[1400px] 2xl:max-w-[1600px] h-[70vh] min-h-[600px] max-h-[700px] mx-auto bg-gray-950 rounded-3xl shadow-2xl overflow-hidden border border-gray-800/50 flex flex-col";

  return (
    <div className={containerClass}>
      {/* Page navigation bar - hidden in preview mode */}
      {!isPreview && (
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
      )}
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
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewPageIndex, setPreviewPageIndex] = useState(0);

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

          // Normalize blocks: convert old 'title' field to 'email' in AboutYou blocks
          let normalizedBlocks = (data.settings?.blocks || []).map((block: any) => {
            if (block.type === FormBlockType.AboutYou && block.props?.fields) {
              const fields = block.props.fields;
              // If 'title' exists but 'email' doesn't, convert title to email
              if (fields.title && !fields.email) {
                return {
                  ...block,
                  props: {
                    ...block.props,
                    fields: {
                      ...fields,
                      email: {
                        enabled: fields.title.enabled,
                        required: fields.title.required,
                        label: 'Email',
                        placeholder: 'john@example.com'
                      },
                      title: undefined // Remove old title field
                    }
                  }
                };
              }
            }
            return block;
          });

          const mergedConfig = {
            ...data.settings,
            id: data.id ?? data.settings?.id ?? formId,
            name: data.name ?? data.settings?.name ?? 'Untitled Form',
            projectId: data.project_id,
            theme: {
              ...defaultTheme,
              ...(data.settings?.theme ?? {}),
            },
            blocks: normalizedBlocks,
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
    setFormConfig(prevConfig => {
      if (!prevConfig) return null;
      return {
        ...prevConfig,
        blocks: newOrder,
      };
    });
  };

  const handleAddPage = () => {
    setFormConfig(prevConfig => {
      if (!prevConfig) return null;

      // Create a new Question block
      const newBlock: QuestionBlockConfig = {
        id: `question-${Date.now()}`,
        type: FormBlockType.Question,
        enabled: true,
        props: {
          question: 'What made you choose us?',
          description: 'Share your experience with us',
          questionColor: '#FFFFFF',
          descriptionColor: '#9CA3AF',
          enableTextTestimonial: true,
          enableVideoTestimonial: true,
          videoOptionTitle: 'Record a video',
          videoOptionDescription: '2-minute video testimonial',
          textOptionTitle: 'Write your story',
          textOptionDescription: 'Text testimonial',
          tips: [
            'Be specific about what you liked',
            'Mention any results or outcomes',
            'Share how it helped you',
          ],
        },
      };

      // Insert the new block before the last block (ThankYou) if it exists
      // Otherwise just add it at the end
      const blocks = [...prevConfig.blocks];
      const thankYouIndex = blocks.findIndex(b => b.type === FormBlockType.ThankYou);

      if (thankYouIndex !== -1) {
        blocks.splice(thankYouIndex, 0, newBlock);
      } else {
        blocks.push(newBlock);
      }

      toast.success('New question page added!');

      return {
        ...prevConfig,
        blocks,
      };
    });
  };

  const handleDeletePage = (id: string) => {
    setFormConfig(prevConfig => {
      if (!prevConfig) return null;

      const blockToDelete = prevConfig.blocks.find(b => b.id === id);
      if (!blockToDelete) return prevConfig;

      // Prevent deleting core pages (Welcome and ThankYou)
      const coreTypes = [FormBlockType.Welcome, FormBlockType.ThankYou];
      if (coreTypes.includes(blockToDelete.type)) {
        toast.error(`Cannot delete ${blockToDelete.type} page - it's required for the form`);
        return prevConfig;
      }

      // Filter out the deleted block
      const newBlocks = prevConfig.blocks.filter(b => b.id !== id);

      // Adjust currentPageIndex if needed
      const newEnabledBlocks = newBlocks.filter(b => b.enabled);
      if (currentPageIndex >= newEnabledBlocks.length) {
        setCurrentPageIndex(Math.max(0, newEnabledBlocks.length - 1));
      }

      toast.success('Page deleted');

      return {
        ...prevConfig,
        blocks: newBlocks,
      };
    });
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
          <a href="/forms">
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

        {/* Right Section: Preview and Save Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-200 flex items-center gap-2"
            onClick={() => {
              setPreviewPageIndex(0);
              setIsPreviewMode(true);
            }}
          >
            <PreviewIcon className="w-4 h-4" />
            Preview
          </Button>
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
                      theme: formConfig.theme,
                    };

                    switch (block.type) {
                      case FormBlockType.Welcome: return <WelcomeCard key={block.id} {...cardProps} config={block as any} />;
                      case FormBlockType.Rating: return <RatingCard key={block.id} {...cardProps} config={block as any} />;
                      case FormBlockType.Question: return <QuestionCard key={block.id} {...cardProps} config={block as any} />;
                      case FormBlockType.NegativeFeedback: return <NegativeFeedbackCard key={block.id} {...cardProps} config={block as any} />;
                      case FormBlockType.PrivateFeedback: return <PrivateFeedbackCard key={block.id} {...cardProps} config={block as any} />;
                      case FormBlockType.Consent: return <ConsentCard key={block.id} {...cardProps} config={block as any} />;
                      case FormBlockType.AboutYou: return <AboutYouCard key={block.id} {...cardProps} config={block as any} />;
                      case FormBlockType.AboutCompany: return <AboutCompanyCard key={block.id} {...cardProps} config={block as any} />;
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
              <div className="relative z-10 h-full w-full flex justify-center pt-8 pb-12 px-12 overflow-y-auto scrollbar-hide">
                <GlobalSettingsPanel
                  formConfig={formConfig}
                  setFormConfig={setFormConfig}
                  defaultTheme={defaultTheme}
                />
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
                  className={`flex items-center justify-center gap-2.5 px-4 py-5 text-center transition-all duration-200 ${activeTab === 'pages'
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
                  className={`flex items-center justify-center gap-2.5 px-4 py-5 text-center transition-all duration-200 ${activeTab === 'edit'
                    ? 'bg-gray-900 shadow-inner'
                    : 'bg-transparent hover:bg-gray-900/30'
                    }`}
                >
                  <div className={`transition-all duration-200 ${activeTab === 'edit' ? 'scale-110' : ''}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={activeTab === 'edit' ? 'text-purple-400' : 'text-gray-500'}
                    >
                      <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
                      <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
                    </svg>
                  </div>
                  <span className={`text-sm font-semibold transition-colors ${activeTab === 'edit' ? 'text-white' : 'text-gray-400'}`}>
                    Customize
                  </span>
                </button>
              </div>

              {activeTab === 'pages' && (
                <PagesPanel
                  blocks={formConfig.blocks}
                  enabledBlocks={enabledBlocks}
                  currentPageIndex={currentPageIndex}
                  onReorder={handleReorder}
                  onPageClick={handlePageClick}
                  onTogglePage={handleTogglePage}
                  onDeletePage={handleDeletePage}
                  onAddPage={handleAddPage}
                />
              )}

              {activeTab === 'edit' && (
                <FormBuilderEditPanel
                  focusedBlock={enabledBlocks[currentPageIndex] || null}
                  onUpdateBlock={handleUpdateBlock}
                  focusedField={focusedField}
                />
              )}
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewMode && formConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsPreviewMode(false);
            }}
            tabIndex={0}
            ref={(el) => el?.focus()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsPreviewMode(false)}
              className="absolute top-6 right-6 z-50 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors border border-gray-700"
              aria-label="Close preview"
            >
              <CloseIcon />
            </button>

            {/* Preview Content */}
            <div className="h-full w-full">
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="w-full h-full"
                style={{ backgroundColor: formConfig.theme.backgroundColor }}
              >
                {(() => {
                  const block = enabledBlocks[previewPageIndex];
                  if (!block) return null;

                  const previewCardProps = {
                    config: block,
                    currentPage: previewPageIndex + 1,
                    totalPages: enabledBlocks.length,
                    onNext: () => setPreviewPageIndex(prev => Math.min(prev + 1, enabledBlocks.length - 1)),
                    onPrevious: () => setPreviewPageIndex(prev => Math.max(prev - 1, 0)),
                    onFieldFocus: () => { }, // No-op in preview mode
                    theme: formConfig.theme,
                    isPreview: true,
                  };

                  switch (block.type) {
                    case FormBlockType.Welcome: return <WelcomeCard key={block.id} {...previewCardProps} config={block as any} />;
                    case FormBlockType.Rating: return <RatingCard key={block.id} {...previewCardProps} config={block as any} />;
                    case FormBlockType.Question: return <QuestionCard key={block.id} {...previewCardProps} config={block as any} />;
                    case FormBlockType.NegativeFeedback: return <NegativeFeedbackCard key={block.id} {...previewCardProps} config={block as any} />;
                    case FormBlockType.PrivateFeedback: return <PrivateFeedbackCard key={block.id} {...previewCardProps} config={block as any} />;
                    case FormBlockType.Consent: return <ConsentCard key={block.id} {...previewCardProps} config={block as any} />;
                    case FormBlockType.AboutYou: return <AboutYouCard key={block.id} {...previewCardProps} config={block as any} />;
                    case FormBlockType.AboutCompany: return <AboutCompanyCard key={block.id} {...previewCardProps} config={block as any} />;
                    case FormBlockType.ReadyToSend: return <ReadyToSendCard key={block.id} {...previewCardProps} config={block as any} />;
                    case FormBlockType.ThankYou: return <ThankYouCard key={block.id} {...previewCardProps} config={block as any} />;
                    default: return null;
                  }
                })()}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormBuilderPage;
