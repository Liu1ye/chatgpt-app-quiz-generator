import { API_URL, APP_NAME } from '../../lib/constant'

export async function GET() {
  const response = await fetch(
    `${API_URL}/oauth/oidc/.well-known/oauth-authorization-server/${APP_NAME}`
  )
  return Response.json(await response.json())
}
