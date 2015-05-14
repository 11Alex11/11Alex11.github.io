'use strict';
var LEFT = "LEFT";
var RIGHT = "RIGHT";
window.addEventListener('load',function(){
	var header = $('.navigation-bar');
	$('body').toggleClass('loaded');
	$('logo').toggleClass('logo');
	var logo = document.getElementsByClassName("logo")[0];
	var rotate = 0;
	var content = $("information-wrapper");

	header[0].addEventListener("click",function(event){
		if(event.target.classList.contains("home")){
			window.open("./projects/CS349/A1/utrack.html");


		}


	});








	nextPage(LEFT);

	function nextPage(dir){
		if(dir==LEFT){
			$(".information-wrapper").toggleClass("move-left");
		}
		else{
			$(".information-wrapper").toggleClass("move-right");

		}
		//Interval from .move-left and .move-right
		window.setTimeout(function(){
			if(dir==LEFT){
				$(".information-wrapper").toggleClass("move-left");
				$(".information-wrapper").toggleClass("move-right-instant");
				window.setTimeout(function(){
			$(".information-wrapper").toggleClass("move-right-instant");
			$(".information-wrapper").toggleClass("reset");

		},0);
				//$(".information-wrapper").toggleClass("toggle-invis");
				//nextPage(LEFT);
			}
			else{
				$(".information-wrapper").toggleClass("move-left");

			}
			window.setTimeout(function(){
				$(".information-wrapper").toggleClass("reset");
				nextPage(LEFT);
			},2000);

		},1000);
	}
});