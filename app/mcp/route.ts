import { baseURL } from "@/baseUrl";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const getAppsSdkCompatibleHtml = async (baseUrl: string, path: string) => {
  const result = await fetch(`${baseUrl}${path}`);
  return await result.text();
};

type ContentWidget = {
  id: string;
  title: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  html: string;
  description: string;
  widgetDomain: string;
};

function widgetMeta(widget: ContentWidget) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": false,
    "openai/resultCanProduceWidget": true,
  } as const;
}

const handler = createMcpHandler(async (server) => {
  const html = await getAppsSdkCompatibleHtml(baseURL, "/");

  const quizGeneratorWidget: ContentWidget = {
    id: "quiz-generator",
    title: "Quiz Generator",
    templateUri: "ui://widget/quiz-generator-template.html",
    invoking: "Loading quiz...",
    invoked: "Quiz loaded",
    html: html,
    description: "Generates a quiz based on the user's input",
    widgetDomain: "https://nextjs.org/docs",
  };
  server.registerResource(
    "quiz-generator-widget",
    quizGeneratorWidget.templateUri,
    {
      title: quizGeneratorWidget.title,
      description: quizGeneratorWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": quizGeneratorWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${quizGeneratorWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": quizGeneratorWidget.description,
            "openai/widgetPrefersBorder": true,
            "openai/widgetDomain": quizGeneratorWidget.widgetDomain,
          },
        },
      ],
    })
  );

  server.registerTool(
    quizGeneratorWidget.id,
    {
      title: quizGeneratorWidget.title,
      description: `Generate a quiz with multiple-choice questions on a given topic. You (ChatGPT) should generate the quiz content including questions, hints, options with explanations for each option, then pass the complete data to this tool for display.`,
      inputSchema: {
        topic: z.string().describe("The topic for the quiz (e.g., 'Taylor Series', '泰勒公式')"),
        numQuestions: z.number().int().min(1).max(10).default(5).describe("Number of questions to generate"),
        difficulty: z.enum(["easy", "medium", "hard"]).default("medium").describe("Difficulty level"),
        language: z.string().default("en").describe("Language code for the quiz content. Supported languages: en (English), zh-CN (Chinese Simplified), zh-TW (Chinese Traditional), ja (Japanese), ko (Korean), fr (French), de (German), es (Spanish), ru (Russian), ar (Arabic), hi (Hindi), pt (Portuguese), it (Italian), nl (Dutch), pl (Polish), tr (Turkish), vi (Vietnamese), th (Thai), id (Indonesian), cs (Czech), sk (Slovak), hu (Hungarian), ro (Romanian), sv (Swedish), da (Danish), fi (Finnish), no/nb (Norwegian), uk (Ukrainian), bg (Bulgarian), hr (Croatian), sr (Serbian), sl (Slovenian), et (Estonian), lv (Latvian), lt (Lithuanian), he (Hebrew), fa (Persian), ur (Urdu), bn (Bengali), ta (Tamil), te (Telugu), ml (Malayalam), kn (Kannada), gu (Gujarati), mr (Marathi), sw (Swahili), am (Amharic), fil (Filipino), ca (Catalan), el (Greek), ms (Malay). Default: en"),
        title: z.string().describe("Quiz title (e.g., 'Python Programming Quiz', '泰勒公式测验')"),
        description: z.string().describe("Brief description of the quiz"),
        questions: z.array(
          z.object({
            id: z.string().describe("Unique question ID (e.g., 'q1', 'q2')"),
            question: z.string().describe("The question text"),
            hint: z.string().describe("Helpful hint for this question"),
            options: z.array(
              z.object({
                text: z.string().describe("Option text"),
                isCorrect: z.boolean().describe("Whether this option is the correct answer"),
                explanation: z.string().describe("Explanation for this option (why it's correct or why it's wrong)"),
              })
            ).describe("Array of answer options (typically 4). Each question must have exactly 4 options, and only ONE option should have isCorrect: true"),
          })
        ).describe("Array of quiz questions"),
      },
      _meta: widgetMeta(quizGeneratorWidget),
    },
    async (args) => {
      // 如果 args 是字符串，尝试解析它
      let parsedArgs = args;
      if (typeof args === 'string') {
        try {
          parsedArgs = JSON.parse(args);
        } catch (e) {
          console.error('Failed to parse args:', e);
          throw new Error('Invalid JSON in args');
        }
      }
      
      const { topic, numQuestions, difficulty, language, title, description, questions } = parsedArgs;
      
      // 根据语言生成响应消息
      const getResponseMessage = (lang: string, topic: string, num: number, diff: string) => {
        // 中文变体
        if (lang === 'zh-CN' || lang === 'zh' || lang === 'zh_CN') {
          const diffText = diff === 'easy' ? '简单' : diff === 'medium' ? '中等' : '困难';
          return `已生成 ${num} 道关于「${topic}」的${diffText}难度题目`;
        }
        if (lang === 'zh-TW' || lang === 'zh_TW') {
          const diffText = diff === 'easy' ? '簡單' : diff === 'medium' ? '中等' : '困難';
          return `已生成 ${num} 道關於「${topic}」的${diffText}難度題目`;
        }
        
        // 其他语言使用英文
        return `Generated ${num} ${diff} questions about "${topic}"`;
      };

      // 验证数据
      if (!questions || questions.length === 0) {
        throw new Error("No questions provided");
      }

      // 验证每个问题至少有一个正确答案
      for (const question of questions) {
        const hasCorrectAnswer = question.options?.some((opt: any) => opt.isCorrect);
        if (!hasCorrectAnswer) {
          console.warn(`[WARN] Question "${question.id}" has no correct answer marked`);
        }
      }

      // ChatGPT 已经生成了完整的数据，直接返回
      return {
        content: [
          {
            type: "text",
            text: getResponseMessage(language, topic, numQuestions, difficulty),
          },
        ],
        structuredContent: {
          title,
          description,
          questions,
          timestamp: new Date().toISOString(),
        },
        _meta: widgetMeta(quizGeneratorWidget),
      };
    }
  );
});

export const GET = handler;
export const POST = handler;
