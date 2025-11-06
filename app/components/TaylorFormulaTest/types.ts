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

export interface QuizCompleteProps {
    score: number;
    totalQuestions: number;
    accuracy: number;
    elapsedTime: number;
    onRetake: () => void;
}