class WaveformGenerator {

	generate( buffer, scale ) {

		const channelData = buffer.getChannelData( 0 );
		const width = buffer.duration;
		const height = 30;
		const increment = 20;

		const samplesPerSecond = 44100;
		const totalSamples = Math.floor( buffer.duration * samplesPerSecond );
		const sliceWidth = width / ( totalSamples / increment );

		let path = 'M 0 15';

		for ( let i = 0; i < totalSamples; i += increment ) {
			const x = ( i / increment ) * sliceWidth;
			const y = channelData[ i ];

			const yPos = ( y * height / 2 ) + height / 2;
			path += `L ${x} ${yPos}`;
		}

		const svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
		svg.setAttribute( 'width', width );
		svg.setAttribute( 'height', height );
		svg.setAttribute( 'viewBox', `0 0 ${width} ${height}` );
		svg.setAttribute( 'preserveAspectRatio', 'none' );
		svg.style.position = 'absolute';
		svg.style.left = '0';
		svg.style.top = '0';
		svg.style.width = width * scale + 'px';
		svg.style.pointerEvents = 'none';

		const waveform = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
		waveform.setAttribute( 'd', path );
		waveform.setAttribute( 'stroke', 'rgba(255, 255, 255, 0.2)' );
		waveform.setAttribute( 'stroke-width', '1' );
		waveform.setAttribute('vector-effect', 'non-scaling-stroke');
		waveform.setAttribute( 'fill', 'none' );
		svg.appendChild( waveform );

		return svg;

	}

}

export { WaveformGenerator };