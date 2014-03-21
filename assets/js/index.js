jQuery(function($) {

	/* ==========================================================================
	   Run Highlight
	   ========================================================================== */

		function highlight() {
			$('pre code').each(function(i, e) {
				hljs.highlightBlock(e)
			});
		}
		highlight();

	/* ==========================================================================
	   Exponential Widths & Fonts
	   ========================================================================== */
	   
		function exponential() {
			var view = $(window).width();
			var shot = Math.sqrt(view);
			var type = shot / 10 - 0.5;
			shot = 100 - shot * view / 1000;
			if(shot < 37.51) {
				shot = 37.50;
			} else if (shot > 89.999) {
				shot = 90;
			}
			$('.inner').css('width', shot + '%');
			if(type < 1.41) {
				type = 1.4;
			} else if (type > 1.999) {
				type = 2;
			}
			$('body').css('font-size', type + 'em');
		}
		exponential();
		$(window).resize(exponential);

	/* ==========================================================================
	   Fitvids by Chris Coyier
	   ========================================================================== */

		function video() {
			$('#wrapper').fitVids();
		}
		video();
		
		
	/* ==========================================================================
	   Reload all scripts after AJAX load
	   ========================================================================== */
		
		function reload() {
			exponential();
			highlight();
			video();
		}

	/* ==========================================================================
	   Ajax Loading based on Ghostwriter by Rory Gibson - https://github.com/roryg/ghostwriter
	   ========================================================================== */

    var History = window.History;
    var loading = false;
    var $ajaxContainer = $('#ajax-container');
    var $blogLink = $('.js-show-index');

    if (!History.enabled) {
    	return false;
    }
    History.Adapter.bind(window, 'statechange', function() {
        var State = History.getState();
        $.get(State.url, function(result) {
            var $html = $(result);
            var $newContent = $('#ajax-container', $html).contents();

            $('html, body').animate({'scrollTop': 0});
            $ajaxContainer.fadeOut(500, function() {
                $ajaxContainer.html($newContent);
                $ajaxContainer.fadeIn(500);
				
                NProgress.done();
                reload();

                loading = false;
            });
        });
    });
    $('body').on('click', '.js-ajax-link, .pagination a', function(e) {
        e.preventDefault(); 
        if (loading === false) {
            var currentState = History.getState();
            var url = $(this).prop('href');
            var title = $(this).attr('title') || null;

            if (url.replace(/\/$/, "") !== currentState.url.replace(/\/$/, "")) {
                loading = true;
                if ($(this).hasClass('post-link')) {
					$blogLink.addClass('single');

				} else if($(this).hasClass('js-show-index')) {
					if($(this).hasClass('single')) {}
					$blogLink.removeClass('single');
				}
                NProgress.start();

                History.pushState({}, title, url);
            }
        }
    });

});
