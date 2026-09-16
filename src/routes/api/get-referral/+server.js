import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeFormula(str) {
	return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function generateCode() {
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
	let code = '';
	const rand = crypto.getRandomValues(new Uint8Array(4));
	for (let i = 0; i < 4; i++) code += chars[rand[i] % chars.length];
	return code;
}

export async function POST({ request }) {
	const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE } = env;
	if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE) {
		return json({ error: 'Missing env vars' }, { status: 500 });
	}

	const { email } = await request.json();
	const normalizedEmail = (email || '').toLowerCase().trim();

	if (!EMAIL_RE.test(normalizedEmail)) {
		return json({ error: 'Invalid email' }, { status: 400 });
	}

	const base = `${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}`;

	const searchRes = await fetch(
		`https://api.airtable.com/v0/${base}?filterByFormula=${encodeURIComponent(`{email}="${escapeFormula(normalizedEmail)}"`)}`,
		{ headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
	);
	const searchData = await searchRes.json();

	if (searchData.records && searchData.records.length > 0) {
		const record = searchData.records[0];
		if (record.fields.ref_code) {
			return json({ ref_code: record.fields.ref_code });
		}

		const code = generateCode();
		await fetch(`https://api.airtable.com/v0/${base}/${record.id}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${AIRTABLE_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ fields: { ref_code: code } })
		});

		return json({ ref_code: code });
	}

	const code = generateCode();
	const createRes = await fetch(`https://api.airtable.com/v0/${base}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${AIRTABLE_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ fields: { email: normalizedEmail, ref_code: code } })
	});

	return json({ ref_code: code }, { status: createRes.ok ? 200 : createRes.status });
}