import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { QuizCompleteProps } from '../../types';
import { useState } from 'react';

const QuizComplete = ({ score, totalQuestions, accuracy, elapsedTime, onRetake, onSave }: QuizCompleteProps) => {
    const { t } = useTranslation();
    const [showSaveMenu, setShowSaveMenu] = useState(false);
    
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-bg-primary border-[0.5px] border-border-heavy border-solid rounded-[24px] w-full max-w-[800px] mx-auto"
        >
            <div className="flex flex-col items-center overflow-clip rounded-[inherit]">
                {/* 标题 */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="box-border flex flex-col gap-[10px] items-center pb-0 pt-[32px] px-[16px] w-full"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                            delay: 0.3, 
                            type: "spring", 
                            stiffness: 200, 
                            damping: 15 
                        }}
                        className="w-[48px] h-[48px] text-[48px] flex items-center justify-center"
                    >
                        <Image src='./trophy.png' alt="Trophy" width={48} height={48} />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="font-semibold text-[18px] leading-[26px] tracking-[-0.45px] text-text-primary text-center whitespace-pre"
                    >
                        {t('quiz.completeTitle')}
                    </motion.p>
                </motion.div>
                
                {/* 统计数据 */}
                <div className="box-border flex flex-col gap-[24px] items-center pb-[32px] pt-[24px] px-[16px] w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="bg-bg-tertiary box-border flex gap-[24px] items-center px-[32px] py-[24px] rounded-[24px]"
                    >
                        {/* Score */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7, duration: 0.3 }}
                            className="flex flex-col gap-[4px] items-center justify-center min-w-[90px] whitespace-pre"
                        >
                            <div className="flex gap-[4px] items-baseline">
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="font-semibold text-[24px] leading-[28px] tracking-[-0.25px] text-text-primary"
                                >
                                    {score}
                                </motion.p>
                                <p className="font-semibold text-[14px] leading-[18px] tracking-[-0.3px] text-text-tertiary">
                                    / {totalQuestions}
                                </p>
                            </div>
                            <p className="font-normal text-[14px] leading-[20px] tracking-[-0.18px] text-text-tertiary">
                                {t('quiz.score')}
                            </p>
                        </motion.div>
                        
                        {/* Divider */}
                        <div className="hidden md:block h-[40px] w-[1px] bg-border-light"></div>
                        
                        {/* Accuracy */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9, duration: 0.3 }}
                            className="flex flex-col gap-[4px] items-center justify-center min-w-[90px] whitespace-pre"
                        >
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.0 }}
                                className="font-semibold text-[24px] leading-[28px] tracking-[-0.25px] text-text-primary"
                            >
                                {accuracy}%
                            </motion.p>
                            <p className="font-normal text-[14px] leading-[20px] tracking-[-0.18px] text-text-tertiary">
                                {t('quiz.accuracy')}
                            </p>
                        </motion.div>
                        
                        {/* Divider */}
                        <div className="hidden md:block h-[40px] w-[1px] bg-border-light"></div>
                        
                        {/* Time Spent */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.1, duration: 0.3 }}
                            className="flex flex-col gap-[4px] items-center justify-center min-w-[90px] whitespace-pre"
                        >
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className="font-semibold text-[24px] leading-[28px] tracking-[-0.25px] text-text-primary"
                            >
                                {formatTime(elapsedTime)}
                            </motion.p>
                            <p className="font-normal text-[14px] leading-[20px] tracking-[-0.18px] text-text-tertiary">
                                {t('quiz.timeSpent')}
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Save Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3, duration: 0.3 }}
                        className="flex flex-col gap-[8px] items-center relative"
                    >
                        {/* Save Menu */}
                        <AnimatePresence>
                            {showSaveMenu && (
                                <SaveMenu
                                    onSelect={(type) => {
                                        setShowSaveMenu(false);
                                        onSave(type);
                                    }}
                                    onClose={() => setShowSaveMenu(false)}
                                />
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-interactive-bg-primary-default w-[160px] py-[8px] rounded-full transition-colors"
                            onClick={() => setShowSaveMenu(!showSaveMenu)}
                        >
                            <p className="font-medium text-interactive-label-primary-default text-[14px] leading-[20px] tracking-[-0.18px] whitespace-pre">
                                {t('quiz.save')}
                            </p>
                        </motion.button>
                    </motion.div>
                    
                    {/* Retake Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3, duration: 0.3 }}
                        className="flex gap-[8px] items-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-interactive-bg-secondary-default border border-interactive-border-secondary-default border-solid box-border w-[160px] py-[8px] rounded-full transition-colors"
                            onClick={onRetake}
                        >
                            <p className="font-medium text-[14px] leading-[20px] tracking-[-0.18px] text-interactive-label-secondary-default whitespace-pre">
                                {t('quiz.retake')}
                            </p>
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default QuizComplete;


interface SaveMenuProps {
    onSelect: (type: 'all' | 'incorrect') => void;
    onClose: () => void;
}

const SaveMenu = ({ onSelect, onClose }: SaveMenuProps) => {
    const options = [
        {
            key: 'all' as const,
            text: 'Save all questions'
        },
        {
            key: 'incorrect' as const,
            text: 'Save only incorrect questions'
        }
    ]

    return (
        <>
            {/* 遮罩层，点击关闭菜单 */}
            <div
                className='fixed inset-0 z-40'
                onClick={onClose}
            />

            {/* 菜单 */}
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className='absolute bottom-full mb-[8px] bg-bg-primary shadow-lg rounded-[20px] p-[6px] z-50'
            >
                {
                    options.map((item, index) => {
                        return (
                            <motion.div
                                key={item.key}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className='w-[215px] border-[1px] border-solid border-border-default p-[10px_8px_10px_10px] rounded-[6px] cursor-pointer hover:bg-bg-secondary transition-colors'
                                onClick={() => onSelect(item.key)}
                            >
                                <p className='font-medium text-[14px] leading-[20px] tracking-[-0.18px] text-text-primary'>
                                    {item.text}
                                </p>
                            </motion.div>
                        )
                    })
                }
            </motion.div>
        </>
    )
}
