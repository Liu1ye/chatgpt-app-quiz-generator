import { apiURL, APP_NAME } from '@/app/baseUrl'

export async function GET() {
  const response = await fetch(
    `${apiURL}/oauth/oidc/.well-known/oauth-authorization-server/${APP_NAME}`
  )
  return Response.json(await response.json())
}
