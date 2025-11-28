import { apiURL } from '../baseUrl'

export const appName = 'ChitChat_Web'
export const appVersion = '1.0.0'
export const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone
export const timeZone = timeZoneName

export type SiderUserInfo = {
  email: string
  email_verified: boolean
  name: string
  nickname: string
  picture: string
  preferred_username: string
  profile: {
    register_app_name: string
    register_at: number
    register_region: string
    register_type: string
  }
  sub: string
  user_token: string
}

export async function request(pathname: string, options?: RequestInit) {
  const url = pathname.startsWith('http') ? pathname : apiURL + pathname
  console.log('request: ', url)
  return fetch(url, {
    method: options?.method || 'GET',
    headers: {
      'X-App-Name': appName,
      'X-App-Version': appVersion,
      'X-Time-Zone': timeZone,
      'X-Trace-ID': crypto.randomUUID(),
      ...options?.headers,
    },
    body: options?.body,
  })
}

export async function getUserInfo(accessToken: string): Promise<SiderUserInfo> {
  const result = await request('/oauth/internal/oidc/oauth/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return await result.json()
}
