'use strict';
var LEFT = "LEFT";
var RIGHT = "RIGHT";
window.addEventListener('load',function(){
	var header = $('.navigation-bar');
	var headerWait=false;
	$('body').toggleClass('loaded');
	$('logo').toggleClass('logo');
	var logo = document.getElementsByClassName("logo")[0];
	var rotate = 0;
	var content = $("information-wrapper");

	var navTotal = header[0].children.length;
	var curIndex=0;
	var index=curIndex;

	/*Each button is given an href and this will determine what button is clicked and open the href*/
	/*Need to change to xml request*/
	header[0].addEventListener("click",function(event){
		if(headerWait==false){
			var index = getIndex(event.target);
			console.log(index);
			if(index>curIndex){
				nextPage(LEFT);
			}
			else if(index < curIndex){
				nextPage(RIGHT);
			}
			curIndex=index;
		}
	});








	nextPage(LEFT);
	function getIndex(node){
		var index=0;
		while((node=node.previousElementSibling)!=null){
			index++;
		}
		return index;
	}
	function nextPage(dir){
		headerWait = true;
		if(dir==LEFT){
			$(".information-wrapper").toggleClass("move-left");
		}
		else if(dir==RIGHT){
			$(".information-wrapper").toggleClass("move-right");
		}
		window.setTimeout(function(){
			$(".information-wrapper").toggleClass("move-left",false);
			$(".information-wrapper").toggleClass("move-right",false);

			headerWait=false;
		},1000);
	}
});