export async function handle({ event, resolve }) {
	if (event.url.pathname === '/v1' || event.url.pathname === '/v1/') {
		return new Response(null, {
			status: 301,
			headers: { Location: '/v1/index.html' }
		});
	}
	return resolve(event);
}
