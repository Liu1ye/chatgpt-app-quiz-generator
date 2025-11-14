import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRef, useEffect } from 'react';
import QuizOption from '../QuizOption';
import HintButton from '../HintButton';
import { Question } from '../types';

interface QuizQuestionProps {
    question: Question;
    currentQuestionIndex: number;
    totalQuestions: number;
    selectedOption: number | null;
    showHint: boolean;
    onOptionClick: (index: number) => void;
    onToggleHint: () => void;
    onPrevious: () => void;
    onNext: () => void;
}

const QuizQuestion = ({
    question,
    currentQuestionIndex,
    totalQuestions,
    selectedOption,
    showHint,
    onOptionClick,
    onToggleHint,
    onPrevious,
    onNext
}: QuizQuestionProps) => {
    const { t } = useTranslation();
    const correctAnswerIndex = question.options.findIndex(opt => opt.isCorrect);
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const containerRef = useRef<HTMLDivElement>(null);

    // 监听容器高度变化并通知外部容器
    // @ts-ignore
    useEffect(() => {
        if (!containerRef.current) return;

        // 创建 ResizeObserver 监听高度变化
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // 获取容器的实际高度(包含 margin)
                const height = entry.target.getBoundingClientRect().height;

                // 通知 OpenAI 更新外部容器高度
                // @ts-ignore
                if (window.openai?.notifyIntrinsicHeight) {
                    // @ts-ignore
                    window.openai.notifyIntrinsicHeight(Math.ceil(height));
                }
            }
        });

        // 开始监听
        resizeObserver.observe(containerRef.current);

        // 初始化时也通知一次高度
        const initialHeight = containerRef.current.getBoundingClientRect().height;
        // @ts-ignore
        if (window.openai?.notifyIntrinsicHeight) {
            // @ts-ignore
            window.openai.notifyIntrinsicHeight(Math.ceil(initialHeight));
        }

        // 清理函数
        return () => {
            resizeObserver.disconnect();
        };
    }, [selectedOption]);

    return (
        <motion.div
            ref={containerRef}
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-bg-primary border-[0.5px] border-border-heavy border-solid rounded-[24px] w-full max-w-[800px] mx-auto"
        >
            <div className="flex flex-col items-center overflow-clip rounded-[inherit]">
                {/* 标题 */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="box-border flex flex-col gap-[10px] items-start p-[16px] w-full"
                >
                    <p className="font-normal text-[16px] leading-[26px] tracking-[-0.4px] text-text-tertiary w-full">
                        {currentQuestionIndex + 1} / {totalQuestions}
                    </p>
                    <p className="font-medium text-[16px] leading-[26px] tracking-[-0.4px] text-text-primary w-full">
                        {question.question}
                    </p>
                </motion.div>

                {/* 选项列表 */}
                <div className="box-border flex flex-col gap-[10px] items-start px-[16px] py-[8px] w-full">
                    {question.options.map((option, index) => (
                        <QuizOption
                            key={index}
                            option={option}
                            index={index}
                            isSelected={selectedOption === index}
                            selectedOption={selectedOption}
                            correctAnswerIndex={correctAnswerIndex}
                            onOptionClick={onOptionClick}
                        />
                    ))}
                </div>

                {/* Card footer */}
                <div className="box-border flex gap-[8px] items-center p-[16px] w-full border-t border-border-light">
                    <div className="flex-1 flex gap-[8px] items-start">
                        <HintButton
                            hint={question.hint}
                            showHint={showHint}
                            onToggleHint={onToggleHint}
                        />
                    </div>
                    <div className="flex gap-[8px] items-center">
                        <motion.button
                            whileHover={currentQuestionIndex > 0 ? { scale: 1.05 } : {}}
                            whileTap={currentQuestionIndex > 0 ? { scale: 0.95 } : {}}
                            className={`bg-interactive-bg-secondary-default border border-interactive-border-secondary-default border-solid box-border flex gap-[4px] items-center justify-center px-[16px] py-[8px] rounded-[999px] transition-colors ${
                                currentQuestionIndex === 0 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : ''
                            }`}
                            onClick={onPrevious}
                            disabled={currentQuestionIndex === 0}
                        >
                            <p className="font-medium text-[14px] leading-[20px] tracking-[-0.18px] text-interactive-label-secondary-default whitespace-pre">
                                {t('quiz.previous')}
                            </p>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={selectedOption !== null ? { scale: [1, 1.02, 1] } : {}}
                            transition={{ duration: 0.3 }}
                            className={`box-border flex gap-[4px] items-center justify-center px-[16px] py-[8px] rounded-[999px] transition-colors ${
                                selectedOption !== null
                                    ? 'bg-interactive-bg-primary-default'
                                    : 'bg-interactive-bg-secondary-default border border-interactive-border-secondary-default'
                            }`}
                            onClick={onNext}
                        >
                            <p className={`font-medium text-[14px] leading-[20px] tracking-[-0.18px] whitespace-pre ${
                                selectedOption !== null
                                    ? 'text-interactive-label-primary-default'
                                    : 'text-interactive-label-secondary-default'
                            }`}>
                                {isLastQuestion ? t('quiz.complete') : t('quiz.next')}
                            </p>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default QuizQuestion;

