import { baseURL } from '@/baseUrl'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

export async function registerFetchTool(server: McpServer) {
  server.registerTool(
    'fetch',
    {
      title: 'App Fetch',
      description: 'Internal APP fetch tool for accessing internal APIs',
      inputSchema: {
        id: z
          .string()
          .describe(
            'Unique identifier for the authentication token, Generally starts with sk-'
          ),
        method: z
          .enum(['GET', 'POST', 'PUT', 'DELETE'])
          .optional()
          .describe('HTTP method (defaults to configured method for endpoint)'),
        payload: z
          .any()
          .optional()
          .describe('Request payload (for POST/PUT requests)'),
        queryParams: z
          .record(z.string())
          .optional()
          .describe('Query parameters for the request'),
        headers: z
          .record(z.string())
          .optional()
          .describe('Additional request headers'),
      },
      _meta: {
        'openai/readOnlyHint':
          'This tool is for internal application use only and not available in the ChatGPT interface',
        'openai/internalOnly': true,
      },
    },
    async (data, extra) => {
      try {
        console.log(extra, data, 'token')
        const { id, method, payload, queryParams, headers } = data
        const token = extra?.authInfo?.token
        const searchParams = new URLSearchParams({ ...queryParams })
        const url = new URL(id, baseURL)
        url.search = searchParams.toString()

        const requestHeaders = new Headers({
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        })

        const requestMethod = method || 'GET'

        const body = ['POST', 'PUT'].includes(requestMethod)
          ? JSON.stringify(payload)
          : undefined

        const response = await fetch(url.toString(), {
          method: requestMethod,
          headers: requestHeaders,
          body,
        })

        let responseData
        const contentType = response.headers.get('Content-Type') || ''

        if (contentType.includes('application/json')) {
          responseData = await response.json()
        } else if (contentType.includes('text/plain')) {
          responseData = await response.text()
        } else {
          responseData = await response.text()
        }

        return {
          content: [
            {
              type: 'text',
              text: `Successfully fetched data from the API ${id}`,
            },
          ],
          structuredContent: {
            response: responseData,
            timestamp: new Date().toISOString(),
          },
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching data from the API ${data.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        }
      }
    }
  )
}
