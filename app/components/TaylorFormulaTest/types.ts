export interface QuestionOption {
    text: string;
    isCorrect: boolean;
    explanation: string;
}

export interface Question {
    id: string;
    question: string;
    hint: string;
    options: QuestionOption[];
}

export interface QuizData {
    title: string;
    description: string;
    questions: Question[];
}

export interface QuizCompleteProps {
    score: number;
    totalQuestions: number;
    accuracy: number;
    elapsedTime: number;
    onRetake: () => void;
}