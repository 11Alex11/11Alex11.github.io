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
	$('.navigation-bar').delegate("button","click",function(event){
		var link = $(this).attr("href");
		if(headerWait==false){
			var index = getIndex(event.target);
			console.log(index);
			if(index>curIndex){
				nextPage(link,LEFT);
			}
			else if(index < curIndex){
				nextPage(link,RIGHT);
			}
			curIndex=index;
		}
	});








	//nextPage(LEFT);
	function getIndex(node){
		var index=0;
		while((node=node.previousElementSibling)!=null){
			index++;
		}
		return index;
	}
	function nextPage(href,dir){
		headerWait = true;
		console.log(dir);
		if(dir==LEFT){
			$(".information-wrapper").toggleClass("move-left");
		}
		else if(dir==RIGHT){
			$(".information-wrapper").toggleClass("move-right");
		}
		window.setTimeout(function(){
			$(".information-wrapper").toggleClass("paused");
			$('.information-wrapper').load(href + " #info-section",function(){
				$(".information-wrapper").toggleClass("paused",false);
				window.setTimeout(function(){
				headerWait=false;
							$(".information-wrapper").toggleClass("move-left",false);
							$(".information-wrapper").toggleClass("move-right",false);
				},400);
			});
			
		},500);
	}
});