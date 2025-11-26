import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronUpMdIcon, LightbulbGlowIcon } from '@/app/assets/icons';

interface HintButtonProps {
    hint: string;
    showHint: boolean;
    onToggleHint: () => void;
}

const HintButton = ({ hint, showHint, onToggleHint }: HintButtonProps) => {
    const { t } = useTranslation();
    const hintButtonRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showHint && hintButtonRef.current && !hintButtonRef.current.contains(event.target as Node)) {
                onToggleHint();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showHint, onToggleHint]);

    return (
        <div ref={hintButtonRef} className="flex flex-col gap-[4px] items-start relative">
            <AnimatePresence>
                {showHint && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute bottom-full left-0 mb-[8px] bg-bg-primary border border-border-heavy rounded-[12px] p-[12px] shadow-lg min-w-[300px] max-w-[500px] z-10"
                    >
                        <div className='flex items-center gap-x-[8px]'>
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <LightbulbGlowIcon size={16} />
                            </motion.div>
                            <span className='text-[14px] font-[600] text-text-primary'>{t('quiz.hint')}</span>
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="font-normal text-[14px] leading-[20px] tracking-[-0.18px] text-text-secondary"
                        >
                            {hint}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`box-border flex gap-[4px] items-center px-[10px] py-[8px] rounded-[8px] transition-colors ${
                    showHint 
                        ? 'bg-interactive-bg-tertiary-press' 
                        : 'bg-interactive-bg-secondary-default'
                }`}
                onClick={onToggleHint}
            >
                <p className="font-medium text-[14px] leading-[20px] tracking-[-0.18px] text-text-secondary whitespace-pre">
                    {showHint ? t('quiz.hideHint') : t('quiz.showHint')}
                </p>
                <motion.div
                    animate={{ rotate: showHint ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-[16px] h-[16px] flex items-center justify-center"
                >
                   <ChevronUpMdIcon size={16} />
                </motion.div>
            </motion.button>
        </div>
    );
};

export default HintButton;

