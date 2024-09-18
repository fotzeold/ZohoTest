import axios from 'axios';

interface TokenResponse {
	access_token: string;
	refresh_token: string;
	api_domain: string;
	token_type: string;
	expires_in: number;
}

async function exchangeCodeForTokens(
	code: string,
	clientId: string,
	clientSecret: string,
	redirectUri: string
): Promise<TokenResponse> {
	const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
	const params = new URLSearchParams({
		code,
		grant_type: 'authorization_code',
		client_id: clientId,
		client_secret: clientSecret,
		redirect_uri: redirectUri,
	});

	try {
		const response = await axios.post<TokenResponse>(tokenUrl, params);
		return response.data;
	} catch (error) {
		console.error('Error exchanging code for tokens:', error);
		throw error;
	}
}

export default exchangeCodeForTokens;