import { baseURL } from '@/app/baseUrl'

/**
 * 返回需要认证的错误响应
 * 用于触发 OAuth 流程
 */
function createAuthRequired() {
  return {
    content: [{ type: 'text' as const, text: 'yyyyy' }],
    _meta: {
      'mcp/www_authenticate': [
        `Bearer resource_metadata="${baseURL}/.well-known/oauth-protected-resource", error="insufficient_scope", error_description="请先完成认证"`,
      ],
    },
    isError: true,
  }
}

export default createAuthRequired
