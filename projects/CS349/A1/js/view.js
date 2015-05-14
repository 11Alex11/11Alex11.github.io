'use strict';
	function createClasses(io){
	var AbstractView = function() {

	};
	_.extend(AbstractView.prototype,{
		_instantiateInterface: function (templateId, attachToElement) {
	                var template = document.getElementById(templateId);
	                this.hostElement = document.createElement('div');
	                this.hostElement.innerHTML = template.innerHTML;
	                this.hostElement.id=templateId + "_div";
	                this.hostElement.className = this.hostElement.className + " user-interface";
	                attachToElement.appendChild(this.hostElement);
	                
	            }




	});
	//Creates the form to allow input
	var FormView = function(attachToElement,activityModel){

		this._instantiateInterface('form_input_template',attachToElement);
		var submitButton=document.getElementById('submit');
		var removeButton=document.getElementById('remove');
		var errorText=this.hostElement.getElementsByClassName('error-text text-style')[0];
		var activityInput=document.getElementById('activity');
    	var energyInput=document.getElementById('energy');
    	var stressInput=document.getElementById('stress');
    	var happyInput=document.getElementById('happy');
    	var timeInput=document.getElementById('time');
    	removeButton.addEventListener('click',function(){
    		errorText.innerHTML="";
			var act=activityInput.options[activityInput.selectedIndex].value;
	        var en=parseInt(energyInput.value);
	        var st=parseInt(stressInput.value);
	        var ha=parseInt(happyInput.value);
	        var mi=parseInt(timeInput.value);
	        //check if data is what we want to store
	        if(!isNaN(en)&&en>=1&&en<=5&&!isNaN(st)&&st>=1&&st<=5
	        	&&!isNaN(ha)&&ha>=1&&ha<=5
                &&!isNaN(mi)&&mi>0){

	            var activityDataPoint = new ActivityData(
	               act,
	                {
	                    energyLevel: en,
	                    stressLevel: st,
	                    happinessLevel: ha
	                },
	                mi
	            );

	       		 activityModel.removeActivityDataPoint(activityDataPoint);
	   	 	}
	   	 	else{

	   	 		errorText.innerHTML="Error: Please check input fields";
	   	 	}
	   	 });

		submitButton.addEventListener('click',function(){
			errorText.innerHTML="";
			var act=activityInput.options[activityInput.selectedIndex].value;
	        var en=parseInt(energyInput.value);
	        var st=parseInt(stressInput.value);
	        var ha=parseInt(happyInput.value);
	        var mi=parseInt(timeInput.value);
	        if(!isNaN(en)&&en>=1&&en<=5&&!isNaN(st)&&st>=1&&st<=5
	        	&&!isNaN(ha)&&ha>=1&&ha<=5
                &&!isNaN(mi)&&mi>0){

	            var activityDataPoint = new ActivityData(
	               act,
	                {
	                    energyLevel: en,
	                    stressLevel: st,
	                    happinessLevel: ha
	                },
	                mi
	            );

	       		 activityModel.addActivityDataPoint(activityDataPoint);
	   	 	}
	   	 	else{

	   	 		errorText.innerHTML="Error: Please check input fields";
	   	 	}
   		});
	};
	_.extend(FormView.prototype, AbstractView.prototype);
	//Creates the view for viewing the last time data was submitted
	var TimeTextView = function(attachToElement,activityModel){
		this._instantiateInterface('time_text_template',attachToElement);
		time_output.innerHTML = "Last Data Entry: " + activityModel.lastDate;

		var timeText=document.getElementById('time_output');


		var timeAddListener = function(eventType, eventTime, activityData){
			if(eventType=="ACTIVITY_DATA_ADDED_EVENT"){
        		time_output.innerHTML = "Last Data Entry: " + eventTime;
        	}
        	else if(eventType=="ACTIVITY_DATA_REMOVED_EVENT"){

        	}
		};
		activityModel.addListener(timeAddListener);
	};
	_.extend(TimeTextView.prototype, AbstractView.prototype);
	//create the View for all the analysis functions
	var AnalysisView = function(attachToElement,activityModel,graphModel){
		this._instantiateInterface('analysis_template',attachToElement);
		var tableRadio = this.hostElement.getElementsByClassName('view_radio')[0];
		var scatterRadio = this.hostElement.getElementsByClassName('graph_radio')[0];
		var listRadio = this.hostElement.getElementsByClassName('list_radio')[0];
		var canvas = this.hostElement.getElementsByClassName('canvas')[0];
		var x = this._instantiateInterface;
		tableRadio.addEventListener('click',function(){
			if(graphModel.getAvailableGraphNames().length==0||graphModel.getNameOfCurrentlySelectedGraph()!="table"){
				graphModel.selectGraph("table");
				var table = new TableView(attachToElement,activityModel,graphModel);
			}

		});
		scatterRadio.addEventListener('click',function(){
			if(graphModel.getNameOfCurrentlySelectedGraph()!="bar"){
				graphModel.selectGraph("bar");
				var graph = new GraphView(attachToElement,activityModel,graphModel);
			}

			
		});
		listRadio.addEventListener('click',function(){
			if(graphModel.getNameOfCurrentlySelectedGraph()!="list"){
				graphModel.selectGraph("list");
				var list = new ListView(attachToElement,activityModel,graphModel);
			}

			
		});
		tableRadio.click();
	}
	_.extend(AnalysisView.prototype, AbstractView.prototype);
	//creates a bar graph representing percentages
	var GraphView = function(attachToElement,activityModel,graphModel){
		this._instantiateInterface('graph_template',attachToElement);
		var canvas = document.getElementById('canvas_demo');
		var large=document.getElementById('large');
		var small=document.getElementById('small');
	    var context = canvas.getContext('2d');
	    var tableSize=6;
	    var tableData=[];
	    var barColor='#FFA500';
	    var highlightColor = '#E12B2B';
	    var high=false;
	    var lowlightColor= '#7DFC7D';
	    var low=false;
	    var getData = activityModel.getActivityDataPoints();
		for(var i =0;i<tableSize;i++){
			tableData.push(0);
		}
		for(var i =0;i<getData.length;i++){
			updateTime(tableData,getData[i]);
		}
		var totalTime=0;
		for(var i =0;i<tableSize;i++){
			totalTime+=tableData[i];
		}
		if(totalTime!=0){
			for(var i =0;i<tableSize;i++){
				tableData[i]/=totalTime;
			}
		}
	    small.addEventListener('click',function(){
	    	if(small.checked==true){
	    		low=true;
	    	}
	    	else{
	    		low=false;

	    	}
	    	drawCanvas();
	    });
	    large.addEventListener('click',function(){
	    	if(large.checked==true){
	    		high=true;
	    	}
	    	else{
	    		high=false;

	    	}
	    	drawCanvas();
	    });
	    canvas.width=500;
	    canvas.height=400;
	    var width = canvas.width;
	    var height = canvas.height;

	    function drawCanvas(){
		    context.fillStyle = '#394d5d';

		    context.fillRect(0, 0, width, height);

		    context.fillStyle = barColor;
		    //
		    var barWidth = 60;
		    var x=20;
		    
		    var highest=tableData.indexOf(Math.max.apply(Math, tableData));
		    var lowest = tableData.indexOf(Math.min.apply(Math, tableData));

		    for(var i =0;i<tableSize;i++){
		    	if(high==true&&(i==highest||tableData[highest]==tableData[i])){
		    		context.fillStyle=highlightColor;
		    	}
		    	else if(low==true&&(i==lowest||tableData[lowest]==tableData[i])){
		    		context.fillStyle=lowlightColor;
		    	}
		    	context.fillRect(x, height -(height*tableData[i]), barWidth, height*tableData[i]);
		    	x+=(20+barWidth);
		    	context.fillStyle=barColor;
		    }
	    }
	    

	    var graphListener=function (eventType,eventTime,eventData){
			if(eventData!="bar"){
				graphModel.removeListener(graphListener);
				var ui=document.getElementById("graph_template_div");
			    
		    	ui.parentNode.removeChild(ui);
			}
		}

		
		graphModel.addListener(graphListener)
		drawCanvas();

	}
	_.extend(GraphView.prototype, AbstractView.prototype);
	//creates the view for viewing the data in a table
	var TableView = function(attachToElement,activityModel,graphModel){
		this._instantiateInterface('table_template',attachToElement);
		var tableSize=6;
		var tableData=[];
		for(var i =0;i<tableSize;i++){
			tableData.push(0);
		}
		var codeTime= this.hostElement.getElementsByClassName('code_time')[0];
		var eatTime= this.hostElement.getElementsByClassName('eat_time')[0];
		var sportsTime= this.hostElement.getElementsByClassName('sports_time')[0];
		var studyTime= this.hostElement.getElementsByClassName('study_time')[0];
		var lectureTime= this.hostElement.getElementsByClassName('lecture_time')[0];
		var tvTime= this.hostElement.getElementsByClassName('tv_time')[0];
		var getData = activityModel.getActivityDataPoints();
		for(var i =0;i<getData.length;i++){
			updateTime(tableData,getData[i]);
		}
		function updateTable(codeTime,eatTime,sportsTime,studyTime,lectureTime,tvTime,tableData){
			codeTime.innerHTML=tableData[0];
			eatTime.innerHTML=tableData[1];
			sportsTime.innerHTML=tableData[2];
			studyTime.innerHTML=tableData[3];
			lectureTime.innerHTML=tableData[4];
			tvTime.innerHTML=tableData[5];
		}
		var tableListener=function (eventType,eventTime,eventData){
			if(eventData!="table"){
				graphModel.removeListener(tableListener);
				var ui=document.getElementById("table_template_div");
			    
		    	ui.parentNode.removeChild(ui);
			}
		}

		graphModel.addListener(tableListener)
		activityModel.addListener(function(eventType,eventTime,activityData){
			updateTime(activityData);
		});
		updateTable(codeTime,eatTime,sportsTime,studyTime,lectureTime,tvTime,tableData);

	}
	_.extend(TableView.prototype, AbstractView.prototype);
	//creates the view for viewing the data in a list
	var ListView = function(attachToElement,activityModel,graphModel){
		this._instantiateInterface('list_template',attachToElement);
		var getData = activityModel.getActivityDataPoints();
		var table=this.hostElement.getElementsByClassName("list_view")[0];

		var numRows=table.rows.length;
		for(var i =0;i<getData.length;i++){

			var row= table.insertRow(numRows);
			numRows++;
			var data = [getActivityName(getData[i].activityType),getData[i].activityDataDict.energyLevel,
			getData[i].activityDataDict.stressLevel,getData[i].activityDataDict.happinessLevel,
			getData[i].activityDurationInMinutes];
			for(var j =0;j<5;j++){
				var cell=row.insertCell(j);
				cell.style.width='100px'
				cell.innerHTML=data[j];
				table
			}
		}
		var listListener=function (eventType,eventTime,eventData){
			if(eventData!="list"){
				graphModel.removeListener(listListener);
				var ui=document.getElementById("list_template_div");
			    
		    	ui.parentNode.removeChild(ui);
			}
		}

		graphModel.addListener(listListener)
	}
	_.extend(ListView.prototype, AbstractView.prototype);
	//maps returned values to something more readable
	function getActivityName(activityValue){
		switch (activityValue) {
	        case "code":
	            return "Writing Code";
	        case "eat":
	            return "Eating Dinner";
	        case "sports":
	             return "Playing Sports";
	        case "study":
	            return "Studying for Exams";
	        case "lecture":
	            return "Attending Lectures";
	        case "tv":
	             return "Watching TV";
	    return "ERROR";
		}
	}
	
	//updates activity times
	function updateTime(array,activity){
		var time = activity.activityDurationInMinutes;
		switch (activity.activityType) {
	        case "code":
	            array[0]+=time; 
	            break;
	        case "eat":
	            array[1]+=time;
	            break; 
	        case "sports":
	            array[2]+=time; 
	            break;
	        case "study":
	            array[3]+=time; 
	            break;
	        case "lecture":
	            array[4]+=time; 
	            break;
	        case "tv":
	            array[5]+=time; 
	            break;
	    }   
	}

		return{
			FormView:FormView,
			TimeTextView:TimeTextView,
			AnalysisView:AnalysisView
		};

}
	
// Put your view code here (e.g., the graph renderering code)




