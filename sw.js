// r4

const assets = [
	'./',

	'./manifest.json',
	'./files/icon.png',

	'./css/main.css',
	'./css/dark.css',

	'./files/fullscreen.svg',
	'./files/next.svg',
	'./files/pause.svg',
	'./files/play.svg',
	'./files/prev.svg',

	'./js/libs/codemirror/codemirror.css',
	'./js/libs/codemirror/codemirror.js',
	'./js/libs/codemirror/addon/dialog/dialog.css',
	'./js/libs/codemirror/addon/dialog/dialog.js',
	'./js/libs/codemirror/addon/scroll/annotatescrollbar.js',
	'./js/libs/codemirror/addon/scroll/scrollpastend.js',
	'./js/libs/codemirror/addon/search/jump-to-line.js',
	'./js/libs/codemirror/addon/search/match-highlighter.js',
	'./js/libs/codemirror/addon/search/matchesonscrollbar.css',
	'./js/libs/codemirror/addon/search/matchesonscrollbar.js',
	'./js/libs/codemirror/addon/search/search.js',
	'./js/libs/codemirror/addon/search/searchcursor.js',
	'./js/libs/codemirror/mode/javascript.js',
	'./js/libs/codemirror/theme/monokai.css',
	'./js/libs/signals.min.js',
	'./js/libs/ui.js',

	'./js/Code.js',
	'./js/Config.js',
	'./js/Controls.js',
	'./js/Editor.js',
	'./js/Menubar.js',
	'./js/MenubarEdit.js',
	'./js/MenubarExamples.js',
	'./js/MenubarFile.js',
	'./js/MenubarHelp.js',
	'./js/Sidebar.js',
	'./js/SidebarAnimation.js',
	'./js/SidebarProject.js',
	'./js/SidebarRender.js',
	'./js/Timeline.Curves.js',
	'./js/Timeline.js',
	'./js/TimelineAnimations.js',
	'./js/Viewport.js'

];

self.addEventListener( 'install', async function () {

	const cache = await caches.open( 'framejs-editor' );

	assets.forEach( function ( asset ) {

		cache.add( asset ).catch( function () {

			console.error( '[SW] Cound\'t cache:', asset );

		} );

	} );

} );

self.addEventListener( 'fetch', async function ( event ) {

	const request = event.request;
	event.respondWith( cacheFirst( request ) );

} );

async function cacheFirst( request ) {

	const cachedResponse = await caches.match( request );

	if ( cachedResponse === undefined ) {

		console.error( '[SW] Not cached:', request.url );
		return fetch( request );

	}

	return cachedResponse;

}
