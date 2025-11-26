export interface QuestionOption {
    text: string;
    isCorrect: boolean;
    explanation: string;
    selected?: boolean;
}

export interface Question {
    id: string;
    question: string;
    hint: string;
    options: QuestionOption[];
}

export interface QuizData {
    id?: string
    title: string;
    description: string;
    language?: string;
    questions: Question[];
    error: number[]
    createdAt?: string
}

export interface QuizCompleteProps {
    score: number;
    totalQuestions: number;
    accuracy: number;
    elapsedTime: number;
    onRetake: () => void;
    onSave: (type: 'all' | 'incorrect') => void;
}
