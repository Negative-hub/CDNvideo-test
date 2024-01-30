if (Hls.isSupported()) {
	const video = document.getElementById("video");
	const currentMediaPosition = document.getElementById('current-media-position');
	const currentMediaSize = document.getElementById('current-media-size');
	let bytes = 0;

  const hls = new Hls();

	const timeUpdateHandler = (event) => {
		const seconds = Math.round(event.target.currentTime);
		currentMediaPosition.innerText = 
			`Текущая позиция в видео: ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
	};

  hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
		video.addEventListener("timeupdate", timeUpdateHandler);
  });

	 hls.loadSource(
     "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8"
   );

	hls.on(Hls.Events.MEDIA_ATTACHED, () => {
    console.log("video and hls.js are now bound together!");
  });

	hls.on(Hls.Events.FRAG_BUFFERED, (event, data) => {
		if (data.id === 'main') {
    	bytes += data.stats.total;
			let text = ''

			if (bytes < 1000) {
				text = `Загружено: ${bytes} Б`
			} else if (bytes < 1000 * 1000) {
				text = `Загружено: ${(bytes / 1000).toFixed(2)} КБ`
			} else {
				text = `Загружено: ${(bytes / (1000 * 1000)).toFixed(2)} МБ`;
			}

			currentMediaSize.innerText = text;
		}
  });

	hls.on(Hls.Events.DESTROYING, () => {
		video.removeEventListener("timeupdate", timeUpdateHandler);
	});

	hls.attachMedia(video);
}