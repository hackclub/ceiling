<script>
	import CornerArrows from '$lib/components/CornerArrows.svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	let currentPath = $derived($page.url.pathname);

	const navItems = [
		{ href: '/info', label: 'FAQ HOMEPAGE', icon: null },
		{ icon: '/assets/info/star.svg' },
		{ href: '/info/teens', label: 'TEEN PARTICIPATION', icon: null },
		{ icon: '/assets/info/asterisk.svg' },
		{ href: '/info/merch', label: 'PURCHASING MERCH', icon: null },
		{ icon: '/assets/info/link.svg' },
		{ href: '/info/referral', label: 'REFERRAL SYSTEM', icon: null }
	];
</script>

<main id="info-main">
	<div class="sidebar-column">
		<aside id="info-sidebar">
			<h2 id="info-sidebar-title">FAQ</h2>
			<nav id="info-nav">
				{#each navItems as item}
					{#if item.icon && !item.label}
						<img src={item.icon} class="info-nav-icon" alt="" />
					{:else if item.href}
						<a
							href={item.href}
							class="info-nav-item"
							class:active={item.href === currentPath}
						>
							{item.label}
						</a>
					{/if}
				{/each}
			</nav>
			<a href="/" id="info-back">
				<img src="/assets/info/back-arrow.svg" alt="" />
				<span>BACK TO CEILING</span>
			</a>
		</aside>
	</div>

	<section id="info-content">
		<CornerArrows />
		<div id="info-content-inner">
			{@render children()}
		</div>
	</section>
</main>

<style>
	/* pin background behind scrollable info pages */
	:global(#bg) {
		position: fixed !important;
		inset: 0;
		z-index: 0;
	}

	:global(footer) {
		position: fixed !important;
		bottom: 0 !important;
	}

	#info-main {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: row;
		gap: 16px;
		padding: 0 var(--border-size);
		min-height: 100vh;
		align-items: flex-start;
	}

	.sidebar-column {
		position: sticky;
		top: 0;
		height: 100vh;
		display: flex;
		align-items: center;
		flex-shrink: 0;
		box-sizing: border-box;
	}

	#info-sidebar {
		width: 243px;
		min-width: 200px;
		border: 2px solid #4B65D5;
		border-radius: 16px;
		background-color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40px 16px 24px;
		box-sizing: border-box;
	}

	#info-sidebar-title {
		font-family: 'Dirty Stains';
		font-size: 2rem;
		color: #4B65D5;
		margin: 0 0 16px;
		text-align: center;
	}

	#info-nav {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.info-nav-item {
		font-size: 1rem;
		color: #4B65D5;
		text-decoration: none;
		text-align: center;
		transition: opacity 0.15s;
	}

	.info-nav-item:hover {
		text-decoration: none;
		opacity: 0.7;
	}

	.info-nav-item.active {
		text-decoration: underline;
		text-decoration-style: wavy;
	}

	.info-nav-icon {
		width: 27px;
		height: 27px;
		margin: 4px 0;
		object-fit: contain;
	}

	#info-back {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: 'Dirty Stains';
		font-size: 1rem;
		color: #4B65D5;
		text-decoration: none;
		margin-top: 16px;
	}

	#info-back:hover {
		text-decoration: none;
		opacity: 0.7;
	}

	#info-back img {
		width: 21px;
		height: 21px;
		transform: rotate(-135deg);
	}

	#info-content {
		flex-grow: 1;
		align-self: stretch;
		border: 2px solid #4B65D5;
		border-radius: 16px;
		background-color: white;
		position: relative;
		overflow: hidden;
		margin: var(--border-size) 0;
		--arrow-distance: 32;
	}

	#info-content:hover {
		--arrow-distance: 24;
	}

	#info-content-inner {
		position: relative;
		padding: 60px 90px;
		box-sizing: border-box;
	}

	#info-content-inner :global(#info-title) {
		font-family: 'Dirty Stains';
		font-size: 2rem;
		color: #4B65D5;
		text-align: center;
		margin: 0 0 24px;
	}

	#info-content-inner :global(#info-text) {
		font-size: 1rem;
		color: #4B65D5;
		line-height: 1.5;
	}

	#info-content-inner :global(#info-text p) {
		margin: 0 0 16px;
	}

	#info-content-inner :global(#info-text ul) {
		list-style-type: disc;
		padding-left: 24px;
		margin: 0;
	}

	#info-content-inner :global(#info-text ul li) {
		margin-bottom: 4px;
	}

	#info-content-inner :global(#info-text a) {
		color: #4B65D5;
	}

	@media (max-width: 1000px) {
		#info-main {
			flex-direction: column;
			width: 90%;
			margin: 0 auto;
			padding: 0;
			padding-top: var(--border-size);
		}

		.sidebar-column {
			position: static;
			height: auto;
			width: 100%;
		}

		#info-sidebar {
			width: 100%;
			min-width: 0;
			flex-direction: row;
			flex-wrap: wrap;
			padding: 16px 24px;
			gap: 8px;
			justify-content: center;
		}

		#info-sidebar-title {
			width: 100%;
			margin-bottom: 8px;
		}

		#info-nav {
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			gap: 8px;
		}

		.info-nav-icon {
			width: 20px;
			height: 20px;
			margin: 0;
		}

		#info-back {
			margin-top: 8px;
			width: 100%;
			justify-content: center;
		}

		#info-content {
			margin: 0 0 var(--border-size);
		}

		#info-content-inner {
			padding: 48px 32px;
		}
	}

	@media (max-width: 600px) {
		#info-main {
			width: calc(100% - 32px);
			gap: 8px;
		}

		#info-sidebar {
			padding: 12px 16px;
		}

		.info-nav-item {
			font-size: 0.8rem;
		}

		#info-content-inner {
			padding: 40px 20px;
		}

		#info-content-inner :global(#info-title) {
			font-size: 1.5rem;
		}

		#info-content-inner :global(#info-text) {
			font-size: 0.9rem;
		}
	}
</style>
