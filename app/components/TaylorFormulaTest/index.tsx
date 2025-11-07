'use client';

import { useState, useMemo } from 'react';
import { useWidgetProps } from '@/app/hooks';
import QuizQuestion from './QuizQuestion';
import QuizComplete from './QuizComplete';
import { QuizManager } from './QuizManager';
import { QuizData, Question } from './types';

const TaylorFormulaTest = () => {
    // 从 ChatGPT 获取数据
    const rawData = useWidgetProps<Record<string, unknown>>();
    
    // 如果没有数据，显示加载状态
    if (!rawData) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="text-center">
                    <p className="text-gray-600">等待 ChatGPT 返回数据...</p>
                </div>
            </div>
        );
    }
    
    const quizData = rawData as unknown as QuizData;

    const quizManager = useMemo(() => new QuizManager(quizData.questions), [quizData.questions]);
    
    const [showHint, setShowHint] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [, forceUpdate] = useState({});
    
    const handleOptionClick = (index: number) => {
        quizManager.answerCurrentQuestion(index);
        forceUpdate({});
    };
    
    const handlePrevious = () => {
        if (quizManager.goToPrevious()) {
            setShowHint(false);
            forceUpdate({});
        }
    };
    
    const handleNext = () => {
        if (quizManager.goToNext()) {
            setShowHint(false);
            forceUpdate({});
        } else if (quizManager.isLastQuestion()) {
            // 最后一题，完成测验
            quizManager.complete();
            setIsCompleted(true);
        }
    };
    
    const handleToggleHint = () => {
        setShowHint(!showHint);
    };
    
    const handleRetake = () => {
        quizManager.reset();
        setShowHint(false);
        setIsCompleted(false);
        forceUpdate({});
    };

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
    )
}

export default TaylorFormulaTest;