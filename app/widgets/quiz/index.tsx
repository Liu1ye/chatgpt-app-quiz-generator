'use client'

import { useMemo, useState, useCallback, FC } from 'react'
import { useWidgetProps, useWidgetState } from '@/app/hooks'
import QuizQuestion from './QuizQuestion'
import QuizComplete from './QuizComplete'
import { QuizManager } from './QuizManager'
import { QuizData } from '../types'
import { Skeleton } from '@/app/components/Skeleton'
import { useToast } from '@/app/context/toastContext'
import { useTranslation } from 'react-i18next'

type QuizProps = {
  quizDataFromList?: QuizData
  isFromList?: boolean
  onClickBackToList?: () => void
}

const Quiz: FC<QuizProps> = (props) => {
  const { quizDataFromList, isFromList = false, onClickBackToList } = props

  const widgetProps = useWidgetProps<{ language?: string; data?: QuizData }>()
  const quizData = quizDataFromList || widgetProps?.data
  const { showToast } = useToast()
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [widgetState, setWidgetState] = useWidgetState({
    isSaved: false,
  })
  const { t } = useTranslation()

  const quizManager = useMemo(() => {
    if (!quizData?.questions?.length) return null
    return new QuizManager(quizData, isFromList)
  }, [quizData?.questions])

  const [showHint, setShowHint] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [_, setUpdateTrigger] = useState(0)

  const forceUpdate = useCallback(() => {
    setUpdateTrigger((prev) => prev + 1)
  }, [])

  const handleOptionClick = useCallback(
    (index: number) => {
      if (!quizManager) return
      quizManager.answerCurrentQuestion(index)
      forceUpdate()
    },
    [quizManager, forceUpdate]
  )

  const handlePrevious = useCallback(() => {
    if (!quizManager) return
    if (quizManager.goToPrevious()) {
      setShowHint(false)
      forceUpdate()
    }
  }, [quizManager, forceUpdate])

  const handleNext = useCallback(() => {
    if (!quizManager) return

    if (quizManager.goToNext()) {
      setShowHint(false)
      forceUpdate()
    } else if (quizManager.isLastQuestion()) {
      quizManager.complete()
      setIsCompleted(true)
    }
  }, [quizManager, forceUpdate])

  const handleToggleHint = useCallback(() => {
    setShowHint((prev) => !prev)
  }, [])

  const handleRetake = useCallback(() => {
    if (!quizManager) return

    quizManager.reset()
    setShowHint(false)
    setIsCompleted(false)
    forceUpdate()
  }, [quizManager, forceUpdate])

  const handleSave = async (type: 'all' | 'incorrect') => {
    if (widgetState.isSaved) {
      showToast(t('quiz.save-success'), 'success')
      return
    }
    try {
      setSaveLoading(true)
      const res = (await quizManager?.save(type)) as any
      if (res?.structuredContent?.response?.code === 0) {
        setWidgetState({ isSaved: true })
        showToast(t('quiz.save-success'), 'success')
      } else {
        showToast(t('quiz.save-fail'), 'error')
      }
    } catch {
      showToast(t('quiz.save-fail'), 'error')
    } finally {
      setSaveLoading(false)
    }
  }

  // 加载状态
  if (!quizManager) {
    return <Skeleton />
  }

  // 完成页面
  if (isCompleted && !isFromList) {
    return (
      <QuizComplete
        score={quizManager.calculateScore()}
        totalQuestions={quizManager.getTotalQuestions()}
        accuracy={quizManager.calculateAccuracy()}
        elapsedTime={quizManager.getElapsedTime()}
        onRetake={handleRetake}
        onSave={handleSave}
        loading={saveLoading}
      />
    )
  }

  // 主测验界面
  return (
    <QuizQuestion
      question={quizManager.getCurrentQuestion()}
      currentQuestionIndex={quizManager.getCurrentQuestionIndex()}
      totalQuestions={quizManager.getTotalQuestions()}
      selectedOption={quizManager.getCurrentAnswer()}
      onClickBackToList={onClickBackToList}
      showHint={showHint}
      isFromList={isFromList}
      onOptionClick={handleOptionClick}
      onToggleHint={handleToggleHint}
      onPrevious={handlePrevious}
      onNext={handleNext}
    />
  )
}

export default Quiz
