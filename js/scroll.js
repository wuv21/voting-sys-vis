$(document).ready(function() {
	$(this).scrollTop(0);

	$("#fptp-link").on('click',function (event) {
	    event.preventDefault();

	    var target = this.hash;
	    var $target = $(target);
		  var x = $(window).width();

			$('html, body').stop().animate( {
		      'scrollTop': $target.offset().top
		  }, 1200, 'swing');
	});

	$("#av-link").on('click',function (event) {
	    event.preventDefault();

	    var target = this.hash;
	    var $target = $(target);
		  var x = $(window).width();

			$('html, body').stop().animate( {
		      'scrollTop': $target.offset().top
		  }, 2400, 'swing');
	});

	$("#sv-link").on('click',function (event) {
	    event.preventDefault();

	    var target = this.hash;
	    var $target = $(target);
		  var x = $(window).width();

			$('html, body').stop().animate( {
		      'scrollTop': $target.offset().top
		  }, 3600, 'swing');
	});

	$(".fn-toward").on('click',function (event) {
	    event.preventDefault();

	    var target = this.hash;
	    var $target = $(target);
		  var x = $(window).width();

			$('html, body').stop().animate( {
		      'scrollTop': $target.offset().top
		  }, 3500, 'swing');
	});

	$(".fn-back").on('click',function (event) {
	    event.preventDefault();

	    var target = this.hash;
	    var $target = $(target);
		  var x = $(window).width();

			$('html, body').stop().animate( {
		      'scrollTop': $target.offset().top
		  }, 3500, 'swing');
	});

	$("#toTopLink").on('click',function (event) {
	    event.preventDefault();

	    var target = this.hash;
	    var $target = $(target);
		  var x = $(window).width();

			$('html, body').stop().animate( {
		      'scrollTop': $target.offset().top - 140
		  }, 2500, 'swing');

			setTimeout(function() {
				window.location.reload();
			}, 2501);
	});
});
