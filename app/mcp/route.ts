import { baseURL } from "@/baseUrl";
import { createMcpHandler, withMcpAuth } from "sider-mcp-handler";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import verifyToken from "../lib/verifyToken";
import {
  registerQuizGeneratorTool,
  registerGetQuizTool,
  registerSaveQuizTool,
  registerFetchTool
} from "./tools";

/**
 * 获取 OpenAI Apps SDK 兼容的 HTML
 */
const getAppsSdkCompatibleHtml = async (baseUrl: string, path: string) => {
  const result = await fetch(`${baseUrl}${path}`);
  return await result.text();
};

/**
 * 创建 MCP handler
 * 注册所有 tools
 */
const handler = createMcpHandler(async (server: McpServer) => {
  // 获取 HTML 内容
  const html = await getAppsSdkCompatibleHtml(baseURL, "/");

  // 注册所有 tools
  await registerQuizGeneratorTool(server, html)
  await registerGetQuizTool(server, html)
  await registerFetchTool(server)
  await registerSaveQuizTool(server)
});

/**
 * 包装认证处理
 */
const authHandler = withMcpAuth(handler, verifyToken, {
  required: true, // 允许未认证访问（quiz-generator 不需要认证）
  requiredScopes: ["read:stuff"], // 必需的权限范围
  resourceMetadataPath: "/.well-known/oauth-protected-resource", // OAuth 元数据路径
});

export const GET = authHandler;
export const POST = authHandler;
