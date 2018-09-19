$( document ).ready(function() {

var vidType, vidDuration, vidCurTime, vidDurationFull, vid, laodingring = false, laodingringTime, forwarded = false, pendingControlsHide = false, fullscreenmode = false, postview = false, useshare, shareSize, shareX, shareY, gogoLink, trimmerS, trimmerE, trimmerSpos, trimmerEpos, curTime = 0, vWidth = $(window).width(), vHeight = $(window).height(), firstload = true, endPlay, inPlay, intialize = false, titleanim, vidended, dragging, buff, playerEnded, titleanim, pendingvol, pendingmute, tubeready, pendingplay, useautoplay, status = -1, usecontrols, useppbtn, usevolspke, usevolslid, usetimedisp, usefullscr, useinfo, usetimeline, use3d, usecplaybtn, useshare, mouseover, useposter, postershowing, timelinedragpos, useeclipse, ipointer, device, deviceType, cvpadminpreview, loop, useautofullscreen, infoshowing;

// video type
//vidType = 1; // html5
vidType = 2; // youtube
// vidType = 3; // vimeo

if($("#f63").val() != '') {
 useautofullscreen = true;
}

$(document).bind("contextmenu",function(e){
	e.preventDefault();
return false;
});

// device & device type
if($("#device").val() != '') {
	device = $("#device").val(); device = 'ipad';
}
if($("#deviceType").val() != '') {
deviceType = $("#deviceType").val();
}

if($("#cvpadminpreview").val() != '') {
cvpadminpreview = $("#cvpadminpreview").val();
}

// loop video
if($("#html5VideoPlayer").attr('data-loop') > 0) {
loop = true;
}

// controls
var controls = parseInt($("#html5VideoPlayer").attr('data-controls'));	
/* 1: automatic, 2: below 3:hide 4: lock  */

vState = parseInt($("#vState").val());

// player specific setup
intializePlayer();

// controls setup
if(controls != 3) {
	usecontrols = true;
	
	if($("#html5VideoPlayer").attr('data-ppbtn') > 0) {
		useppbtn = true;
	}
	if($("#html5VideoPlayer").attr('data-volspke') > 0) {
		usevolspke = true;
	}
	if($("#html5VideoPlayer").attr('data-volslid') > 0) {
		usevolslid = true;
	}
	if($("#html5VideoPlayer").attr('data-timedisp') > 0) {
		usetimedisp = true;
	}
	if($("#html5VideoPlayer").attr('data-fullscr') > 0 && deviceType != 'tablet') {
		usefullscr = true;
	}
	if($("#html5VideoPlayer").attr('data-timeline') > 0) {
		usetimeline = true;	
		loadTimeline();
	}
	if($("#html5VideoPlayer").attr('data-3d') === 'true') {
		use3d = true;	
	}
	
	if($("#html5VideoPlayer").attr('data-cplaybtn') > 0) {
		usecplaybtn = true;	
	}
	
	if($("#html5VideoPlayer").attr('data-poster') > 0) { 
		useposter = true;
		$("#html5VideoPlayer_poster").css({"width":vWidth+"px","height":vHeight+"px"});	
		$("#html5VideoPlayer_poster").show();
		postershowing = true;
		
	}
	
	if($("#html5VideoPlayer").attr('data-eclipse') > 0) { 
		useeclipse = true;
		
	}
	
}
// / controls setup

// ONLOAD SETTINGS 
// autoplay
if(!cvpadminpreview && $("#html5VideoPlayer_video").attr('data-autoplay')  > 0 && deviceType != 'tablet') {
		
		useautoplay = true;
		
}

// title and description
if($("#vidInfo").attr('data-show') > 0) {
	useinfo = true;	
}

pendingvol = parseInt($("#html5VideoPlayer").attr('data-vol'));



if($("#html5VideoPlayer").attr('data-mute') > 0) {
pendingmute = true;
}

// / on load settings

// gradient maker
function gradientBg(target,stops,color,s1,g1,s2,g2,s3,g3,s4,g4) {
		if(color === '#000000') {
			color = '#1F1F1F';	
		}
		 if(stops === 4) {
			 
			
			$(target).css({"background":"-webkit-gradient(linear, left top, left bottom, color-stop(0, "+colorLuminance_mv(color, g1)+"), color-stop(0.3, "+colorLuminance_mv(color, g2)+"), color-stop(0.5, "+colorLuminance_mv(color, g3)+"), to("+colorLuminance_mv(color, g4)+"))"});
		
		
			// moz
	 		$(target).css({"background":"-moz-linear-gradient(top, "+colorLuminance_mv(color, g1)+", "+colorLuminance_mv(color, g2)+" "+s2+"%, "+colorLuminance_mv(color, g3)+" "+s3+"%, "+colorLuminance_mv(color, g4)+")"});
	 		
			// ms
	 		$(target).css({"background":"-ms-linear-gradient(top, "+colorLuminance_mv(color, g1)+" "+s1+"%, "+colorLuminance_mv(color, g2)+" "+s2+"%, "+colorLuminance_mv(color, g3)+" "+s3+"%, "+colorLuminance_mv(color, g4)+" "+s4+"%)"});
			
			// opera
			$(target).css({"background":"-o-linear-gradient(top, "+colorLuminance_mv(color, g1)+" "+s1+"%, "+colorLuminance_mv(color, g2)+" "+s2+"%, "+colorLuminance_mv(color, g3)+" "+s3+"%, "+colorLuminance_mv(color, g4)+" "+s4+"%)"});
			
			// WC3
			$(target).css({"background":"linear-gradient(to bottom, "+colorLuminance_mv(color, g1)+" "+s1+"%, "+colorLuminance_mv(color, g2)+" "+s2+"%, "+colorLuminance_mv(color, g3)+" "+s3+"%, "+colorLuminance_mv(color, g4)+" "+s4+"%)"});
			
		 
		 }  // / 4 stops
		 
		 else  if(stops === 2) {
			 
		 // webkit
			 $(target).css({"background":"-webkit-gradient(linear, left top, left bottom, color-stop(0, "+colorLuminance_mv(color, g1)+"), to("+colorLuminance_mv(color, g2)+"))"});
		
			// moz
	 		$(target).css({"background":"-moz-linear-gradient(top, "+colorLuminance_mv(color, g1)+", "+colorLuminance_mv(color, g2)+" "+s2+"%)"});
	 		
			// ms
	 		$(target).css({"background":"-ms-linear-gradient(top, "+colorLuminance_mv(color, g1)+" "+s1+"%, "+colorLuminance_mv(color, g2)+" "+s2+"%)"});
			//$(target).css({"background":"-ms-linear-gradient(top,  #1e5799 0%,#7db9e8 100%)"});
			
			// opera
			$(target).css({"background":"-o-linear-gradient(top, "+colorLuminance_mv(color, g1)+" "+s1+"%, "+colorLuminance_mv(color, g2)+" "+s2+"%)"});
			
			// WC3
			$(target).css({"background":"linear-gradient(to bottom, "+colorLuminance_mv(color, g1)+" "+s1+"%, "+colorLuminance_mv(color, g2)+" "+s2+"%)"});
	
		 }
		 
	}


// LOAD PLAYER 
	
	// reset for resize
	var padding = 0, color;
	
	// video size and pos
	$("#html5VideoPlayer_video").css({"width":vWidth+"px","height":vHeight+"px"});
	
	//  position controls
	if(usecontrols) {
	
	$("#html5VideoPlayer_controls").css({"width":vWidth+"px"});
	$("#html5VideoPlayer_controls_bg").css({"height":$("#html5VideoPlayer_controls").height()+"px"});
	
	// controls below video
	if(controls === 2) { 
		// get new height
		vHeight = vHeight - $("#html5VideoPlayer_controls").height();
		if($("#html5VideoPlayer").attr('data-timeline') > 0) {
			 vHeight = vHeight - $("#html5VideoPlayer_prog").height();
		}		
	}
	
	var contSize = $("#html5VideoPlayer_controls").height(); 
	var spacing = (contSize / 3) + 5;
	
	 var controlsScale = contSize / 32;  
	 
	 var controlsScale2 = (controlsScale + 1) / 2;
	
	// button size 
	$("#html5VideoPlayer_controls").css({"font-size":Math.round(controlsScale*34)+"px"});
	
	
	
	// play pause button
	if(useppbtn) {
	$("#html5VideoPlayer_controls_playpausebtn").css({"margin-left":Math.round(controlsScale*9)+"px"});
	}
	
	// time display
	if(usetimedisp) {
	
		 $(".timeDisplay").css({"font-size":Math.round(controlsScale2*15)+"px","line-height":Math.round(controlsScale*35)+"px"});
		 
		$("#html5VideoPlayer_timeDisplay_Prog").css({"margin-left":Math.round(controlsScale*18)+"px"})
		 $("#html5VideoPlayer_timeDisplay").css({"margin-right":Math.round(controlsScale*18)+"px"});
	}
	
	// speaker
	if(usevolspke) {
		$("#html5VideoPlayer_controls_speaker_w").css({"margin-right":Math.round(controlsScale*9)+"px"});
	}
	
	// volume slider
	if(usevolslid) {
		// handle
		$("#html5VideoPlayer_vol_w").css({"margin-right":Math.round(controlsScale*9)+"px"}); 
		// set height
	$("#html5VideoPlayer_vol_w,#html5VideoPlayer_vol,#html5VideoPlayer_volFill").css({"height":Math.round(controlsScale*18)+"px","margin-top":Math.round(controlsScale*2)+"px"});
	
		 
	}
	
	// fullscreen
	if(usefullscr) {
	
	$("#html5VideoPlayer_fullScreen").css({"font-size":Math.floor(controlsScale*29)+"px","line-height":Math.round(controlsScale*35)+"px","margin-left":Math.round(controlsScale*9)+"px"});
	}
	
	
	if(usetimeline) {
	// timeline
	$("#html5VideoPlayer_prog,#html5VideoPlayer_progBuff,#html5VideoPlayer_progFill").css({"height":Math.round(controlsScale*18)+"px"});
	
	var progHeight = $("#html5VideoPlayer_prog").height();
	//alert($("#html5VideoPlayer_progHandle").attr('data-playhead'));
	if($("#html5VideoPlayer_progHandle").attr('data-playhead') === 'social-apple') {
	progHeight = progHeight*0.86;
	} else if($("#html5VideoPlayer_progHandle").attr('data-playhead') === 'torso') {
	progHeight = progHeight*0.92;	
	} else if($("#html5VideoPlayer_progHandle").attr('data-playhead') === 'star') {
//	handleControlScale = handleControlScale*0.96;	
	}
	

	
	$("#html5VideoPlayer_progHandle").css({'font-size':Math.round(progHeight*1.9)+"px","top":-Math.round(progHeight/2)+"px"});
	
	//var timelinehandle = 'html5'; // 'stop';
	
	//timelinehandle = 'fi-'+timelinehandle;
	//$("#html5VideoPlayer_progHandle").addClass(timelinehandle);
	
	
	
	}
	
	} // / position controls
	
	
	
	// title and description
	
	
	// / visual effects
	//$("#html5VideoPlayer_loading_w").css({"height":vWidth+"px","padding-top":(vHeight/2)-25+"px"});
	
	
	// 3d and glow xxxx
	if(use3d && usecontrols) {
		
		color = $("#html5VideoPlayer").attr('data-conclr');
		var hlcolor = $("#html5VideoPlayer").attr('data-conhlclr');
		
		//hlcolor = 'FFF';
		if(color === '000000' || color === '000') {
			color = '#242424';
			$("#html5VideoPlayer i").css({"text-shadow":"0px -1px 0px #CCC, 0px 1px 0px "+colorLuminance_mv(color, -0.4)});
		}
		else { 
		 $("#html5VideoPlayer i").css({"text-shadow":"0px -1px -0px "+colorLuminance_mv(color, 0.3)+", 0px 1px 0px "+colorLuminance_mv(color, -0.4)});
		}
		
		
		
		// hover 
		
		$("#html5VideoPlayer_controls_playpausebtn, #html5VideoPlayer_controls_speaker, #html5VideoPlayer_volumeSlider .ui-slider-handle, #html5VideoPlayer_fullScreen").mouseenter(function() { 
			$(this).css({"text-shadow":"1px 1px 3px "+colorLuminance_mv(hlcolor, 0.3)+", 1px 1px 1px "+colorLuminance_mv(hlcolor, -0.4)});
			}).mouseleave(function() {
			color = $("#html5VideoPlayer").attr('data-conclr');
			if(color === '000000' || color === '000') {
			color = '#242424';
			$("#html5VideoPlayer i").css({"text-shadow":"0px -1px 0px #CCC, 0px 1px 0px "+colorLuminance_mv(color, -0.4)});
			}
		else { 
		 $("#html5VideoPlayer i").css({"text-shadow":"0px -1px -0px "+colorLuminance_mv(color, 0.3)+", 0px 1px 0px "+colorLuminance_mv(color, -0.4)});
		}
			});
			
	
	if(usecplaybtn) { 
			
			$( "#centerPlayButton, #centerPlayButtonOutline").mouseenter(function() {
			
					$("#centerPlayButton").css({"color":"#"+$("#html5VideoPlayer").attr('data-conhlclr')});
					$("#centerPlayButtonOutline").css({"-moz-box-shadow":"0px 0px 10px 0px #"+$("#html5VideoPlayer").attr('data-conhlclr')});
					$("#centerPlayButtonOutline").css({"-webkit-box-shadow":"0px 0px 10px 0px #"+$("#html5VideoPlayer").attr('data-conhlclr')});
					$("#centerPlayButtonOutline").css({"box-shadow":"0px 0px 10px 0px #"+$("#html5VideoPlayer").attr('data-conhlclr')});
			}).mouseleave(function() {
				
				$("#centerPlayButton").css({"color":"#"+$("#html5VideoPlayer").attr('data-conclr')});
				
				$("#centerPlayButtonOutline").css({"-webkit-box-shadow":"none"});
				$("#centerPlayButtonOutline").css({"-moz-box-shadow":"none"});
				$("#centerPlayButtonOutline").css({"box-shadow":"none"});
			});
	}
	
	
	
	
} // 3d and glow



	
// show controls

if(!useautoplay && status < 1 || !useautoplay && $("#html5VideoPlayer").attr('data-controls') === '2') {
	
	
	
	//showControls();
	
	$("#html5VideoPlayer_volumeSlider_w").show();
	
	}
	
	color = '#'+$('#playerBackgroundColor').val();
	
		if(color === '#000000' || color === '#000') {
			color = '#242424';
		}
		else
		if(color === '#FFFFFF' || color === '#FFF') {
			color = '#fdfdfd'; // fdfdfd			
		} 
	
	
	


if(usevolslid) {
	$("#html5VideoPlayer_vol").click(function(e){ 
	
		var volPos = $("#html5VideoPlayer_vol").position();
		var pos = (e.pageX - volPos.left);		
		setVol(pos / $("#html5VideoPlayer_vol").width());	
});	

function setVol(vol) { 
	$("#html5VideoPlayer_volFill").css({"width":Math.round(vol*100)+"%"});
	player.setVolume(vol*100);
}

}
// load player


/* VISUAL EFFECTS setup */

if($("#useBackgroundGradient").val() === 'true' && useinfo || $("#useBackgroundGradient").val() === 'true' && usecontrols) {
		
		// player background
	  	color = '#'+$('#playerBackgroundColor').val();
		if(color === '#000000' || color === '#000') { color = '#242424'; } else 
		if(color === '#FFFFFF' || color === '#FFF') { color = '#fdfdfd'; } 
		
		if(usecontrols) {
			
	gradientBg('#html5VideoPlayer_controls_bg',4,color, 0,0.5, 40,-0.1, 70,-0.2, 100,-0.4);
  
  

   
   	// tube center play button
	gradientBg('#centerPlayButtonOutline',4,color, 0,0.5, 20,-0.1, 50,-0.2, 100,-0.4);
	
	
		}
	
	// title background 
	if(useinfo) {
	color = '#'+$("#html5VideoPlayer").attr('data-titlebgcolor');
	
	if(color === '#FFFFFF' || color === '#FFF') {
				
	 gradientBg('#vidInfo_bg', 4, color, 0, 0.5, 20, 0, 50, 0, 100,-0.2);		
					
		}
	else {
	if(color === '#000000' || color === '#000') {
			color = '#242424';
	}		
	
	 
	 
	 
	 gradientBg('#vidInfo_bg',4,color,0,0.5,20,-0.1,50,-0.2,100,-0.4);
	 
	}
	}
	
	// timeline
	if(usetimeline) {
	color = '#'+$("#html5VideoPlayer").attr('data-tlbgcolor');
	
	gradientBg('#html5VideoPlayer_prog',4,color, 0,-0.5, 32,0, 50,0, 100,0.2);
	
	
	// download color
	color = '#'+$("#html5VideoPlayer").attr('data-tldlowcolor');
	gradientBg('#html5VideoPlayer_progBuff',4,color, 0,-0.5, 32,0, 50,0, 100,0.2);
	

	
	// prog fill
	
	gradientBg('#html5VideoPlayer_progFill',4,color, 0,0.3, 32,0, 50,0, 100,-0.2);
	
	
	}
	
	// gradient volume
	if(usevolslid) {
		color = '#'+$("#html5VideoPlayer_vol").attr('data-color');
		if(color === '000000' || color === '000') {
			color = '#242424';
		}
		// vol bar
		gradientBg('#html5VideoPlayer_vol',4,color, 0,-0.5, 32,0, 50,0, 100,0.2);
		
		
		
	color = '#'+$("#html5VideoPlayer_vol").attr('data-color2');
	if(color === '000000' || color === '000') {
			color = '#242424';
		}
		
		gradientBg('#html5VideoPlayer_volFill',4,color, 0,0.3, 32,0, 50,0, 100,-0.2);
		
	
	}
	
	
} //  gradient effect

// / visual effects setup


// first load setup 
if($("#html5VideoPlayer").attr('data-status') > 0) {
pendingControlsHide = true;
loadingRing();
} else {
	pendingControlsHide = false;
}






// intializePlayer 

function intializePlayer() { 

	// cur time
	vid = document.getElementById("html5VideoPlayer_video"); 
	
		vidCurTime = 0;
	
	
	// set trimmer
	if($("#html5VideoPlayer").attr('data-trimmers') > 0) {
	trimmerS = parseInt($("#html5VideoPlayer").attr('data-trimmers')); 
	vidCurTime = trimmerS;
	}
	if($("#html5VideoPlayer").attr('data-trimmere') > 0) {
	trimmerE = parseInt($("#html5VideoPlayer").attr('data-trimmere')); }

	 //fadeIn('fast');
	
	if($("#html5VideoPlayer").attr('data-fullscr') > 0) {
		useFullscreen();	
	}
	
	// set vol
	if(pendingvol) { setVolume(pendingvol); pendingvol = false; }
	
	
	
	// autoplay
	if(useautoplay) {
	 playVideo();
	}
	
	
	else if(pendingplay) {
		pendingplay = false;
		playVideo();
	}
	
	// load timeline
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	if(trimmerS) {
	trimmerSpos = Math.round(trimmerS * (100 / vidDuration));
	}
	
	if(trimmerE) {
	trimmerEpos = Math.round(trimmerE * (100 / vidDuration));
	}
	
	// load duration time if it has not been loaded
	vidDuration = $("#vidDur").val();
		if(trimmerE) {
			vidDuration = vidDuration - (vidDuration - trimmerE);	
		}
		if(trimmerS) {
			vidDuration = vidDuration - trimmerS;	
		}
	
	if($("#html5VideoPlayer_timeDisplay_length").text() === '00:00') {
		var durmins = Math.floor(vidDuration / 60);
		var dursecs = Math.floor(vidDuration - durmins * 60);
		var durhrs = false;
		if(durmins > 59) {
			durhrs = Math.floor(durmins / 60);
			durmins = durmins - (60*durhrs);
		}
		
		if(durmins < 10) { durmins = "0"+durmins; }
		if(dursecs < 10) { dursecs = "0"+dursecs; }
		if(!isNaN(durmins) && !isNaN(dursecs) && durmins > -0.1 && dursecs > -0.1) { 
			if(durhrs) {
			$("#html5VideoPlayer_timeDisplay_length").text(durhrs+":"+durmins+":"+dursecs);	
			} else {
			$("#html5VideoPlayer_timeDisplay_length").text(durmins+":"+dursecs);
			}
		}
	}
	
	//seekTime();
	
} // / intializePlayer



// VISUAL FUNCTIONS

// show title
function showTitle() { infoshowing = true;
	if(useinfo && status < 3 ||
	$("#vidInfo").attr('data-show') > 0 && status === 4) {
		
		$("#vidInfo, #vidInfo_bg").css({"width":vWidth+"px"});
		//$("#vidInfo, #vidInfo_bg").css({"width":vWidth - 20+"px","left":"10px"});
		
		if($("#vidInfo").is(":hidden")) {
		var tempHeight = $("#vidInfo").height()+18;
		$("#vidInfo_bg").css({"height":tempHeight+"px"});
		// get opacity
		var tempOp = (100 - parseInt($("#vidInfo_bg").attr('data-tran'))) / 100;
		
		if($("#vidInfo").is(":hidden")) {
		$("#vidInfo_bg").css({"top":(0-tempHeight-6)+"px" ,"opacity":tempOp});
		$("#vidInfo_bg").show();
		//var animcom;
		if(!titleanim) {
		titleanim = true;
		$("#vidInfo_bg").animate({
			top: "+="+(tempHeight+6)
			}, 600, function() {
				titleanim = false;
				$("#vidInfo").fadeIn("fast");
		});
		}
		}
		}
		
	}	
}
// / show title


// time display
function timedisplay(val) {
	// update value
	$("#timedisplay").text(val);	
	// set position
	var left = Math.round($("#html5VideoPlayer_progFill").width() - $("#timedisplay").width()/2) - 10;
	var top = parseInt($("#html5VideoPlayer_prog").css('top')) - $("#timedisplay").height() - 10;
	$("#timedisplay").css({"left":left+"px","top":top+"px"});
}
// / time display

// time line
function loadTimeline() { 

if(deviceType != 'tablet') {
$("#timedisplay2").css({"opacity":1});

	// time display 2
$("#html5VideoPlayer_prog").mouseenter(function() {
	$("#timedisplay2").css({"left":-50+"px"});
	if($("#timedisplay2").text() != '') {
		
	// position to be moved
	var top = parseInt($("#html5VideoPlayer_prog").css('top')) - 22;
	$("#timedisplay2").css({"top":+top+"px"});
	
	$("#html5VideoPlayer_prog").mousemove(function(e){
	
	//var pos = e.pageX / vWidth;
	var pos = (e.pageX - parseInt($("#html5VideoPlayer_prog").css('left'))) / $("#html5VideoPlayer_prog").width();
			
		var vidDuration = player.getDuration();		
		
		if(trimmerE) {
			vidDuration = vidDuration - (player.getDuration() - trimmerE);	
		}
		
		if(trimmerS) {
			vidDuration = vidDuration - trimmerS;	
		}
		
		vidDuration = Math.floor(vidDuration * pos);
		
		timelinedragpos = vidDuration;
		
		
		// convert to display time
		var durmins = Math.floor(vidDuration / 60);
		var dursecs = Math.floor(vidDuration - durmins * 60);
		var durhrs = false;
		if(durmins > 59) {
			durhrs = Math.floor(durmins / 60);
			durmins = durmins - (60*durhrs);
		}
		
		if(durmins < 10) { durmins = "0"+durmins; }
		if(dursecs < 10) { dursecs = "0"+dursecs; }
		if(!isNaN(durmins) && !isNaN(dursecs) && durmins > -0.1 && dursecs > -0.1) { 
			if(durhrs) {
			$('#timedisplay2').text(durhrs+":"+durmins+":"+dursecs);	
			} else {
			$('#timedisplay2').text(durmins+":"+dursecs);
			}
		}
	$("#timedisplay2").css({"left":+e.pageX-($("#timedisplay2").width()-4)+"px"});	
	});
	
	$("#timedisplay2").show();
	
	}
}).mouseleave(function() {
	$("#timedisplay2").hide();
});
}
	
	$("#html5VideoPlayer_progHandle").draggable({
		axis: "x",
		containment: "parent",
		create: function( event, ui ) {},
		drag: function( event, ui ) { dragging = true; },
		stop: function( event, ui ) {
			if(trimmerS) {
			timelinedragpos = timelinedragpos + trimmerS;	
		}
			playVideo(timelinedragpos);
			setTimeout(function(){ dragging = false; },300);
		}
	});
	
	
	$("#html5VideoPlayer_prog").click(function(e){
	
		//var pos = e.pageX / vWidth;
		var pos = (e.pageX - parseInt($("#html5VideoPlayer_prog").css('left'))) / $("#html5VideoPlayer_prog").width();		
		
		var vidDuration = player.getDuration();		
		
		if(trimmerE) {
			vidDuration = vidDuration - (player.getDuration() - trimmerE);	
		}
		
		if(trimmerS) {
			vidDuration = vidDuration - trimmerS;	
		}
		
		
		var posSec = (vidDuration * pos);
		
		if(trimmerS) {
			posSec = posSec + trimmerS;	
		}
		loadingRing();
		playVideo(posSec);
	
	});	
}


// / TIME LINE

// loading rings
function loadingRing() {
	laodingring = true;
	$("#html5VideoPlayer_loading_w").show();
}


// / timeline


// / visual functions


// SHARE 
if($("#html5VideoPlayer").attr('data-share')) {
	 useshare = true;	

	// SHARE BUTTONS ANIIMATION
	$( "#html5VideoPlayer_share").mouseenter(function() { 
		
		if(shareSize) {
		if(shareX && shareX > 0) {
			$("#html5VideoPlayer_share").css({"left":shareX - 5+"px"});
		}  if(shareY && shareY > 0) {
			$("#html5VideoPlayer_share").css({"top":shareY - 5+"px"});
		}
		
		$("#html5VideoPlayer_share img").css({"width":Math.round(shareSize * 1.1)+"px","height":Math.round(shareSize * 1.1)+"px"});
		}
	
	}).mouseleave(function() {
		if(shareSize) {
		
		if(shareX && shareX > 0) {
			$("#html5VideoPlayer_share").css({"left":shareX+"px"});
		}  if(shareY && shareY > 0) {
			$("#html5VideoPlayer_share").css({"top":shareY+"px"});
		}
		
		
		$( "#html5VideoPlayer_share img").css({"width":shareSize+"px","height":shareSize+"px"});
		}
	});
	
	$( "#html5VideoPlayer_share img").mouseenter(function() { 
	$(this).css({"width":Math.round(shareSize * 1.15)+"px","height":Math.round(shareSize * 1.15)+"px"});
	}).mouseleave(function() {
		$(this).css({"width":Math.round(shareSize * 1.1)+"px","height":Math.round(shareSize * 1.1)+"px"});
	});
	
}

$("#html5VideoPlayer_share img").click(function(){
	
	var shareLink = "";

	if($("#html5VideoPlayer_share").attr('data-link') != '') {
		shareLink = $("#html5VideoPlayer_share").attr('data-link');
	}
	else {
		shareLink = encodeURIComponent(document.referrer);	
	}
	
	
	if($(this).attr('id') === 'html5VideoPlayer_share_f') { 
				
		gogoLink = 'http://www.facebook.com/sharer/sharer.php?s=100&p[url]='+shareLink+'&p[title]='+$("#html5VideoPlayer_share").attr('data-title')+'&p[summary]='+$("#html5VideoPlayer_share").attr('data-des');
		
	}
	else if($(this).attr('id') === 'html5VideoPlayer_share_g') {
		
		gogoLink = 'https://plus.google.com/share?url='+shareLink;
		
	}
	else if($(this).attr('id') === 'html5VideoPlayer_share_t') {
		
		gogoLink = 'http://twitter.com/home?status='+$("#html5VideoPlayer_share").attr('data-title')+'%20%3D%3E%20'+shareLink;
		
	}
	else if($(this).attr('id') === 'html5VideoPlayer_share_l') {
		gogoLink = 'http://www.linkedin.com/shareArticle?mini=true&url='+shareLink+'&title='+$("#html5VideoPlayer_share").attr('data-title')+'&'+$("#html5VideoPlayer_share").attr('data-des');
		
	}
	
		
		window.open(gogoLink,'title', "width=700, height=550");
		pauseVideo();
	
	});

// / share



// 3. PLAYER POSITIONING 
$("#html5VideoPlayer_video,#player").css({"width":$(window).width()+"px","height":$(window).height()+"px","display":"block"});
// position controls
function playerPosition() {
	vWidth = $(window).width();  vHeight = $(window).height();
	
	// / video crop features
	
	
	var adjustX = vWidth / 512;
	var adjustY = vHeight / 288;
	var spacing = 4;
	
	var y = vHeight;
	var move;
	
	
	$("#html5VideoPlayer_video,#player").css({"width":vWidth+"px","height":vHeight+"px"});
	
	
	
	if(useinfo && status != 1 && playerState != 1) {
	showTitle();
	}
	
	// controls
	if(usecontrols) {
	y = y - $("#html5VideoPlayer_controls").height(); // y-8
	
	// skin 2
	$("#html5VideoPlayer_controls, #html5VideoPlayer_controls_bg").css({"top":(y-16)+"px","width":vWidth-20+"px","margin-left":"5px"});
	
	}
	
	if(usevolslid) {
		// add spacing above controls
		var volPad = ($("#html5VideoPlayer_controls").height() / 2) - ($("#html5VideoPlayer_vol_w").height() / 2);
		$("#html5VideoPlayer_vol_w").css({"margin-top":Math.round(volPad)+"px"});
		$("#html5VideoPlayer_vol_w").show();
		
	}
	
	 // timeline
	 if(usetimeline) {
	  var timelineHeight, timelineY = $(window).height();
	  
	  // set control height
	  if(usecontrols) {
		  timelineY = timelineY - $("#html5VideoPlayer_controls").height();
		  timelineHeight = Math.round($("#html5VideoPlayer_controls").height() / 3);
		  
	  }
	  
	  // setup timeline
	  // progress bar
	if(usecontrols && usetimeline) {
	timelineY = timelineY - timelineHeight;
	
	y = vHeight - $("#html5VideoPlayer_prog").height();
	
	
	if(useppbtn || usetimedisp || usevolspke || usevolslid || usefullscr) {
	y = y - $("#html5VideoPlayer_controls").height() - 6;
	
	}
	
	
	// STANDARD VERSION
	
	if(controls != 2) {
	
	 // = 400;
	var timelineMargLeft = 80;
	var timelineHeight = 12;
	var timelineW;
	//spacing = controlsScale * (spacing * 1.2);
	//spacing = 0;
	// check if any controls
	
	if(useppbtn || usetimedisp || usevolspke || usevolslid || usefullscr) {
	
	if(controlsScale > 1) {
	
	var timelineX = parseInt($("#html5VideoPlayer_controls").css('margin-left')) + (controlsScale*12);
	var timelineW = $("#html5VideoPlayer_controls").width() - (6 + (controlsScale*6));
	var timelineY = parseInt($("#html5VideoPlayer_controls").css('top')) + 6 + (controlsScale*6); 
	
	// time display
	if(usetimedisp) {
		timelineW = timelineW - (controlsScale*108); // 108;	 // 96
		timelineX = timelineX + (controlsScale*54); // 54;
	}
	
	// playbutton
	if(useppbtn) {
		timelineW = timelineW - (controlsScale2*34); // 34;	
		timelineX = timelineX + (controlsScale2*32); // 32;
	}
	
	// full screen
	if(usefullscr) {
		timelineW = timelineW - (controlsScale2*34); // 34; // - (spacing * 2);
	}
	
	// volume slider
	if(usevolslid) {
		timelineW = timelineW - (controlsScale2*68); // 68;
	}
	
	// volume speaker
	if(usevolspke) {
		timelineW = timelineW - (controlsScale2*44); // 44;
		//if(usefullscr) {timelineW = timelineW - 10;}
	}
	
	
	$("#html5VideoPlayer_prog").css({"left":timelineX+"px","top":timelineY+"px","width":timelineW+"px"});
	$("#html5VideoPlayer_progFill,#html5VideoPlayer_progBuff").css({"width":"0px"});
	
	} else if(controlsScale < 1) {
	
	var timelineX = parseInt($("#html5VideoPlayer_controls").css('margin-left')) + (controlsScale2*12);
	var timelineW = $("#html5VideoPlayer_controls").width() - (6 + (controlsScale*6));
	var timelineY = parseInt($("#html5VideoPlayer_controls").css('top')) + 6 + (controlsScale*6); 
	
	// time display
	if(usetimedisp) {
		timelineW = timelineW - (controlsScale2*108); // 108;	 // 96
		timelineX = timelineX + (controlsScale2*54); // 54;
	}
	
	// playbutton
	if(useppbtn) {
		timelineW = timelineW - (controlsScale2*34); // 34;	
		timelineX = timelineX + (controlsScale2*32); // 32;
	}
	
	// full screen
	if(usefullscr) {
		timelineW = timelineW - (controlsScale2*34); // 34; // - (spacing * 2);
	}
	
	// volume slider
	if(usevolslid) {
		timelineW = timelineW - (controlsScale2*68); // 68;
	}
	
	// volume speaker
	if(usevolspke) {
		timelineW = timelineW - (controlsScale2*44); // 44;
		//if(usefullscr) {timelineW = timelineW - 10;}
	}
	
	
	$("#html5VideoPlayer_prog").css({"left":timelineX+"px","top":timelineY+"px","width":timelineW+"px"});
	$("#html5VideoPlayer_progFill,#html5VideoPlayer_progBuff").css({"width":"0px"});
		
	} else {
	
	var timelineX = parseInt($("#html5VideoPlayer_controls").css('margin-left')) + 12;
	var timelineW = $("#html5VideoPlayer_controls").width() - 12;
	var timelineY = parseInt($("#html5VideoPlayer_controls").css('top')) + 12; 
	
	
	
	// time display
	if(usetimedisp) {
		timelineW = timelineW - (controlsScale*108); // 108;	 // 96
		timelineX = timelineX + (controlsScale*54); // 54;
	}
	
	// playbutton
	if(useppbtn) {
		timelineW = timelineW - (controlsScale*34); // 34;	
		timelineX = timelineX + (controlsScale*32); // 32;
	}
	
	// full screen
	if(usefullscr) {
		timelineW = timelineW - (controlsScale*34); // 34; // - (spacing * 2);
	}
	
	// volume slider
	if(usevolslid) {
		timelineW = timelineW - (controlsScale*68); // 68;
	}
	
	// volume speaker
	if(usevolspke) {
		timelineW = timelineW - (controlsScale*44); // 44;
		//if(usefullscr) {timelineW = timelineW - 10;}
	}
	
	
	$("#html5VideoPlayer_prog").css({"left":timelineX+"px","top":timelineY+"px","width":timelineW+"px"});
	$("#html5VideoPlayer_progFill,#html5VideoPlayer_progBuff").css({"width":"0px"});
	
	}
	
	
	// no controls, only timeline	
	} else { 
		timelineHeight = Math.round(parseInt($("#html5VideoPlayer_controls").attr('data-height') / 2));
		$("#html5VideoPlayer_prog,#html5VideoPlayer_progFill,#html5VideoPlayer_progBuff").css({"height":timelineHeight+"px"});
		
		// position and size
		timelineW = vWidth; timelineX = 0; timelineY = vHeight - timelineHeight;
		
		// hide handle
		$("#html5VideoPlayer_progHandle").hide();
		// remove cuves
		cssCurves("#html5VideoPlayer_prog,#html5VideoPlayer_progFill,#html5VideoPlayer_progBuff",0);
		
		$("#html5VideoPlayer_prog").css({"width":$(window).width()+"px"});
	$("#html5VideoPlayer_prog").css({"top":(vHeight)-($("#html5VideoPlayer_prog").height())+"px"});
	
	
	}
	
	
	} else {
		// STANDARD VERSION
	$("#html5VideoPlayer_prog").css({"width":$(window).width()+"px"});
	$("#html5VideoPlayer_prog").css({"top":y+"px"});
	}
	
	}
	 
	} else {
		$("#html5VideoPlayer_timeDisplay_Prog").css({"float":"right","margin-right":"9px"});
		
	}
	
	
	// center play button 
	if(usecplaybtn) { 
	if(vHeight < 250) {
	$("#centerPlayButtonOutline").css({"width":"50px","height":"50px"});
	$("#centerPlayButton").css({"font-size":"45px","text-indent":"9px"});
	}
	
	// standard button size
	$(".centerPlayButton").css({"left":Math.round((vWidth/2) - ($("#centerPlayButtonOutline").width()/2))+"px","top":Math.round((vHeight/2) - ($("#centerPlayButtonOutline").height()/2))+"px"});
		
		// small button size
		

	if(!useautoplay && status < 1) { 
	
		$("#centerPlayButtonWrap").fadeIn("fast");	
		}
	} // / center play button
	
	
	
	
	// position special elements
	
	// logo
	if($("#html5VideoPlayer").attr('data-logo') > 0) { 
		var logoW = $("#html5VideoPlayer").attr('data-logow');
		var logoH = $("#html5VideoPlayer").attr('data-logoh');
		var logoPos = $("#html5VideoPlayer").attr('data-logopos');
		var logoMar = $("#html5VideoPlayer").attr('data-logomar');
		
		// check if height or width not entered
		if(logoH === '' || logoH < 1) {
			if(logoW != '' && logoW > 0) {
				$("#html5VideoPlayer_logo").css({"width":logoW+"px"}); } 				
			logoH = $("#html5VideoPlayer_logo").height();
		}
		if(logoW === '' || logoW < 1) {
			if(logoH != '' && logoH > 0) {
				$("#html5VideoPlayer_logo").css({"height":logoH+"px"}); } 				
			logoW = $("#html5VideoPlayer_logo").width();
		}
		
		
		var logoX, logoY, logoLink;
		// position logo
		// x left
		if(logoPos === 'tl' || logoPos === 'bl') {
			logoX = logoMar;
		}
		// x right
		if(logoPos === 'tr' || logoPos === 'br') {
			logoX =  $(window).width() - logoW - logoMar;	
		}
		// y top
		if(logoPos === 'tl' || logoPos === 'tr') {
			logoY = logoMar;
		}
		// y bottom
		if(logoPos === 'bl' || logoPos === 'br') {
			logoY = $(window).height() - logoH- logoMar;
			
			// adjust y
			if(controls === 2) {
				if(useppbtn || usetimedisp || usevolspke || usevolslid || usefullscr) {
				logoY = logoY - $("#html5VideoPlayer_controls").height();	
				}
				if(usetimeline) {
					logoY = logoY - $("#html5VideoPlayer_prog").height();
				}
			}	
		}
		
		
		
		$("#html5VideoPlayer_logo").css({"left":logoX+"px","top":logoY+"px","width":logoW+"px","height":logoH+"px"});
		$("#html5VideoPlayer_logo").fadeTo("fast", (100-parseInt($("#html5VideoPlayer").attr('data-logotran'))) / 100);	
	}
	
	
	
	// share
	if(useshare) { 
		// prepare incons
		if(vHeight < 256) {
			shareSize = (vHeight / 4) - 30;
			
		} else {
		shareSize = 30;
		
		
		}
		var shareSpacing = 3;
		$("#html5VideoPlayer_share img").css({"width":shareSize+"px","height":shareSize+"px","float":"left","padding":shareSpacing+"px"});
		$("#html5VideoPlayer_share").css({"width":shareSize+"px"});
		// rounded corners
		$("#html5VideoPlayer_share").css({"-webkit-border-radius":"6px"});
		$("#html5VideoPlayer_share").css({"-moz-border-radius":"6px"});
		$("#html5VideoPlayer_share").css({"border-radius":"6px"});
		
		// left center
		shareX = vWidth - shareSize - 15; 
		shareY = Math.round((vHeight - $("#html5VideoPlayer_share").height()) /2);
		
		if(vHeight < 256) {
			shareY = shareY - 10;
		}
		
		
		$("#html5VideoPlayer_share").css({"top":shareY+"px","left": shareX+"px" ,"background-color":"rgb(0,0,0,0.2)","padding":"6px","padding-right":"12px"});
		
		if(!useautoplay) { $("#html5VideoPlayer_share").show(); }
		
	}
	
	
	
	// cash clicks
	if($("#html5VideoPlayer").attr('data-cc') != '') {
		$("#cc").css({"top":"5px","left":"5px","opacity":"0.33"}); 
		$("#cc").show();			
	}
	
	
	// tube always use
	
	if(!device || device != 'ipad') {
	}
	else if(!ipointer && !playerReady) {
		$(".ipointer").each(function() { 
			$( this ).addClass( "ipointer-none" );
		});
		ipointer = true;
	}
	
	
	// show controls if control lock
	
	if(controls === 2 || controls === 4) {
		showControls();	
	}
	
	if(!firstload) {
		eventResize();
	}
	
	else { firstload = false; }
	
	
	
	if(controls === 2) {
	
	$("#html5VideoPlayer_controls_bg").css({"width":vWidth});
	$("#html5VideoPlayer_controls,#html5VideoPlayer_controls_bg").css({"margin-left":"0px","top":($(window).height() - $("#html5VideoPlayer_controls").height() - 8)+"px"});
	
	$("#html5VideoPlayer_timeDisplay_Prog").css({"float":"right","margin-right":"14px"});
	
	// set video size
	if(usetimeline) {
	var setHeight = $("#html5VideoPlayer_prog").css('top');
	} 
	else {
		var setHeight = $("#html5VideoPlayer_controls").css('top');	
	}
	
	$("#html5VideoPlayer_video,#player").css({"height":setHeight,"top":"0px"});
	//$("#html5VideoPlayer_video").css({"height":setHeight,"top":"0px"});
	
	// shift center play button up
	if(usecplaybtn) {	
		
		//
		
		var centerPlayShift = Math.round(parseInt($("#centerPlayButtonOutline").css('top')) - $("#html5VideoPlayer_controls").height());		
		$("#centerPlayButtonOutline,#centerPlayButton").css({"top":centerPlayShift+"px"});
	}
	
	
	}
	
	
	// LOGO POSITIONING
	// master logo
	if($("#html5VideoPlayer").attr('data-mlogo') > 0) {	 	
		
		var logoW = Math.round(parseInt($("#html5VideoPlayer").attr('data-mlogow'))*adjustX);
		var logoH = Math.round(parseInt($("#html5VideoPlayer").attr('data-mlogoh'))*adjustY);
		var logoX = Math.round(parseInt($("#html5VideoPlayer").attr('data-mlogox'))*adjustX);
		var logoY = Math.round(parseInt($("#html5VideoPlayer").attr('data-mlogoy'))*adjustY);
		
		// adjust y
		if(controls === 2) {
			
			// logo under controls
			if((logoY + logoH) > $("#html5VideoPlayer_video").height()) {
					logoY = $("#html5VideoPlayer_video").height() - logoH;
			}
			if(logoY < 0) { logoH = $("#html5VideoPlayer_video").height(); logoY = 0; }
		}
		
		$("#html5VideoPlayer_mlogo").css({"left":logoX+"px","top":logoY+"px","width":logoW+"px","height":logoH+"px"});
		$("#html5VideoPlayer_mlogo").fadeTo("fast", (100-parseInt($("#html5VideoPlayer").attr('data-mlogotran'))) / 100);	
	}
	
	
	$("#html5VideoPlayer_loading_w").css({"width":vWidth+"px","height":"50px","padding-top":($("#html5VideoPlayer_video").height()/2)-50+"px"});
	
	// smoothout first play
	//setTimeout(function(){$("#html5VideoPlayer_video,#player").fadeIn("fast");},1000);
	
	
	// if preload image
	if($("#html5VideoPlayer").attr('data-poster') > 0) {
		$("#html5VideoPlayer_poster").css({"width":vWidth+"px","height":vHeight+"px"});	
	}
	// postview 
	if($("#html5VideoPlayer").attr('data-postview') > 0) {
		$("#html5VideoPlayer_postview").css({"width":vWidth+"px","height":vHeight+"px"});	
	}
	
	
	
	// eclypse
	if(useeclipse) {
 	$("#eclipse").css({"width":vWidth+"px","height":(vHeight+1)+"px","display":"block"});
	}
	
//	if(deviceType && deviceType != 'computer' || !useautoplay || playerState != 3 && playerState != 1) {
	// 2:paused
	//if(playerState != 3 && playerState != 1 && playerState != -1 ||  
	if(!useautoplay || deviceType === 'tablet') {
	//alert(playerState);
	 showControls();
	}
	
} 
// first load
playerPosition();

// / position player


// CONTROLS

// mouse on off controls
function hideControlsMouseOff() { 
var show, hide, showing=false;
$( "#html5VideoPlayer").mouseenter(function() { 
	showing = true;	
	if(useshare) {
		$("#html5VideoPlayer_share").fadeIn("fast");
	}
	
	if($("#html5VideoPlayer").attr('data-cc') != '') {
		$("#cc").fadeTo("fast",1);	
	}
	
	show = setTimeout(function(){
		// clearTimeout(show);
	if(showing) {
		clearTimeout(show);
		showControls();
	} else {
		
	}
	},100);
})
.mouseleave(function() {
	showing = false;
	
	// $("#timedisplay").hide();
	
if(!vid.paused) { 
	
	if(useshare) { 
		if(status === 1) {
		$("#html5VideoPlayer_share").hide();
		}
	}
	
    hide = setTimeout(function(){
	if(!showing) {	 clearTimeout(hide);
	hideControls();
	
	} else {
		
	}
	},800);
}
});


$( "#html5VideoPlayer_share").mouseenter(function() { 
$("#html5VideoPlayer_share").show();
});
}
//  first time load
hideControlsMouseOff();	


function showControls() {
	
	if(controls != 3) {  
 	
	if(useppbtn || usetimedisp || usevolspke || usevolslid || usefullscr) {
	
	$("#html5VideoPlayer_controls").fadeTo('fast',1);		 
	$("#html5VideoPlayer_controls_bg").fadeTo('fast',(parseInt($("#html5VideoPlayer_controls_bg").attr('data-tran'))/100));
	}
	
	if(usetimeline) {
		if($(window).width() > 320) {
	$("#html5VideoPlayer_prog").fadeTo( "fast", 1);
		}
	}
	//}
	}
}

function hideControls() {
if(playerState === 1 || deviceType === 'tablet') {
if($("#html5VideoPlayer").attr('data-controls') != 4 && $("#html5VideoPlayer").attr('data-controls') != 2) {    
	$("#html5VideoPlayer_controls, #html5VideoPlayer_controls_bg").fadeOut("slow");
	$("#html5VideoPlayer_prog").fadeOut("slow"); 
	
	if($("#html5VideoPlayer").attr('data-cc') != '') {
		$("#cc").fadeTo("slow",0.3);	
	}
	$("#centerPlayButtonWrap").hide();
	
}
}
}


// onload controls


// CLICK CONTROLS




// autofullscreen
function goAutoFullScreen() {
fullscreenmode = true;	
		setTimeout(function(){
		$("#html5VideoPlayer_fullScreen i").removeClass('fi-arrows-expand');
		$("#html5VideoPlayer_fullScreen i").addClass('fi-arrows-compress');
		
		setTimeout(function(){
		playerPosition();
		 detectFullscreenEsc();
		},1000);
		
		},1000);
		
		
		if(vid.requestFullScreen) { 
			vid.requestFullScreen();
		} else if(vid.webkitRequestFullScreen) {
			
			vid.webkitRequestFullScreen();
		} else if(vid.mozRequestFullScreen) {
			
			vid.mozRequestFullScreen();
		}
		
		
}





/* PLAY PAUSE */  

// click on play before ready 
$("#html5VideoPlayer_controls_playpausebtn, #centerPlayButton, #centerPlayButtonOutline").click(function() {

	// useautofullscreen = true;
	if(useautofullscreen && status != 1) {
		goAutoFullScreen();
	}
	
	
	
	if(playerState === 1) {
		
		pauseVideo();
		
	} else {
		playVideo();
		
		// tablet		
		if(deviceType === 'tablet') {
		hideControls();
		}
		
	}
});


// clickmask click 



// pause video
function playPause() { 
	if($("#html5VideoPlayer").attr('data-status') != '3') {
		
		// end of video
		if($("#html5VideoPlayer").attr('data-status') === '5') {
			$("#html5VideoPlayer").attr('data-status',3);
			vidCurTime = trimmerS; 
			$("#seekTo").val(trimmerS);
			setTimeout(function(){
				seekTime();
				},1000);
			if(postview) {
			postview = false; 
			$("#html5VideoPlayer_postview").slideUp(600); 
			}
		} 
			
		playVideo();		
	} else {	
		pauseVideo();		
	}	
};

function playVideo(playVideoSeek) { 
$("#vState").val(1); vState = 1; status = 1;
if(postershowing) {
	$("#html5VideoPlayer_poster").fadeOut("fast");
	postershowing = false;	
}

if(pendingmute) {
	pendingmute = false;	
	player.mute();
}

if(playerEnded) {
	setTimeout(function(){playerEnded = false;},1000);
	
	// hide poster
	if(postview) { postview = false; 
	$("#html5VideoPlayer_postview").slideUp(600);}
	
	// go to start
	if(trimmerS) {
		player.seekTo(trimmerS); 
	}
	else {
		player.seekTo(0.1);
	}
	player.playVideo();
	
}
else if(trimmerS && player.getCurrentTime() < trimmerS) {
		player.seekTo(trimmerS);
}
else  if(playVideoSeek) {
	player.seekTo(playVideoSeek);
	player.playVideo();
	
}
else {
	
	
	player.playVideo();
}




setTimeout(function(){
		if(!inPlay) {
	seekTime();
}
		},100);

	
	
	// display items
	$("#html5VideoPlayer_controls_playpausebtn").html('<i class="fi-pause"></i>');
		if($("#html5VideoPlayer").attr('data-cplaybtn') > 0) { 
		$("#centerPlayButtonWrap").hide();
	}
		
	$("#vidInfo").hide();
	$("#vidInfo_bg").hide();
	
	
	
}

// pause video
function pauseVideo(noCenter) {
	$("#vState").val(2); vState = 2; status = 2;
	laodingring = false;
	$("#html5VideoPlayer_loading_w").hide();
	 $("#html5VideoPlayer").attr('data-status',4);
	player.pauseVideo();
	
	 $("#html5VideoPlayer_controls_playpausebtn").html('<i class="fi-play"></i>');
	if(!noCenter && $("#html5VideoPlayer").attr('data-cplaybtn') > 0 && usecontrols) { 
		 $("#centerPlayButtonWrap").show();
	}
	 showTitle();
}



// COMPILE SHOW HIDE EVENTS
var eventsShow = new Array();
	var eventsHide = new Array();
	
	// SETUP EVENT VARS (once)
	$( ".cvpEvent" ).each(function() {
	 
		// all have show time
		var id = $(this).attr('id');
		
		var t = parseInt($(this).attr('data-showt'));
		if(!eventsShow[t]) {
			eventsShow[t] = id;
		} else {
			eventsShow[t] = eventsShow[t] + '|' + id;
		}
		
		// setup hide if set
		if($(this).attr('data-hidet') > 0) {
			var t = parseInt($(this).attr('data-hidet'));
			if(!eventsHide[t]) {
				eventsHide[t] = id;
			} else {
				eventsHide[t] = eventsHide[t] + '|' + id;
			}
		}
	});
// show/hide events


// UPDATE TIME 


function seekTimeUpdate() { 
		
	// each second read cvp events
	if(Math.floor(player.getCurrentTime()) != curTime) {
			curTime = Math.floor(player.getCurrentTime());
			
			// update playtime
			$("#vCurTime").val(curTime);
			
			// backup hide
			$("#html5VideoPlayer_loading_w").hide();
			
		// process all show events, then do the same for hide
		if(eventsShow[curTime]) {
			if(eventsShow[curTime].indexOf('|') === -1) {
				
				// single event
				if($("#"+eventsShow[curTime]).is(':hidden')) {
					
				eventShow(eventsShow[curTime]);
					
				
				}
			} else {
				// multiple events
				var i = eventsShow[curTime].split('|');
				
				i.forEach(function(ii) { 
				  if($("#"+ii).is(':hidden')) {
				  eventShow(ii);
				  }
				});
					
			}
		}
		
		// process all hide events
		if(eventsHide[curTime]) {
			if(eventsHide[curTime].indexOf('|') === -1) {
				// single event
				eventHide(eventsHide[curTime]);
			} else {
				// multiple events
				var i = eventsHide[curTime].split('|');
				
				i.forEach(function(ii) { 
				    eventHide(ii);
				});
					
			}
		}
		 // / process each event
			
			
			
			
			
	} 
	
	// trimmer start
	if(pendingControlsHide) {
		laodingringTime = player.getCurrentTime(); // laodingring = false; 
		
		pendingControlsHide = false;
		setTimeout(function(){
			$("#vidInfo, #vidInfo_bg").fadeOut("fast");
			},1000);
		hideControls();		
	}
	
	// hide loading ring
	if(laodingring) {
		laodingring = false;
		laodingringTime = player.getCurrentTime();
	}
	
	if(laodingringTime && laodingringTime != player.getCurrentTime())  {
		laodingringTime = false;
		$("#html5VideoPlayer_loading_w").hide();
		
		
		
		
		if($("#html5VideoPlayer").attr('data-cc') != '') {
				$("#cc").fadeTo("slow",0.3);	
			}
		
	}
	
	if(postershowing && useautoplay) {
			$("#html5VideoPlayer_poster").fadeOut("fast");
			postershowing = false;	
		}
	
	
	var nt = player.getCurrentTime() * (100 / player.getDuration());
	
	
	var vidCurTime = player.getCurrentTime();
	if(trimmerS) {
		vidCurTime = vidCurTime - trimmerS;	
	}
	var curmins = Math.floor(vidCurTime / 60);
	var cursecs = Math.floor(vidCurTime - curmins * 60);
	var curhrs = false;
		if(curmins > 59) {
			curhrs = Math.floor(curmins / 60);
			curmins = curmins - (60*curhrs);
		}
		
	if(curmins < 10) { curmins = "0"+curmins; }
	if(cursecs < 10) { cursecs = "0"+cursecs; }
	
	if(!isNaN(curmins) && !isNaN(cursecs) && curmins > -0.1 && cursecs > -0.1) { 
	if(curhrs) {
	$("#html5VideoPlayer_timeDisplay_current").text(curhrs+":"+curmins+":"+cursecs);
	//timedisplay(curmins+":"+cursecs);	
	} else {
	$("#html5VideoPlayer_timeDisplay_current").text(curmins+":"+cursecs);
	//timedisplay(curmins+":"+cursecs);
	}
	}
	
	// load duration time if it has not been loaded
	var vidDuration = player.getDuration();
		if(trimmerE) {
			vidDuration = vidDuration - (vidDuration - trimmerE);	
		}
		if(trimmerS) {
			vidDuration = vidDuration - trimmerS;	
		}
	
	if($("#html5VideoPlayer_timeDisplay_length").text() === '00:00') {
		var durmins = Math.floor(vidDuration / 60);
		var dursecs = Math.floor(vidDuration - durmins * 60);
		var durhrs = false;
		if(durmins > 59) {
			durhrs = Math.floor(durmins / 60);
			durmins = durmins - (60*durhrs);
		}
		
		if(durmins < 10) { durmins = "0"+durmins; }
		if(dursecs < 10) { dursecs = "0"+dursecs; }
		if(!isNaN(durmins) && !isNaN(dursecs) && durmins > -0.1 && dursecs > -0.1) { 
			if(durhrs) {
			$("#html5VideoPlayer_timeDisplay_length").text(durhrs+":"+durmins+":"+dursecs);	
			} else {
			$("#html5VideoPlayer_timeDisplay_length").text(durmins+":"+dursecs);
			}
		}
	}
	
	// update play time
	if(usetimeline &&  vidDuration  > 0) {
	
	var nt = vidCurTime / vidDuration;
	
	var pixPos = nt * ($("#html5VideoPlayer_prog").width() - $("#html5VideoPlayer_progHandle").width());
	
	if(pixPos > $("#html5VideoPlayer_prog").width()) {
		pixPos = $("#html5VideoPlayer_prog").width() - (Math.ceil($("#html5VideoPlayer_progHandle").width()/2));	
	}
	// update drag pos
	if(!dragging) {	$("#html5VideoPlayer_progHandle").css({"left":pixPos+"px"}); 
	
	var fillPos = pixPos+(Math.ceil($("#html5VideoPlayer_progHandle").width()/2));
	if(fillPos > $("#html5VideoPlayer_prog").width()) {
		fillPos = $("#html5VideoPlayer_prog").width();
	}	
	$("#html5VideoPlayer_progFill").css({"width":fillPos+"px"});
	
	}
	
	// 1. get buffer fulltime/position in secods
	var buff = player.getDuration() * player.getVideoLoadedFraction();
	
	// 2. seconds ahead of current time
	var buff2 = buff - player.getCurrentTime();
	
	// 3. convert trimmed time into pixes, how many pixs in a second
	var buff3 = $("#html5VideoPlayer_prog").width() / vidDuration;
	
	var buff4 = Math.floor((buff2 * buff3) + pixPos);
	
	if(buff4 > $("#html5VideoPlayer_prog").width()) {
		buff4 = $("#html5VideoPlayer_prog").width();
	}
	
	if(buff4 > $("#html5VideoPlayer_progBuff").width()) {
	$("#html5VideoPlayer_progBuff").css({"width":buff4+"px"});
	}
	
	}
	
	
	// end of video
	if(player.getDuration() > 0 && player.getCurrentTime() > (player.getDuration() - 1) && !playerEnded || player.getDuration() > 0 && trimmerE && player.getCurrentTime() > (trimmerE - 1) && !playerEnded) {
		playerEnded = true;
		var endPlayer = setTimeout(function(){
			clearInterval(endPlayer); 
			
			if(loop) { 
			 location.reload();
			/*
				playerEnded = false;
			player.pauseVideo();
				if(trimmerS) {
					player.seekTo(trimmerS);
				} else {
					player.seekTo(0);
				}
				//setInterval(function(){player.playVideo(); alert(1);},200);
				
				//setInterval(function(){playVideo(); },2000);
			*/
			}
			else {
			
				status = 5;
				pauseVideo();	
				$("#html5VideoPlayer_progFill").css({"width":"100%"});
			
			
			
				
			if($("#html5VideoPlayer").attr('data-forward') != '') {
			
			if(!forwarded) {
			forwarded = true;
			window.top.location.href = $("#html5VideoPlayer").attr('data-forward'); 
				}
			}
			else if($("#html5VideoPlayer").attr('data-postview') > 0) {
			$("#html5VideoPlayer_postview").css({"width":$(window).width()+"px","height":$(window).height()+"px"});
			$("#html5VideoPlayer_postview").fadeIn("fast");
				postview = true;
			}
			
			}
			
			// test loop xxx
			// test loop
			
			
			
			
		
			},1000);
	}
}
// / update time



// VOLUME 

$("#html5VideoPlayer_controls_speaker").click(function(){
	vidMute();
});

function setVolume(val) {
	player.setVolume(val);
}


// mute video 

function vidMute() {
	if(player.isMuted()) { 
		var nVol = parseInt($( "#html5VideoPlayer_controls_speaker_w" ).attr('data-default'));
		if(nVol < 1) {
			nVol = 100;
		}
		
		$("#html5VideoPlayer_controls_speaker i").removeClass('fi-volume-strike');
		$("#html5VideoPlayer_controls_speaker i").addClass('fi-volume');
		
		player.unMute();
		player.setVolume(nVol);		
		
	} else {
		player.mute();
		var returnVol = $( "#html5VideoPlayer_controls_speaker_w" ).attr('data-default');
		$( "#html5VideoPlayer_controls_speaker_w" ).attr('data-default',returnVol);
		$("#html5VideoPlayer_controls_speaker i").removeClass('fi-volume');
		$("#html5VideoPlayer_controls_speaker i").addClass('fi-volume-strike');
				
		//vid.muted = true;
	}	
}

// /  volume


/* FULL SCREEN */ 

function useFullscreen() {
		
	$("#html5VideoPlayer_fullScreen").click(function() {
		toggleFullScreen();
		
		});
	
function toggleFullScreen() {
	
	// exit full screen
	if(fullscreenmode) {
		fullscreenmode = false;
		setTimeout(function(){
		$("#html5VideoPlayer_fullScreen i").removeClass('fi-arrows-compress');
		$("#html5VideoPlayer_fullScreen i").addClass('fi-arrows-expand');
		},800);
		if(document.cancelFullScreen) {
         	document.cancelFullScreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
		} else if(document.webkitCancelFullScreen) {
        	document.webkitCancelFullScreen();
		} else {
			document.msExitFullscreen();
		}
	}
	
	// enter full screen
	else {
		
		fullscreenmode = true;	
		setTimeout(function(){
		$("#html5VideoPlayer_fullScreen i").removeClass('fi-arrows-expand');
		$("#html5VideoPlayer_fullScreen i").addClass('fi-arrows-compress');
		},800);
		
		if(vid.requestFullScreen) {
			vid.requestFullScreen();
			
		} else if(vid.webkitRequestFullScreen) {
			
			vid.webkitRequestFullScreen();
		} else if(vid.mozRequestFullScreen) {
			
			vid.mozRequestFullScreen();
		} else {
			
			vid.msRequestFullscreen();
		}
		
		setTimeout(function(){playerPosition();},1000);
		
		detectFullscreenEsc();
	}
}

function detectFullscreenEsc() {
	
	var fullScreenEsc = setInterval(function(){
	if(fullscreenmode) {
      var isFullscreen = ((typeof document.webkitIsFullScreen) !== 'undefined') ? document.webkitIsFullScreen : document.mozFullScreen;
	  if(!isFullscreen) { 
	  fullscreenmode = false; 
	  } else {
			// in full screen
			hideControls();
			
			$(window).mousemove(function( event ) {
				showControls();
				var to = setTimeout(function(){
					clearTimeout(to);
					hideControls();
					},2000);
				});
			  
	  }
	} else { 
	
	// full screen exited
	clearInterval(fullScreenEsc);
		
	$("#html5VideoPlayer_fullScreen i").removeClass('fi-arrows-compress');
	$("#html5VideoPlayer_fullScreen i").addClass('fi-arrows-expand');
		
	setTimeout(function(){playerPosition();},1000);
	// backup for slow exit
	setTimeout(function(){playerPosition();},3000);
	}	
	},250);	
}


	
} // / Full Screen



// RESIZE WINDOW
if(!deviceType || deviceType === 'computer') {
$( window ).resize(function() {
	var sizeAdjust = setTimeout(function(){
		clearTimeout(sizeAdjust);
		playerPosition();
		},100);
});
}

// EXTRA FUNCTIONS 
 

function colorLuminance_mv(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}
	return rgb;
}

$(".gogo").click(function(){ 

	// cash clicks
	if($(this).attr('data-name') === 'cc') {
		
		gogoLink = "http://customvideoplayer.net?cc="+$(this).attr('data-value');
	}
	else if($(this).attr('data-gogo') != '') {
		gogoLink = $(this).attr('data-gogo');
	}
	
	if(gogoLink) {
		
		if(fullscreenmode) {
			 if(document.cancelFullScreen) {
                    document.cancelFullScreen();
                } 
                else if(document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } 
              else if(document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
        	}
		fullscreenmode = false;
		}
		
		window.open(gogoLink,'title', "width=1200, height=2000");
		
		pauseVideo();			
	}
	
	
	});

$(".gogo").each(function( index ) {
	if($(this).attr('data-gogo') != '') {
		$(this).addClass('pointer');
	}
});

function cssCurves(target,val) {
$(target).css({"border-radius":val+"px"});
$(target).css({"-moz-border-radius":val+"px"});
$(target).css({"-webkit-border-radius":val+"px"});
$(target).css({"-khtml-border-radius":val+"px"});
}
// / extra global functions

/* 
#############
CVP EVENTS 
#############
*/


	
// ONLOAD EVENTS
if($("#eventsOnLoad").val() != '') {
	var eachEvent = $("#eventsOnLoad").val().split(',');
	$.each(eachEvent, function(index, value) {
		eventShow(value);	
	});
}

$(".preventDefault").submit(function(e){
	e.preventDefault();
});


// event size adjust

function eventResize() {
	
	$( ".cvpEvent" ).each(function() {
		
	if($(this).is(":visible")) {
		var id = '#'+$(this).attr("id");
		// reposition x and y
		var newX = Math.round(parseFloat($(this).attr('data-px')) * vWidth);
		var newY = Math.round(parseFloat($(this).attr('data-py')) * vHeight);
		
		$(id).css({"left":newX+"px","top":newY+"px","width":Math.round(parseFloat($(id).attr("data-pwidth")) * vWidth)+"px","height":Math.round(parseFloat($(id).attr("data-pheight")) * vHeight)+"px"});
		
		// image
		if($(id).attr('data-type') === 'image') {
		$(id+"Img").css({"width":Math.round(parseFloat($(id).attr("data-pwidth")) * vWidth)+"px","height":Math.round(parseFloat($(id).attr("data-pheight")) * vHeight)+"px"});
		}
		
	}
				
	});
	
} // / event size adjust



/* OPTIN EVENTS */
$(".eventOptinSubmitGo").click(function(e){
	var windowTarget = $(this).attr('data-window');
	var target = $(this).attr('data-target');
	e.preventDefault();
	// get name if visible, get email
	var clientId = "";
	if($("#client").val() != '') {
		clientId = $("#client").val();
	} 
	
	var dataString = 'eventoptin='+$(this).attr('data-event')+'&client='+client+"&";
	if ($("#"+target+"OptinNameInput").is(':visible')) {
		
    	dataString = dataString + 'name='+$("#"+target+"OptinNameInput").val();
	}
	
	if ($("#"+target+"OptinEmailInput").is(':visible')) {
			
	// add notify if there
	var videoUrl = (window.location != window.parent.location) ? document.referrer: document.location;	
	videoUrl = encodeURIComponent(videoUrl);
	
	var dataPost;
	
	if($("#"+target+"OptinEmailInput").is(':visible') && $("#"+target+"OptinNameInput").is(':visible')) {
		dataPost = {eventoptin: $(this).attr('data-event'), client: clientId, name:  $("#"+target+"OptinNameInput").val(), email: $("#"+target+"OptinEmailInput").val(), videourl: videoUrl };
		
	} else {
		// just email
		dataPost = {eventoptin: $(this).attr('data-event'), client: clientId, email: $("#"+target+"OptinEmailInput").val(), videourl: videoUrl };
	}
$.ajax({
type: "POST",
url: 'mail.php',
//data: dataString,
data: dataPost,
dataType: 'html',
success: function (response) {
		if(response != '') {
			
			var action = response.split('|');
			// response: success|redirect|http://youtube.com|self
			
			if(action[1] === 'redirect') {
				// 2: link, 3: target
				if(action[3] && action[3] === 'self') {
					window.self.location.href = action[2];
				}
				else if(action[3] && action[3] === 'blank') {
					if(action[2] && action[2] != '') {
					window.open(action[2],'title', "width=1000, height=2000");	
					} 
				}
				else if(action[2] && action[2] != '') {
				window.top.location.href = action[2];
				}
			}
			
			if(action[2] === '' || action[3] === 'blank') {
				$("#"+target).slideUp("fast");
					setTimeout(function(){
						$("#"+target+"overlay").fadeOut("fast");
						},400);
			}
			
		}
        },
error: function (response) {
			
		}
});
		
		
	}
    



	
});


// event optin validation
$(".optinInputValidate").on("input", function() {
	var target = $(this).attr('data-target');
	
	setTimeout(function(){
		eventOptinValidate(target);
		},100);
	
});


function eventOptinValidate(target, showError) {
	
	// check email
	var validEmail=false;
	
	if(isValidEmailAddress($("#"+target+"OptinEmailInput").val())) {
	$("#"+target+"OptinEmailInput").css({"border-top-color":"#71F8B3","border-right-color":"#71F8B3","border-left-color":"#71F8B3","border-bottom-color":"#71F8B3"});
	validEmail = true;
	eventInputValid("#"+target+"OptinEmailInput");	
	}
	if(showError) {
				// add error class to optin name
				eventInputInvalid("#"+target+"OptinEmailInput");	
			}
	
	// valid forms
	var validName=true;
	if($("#"+target+"OptinNameInput").is(':visible')) {
    	
		if($("#"+target+"OptinNameInput").val().length < 3) {
			validName=false;
			eventInputValid("#"+target+"OptinNameInput");	
		} else {
			if(showError) {
				// add error class to optin name
				eventInputInvalid("#"+target+"OptinNameInput");	
			}
		}
	}
	if(validEmail && validName) {
		//$("#"+target+"OptinSubmitInput").prop('type', 'submit');
		$("#"+target+"OptinSubmitInput_disabled").hide();
		$("#"+target+"OptinSubmitInput").show();
		
		return true;
		
	} else {
		
		$("#"+target+"OptinSubmitInput").hide();
		$("#"+target+"OptinSubmitInput_disabled").show();
	}
	
	
	
}

$('.targetblank').submit(function(e) {
  // e.preventDefault();
   var target = $(this).attr('data-target');
   $("#"+target).fadeOut("fast");
});


$(".eventOptinSubmit").click(function() {
	if($(this).attr('type') != 'submit') {
		var target = $(this).attr('data-target');
		// invalid email or missing name
		
		
		
		// name
		var validName=true;
		if($("#"+target+"OptinNameInput").is(':visible')) {
    		if($("#"+target+"OptinNameInput").val().length < 3) {
				validName=false;
				eventInputInvalid("#"+target+"OptinNameInput");
			}
		}
		// email
		var validEmail=false;
		if(isValidEmailAddress($("#"+target+"OptinEmailInput").val())) {
		eventInputValid("#"+target+"OptinEmailInput");
		validEmail = true;
		} else {
			eventInputInvalid("#"+target+"OptinEmailInput");	
		}
	
		
	}	
});

function eventInputInvalid(fullTarget) {
	$(fullTarget).css({"border-top-color":"#F00","border-right-color":"#F00","border-left-color":"#F00","border-bottom-color":"#F00"});	
}
function eventInputValid(fullTarget) {
	$(fullTarget).css({"border-top-color":"#71F8B3","border-right-color":"#71F8B3","border-left-color":"#71F8B3","border-bottom-color":"#71F8B3"});	
}

$(".eventOptinInput").click(function() {
	$(this).attr("placeholder","");
});

function isValidEmailAddress(email) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(email);
};


