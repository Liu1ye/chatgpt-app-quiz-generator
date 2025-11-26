import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import MathText from '../MathText';
import { QuestionOption } from '../../types';
import { ArrowRightLgIcon, ArrowLeftLgIcon, CheckMdIcon, CloseMdIcon } from '@/app/assets/icons'

interface QuizOptionProps {
    option: QuestionOption;
    index: number;
    isSelected: boolean;
    selectedOption: number | null;
    correctAnswerIndex: number;
    onOptionClick: (index: number) => void;
}

const QuizOption = ({
    option,
    index,
    isSelected,
    selectedOption,
    correctAnswerIndex,
    onOptionClick
}: QuizOptionProps) => {
    const isCorrect = option.isCorrect;
    const showIcon = isSelected || (selectedOption !== null && selectedOption !== correctAnswerIndex && isCorrect);
    
    const getOptionBgColor = () => {
        if (selectedOption === null) {
            return 'bg-interactive-bg-secondary-default';
        }
        
        if (isSelected) {
            return isCorrect 
                ? 'bg-success-bg' 
                : 'bg-error-bg';
        }
        
        if (selectedOption !== null && !isCorrect && index === correctAnswerIndex) {
            return 'bg-success-bg';
        }
        
        return 'bg-interactive-bg-secondary-default';
    };
    
    const getOptionTextColor = () => {
        if (selectedOption === null) {
            return 'text-text-secondary';
        }
        
        if (isSelected) {
            return isCorrect ? 'text-success-secondary' : 'text-error-secondary';
        }
        
        if (selectedOption !== null && index === correctAnswerIndex) {
            return 'text-success-secondary';
        }
        
        return 'text-text-tertiary';
    };
    
    const getOptionLabelColor = () => {
        if (selectedOption === null) {
            return 'text-text-primary';
        }
        
        if (isSelected || index === correctAnswerIndex) {
            return 'text-text-primary';
        }
        
        return 'text-text-tertiary';
    };
    
    const shouldShowExplanation = () => {
        if (selectedOption === null) return false;
        if (isSelected) return true;
        if (selectedOption !== correctAnswerIndex && index === correctAnswerIndex) {
            return true;
        }
        return false;
    };
    
    const isDisabled = () => {
        if (selectedOption === null) return false;
        if (isSelected || index === correctAnswerIndex) return false;
        return true;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={!isDisabled() && selectedOption === null ? { scale: 1.01 } : {}}
            whileTap={!isDisabled() && selectedOption === null ? { scale: 0.99 } : {}}
            className={`${getOptionBgColor()} border border-interactive-border-tertiary-default border-solid box-border flex gap-[8px] items-center pl-[6px] pr-[8px] py-[6px] rounded-[16px] w-full ${
                isDisabled() 
                    ? 'cursor-not-allowed opacity-60' 
                    : selectedOption === null 
                    ? 'cursor-pointer' 
                    : ''
            }`}
            onClick={() => !isDisabled() && selectedOption === null && onOptionClick(index)}
        >
            <div className="flex-1 flex gap-[4px] items-start">
                <div className="flex gap-[8px] items-center justify-center w-[44px] h-[44px]">
                    <AnimatePresence mode="wait">
                        {showIcon ? (
                            <motion.div
                                key="icon"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                                {isCorrect ? (
                                    <CheckMdIcon size={24} />
                                ) : (
                                    <CloseMdIcon size={24} />
                                )}
                            </motion.div>
                        ) : (
                            <motion.p
                                key="label"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={`font-semibold text-[16px] leading-[26px] tracking-[-0.4px] ${getOptionLabelColor()} whitespace-pre`}
                            >
                                {String.fromCharCode(65 + index)}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
                <div className="flex-1 flex flex-col gap-[8px] items-center justify-center pl-0 pr-[8px] py-[9px]">
                    <MathText
                        text={option.text}
                        className={`font-normal text-[16px] leading-[26px] tracking-[-0.4px] ${getOptionTextColor()} w-full`}
                    />
                    <AnimatePresence>
                        {shouldShowExplanation() && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="font-normal text-[14px] leading-[20px] tracking-[-0.18px] text-text-secondary w-full overflow-hidden"
                            >
                                {option.explanation}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default QuizOption;

