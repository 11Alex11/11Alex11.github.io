'use strict';
var LEFT = "LEFT";
var RIGHT = "RIGHT";
window.addEventListener('load',function(){


	var historyDir=[RIGHT];
	var historyIndex=[0];
	var header = $('.navigation-bar');
	var headerWait=false;
	$('body').toggleClass('loaded');
	$('logo').toggleClass('logo');
	var logo = document.getElementsByClassName("logo")[0];
	var rotate = 0;
	var content = $(".information-wrapper");

	var navTotal = header[0].children.length;
	//Determine what way to slide
	var path = window.location.pathname;
	var page = path.split("/").pop();
	var curIndex=0;
	if(page=="index.html"||page==""){
		curIndex=0;
		$('.home').addClass('menu-active');
	}
	else if(page=="about.html"){
		curIndex=1;
				$('.about').addClass('menu-active');

	}
	else if(page=="projects.html"){
		curIndex=2;
				$('.projects').addClass('menu-active');

	}
	else if(page=="resume.html"){
		curIndex=3;
				$('.resume').addClass('menu-active');

	}
	var index=curIndex;
	nextPage(path,LEFT,false);
	/*Each button is given an href and this will determine what button is clicked and open the href*/
	/*Need to change to xml request*/
	$('.navigation-bar').delegate("button","click",function(event){
		var link = $(this).attr("href");
		$('.menu-bar-button').each(function(){$(this).removeClass('menu-active');});
		$(this).addClass('menu-active');
		if(headerWait==false){
			var index = getIndex(event.target);
			console.log(index + " index");
			console.log(curIndex+ " curIndex");
			if(index>curIndex){
				nextPage(link,LEFT,true);
				historyIndex.push(curIndex);
				curIndex=index;
			}
			else if(index < curIndex){
				nextPage(link,RIGHT,true);
				historyIndex.push(curIndex);
				curIndex=index;
			}
		}
	});

	$('.network-bar').delegate("button","click",function(event){
		var link = $(this).attr("href");
		window.open(link,'_blank');
	});










	//nextPage(LEFT);
	function getIndex(node){
		var ret=0;
		while((node=node.previousElementSibling)!=null){
			ret++;
		}
		return ret;
	}

	function nextPage(href,dir,addToHistory){
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
			var $mydiv = $('.information-wrapper2');
			//toggle height properties off so it can animate
			//$mydiv.css('height', $mydiv.height());
			//Push state into history
			if(addToHistory){
				history.pushState(null,null,href);
				historyDir.push(dir);
			}
			$mydiv.load(href + " #info-section",function(){



				/* Page Specific Functions */
				var showTri = false;
				var path = window.location.pathname;
				var page = path.split("/").pop();
				if(page=="projects.html"){

					$(window).resize(function(){

						$('.project-button').each(function (){
							var showDiv = $(this).next();
						var divHeight = showDiv.height()
						var autoHeight;
						console.log(divHeight);
						if(divHeight!=0){
							var prevHeight=showDiv.height();
							showDiv.css('height', 'auto');
							autoHeight=showDiv.height();
							showDiv.css('height', autoHeight);
						}
						else{


						}
						});


					});
					$('.projects-div').delegate("button","click",function(event){

						if(event.target.innerHTML=="Triangular"){
							var triangularTemp=$('.triangular-template').html();
							console.log(triangularTemp)
							showTri = !showTri;
							console.log(showTri)
							if(showTri){
								$('.triangular-div').append(triangularTemp);

							}
							else{
								$('.triangular-div').empty();
							}


						}
						var showDiv = event.target.nextElementSibling;
						console.log(showDiv);
						var divHeight = $(showDiv).height();
						var autoHeight;
						console.log(divHeight);
						if(divHeight==0){
							$(showDiv).css('height', 'auto');
							autoHeight=$(showDiv).height();
							$(showDiv).css('height', '0');
							$(showDiv).animate( {height:autoHeight},300 );
						}
						else{

							$(showDiv).animate( {height: '0'},300 );
						}
					});

					// Open up the first project panel
					$('.project-button')[0].click();

				}
				else if(page=="index.html"|| page==""){
					var scrollNum=0;
					var moving=false;
					var images= ["./img/projects/openweatherapp.png","./img/projects/cc3k.png","./img/projects/npr.png","./img/projects/wassup-login.png","./img/projects/farminventory.png","./img/projects/fotag.png","./img/projects/mushroom.png","./img/projects/triangular1.png","./img/projects/farmgame.png","./img/projects/wassup-main.png","./img/projects/collision.png"];
					for(var i=0;i<images.length;i++){
						$(".image-showcase").append('<img class="showcase-image logo enlarge" src="' +images[i]+' "/> ');
					}
					var interval=false;
					console.log($('.image-showcase').position().left);
					$('.showcase-left').mouseover(function(){

						interval = setInterval(function(){
							 // The 10 comes from somewhere, this is a terrible solution and i should look into it
							if(10<$('.image-showcase').position().left  ){
								scrollNum=0;
							}
					     	else{
					     		scrollNum=scrollNum+1;
								$('.image-showcase').css({transform:'translateX(' + scrollNum+ '%)'});
							}
					   }, 10);
					});
					$('.showcase-left').mouseout(function(){
						clearInterval(interval);
						interval=false;
					});
					$('.showcase-right').mouseover(function(){
						interval = setInterval(function(){

							if($('.image-showcase').width()<-$('.image-showcase').position().left -$('.showcase').width()*1.6  ){
							}
							else{
								scrollNum=scrollNum-1;
					      		$('.image-showcase').css({transform:'translateX(' + scrollNum+ '%)'});
					      	}
					   }, 10);
					});
					$('.showcase-right').mouseout(function(){
						clearInterval(interval);
						interval=false;
					});


				}





				//$(this).wrapInner('<div/>');
   //var newheight = $('div:first',this).height();
   //$(this).animate( {height: newheight},300 );
				$(".information-wrapper").toggleClass("paused",false);
				window.setTimeout(function(){
							headerWait=false;
							$(".information-wrapper").toggleClass("move-left",false);
							$(".information-wrapper").toggleClass("move-right",false);
							//$mydiv.toggleClass('auto-height',false);
				},400);

				/*Image Specific functions (Enlarge images)*/
				//must be at end of load!
				 $('.enlarge').click(function(){
				 	var overlayTemp=$('.overlay-template').html();
				 	$('.information-wrapper2').append(overlayTemp);
				 	$('.overlay').find('.overlay-image').attr("src",$(this).attr("src"));
				 	//check if any overlay is open and close it
					$('.overlay').click(function(){
						$(this).remove();
					})
				});

			});
			//50% of 1s to move off the screen, from move-left and move-right
		},500);
	}

	window.onpopstate=function(){
		var dir = historyDir[historyDir.length-1];
		curIndex = historyIndex[historyIndex.length-1];
		if(dir==LEFT){
			dir =RIGHT;
		}
		else{
			dir=LEFT;
		}
		historyDir.pop();
		historyIndex.pop();
		var path = window.location.pathname;
		var page = path.split("/").pop();
		$('.menu-bar-button').each(function(){$(this).removeClass('menu-active');});
		if(page=="index.html"||page==""){
		$('.home').addClass('menu-active');
	}
	else if(page=="about.html"){
				$('.about').addClass('menu-active');

	}
	else if(page=="projects.html"){
				$('.projects').addClass('menu-active');

	}
	else if(page=="resume.html"){
				$('.resume').addClass('menu-active');

	}
		nextPage(location.href,dir,false);
	}
});
