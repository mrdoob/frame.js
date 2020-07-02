/**
 * @author mrdoob / http://mrdoob.com/
 */

function SidebarRender( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'render' );

	// Video

	container.add( new UI.Text( 'Video' ).setTextTransform( 'uppercase' ) );
	container.add( new UI.Break(), new UI.Break() );

	// Resolution

	var resolutionRow = new UI.Row();
	resolutionRow.add( new UI.Text( 'Resolution' ).setWidth( '90px' ) );

	var videoWidth = new UI.Integer( 768 ).setWidth( '50px' );
	resolutionRow.add( videoWidth );

	var videoHeight = new UI.Integer( 432 ).setWidth( '50px' );
	resolutionRow.add( videoHeight );

	container.add( resolutionRow );

	// Duration

	var videoDurationRow = new UI.Row();
	videoDurationRow.add( new UI.Text( 'Duration' ).setWidth( '90px' ) );

	var videoDuration = new UI.Integer( 70 );
	videoDurationRow.add( videoDuration );

	container.add( videoDurationRow );

	// FPS

	var videoFPSRow = new UI.Row();
	videoFPSRow.add( new UI.Text( 'Fps' ).setWidth( '90px' ) );

	var videoFPS = new UI.Integer( 30 );
	videoFPSRow.add( videoFPS );

	container.add( videoFPSRow );

	// Render

	var render = new UI.Button( 'RENDER' ).setMarginLeft( '90px' );
	render.onClick( async () => {

		const player = editor.player;
		const resources = editor.resources;

		const renderer = resources.get( 'renderer' );
		renderer.setPixelRatio( 1 );
		renderer.setSize( videoWidth.getValue(), videoHeight.getValue() );

		const element = renderer.domElement;
		const audio = player.getAudio();

		//

		const { createFFmpeg } = FFmpeg;
		const ffmpeg = createFFmpeg( { log: true } );

		await ffmpeg.load();

		if ( audio !== null ) await ffmpeg.write( 'audio.mp3', audio.src );

		const fps = videoFPS.getValue();
		const duration = videoDuration.getValue();
		const frames = duration * fps;

		let currentTime = 0;

		for ( let i = 0; i < frames; i ++ ) {

			editor.setTime( currentTime );
			const num = i.toString().padStart( 5, '0' );
			await ffmpeg.write( `tmp.${num}.png`, element.toDataURL() );
			currentTime += 1 / fps;

		}

		if ( audio !== null ) {

			await ffmpeg.run( `-framerate ${fps} -pattern_type glob -i *.png -i audio.mp3 -c:a aac -shortest -c:v libx264 -pix_fmt yuv420p -preset slow -crf 8 out.mp4`, { output: 'out.mp4' });

		} else {

			await ffmpeg.run( `-framerate ${fps} -pattern_type glob -i *.png -c:v libx264 -pix_fmt yuv420p -preset slow -crf 8 out.mp4`, { output: 'out.mp4' });

		}

		const data = await ffmpeg.read('out.mp4');

		if ( audio !== null ) await ffmpeg.remove('audio.mp3');

		for ( let i = 0; i < frames; i ++ ) {

			const num = i.toString().padStart( 5, '0' );
			await ffmpeg.remove( `tmp.${num}.png` );

		}

		save( new Blob( [ data.buffer ], { type: 'video/mp4' } ), 'out.mp4' );

	} );
	container.add( render );

	// SAVE

	const link = document.createElement( 'a' );

	function save( blob, filename ) {

		link.href = URL.createObjectURL( blob );
		link.download = filename;
		link.dispatchEvent( new MouseEvent( 'click' ) );

		// URL.revokeObjectURL( url ); breaks Firefox...

	}

	//

	return container;

}

export { SidebarRender };
