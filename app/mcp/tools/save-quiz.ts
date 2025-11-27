import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { saveQuiz } from '@/app/api'

export async function registerSaveQuizTool(server: McpServer) {
  server.registerTool(
    'save-quiz',
    {
      title: 'Save Quiz',
      description: 'Save the Quiz to the backend database',
      inputSchema: {
        data: z
          .object({
            title: z
              .string()
              .describe("Quiz title (e.g., 'Python Programming Quiz')"),
            description: z.string().describe('Brief description of the quiz'),
            questions: z
              .array(
                z.object({
                  id: z
                    .string()
                    .describe("Unique question ID (e.g., 'q1', 'q2')"),
                  question: z
                    .string()
                    .describe(
                      'The question text. For mathematical formulas, use KaTeX syntax: $...$ for inline formulas, $$...$$ for display formulas'
                    ),
                  hint: z
                    .string()
                    .describe(
                      'Helpful hint for this question. For mathematical formulas, use KaTeX syntax: $...$ for inline formulas, $$...$$ for display formulas'
                    ),
                  options: z
                    .array(
                      z.object({
                        text: z
                          .string()
                          .describe(
                            "Option text. For mathematical formulas, use KaTeX syntax: inline formulas with $...$ (e.g., '$x^2 + y^2 = z^2$') and display formulas with $$...$$ (e.g., '$$\\frac{a}{b}$$')"
                          ),
                        isCorrect: z
                          .boolean()
                          .describe(
                            'Whether this option is the correct answer'
                          ),
                        explanation: z
                          .string()
                          .describe(
                            "Explanation for this option (why it's correct or why it's wrong). For mathematical formulas, use KaTeX syntax: $...$ for inline formulas, $$...$$ for display formulas"
                          ),
                        selected: z
                          .boolean()
                          .describe(
                            'Whether the user has selected the current option'
                          ),
                      })
                    )
                    .length(4)
                    .describe(
                      'Array of answer options (typically 4). Each question must have exactly 4 options, and only ONE option should have isCorrect: true'
                    ),
                })
              )
              .describe('Array of quiz questions'),
            error: z
              .array(z.number())
              .describe("Question index of users' wrong answers"),
          })
          .describe('User quiz related data'),
      },
      outputSchema: {},
    },
    async ({ data }, extra) => {
      console.log(data, extra, 'extra')
      const token = extra?.authInfo?.token
      if (!token) {
        return {
          content: [
            {
              type: 'text',
              text: 'save error',
            },
          ],
          structuredContent: {
            message: 'error',
          },
        }
      }
      const res = await saveQuiz(data, token)
      return {
        content: [
          {
            type: 'text',
            text: 'save success',
          },
        ],
        structuredContent: {
          message: 'success',
        },
      }
    }
  )
}
