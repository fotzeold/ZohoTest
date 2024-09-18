import axios from 'axios';

interface RefreshTokenResponse {
	access_token: string;
	api_domain: string;
	token_type: string;
	expires_in: number;
}

async function refreshAccessToken(
	refreshToken: string,
	clientId: string,
	clientSecret: string
): Promise<RefreshTokenResponse> {
	const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
	const params = new URLSearchParams({
		refresh_token: refreshToken,
		grant_type: 'refresh_token',
		client_id: clientId,
		client_secret: clientSecret,
	});

	try {
		const response = await axios.post<RefreshTokenResponse>(tokenUrl, params);
		return response.data;
	} catch (error) {
		console.error('Error refreshing access token:', error);
		throw error;
	}
}

export default refreshAccessToken;