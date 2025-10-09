import React, { useState } from 'react';
import Image from 'next/image';
import { PageItem, FormCardProps } from '@/app/dashboard/form-builder/page';
import { FormCard } from '@/app/dashboard/form-builder/page';
import { motion, AnimatePresence } from 'framer-motion';

interface RatingCardProps extends FormCardProps {}

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

const RatingCard: React.FC<RatingCardProps> = (props) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const ratingLabels = [
    "Not satisfied",
    "Could be better", 
    "Good",
    "Great",
    "Excellent!"
  ];

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    // Add slight delay before continuing for better UX
    setTimeout(() => {
      props.onNext();
    }, 400);
  };

  return (
    <FormCard {...props}>
      <div className="flex-grow flex flex-col items-center justify-center p-10 text-center overflow-hidden relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent blur-3xl"></div>
        
        <div className="relative z-10 w-full max-w-2xl mx-auto space-y-10">
          {/* Brand Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center items-center gap-3 mb-8"
          >
            <Image src="/icon.png" alt="PraiseGarden Logo" width={40} height={40} className="object-contain" />
            <span className="text-white text-3xl font-bold">PraiseGarden</span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              How would you rate your experience?
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">
              Your testimonial helps others understand the value of our product.
            </p>
          </motion.div>

          {/* Star Rating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="py-8"
          >
            <div className="flex justify-center items-center gap-3 sm:gap-4 mb-6">
              {[1, 2, 3, 4, 5].map((rating) => {
                const isHovered = hoveredStar !== null && rating <= hoveredStar;
                const isSelected = selectedRating !== null && rating <= selectedRating;
                const isFilled = isSelected || isHovered;

                return (
                  <div
                    key={rating}
                    className="relative group"
                    onMouseEnter={() => setHoveredStar(rating)}
                    onMouseLeave={() => setHoveredStar(null)}
                  >
                    <motion.button
                      onClick={() => handleStarClick(rating)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className={`relative cursor-pointer transition-all duration-300 ease-out ${
                        isFilled 
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
                            className="w-12 h-12 sm:w-14 sm:h-14 absolute inset-0 text-yellow-400 blur-sm opacity-60" 
                          />
                        </motion.div>
                      )}
                      
                      {/* Main star */}
                      <StarIcon 
                        filled={isFilled} 
                        className={`w-12 h-12 sm:w-14 sm:h-14 relative z-10 transition-all duration-300 ${
                          isFilled 
                            ? 'drop-shadow-[0_0_12px_rgba(250,204,21,0.8)] filter brightness-110' 
                            : 'group-hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]'
                        }`}
                      />
                      
                      {/* Hover pulse effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-yellow-400/20 scale-0 group-hover:scale-110 transition-transform duration-300"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </div>
                );
              })}
            </div>

            {/* Rating Label */}
            <AnimatePresence mode="wait">
              {(hoveredStar !== null || selectedRating !== null) && (
                <motion.p
                  key={hoveredStar || selectedRating}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg font-medium text-purple-400"
                >
                  {ratingLabels[(hoveredStar || selectedRating)! - 1]}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </FormCard>
  );
};

export default RatingCard;
