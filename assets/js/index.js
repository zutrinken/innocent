jQuery(function($) {

	var body = $('body');

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
			body.css('font-size', type + 'em');
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
	   Add class for ajax loading
	   ========================================================================== */
		
		function ajaxLinkClass() { 
			$('.post-tags a').addClass('js-tag-index js-ajax-link');
			$('.pagination a').addClass('js-show-index js-ajax-link');
		}
		ajaxLinkClass();
		
		function ajaxLinkClass() { 
			$('.post-tags a').addClass('js-tag-index js-ajax-link');
			$('.pagination a').addClass('js-archive-index js-ajax-link');
		}
		ajaxLinkClass();
		
	/* ==========================================================================
	   Reload all scripts after AJAX load
	   ========================================================================== */
		
		function reload() {
			ajaxLinkClass();
			exponential();
			highlight();
			video();
		}

	/* ==========================================================================
	   Ajax Loading based on Ghostwriter by Rory Gibson - https://github.com/roryg/ghostwriter
	   ========================================================================== */

    var History = window.History;
    var loading = false;
    var ajaxContainer = $('#ajax-container');

    if (!History.enabled) {
    	return false;
    }
    History.Adapter.bind(window, 'statechange', function() {
        var State = History.getState();
        $.get(State.url, function(result) {
            var $html = $(result);
            var $newContent = $('#ajax-container', $html).contents();
            var title = result.match(/<title>(.*?)<\/title>/)[1];

            $('html, body').animate({'scrollTop': 0});
            ajaxContainer.fadeOut(500, function() {
                document.title = title;
                ajaxContainer.html($newContent);
                ajaxContainer.fadeIn(500);
				
                NProgress.done();
                reload();

                loading = false;
            });
        });
    });
    $('body').on('click', '.js-ajax-link', function(e) {
        e.preventDefault(); 
        if (loading === false) {
            var currentState = History.getState();
            var url = $(this).prop('href');
            var title = $(this).attr('title') || null;

            if (url.replace(/\/$/, "") !== currentState.url.replace(/\/$/, "")) {
                loading = true;
                if ($(this).hasClass('js-show-post')) {
                
					body.addClass('post-template');
					body.removeClass('home-template');
					body.removeClass('tag-template');
					body.removeClass('archive-template');

				} else if($(this).hasClass('js-show-index')) {
				
					body.addClass('home-template');
					body.removeClass('post-template');
					body.removeClass('tag-template');
					body.removeClass('archive-template');

					var regex = /(\s)*(tag-.*?)(?=\s)/g;
					body[0].className = body[0].className.replace(regex, '');

				} else if($(this).hasClass('js-tag-index')) {

					body.addClass('tag-template');
					body.removeClass('post-template');
					body.removeClass('home-template');
					body.removeClass('archive-template');

				} else if($(this).hasClass('js-archive-index')) {

					body.addClass('archive-template');
					body.removeClass('post-template');
					body.removeClass('home-template');
					body.removeClass('tag-template');

				}
                NProgress.start();

                History.pushState({}, title, url);
            }
        }
    });

});
