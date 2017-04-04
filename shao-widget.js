(function($){
	$.fn.shaoSlider = function(options){
		var settings = $.extend({
			displaySlideNum: 4, //显示li个数
			moveSlideNum: 1, //移动li个数
			auto: true, //自动滑动
			autoTime: 1500,
			controlsBtn: true, //显示左右按钮
			controlsPoint: false, //显示点
			marginRight: 20 //li间距
		}, options);
		
		var _this = this,
			displaySlideNum = settings.displaySlideNum,
			ul = $(_this).find('ul'),
			ALi = ul.find('li'),
			ALen = ALi.length,
			sliderWidth,
			liWidth,
			interval;
	    window.onresize = adjuest;
	    adjuest();
	    function adjuest(){
			sliderWidth = $(_this).width();
			displaySlideNum = settings.displaySlideNum;
			if(sliderWidth < 1200){
				displaySlideNum = 3;
			}
			if(sliderWidth < 600){
				displaySlideNum = 2;
			}
			if(sliderWidth < 400){
				displaySlideNum = 1;
			}
			liWidth = parseInt((sliderWidth - (displaySlideNum - 1)*settings.marginRight)/displaySlideNum);
	    	ul.css({
	    		width: (liWidth + settings.marginRight)* ALen + 'px'
	    	});
	    	ALi.css({
	    		width: liWidth + 'px',
	    		marginRight: settings.marginRight + 'px'
	    	});
	    	init();
	    }
	    
	    function init(){
	    	var index = 0,
			$arrL = $('<span class="arr arr-l"></span>'),
			$arrR = $('<span class="arr arr-r"></span>'),
			$pointBox = $('<div class="point-box"></div>');
			clearInterval(interval);
			$(_this).find('.arr').remove();
			$(_this).find('.point-box').remove();
			if(settings.controlsBtn){
				$(_this).append($arrL, $arrR);
			}
			if(settings.controlsPoint){
				var $point;
				for(var i = 0; i < Math.ceil(ALen/displaySlideNum); i++){
					$point = $('<span class="point"><span>');
					$point.data('index', i);
					if(i == index){
						$point.addClass('active');
					}
					$pointBox.append($point);
				}
				$(_this).append($pointBox);
			}
				interval = setInterval(auto, settings.autoTime);
			
		    $(_this).on('click', '.arr-r', function(event){
		    	next();
		    	return false;
		    });
		    $(_this).on('click', '.arr-l', function(event){
		    	prev();
		    	return false;
		    });
		    $(_this).on('click', '.point', function(event){
		    	$(this).siblings().removeClass('active');
		    	$(this).addClass('active');
		    	index = $(this).data('index') * displaySlideNum;
		    	clearInterval(interval);
				interval = setInterval(auto, settings.autoTime);
		    	move();
		    	return false;
		    });
		    
		    function next(){
		    	clearInterval(interval);
		    	index++;
		    	if(index > ALen - displaySlideNum){
		    		index = 0;
		    	}
				move();
				interval = setInterval(auto, settings.autoTime);
		    }
		    function prev(){
		    	clearInterval(interval);
		    	index--;
		    	if(index < 0){
		    		index =0;
		    	}
		    	interval = setInterval(auto,  settings.autoTime);
		    	move();
		    }
		    function auto(){
				if(settings.auto){
			    	index++;
			    	if(index > ALen - displaySlideNum){
			    		index = 0;
			    	}
			    	move();
				}
		    }
		    function move(){
				ul.stop(true, false).animate({
					'margin-left': -(liWidth + settings.marginRight) * index
				}, 400);
		    }
	    }
	    
	}
})(jQuery);
