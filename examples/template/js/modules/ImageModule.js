( function ( config ) {

	var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

	var scene = new THREE.Scene();

	var material = new THREE.MeshBasicMaterial( { transparent: true } );

	scene.add( new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material ) );

	var renderer = config.renderer;

	return new FRAME.Module( {

		parameters: {

			url:     new FRAME.ModuleParameter.String( 'URL', '' ),
			opacity: new FRAME.ModuleParameter.Float( 'Opacity', 1, 0, 1 )

		},

		init: function ( parameters ) {

			material.map = THREE.ImageUtils.loadTexture( config.path + parameters.url );

		},

		update: function ( parameters ) {

			material.opacity = parameters.opacity;
			renderer.render( scene, camera );

		}

	} );

} )