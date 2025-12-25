import { UUID } from 'crypto';

export interface Form {
  id: string;
  name: string;
  project_id: string;
  created_at: string;
  settings: any;
  project?: {
    id: string;
    name: string;
  };
}

// ---------------------------------------------------------------- //
//                         Block Types Enum                         //
// ---------------------------------------------------------------- //

export enum FormBlockType {
  Welcome = 'welcome',
  Rating = 'rating',
  Question = 'question',
  NegativeFeedback = 'negative-feedback',
  PrivateFeedback = 'private-feedback',
  Consent = 'consent',
  AboutYou = 'about-you',
  AboutCompany = 'about-company',
  ReadyToSend = 'ready-to-send',
  ThankYou = 'thank-you',
}

// ---------------------------------------------------------------- //
//                       Base Block Interface                       //
// ---------------------------------------------------------------- //

export interface BaseBlockConfig {
  id: string;
  type: FormBlockType;
  enabled: boolean;
}

// ---------------------------------------------------------------- //
//                  Specific Block Configurations                   //
// ---------------------------------------------------------------- //

export interface WelcomeBlockConfig extends BaseBlockConfig {
  type: FormBlockType.Welcome;
  props: {
    title: string;
    description: string;
    buttonText: string;
    timingMessage: string;
    consentMessage: string;
    // logoUrl moved to theme level (FormTheme.logoUrl)
    titleColor: string;
    descriptionColor: string;
    buttonBgColor: string;
    buttonTextColor: string;
  };
}

export interface RatingBlockConfig extends BaseBlockConfig {
  type: FormBlockType.Rating;
  props: {
    title: string;
    description: string;
    titleColor: string;
    descriptionColor: string;
    buttonText: string;
  };
}

export interface QuestionBlockConfig extends BaseBlockConfig {
  type: FormBlockType.Question;
  props: {
    question: string;
    description: string;
    questionColor: string;
    descriptionColor: string;
    enableTextTestimonial: boolean;
    enableVideoTestimonial: boolean;
    videoOptionTitle: string;
    videoOptionDescription: string;
    textOptionTitle: string;
    textOptionDescription: string;
    tips: string[];
  };
}

export interface NegativeFeedbackBlockConfig extends BaseBlockConfig {
  type: FormBlockType.NegativeFeedback;
  props: {
    title: string;
    description: string;
    feedbackQuestion: string;
    feedbackPlaceholder: string;
    feedbackHelperText: string;
    buttonText: string;
    titleColor: string;
    descriptionColor: string;
    tips: string[];
  };
}

export interface PrivateFeedbackBlockConfig extends BaseBlockConfig {
  type: FormBlockType.PrivateFeedback;
  props: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
    titleColor: string;
  };
}

export interface ConsentBlockConfig extends BaseBlockConfig {
  type: FormBlockType.Consent;
  props: {
    title: string;
    description: string;
    // Usage permission options
    publicOptionTitle: string;
    publicOptionDescription: string;
    privateOptionTitle: string;
    privateOptionDescription: string;
    // Legacy checkbox (can be removed later)
    checkboxLabel: string;
    buttonText: string;
    trustNote: string;
    titleColor: string;
    descriptionColor: string;
  };
}

export interface AboutYouBlockConfig extends BaseBlockConfig {
  type: FormBlockType.AboutYou;
  props: {
    title: string;
    description: string;
    buttonText: string;
    titleColor: string;
    fields: {
      name: { enabled: boolean; required: boolean; label: string; placeholder: string };
      email: { enabled: boolean; required: boolean; label: string; placeholder: string };
      company: { enabled: boolean; required: boolean; label: string; placeholder: string };
      avatar: { enabled: boolean; required: boolean; label: string };
    };
  };
}

export interface AboutCompanyBlockConfig extends BaseBlockConfig {
  type: FormBlockType.AboutCompany;
  props: {
    title: string;
    description: string;
    buttonText: string;
    titleColor: string;
    fields: {
      companyName: { enabled: boolean; required: boolean; label: string; placeholder: string };
      jobTitle: { enabled: boolean; required: boolean; label: string; placeholder: string };
      companyWebsite: { enabled: boolean; required: boolean; label: string; placeholder: string };
      companyLogo: { enabled: boolean; required: boolean; label: string };
    };
  };
}

export interface ReadyToSendBlockConfig extends BaseBlockConfig {
  type: FormBlockType.ReadyToSend;
  props: {
    title: string;
    description: string;
    buttonText: string;
    titleColor: string;
    descriptionColor: string;
  };
}

export interface ThankYouBlockConfig extends BaseBlockConfig {
  type: FormBlockType.ThankYou;
  props: {
    title: string;
    description: string;
    showSocials: boolean;
    showAnimations: boolean;
    titleColor: string;
    descriptionColor: string;
  };
}

// ---------------------------------------------------------------- //
//                       Union Type for Blocks                      //
// ---------------------------------------------------------------- //

export type FormBlock =
  | WelcomeBlockConfig
  | RatingBlockConfig
  | QuestionBlockConfig
  | NegativeFeedbackBlockConfig
  | PrivateFeedbackBlockConfig
  | ConsentBlockConfig
  | AboutYouBlockConfig
  | AboutCompanyBlockConfig
  | ReadyToSendBlockConfig
  | ThankYouBlockConfig;

// ---------------------------------------------------------------- //
//                     Theme and Main Config                        //
// ---------------------------------------------------------------- //

export interface FormTheme {
  backgroundColor: string;
  logoUrl?: string;
  primaryColor: string;
  ratingColor: string; // Color for star ratings (default: yellow/amber)
  headingFont: string;
  bodyFont: string;
}

export interface FormConfig {
  id: UUID;
  name: string;
  projectId: UUID;
  createdAt: string; // ISO 8601 date string
  theme: FormTheme;
  blocks: FormBlock[];
}
