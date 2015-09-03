'use strict';
var friends={};
var sups=[];
var sendBuffer={};
var curSup=0;
var server ='http://localhost:8080/post';
var protocol=1.2;
window.addEventListener('load', function() {
    // Place your Wassup app code here
    

    console.log("Wassup?");
    var canvas = document.getElementsByClassName('canvas')[0];
    var canvasDiv=document.getElementsByClassName('centered-canvas2')[0];
    var addFriend=document.getElementById("add_friend");
    var addFriendButton=document.getElementById("friend_list_btn");
    var friend = document.getElementsByClassName('form-control')[0];
    var supText = document.getElementsByClassName('curSup user')[0];
    var context = canvas.getContext('2d');
    var pub=document.getElementById("public_btn");
    var priv=document.getElementById("private_btn");
 var send=document.getElementById("send");
    var prev = document.getElementById("prev");
    var next = document.getElementById("next");
    var remove= document.getElementById("remove");

    var list = document.getElementById("friends_list");

    var timetext= document.getElementById("timestamp");
    var usertext= document.getElementById("user");

    canvas.width=canvasDiv.offsetWidth*0.9;

    //canvas.style.boxShadow="0px 0px 20px #ff0000;"
    canvas.height=canvasDiv.offsetWidth*0.9;


    addFriend.addEventListener('click',function(){
        addFriend.innerHTML="Adding Friend...";
        var toAdd=friend.value;
        var commandData={user_id:toAdd};
        handleAjaxRequest("add_friend",commandData);

    });
    addFriendButton.addEventListener("click",function(){
        sendBuffer={};
        for(var i=0;i<list.childNodes.length;i++){
            if(list.childNodes[i].className=="list-border"){
                list.childNodes[i].style.background="";
            }
        }


    })
    pub.addEventListener('click',function(){
        server="http://104.197.3.113/post";
        clearData();
        var cd={user_id:document.cookie.split("=")[1],full_name:document.cookie.split("=")[1]};
        handleAjaxRequest('create_user',cd);
        handleAjaxRequest('get_friends',null);
        handleAjaxRequest('get_sups',null);
    });
   //load friends for first time
   priv.addEventListener('click',function(){
        server="http://localhost:8080/post";
        clearData();
        handleAjaxRequest('get_friends',null);
        handleAjaxRequest('get_sups',null);
    });
   


   next.addEventListener('click',function(){
        curSup++;
        if(curSup>sups.length-1){
            curSup=0;
        }
        if(sups.length>0){
            supText.innerHTML=curSup+1 + "/" + sups.length;
            drawSup(curSup);
        }
        else{
            supText.innerHTML="-/-"

            curSup=0;
        }
    });

   prev.addEventListener('click',function(){
        curSup--;

        if(curSup<0){
            curSup=sups.length-1;

        }
        if(sups.length>0){
            supText.innerHTML=curSup+1 + "/" + sups.length;
            drawSup(curSup);
        }
        else{
            supText.innerHTML="-/-"

            curSup=0;
        }
         
    });

    remove.addEventListener('click',function(){
    if(sups.length>0){
        var commandData={sup_id:sups[curSup].sup_id}
        handleAjaxRequest("remove_sup",commandData);
        var numMess=document.getElementsByClassName("message-num")[0];
        numMess.innerHTML= parseInt(numMess.innerHTML)-1;
        sups.splice(curSup,1);
        if(curSup>0){
            curSup--;
        }

        if(sups.length>0){
            drawSup(curSup);
            supText.innerHTML=curSup+1 + "/" + sups.length;

        }
        else{
            timetext.innerHTML="";
            usertext.innerHTML="";
            supText.innerHTML="-/-"

            context.clearRect(0,0,canvas.width,canvas.height);
            

        }

    }
   });

    send.addEventListener('click',function(event){
        send.childNodes[0].blur();
        _.each(sendBuffer, function(obj) {
            var supId=generateUUID();
            var iTime=new Date();
            var hours=iTime.getHours();
            var night="AM";
            if(hours>=12){
                
                hours-=12;
            
                night="PM";
            }

            if(hours==0){
                hours=12;
            }
            console.log(hours);

            var mins=iTime.getMinutes();
            if(mins<10){
                mins = "0"+mins;
            }
            var date = prettyDate(iTime);
            obj.date=date +  " at " +
            hours+":"+mins+ " " +  night;

            obj.sup_id=supId;
            handleAjaxRequest('send_sup',obj);
        });
        
        event.stopPropagation();

    });

   //Start pinging for sups

    window.setInterval(function(){
        handleAjaxRequest('get_sups',null);
    }, 6000);

   handleAjaxRequest('get_friends',null);
   handleAjaxRequest('get_sups',null);
   if(sups.length==0){
    drawLoading();
   }

});

