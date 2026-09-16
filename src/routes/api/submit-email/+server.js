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

	const { email, referredBy } = await request.json();
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
		return json({ fields: { ref_code: record.fields.ref_code || null } });
	}

	const sanitizedRef = (referredBy || '').replace(/[^A-Z0-9]/gi, '').slice(0, 8);
	const fields = { email: normalizedEmail, ref_code: generateCode() };
	if (sanitizedRef) fields.referred_by = sanitizedRef;

	const res = await fetch(`https://api.airtable.com/v0/${base}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${AIRTABLE_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ fields })
	});

	const data = await res.json();

	return json(
		{ fields: { ref_code: data.fields?.ref_code || null } },
		{ status: res.ok ? 200 : res.status }
	);
}