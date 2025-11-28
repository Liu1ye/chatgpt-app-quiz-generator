import { baseURL } from '@/app/baseUrl'
import { createMcpHandler, withMcpAuth } from 'sider-mcp-handler'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import verifyToken from '../lib/verifyToken'
import {
  registerQuizGeneratorTool,
  registerGetQuizTool,
  registerSaveQuizTool,
  registerFetchTool,
} from './tools'

/**
 * 获取 OpenAI Apps SDK 兼容的 HTML
 */
const getAppsSdkCompatibleHtml = async (baseUrl: string, path: string) => {
  const result = await fetch(`${baseUrl}${path}`)
  return await result.text()
}

/**
 * 创建 MCP handler
 * 注册所有 tools
 */
const handler = createMcpHandler(async (server: McpServer) => {
  // 获取 HTML 内容
  const html = await getAppsSdkCompatibleHtml(baseURL, '/')

  // 注册所有 tools
  await registerQuizGeneratorTool(server, html)
  await registerGetQuizTool(server, html)
  await registerFetchTool(server)
  await registerSaveQuizTool(server)
})

/**
 * 包装认证处理
 */
const authHandler = withMcpAuth(handler, verifyToken, {
  required: true,
  requiredScopes: ['read:stuff'],
  resourceMetadataPath: '/.well-known/oauth-protected-resource',
})

export const GET = authHandler
export const POST = authHandler
