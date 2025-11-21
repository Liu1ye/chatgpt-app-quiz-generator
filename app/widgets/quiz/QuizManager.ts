import { Question, QuizData } from './types';


export class QuizManager {
    private questions: Question[];
    private answers: (number | null)[];
    private currentQuestionIndex: number;
    private startTime: number;
    private endTime: number | null;
    private info: any

    constructor(quizData: QuizData) {
        this.questions = quizData.questions;
        this.answers = new Array(quizData.questions.length).fill(null);
        this.currentQuestionIndex = 0;
        this.startTime = Date.now();
        this.endTime = null;
        this.info = quizData
    }

    // 获取当前题目
    getCurrentQuestion(): Question {
        return this.questions[this.currentQuestionIndex];
    }

    // 获取当前题目索引
    getCurrentQuestionIndex(): number {
        return this.currentQuestionIndex;
    }

    // 获取总题目数
    getTotalQuestions(): number {
        return this.questions.length;
    }

    // 获取当前题目的答案
    getCurrentAnswer(): number | null {
        return this.answers[this.currentQuestionIndex];
    }

    // 获取所有答案
    getAnswers(): (number | null)[] {
        return [...this.answers];
    }

    // 回答当前题目
    answerCurrentQuestion(optionIndex: number): void {
        this.answers[this.currentQuestionIndex] = optionIndex;
    }

    // 是否可以前往上一题
    canGoPrevious(): boolean {
        return this.currentQuestionIndex > 0;
    }

    // 是否可以前往下一题
    canGoNext(): boolean {
        return this.currentQuestionIndex < this.questions.length - 1;
    }

    // 是否是最后一题
    isLastQuestion(): boolean {
        return this.currentQuestionIndex === this.questions.length - 1;
    }

    // 前往上一题
    goToPrevious(): boolean {
        if (this.canGoPrevious()) {
            this.currentQuestionIndex--;
            return true;
        }
        return false;
    }

    // 前往下一题
    goToNext(): boolean {
        if (this.canGoNext()) {
            this.currentQuestionIndex++;
            return true;
        }
        return false;
    }

    // 前往指定题目
    goToQuestion(index: number): boolean {
        if (index >= 0 && index < this.questions.length) {
            this.currentQuestionIndex = index;
            return true;
        }
        return false;
    }

    // 完成测验
    complete(): void {
        this.endTime = Date.now();
    }

    // 是否已完成
    isCompleted(): boolean {
        return this.endTime !== null;
    }

    // 计算得分
    calculateScore(): number {
        let correct = 0;
        this.answers.forEach((answer, index) => {
            if (answer !== null && this.questions[index].options[answer].isCorrect) {
                correct++;
            }
        });
        return correct;
    }

    // 计算准确率
    calculateAccuracy(): number {
        const score = this.calculateScore();
        return Math.round((score / this.questions.length) * 100);
    }

    // 获取用时（毫秒）
    getElapsedTime(): number {
        if (this.endTime) {
            return this.endTime - this.startTime;
        }
        return Date.now() - this.startTime;
    }

    // 格式化时间
    getFormattedTime(): string {
        const ms = this.getElapsedTime();
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // 重置测验
    reset(): void {
        this.answers = new Array(this.questions.length).fill(null);
        this.currentQuestionIndex = 0;
        this.startTime = Date.now();
        this.endTime = null;
    }

    // 获取当前题目的正确答案索引
    getCorrectAnswerIndex(): number {
        return this.getCurrentQuestion().options.findIndex(opt => opt.isCorrect);
    }

    // 检查当前题目是否已回答
    isCurrentQuestionAnswered(): boolean {
        return this.answers[this.currentQuestionIndex] !== null;
    }

    // 获取已回答的题目数量
    getAnsweredQuestionsCount(): number {
        return this.answers.filter(answer => answer !== null).length;
    }

    // 获取测验进度（百分比）
    getProgress(): number {
        return Math.round((this.getAnsweredQuestionsCount() / this.questions.length) * 100);
    }

    // 保存题目
    async save(sendFollowUpMessage: (prompt:string) => Promise<void>): Promise<void> {
        const error = this.answers.map((i, j) => {
            if(i !== null){
                return this.questions[j].options[i].isCorrect ? true : false
            }
            return null
        })

        // 包装在 data 字段中，匹配后端 inputSchema 结构
        const payload = {
            data: {
                ...this.info,
                answer: this.answers,
                error,
            }
        }

        sendFollowUpMessage(`Call the quiz-saver tool and pass some data to it, data:'${JSON.stringify(payload)}'`)
    }
}
