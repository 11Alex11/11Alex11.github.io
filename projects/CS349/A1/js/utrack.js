'use strict';
    
/*
Put any interaction code here
 */
function makeInputUI(classes,activityModel){
    var appDiv = document.getElementById('app_container');
    var FormTextView= new classes.FormView(appDiv,activityModel);
    var timeTextView= new classes.TimeTextView(appDiv,activityModel);
}
function makeAnalysisUI(classes,activityModel,graphModel){
    var appDiv = document.getElementById('app_container');
    var AnalysisView= new classes.AnalysisView(appDiv,activityModel,graphModel);

}

function clearUI(activityModel,graphModel){
    activityModel.listeners=[];
    graphModel.listeners=[];
    graphModel.graphNames=[];
    graphModel.currentGraph=[];
    var ui=document.getElementsByClassName("user-interface");
    while(ui.length>0){
        ui[0].parentNode.removeChild(ui[0]);
    }
}
window.addEventListener('load', function() {
    // You should wire up all of your event handling code here, as well as any
    // code that initiates calls to manipulate the DOM (as opposed to responding
    // to events)

    console.log("Hello world!");

    var activityModel = new ActivityStoreModel();
    var graphModel = new GraphModel();
    var classes=createClasses('input');

    // Canvas Demo Code. Can be removed, later
   /* var canvasButton = document.getElementById('run_canvas_demo_button');
    canvasButton.addEventListener('click', function() {
        runCanvasDemo();
    });*/


    var inputButton = document.getElementById('run_input');
    var analysisButton = document.getElementById('run_analysis');
    var inputDiv = document.getElementById('input_div');
    var analysisDiv = document.getElementById('analysis_div');

    inputButton.addEventListener('click',function(){
        inputButton.style.border = "solid #4be300 3px";
        analysisButton.style.border = "solid #f7e9d5 3px";
        clearUI(activityModel,graphModel);
        makeInputUI(classes,activityModel);
    });
    analysisButton.addEventListener('click',function(){
        inputButton.style.border = "solid #f7e9d5 3px";
        analysisButton.style.border = "solid #4be300 3px";
        clearUI(activityModel,graphModel);
        makeAnalysisUI(classes,activityModel,graphModel);
    });
    makeInputUI(classes,activityModel);
});


/**
 * This function can live outside the window load event handler, because it is
 * only called in response to a button click event
 */
function runCanvasDemo() {
    /*
    Useful references:
     http://www.w3schools.com/html/html5_canvas.asp
     http://www.w3schools.com/tags/ref_canvas.asp
     */
    var canvas = document.getElementById('canvas_demo');
    var context = canvas.getContext('2d');

    var width = canvas.width;
    var height = canvas.height;

    console.log("Painting on canvas at: " + new Date());
    console.log("Canvas size: " + width + "X" + height);

    context.fillStyle = 'grey';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'red';
    context.moveTo(0, 0);
    context.lineTo(width, height);
    context.stroke();
}
