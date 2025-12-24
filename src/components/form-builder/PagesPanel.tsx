"use client";

import React, { useState } from 'react';
import { Reorder, motion, AnimatePresence, useDragControls } from "framer-motion";
import { type FormBlock, FormBlockType } from '@/types/form-config';

// Human-readable labels for page types
const PAGE_LABELS: Record<FormBlockType, string> = {
    [FormBlockType.Welcome]: 'Welcome Screen',
    [FormBlockType.Rating]: 'Rating Stars',
    [FormBlockType.NegativeFeedback]: 'Improvement Tips',
    [FormBlockType.Question]: 'Question',
    [FormBlockType.PrivateFeedback]: 'Private Note',
    [FormBlockType.Consent]: 'Permissions',
    [FormBlockType.AboutYou]: 'Your Details',
    [FormBlockType.AboutCompany]: 'Company Info',
    [FormBlockType.ReadyToSend]: 'Review & Send',
    [FormBlockType.ThankYou]: 'Thank You',
};

// Friendly descriptions for each page type
const PAGE_DESCRIPTIONS: Record<FormBlockType, string> = {
    [FormBlockType.Welcome]: 'First impression for your audience',
    [FormBlockType.Rating]: 'Quick star rating from 1-5',
    [FormBlockType.NegativeFeedback]: 'Gather constructive feedback',
    [FormBlockType.Question]: 'Collect written or video stories',
    [FormBlockType.PrivateFeedback]: 'Confidential feedback only you see',
    [FormBlockType.Consent]: 'Permission to use their words',
    [FormBlockType.AboutYou]: 'Name, photo & contact info',
    [FormBlockType.AboutCompany]: 'Title, company & logo',
    [FormBlockType.ReadyToSend]: 'Final review before submitting',
    [FormBlockType.ThankYou]: 'Celebration & next steps',
};

