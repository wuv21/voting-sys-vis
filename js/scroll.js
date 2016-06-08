$(document).ready(function() {
	$(".section-link").on('click',function (event) {
	    event.preventDefault();

	    var target = this.hash;
	    var $target = $(target);
		  var x = $(window).width();

			if (x < 800) {
				$('html, body').stop().animate( {
		        'scrollTop': $target.offset().top - 120
		    }, 1500, 'swing');
	    } else {
				$('html, body').stop().animate( {
		        'scrollTop': $target.offset().top
		    }, 1500, 'swing');
			}
	});

	$(".fn-toward").on('click',function (event) {
	    event.preventDefault();

	    var target = this.hash;
	    var $target = $(target);
		  var x = $(window).width();

			if (x < 800) {
				$('html, body').stop().animate( {
		        'scrollTop': $target.offset().top - 120
		    }, 1500, 'swing');
	    } else {
				$('html, body').stop().animate( {
		        'scrollTop': $target.offset().top
		    }, 1500, 'swing');
			}
	});

	$(".fn-back").on('click',function (event) {
	    event.preventDefault();

	    var target = this.hash;
	    var $target = $(target);
		  var x = $(window).width();

			if (x < 800) {
				$('html, body').stop().animate( {
		        'scrollTop': $target.offset().top - 120
		    }, 1500, 'swing');
	    } else {
				$('html, body').stop().animate( {
		        'scrollTop': $target.offset().top
		    }, 1500, 'swing');
			}
	});

	$("#toTopLink").on('click',function (event) {
	    event.preventDefault();

	    var target = this.hash;
	    var $target = $(target);
		  var x = $(window).width();

			if (x < 800) {
				$('html, body').stop().animate( {
		        'scrollTop': $target.offset().top - 140
		    }, 1500, 'swing');
	    } else {
				$('html, body').stop().animate( {
		        'scrollTop': $target.offset().top - 140
		    }, 1500, 'swing');
			}
	});
});
