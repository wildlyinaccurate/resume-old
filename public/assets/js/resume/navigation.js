/**
 * Dynamic Navigation
 *
 * @author  Joseph Wynn <joseph@wildlyinaccurate.com>
 */
Resume.Navigation = function() {

    return {

		build: function() {
            // Build the sidebar navigation
            var sections = [];

            $('h2').each(function(index) {
                var element = $(this),
                    id = element.prop('id'),
                    title = element.text();

                if (id !== '') {
                    sections.push({
                        id: id,
                        title: title
                    });
                }
            });

            var view = {
                sections: sections
            };

            $.ajax({
                url: 'views/sidebar-nav.html',
                dataType: 'html',
                success: function(template) {
                    $('#sidebar-nav').html(Mustache.to_html(template, view));
                }
            });

            $('#sidebar-nav ul').scrollspy();
        }

    };

}();
