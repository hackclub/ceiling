import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const CODE_RE = /^[A-Z0-9]{4}$/;

function escapeFormula(str) {
	return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export async function POST({ request }) {
	const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE } = env;
	if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE) {
		return json({ error: 'Missing env vars' }, { status: 500 });
	}

	const { ref_code } = await request.json();

	if (!ref_code || !CODE_RE.test(ref_code)) {
		return json({ count: 0 });
	}

	const res = await fetch(
		`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}?filterByFormula=${encodeURIComponent(`{referred_by}="${escapeFormula(ref_code)}"`)}&fields%5B%5D=referred_by`,
		{ headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
	);
	const data = await res.json();
	const count = data.records ? data.records.length : 0;

	return json({ count });
}