// enter first and last name for infusion soft
$(".optinInfusionName").on("input", function() {
	var part = $(this).val().split(" ");
	var id = '#'+$(this).attr('id');
	if(part.length > 1) {
		$(id+"_firstname").val(part.shift());
		$(id+"_lastname").val(part.join(" "));
	} else {
		$(id+"_firstname").val($(this).val());
		$(id+"_lastname").val("");
	}
});

// / event optin validation 


// Event SHOW

function eventShow(id) {
	var cl = "."+id;
	id = "#"+id;
	
				
		
	var effect = $(id).attr('data-show');
	var speed = $(id).attr('data-showsp');
	var type = $(id).attr('data-type');
	var x = parseInt($(id).attr('data-px')*parseInt(vWidth));
	var y = parseInt($(id).attr('data-py')*parseInt(vHeight));
	var o = parseFloat($(id).attr('data-op'));
	var w = parseInt(parseFloat($(id).attr('data-pwidth'))*parseInt(vWidth));
	var h = parseInt(parseFloat($(id).attr('data-pheight'))*parseInt(vHeight))+1;
	speed = (400 + (speed*400));
	
	
	
	// check overlay
	if($(id).attr('data-overlay') != 'none' && $(id).attr('data-overlay') != '') {
		var overlay = $(id).attr('data-overlay');
		$(id+"overlay").css({"background-color":overlay,"width":Math.round(vWidth+5)+"px","height":Math.round(vHeight+5)+"px"});
		$(id+"overlay").fadeTo(speed, parseFloat($(id).attr('data-overlayo')));		
	}
	
	// adjust image size based on window
	if(type === 'image') {
		$(id+"Img").css({"width":w+"px","height":h+"px"});
		$(id).css({"height":h+"px"});
	}
	else if(type === 'optin') {
		$(id).css({"min-height":h+"px"});
	}
	
	// fade in
	if(effect === 'fadeIn') {	
		$(id).css({"left":x+"px","top":y+"px","width":w+"px"});		
		$(id).fadeTo(speed, o);
	}
	// slideDown
	else if(effect === 'slideDown') {
		var move = vHeight+x;
		$(id).css({"left":x+"px","top":(y-move)+"px","display":"block","width":w+"px"});
		$(id).css({"opacity":o});
		$(id).animate({
			opacity: o,
			top: "+="+move				
		}, speed);
	}
	// slideUp
	else if(effect === 'slideUp') {
		var move = vHeight-x;
		$(id).css({"left":x+"px","top":(y+move)+"px","display":"block","width":w+"px"});
		$(id).css({"opacity":o});
		$(id).animate({
			opacity: o,
			top: "-="+move				
		}, speed);
		
	}
	// slideLeft
	else if(effect === 'slideLeft') {
		var move = vWidth-x;
		$(id).css({"left":(x+move)+"px","top":y+"px","display":"block","width":w+"px"});
		$(id).css({"opacity":o});
		$(id).animate({
			opacity: o,
			left: "-="+move				
		}, speed);
		
	}
	// slideRight
	else if(effect === 'slideRight') {
		var move = w+x;
		$(id).css({"left":(x-move)+"px","top":y+"px","display":"block","width":w+"px"});
		$(id).css({"opacity":o});
		$(id).animate({
			opacity: o,
			left: "+="+move				
		}, speed);
	}
	// no effect, just show
	else { 
	$(id).css({"opacity":o});
		$(id).css({"left":x+"px","top":y+"px","display":"block","width":w+"px"});
		
	}
	
	// show event OPTIN size 
	if(type === 'optin') { 
		
		var totalWidth = $(id).width();
		var numInputs = $(cl+"Input").length;
		var inputWidth;
		
		
		//alert(id);
		// OPTIN STYLING 
		//alert($(id).attr('data-r9'));
		// Optin Button
		if($(id).attr('data-r9') != '') {
			var subBgColor = $(id).attr('data-r9');
		
		
		gradientBg('#OptinSubmitInput',4,subBgColor, 0,0.5, 30,-0.2, 51,-0.3, 100,-0.4);
		
		// new
		gradientBg(id+' .eventOptinSubmit',4,subBgColor, 0,0.5, 30,-0.2, 51,-0.3, 100,-0.4);
		
	
	// hover
	$(cl+"OptinSubmitInput").mouseover(function() {
		gradientBg('#OptinSubmitInput',4,subBgColor, 0,0.5, 30,-0.2, 51,-0.3, 100,-0.4);
		
});	
	
	// hover leave
	$(cl+"OptinSubmitInput").mouseleave(function() {
		
		gradientBg('#OptinSubmitInput',4,subBgColor, 0,0.5, 30,-0.2, 51,-0.3, 100,-0.4);
	
		
	});
		
	$(cl+"OptinSubmitInput").css({"border":"1px solid "+colorLuminance_pe(subBgColor, 0.5)});
				
		}
		
		// optin bg bgColor
				
		if($(id).attr('data-r22') != '' && $(id).attr('data-r22') != '#FFFFFF' && $(id).attr('data-r22') != '#000000') {
			
			var bgColor = $(id).attr('data-r22');
			
			gradientBg(id,2,bgColor, 0,0.1, 100,-0.1);
			
		
				
		}
		
		// OPTIN STYLING 
		
		// get total fields width
		var fieldsWidth = $(id+"OptinSubmitInput").width();
		
		$(cl+"Input").each(function(index) {
			fieldsWidth = fieldsWidth + $(this).width();
		});
		
		if((w - 50) > fieldsWidth) {
			var adjustWidth = (w - 50) / fieldsWidth;
			if(adjustWidth > 1) {
				$(cl+"Input").each(function(index) {
					$(this).css({"width":Math.floor($(this).width()*adjustWidth)+"px"});
				});
				$(id+" .eventOptinSubmit").css({"width":Math.floor($(id+"OptinSubmitInput").width()*adjustWidth)+"px"});
			}
			
		}
		// not fitting horizontal
		 else {
	
	if(w > (fieldsWidth - $(id+"OptinSubmitInput").width())) {
		// fits input fields
		$(id+" .eventOptinSubmit").css({"width":(w-85)+"px"});	
		var newInputWidth = Math.floor(((w-50) / $(cl+"Input").length) - Math.floor((50 / $(cl+"Input").length)));
		$(cl+"Input").css({"width":newInputWidth+"px"});
		
		
		
	} else {
		
		// no room for input fields
		$(cl+"Input").each(function(index) {
			$(this).css({"width":(w-50)+"px"});
		});
		$(id+" .eventOptinSubmit").css({"width":(w-50)+"px"});	
	}
}
		
		
		

	var padding = Math.round(($(id).height() - $(id+"Inner").height()) / 2);
		if(padding > 0) {
			$(id+"Inner").css({"margin-top":padding+"px"});
		}
			
	} // / optin show event
	
	// pause at start of event
	if($(id).attr('data-stop') === '1') {
		pauseVideo('noCenter');	
	}
	
}

