$(document).ready(function() {
	$(".section-link").on('click',function (event) {
	    event.preventDefault();

	    var target = this.hash;
	    var $target = $(target);
		  var x = $(window).width();

			if (x < 800) {
				$('html, body').stop().animate( {
		        'scrollTop': $target.offset().top - 120
		    }, 2000, 'swing');
	    } else {
				$('html, body').stop().animate( {
		        'scrollTop': $target.offset().top
		    }, 2000, 'swing');
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
		    }, 2000, 'swing');
	    } else {
				$('html, body').stop().animate( {
		        'scrollTop': $target.offset().top
		    }, 2000, 'swing');
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
		    }, 2000, 'swing');
	    } else {
				$('html, body').stop().animate( {
		        'scrollTop': $target.offset().top
		    }, 2000, 'swing');
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
		    }, 2000, 'swing');
	    } else {
				$('html, body').stop().animate( {
		        'scrollTop': $target.offset().top - 140
		    }, 2000, 'swing');
			}
	});
});
