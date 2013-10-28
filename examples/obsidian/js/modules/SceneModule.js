var SceneModule = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

        startPosition: [100, 100, 100],
        endPosition: [-100, 100, 100]

	};

    var width = renderer.domElement.width;
    var height = renderer.domElement.height;

    var camera = new THREE.PerspectiveCamera( 60, width / height, 1, 1000 );

	var scene = new THREE.Scene();

    var light1 = new THREE.PointLight( 0x8844ff, 5, 100 );
    scene.add( light1 );
        
    var light2 = new THREE.PointLight( 0xff2288, 5, 100 );
    scene.add( light2 );
    
    var group = new THREE.Object3D();
    scene.add( group );
    
    var geometry = new THREE.IcosahedronGeometry( 5, 0 );
    var material = new THREE.MeshLambertMaterial( {
        shading: THREE.FlatShading
	} );

    for ( var i = 0; i < 500; i ++ ) {

		var object = new THREE.Mesh( geometry, material );
        object.position.x = Math.random() * 200 - 100;
        object.position.y = Math.random() * 200 - 100;
        object.position.z = Math.random() * 200 - 100;
        object.rotation.x = Math.random();
        object.rotation.y = Math.random();
        group.add( object );

    }
    
    //
        
    var startPosition = new THREE.Vector3();
    var endPosition = new THREE.Vector3();
    var deltaPosition = new THREE.Vector3();
    
    this.start = function ( t, parameters ) {
      
        startPosition.fromArray( parameters.startPosition );
        endPosition.fromArray( parameters.endPosition );
        deltaPosition.subVectors( endPosition, startPosition );      
      
    };

	this.update = function ( t ) {

        camera.position.copy( deltaPosition );
        camera.position.multiplyScalar( t );
		camera.position.add( startPosition );
        camera.lookAt( scene.position );
        
        light1.position.x = Math.sin( t * 5 ) * 100;
        light1.position.z = Math.cos( t * 5 ) * 100;

        light2.position.x = Math.sin( t * 5 + 2 ) * 100;
        light2.position.z = Math.cos( t * 5 + 2 ) * 100;
        
        for ( var i = 0, l = group.children.length; i < l; i ++ ) {

            var mesh = group.children[ i ];
            var scale = Math.sin( t * 10 + mesh.position.distanceTo( scene.position ) * 0.5 ) + 1;
            mesh.rotation.x = scale * 2;
            mesh.rotation.y = scale;
            mesh.scale.set( scale, scale, scale );
            
        }
        
		renderer.render( scene, camera );

	};

};