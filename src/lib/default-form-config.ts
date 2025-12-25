import {
    FormConfig,
    FormBlockType,
    WelcomeBlockConfig,
    RatingBlockConfig,
    QuestionBlockConfig,
    NegativeFeedbackBlockConfig,
    PrivateFeedbackBlockConfig,
    ConsentBlockConfig,
    AboutYouBlockConfig,
    AboutCompanyBlockConfig,
    ReadyToSendBlockConfig,
    ThankYouBlockConfig,
} from '@/types/form-config';
import { UUID, randomUUID } from 'crypto';

type DefaultConfigOptions = {
    projectId: UUID;
    formId?: UUID;
    name?: string;
};

export const DEFAULT_TESTIMONIAL_TIPS = [
    'Share specific results',
    'Mention your timeline',
    'Highlight a favorite feature',
];

export const createDefaultFormConfig = ({
    projectId,
    formId = randomUUID(),
    name = 'My First Form',
}: DefaultConfigOptions): FormConfig => {
    return {
        id: formId,
        name,
        projectId,
        createdAt: new Date().toISOString(),
        theme: {
            backgroundColor: '#0A0A0A',
            logoUrl: '/logo.svg',
            primaryColor: '#A855F7',
            secondaryColor: '#22C55E',
            headingFont: 'Space Grotesk',
            bodyFont: 'Inter',
        },
        blocks: [
            {
                id: 'welcome_1',
                type: FormBlockType.Welcome,
                enabled: true,
                props: {
                    title: 'Leave us a Testimonial',
                    description: 'Testimonials help us getting discovered by others. We appreciate every single one and read them all!',
                    buttonText: 'Continue',
                    timingMessage: 'Takes less than 3 minutes',
                    consentMessage: "You control what's shared",
                    titleColor: '#FFFFFF',
                    descriptionColor: '#9CA3AF',
                    buttonBgColor: '#89fe65',
                    buttonTextColor: '#000000',
                },
            },
            {
                id: 'rating_1',
                type: FormBlockType.Rating,
                enabled: true,
                props: {
                    title: 'How was your experience with Trustimonials?',
                    description: 'Your feedback helps us improve',
                    titleColor: '#FFFFFF',
                    descriptionColor: '#9CA3AF',
                    buttonText: 'Continue',
                },
            },
            {
                id: 'question_1',
                type: FormBlockType.Question,
                enabled: true,
                props: {
                    question: 'What do you like the most about Trustimonials?',
                    description: 'Be specific and honest. Your feedback will help us improve our product.',
                    questionColor: '#FFFFFF',
                    descriptionColor: '#9CA3AF',
                    enableTextTestimonial: true,
                    enableVideoTestimonial: true,
                    videoOptionTitle: 'Record a video',
                    videoOptionDescription: '2-minute video testimonial',
                    textOptionTitle: 'Write your story',
                    textOptionDescription: 'Text testimonial',
                    tips: [
                        'Share specific results',
                        'Mention your timeline',
                        'Highlight a favorite feature',
                    ],
                },
            },
            {
                id: 'negative_feedback_1',
                type: FormBlockType.NegativeFeedback,
                enabled: false,
                props: {
                    title: 'What can we do better?',
                    description: 'We are sorry to hear that you had a bad experience. Please let us know what we can do to improve.',
                    buttonText: 'Submit Feedback',
                    feedbackQuestion: 'Your feedback',
                    feedbackPlaceholder: 'Please share as much detail as possible...',
                    feedbackHelperText: 'We value your feedback and review every submission carefully.',
                    titleColor: '#FFFFFF',
                    descriptionColor: '#9CA3AF',
                    tips: [
                        'Be specific about the issue you faced',
                        'Describe what you expected to happen',
                        'Let us know how we can improve',
                    ],
                },
            },
            {
                id: 'private_feedback_1',
                type: FormBlockType.PrivateFeedback,
                enabled: false,
                props: {
                    title: 'Share private feedback',
                    description: 'Your feedback helps us improve. This stays private and will not be published.',
                    placeholder: 'Type your message...',
                    buttonText: 'Send Private Feedback',
                    titleColor: '#FFFFFF',
                },
            },
            {
                id: 'consent_1',
                type: FormBlockType.Consent,
                enabled: true,
                props: {
                    title: 'How can we share your testimonial?',
                    description: 'Your feedback means the world to us. Please select how you\'d like us to use your testimonial.',
                    publicOptionTitle: 'Share it publicly',
                    publicOptionDescription: 'Display on our website, social media, and marketing materials to inspire others.',
                    privateOptionTitle: 'Keep it private',
                    privateOptionDescription: 'Only for internal use to help us improve. We won\'t share it publicly.',
                    checkboxLabel: 'I consent to my testimonial being used publicly.',
                    buttonText: 'Continue',
                    trustNote: 'Your privacy is important to us. We\'ll always respect your choice.',
                    titleColor: '#FFFFFF',
                    descriptionColor: '#9CA3AF',
                },
            },
            {
                id: 'about_you_1',
                type: FormBlockType.AboutYou,
                enabled: true,
                props: {
                    title: 'Tell us a bit about yourself',
                    description: 'Share a little more about yourself.',
                    buttonText: 'Continue',
                    titleColor: '#FFFFFF',
                    fields: {
                        name: { enabled: true, required: true, label: 'Full Name', placeholder: 'John Doe' },
                        email: { enabled: true, required: true, label: 'Email', placeholder: 'john@example.com' },
                        company: { enabled: false, required: false, label: 'Company', placeholder: 'Example.com' },
                        avatar: { enabled: true, required: false, label: 'Upload your photo' },
                    },
                },
            },
            {
                id: 'about_company_1',
                type: FormBlockType.AboutCompany,
                enabled: true,
                props: {
                    title: 'Tell us about your company',
                    description: 'Help us understand your business better.',
                    buttonText: 'Continue',
                    titleColor: '#FFFFFF',
                    fields: {
                        companyName: { enabled: true, required: true, label: 'Company Name', placeholder: 'Acme Inc.' },
                        jobTitle: { enabled: true, required: true, label: 'Your Title', placeholder: 'CEO, Founder, Manager...' },
                        companyWebsite: { enabled: true, required: false, label: 'Company Website', placeholder: 'https://example.com' },
                        companyLogo: { enabled: true, required: false, label: 'Company Logo' },
                    },
                },
            },
            {
                id: 'ready_to_send_1',
                type: FormBlockType.ReadyToSend,
                enabled: true,
                props: {
                    title: 'Ready to send?',
                    description: 'Thank you for your valuable feedback!',
                    buttonText: 'Submit Testimonial',
                    titleColor: '#FFFFFF',
                    descriptionColor: '#9CA3AF',
                },
            },
            {
                id: 'thank_you_1',
                type: FormBlockType.ThankYou,
                enabled: true,
                props: {
                    title: 'Thank you for your testimonial!',
                    description: 'We will review it and let you know when it is published.',
                    showSocials: true,
                    showAnimations: true,
                    titleColor: '#FFFFFF',
                    descriptionColor: '#9CA3AF',
                },
            },
        ] as FormConfig['blocks'],
    };
};
