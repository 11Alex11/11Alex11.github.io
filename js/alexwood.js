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
			console.log(index + " index");
			console.log(curIndex+ " curIndex");
			if(index>curIndex){
				nextPage(link,LEFT);
				curIndex=index;
			}
			else if(index < curIndex){
				nextPage(link,RIGHT);
				curIndex=index;
			}
		}
	});








	//nextPage(LEFT);
	function getIndex(node){
		var ret=0;
		while((node=node.previousElementSibling)!=null){
			ret++;
		}
		return ret;
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
			$(".information-wrapper").toggleClass("paused",true);
			var $mydiv = $('.information-wrapper');
			//toggle height properties off so it can animate
			//$mydiv.css('height', $mydiv.height());
			$mydiv.load(href + " #info-section",function(){
	//			$(this).wrapInner('<div/>');
   //var newheight = $('div:first',this).height();
   //$(this).animate( {height: newheight} );
				$(".information-wrapper").toggleClass("paused",false);
				window.setTimeout(function(){
							headerWait=false;
							$(".information-wrapper").toggleClass("move-left",false);
							$(".information-wrapper").toggleClass("move-right",false);
							//$mydiv.toggleClass('auto-height',false);
				},400);
			});
			//50% of 1s to move off the screen, from move-left and move-right
		},500);
	}
});