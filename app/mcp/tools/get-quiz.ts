import createAuthRequired from "@/app/lib/createAuthRequired";
import { baseURL } from "@/baseUrl";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * 注册 get-quiz tool
 * 用于获取用户已保存的测验数据，并引导 ChatGPT 使用 quiz-generator 显示
 */
export async function registerGetQuizTool(server: McpServer) {
  server.registerTool(
    "get-quiz",
    {
      title: "Get Quiz",
      description: `Retrieve saved quizzes from the backend server and display them.

**WORKFLOW**:
1. Call this tool to fetch the saved quiz data
2. After receiving the data, you MUST call 'quiz-generator' tool with the returned quiz data to display it in an interactive widget

**When to use**:
- User asks: "Show me my saved quiz"
- User asks: "Display my quiz"
- User asks: "Load the quiz I saved"
- User asks: "Show my quiz history"

**IMPORTANT**:
- The data returned by this tool is formatted to be compatible with 'quiz-generator' input
- You must pass the 'quiz' object from the response directly to 'quiz-generator' to display the widget
- Do NOT just show the raw data - always call 'quiz-generator' to provide a better user experience

Example:
1. User: "Show me my saved quiz"
2. You call: get-quiz
3. You receive: { quiz: { language: "en", data: {...} } }
4. You call: quiz-generator with language="en" and data={...}
5. Widget displays!

This tool requires user authentication.`,
      inputSchema: {
        // 不需要任何输入参数，后端会返回所有相关数据
      },
      outputSchema: {
        success: z.boolean().describe("Whether the request was successful"),
        message: z.string().describe("Status message - hint for next action"),
        quiz: z.object({
          language: z.string().describe("Language code for the quiz (e.g., 'en', 'zh-CN')"),
          data: z.object({
            topic: z.string().describe("Quiz topic"),
            numQuestions: z.number().describe("Number of questions"),
            difficulty: z.enum(["easy", "medium", "hard"]).describe("Difficulty level"),
            title: z.string().describe("Quiz title"),
            description: z.string().describe("Quiz description"),
            questions: z.array(z.any()).describe("Array of quiz questions with options"),
          }).describe("Quiz data compatible with quiz-generator input")
        }).optional().describe("Quiz data ready to be passed to quiz-generator tool"),
      },
      securitySchemes: [
        { type: "oauth2" as const, scopes: ["read:stuff"] },
      ],
      annotations: { readOnlyHint: true }
    } as any,
    async (input, extra) => {
      try {
        const token = extra?.authInfo?.token;

        // 检查认证
        if (!token) {
          return createAuthRequired();
        }

        // 调用后端 API 获取测验
        const response = await fetch(`${baseURL}/api/quiz`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-App-Name": "quiz-generator",
            "X-App-Version": "1.0.0",
            "X-Time-Zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
            "X-Trace-ID": crypto.randomUUID(),
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // 确保返回的数据格式与 quiz-generator 兼容
        // 假设后端返回: { language: "en", data: { title, description, questions, ... } }
        const quizData = {
          language: result.language || "en",
          data: result.data || result, // 兼容不同的后端响应格式
        };

        return {
          content: [
            {
              type: "text" as const,
              text: `✅ Found saved quiz: "${quizData.data.title}"\n\n📌 Now displaying it with quiz-generator...`,
            }
          ],
          structuredContent: {
            success: true,
            message: "Quiz fetched successfully. Call quiz-generator with the quiz data to display it.",
            quiz: quizData,
          },
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

        return {
          content: [
            {
              type: "text" as const,
              text: `❌ Failed to get quiz: ${errorMessage}`,
            }
          ],
          structuredContent: {
            success: false,
            message: errorMessage,
          },
          isSuccess: false,
        };
      }
    }
  );
}
