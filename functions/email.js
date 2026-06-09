const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

function jsonResponse(body, status) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

function missingEmailConfig(env) {
	return ['SERVICE_ID', 'TEMPLATE_ID', 'PUBLIC_KEY', 'PRIVATE_KEY'].filter((key) => !env[key]);
}

function isDebugEnabled(env) {
	return env.DEBUG_EMAILJS === 'true';
}

function sanitizeProviderDetails(details) {
	return details.replace(/[A-Za-z0-9_-]{20,}/g, '[redacted]');
}

export async function onRequestPost({ request, env }) {
	const missing = missingEmailConfig(env);
	if (missing.length > 0) {
		console.error(`Missing EmailJS configuration: ${missing.join(', ')}`);
		return jsonResponse({ message: 'Email failed to send' }, 500);
	}

	let templateParams;
	try {
		templateParams = await request.json();
	} catch (error) {
		return jsonResponse({ message: 'Invalid request body' }, 400);
	}

	const emailResponse = await fetch(EMAILJS_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			service_id: env.SERVICE_ID,
			template_id: env.TEMPLATE_ID,
			user_id: env.PUBLIC_KEY,
			accessToken: env.PRIVATE_KEY,
			template_params: templateParams
		})
	});

	if (!emailResponse.ok) {
		const details = await emailResponse.text();
		const safeDetails = sanitizeProviderDetails(details);
		console.error(`EmailJS failed with ${emailResponse.status}: ${safeDetails}`);
		
		if (isDebugEnabled(env)) {
			return jsonResponse({
				message: 'Email failed to send',
				provider: 'EmailJS',
				providerStatus: emailResponse.status,
				providerDetails: safeDetails
			}, 502);
		}
		
		return jsonResponse({ message: 'Email failed to send' }, 502);
	}

	return jsonResponse({ message: 'Email successfully sent' }, 200);
}
