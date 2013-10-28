var Scene3Module = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

        startPosition: [600, 0, 0],
        endPosition: [600, 0, 0]

	};

    var width = renderer.domElement.width;
    var height = renderer.domElement.height;

    var camera = new THREE.PerspectiveCamera( 60, width / height, 1, 1000 );

	var scene = new THREE.Scene();

    var light1 = new THREE.PointLight( 0xff8844, 5, 300 );
    scene.add( light1 );

    var light1b = new THREE.PointLight( 0x8844ff, 3, 300 );
    scene.add( light1b );

    var light2 = new THREE.PointLight( 0x88ff44, 5, 300 );
    scene.add( light2 );

    var light2b = new THREE.PointLight( 0x8844ff, 3, 300 );
    scene.add( light2b );

    var group = new THREE.Object3D();
    scene.add( group );
    
    var geometry =  new THREE.TetrahedronGeometry( 20, 0 );
    var material = new THREE.MeshLambertMaterial( {
        color: 0x404040,
        shading: THREE.FlatShading
	} );

    for ( var i = 0; i < 600; i ++ ) {

		var object = new THREE.Mesh( geometry, material );
        object.position.x = Math.random() * 1000 - 500;
        object.position.y = Math.random() * 1000 - 500;
        object.position.z = Math.random() * 1000 - 500;
        object.scale.multiplyScalar( Math.random() * Math.random() * 3 );
        group.add( object );

    }

    var geometry =  new THREE.TetrahedronGeometry( 20, 1 );

    for ( var i = 0; i < 600; i ++ ) {

		var object = new THREE.Mesh( geometry, material );
        object.position.x = Math.random() * 1000 - 500;
        object.position.y = Math.random() * 1000 - 500;
        object.position.z = Math.random() * 1000 - 500;
        object.scale.multiplyScalar( Math.random() * Math.random() * 3 );
        group.add( object );

    }


    // sphere
    
    var sphere1 = new THREE.Object3D();
    scene.add( sphere1 );

    var material = new THREE.MeshLambertMaterial( {
        shading: THREE.FlatShading
    } );
    
    sphere1.add( new THREE.Mesh( new THREE.SphereGeometry( 20, 2, 2 ), material ) );    
    sphere1.add( new THREE.Mesh( new THREE.IcosahedronGeometry( 20, 0 ), material ) );
    sphere1.add( new THREE.Mesh( new THREE.CubeGeometry( 20, 20, 20 ), material ) );
    sphere1.add( new THREE.Mesh( new THREE.OctahedronGeometry( 20, 0 ), material ) );
    sphere1.add( new THREE.Mesh( new THREE.IcosahedronGeometry( 20, 1 ), material ) );
	sphere1.add( new THREE.Mesh( new THREE.TetrahedronGeometry( 20, 0 ), material ) );
    sphere1.add( new THREE.Mesh( new THREE.TetrahedronGeometry( 20, 1 ), material ) );

    var sphere2 = new THREE.Object3D();
    scene.add( sphere2 );

    sphere2.add( new THREE.Mesh( new THREE.IcosahedronGeometry( 20, 0 ), material ) );
    sphere2.add( new THREE.Mesh( new THREE.CylinderGeometry( 20, 20, 20, 3 ), material ) );
    sphere2.add( new THREE.Mesh( new THREE.CylinderGeometry( 20, 20, 20, 5 ), material ) );
    sphere2.add( new THREE.Mesh( new THREE.OctahedronGeometry( 20, 0 ), material ) );
    sphere2.add( new THREE.Mesh( new THREE.IcosahedronGeometry( 20, 1 ), material ) );
    sphere2.add( new THREE.Mesh( new THREE.TetrahedronGeometry( 20, 0 ), material ) );
    sphere2.add( new THREE.Mesh( new THREE.TetrahedronGeometry( 20, 2 ), material ) );
    
    //
        
    var startPosition = new THREE.Vector3();
    var endPosition = new THREE.Vector3();
    var deltaPosition = new THREE.Vector3();
    
    this.start = function ( t, parameters ) {
      
        startPosition.fromArray( parameters.startPosition );
        endPosition.fromArray( parameters.endPosition );
        deltaPosition.subVectors( endPosition, startPosition );      
      
    };
    
    var prevShape = 0;

	this.update = function ( t ) {

        camera.position.copy( deltaPosition );
        camera.position.multiplyScalar( t );
		camera.position.add( startPosition );
        camera.position.x += Math.max( 0, t - 0.495 ) * 500; 
        camera.lookAt( scene.position );
        
        sphere1.position.z = t * 700 - 700;
        sphere1.rotation.x = t * 12;
        sphere1.rotation.z = t * 12;

        light1.position.z = sphere1.position.z + 50;
        light1b.position.z = sphere1.position.z - 50;

        sphere2.position.z = t * - 700 + 700;
        sphere2.rotation.x = - t * 12;
        sphere2.rotation.z = - t * 12;

        light2.position.z = sphere2.position.z - 50;
        light2b.position.z = sphere2.position.z + 50;

        var shape = Math.floor( t * 255 ) % sphere1.children.length;
        
        if ( shape !== prevShape ) {
            
            for ( var i = 0, l = sphere1.children.length; i < l; i ++ ) {
                
                var object = sphere1.children[ i ];
                object.visible = i === shape;

                var object = sphere2.children[ i ];
                object.visible = i === shape;

            }

            prevShape = shape;
            
        }

        for ( var i = 0, l = group.children.length; i < l; i ++ ) {

            var mesh = group.children[ i ];
            mesh.rotation.x = i + t * 6;
            mesh.rotation.y = i + t * 4;
            
        }
        
		renderer.render( scene, camera );

	};

};