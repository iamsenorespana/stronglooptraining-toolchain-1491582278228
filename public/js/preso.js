(function(Reveal, hljs, _, revealOptions) {
    'use strict';
    
    // Cut certain sections for shorter-form presentations
    // To use, simply add `cut-[N]` class to any section. For example:
    //   <section class='cut-2'>
    // The section above will not appear in the presentation when the 
    // URL contains the query parameter of: cut=2 (or lower).
    var i, j, l, nodes,
        _meta = null,
        query = document.location.search.match(/(?:\?|&)cut\=(\d+)(?:$|&)/),
        cutLevel = (query && Number(query[1])) || 0;

    for (i=0; i<(cutLevel + 1); ++i) {
        nodes = document.querySelectorAll('.cut-me-' + i);
        for (j=0, l=nodes.length; j<l; ++j) {
            nodes[j].parentNode.removeChild(nodes[j]);
        }
    }
    
    
    // Should we hide the "download PDF" link?
    if( window.location.search.match( /no-pdf/gi ) ) {
        var printLink = document.querySelector('a.print');
        if (printLink) {
            printLink.parentNode.removeChild(printLink);
        }
    }
    
    function getMetaTags() {
        if (_meta) { return _meta; }
        
        var i, l, query, prop, value,
            today = new Date();
        
        _meta = {};
        
        // Parse meta data from query string
        query = document.location.search.substr(1).split(/&/);
        for (i=0, l=query.length; i<l; ++i) {
            prop = query[i].split(/\=/);
            if (/^meta\-.+/.test(prop[0])) {
                value = (prop[1] && decodeURI(prop[1])) || '';
                _meta[prop[0].substr(5)] = value.replace('<', '&lt;');
            }
        }
        
        // Add in some system-level meta data
        _meta.url = _meta.url || (document.location.protocol + '//' + document.location.host + document.location.pathname);
        _meta.date = _meta.date || ((today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear());
        _meta.title = _meta.title || document.title;
        
        return _meta;
    }
    
    
    function processMetaTags() {
        var i, l, prop, value,
            meta = getMetaTags(),
            metaTags = document.querySelectorAll('.slides img[alt^="{{"]');
        
        // Replace uses of meta data across all slides
        for (i=0, l=metaTags.length; i<l; ++i) {
            prop = metaTags[i].alt.match(/\{\{([^\}]+)\}\}/);
            prop = (prop && prop[1]) || null;
            if (meta[prop]) {
                value = document.createElement('span');
                value.innerHTML = meta[prop];
                
                // Auto-convert emails and URLs to links
                value.innerHTML = value.innerHTML.replace(
                    /(?:^|\s)([^@\s]+\@[^@\s]+)(?:\s|$)/,
                    '<a href="mailto:$1">$1</a>'
                );
                value.innerHTML = value.innerHTML.replace(
                    /(?:^|\s)((ht|f)tps?\:\/\/[^\s]+)(?:\s|$)/,
                    '<a href="$1">$1</a>'
                );
                
                metaTags[i].parentNode.replaceChild(value, metaTags[i]);
            } else {
                metaTags[i].parentNode.removeChild(metaTags[i]);
            }
        }
    }


    // Main Reveal presentation initialization (including plugins)
    // Note that the `revealOptions` object is created in the jade template
    // from data in server/_manifest.json !
    var options = _.extend({
        controls: true,
        slideNumber: true,
        progress: false,
        history: true,
        center: true,
        transition: 'linear',
        backgroundTransition: 'slide'
    }, revealOptions);

    options.dependencies = [
        {
            src: '/vendor/reveal.js/lib/js/classList.js',
            condition:function() { return !document.body.classList; }
        },
        {
            src: '/vendor/marked/lib/marked.js',
            condition: function() { return !!document.querySelector( '[data-markdown]' ); }
        },
        {
            src: '/js/reveal-markdown.js',
            condition: function() { return !!document.querySelector( '[data-markdown]' ); },
            callback: processMetaTags
        },
        {
            src: '/vendor/reveal.js/plugin/notes/notes.js',
            async: true,
            condition: function() { return !!document.body.classList; }
        },
        {
          src: '/js/reveal-svg-fragment.js'
        }
    ].concat(options.dependencies || []);


    Reveal.initialize(options);


    // Check if we want the footer on the current slide
    // If you do not want the footer on a given slide, simply add the `no-footer` class
    var footer = document.querySelector('.reveal > footer');
    function checkForFooter(e) {
        if (e.currentSlide && footer) {
            var noFooter = e.currentSlide.classList.contains('no-footer') || e.currentSlide.parentNode.classList.contains('no-footer');
            footer.style.display = (noFooter) ? 'none' : 'block';
        }
    }
    Reveal.addEventListener('slidechanged', checkForFooter);
    checkForFooter({ currentSlide: Reveal.getCurrentSlide() });

    function highlightBlock( event ) {
        hljs.highlightBlock( event.currentTarget );
    }

    if (hljs) {
        // We use this modified highlight code instead of the plugin to handle some
        // edge cases with formatting and also to use a newer version of highlight.js
        // than the version which ships with reveal.js
        
        if( typeof window.addEventListener === 'function' ) {
            var code = document.querySelectorAll( 'pre code' );

            for(i = 0, l = code.length; i < l; i++ ) {
                var element = code[i];

                // trim whitespace if data-trim attribute is present
                if( element.hasAttribute( 'data-trim' ) && typeof element.innerHTML.trim === 'function' ) {
                    element.innerHTML = element.innerHTML.trim();
                }

                // Now escape html unless prevented by author
                if( ! element.hasAttribute( 'data-noescape' )) {
                    element.innerHTML = element.innerHTML.replace(/</g,'&lt;').replace(/>/g,'&gt;');
                }

                // re-highlight when focus is lost (for edited code)
                element.addEventListener( 'focusout', highlightBlock, false );
            }
        }
        
        // Highlight any leftover blocks (usually non-markdown blocks)
        setTimeout(function() {
            hljs.initHighlighting();
        }, 250);
    }

})(window.Reveal, window.hljs, window._, window.revealOptions || {});
