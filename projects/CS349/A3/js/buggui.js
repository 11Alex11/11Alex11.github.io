'use strict';

// This should be your main point of entry for your app

window.addEventListener('load', function() {
    var sceneGraphModule = createSceneGraphModule();
    var root = new sceneGraphModule.GraphNode();
    root.initGraphNode(new AffineTransform(),"ROOT");
    var body = new sceneGraphModule.CarNode();
    var flTire = new sceneGraphModule.TireNode(sceneGraphModule.FRONT_LEFT_TIRE_PART);
    var frTire = new sceneGraphModule.TireNode(sceneGraphModule.FRONT_RIGHT_TIRE_PART);
    var blTire = new sceneGraphModule.TireNode(sceneGraphModule.BACK_LEFT_TIRE_PART);
    var brTire = new sceneGraphModule.TireNode(sceneGraphModule.BACK_RIGHT_TIRE_PART);
    var fAxle = new sceneGraphModule.AxleNode(sceneGraphModule.FRONT_AXLE_PART);
    var bAxle = new sceneGraphModule.AxleNode(sceneGraphModule.BACK_AXLE_PART);

    root.addChild(body);
    body.addChild(fAxle);
    body.addChild(bAxle);
    fAxle.addChild(flTire);
    fAxle.addChild(frTire);
    bAxle.addChild(brTire);
    bAxle.addChild(blTire);


    var appContainer = document.getElementById('app-container');
    var canvas = document.getElementsByClassName('canvas')[0];
    var context = canvas.getContext('2d');
    canvas.width=800;
    canvas.height=600;
    var width=canvas.width;
    var height =canvas.height;


    //var gradient=context.createRadialGradient(width/2,height/2,5,width/2,height/2,1000);
    var gradient=context.createLinearGradient(0,0,width,0);
    gradient.addColorStop(0,"#1b1b1b");
    gradient.addColorStop(.5,"#2b2b2b");
        gradient.addColorStop(1,"#1b1b1b");


    body.width=fAxle.parWidth=bAxle.parWidth=88;
    body.height=125;

    flTire.width=frTire.width=blTire.width=brTire.width=20;
    flTire.height=frTire.height=blTire.height=brTire.height=30;

    fAxle.height=bAxle.height=8;
    fAxle.width=bAxle.width=0;

    body.objectTransform.translate(400,300);
    bAxle.startPositionTransform.translate(body.width/2,-body.height/3);
    fAxle.startPositionTransform.translate(body.width/2,body.height/3);
    flTire.startPositionTransform.translate( fAxle.width,0);
    frTire.startPositionTransform.translate(- fAxle.parWidth - fAxle.width,0);
    blTire.startPositionTransform.translate( fAxle.width,0);
    brTire.startPositionTransform.translate( - bAxle.parWidth- fAxle.width,0);
    var moveableParts=[];
    moveableParts.push(body,flTire,frTire,blTire,brTire);
    //console.log(root.objectTransform.getScaleX());

    
    var rotate = new Image();
    rotate.src="images/Rotate.jpg"
    var move = new Image();
    move.src="images/Move.jpg"
    var stretchX = new Image();
    stretchX.src="images/StretchX.jpg"
    var stretchY = new Image();
    stretchY.src="images/StretchY.jpg"
    var clicked=false;
    var dblClicked=false;
    var imageHit=null;
    var clickPoint=null;
    var prevMouse={x:0,y:0};
    function getPoint(canvas,event){
        var canvasRect=canvas.getBoundingClientRect();
        var point ={x:event.clientX-canvasRect.left,y:event.clientY-canvasRect.top};
        return point;
    }
    //Get part pointed to / clicked at the given point
    function getPart(point){
        var retVal=null;
        
        for(var i=0;i<moveableParts.length;i++){
                var x = moveableParts[i].pointInObject(point);
                if(x==true){
                    //console.log("OK");
                    if(moveableParts[i].nodeName==sceneGraphModule.CAR_PART){
                        retVal=moveableParts[i].prevHit;
                    }else{
                        retVal=moveableParts[i].nodeName;
                    }
                }
            }
        return retVal;
    }
    canvas.addEventListener('mousedown',function(event){
        clicked=true;
        clickPoint = getPoint(canvas,event);
        //console.log(point);

        imageHit=getPart(clickPoint);
       // console.log(hit);
        dblClicked=false;
    });
    canvas.addEventListener('mouseup',function(event){
        clicked=false;
        imageHit=null;

        
    });
    canvas.addEventListener('dblclick',function(event){
        dblClicked=true;
         imageHit=getPart(clickPoint);

    });

    canvas.addEventListener('mousemove',function(event){
        var point = getPoint(canvas,event);
        context.fillStyle = gradient;
        context.fillRect(0,0,width,height);
        //var mouseImage = root.pointInObject(point);
        //Draw mouseover if isnt imageHit 

            var mouseHit=getPart(point);
            if(mouseHit==sceneGraphModule.CAR_PART){
                if(!dblClicked){
                    context.drawImage(move,0,0);
                }
                else{
                    context.drawImage(rotate,0,0);
                }
            }
            else if(mouseHit==sceneGraphModule.FRONT_BUMPER||mouseHit==sceneGraphModule.BACK_BUMPER){
                context.drawImage(stretchY,0,0);
            }
            else if(mouseHit==sceneGraphModule.CAR_LEFT||mouseHit==sceneGraphModule.CAR_RIGHT||mouseHit==sceneGraphModule.FRONT_RIGHT_TIRE_PART
                ||mouseHit==sceneGraphModule.FRONT_LEFT_TIRE_PART||mouseHit==sceneGraphModule.BACK_RIGHT_TIRE_PART
                ||mouseHit==sceneGraphModule.BACK_LEFT_TIRE_PART){
                 context.drawImage(stretchX,0,0);

            
        }
        
        if(imageHit==sceneGraphModule.CAR_PART){
            if(dblClicked){
                context.drawImage(rotate,0,0);

                var c = body.objectTransform.clone()
                
                var getRelX=c.getTranslateX()-body.width/2;
                var getRelY=c.getTranslateY()-body.height/2;

                //var transformPoint=pointInverse(point,body);
              body.rot+= (point.x-prevMouse.x)/(8*Math.PI);
             // console.log(body.originX,body.originY);
                c.rotate((point.x-prevMouse.x)/(8*Math.PI),0,0);
                body.objectTransform.copyFrom(c);
            }
            else if(clicked){
               context.drawImage(move,0,0);

                var c = body.startPositionTransform.clone().concatenate(body.objectTransform);
                var getRelX=c.getTranslateX()-body.width/2;
                var getRelY=c.getTranslateY()-body.height/2;
                
                if(point.x-prevMouse.x+getRelX<0){
                    prevMouse.x=point.x;
                }
                if(point.x-prevMouse.x+getRelX>width-body.width){
                    prevMouse.x=point.x;
                }
                if(point.y-prevMouse.y+getRelY<0){
                    prevMouse.y=point.y;
                }
                if(point.y-prevMouse.y+getRelY>height-body.height){
                    prevMouse.y=point.y;
                }
                //var transformPoint=pointInverse(point,body);
                var translateX = (point.x-prevMouse.x);
                var translateY = (point.y-prevMouse.y);
                this.x+=(point.x-prevMouse.x);
                this.y+=(point.y-prevMouse.y);
               // console.log(point.x-prevMouse.x+getRelX,point.y-prevMouse.y+getRelY);

                body.objectTransform.rotate(-body.rot,0,0);
                body.objectTransform.translate(translateX,translateY);
                body.objectTransform.rotate(body.rot,0,0);
            }

        }
        else if(imageHit==sceneGraphModule.FRONT_BUMPER||imageHit==sceneGraphModule.BACK_BUMPER){
            if(clicked){
            context.drawImage(stretchY,0,0);
                
                body.height+=prevMouse.y-point.y;
                if(body.height<50){
                    body.height=50;
                }
                if(body.height>200){
                    body.height=200;
                }
            body.originY=body.height/2;
            bAxle.startPositionTransform.setToTranslation(body.width/2,-body.height/3);
            fAxle.startPositionTransform.setToTranslation(body.width/2,body.height/3);
            }
        }
        else if(imageHit==sceneGraphModule.CAR_LEFT||imageHit==sceneGraphModule.CAR_RIGHT){
            //console.log(prevMouse.x,point.x);
            if(clicked){
            context.drawImage(stretchX,0,0);

                var translated=prevMouse.x-point.x;
                body.width-=prevMouse.x-point.x;
                if(body.width<25){
                    body.width=25;
                    translated=prevMouse.x-body.width
                }
                if(body.width>150){
                    body.width=150;
                }
            body.originX=body.width/2;
            fAxle.parWidth=body.width;
             bAxle.parWidth=body.width;
            bAxle.startPositionTransform.setToTranslation(body.width/2,-body.height/3);
            fAxle.startPositionTransform.setToTranslation(body.width/2,body.height/3);
            flTire.startPositionTransform.setToTranslation(fAxle.width,0);
            frTire.startPositionTransform.setToTranslation( - fAxle.parWidth-fAxle.width,0);
            blTire.startPositionTransform.setToTranslation(fAxle.width,0);
            brTire.startPositionTransform.setToTranslation(- bAxle.parWidth-fAxle.width,0);
            }
        }
        else if(imageHit==sceneGraphModule.FRONT_LEFT_TIRE_PART||imageHit==sceneGraphModule.FRONT_RIGHT_TIRE_PART
            ||imageHit==sceneGraphModule.BACK_LEFT_TIRE_PART||imageHit==sceneGraphModule.BACK_RIGHT_TIRE_PART){
         //   context.drawImage(stretchX,0,0);
            //console.log(prevMouse.x,point.x);
            if(clicked){
            context.drawImage(stretchX,0,0);

                fAxle.width-=prevMouse.x-point.x;
                bAxle.width-=prevMouse.x-point.x;
                if(fAxle.width<0){
                    fAxle.width=0;
                    bAxle.width=0;
                }
                if(fAxle.width>75){
                    fAxle.width=75;
                    bAxle.width=75;
                }
                //fAxle.originX=body.width/2;
                flTire.startPositionTransform.setToTranslation(fAxle.width,0);
                frTire.startPositionTransform.setToTranslation(- fAxle.parWidth-fAxle.width,0);
                blTire.startPositionTransform.setToTranslation(fAxle.width,0);
                brTire.startPositionTransform.setToTranslation(- bAxle.parWidth-fAxle.width,0);
            }
                else if(dblClicked&&(imageHit==sceneGraphModule.FRONT_LEFT_TIRE_PART||imageHit==sceneGraphModule.FRONT_RIGHT_TIRE_PART)){
                   // console.log("DBL");
                context.drawImage(rotate,0,0);

                var c = flTire.objectTransform.clone()

              flTire.rot+= (point.x-prevMouse.x)/(8*Math.PI);
              frTire.rot+= (point.x-prevMouse.x)/(8*Math.PI);

              if(flTire.rot>45*(Math.PI/180)){
                flTire.rot=frTire.rot=blTire.rot=brTire.rot=45*(Math.PI/180);
                c.setToRotation(45*(Math.PI/180),0,0);

              }
              else if(flTire.rot<-45*(Math.PI/180)){


                flTire.rot=frTire.rot=blTire.rot=brTire.rot=-45*(Math.PI/180);
                c.setToRotation(-45*(Math.PI/180),0,0);
              }
              else{
              //console.log(body.originX,body.originY);
                c.rotate((point.x-prevMouse.x)/(8*Math.PI),0,0);
            }
                flTire.objectTransform.copyFrom(c);
                frTire.objectTransform.copyFrom(c);

            }
          //  console.log(fAxle.width);
            
        }
        prevMouse=point;
        root.render(context);

    });
    function pointInverse(point,node){
        if(point.x-(node.width/2)<0){
                    point.x=node.width/2;
                }
                if(point.x+(node.width/2)>width){
                    point.x=width-(node.width/2);
                }
                if(point.y-(node.height/2)<0){
                    point.y=node.height/2;
                }
                if(point.y+(node.height/2)>height){
                    point.y=height-(node.height/2);
            }
         var c=node.objectTransform.clone();
                    c.concatenate(node.startPositionTransform);
                    //console.log(c.getTranslateX());
                    c.copyFrom(c.createInverse()); 
                    var myPoint=[point.x,point.y];
                    var transformPoint=[];
                    c.transform(myPoint,0,transformPoint,0,2);
                    return transformPoint;
    }
    
   context.fillStyle = gradient;
    context.fillRect(0,0,width,height);
    root.render(context);
});