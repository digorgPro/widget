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
	
	//单个相对鼠标移动特效
	$.fn.shaoMouseMove = function(options){
		var settings = $.extend({
			multiple : 0.1, //位移幅度
			time : 20 //触发移动时间
		}, options);
		var _this = this,
			mouse = {
				X : 0,
				Y : 0,
				CX : 0,
				CY : 0
			},
			block = {
				X : mouse.X,
				Y : mouse.Y,
				CX : mouse.CX,
				CY : mouse.CY
			},
			flag = true,
			interval;
		$(_this).on({
			mousemove: function(e){
				mouse.X = (e.pageX - $(_this).offset().left) - $(_this).width() / 2;
				mouse.Y = (e.pageY - $(_this).offset().top) - $(_this).height() / 2;
				flag = false;
			},
			mouseleave: function(e){
				mouse.X = mouse.CX;
				mouse.Y = mouse.CY;
				flag = true;
			}
		});
		interval = setInterval(calc, settings.time);	
		function calc(){
			if(flag){
				$(_this).css({
	  			  	transform : 'translate(0px, 0px)'
				});
				return;
			}
			block.CX += (mouse.X - block.CX) / 12;
			block.CY += (mouse.Y - block.CY) / 12;
			$(_this).css({
  			  	transform : 'translate(' + (block.CX * settings.multiple) + 'px, '
  			  	 + (block.CY * settings.multiple) + 'px)',
				'-ms-transform' : 'translate(' + (block.CX * settings.multiple) + 'px, '
  			  	 + (block.CY * settings.multiple) + 'px)',
				'-moz-transform' : 'translate(' + (block.CX * settings.multiple) + 'px, '
  			  	 + (block.CY * settings.multiple) + 'px)',
				'-webkit-transform' : 'translate(' + (block.CX * settings.multiple) + 'px, '
  			  	 + (block.CY * settings.multiple) + 'px)',
				'-o-transform' : 'translate(' + (block.CX * settings.multiple) + 'px, '
  			  	 + (block.CY * settings.multiple) + 'px)'
			});
		}
	}
	
	//多个相对鼠标移动特效
	$.fn.shaoMouseMoveMore = function(options){
		var settings = $.extend({
			multiple : 0.1, //位移幅度
			time : 20 //触发移动时间
		}, options);
		var _this = this,
			$item = $(_this).find('.item'),
			flag = true,
			mouseArr = [],
			blockArr = [],
			interval;
		$item.each(function(){
			var mouse = {
					X : 0,
					Y : 0,
					CX : 0,
					CY : 0
				},
				block = {
					X : mouse.X,
					Y : mouse.Y,
					CX : mouse.CX,
					CY : mouse.CY
				};
			mouseArr.push(mouse);
			blockArr.push(block);
		});
		$(_this).on({
			mousemove: function(e){
				$item.each(function(){
					var index = $(this).index();
					mouseArr[index].X = (e.pageX - $(this).offset().left) - $(this).width() / 2;
					mouseArr[index].Y = (e.pageY - $(this).offset().top) - $(this).height() / 2;
				});
				flag = false;
			},
			mouseleave: function(e){
				$item.each(function(){
					var index = $(this).index();
					mouseArr[index].X = mouseArr[index].CX;
					mouseArr[index].Y = mouseArr[index].CY;
				});
				flag = true;
			}
		});
		interval = setInterval(calc, settings.time);	
		function calc(){
			if(flag){
				$item.each(function(){
					var index = $(this).index();
					$(this).css({
		  			  	transform : 'translate(0px, 0px)'
					});
				});
				return;
			}
			$item.each(function(){
				var index = $(this).index();
				blockArr[index].CX += (mouseArr[index].X - blockArr[index].CX) / 12;
				blockArr[index].CY += (mouseArr[index].Y - blockArr[index].CY) / 12;
				$(this).css({
	  			  	transform : 'translate(' + (blockArr[index].CX * settings.multiple) + 'px, '
	  			  	 + (blockArr[index].CY * settings.multiple) + 'px)',
					'-ms-transform' : 'translate(' + (blockArr[index].CX * settings.multiple) + 'px, '
	  			  	 + (blockArr[index].CY * settings.multiple) + 'px)',
					'-moz-transform' : 'translate(' + (blockArr[index].CX * settings.multiple) + 'px, '
	  			  	 + (blockArr[index].CY * settings.multiple) + 'px)',
					'-webkit-transform' : 'translate(' + (blockArr[index].CX * settings.multiple) + 'px, '
	  			  	 + (blockArr[index].CY * settings.multiple) + 'px)',
					'-o-transform' : 'translate(' + (blockArr[index].CX * settings.multiple) + 'px, '
	  			  	 + (blockArr[index].CY * settings.multiple) + 'px)'
				});
			});
		}
	}
	//banner轮播
	
})(jQuery);
