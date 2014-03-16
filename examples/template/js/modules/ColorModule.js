define( [ 'WebGLRendererModule' ], function ( renderer ) {

	return function () {

		var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

		var scene = new THREE.Scene();

		var geometry = new THREE.PlaneGeometry( 2, 2 );
		var material = new THREE.MeshBasicMaterial( { depthTest: false, depthWrite: false, transparent: true } );

		var mesh = new THREE.Mesh( geometry, material );

		scene.add( mesh );

		return new FRAME.Module( {

			parameters: {

				color:   new FRAME.ModuleParameter.Color( 'Color', 0xffffff ),
				opacity: new FRAME.ModuleParameter.Float( 'Opacity', 1, 0, 1 )

			},

			update: function () {

				material.color.setHex( this.parameters.color.value );
				material.opacity = this.parameters.opacity.value;

				renderer.render( scene, camera );

			}

		} );

	};

} );