function prettyDate(date){
    var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ret= dayNames[date.getDay()] + ", " + monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    return ret;


}
function clearData(){
    var canvas = document.getElementsByClassName('canvas')[0];
    var context = canvas.getContext('2d'); 

    var supText = document.getElementsByClassName('curSup user')[0];
    var timetext= document.getElementById("timestamp");
    var usertext= document.getElementById("user");
    timetext.innerHTML="";
    usertext.innerHTML="";
    var list = document.getElementById("friends_list");
    var numMess=document.getElementsByClassName("message-num")[0];
    var children = list.childNodes;
    var rem=children.length-1;
    numMess.innerHTML="?";
    for(var i=rem;i>=0;i--){

         list.removeChild(children[i]);
         
    }
    supText.innerHTML="-/-";

    context.clearRect(0,0,canvas.width,canvas.height);
    friends={};
    sendBuffer={};
    sups=[];
    curSup=0;
    drawLoading();

}
function updateFriendsList(reply){
    var list = document.getElementById("friends_list");
    var elem = document.getElementById("friend_element");
    var end = document.getElementById("list_end");
    _.each(reply, function(obj) {
        if(!(obj.user_id in friends)){

            friends[obj.user_id]=obj.full_name;
            var li=document.createElement("li");
            var a = document.createElement("a");
            var button = document.createElement("button");
            var span=document.createElement("span");
            span.className="glyphicon glyphicon glyphicon-remove icon ";
            span.ariaHidden="true";
            button.className="list-button ";
            a.href="#";
            a.innerHTML=obj.user_id;
            a.className="list-a";
            
            li.className="list-border";
            li.appendChild(a);
            list.appendChild(li);
            li.appendChild(button);
            button.appendChild(span);
            var clicked=false;
            li.addEventListener('click',function(event){
                
                if(event.target==button||event.target==span){
                    var commandData={user_id:obj.user_id};
                    li.parentElement.removeChild(li);
                    delete friends[obj.user_id];
                     delete sendBuffer[obj.user_id];
                    handleAjaxRequest('remove_friend',commandData);
                    event.stopPropagation();
                }
                else if(event.target==a||event.target==li){
                    
                    clicked=!clicked;
                    if(!sendBuffer[obj.user_id]){
                    var commandData={user_id:obj.user_id,sup_id:null,date:null};
                        li.style.background="#bcbcd0";
                        
                        
                        sendBuffer[obj.user_id]=commandData;
                        //handleAjaxRequest('send_sup',commandData);
                    }
                    else{
                        li.style.background="";
                        delete sendBuffer[obj.user_id];
                    }
                    
                    event.stopPropagation();
                }
                else{
                    event.stopPropagation();
                }
            });
        }
   });
}
function drawSup(index){
    var canvas = document.getElementsByClassName('canvas')[0];
    var canvasDiv=document.getElementsByClassName('centered-canvas2')[0];
    var context = canvas.getContext('2d');
    var timetext= document.getElementById("timestamp");
    var usertext= document.getElementById("user");  
    var draw = sups[index];
    var date = draw.date;
    var newDate=Date(draw.date);
        usertext.innerHTML="- from "+draw.sender_id;
        timetext.innerHTML=draw.date;
    var width = Math.random()*canvas.width;
    context.save();
    context.clearRect(0,0,canvas.width,canvas.height);
        context.fillStyle=draw.bg;
        context.fillRect(0,0,canvas.width,canvas.height);

        context.font ="bold " + (Math.max((canvas.width/2)*draw.s,50)).toString() + "px Arial";
        context.fillStyle=draw.txt;
        var text="Sup!";

        context.textAlign="center";
        context.textBaseline = 'middle';
        context.strokeStyle="#563D7C";
        context.lineWidth = 3;
        var textWidth=context.measureText(text).width;
        var textHeight=context.measureText(text).height;
        context.translate((canvas.width/2),(canvas.height/2));
        context.rotate(draw.rot*(Math.PI/180));
        context.fillText(text, 0 ,0);
        context.strokeText(text, 0 ,0);

    context.restore();
}

