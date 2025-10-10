import { UUID } from 'crypto';

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
    logoUrl?: string;
    brandName?: string;
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
    placeholder: string;
    buttonText: string;
    questionColor: string;
    descriptionColor: string;
  };
}

export interface NegativeFeedbackBlockConfig extends BaseBlockConfig {
    type: FormBlockType.NegativeFeedback;
    props: {
        title: string;
        description: string;
        buttonText: string;
        titleColor: string;
        descriptionColor: string;
    };
}

export interface PrivateFeedbackBlockConfig extends BaseBlockConfig {
    type: FormBlockType.PrivateFeedback;
    props: {
        title: string;
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
    checkboxLabel: string;
    buttonText: string;
    titleColor: string;
    descriptionColor: string;
  };
}

export interface AboutYouBlockConfig extends BaseBlockConfig {
  type: FormBlockType.AboutYou;
  props: {
    title: string;
    buttonText: string;
    titleColor: string;
    fields: {
      name: { enabled: boolean; label: string; placeholder: string };
      title: { enabled: boolean; label: string; placeholder: string };
      company: { enabled: boolean; label: string; placeholder: string };
      avatar: { enabled: boolean; label: string };
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
  | ReadyToSendBlockConfig
  | ThankYouBlockConfig;

// ---------------------------------------------------------------- //
//                     Theme and Main Config                        //
// ---------------------------------------------------------------- //

export interface FormTheme {
  backgroundColor: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
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
