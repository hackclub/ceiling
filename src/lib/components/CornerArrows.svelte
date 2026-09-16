<div class="corner-arrows">
	<img src="/assets/landing/arrow.png" alt="" />
	<img src="/assets/landing/arrow.png" alt="" />
	<img src="/assets/landing/arrow.png" alt="" />
	<img src="/assets/landing/arrow.png" alt="" />
</div>

<style>
	.corner-arrows {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		--transition-time: 0.2s;
		pointer-events: none;
	}

	.corner-arrows img {
		position: absolute;
	}

	.corner-arrows img:nth-child(1) {
		top: calc(var(--arrow-distance, 32) * 1px);
		left: calc(var(--arrow-distance, 32) * 1px);
		transition: var(--transition-time);
	}

	.corner-arrows img:nth-child(2) {
		top: calc(var(--arrow-distance, 32) * 1px);
		right: calc(var(--arrow-distance, 32) * 1px);
		transform: rotate(90deg);
		transition: var(--transition-time);
	}

	.corner-arrows img:nth-child(3) {
		bottom: calc(var(--arrow-distance, 32) * 1px);
		right: calc(var(--arrow-distance, 32) * 1px);
		transform: rotate(180deg);
		transition: var(--transition-time);
	}

	.corner-arrows img:nth-child(4) {
		bottom: calc(var(--arrow-distance, 32) * 1px);
		left: calc(var(--arrow-distance, 32) * 1px);
		transform: rotate(270deg);
		transition: var(--transition-time);
	}
</style>
