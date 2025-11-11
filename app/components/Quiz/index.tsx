'use client';

import { useMemo, useState, useCallback } from 'react';
import { useWidgetProps } from '@/app/hooks';
import QuizQuestion from './QuizQuestion';
import QuizComplete from './QuizComplete';
import { QuizManager } from './QuizManager';
import { QuizData } from './types';
import { Skeleton } from './Skeleton';

const TaylorFormulaTest = () => {
  const widgetProps = useWidgetProps<{ language?: string; data?: QuizData }>();
  const quizData = widgetProps?.data;

  const quizManager = useMemo(() => {
    if (!quizData?.questions?.length) return null;
    return new QuizManager(quizData.questions);
  }, [quizData?.questions]);

  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [_, setUpdateTrigger] = useState(0);

  const forceUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  const handleOptionClick = useCallback((index: number) => {
    if (!quizManager) return;
    quizManager.answerCurrentQuestion(index);
    forceUpdate();
  }, [quizManager, forceUpdate]);

  const handlePrevious = useCallback(() => {
    if (!quizManager) return;
    if (quizManager.goToPrevious()) {
      setShowHint(false);
      forceUpdate();
    }
  }, [quizManager, forceUpdate]);

  const handleNext = useCallback(() => {
    if (!quizManager) return;
    
    if (quizManager.goToNext()) {
      setShowHint(false);
      forceUpdate();
    } else if (quizManager.isLastQuestion()) {
      quizManager.complete();
      setIsCompleted(true);
    }
  }, [quizManager, forceUpdate]);

  const handleToggleHint = useCallback(() => {
    setShowHint(prev => !prev);
  }, []);

  const handleRetake = useCallback(() => {
    if (!quizManager) return;
    
    quizManager.reset();
    setShowHint(false);
    setIsCompleted(false);
    forceUpdate();
  }, [quizManager, forceUpdate]);

  // 加载状态
  if (!quizManager) {
    return (
      <Skeleton />
    );
  }

  // 完成页面
  if (isCompleted) {
    return (
      <QuizComplete
        score={quizManager.calculateScore()}
        totalQuestions={quizManager.getTotalQuestions()}
        accuracy={quizManager.calculateAccuracy()}
        elapsedTime={quizManager.getElapsedTime()}
        onRetake={handleRetake}
      />
    );
  }

  // 主测验界面
  return (
    <QuizQuestion
      question={quizManager.getCurrentQuestion()}
      currentQuestionIndex={quizManager.getCurrentQuestionIndex()}
      totalQuestions={quizManager.getTotalQuestions()}
      selectedOption={quizManager.getCurrentAnswer()}
      showHint={showHint}
      onOptionClick={handleOptionClick}
      onToggleHint={handleToggleHint}
      onPrevious={handlePrevious}
      onNext={handleNext}
    />
  );
};

export default TaylorFormulaTest;