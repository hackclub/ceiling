<script>
	import CornerArrows from '$lib/components/CornerArrows.svelte';
	import { onMount } from 'svelte';

	let emailInput = $state('');
	let commentStatus = $state('');
	let submitDisabled = $state(false);
	let lastSubmit = 0;
	let lastGetCode = 0;

	let showReferral = $state(false);
	let referralCode = $state('');
	let referralCount = $state('');
	let referralView = $state('email');
	let referralEmail = $state('');
	let referralCopyStatus = $state('');
	let referralUrlCopied = $state(false);

	let trophyVisible = $state(false);
	let trophyAnimating = $state(false);

	let referralUrl = $derived(
		referralCode ? `${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${referralCode}` : ''
	);

	onMount(() => {
		const urlRef = new URLSearchParams(window.location.search).get('ref');
		if (urlRef) localStorage.setItem('ceiling_referred_by', urlRef);

		const savedCode = localStorage.getItem('ceiling_ref_code');
		if (savedCode) referralCode = savedCode;
	});

	async function loadReferralCount(code) {
		referralCount = 'YOU HAVE...';
		try {
			const res = await fetch('/api/referral-count', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ref_code: code })
			});
			const data = await res.json();
			const n = data.count || 0;
			referralCount = n === 0
				? 'YOU HAVE NO REFERRALS SO FAR'
				: `YOU HAVE ${n} REFERRAL${n === 1 ? '' : 'S'} SO FAR`;
		} catch {
			referralCount = 'YOU HAVE NO REFERRALS SO FAR';
		}
	}

	function openReferral(e) {
		e.preventDefault();
		if (referralCode) {
			referralView = 'link';
			loadReferralCount(referralCode);
		} else {
			referralView = 'email';
			referralCount = '';
		}
		showReferral = true;
	}

	function closeReferral() {
		showReferral = false;
	}

	async function getReferralCode() {
		if (Date.now() - lastGetCode < 3000) return;
		const email = referralEmail.trim();
		if (!email || !email.includes('@')) {
			referralCopyStatus = 'enter a valid email!';
			return;
		}
		lastGetCode = Date.now();
		referralCopyStatus = 'checking...';
		try {
			const res = await fetch('/api/get-referral', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});
			const data = await res.json();
			if (res.ok && data.ref_code) {
				localStorage.setItem('ceiling_email', email.toLowerCase().trim());
				localStorage.setItem('ceiling_ref_code', data.ref_code);
				referralCode = data.ref_code;
				referralView = 'link';
				referralCopyStatus = '';
				loadReferralCount(data.ref_code);
			} else {
				referralCopyStatus = 'error :( ask in #ceiling channel for help!';
			}
		} catch {
			referralCopyStatus = 'error :( ask in #ceiling channel for help!';
		}
	}

	function copyReferral() {
		navigator.clipboard.writeText(referralUrl).then(() => {
			referralUrlCopied = true;
			setTimeout(() => { referralUrlCopied = false; }, 1500);
		});
	}

	function showTrophy() {
		trophyVisible = true;
		document.documentElement.classList.add('trophy-lock');
		requestAnimationFrame(() => {
			trophyAnimating = true;
		});
	}

	function onTrophyEnd() {
		trophyVisible = false;
		trophyAnimating = false;
		document.documentElement.classList.remove('trophy-lock');
		if (localStorage.getItem('ceiling_ref_code')) {
			referralCode = localStorage.getItem('ceiling_ref_code');
			referralView = 'link';
			loadReferralCount(referralCode);
			showReferral = true;
		}
	}

	function onOverlayEnd() {
		// overlay animation done
	}

	async function submitComment() {
		if (Date.now() - lastSubmit < 3000) return;
		const email = emailInput.trim();
		if (!email || !email.includes('@')) return;

		lastSubmit = Date.now();
		submitDisabled = true;
		commentStatus = 'eating...';
		showTrophy();

		const referredBy = localStorage.getItem('ceiling_referred_by') || '';

		try {
			const res = await fetch('/api/submit-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, referredBy })
			});

			if (res.ok) {
				const data = await res.json();
				localStorage.setItem('ceiling_email', email.toLowerCase().trim());
				if (data.fields?.ref_code) {
					localStorage.setItem('ceiling_ref_code', data.fields.ref_code);
					referralCode = data.fields.ref_code;
				}
				emailInput = '';
				commentStatus = 'ok we got your email!!';
			} else {
				commentStatus = 'error :( ask in #ceiling channel for help!';
			}
		} catch {
			commentStatus = 'error :( ask in #ceiling channel for help!';
		}

		submitDisabled = false;
	}
