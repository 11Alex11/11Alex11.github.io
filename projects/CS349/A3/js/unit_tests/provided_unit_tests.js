'use strict';

var expect = chai.expect;

describe('Provided unit tests', function() {
	it('Graph Creation', function() {
		var sceneGraphModule = createSceneGraphModule();
		var root = new sceneGraphModule.GraphNode();
	    root.initGraphNode(new AffineTransform(),"ROOT");
	    var body = new sceneGraphModule.CarNode();
	    var flTire = new sceneGraphModule.TireNode(sceneGraphModule.FRONT_LEFT_TIRE_PART);
	    var fAxle = new sceneGraphModule.AxleNode(sceneGraphModule.FRONT_AXLE_PART);
	    root.addChild(body);
	    root.addChild(flTire);
	    flTire.addChild(fAxle);
	    
	    expect(root.children[sceneGraphModule.FRONT_AXLE_PART]).not.to.be.null;
	    expect(root.children[sceneGraphModule.CAR_PART]).not.to.be.null;
		expect(body).not.to.be.null;
		expect(flTire).not.to.be.null;
		expect(fAxle).not.to.be.null;
    });
    it('Test Point not inside', function() {
		var sceneGraphModule = createSceneGraphModule();

	    var body = new sceneGraphModule.CarNode();
	    var point={x:45,y:0};


		expect(body.pointInObject(point)).to.be.false;
    });
    it('Test Point  inside', function() {
		var sceneGraphModule = createSceneGraphModule();

	    var body = new sceneGraphModule.CarNode();
	   var point={x:0,y:0};


		expect(body.pointInObject(point)).to.be.true;
    });
    it('Translate', function() {
		var sceneGraphModule = createSceneGraphModule();

	    var body = new sceneGraphModule.CarNode();
	    body.objectTransform.translate(50,50);
	   var point={x:0,y:0};
		expect(body.pointInObject(point)).to.be.false;
		point={x:40,y:40};
		expect(body.pointInObject(point)).to.be.true;
		point={x:50,y:50};
		expect(body.pointInObject(point)).to.be.true;
    });
    it('Other Transforms', function() {
		var sceneGraphModule = createSceneGraphModule();

	    var body = new sceneGraphModule.CarNode();
	    body.objectTransform.rotate(90*Math.PI/180,0,0)
	    body.objectTransform.translate(50,50);
	   var point={x:0,y:0};
		expect(body.pointInObject(point)).to.be.false;
		point={x:50,y:50};
		expect(body.pointInObject(point)).to.be.false;



    });


});
