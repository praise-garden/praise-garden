
import React from 'react';
import { FormCard, FormCardProps } from '@/app/form-builder/page';
import { motion } from 'framer-motion';
import { WelcomeBlockConfig } from '@/types/form-config';

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

interface WelcomeCardProps extends Omit<FormCardProps, 'config' | 'onFieldFocus'> {
    config: WelcomeBlockConfig;
    onFieldFocus?: (blockId: string, fieldPath: string) => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ config, onFieldFocus, ...props }) => {
    const handleFieldClick = (fieldPath: string) => {
        onFieldFocus?.(config.id, fieldPath);
    };

    return (
        <FormCard {...props}>
            <div className="relative flex-grow flex flex-col items-center justify-center px-16 py-12 text-center overflow-hidden">
                {/* Background Glow Effect */}
                <div className="absolute -inset-24 bg-lime-400/10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] blur-3xl opacity-60"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-3xl space-y-8"
                >
                    {/* Company Branding */}
                    <div
                        className="flex justify-center items-center mb-2"
                        style={{ gap: `${props.theme?.logoTextSpacing ?? 12}px` }}
                    >
                        {config.props.logoUrl && (
                            <img
                                className="w-12 h-12 object-contain"
                                src={config.props.logoUrl}
                                alt="Company Logo"
                                onClick={() => handleFieldClick('props.logoUrl')}
                                data-field="props.logoUrl"
                            />
                        )}
                        {(props.theme?.showBrandName !== false && props.theme?.brandName) && (
                            <span
                                style={{
                                    color: props.theme?.brandNameColor || 'white',
                                    fontFamily: props.theme?.brandNameFont || props.theme?.headingFont,
                                    fontSize: `${props.theme?.brandNameFontSize || 24}px`,
                                    fontWeight: props.theme?.brandNameIsBold ? 700 : 400,
                                    fontStyle: props.theme?.brandNameIsItalic ? 'italic' : 'normal',
                                    textDecoration: props.theme?.brandNameIsUnderline ? 'underline' : 'none',
                                }}
                            >
                                {props.theme.brandName}
                            </span>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="space-y-4">
                        <h1
                            className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400"
                            style={{ color: config.props.titleColor }}
                            onClick={() => handleFieldClick('props.title')}
                            data-field="props.title"
                        >
                            {config.props.title}
                        </h1>
                        <p
                            className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed"
                            style={{ color: config.props.descriptionColor }}
                            onClick={() => handleFieldClick('props.description')}
                            data-field="props.description"
                        >
                            {config.props.description}
                        </p>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                        onClick={props.onNext}
                        whileHover={{ scale: 1.05, boxShadow: `0px 0px 30px ${config.props.buttonBgColor}66` }} // 66 for 40% opacity
                        whileTap={{ scale: 0.95 }}
                        className="font-semibold py-2.5 px-7 rounded-full text-base transition-all duration-300"
                        style={{
                            backgroundColor: config.props.buttonBgColor,
                            color: config.props.buttonTextColor,
                            boxShadow: `0px 0px 20px ${config.props.buttonBgColor}33` // 33 for 20% opacity
                        }}
                        onClickCapture={() => handleFieldClick('props.buttonText')}
                        data-field="props.buttonText"
                    >
                        {config.props.buttonText}
                    </motion.button>

                    {/* Feature Highlights */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5 text-xs text-gray-500">
                        <div
                            className="flex items-center gap-2"
                            onClick={() => handleFieldClick('props.timingMessage')}
                            data-field="props.timingMessage"
                        >
                            <ClockIcon className="w-4 h-4" />
                            <span>{config.props.timingMessage}</span>
                        </div>
                        <div
                            className="flex items-center gap-2"
                            onClick={() => handleFieldClick('props.consentMessage')}
                            data-field="props.consentMessage"
                        >
                            <CheckCircleIcon className="w-4 h-4" />
                            <span>{config.props.consentMessage}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </FormCard>
    );
};

export default WelcomeCard;


