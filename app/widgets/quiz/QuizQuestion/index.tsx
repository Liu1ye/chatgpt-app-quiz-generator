import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import QuizOption from '../QuizOption'
import HintButton from '../HintButton'
import MathText from '../MathText'
import { Question } from '../../types'
import GPTButton from '@/app/components/GptButton'
import { ArrowLeftLgIcon } from '@/app/assets/icons'

interface QuizQuestionProps {
  question: Question
  currentQuestionIndex: number
  totalQuestions: number
  selectedOption: number | null
  showHint: boolean
  isFromList?: boolean
  onClickBackToList?: () => void
  onOptionClick: (index: number) => void
  onToggleHint: () => void
  onPrevious: () => void
  onNext: () => void
}

const QuizQuestion = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedOption,
  showHint,
  isFromList,
  onClickBackToList,
  onOptionClick,
  onToggleHint,
  onPrevious,
  onNext,
}: QuizQuestionProps) => {
  const { t } = useTranslation()
  const correctAnswerIndex = question.options.findIndex((opt) => opt.isCorrect)
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1
  const containerRef = useRef<HTMLDivElement>(null)

  // 隐藏滚动条
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 创建全局样式（只创建一次）
    const styleId = 'quiz-hide-scrollbar-style'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
                html, body, .quiz-question-container, .quiz-question-container * {
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                }
                html::-webkit-scrollbar, body::-webkit-scrollbar,
                .quiz-question-container::-webkit-scrollbar,
                .quiz-question-container *::-webkit-scrollbar {
                    display: none !important;
                    width: 0 !important;
                    height: 0 !important;
                }
            `
      document.head.appendChild(style)
    }

    // 隐藏滚动条的函数
    const hideScrollbars = () => {
      ;[container, document.body, document.documentElement].forEach((el) => {
        if (el) {
          el.style.scrollbarWidth = 'none'
          el.style.setProperty('-ms-overflow-style', 'none', 'important')
        }
      })
    }

    hideScrollbars()

    // 定期检查并隐藏滚动条
    const intervalId = setInterval(hideScrollbars, 50)

    return () => clearInterval(intervalId)
  }, [currentQuestionIndex, showHint, selectedOption])

  return (
    <motion.div
      ref={containerRef}
      key={currentQuestionIndex}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="quiz-question-container bg-bg-primary border-[0.5px] border-border-heavy border-solid rounded-[24px] w-full max-w-[800px] mx-auto"
    >
      <div className="quiz-question-inner flex flex-col items-center overflow-clip rounded-[inherit]">
        {isFromList && (
          <div
            onClick={onClickBackToList && onClickBackToList}
            className="w-full pt-[18px] text-text-secondary cursor-pointer"
          >
            <GPTButton variant="text" icon={<ArrowLeftLgIcon size={12} />}>
              {t('quiz.back')}
            </GPTButton>
          </div>
        )}
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
          <MathText
            text={question.question}
            className="font-medium text-[16px] leading-[26px] tracking-[-0.4px] text-text-primary w-full"
          />
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
            <GPTButton
              onClick={onPrevious}
              disabled={currentQuestionIndex === 0}
              variant="secondary"
            >
              {t('quiz.previous')}
            </GPTButton>
            <GPTButton onClick={onNext} disabled={isLastQuestion && isFromList}>
              {isLastQuestion ? t('quiz.complete') : t('quiz.next')}
            </GPTButton>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default QuizQuestion
