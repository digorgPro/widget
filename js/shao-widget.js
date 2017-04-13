(function($){
	//产品列表轮播
	$.fn.shaoSlider = function(options){
		var settings = $.extend({
			displaySlideNum: 4, //显示li个数
			moveSlideNum: 1, //移动li个数
			auto: true, //自动滑动
			autoTime: 1500, //轮播速度
			controlsBtn: true, //显示左右按钮
			controlsPoint: false, //显示点
			marginRight: 20, //li间距
			response: true //是否自适应
		}, options);
		
		var _this = this,
			displaySlideNum = settings.displaySlideNum,
			ul = $(_this).find('ul'),
			ALi = ul.find('li'),
			ALen = ALi.length,
			sliderWidth,
			liWidth,
			interval;
		if(settings.response){
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
					settings.controlsBtn = false;
					settings.controlsPoint = true;
				}
				if(sliderWidth < 400){
					displaySlideNum = 1;
					settings.controlsBtn = false;
					settings.controlsPoint = true;
				}
		    	init();
		    }
		} else{
			sliderWidth = $(_this).width();
			displaySlideNum = settings.displaySlideNum;
			init();
		}
	    
	    function init(){
			liWidth = parseInt((sliderWidth - (displaySlideNum - 1)*settings.marginRight)/displaySlideNum);
	    	ul.css({
	    		width: (liWidth + settings.marginRight)* ALen + 'px'
	    	});
	    	ALi.css({
	    		width: liWidth + 'px',
	    		marginRight: settings.marginRight + 'px'
	    	});
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
			if(settings.auto){
				interval = setInterval(auto, settings.autoTime);
			} else{
				auto();
			}
			
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
				if(settings.auto){
					interval = setInterval(auto, settings.autoTime);
				} else{
					auto();
				}
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
				if(settings.auto){
					interval = setInterval(auto, settings.autoTime);
				} else{
					auto();
				}
		    }
		    function prev(){
		    	clearInterval(interval);
		    	index--;
		    	if(index < 0){
		    		index =0;
		    	}
				if(settings.auto){
					interval = setInterval(auto, settings.autoTime);
				} else{
					auto();
				}
		    }
		    function auto(){
				if(settings.auto){
		    		if(settings.controlsPoint && !settings.controlsBtn){
				    	index += displaySlideNum;
				    	if(index >= ALen){
				    		index = 0;
				    	}
			    	} else{
			    		index++;
				    	if(index > ALen - displaySlideNum){
				    		index = 0;
				    	}
			    	}
			    	
				$(_this).find('.point').removeClass('active');
				$(_this).find('.point').eq(parseInt(index/displaySlideNum)).addClass('active');
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
	
	//图片查看器
	$.fn.shaoPic = function(options) {
		var _this = this,
			index = 0;
		defaultVal = {
			speed: 800
		};
		var opt = $.extend(defaultVal, options);
		var plImgshow = _this.find(".piclist .picimg");
		var len = plImgshow.length;
		var showimg = _this.find(".picshow");
		var imghtml = _this.find(".piclist").html();
		var plImg;
		plImgshow.click(function() {
			$("html,body").css("overflow", "hidden");
			index = $(this).index();
			showimg.prepend(imghtml);
			plImg = showimg.find(".picimg");
			plImg.eq(index).css("opacity", "1");
			showimg.animate({
				top: "0"
			});

		});
		var plNext = showimg.find(".next");
		var plClose = showimg.find(".close");

		if(len > 1) {

			plNext.click(function() {
				if(!plImg.is(":animated")) { //判断元素是否正处于动画状态
					plImg.eq(index).css("z-index", "200").animate({
						top: "100%"
					}, opt.speed, function() {
						$(this).css({
							"top": "0",
							"opacity": "0",
							"z-index": "100"
						});

					});
					if(index == plImg.length - 1) {
						plImg.eq(0).css({
							"opacity": "1",
							"z-index": "80"
						});
						index = 0;
					} else {
						plImg.eq((index + 1)).css({
							"opacity": "1",
							"z-index": "80"
						});
						index = index + 1;
					}
				}

			});
			var browser = window.navigator.userAgent.toLowerCase().indexOf('firefox');

			if(browser != -1) {
				//处理火狐滚轮事件
				showimg[0].addEventListener('DOMMouseScroll', function(ev) {
					var oEvent = ev || event;
					if(oEvent.detail > 0) { //向上滚动
						plNext.click();
					}
				});
			} else {
				//其他浏览器
				showimg[0].onmousewheel = function(ev) {
					var oEvent = ev || event; //上下滚轮动作判断
					if(oEvent.wheelDelta < 0) { //向下滚动
						plNext.click();
					}
				}
			}
		}
		plClose.click(function() {

			showimg.css({
				"top": "-150%"
			});
			plImg.remove();
			$("html,body").css("overflow", "visible");
		});

	}
	
	
	//banner轮播
	
})(jQuery);
