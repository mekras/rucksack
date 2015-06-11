/**
 * Пользовательский интерфейс
 */
$(
    function ()
    {
        /*
         * Переключение листов
         */
        $('.list-tabs__tab').click(function (e)
        {
            var tab = $(this);
            if (!tab.hasClass('list-tabs__tab_is_active')) {
                $('.list-tabs__tab_is_active').removeClass('list-tabs__tab_is_active');
                $('.list_is_active').removeClass('list_is_active');
                tab.addClass('list-tabs__tab_is_active');
                $('#' + tab.attr('href').substr(1)).addClass('list_is_active');
            }
            e.preventDefault();
        });


        var lists = {
            'private': $('#private'),
            'shared': $('#shared')
        };

        $('.tour').on('click', '.list__item', function ()
        {
            var item = $(this);
            var checkbox = $(':checkbox', item).get(0);
            if (checkbox.checked) {
                checkbox.checked = false;
                item.removeClass('list__item_is_checked');
            } else {
                checkbox.checked = true;
                item.addClass('list__item_is_checked');
            }
        });

        $('.settings').on('change', function ()
        {
            rebuildAll();
        });

        /**
         * Перестраивает списки
         */
        function rebuildAll()
        {
            window.vpohod.setTypes([$('input[name=type]:checked').val()]);
            window.vpohod.setSeason($('input[name=season]:checked').val());
            window.vpohod.setDuration($('input[name=duration]').val());
            window.vpohod.setGender($('input[name=gender]:checked').val());
            window.vpohod.setAge($('input[name=age]:checked').val());

            var data = window.vpohod.compile();
            for (var name in lists) {
                if (lists.hasOwnProperty(name)) {
                    rebuildList(lists[name], data[name]);
                }
            }
        }

        /**
         * Перестраивает список
         *
         * @param {jQuery} list
         * @param {Array}  items
         */
        function rebuildList(list, items)
        {
            var trTmpl = $('.list__item-template', list).get(0).content;
            var scTmpl = $('.list__section-template', list).get(0).content;
            var lines = {};
            var tr, item;
            for (item of items) {
                tr = $(document.importNode(trTmpl, true));
                $('[data-name=title]', tr)
                    .text(item.title)
                    .attr('title', item.description);
                $('[data-name=quantity]', tr)
                    .text(item.quantity + ' ' + item.units);
                if (undefined === lines[item.category]) {
                    lines[item.category] = [];
                }
                lines[item.category].push(tr);
            }
            var body = $('tbody', list);
            var newBody = body.clone();
            newBody.children().remove();
            for (var category in lines) {
                if (lines.hasOwnProperty(category)) {
                    if ('' !== category) {
                        tr = $(document.importNode(scTmpl, true));
                        $('.list__head', tr)
                            .text(category)
                            .appendTo(newBody);
                    }
                    for (item of lines[category]) {
                        item.appendTo(newBody);
                    }
                }
            }
            body.replaceWith(newBody);
        }

        rebuildAll();
    }
);