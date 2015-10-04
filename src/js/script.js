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
			$('[href^="' + window.location.href + '"], .post-meta a, .pagination a').each(function() {
				var link = $(this);
				
				if(!link.hasClass('subscribe')) {
					link.addClass('js-ajax-link');
					
					if (link.attr('href').indexOf('page') > -1 ) {
						link.addClass('js-archive-index');
					} else {
						link.addClass('js-show-index');
					}
					
					if (link.attr('href').indexOf('tag') > -1) {
						link.addClass('js-tag-index');
					}
					
					if (link.attr('href').indexOf('author') > -1) {
						link.addClass('js-author-index');
					}
				}
			});
		}
		ajaxLinkClass();
		
	/* ==========================================================================
	   Initialize and load Disqus
	   ========================================================================== */
	
	function comments() {
		if (typeof disqus === 'undefined') {
			$('.post-comments').css({
				'display' : 'none'
			});
		} else {
			$.ajax({
				type: "GET",
				url: "//" + disqus + ".disqus.com/embed.js",
				dataType: "script",
				cache: true
			});
		}
	}
	comments();
		
	/* ==========================================================================
	   Reload all scripts after AJAX load
	   ========================================================================== */
		
		function reload() {
			ajaxLinkClass();
			highlight();
			video();
			comments();
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
			var newContent = $('#ajax-container', $html).contents();
			var title = result.match(/<title>(.*?)<\/title>/)[1];
			
			ajaxContainer.fadeOut(500, function() {
				document.title = title;
				ajaxContainer.html(newContent);
				body.removeClass();
				body.addClass($('#body-class').attr('class'));
				$('html').removeClass('loading');
				NProgress.done();
				reload();
				loading = false;
				ajaxContainer.fadeIn(500);
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
				$('html').addClass('loading');
				NProgress.start();
				History.pushState({}, title, url);
	        }
	    }
	});
});
