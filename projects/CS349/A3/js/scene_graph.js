'use strict';

/**
 * A function that creates and returns the scene graph classes and constants.
 */
function createSceneGraphModule() {

    // Part names. Use these to name your different nodes
    var CAR_PART = 'CAR_PART';
    var FRONT_AXLE_PART = 'FRONT_AXLE_PART';
    var BACK_AXLE_PART = 'BACK_AXLE_PART';
    var FRONT_LEFT_TIRE_PART = 'FRONT_LEFT_TIRE_PART';
    var FRONT_RIGHT_TIRE_PART = 'FRONT_RIGHT_TIRE_PART';
    var BACK_LEFT_TIRE_PART = 'BACK_LEFT_TIRE_PART';
    var BACK_RIGHT_TIRE_PART = 'BACK_RIGHT_TIRE_PART';


    var FRONT_BUMPER = "FRONT_BUMPER";
    var BACK_BUMPER = "BACK_BUMPER";
    var CAR_LEFT = "CAR_LEFT";
    var CAR_RIGHT = "CAR_RIGHT";

    var GraphNode = function() {
    };

    _.extend(GraphNode.prototype, {

        /**
         * Subclasses should call this function to initialize the object.
         *
         * @param startPositionTransform The transform that should be applied prior
         * to performing any rendering, so that the component can render in its own,
         * local, object-centric coordinate system.
         * @param nodeName The name of the node. Useful for debugging, but also used to uniquely identify each node
         */
        initGraphNode: function(startPositionTransform, nodeName) {

            this.nodeName = nodeName;

            // The transform that will position this object, relative
            // to its parent
            this.startPositionTransform = startPositionTransform;

            // Any additional transforms of this object after the previous transform
            // has been applied
            this.objectTransform = new AffineTransform();

            // Any child nodes of this node
            this.children = {};

            // Add any other properties you need, here
        
            this.maxWidth=-1;
            this.maxHeight=-1;
            this.minWidth=-1;
            this.minHeight=-1;

            this.minRotation=-1;
            this.maxRotation=-1;

            this.width =0;
            this.height=0;
            this.x=0;
            this.y=0;
            this.rot=0;
            this.originX=0;
            this.originY=0;
            this.prevHit=null;
            this.drawColor="#ffffff";
            this.par=null;
            if(nodeName ==CAR_PART){
                this.drawColor="#ff0000";
                this.width =88;
                this.height=125;
                this.x =400+this.width/2;
                this.y=300+this.height/2;
               // this.startPositionTransform.translate(-this.width/2,-this.height/2);
               // this.startPositionTransform.translate(400+this.width/2,300+this.height/2);
               // console.log(this.objectTransform.getScaleX());
                this.maxWidth=200;
                this.maxHeight=150;
                this.minWidth=25;
                this.minHeight=50;
                this.originX=-this.width/2;
                this.originY=-this.height/2;
            }
            else if(nodeName ==FRONT_AXLE_PART){
                this.width =88;
                this.height=125;
               // this.startPositionTransform.translate(this.width/2,this.height/2);
                this.maxWidth=200;
                this.maxHeight=150;
                this.minWidth=25;
                this.minHeight=-1;
                this.minRotation=-1;
                this.maxRotation=-1;
                
            }
            if(nodeName ==BACK_AXLE_PART){

                
            }
            
        },

        addChild: function(graphNode) {
            this.children[graphNode.nodeName] = graphNode;
            graphNode.par=this;
        },

        /**
         * Swaps a graph node with a new graph node.
         * @param nodeName The name of the graph node
         * @param newNode The new graph node
         */
        replaceGraphNode: function(nodeName, newNode) {
            if (nodeName in this.children) {
                this.children[nodeName] = newNode;
            } else {
                _.each(
                    _.values(this.children),
                    function(child) {
                        child.replaceGraphNode(nodeName, newNode);
                    }
                );
            }
        },

        /**
         * Render this node using the graphics context provided.
         * Prior to doing any painting, the start_position_transform must be
         * applied, so the component can render itself in its local, object-centric
         * coordinate system. See the assignment specs for more details.
         *
         * This method should also call each child's render method.
         * @param context
         */
        render: function(context) {
            context.save();
            // TODO: Should be overridden by subclass

            _.each(this.children, function(child) {
              //  this.objectTransform.copyFrom(child.objectTransform);
                child.render(context);
               // child.objectTransform=copyFrom(c);
            });
            context.restore();
        },

        /**
         * Determines whether a point lies within this object. Be sure the point is
         * transformed correctly prior to performing the hit test.
         */
        pointInObject: function(point) {
            // TODO: There are ways to handle this query here, but you may find it easier to handle in subclasses
            console.log("THIS SHOULD NOT OCCUR");
        }
    });

    var CarNode = function() {
        this.initGraphNode(new AffineTransform(), CAR_PART)
    };

    _.extend(CarNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            // TODO
            var leftOffset=this.width/5;
            var topOffset=this.height/10;
            var lightOffset=20;
            var lightSize=(this.width+this.height/4)/lightOffset;
            var c=this.startPositionTransform.clone();

            context.save();
            context.lineWidth=3;
            c.concatenate(this.objectTransform);
            context.transform(c.m00_, c.m10_, c.m01_, c.m11_, c.m02_, c.m12_);
           // context.rotate(this.rot,this.originX,this.originY);


            

            _.each(this.children, function(child) {
                context.save();
                child.render(context);
                context.restore();
            });
            //draw car chassis
            context.fillStyle=this.drawColor;
            context.strokeStyle="black"
            context.fillRect(-this.width/2,-this.height/2,this.width,this.height);
            context.strokeRect(-this.width/2,-this.height/2,this.width,this.height);
            //context.strokeRect(-2,-2,4,4);


            //draw car back window
            context.fillStyle="white";
            context.strokeStyle="black"
            context.fillRect(-this.width/2.5,-this.height/3,2*(this.width/2.5),this.height-(this.height/1.3));
            context.strokeRect(-this.width/2.5,-this.height/3,2*(this.width/2.5),this.height-(this.height/1.3));
            //draw front window

            context.fillRect(-this.width/2.5,this.height/10,2*(this.width/2.5),this.height-(this.height/1.3));
            context.strokeRect(-this.width/2.5,this.height/10,2*(this.width/2.5),this.height-(this.height/1.3));
            //draw left headlight
            context.save();

            context.fillStyle="black";
            context.translate(-this.width/2+leftOffset,this.height/2 - lightSize/2);
            context.scale(1.5, 1);
            
            context.beginPath();
            context.arc(0,0,lightSize,0,2*Math.PI);
            context.fill();

            context.restore();

             //draw right headlight
            context.save();
            context.fillStyle="black";
            context.translate(this.width/2-leftOffset,this.height/2 - lightSize/2);
            context.scale(1.5, 1);
            context.beginPath();
            context.arc(0,0,lightSize,0,2*Math.PI);
            context.fill();
            context.restore();
            context.restore();

        },

        // Overrides parent method
        pointInObject: function(point) {
            // TODO
            var retVal=false;
            var c=this.startPositionTransform.clone();
            c.concatenate(this.objectTransform);
            //console.log(c.getTranslateX());
            c.copyFrom(c.createInverse());

            var myPoint=[point.x,point.y];
            var transformPoint=[];
            c.transform(myPoint,0,transformPoint,0,2);

           // console.log(transformPoint[0],transformPoint[1]);
            if(transformPoint[0]>=-this.width/2&&transformPoint[0]<=this.width/2&&transformPoint[1]>=-this.height/2&&transformPoint[1]<=this.height/2){
                //Front Bumper
                if(transformPoint[1]<=(-this.height/2)+8){
                   // console.log("FRONT_BUMPER");
                    this.prevHit=BACK_BUMPER;
                }
                else if(transformPoint[1]>=this.height/2-8){
                    //console.log("BACK_BUMPER");
                    this.prevHit=FRONT_BUMPER;
                }
                else if(transformPoint[0]<=(-this.width/2)+8){
                   // console.log("CAR_LEFT");
                    this.prevHit=CAR_LEFT;
                }
                else if(transformPoint[0]>=(this.width/2)-8){
                   // console.log("CAR_RIGHT");
                    this.prevHit=CAR_RIGHT;
                }
                else{
                    //console.log("CAR_PART");
                    this.prevHit=CAR_PART;
                }
                retVal=true;
            }
            else{
                var myThis=this;
            _.each(this.children, function(child){
                var hit=child.pointInObject(point);
                if(hit==true){
                    myThis.prevHit=child.prevHit;
                    retVal=true;
                }
            });
            }
            return retVal;
        }
    });

    /**
     * @param axlePartName Which axle this node represents
     * @constructor
     */
    var AxleNode = function(axlePartName) {
        this.initGraphNode(new AffineTransform(), axlePartName);
        // TODO
        this.parWidth;
    };

    _.extend(AxleNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
           
            var leftOffset=this.width/5;
            var topOffset=this.height/10;
            var lightOffset=20;
            var lightSize=(this.width+this.height/4)/lightOffset;
            var c=this.startPositionTransform.clone();

            context.save();
            context.lineWidth=3;
            c.concatenate(this.objectTransform);
            context.transform(c.m00_, c.m10_, c.m01_, c.m11_, c.m02_, c.m12_);
           // context.rotate(this.rot,this.originX,this.originY);


            //draw car chassis
            context.fillStyle=this.drawColor;
            context.strokeStyle="black"
            context.fillRect(-this.parWidth-this.width,-this.height/2,this.width,this.height);
            context.fillRect(0,-this.height/2,this.width,this.height);

          //  context.strokeRect(-this.width/2,-this.height/2,this.width,this.height);
          //  context.strokeRect(-2,-2,4,4);



            _.each(this.children, function(child) {
                context.save();
                child.render(context);
                context.restore();
            });
            
            context.restore();
        },

        // Overrides parent method
        pointInObject: function(point) {
            // User can't select axles
            return false;
        }
    });

    /**
     * @param tirePartName Which tire this node represents
     * @constructor
     */
    var TireNode = function(tirePartName) {
        this.initGraphNode(new AffineTransform(), tirePartName);
        // TODO
    };

    _.extend(TireNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            // TODO
            //draw car chassis
            var c=this.startPositionTransform.clone();

            context.save();

            c.concatenate(this.objectTransform);
            context.transform(c.m00_, c.m10_, c.m01_, c.m11_, c.m02_, c.m12_);
            context.fillStyle="black";
            context.fillRect(-this.width/2,-this.height/2,this.width,this.height);
            
            //context.strokeRect(-this.width/2,-this.height/2,this.width,this.height);
           context.restore();
        },

        // Overrides parent method
        pointInObject: function(point) {
            // TODO
            var retVal=false;
            var c=this.startPositionTransform.clone();
            c.concatenate(this.objectTransform);
            //console.log(c.getTranslateX());
            var x = this.par;
            while(x!=null){
                var d = x.startPositionTransform.clone().concatenate(x.objectTransform);
                d.concatenate(c);
                c.copyFrom(d);

                x=x.par;
               // console.log(x);
            }
            c.copyFrom(c.createInverse());

            var myPoint=[point.x,point.y];
            var transformPoint=[];
            c.transform(myPoint,0,transformPoint,0,2);

           // console.log(transformPoint[0],transformPoint[1]);
            if(transformPoint[0]>=-this.width/2&&transformPoint[0]<=this.width/2&&transformPoint[1]>=-this.height/2&&transformPoint[1]<=this.height/2){
               // console.log("TIRE");
                retVal=true;
            }
            else{
                var myThis=this;
            _.each(this.children, function(child){
                var hit=child.pointInObject(point);
                if(hit==true){
                    myThis.prevHit=child.prevHit;
                    retVal=true;
                }
            });
            }
            return retVal;
        }
    });

    // Return an object containing all of our classes and constants
    return {
        GraphNode: GraphNode,
        CarNode: CarNode,
        AxleNode: AxleNode,
        TireNode: TireNode,
        CAR_PART: CAR_PART,
        FRONT_AXLE_PART: FRONT_AXLE_PART,
        BACK_AXLE_PART: BACK_AXLE_PART,
        FRONT_LEFT_TIRE_PART: FRONT_LEFT_TIRE_PART,
        FRONT_RIGHT_TIRE_PART: FRONT_RIGHT_TIRE_PART,
        BACK_LEFT_TIRE_PART: BACK_LEFT_TIRE_PART,
        BACK_RIGHT_TIRE_PART: BACK_RIGHT_TIRE_PART,
        FRONT_BUMPER:FRONT_BUMPER,
        BACK_BUMPER : BACK_BUMPER,
        CAR_LEFT : CAR_LEFT,
        CAR_RIGHT: CAR_RIGHT
    };
}