( function ( config ) {

	var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

	var scene = new THREE.Scene();

	var material = new THREE.MeshBasicMaterial( { transparent: true } );
	var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );

	scene.add( mesh );

	var renderer = config.renderer;

	//

	return new FRAME.Module( {

		parameters: {

			color:   new FRAME.Parameter.Color( 'Color', 0xffffff ),
			opacity: new FRAME.Parameter.Float( 'Opacity', 1, 0, 1 )

		},

		update: function ( parameters ) {

			material.color.setHex( parameters.color );
			material.opacity = parameters.opacity;

			renderer.render( scene, camera );

		}

	} );

} )