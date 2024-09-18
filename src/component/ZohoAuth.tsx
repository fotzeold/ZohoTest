import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
	Button,
	Card,
	CardContent,
	Typography,
	CircularProgress,
	Container,
	AppBar,
	Toolbar,
	Box
} from '@mui/material';

const ZohoAuth: React.FC = () => {
	const clientId = '1000.4B5MRVJVCT0W3W94BJKP5SRJEYV9MO';
	const redirectUri = 'https://zohotest.vercel.app/callback'; // Змініть на ваш URL
	const scope = 'ZohoMail.accounts.READ,ZohoMail.folders.READ,ZohoMail.messages.READ';

	const authUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=${scope}&client_id=${clientId}&response_type=code&access_type=offline&redirect_uri=${encodeURIComponent(redirectUri)}`;

	return (
		<Box sx={{ mt: 4 }}>
			<Typography variant="h4" gutterBottom>
				Авторизація Zoho Mail
			</Typography>
			<Button variant="contained" color="primary" onClick={() => window.location.href = authUrl}>
				Авторизуватися в Zoho
			</Button>
		</Box>
	);
};

const EmailList: React.FC<{ accessToken: string }> = ({ accessToken }) => {
	const [emails, setEmails] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchEmails();
	}, []);

	const fetchEmails = async () => {
		try {
			const response = await axios.get('https://mail.zoho.com/api/accounts', {
				headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
			});
			setEmails(response.data.data);
			setLoading(false);
		} catch (err) {
			setError('Помилка при завантаженні листів');
			setLoading(false);
		}
	};

	if (loading) return <CircularProgress />;
	if (error) return <Typography color="error">{error}</Typography>;

	return (
		<Box sx={{ mt: 4 }}>
			<Typography variant="h4" gutterBottom>
				Ваші листи
			</Typography>
			{emails.map((email) => (
				<Card key={email.accountId} sx={{ mb: 2 }}>
					<CardContent>
						<Typography variant="h6">{email.displayName}</Typography>
						<Typography variant="body2" color="text.secondary">
							{email.emailAddress}
						</Typography>
					</CardContent>
				</Card>
			))}
		</Box>
	);
};

const App: React.FC = () => {
	const [accessToken, setAccessToken] = useState<string | null>(null);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const code = params.get('code');
		if (code) {
			exchangeCodeForTokens(code);
		}
	}, []);

	const exchangeCodeForTokens = async (code: string) => {
		const clientId = '1000.4B5MRVJVCT0W3W94BJKP5SRJEYV9MO';
		const clientSecret = '80925ac3ac075fbe4e094e10c7971e3883e643af5f';
		const redirectUri = 'https://zohotest.vercel.app/callback'; // Змініть на ваш URL

		try {
			const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
				params: {
					code,
					grant_type: 'authorization_code',
					client_id: clientId,
					client_secret: clientSecret,
					redirect_uri: redirectUri,
				}
			});
			setAccessToken(response.data.access_token);
		} catch (error) {
			console.error('Error exchanging code for tokens:', error);
		}
	};

	return (
		<>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6">
						Zoho Mail App
					</Typography>
				</Toolbar>
			</AppBar>
			<Container>
				{!accessToken ? (
					<ZohoAuth />
				) : (
					<EmailList accessToken={accessToken} />
				)}
			</Container>
		</>
	);
};

export default App;