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
        language: z.string().default("en").describe("Language code (ISO 639-1, e.g., 'en', 'zh-CN', 'ja'). Default: en"),
        data: z.object({
          topic: z.string().describe("The topic for the quiz"),
          numQuestions: z.number().int().min(1).max(10).default(5).describe("Number of questions to generate"),
          difficulty: z.enum(["easy", "medium", "hard"]).default("medium").describe("Difficulty level"),
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
              ).length(4).describe("Array of answer options (typically 4). Each question must have exactly 4 options, and only ONE option should have isCorrect: true"),
            })
          ).describe("Array of quiz questions")
        }),
      },
      // The widget consumes only these fields as props via useWidgetProps
      outputSchema: {
        language: z.string(),
        data: z.object({
          title: z.string(),
          description: z.string(),
          questions: z.array(
            z
              .object({
                id: z.string(),
                question: z.string(),
                hint: z.string(),
                options: z
                  .array(
                    z.object({
                      text: z.string(),
                      isCorrect: z.boolean(),
                      explanation: z.string(),
                    })
                  )
                  .length(4, "Each question must have exactly 4 options"),
              })
              .refine(
                (q) => q.options.filter((o) => o.isCorrect).length === 1,
                {
                  message: "Each question must have exactly one correct option",
                }
              )
          ),
        }),
      },
      _meta: widgetMeta(quizGeneratorWidget),
    },
    async (args) => {
      // Return only the fields that the widget needs as structuredContent
      const { language, data } = args;
      const { title, description, questions } = data;
      return {
        content: [],
        structuredContent: {
          language,
          data: {
            title,
            description,
            questions,
          },
        },
      };
    }
  );
});

export const GET = handler;
export const POST = handler;
