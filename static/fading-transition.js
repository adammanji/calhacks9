var quotes = $(".quotes");

(function($){
    $.fn.extend({
        rotaterator: function(options) {
 
            var defaults = {
                fadeSpeed: 800,
                pauseSpeed: 2000,
                child:null
            };
             
            var options = $.extend(defaults, options);
            var counter = 1; 
            return this.each(function() {
                  var o =options;
                  var obj = $(this);                
                  var items = $(obj.children(), obj);
                  var counter = 1; 
                  items.each(function() {$(this).hide();})
                  if(!o.child){
                      var next = $(obj).children(':first');
                  }else{
                      var next = o.child;
                  }
                  $(next).fadeIn(o.fadeSpeed, function() {
                    $(next).delay(o.pauseSpeed).fadeOut(o.fadeSpeed, function() {
                        var next = $(this).next();
                        if (items.next == null){
                            /*next = $(obj).children(':first');*/
                            return;     
                        }
                        $(obj).rotaterator({child : next, fadeSpeed : o.fadeSpeed, pauseSpeed : o.pauseSpeed});
                        counter += 1; 
                    })
                });
        });
    }
});
})(jQuery);


jQuery(document).ready(function() {
    jQuery('.text').rotaterator();
});
