import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js'
import { getUserInfo } from '../api'

const verifyToken = async (
  req: Request,
  bearerToken?: string
): Promise<AuthInfo | undefined> => {
  if (!bearerToken) return undefined

  const userInfo = await getUserInfo(bearerToken)

  return {
    token: userInfo.user_token,
    scopes: ['read:stuff'], // Add relevant scopes
    clientId: 'user123', // Add user/client identifier
  }
}

export default verifyToken
