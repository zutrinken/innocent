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
			$('.post-meta a').each(function() {
				var link = $(this);
				if (link.attr('href').indexOf('tag') > -1) {
					link.addClass('js-tag-index js-ajax-link');
				} else if (link.attr('href').indexOf('author') > -1) {
					link.addClass('js-author-index js-ajax-link');
				}
			});
			$('.pagination a').each(function() {
				var link = $(this);
				if (link.attr('href').length < 2 ) {
					link.addClass('js-show-index js-ajax-link');
				} else {
					link.addClass('js-archive-index js-ajax-link');
				}				
			});
		}
		ajaxLinkClass();
		
	/* ==========================================================================
	   Reload all scripts after AJAX load
	   ========================================================================== */
		
		function reload() {
			ajaxLinkClass();
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
                var link = $(this);
                if (link.hasClass('js-show-post')) {
                	body.removeClass();
					body.addClass('post-template');
				} else if(link.hasClass('js-show-index')) {
                	body.removeClass();
					body.addClass('home-template');
				} else if(link.hasClass('js-tag-index')) {
                	body.removeClass();
					body.addClass('tag-template');
					var tag = link.attr('href').match(/\/tag\/([^\/]+)/)[1];
					body.addClass('tag-' + tag);
				} else if(link.hasClass('js-author-index')) {
                	body.removeClass();
					body.addClass('author-template');
					var author = link.attr('href').match(/\/author\/([^\/]+)/)[1];
					body.addClass('author-' + author);
				} else if(link.hasClass('js-archive-index')) {
                	body.removeClass();
					body.addClass('archive-template');
				}
                NProgress.start();

                History.pushState({}, title, url);
            }
        }
    });

});
