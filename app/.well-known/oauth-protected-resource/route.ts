import { API_URL } from "../../lib/constant";

export async function GET() {
	return Response.json({
		authorization_servers: [
			API_URL + "/oauth/oidc/.well-known/oauth-authorization-server",
		],
	});
}