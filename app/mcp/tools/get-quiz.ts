import createAuthRequired from '@/app/lib/createAuthRequired'
import { baseURL } from '@/app/baseUrl'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { ContentWidget, widgetMeta } from './types'

export async function registerGetQuizTool(server: McpServer, html: string) {
  const quizListWidget: ContentWidget = {
    id: 'quiz-list',
    title: 'Quiz List',
    templateUri: 'ui://widget/quiz-list-template.html',
    invoking: '',
    invoked: '',
    html: html,
    description: "display use's quiz list",
    widgetDomain: 'https://sider.ai',
  }

  // 注册 widget 资源
  server.registerResource(
    'quiz-generator-widget',
    quizListWidget.templateUri,
    {
      title: quizListWidget.title,
      description: quizListWidget.description,
      mimeType: 'text/html+skybridge',
      _meta: {
        'openai/widgetDescription': quizListWidget.description,
        'openai/widgetPrefersBorder': true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/html+skybridge',
          text: `<html>${quizListWidget.html}</html>`,
          _meta: {
            'openai/widgetDescription': quizListWidget.description,
            'openai/widgetPrefersBorder': true,
            'openai/widgetDomain': quizListWidget.widgetDomain,
          },
        },
      ],
    })
  )

  server.registerTool(
    quizListWidget.id,
    {
      title: quizListWidget.title,
      description: `
  **When to use**:
- User asks: "Show me my saved quiz"
- User asks: "Display my quiz"
- User asks: "Load the quiz I saved"
- User asks: "Show my quiz history" 
you can call the tool`,
      inputSchema: {},
      outputSchema: {},
      annotations: { readOnlyHint: true },
      _meta: widgetMeta(quizListWidget),
    },
    async (data, extra) => {
      return {
        content: [],
        structuredContent: {
          type: 'quiz-list',
        },
      }
    }
  )
}
