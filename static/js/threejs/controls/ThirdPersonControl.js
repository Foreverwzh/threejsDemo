THREE.ThirdPersonControl = function ( camera, object, domElement ) {

    this.domElement = ( domElement !== undefined ) ? domElement : document;
    this.enabled = false;
    // this.group = new THREE.Group();
    this.object = object;
    this.camera = camera;
    this.wheelSpeed = 50;

	var scope = this;
    this.object.add( this.camera );
    this.camera.lookAt( this.object.position.x, 200, this.object.position.z );

	var onMouseMove = function ( event ) {
        if( scope.enabled === false ) return;
		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        const ry = -movementX * 0.01;
        const rx = movementY * 0.002;
        scope.object.rotateY(ry);
        const temp_rx = scope.camera.rotation.x + rx;
        if(temp_rx > -Math.PI && temp_rx < -Math.PI/2){
            scope.camera.rotateX(-rx);
            const m = new THREE.Matrix4();
            m.makeRotationX(rx);
            scope.camera.position.applyMatrix4(m);
        }
	};

    var onMouseWheel = function ( event ) {
        if( scope.enabled === false ) return;
        const distance = scope.camera.position.distanceTo(new THREE.Vector3(0,0,0));
        const translate = event.deltaY > 0 ? scope.wheelSpeed : -scope.wheelSpeed;
        // scope.camera.translateOnAxis(scope.camera.position, translate);
        const v = scope.camera.position.clone();
        v.x += v.x/distance*translate;
        v.y += v.y/distance*translate;
        v.z += (v.z/distance*translate);
        const temp_dis = v.distanceTo(new THREE.Vector3(0,0,0));
        if(temp_dis > 200) {
            scope.camera.position.copy(v);
        }
	};

	this.dispose = function () {
		this.domElement.removeEventListener( 'mousemove', onMouseMove, false );
        this.domElement.removeEventListener( 'mousewheel', onMouseWheel, false );
	};

    this.domElement.addEventListener( 'mousemove', onMouseMove, false );
    this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
};
