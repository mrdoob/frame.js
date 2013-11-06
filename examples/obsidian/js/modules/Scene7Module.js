var Scene7Module = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

        startPosition:       new FRAME.ModuleParameter.Vector3( 0, 0, 0 ),
        endPosition:         new FRAME.ModuleParameter.Vector3( 0, 0, 0 ),
        startPositionTarget: new FRAME.ModuleParameter.Vector3( 0, 0, 0 ),
        endPositionTarget:   new FRAME.ModuleParameter.Vector3( 0, 0, 2000 )

	};

    var width = renderer.domElement.width;
    var height = renderer.domElement.height;

    var camera = new THREE.PerspectiveCamera( 60, width / height, 1, 4000 );
    var cameraTarget = new THREE.Vector3();

	var scene = new THREE.Scene();

    var light = new THREE.PointLight( 0xff0000, 5, 300 );
    scene.add( light );
    
    var light1 = new THREE.PointLight( 0x8844ff, 5, 1000 );
    scene.add( light1 );
    
    // city
    
    var plane = new THREE.CubeGeometry( 2, 2, 2 );
    plane.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 1, 0 ) );
    var geometry = new THREE.Geometry() ;
    var material = new THREE.MeshLambertMaterial( {
        color: 0x808080,
        shading: THREE.FlatShading
    } );
    
    for ( var i = 0; i < 800; i ++ ) {

        var object = new THREE.Mesh( plane, material );
        object.position.x = Math.random() * 2000 - 1000;
        object.position.z = Math.random() * 2000 - 1000;
        object.scale.x = Math.random() * 20;
        object.scale.y = Math.random() * Math.random() * 100;
        object.scale.z = Math.random() * 20;
        THREE.GeometryUtils.merge( geometry, object );

    }

    var tunnel = new THREE.Mesh( geometry, material );
    scene.add( tunnel );
    
    var geometry = new THREE.Geometry();
    var material = new THREE.MeshLambertMaterial( {
        color: 0x606060,
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
        wireframe: true
    } );
    
    for ( var i = 0; i < 800; i ++ ) {

        var object = new THREE.Mesh( plane, material );
        object.position.x = Math.random() * 2000 - 1000;
        object.position.z = Math.random() * 2000 - 1000;
        object.scale.x = Math.random() * 20;
        object.scale.y = Math.random() * Math.random() * 100;
        object.scale.z = Math.random() * 20;
        THREE.GeometryUtils.merge( geometry, object );

    }

    var tunnel2 = new THREE.Mesh( geometry, material );
    scene.add( tunnel2 );
    
    //
    
    var group = new THREE.Object3D();
    scene.add( group );
    
    var geometry =  new THREE.TetrahedronGeometry( 12, 0 );
    var material = new THREE.MeshLambertMaterial( {
        emissive: 0xf00000,
        shading: THREE.FlatShading
    } );

    for ( var i = 0; i < 500; i ++ ) {

		var object = new THREE.Mesh( geometry, material );
        object.position.x = Math.random() - 0.5;
        object.position.z = Math.random() - 0.5;
        object.position.normalize();
        object.position.multiplyScalar( Math.random() * 100 );
        object.position.y = - Math.random() * 2000 + 2000;
        group.add( object );

    }
    
    var sphere = new THREE.Object3D();
    sphere.scale.multiplyScalar( 5 );
    scene.add( sphere );
    
    sphere.add( new THREE.Mesh( new THREE.SphereGeometry( 20, 2, 2 ), material ) );    
    sphere.add( new THREE.Mesh( new THREE.IcosahedronGeometry( 20, 0 ), material ) );
    sphere.add( new THREE.Mesh( new THREE.CubeGeometry( 20, 20, 20 ), material ) );
    sphere.add( new THREE.Mesh( new THREE.OctahedronGeometry( 20, 0 ), material ) );
    sphere.add( new THREE.Mesh( new THREE.IcosahedronGeometry( 20, 1 ), material ) );
    sphere.add( new THREE.Mesh( new THREE.TetrahedronGeometry( 20, 0 ), material ) );
    sphere.add( new THREE.Mesh( new THREE.TetrahedronGeometry( 20, 1 ), material ) );
    
    //
        
    var startPosition = new THREE.Vector3();
    var endPosition = new THREE.Vector3();
    var deltaPosition = new THREE.Vector3();
    
    var startPositionTarget = new THREE.Vector3();
    var endPositionTarget = new THREE.Vector3();
    var deltaPositionTarget = new THREE.Vector3();
    
    this.start = function ( t, parameters ) {
      
        startPosition.fromArray( parameters.startPosition );
        endPosition.fromArray( parameters.endPosition );
        deltaPosition.subVectors( endPosition, startPosition );
        
        startPositionTarget.fromArray( parameters.startPositionTarget );
        endPositionTarget.fromArray( parameters.endPositionTarget );
        deltaPositionTarget.subVectors( endPositionTarget, startPositionTarget );
      
    };
    
    var prevShape = 0;

	this.update = function ( t ) {

        camera.position.copy( deltaPosition );
        camera.position.multiplyScalar( t );
		camera.position.add( startPosition );

        cameraTarget.copy( deltaPositionTarget );
        cameraTarget.multiplyScalar( t );
        cameraTarget.add( startPositionTarget );
        
        camera.lookAt( cameraTarget );

        sphere.position.y = 1900 - ( t  * 1700 );

        group.position.y = sphere.position.y;
        group.rotation.y = t * 10;
        light.position.y = sphere.position.y;        
        
        var shape = Math.floor( t * 525 ) % sphere.children.length;
        
        if ( shape !== prevShape ) {
            
            for ( var i = 0, l = sphere.children.length; i < l; i ++ ) {
                
                var object = sphere.children[ i ];
                object.visible = i === shape;
                
            }
            
            prevShape = shape;
            
        }
        
        for ( var i = 0, l = group.children.length; i < l; i ++ ) {

            var mesh = group.children[ i ];
            mesh.rotation.x = i + t * 240;
            mesh.rotation.z = i + t * 120;
            
        }
        
		renderer.render( scene, camera );

	};

};