// Event HIDE
function eventHide(id) { 
	id = "#"+id; 
	var effect = $(id).attr('data-hide');
	var speed = $(id).attr('data-hidesp');
	var x = parseInt($(id).attr('data-px')*parseInt(vWidth));
	var y = parseInt($(id).attr('data-py')*parseInt(vHeight));
	var o = parseFloat($(id).attr('data-op'));
	var w = parseInt(parseFloat($(id).attr('data-pwidth'))*parseInt(vWidth));
	var h = parseInt(parseFloat($(id).attr('data-pheight'))*parseInt(vHeight));
	speed = (400 + (speed*400));
	
	
	
	$(id+"overlay").fadeOut(speed);
		setTimeout(function() {
			$(id+"overlay").remove();
		},speed);
		
	// fade in
	if(effect === 'fadeOut') { 		
	    $(id).fadeOut(speed, function(){
            $(id).css({"left":"-1px","top":"-1px","display":"none","width":"1px","height":"1px"});
        });
   
		
	}
	// slideDown
	else if(effect === 'slideDown') {
		var move = vHeight+x;
		$(id).animate({
			opacity: o,
			top: "+="+move				
		}, speed,  function() {
		$(id).css({"left":"-1px","top":"-1px","display":"none","width":"1px","height":"1px"});
		});
	}
	// slideUp
	else if(effect === 'slideUp') {
		var move = vHeight-x;
		$(id).animate({
			opacity: o,
			top: "-="+move				
		}, speed, function() {
		$(id).css({"left":"-1px","top":"-1px","display":"none","width":"1px","height":"1px"});
		});
		
	}
	// slideLeft
	else if(effect === 'slideLeft') {
		var move = x + w;
		$(id).animate({
			opacity: o,
			left: "-="+move				
		}, speed, function() {
	$(id).css({"left":"-1px","top":"-1px","display":"none","width":"1px","height":"1px"});
		});
		
	}
	// slideRight
	else if(effect === 'slideRight') {
		var move = vWidth-x;
		$(id).animate({
			opacity: o,
			left: "+="+move				
		}, speed, function() {
		$(id).css({"left":"-1px","top":"-1px","display":"none","width":"1px","height":"1px"});
		});
	}
	// no effect, just show
	else { 
	$(id).css({"left":"-1px","top":"-1px","display":"none","width":"1px","height":"1px"});
			
	}
	
	
	// pause at start of event
	if($(id).attr('data-stop') === '2') {
		pauseVideo('noCenter');	
	}
	
}


function colorLuminance_pe(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}
	return rgb;
}

// update seek time (youtube)
function seekTime() {
inPlay = setInterval(function(){
	
	vState = parseInt($("#vState").val());
	
	
	if(vState === 1) { //  && status != 2
		$("#centerPlayButtonWrap").hide();
		if(infoshowing) { infoshowing = false; $("#vidInfo,#vidInfo_bg").fadeOut("slow"); }
		$("#html5VideoPlayer_controls_playpausebtn").html('<i class="fi-pause"></i>');
	}
	
	if(vState === 2) {
		$("#html5VideoPlayer_controls_playpausebtn").html('<i class="fi-play"></i>');
		showTitle();
		if(usecplaybtn) { $("#centerPlayButtonWrap").show();}
	} else if(vState > -1) { seekTimeUpdate();}
	
	//state = vState;
	//seekTimeUpdate();
	
	}, 250);
}
seekTime();

});