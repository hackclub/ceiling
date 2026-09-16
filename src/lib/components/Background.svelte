<div id="bg" aria-hidden="true">
	<div style="grid-area: 1 / 1 / 8 / 5">
		<img src="/assets/background/1.png" alt="" style="object-position: left top" />
	</div>
	<div style="grid-area: 1 / 9 / 2 / 13">
		<img src="/assets/background/4.png" alt="" style="object-position: left top" />
	</div>
	<div style="grid-area: 1 / 6 / 1 / 10; margin-right: -3%">
		<img src="/assets/background/3.png" alt="" style="object-fit: fill" />
	</div>
	<div style="grid-area: 1 / 1 / 2 / 7">
		<img src="/assets/background/2.png" alt="" style="object-position: right top" />
	</div>
	<div style="grid-area: 5 / 7 / 8 / 9">
		<img src="/assets/background/8.png" alt="" style="object-position: left bottom; object-fit: fill" />
	</div>
	<div style="grid-area: 7 / 3 / 8 / 8">
		<img src="/assets/background/7.png" alt="" style="object-position: right bottom" />
	</div>
	<div style="grid-area: 6 / 1 / 8 / 4">
		<img src="/assets/background/5.png" alt="" style="object-position: left bottom; object-fit: fill" />
	</div>
	<div style="grid-area: 5 / 1 / 8 / 4; margin-right: -2%">
		<img src="/assets/background/6.png" alt="" style="object-position: right bottom" />
	</div>
	<div style="grid-area: 5 / 9 / 8 / 11">
		<img src="/assets/background/10.png" alt="" style="object-fit: cover; object-position: left bottom" />
	</div>
	<div style="grid-area: 5 / 9 / 8 / 13">
		<img src="/assets/background/9.png" alt="" style="object-fit: cover; object-position: left bottom" />
	</div>
	<div style="grid-area: 5 / 4 / 6 / 6; margin: -9% -9% -9% 0">
		<img src="/assets/background/11.png" alt="" style="object-position: left top" />
	</div>
	<div style="grid-area: 4 / 11 / 6 / 13">
		<img src="/assets/background/12.png" alt="" style="object-position: bottom; object-fit: cover" />
	</div>
	<div style="grid-area: 3 / 12 / 4 / 13">
		<img src="/assets/background/13.png" alt="" style="object-position: left bottom" />
	</div>
</div>

<style>
	#bg {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: var(--border-size) var(--border-size) 1fr var(--border-size) 1fr var(--border-size) var(--border-size) 1fr var(--border-size) 1fr 1fr var(--border-size);
		grid-template-rows: var(--border-size) var(--border-size) var(--border-size) 1fr 1fr var(--border-size) var(--border-size);
		margin: 0;
		padding: 0;
	}

	#bg > div {
		min-height: 0;
		overflow: hidden;
	}

	#bg > div > img {
		object-fit: contain;
		width: 100%;
		height: 100%;
	}

	@media (max-width: 1000px) {
		#bg {
			position: fixed;
			inset: 0;
			z-index: 0;
		}
	}
</style>
