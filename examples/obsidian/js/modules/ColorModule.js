define( [ 'WebGLRendererModule' ], function ( renderer ) {

	return function () {

		var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

		var scene = new THREE.Scene();

		var geometry = new THREE.PlaneGeometry( 2, 2 );
		var material = new THREE.MeshBasicMaterial( { depthTest: false, depthWrite: false, transparent: true } );

		scene.add( new THREE.Mesh( geometry, material ) );

		return new FRAME.Module( {

			parameters: {

				color:   new FRAME.Parameter.Color( 'Color', 0xffffff ),
				opacity: new FRAME.Parameter.Float( 'Opacity', 1, 0, 1 )

			},

			update: function () {

				material.color.setHex( this.parameters.color.value );
				material.opacity = this.parameters.opacity.value;

				renderer.render( scene, camera );

			}

		} );

	};

} );