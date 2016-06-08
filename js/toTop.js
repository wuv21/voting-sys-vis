$(document).scroll(function () {
    var y = $(this).scrollTop();
    if (y > 1000) {
        //$('#toTop').css("display", "block");
        $('#toTop').fadeIn();
    } else {
        //$('#toTop').css("display", "none");
        $('#toTop').fadeOut();
    }
});