// Beautiful icons for each page type
const PageIcon = ({ type, active = false }: { type: FormBlockType; active?: boolean }) => {
    const iconColor = active ? 'text-white' : 'text-gray-400';

    const icons: Record<FormBlockType, React.ReactNode> = {
        [FormBlockType.Welcome]: (
            <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                <path d="M18.36 6.64a9 9 0 0 1 1.5 5.36c-.06 3.85-3.1 7-6.9 7A7 7 0 0 1 12 5" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <path d="M9 9h.01" /><path d="M15 9h.01" />
            </svg>
        ),
        [FormBlockType.Rating]: (
            <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ),
        [FormBlockType.NegativeFeedback]: (
            <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 10h8" />
            </svg>
        ),
        [FormBlockType.Question]: (
            <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        ),
        [FormBlockType.PrivateFeedback]: (
            <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        ),
        [FormBlockType.Consent]: (
            <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        ),
        [FormBlockType.AboutYou]: (
            <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        [FormBlockType.AboutCompany]: (
            <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                <path d="M9 22v-4h6v4" />
                <path d="M8 6h.01" />
                <path d="M16 6h.01" />
                <path d="M12 6h.01" />
                <path d="M12 10h.01" />
                <path d="M12 14h.01" />
                <path d="M16 10h.01" />
                <path d="M16 14h.01" />
                <path d="M8 10h.01" />
                <path d="M8 14h.01" />
            </svg>
        ),
        [FormBlockType.ReadyToSend]: (
            <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
        ),
        [FormBlockType.ThankYou]: (
            <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
    };

    return icons[type] || null;
};

// Color schemes for each page type
const PAGE_COLORS: Record<FormBlockType, { bg: string; gradient: string; ring: string }> = {
    [FormBlockType.Welcome]: { bg: 'bg-emerald-500/20', gradient: 'from-emerald-500 to-teal-500', ring: 'ring-emerald-500/50' },
    [FormBlockType.Rating]: { bg: 'bg-amber-500/20', gradient: 'from-amber-400 to-orange-500', ring: 'ring-amber-500/50' },
    [FormBlockType.NegativeFeedback]: { bg: 'bg-rose-500/20', gradient: 'from-rose-500 to-pink-500', ring: 'ring-rose-500/50' },
    [FormBlockType.Question]: { bg: 'bg-violet-500/20', gradient: 'from-violet-500 to-purple-500', ring: 'ring-violet-500/50' },
    [FormBlockType.PrivateFeedback]: { bg: 'bg-slate-500/20', gradient: 'from-slate-500 to-gray-500', ring: 'ring-slate-500/50' },
    [FormBlockType.Consent]: { bg: 'bg-blue-500/20', gradient: 'from-blue-500 to-indigo-500', ring: 'ring-blue-500/50' },
    [FormBlockType.AboutYou]: { bg: 'bg-cyan-500/20', gradient: 'from-cyan-500 to-sky-500', ring: 'ring-cyan-500/50' },
    [FormBlockType.AboutCompany]: { bg: 'bg-indigo-500/20', gradient: 'from-indigo-500 to-purple-500', ring: 'ring-indigo-500/50' },
    [FormBlockType.ReadyToSend]: { bg: 'bg-green-500/20', gradient: 'from-green-500 to-emerald-500', ring: 'ring-green-500/50' },
    [FormBlockType.ThankYou]: { bg: 'bg-pink-500/20', gradient: 'from-pink-500 to-rose-400', ring: 'ring-pink-500/50' },
};

// Drag handle component
const DragHandle = () => (
    <div className="flex flex-col gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <div className="flex gap-0.5">
            <div className="w-1 h-1 rounded-full bg-gray-500" />
            <div className="w-1 h-1 rounded-full bg-gray-500" />
        </div>
        <div className="flex gap-0.5">
            <div className="w-1 h-1 rounded-full bg-gray-500" />
            <div className="w-1 h-1 rounded-full bg-gray-500" />
        </div>
        <div className="flex gap-0.5">
            <div className="w-1 h-1 rounded-full bg-gray-500" />
            <div className="w-1 h-1 rounded-full bg-gray-500" />
        </div>
    </div>
);

// Toggle switch component
const Toggle = ({ checked, onChange, disabled = false }: { checked: boolean; onChange: () => void; disabled?: boolean }) => (
    <button
        onClick={(e) => { e.stopPropagation(); if (!disabled) onChange(); }}
        className={`relative w-10 h-5 rounded-full transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } ${checked ? 'bg-gradient-to-r from-purple-500 to-violet-500' : 'bg-gray-700'}`}
        aria-label={checked ? 'Disable page' : 'Enable page'}
    >
        <motion.div
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md ${checked ? 'left-5' : 'left-0.5'
                }`}
        />
    </button>
);

// Individual page item component
interface PageItemProps {
    block: FormBlock;
    index: number;
    enabledIndex: number;
    isActive: boolean;
    onSelect: () => void;
    onToggle: () => void;
    onDelete: () => void;
    canDelete: boolean;
}

const PageItem = ({
    block,
    index,
    enabledIndex,
    isActive,
    onSelect,
    onToggle,
    onDelete,
    canDelete,
}: PageItemProps) => {
    const colors = PAGE_COLORS[block.type];
    const label = PAGE_LABELS[block.type] || block.type;
    const description = PAGE_DESCRIPTIONS[block.type] || '';

    return (
        <Reorder.Item
            key={block.id}
            value={block}
            className="touch-none"
        >
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => block.enabled && onSelect()}
                className={`group relative rounded-2xl p-5 cursor-pointer transition-all duration-300 ${isActive
                    ? 'bg-gray-900/80 border border-purple-500/60 shadow-sm'
                    : block.enabled
                        ? 'bg-gray-900/60 hover:bg-gray-800/80 border border-gray-800/50 hover:border-gray-700/50'
                        : 'bg-gray-900/30 border border-gray-800/30'
                    } ${!block.enabled ? 'opacity-50' : ''}`}
            >
                {/* Connection line to next item */}
                <div
                    className="absolute left-8 -bottom-3 w-0.5 h-3 bg-gradient-to-b from-gray-700 to-transparent pointer-events-none"
                />

                <div className="flex items-center gap-4">
                    {/* Drag handle */}
                    <div>
                        <DragHandle />
                    </div>

                    {/* Icon with number badge */}
                    <div className="relative flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${colors.bg}`}>
                            <PageIcon type={block.type} active={false} />
                        </div>
                        <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${block.enabled
                            ? isActive
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-700 text-gray-300'
                            : 'bg-gray-800 text-gray-500'
                            }`}>
                            {block.enabled ? enabledIndex + 1 : '–'}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold truncate transition-colors text-gray-200">
                            {label}
                        </h3>
                        <p className="text-sm truncate mt-1 transition-colors text-gray-500">
                            {description}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {/* Delete button */}
                        {canDelete && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all"
                                aria-label="Delete page"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                    <path d="M10 11v6" />
                                    <path d="M14 11v6" />
                                </svg>
                            </button>
                        )}

                        {/* Toggle */}
                        <Toggle
                            checked={block.enabled}
                            onChange={onToggle}
                            disabled={block.type === FormBlockType.Welcome || block.type === FormBlockType.ThankYou}
                        />
                    </div>
                </div>


            </motion.div>
        </Reorder.Item>
    );
};

// Main PagesPanel component
interface PagesPanelProps {
    blocks: FormBlock[];
    enabledBlocks: FormBlock[];
    currentPageIndex: number;
    onReorder: (newOrder: FormBlock[]) => void;
    onPageClick: (index: number) => void;
    onTogglePage: (blockId: string) => void;
    onDeletePage: (blockId: string) => void;
    onAddPage: () => void;
}

const PagesPanel: React.FC<PagesPanelProps> = ({
    blocks,
    enabledBlocks,
    currentPageIndex,
    onReorder,
    onPageClick,
    onTogglePage,
    onDeletePage,
    onAddPage,
}) => {
    return (
        <div className="flex flex-col h-full">
            {/* Pages List */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
                <Reorder.Group axis="y" values={blocks} onReorder={onReorder} className="space-y-2">
                    <AnimatePresence mode="popLayout">
                        {blocks.map((block, index) => {
                            const enabledIndex = enabledBlocks.findIndex(b => b.id === block.id);
                            const isActive = enabledIndex === currentPageIndex && block.enabled;
                            const canDelete = block.type !== FormBlockType.Welcome && block.type !== FormBlockType.ThankYou;

                            return (
                                <PageItem
                                    key={block.id}
                                    block={block}
                                    index={index}
                                    enabledIndex={enabledIndex}
                                    isActive={isActive}
                                    onSelect={() => onPageClick(enabledIndex)}
                                    onToggle={() => onTogglePage(block.id)}
                                    onDelete={() => onDeletePage(block.id)}
                                    canDelete={canDelete}
                                />
                            );
                        })}
                    </AnimatePresence>
                </Reorder.Group>
            </div>

            {/* Add Page Button */}
            <div className="p-4 border-t border-gray-800/50">
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={onAddPage}
                    className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-gray-700/50 hover:border-purple-500/50 bg-gray-900/30 hover:bg-purple-500/5 transition-all duration-300 group"
                >
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gray-800 group-hover:bg-purple-500/20 flex items-center justify-center transition-colors">
                            <svg className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-500 group-hover:text-purple-400 transition-colors">
                            Add Question
                        </span>
                    </div>
                </motion.button>
                <p className="text-center text-[10px] text-gray-600 mt-2">
                    Tip: Drag pages to reorder them
                </p>
            </div>
        </div>
    );
};

export default PagesPanel;
