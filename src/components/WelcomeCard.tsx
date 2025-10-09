
import React from 'react';
import { FormCard, FormCardProps } from '@/app/dashboard/form-builder/page';
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

interface WelcomeCardProps extends FormCardProps {
    config: WelcomeBlockConfig;
    onFieldFocus?: (blockId: string, fieldPath: string) => void;
  }

const WelcomeCard: React.FC<WelcomeCardProps> = ({ config, onFieldFocus, ...props }) => {
    const handleFieldClick = (fieldPath: string) => {
        onFieldFocus?.(config.id, fieldPath);
    };
    
    return (
        <FormCard {...props}>
            <div className="relative flex-grow flex flex-col items-center justify-center p-8 md:p-12 text-center overflow-hidden">
                {/* Background Glow Effect */}
                <div className="absolute -inset-24 bg-lime-400/10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] blur-3xl opacity-60"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-2xl"
                >
                    {/* Company Branding */}
                    <div className="flex justify-center items-center mb-6">
                        <img 
                            className="w-8 h-8 mr-2 object-contain" 
                            src={config.props.logoUrl}
                            alt="Company Logo"
                            onClick={() => handleFieldClick('props.logoUrl')}
                            data-field="props.logoUrl"
                        />
                        <span 
                            className="text-2xl font-bold text-white"
                            onClick={() => handleFieldClick('props.brandName')}
                            data-field="props.brandName"
                        >
                            {config.props.brandName}
                        </span>
                    </div>

                    {/* Main Content */}
                    <h1 
                        className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-4"
                        style={{ color: config.props.titleColor }}
                        onClick={() => handleFieldClick('props.title')}
                        data-field="props.title"
                    >
                        {config.props.title}
                    </h1>
                    <p 
                        className="text-base md:text-lg text-gray-400 max-w-xl mx-auto mb-8"
                        style={{ color: config.props.descriptionColor }}
                        onClick={() => handleFieldClick('props.description')}
                        data-field="props.description"
                    >
                        {config.props.description}
                    </p>

                    {/* CTA Button */}
                    <motion.button
                        onClick={props.onNext}
                        whileHover={{ scale: 1.05, boxShadow: `0px 0px 30px ${config.props.buttonBgColor}66` }} // 66 for 40% opacity
                        whileTap={{ scale: 0.95 }}
                        className="font-bold py-3 px-8 rounded-full text-lg transition-all duration-300"
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
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-10 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <ClockIcon className="w-5 h-5" />
                            <span>Takes less than 3 minutes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5" />
                            <span>You control what's shared</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </FormCard>
    );
};

export default WelcomeCard;