function drawLoading(index){
    var canvas = document.getElementsByClassName('canvas')[0];
    var canvasDiv=document.getElementsByClassName('centered-canvas2')[0];
    var context = canvas.getContext('2d');
    var timetext= document.getElementById("timestamp");
    var usertext= document.getElementById("user");  

    var width = Math.random()*canvas.width;
    context.save();

        var txt=randomColor(1);
        var s=Math.random();
        var rot=Math.random()*90 - 45;

        context.font ="bold " + (Math.max((canvas.width/4)*s,50)).toString() + "px Arial";
        context.fillStyle=txt;
        var text="Loading...";

        context.textAlign="center";
        context.textBaseline = 'middle';
        context.strokeStyle="#563D7C";
        context.lineWidth = 3;
        var textWidth=context.measureText(text).width;
        var textHeight=context.measureText(text).height;
        context.translate((canvas.width/2),(canvas.height/2));
        context.rotate(rot*(Math.PI/180));
        context.fillText(text, 0 ,0);
        context.strokeText(text, 0 ,0);

    context.restore();
}
function updateSups(reply){
    var canvas = document.getElementsByClassName('canvas')[0];
    var canvasDiv=document.getElementsByClassName('centered-canvas2')[0];
    var supText = document.getElementsByClassName('curSup user')[0];
    var context = canvas.getContext('2d');

    var num=0;
    var wasEmpty=sups.length;
    var numMess=document.getElementsByClassName("message-num")[0];
    
    _.each(reply, function(obj) {
        if(!_.find(sups, function(obj2) { return obj.sup_id == obj2.sup_id  })){
        obj.bg=randomColor(0.4);
        obj.txt=randomColor(1);
        obj.s=Math.random();
        obj.rot=Math.random()*90 - 45;
        sups[sups.length]=obj;
        }
        num++;
        });


        if(num){
            supText.innerHTML=curSup+1 + "/" + sups.length;
            drawSup(curSup);
        }
        else{
            supText.innerHTML= "-/-";
            context.clearRect(0,0,canvas.width,canvas.height);
        }
        
    numMess.innerHTML=num;
}

//Code Snippet obtained from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/8809472#8809472
//Generates unique message ID
function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};


//Returns an rgba(r,g,b,alpha) given alpha
function randomColor(alpha){
    var r = Math.random()*225+30;
    var g = Math.random()*225+30;
    var b = Math.random()*225+30;
    return "rgba(" + Math.ceil(r) +"," + Math.ceil(g) + "," + Math.ceil(b) + "," + alpha +" )";
}
// Example derived from: https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started
function handleAjaxRequest(command,commandData) {
    var user=document.cookie.split("=")[1];
    
    // Create the request object
    var httpRequest = new XMLHttpRequest();

    // Set the function to call when the state changes
    httpRequest.addEventListener('readystatechange', function() {

        // These readyState 4 means the call is complete, and status
        // 200 means we got an OK response from the server
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            // Parse the response text as a JSON object
            var responseObj = JSON.parse(httpRequest.responseText);

            // TODO: Actually do something with the data returned
           // console.log(responseObj);
            var userExist;
            if(responseObj.command=="user_exists"){
                if(responseObj.reply_data.exists){
                    var objectAddFriend={};
                    objectAddFriend.command=command;
                    objectAddFriend.command_data=commandData;
                    objectAddFriend.protocol_version=protocol;
                    objectAddFriend.user_id=user;
                    objectAddFriend.message_id=null;
                    httpRequest.open('POST', server);
                    httpRequest.setRequestHeader('Content-Type', 'application/json');
                    httpRequest.send(JSON.stringify(objectAddFriend));
                }
                else{
                    //tell user doesnt exist
                    var addFriend=document.getElementById("add_friend");
                    addFriend.innerHTML="Does Not Exist!";
                    setTimeout(function(){
                        addFriend.innerHTML="Add Friend";

                    },3000)
                }

            }
            else if(responseObj.command=="add_friend"||responseObj.command=="remove_friend"){
                //tell user added, or already exists
                if(responseObj.command=="add_friend"){
                var addFriend=document.getElementById("add_friend");
                    addFriend.innerHTML="Friend Added!";
                    setTimeout(function(){
                        addFriend.innerHTML="Add Friend";

                    },3000)
                }
                    var objectAddFriend={}; 
                    objectAddFriend.command="get_friends";
                    objectAddFriend.command_data=null;
                    objectAddFriend.protocol_version=protocol;
                    objectAddFriend.user_id=user;
                    objectAddFriend.message_id=null;
                    httpRequest.open('POST', server);
                    httpRequest.setRequestHeader('Content-Type', 'application/json');
                    httpRequest.send(JSON.stringify(objectAddFriend));
            }
            else if(responseObj.command=="get_friends"){

                updateFriendsList(responseObj.reply_data);
            }
            else if(responseObj.command=="get_sups"){
                updateSups(responseObj.reply_data);


            }
            else if(responseObj.command=="send_sup"){
                console.log("SE")
                var sendText=document.getElementById("sent-text");
                sendText.innerHTML="Sent!";

                setTimeout(function(){
                        sendText.innerHTML="";

                    },3000)
            }
        }
    });

    // This opens a POST connection with the server at the given URL
    httpRequest.open('POST', server);

    // Set the data type being sent as JSON
    httpRequest.setRequestHeader('Content-Type', 'application/json');

    // Send the JSON object, serialized as a string
    // TODO: You will need to actually send something and respond to it
    var objectToSend = {};
    objectToSend.user_id=user;
    objectToSend.protocol_version=protocol;
    objectToSend.command_data=commandData;
    objectToSend.message_id=null;
    objectToSend.command=command;
    if(command=="add_friend"){
        objectToSend.command="user_exists";
    }
    else if(command=="get_friends"){
        

    }
    else if(command=="remove_friend"){

    }
    httpRequest.send(JSON.stringify(objectToSend));
}
