"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { uploadImageToStorage } from "@/lib/storage";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

// ==================== TYPES ====================
type ProfileSummary = {
    id: string;
    username: string | null;
    full_name: string | null;
    plan: string | null;
    active_project_id: string | null;
    avatar_url?: string | null;
} | null;

type ProfileModalProps = {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    profile: ProfileSummary;
};

type SidebarTab = "account" | "billing" | "support";

// ==================== ICONS ====================
const UserIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const CreditCardIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
);

const HeadphonesIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const LogOutIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <line x1="18" x2="6" y1="6" y2="18" />
        <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
);

const CameraIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
    </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
    </svg>
);

// ==================== SIDEBAR NAVIGATION ====================
const sidebarTabs: { id: SidebarTab; label: string; icon: React.ReactNode }[] = [
    { id: "account", label: "Account", icon: <UserIcon className="w-5 h-5" /> },
    { id: "billing", label: "Billing", icon: <CreditCardIcon className="w-5 h-5" /> },
    { id: "support", label: "Support", icon: <HeadphonesIcon className="w-5 h-5" /> },
];

// ==================== HELPER FUNCTIONS ====================
const getInitials = (value: string) => {
    return value
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.at(0)?.toUpperCase())
        .join("")
        .slice(0, 2);
};

// ==================== ACCOUNT PANEL ====================
const AccountPanel = ({
    user,
    profile,
    onClose,
}: {
    user: User;
    profile: ProfileSummary;
    onClose: () => void;
}) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isPending, startTransition] = useTransition();
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        // Parse full_name into first and last name
        if (profile?.full_name) {
            const parts = profile.full_name.trim().split(" ");
            setFirstName(parts[0] || "");
            setLastName(parts.slice(1).join(" ") || "");
        } else if (user.user_metadata?.full_name) {
            const parts = String(user.user_metadata.full_name).trim().split(" ");
            setFirstName(parts[0] || "");
            setLastName(parts.slice(1).join(" ") || "");
        }

        // Set avatar URL
        setAvatarUrl(profile?.avatar_url || user.user_metadata?.avatar_url || null);
    }, [profile, user]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatarUrl(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        startTransition(async () => {
            try {
                const supabase = createClient();
                let uploadedAvatarUrl = avatarUrl;

                // Upload avatar if a new file was selected
                if (avatarFile) {
                    const result = await uploadImageToStorage({
                        file: avatarFile,
                        context: {
                            type: "user",
                            userId: user.id,
                            namespace: "avatars",
                        },
                        access: "public",
                    });
                    uploadedAvatarUrl = result.url;
                }

                const fullName = `${firstName} ${lastName}`.trim();

                // Update profile in database
                const { error } = await supabase
                    .from("profiles")
                    .update({
                        full_name: fullName,
                        avatar_url: uploadedAvatarUrl,
                    })
                    .eq("id", user.id);

                if (error) {
                    throw new Error(error.message);
                }

                // Also update user metadata
                await supabase.auth.updateUser({
                    data: {
                        full_name: fullName,
                        avatar_url: uploadedAvatarUrl,
                    },
                });

                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            } catch (error: any) {
                console.error("Failed to save profile:", error);
                alert(error.message || "Failed to save profile");
            }
        });
    };

    const displayName = firstName || lastName ? `${firstName} ${lastName}`.trim() : "User";
    const userInitials = getInitials(displayName);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Account Settings</h2>
                    <p className="text-gray-400 text-sm">Manage your personal information and preferences</p>
                </div>

                {/* Avatar Section */}
                <div className="mb-8">
                    <Label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-4 block">
                        Profile Photo
                    </Label>
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <Avatar className="w-24 h-24 ring-4 ring-gray-800 group-hover:ring-emerald-500/50 transition-all duration-300">
                                <AvatarImage alt={displayName} src={avatarUrl || ""} />
                                <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-700 text-xl font-bold text-white">
                                    {userInitials || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <label
                                htmlFor="avatar-upload"
                                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <CameraIcon className="w-8 h-8 text-white" />
                            </label>
                            <input
                                type="file"
                                id="avatar-upload"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>
                        <div>
                            <p className="text-sm text-gray-300 mb-1">Upload a new photo</p>
                            <p className="text-xs text-gray-500">JPG, PNG or WebP. Max 5MB.</p>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    {/* First Name */}
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter your first name"
                            className="bg-gray-900/60 border-gray-700/60 text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:ring-emerald-500/20 h-12 rounded-xl"
                        />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter your last name"
                            className="bg-gray-900/60 border-gray-700/60 text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:ring-emerald-500/20 h-12 rounded-xl"
                        />
                    </div>

                    {/* Email (Read Only) */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                            Email Address
                        </Label>
                        <div className="relative">
                            <Input
                                id="email"
                                value={user.email || ""}
                                disabled
                                className="bg-gray-900/30 border-gray-800 text-gray-400 h-12 rounded-xl pr-24 cursor-not-allowed"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-md">
                                Cannot change
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 mt-6 border-t border-gray-800/50">
                <Button
                    onClick={handleSave}
                    disabled={isPending}
                    className={`w-full h-12 rounded-xl font-semibold text-base transition-all duration-300 ${saveSuccess
                        ? "bg-emerald-600 hover:bg-emerald-600"
                        : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
                        }`}
                >
                    {isPending ? (
                        <span className="flex items-center gap-2">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Saving...
                        </span>
                    ) : saveSuccess ? (
                        <span className="flex items-center gap-2">
                            <CheckIcon className="w-5 h-5" />
                            Changes Saved!
                        </span>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </div>
        </div>
    );
};

// ==================== BILLING PANEL ====================
const BillingPanel = ({ profile }: { profile: ProfileSummary }) => {
    const planName = profile?.plan?.toLowerCase() || "hacker";
    const isPaidPlan = planName !== "hacker" && planName !== "free";

    return (
        <div className="flex flex-col h-full">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Billing & Plan</h2>
                <p className="text-gray-400 text-sm">Manage your subscription and billing details</p>
            </div>

            {/* Current Plan Card */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-800/60 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-950/80 p-6 mb-6">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-violet-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <SparklesIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Current Plan</p>
                            <p className="text-xl font-bold text-white capitalize">{planName === "hacker" ? "Hacker (Free)" : planName}</p>
                        </div>
                    </div>

                    {!isPaidPlan && (
                        <div className="space-y-3 mt-6">
                            <p className="text-sm text-gray-400">
                                You&apos;re currently on our free plan. Upgrade to unlock more features!
                            </p>
                            <Button className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 font-semibold">
                                Upgrade Plan
                            </Button>
                        </div>
                    )}

                    {isPaidPlan && (
                        <div className="mt-6 pt-6 border-t border-gray-800/50">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Next billing date</span>
                                <span className="text-white font-medium">-</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Features List */}
            <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Plan Features
                </h3>
                <ul className="space-y-3">
                    {[
                        "Collect testimonials",
                        "Build custom forms",
                        "Create beautiful widgets",
                        isPaidPlan ? "Priority support" : "Community support",
                    ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-300">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <CheckIcon className="w-3 h-3 text-emerald-400" />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// ==================== SUPPORT PANEL ====================
const SupportPanel = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Help & Support</h2>
                <p className="text-gray-400 text-sm">Need assistance? Reach out to our support team.</p>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center p-8 rounded-3xl border border-gray-800/60 bg-gradient-to-br from-gray-900/40 to-gray-900/20">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 flex items-center justify-center mb-6 ring-1 ring-violet-500/30">
                    <MailIcon className="w-10 h-10 text-violet-400" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Contact Support</h3>
                <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
                    Have questions or need help with your account? Send us an email and we&apos;ll get back to you as soon as possible.
                </p>

                <a
                    href="mailto:support@trustimonial.io"
                    className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-0.5"
                >
                    <MailIcon className="w-5 h-5" />
                    support@trustimonial.io
                </a>
            </div>
        </div>
    );
};

// ==================== MAIN COMPONENT ====================
const ProfileModal = ({ isOpen, onClose, user, profile }: ProfileModalProps) => {
    const [activeTab, setActiveTab] = useState<SidebarTab>("account");
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = useCallback(async () => {
        await supabase.auth.signOut();
        router.replace("/login");
        onClose();
    }, [supabase.auth, router, onClose]);

    const displayName = profile?.full_name?.trim() || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
    const userInitials = getInitials(displayName);
    const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || "";

    // Render the active panel content
    const renderContent = () => {
        switch (activeTab) {
            case "account":
                return <AccountPanel user={user} profile={profile} onClose={onClose} />;
            case "billing":
                return <BillingPanel profile={profile} />;
            case "support":
                return <SupportPanel />;
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed inset-4 sm:inset-[5%] md:inset-[10%] lg:inset-[12%] z-50 flex flex-col md:flex-row overflow-hidden rounded-3xl border border-gray-800/60 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 shadow-2xl shadow-black/40"
                    >
                        {/* Decorative Gradient Orbs */}
                        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-600/20 to-transparent blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-emerald-600/10 to-transparent blur-3xl rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

                        {/* Left Sidebar */}
                        <div className="relative flex-shrink-0 w-full md:w-72 border-b md:border-b-0 md:border-r border-gray-800/50 bg-gray-900/30 p-4 md:p-6 flex flex-col">
                            {/* Close Button (Mobile) */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 md:hidden w-10 h-10 rounded-xl bg-gray-800/60 hover:bg-gray-700/60 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                aria-label="Close"
                            >
                                <CloseIcon className="w-5 h-5" />
                            </button>

                            {/* User Info */}
                            <div className="flex items-center gap-4 mb-8 pt-2 md:pt-0">
                                <Avatar className="w-14 h-14 ring-2 ring-gray-700/50">
                                    <AvatarImage alt={displayName} src={avatarUrl} />
                                    <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-700 text-lg font-bold text-white">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-white truncate">{displayName}</p>
                                    <p className="text-sm text-gray-400 truncate">{user.email}</p>
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <nav className="flex-1 space-y-1.5">
                                {sidebarTabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                            ? "bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-white border border-violet-500/30"
                                            : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                                            }`}
                                    >
                                        <span className={activeTab === tab.id ? "text-violet-400" : "text-gray-500"}>
                                            {tab.icon}
                                        </span>
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400"
                                            />
                                        )}
                                    </button>
                                ))}
                            </nav>

                            {/* Sign Out Button */}
                            <div className="pt-4 mt-4 border-t border-gray-800/50">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                                >
                                    <LogOutIcon className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="relative flex-1 flex flex-col overflow-hidden">
                            {/* Close Button (Desktop) */}
                            <button
                                onClick={onClose}
                                className="hidden md:flex absolute top-6 right-6 w-10 h-10 rounded-xl bg-gray-800/60 hover:bg-gray-700/60 items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
                                aria-label="Close"
                            >
                                <CloseIcon className="w-5 h-5" />
                            </button>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full"
                                    >
                                        {renderContent()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProfileModal;
