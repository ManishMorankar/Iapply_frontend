/*------------------------------------File Name: custom.js---------------------------------------------*/
 
/* Scroll to Top*/


$(window).on('scroll', function () {
	scroll = $(window).scrollTop();
	if (scroll >= 100) {
		$("#back-to-top").addClass('b-show_scrollBut')
	} else {
		$("#back-to-top").removeClass('b-show_scrollBut')
	}
});


/*for left and right box height match*/
//$(window).on('load', function () {

 
//})

$("#back-to-top").on("click", function () {
	$('body,html').animate({
		scrollTop: 0
	}, 1000);
});

  $('#scroll-btm').on('click', function(e){
      $('html, body').animate({
            scrollTop : $(this.hash).offset().top
        }, 1000, 'swing', function () {
      });
    });
 //$(window).scroll(function(){ 
    //    if ($(this).scrollTop() > 100) { 
      //      $('#scroll').fadeIn(); 
      //     $('#scroll').addClass("active");
      //  } else { 
      //      $('#scroll').fadeOut(); 
      //     $('#scroll').removeClass("active");
      //  } 
   // }); 
    $('#scroll').click(function(){ 
        $("html, body").animate({ scrollTop: 0 }, 600); 
        return false; 
    }); 


$('.navbar-toggler').click(function(){
  $(this).toggleClass('active');

});

$(document).ready(function() {

     var target = $('.profile1 .w-100').height();
      $('.profile .flex-container .round_brdr_box').height(target);


     $(".tabs a").click(function(event){
       
         $('.profile_menu_tp').removeClass('expand');
           
        });

    

     $(".mobile_logo ").click(function(event){
          $('.sidebar').removeClass('expand');
          $('.navbar-dashboard').removeClass('nav-expanded');
          
           
        });
  

     $(document).on("scroll", onScroll);
    
    //smoothscroll
    $('a[href^="#"]').on('click', function (e) {

        e.preventDefault();
        $(document).off("scroll");
        
        $('a').each(function () {
            $(this).removeClass('active');
        })
        $(this).addClass('active');
      
        var target = this.hash,
            menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top+2
        }, 500, 'swing', function () {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });

    $("#navbarNav").on('click','li',function(){


    // remove classname 'active' from all li who already has classname 'active'
    $("#navbarNav li.active").removeClass("active"); 
    // adding classname 'active' to current click li 
    $(this).addClass("active"); 
    $('.navbar-toggler').addClass('collapsed');
});

var a = 0;
  $(window).scroll(function () {
try{
    var oTop = $('#counter').offset().top - window.innerHeight;
    if (a == 0 && $(window).scrollTop() > oTop) {
      $('.counter').each(function () {
        $(this).prop('Counter', 0).animate({
          Counter: $(this).text()
        }, {
          duration: 4000,
          easing: 'swing',
          step: function (now) {
            $(this).text(Math.ceil(now));
            var num = $(this).text();
            var commaNum = numberWithCommas(num);
            $(this).text(commaNum);

          }
        });


      });
    
      a = 1;
    }
  } catch(e){}
  function numberWithCommas(number) {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");

}



});

jQuery('.story_slider').slick({
       dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
        responsive: [{
          breakpoint: 1100,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
        {
           breakpoint: 900,
           settings: {
              slidesToShow: 1,
              slidesToScroll: 1
           }
        },
        {
           breakpoint: 400,
           settings: {
              slidesToShow: 1,
              slidesToScroll: 1
           }
        }]
});
});

function onScroll(event){
    var scrollPos = $(document).scrollTop();
    $('#navbarNav a').each(function () {

      
      try {
          
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position() != null) {
          if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('#navbarNav ul li a').removeClass("active");
            currLink.addClass("active");
          }
          else {
            currLink.removeClass("active");
      
          }
        }
      }catch(e){}
    });
}


  $(window).scroll(function() {    
    
    var scroll = $(window).scrollTop();

     //>=, not <=
    if (scroll >= 50) {
      $(".main_wrapper").addClass("fixed");
    } else {
        $(".main_wrapper").removeClass("fixed");
    }
  });



 // $('.menu_wrpr ul li a').on('click', function(e){
 //  //alert("fdgfgf");
 //      $('html, body').animate({
 //            scrollTop : jQuery(this.hash).offset().top
 //        }, 1000, 'swing', function () {
 //      });
 //    });

 document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
 
// var count_particles, stats, update;
//   stats = new Stats;
//   stats.setMode(0);
//   stats.domElement.style.position = 'absolute';
//   stats.domElement.style.left = '0px';
//   stats.domElement.style.top = '0px';
//   document.body.appendChild(stats.domElement);
//   count_particles = document.querySelector('.js-count-particles');
//   update = function() {
//     stats.begin();
//     stats.end();
//     if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
//       count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
//     }
//     requestAnimationFrame(update);
//   };
//   requestAnimationFrame(update);

   
$(document).ready(function() {
  $("body").on("change", "#google_translate_element select", function (e) {
  console.log(e);
  console.log($(this).find(":selected").val());
  $("#lang_select").modal('hide');
  });
  $(function () {
    $(".Sub_semi_heading ").each(function () {
        var $this = $(this);
        $this.html($this.html().replace(/&nbsp;/g, ''));
    });
});
});






