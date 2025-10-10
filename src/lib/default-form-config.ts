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
    ReadyToSendBlockConfig,
    ThankYouBlockConfig,
} from '@/types/form-config';
import { UUID, randomUUID } from 'crypto';

type DefaultConfigOptions = {
    projectId: UUID;
    formId?: UUID;
    name?: string;
};

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
            logoUrl: '/icon.png',
            primaryColor: '#A855F7',
            secondaryColor: '#22C55E',
            headingFont: 'Inter',
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
                    brandName: 'PraiseGarden',
                    logoUrl: '/icon.png',
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
                    title: 'How was your experience with PraiseGarden?',
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
                    question: 'What do you like the most about PraiseGarden?',
                    description: 'Be specific and honest. Your feedback will help us improve our product.',
                    placeholder: 'Type your answer here...',
                    buttonText: 'Continue',
                    questionColor: '#FFFFFF',
                    descriptionColor: '#9CA3AF',
                },
            },
            {
                id: 'negative_feedback_1',
                type: FormBlockType.NegativeFeedback,
                enabled: false, 
                props: {
                    title: 'What can we do better?',
                    description: 'We are sorry to hear that you had a bad experience. Please let us know what we can do to improve.',
                    buttonText: 'Continue',
                    titleColor: '#FFFFFF',
                    descriptionColor: '#9CA3AF',
                },
            },
            {
                id: 'private_feedback_1',
                type: FormBlockType.PrivateFeedback,
                enabled: false, 
                props: {
                    title: 'Would you like to send us a private feedback instead?',
                    placeholder: 'Type your private feedback here...',
                    buttonText: 'Send Private Feedback',
                    titleColor: '#FFFFFF',
                },
            },
            {
                id: 'consent_1',
                type: FormBlockType.Consent,
                enabled: true,
                props: {
                    title: 'Can we use your testimonial on our website?',
                    description: 'We would love to share your feedback with our community. Are you okay with us using your name and testimonial on our website and social media?',
                    checkboxLabel: 'I consent to my testimonial being used publicly.',
                    buttonText: 'Continue',
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
                    buttonText: 'Continue',
                    titleColor: '#FFFFFF',
                    fields: {
                        name: { enabled: true, label: 'Full Name', placeholder: 'John Doe' },
                        title: { enabled: true, label: 'Title / Role', placeholder: 'CEO at Example.com' },
                        company: { enabled: false, label: 'Company', placeholder: 'Example.com' },
                        avatar: { enabled: true, label: 'Upload your photo' },
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
                    titleColor: '#FFFFFF',
                    descriptionColor: '#9CA3AF',
                },
            },
        ] as FormConfig['blocks'],
    };
};
