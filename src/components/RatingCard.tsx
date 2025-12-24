import React, { useState } from 'react';
import { FormCardProps } from '@/app/form-builder/page';
import { FormCard } from '@/app/form-builder/page';
import { motion, AnimatePresence } from 'framer-motion';
import { RatingBlockConfig } from '@/types/form-config';
import BackButton from '@/components/ui/back-button';

interface RatingCardProps extends Omit<FormCardProps, 'config'> {
  config: RatingBlockConfig;
}

const StarIcon = ({ filled, className }: { filled: boolean; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const RatingCard: React.FC<RatingCardProps> = ({ config, onFieldFocus, theme, ...props }) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ratingLabels = [
    "Not satisfied",
    "Could be better",
    "Good",
    "Great",
    "Excellent!"
  ];

  const handleStarClick = (rating: number) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSelectedRating(rating);

    // Auto-advance with a delay so user sees their selection
    setTimeout(() => {
      props.onNext();
    }, 600);
  };

  const handleFieldClick = (fieldPath: string) => {
    onFieldFocus?.(config.id, fieldPath);
  };

  return (
    <FormCard {...props} theme={theme}>
      <div className="flex-grow flex flex-col items-center justify-center px-8 sm:px-16 py-10 text-center overflow-hidden relative">
        {/* Back Button */}
        {props.onPrevious && <BackButton onClick={props.onPrevious} />}

        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent blur-3xl"></div>

        <div className="relative z-10 w-full max-w-3xl mx-auto space-y-8">
          {/* Brand Logo */}
          {theme?.logoUrl && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center items-center"
            >
              <img
                src={theme.logoUrl}
                alt="Brand Logo"
                className="h-10 w-auto object-contain"
              />
            </motion.div>
          )}

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            <h2
              className="text-2xl sm:text-3xl font-bold text-white leading-tight"
              style={{ color: config.props.titleColor }}
              onClick={() => handleFieldClick('props.title')}
              data-field="props.title"
            >
              {config.props.title}
            </h2>
            <p
              className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto"
              style={{ color: config.props.descriptionColor }}
              onClick={() => handleFieldClick('props.description')}
              data-field="props.description"
            >
              {config.props.description}
            </p>
          </motion.div>

          {/* Star Rating - Keep stars well-sized */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="py-4 sm:py-6"
          >
            <div className="flex justify-center items-center gap-2.5 sm:gap-3 mb-6">
              {[1, 2, 3, 4, 5].map((rating) => {
                const isHovered = hoveredStar !== null && rating <= hoveredStar;
                const isSelected = selectedRating !== null && rating <= selectedRating;
                const isFilled = isSelected || isHovered;

                // Dim other stars if a selection is made
                const isDimmed = selectedRating !== null && rating > selectedRating;

                return (
                  <div
                    key={rating}
                    className="relative group"
                    onMouseEnter={() => !isSubmitting && setHoveredStar(rating)}
                    onMouseLeave={() => !isSubmitting && setHoveredStar(null)}
                  >
                    <motion.button
                      onClick={() => handleStarClick(rating)}
                      disabled={isSubmitting}
                      whileHover={!isSubmitting ? { scale: 1.1 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                      animate={isSelected ? { scale: [1, 1.2, 1] } : { opacity: isDimmed ? 0.3 : 1 }}
                      transition={{ duration: 0.3 }}
                      className={`relative cursor-pointer transition-all duration-300 ease-out ${isSubmitting ? 'cursor-default' : ''
                        } ${isFilled
                          ? 'text-yellow-400'
                          : 'text-gray-600 group-hover:text-yellow-300'
                        }`}
                      aria-label={`Rate ${rating} stars`}
                    >
                      {/* Glow effect for filled stars */}
                      {isFilled && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0"
                        >
                          <StarIcon
                            filled={true}
                            className="w-11 h-11 sm:w-12 sm:h-12 absolute inset-0 text-yellow-400 blur-sm opacity-60"
                          />
                        </motion.div>
                      )}

                      {/* Main star - Kept at good size */}
                      <StarIcon
                        filled={isFilled}
                        className={`w-11 h-11 sm:w-12 sm:h-12 relative z-10 transition-all duration-300 ${isFilled
                          ? 'drop-shadow-[0_0_12px_rgba(250,204,21,0.8)] filter brightness-110'
                          : 'group-hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]'
                          }`}
                      />

                      {/* Hover pulse effect */}
                      {!isSubmitting && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-yellow-400/20 scale-0 group-hover:scale-110 transition-transform duration-300"
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1.2 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  </div>
                );
              })}
            </div>

            {/* Rating Label and Selection Feedback */}
            <div className="h-8">
              <AnimatePresence mode="wait">
                {(hoveredStar !== null || selectedRating !== null) && (
                  <motion.p
                    key={hoveredStar || selectedRating}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`text-lg font-medium ${selectedRating ? 'text-yellow-400 font-semibold' : 'text-purple-400'}`}
                  >
                    {selectedRating ? `You selected ${ratingLabels[selectedRating - 1]}` : ratingLabels[hoveredStar! - 1]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Removed Manual Button - selection now auto-advances */}
        </div>
      </div>
    </FormCard>
  );
};

export default RatingCard;
