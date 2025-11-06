import Image from 'next/image';
import { motion } from 'framer-motion';
import { QuizCompleteProps } from '../types';

const QuizComplete = ({ score, totalQuestions, accuracy, elapsedTime, onRetake }: QuizCompleteProps) => {
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
            className="bg-[#ffffff] border-[0.5px] border-[rgba(13,13,13,0.15)] border-solid rounded-[24px] w-full h-full max-w-[800px] mx-auto"
        >
            <div className="flex flex-col items-center overflow-clip rounded-[inherit] h-full">
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
                        <Image src='/trophy.png' alt="Trophy" width={48} height={48} />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="font-semibold text-[18px] leading-[26px] tracking-[-0.45px] text-[#0d0d0d] text-center whitespace-pre"
                    >
                        测验完成！
                    </motion.p>
                </motion.div>
                
                {/* 统计数据 */}
                <div className="box-border flex flex-col gap-[24px] items-center pb-[32px] pt-[24px] px-[16px] w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="bg-[#f3f3f3] box-border flex gap-[24px] items-center px-[32px] py-[24px] rounded-[24px]"
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
                                    className="font-semibold text-[24px] leading-[28px] tracking-[-0.25px] text-[#0d0d0d]"
                                >
                                    {score}
                                </motion.p>
                                <p className="font-semibold text-[14px] leading-[18px] tracking-[-0.3px] text-[#8f8f8f]">
                                    / {totalQuestions}
                                </p>
                            </div>
                            <p className="font-normal text-[14px] leading-[20px] tracking-[-0.18px] text-[#8f8f8f]">
                                得分
                            </p>
                        </motion.div>
                        
                        {/* Divider */}
                        <div className="hidden md:block h-[40px] w-[1px] bg-[rgba(13,13,13,0.1)]"></div>
                        
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
                                className="font-semibold text-[24px] leading-[28px] tracking-[-0.25px] text-[#0d0d0d]"
                            >
                                {accuracy}%
                            </motion.p>
                            <p className="font-normal text-[14px] leading-[20px] tracking-[-0.18px] text-[#8f8f8f]">
                                准确率
                            </p>
                        </motion.div>
                        
                        {/* Divider */}
                        <div className="hidden md:block h-[40px] w-[1px] bg-[rgba(13,13,13,0.1)]"></div>
                        
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
                                className="font-semibold text-[24px] leading-[28px] tracking-[-0.25px] text-[#0d0d0d]"
                            >
                                {formatTime(elapsedTime)}
                            </motion.p>
                            <p className="font-normal text-[14px] leading-[20px] tracking-[-0.18px] text-[#8f8f8f]">
                                用时
                            </p>
                        </motion.div>
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
                            className="bg-[rgba(13,13,13,0)] border border-[rgba(13,13,13,0.1)] border-solid box-border flex gap-[4px] items-center justify-center px-[16px] py-[8px] rounded-[999px] transition-colors"
                            onClick={onRetake}
                        >
                            <p className="font-medium text-[14px] leading-[20px] tracking-[-0.18px] text-[#0d0d0d] whitespace-pre">
                                重新测验
                            </p>
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default QuizComplete;