</script>

<svelte:head>
	<title>ceiling by hack club</title>
	<meta name="description" content="make projects, get ceiling & ceiling merch" />
	<meta property="og:image" content="/assets/ogimg.png" />
	<meta name="twitter:image" content="/assets/ogimg.png" />
</svelte:head>

<main>
	<section id="main-section">
		<CornerArrows />
		<div id="main-section-content">
			<div id="main-text">
				<img id="main-logo" src="/assets/landing/logo.png" alt="" />
				<div id="main-ceiling">
					<img src="/assets/landing/ceiling_arrow.png" alt="" />
					<p>this is ceiling</p>
				</div>

				<p>launching<br/>sept/oct 2026</p>
				<p>make technical projects<br/>get ceiling & ceiling merch</p>
				<div id="main-email">
					<input
						type="email"
						bind:value={emailInput}
						placeholder="your awesome email here..."
						onkeydown={(e) => { if (e.key === 'Enter') submitComment(); }}
					/>
					<button
						disabled={submitDisabled}
						style:opacity={submitDisabled ? '0.5' : '1'}
						onclick={submitComment}
					>
						<div>
							<p><span class="bigtext">RSVP</span></p>
							<p style="margin-top: -0.3em"><span class="smalltext">for updates</span></p>
						</div>
					</button>
				</div>
				<p><span class="smalltext" id="comment-status">{commentStatus}</span></p>

				<p><span class="smalltext">teen? start coding now. <a href="/info">see more info &rarr;</a></span></p>
				<p><span class="smalltext"><a href="#referral" onclick={openReferral}>refer your friends for bonus rewards!</a></span></p>

				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div id="referral-overlay" class:show={showReferral} onclick={closeReferral} onkeydown={() => {}}></div>
				<div id="referral-popup" class:show={showReferral}>
					<h2 id="referral-title">CEILING REFERRALS</h2>
					<div id="referral-desc">
						<p>when you refer a friend to ceiling, you <u>earn 10% of all the hours</u> that they submit to ceiling.</p>
						<p>for every 10 hours shipped by a friend you referred, you get prizes* as if you shipped 1 hour, without doing anything. (they don't lose anything from this either!)</p>
						<p><span class="smalltext">*up to the number of hours you shipped. see faq (soon) for more information!</span></p>
					</div>

					{#if referralView === 'link'}
						<p class="referral-label">REFERRAL CODE</p>
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div id="referral-url-box" class="has-code" onclick={copyReferral} onkeydown={() => {}}>
							<span id="referral-url" class:copied={referralUrlCopied}>
								{#if referralUrlCopied}
									copied!
								{:else}
									{referralUrl}
								{/if}
							</span>
							<img src="/assets/copy-icon.svg" alt="copy" width="20" height="20" />
						</div>
						<p id="referral-copy-status"></p>
					{:else}
						<p class="referral-label">ENTER EMAIL TO START REFERRING</p>
						<div id="referral-url-box">
							<input
								type="email"
								bind:value={referralEmail}
								placeholder="your email here..."
								onkeydown={(e) => { if (e.key === 'Enter') getReferralCode(); }}
							/>
							<button onclick={getReferralCode}>get code!</button>
						</div>
						<p id="referral-copy-status">{referralCopyStatus}</p>
					{/if}

					<p id="referral-count">{referralCount}</p>
				</div>
			</div>
		</div>
	</section>

	<section id="merch-section">
		<p style="text-align: right; grid-area: lefttext;">big ceiling<br/>
small ceiling<br/>
medium ceiling<br/>
microwavable ceiling<br/>
baby ceiling</p>
		<img style="grid-area: img1;" src="/assets/landing/merch/blanket.png" alt="" />
		<img style="grid-area: img2;" src="/assets/landing/merch/ceiling.png" alt="" />
		<img style="grid-area: img3; justify-self: end;" src="/assets/landing/merch/tshirt1.png" alt="" />
		<img style="grid-area: img4; justify-self: end;" src="/assets/landing/merch/tshirt2.png" alt="" />
		<p style="grid-area: righttext;">ceiling tshirt<br/>
ceiling socks<br/>
ceiling stickers<br/>
ceiling necklace<br/>
ceiling pin</p>
	</section>
</main>

<div id="trophy-overlay" class:trophy-show={trophyAnimating} onanimationend={onOverlayEnd}></div>
{#if trophyVisible}
	<img id="trophy" src="/trophy.png" alt="" class:trophy-show={trophyAnimating} onanimationend={onTrophyEnd} />
{/if}

<style>
	main {
		position: absolute;
		top: var(--border-size);
		left: var(--border-size);
		right: var(--border-size);
		bottom: var(--border-size);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}

	#main-section {
		position: relative;
		width: 100%;
		border: #4B65D5 2px solid;
		border-radius: 16px;
		background-color: white;
		box-sizing: border-box;
		flex-grow: 2;
		--arrow-distance: 32;
	}

	#main-section:hover {
		--arrow-distance: 24;
	}

	#main-section-content {
		position: relative;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		padding: 30px;
		box-sizing: border-box;
	}

	#main-logo {
		width: 100%;
		margin-bottom: -8%;
	}

	#main-ceiling {
		width: 60%;
		margin-top: -18%;
		margin-right: -15%;
		float: right;
		position: relative;
	}

	#main-ceiling img {
		width: 100%;
		height: auto;
		position: absolute;
	}

	#main-ceiling p {
		position: absolute;
		left: 72%;
		margin-right: -50%;
		margin-top: 22.5%;
	}

	#main-text {
		width: 600px;
	}

	#main-email {
		width: 100%;
		display: flex;
		flex-flow: row;
		align-items: center;
		justify-content: stretch;
		position: relative;
		top: 0.2em;
		margin-bottom: 1rem;
	}

	#main-email input {
		all: unset;
		flex-grow: 5;
		color: #4B65D5;
		outline: none;
		border: 2px solid #4B65D5;
		padding: 8px;
		font-family: inherit;
		font-size: inherit;
	}

	#main-email input::placeholder {
		color: #4B65D5;
		opacity: 0.5;
	}

	#main-email button {
		all: unset;
		box-sizing: content-box;
		margin: -18px;
		padding: 18px 40px;
		background-color: #FFBB1C;
		color: white;
		border-radius: 50%;
		transition: 0.2s;
		cursor: url('/assets/pointer.png'), pointer;
		font-family: inherit;
		font-size: inherit;
		text-align: left;
	}

	#main-email button:hover {
		background-color: #FAE09F;
	}

	#main-email button p {
		margin: 0;
	}

	#merch-section {
		width: 85%;
		border: #4B65D5 2px solid;
		border-radius: 16px;
		background-color: white;
		margin-top: 32px;
		padding: 20px;
		display: grid;
		grid-gap: 16px;
		grid-template-columns: 1fr auto auto auto auto 1fr;
		grid-template-areas: "lefttext img1 img2 img3 img4 righttext";
	}

	#merch-section p {
		font-size: 0.75rem;
		color: #FFBB1C;
		align-content: center;
		margin: 0;
	}

	#merch-section img {
		background-color: #4B65D5;
		border: 2px solid #FFBB1C;
		max-width: 150px;
	}

	/* trophy */
	#trophy-overlay {
		position: fixed;
		inset: 0;
		background: black;
		opacity: 0;
		pointer-events: none;
		z-index: 999;
	}

	#trophy {
		position: fixed;
		left: 50%;
		top: 50%;
		height: 80vh;
		transform: translate(-50%, -150vh);
		opacity: 0;
		pointer-events: none;
		z-index: 1000;
	}

	:global(#trophy.trophy-show) {
		animation: trophy-fly 4.5s linear forwards;
	}

	:global(#trophy-overlay.trophy-show) {
		animation: trophy-dim 5.5s linear forwards;
	}

	@keyframes trophy-fly {
		0%   { transform: translate(-50%, -150vh); opacity: 1; }
		60%  { transform: translate(-50%, -50%); opacity: 1; }
		90.3% { transform: translate(-50%, -50%); opacity: 1; }
		100% { transform: translate(-50%, -50%); opacity: 0; }
	}

	@keyframes trophy-dim {
		0%   { opacity: 0; }
		16.4% { opacity: 0.5; }
		81.8% { opacity: 0.5; }
		100% { opacity: 0; }
	}

	/* referral popup */
	#referral-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 900;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.2s;
	}

	#referral-overlay.show {
		opacity: 1;
		pointer-events: auto;
	}

	#referral-popup {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0.9);
		background: white;
		border: 2px solid #4B65D5;
		border-radius: 16px;
		padding: 48px 80px;
		z-index: 901;
		max-width: 795px;
		width: calc(100% - 48px);
		box-sizing: border-box;
		text-align: center;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.2s, transform 0.2s;
	}

	#referral-popup.show {
		opacity: 1;
		pointer-events: auto;
		transform: translate(-50%, -50%) scale(1);
	}

	#referral-title {
		font-family: 'Dirty Stains';
		font-size: 2rem;
		color: #4B65D5;
		margin: 0 0 8px;
	}

	#referral-desc {
		font-size: 1rem;
		color: #4B65D5;
		margin-bottom: 24px;
	}

	#referral-desc p {
		margin: 0 0 8px;
	}

	.referral-label {
		font-family: 'Dirty Stains';
		font-size: 1.125rem;
		color: #FFBB1C;
		margin: 0 0 8px !important;
	}

	#referral-url-box {
		display: flex;
		align-items: center;
		height: 46px;
		overflow: hidden;
	}

	#referral-url-box input {
		all: unset;
		flex: 1;
		border: 2px solid #4B65D5;
		border-right: none;
		padding: 8px 16px;
		font-family: inherit;
		font-size: 1rem;
		color: #4B65D5;
		min-width: 0;
		box-sizing: border-box;
	}

	#referral-url-box input::placeholder {
		color: #4B65D5;
		opacity: 0.43;
	}

	#referral-url-box button {
		all: unset;
		background: #FFBB1C;
		border: 2px solid #FFBB1C;
		color: white;
		padding: 8px 24px;
		font-family: inherit;
		font-size: 1rem;
		cursor: url('/assets/pointer.png') 0 0, pointer;
		transition: background 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	#referral-url-box button:hover {
		background: #FAE09F;
	}

	#referral-url-box.has-code {
		background: #FFBB1C;
		border: 1px solid #FFBB1C;
		cursor: url('/assets/pointer.png') 0 0, pointer;
		transition: filter 0.15s;
		position: relative;
		padding: 0 8px;
	}

	#referral-url-box.has-code:hover {
		filter: brightness(1.08);
	}

	#referral-url-box.has-code #referral-url {
		flex: 1;
		color: white;
		font-size: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	#referral-url-box.has-code:hover #referral-url:not(.copied) {
		font-size: 0;
	}

	#referral-url-box.has-code:hover #referral-url:not(.copied)::after {
		content: 'click to copy';
		font-size: 1rem;
	}

	#referral-url-box.has-code #referral-url.copied {
		font-size: 0;
	}

	#referral-url-box.has-code #referral-url.copied::after {
		content: 'copied!';
		font-size: 1rem;
	}

	#referral-url-box.has-code img {
		margin-left: 8px;
		flex-shrink: 0;
		height: 1.75em;
		width: auto;
	}

	#referral-count {
		font-family: 'Dirty Stains';
		font-size: 1.125rem;
		color: #4B65D5;
		margin-top: 24px;
		margin-bottom: 0;
	}

	#referral-copy-status {
		font-size: 0.75rem;
		color: #4B65D5;
		min-height: 1.2em;
		margin: 4px 0 0 !important;
	}

	@media (max-width: 1250px) {
		#merch-section {
			grid-template-columns: 1fr auto auto 1fr;
			grid-template-areas:
			"lefttext img1 img2 righttext"
			"lefttext img3 img4 righttext";
		}
	}

	@media (max-width: 1000px) {
		main {
			position: relative;
			z-index: 1;
			margin: 0 auto;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			width: 90%;
		}

		#main-section {
			height: auto;
		}

		#main-text {
			width: 75%;
		}

		#merch-section {
			height: auto;
		}
	}

	@media (max-width: 800px) {
		#main-ceiling {
			aspect-ratio: 1.5;
			margin: 0 auto;
			margin-top: -7%;
			float: none;
			margin-bottom: -5%;
		}

		#main-text {
			padding-bottom: 48px;
			padding-top: 32px;
		}
	}

	@media (max-width: 600px) {
		main {
			width: calc(100% - 32px);
			margin: 0 auto;
			min-height: 100vh;
			min-height: 100dvh;
			justify-content: stretch;
			box-sizing: border-box;
			gap: 16px;
		}

		main > :global(section) {
			flex-grow: 1;
			border-radius: 0;
			width: 100%;
			box-sizing: border-box;
		}

		#merch-section {
			width: 100%;
			margin-top: 0;
			grid-template-columns: 1fr 1fr;
			grid-template-areas: "lefttext img1"
			                    "img3 img2"
			                    "img4 righttext";
		}

		#main-text {
			width: 100%;
		}

		#main-email {
			flex-flow: column;
		}

		#main-email input {
			width: 100%;
		}

		#main-email button {
			margin: -8px;
		}

		#referral-popup {
			padding: 32px 24px;
		}

		#referral-title {
			font-size: 1.5rem;
		}

		#referral-desc {
			font-size: 0.85rem;
		}

		#referral-url-box.has-code #referral-url {
			font-size: 0.8rem;
		}
	}
</style>
