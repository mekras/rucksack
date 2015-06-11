/**
 * Пользовательский интерфейс
 */
$(
    function ()
    {
        var table = $('#table');

        table.on('click', '.list__item', function ()
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

        $('input[name=type]').change(function ()
        {
            window.ruksack.setType(this.value);
            rebuild();
        }).change();

        $('input[name=season]').change(function ()
        {
            window.ruksack.setSeason(this.value);
            rebuild();
        }).change();

        $('input[name=duration]').change(function ()
        {
            window.ruksack.setDuration(this.value);
            rebuild();
        }).change();

        /**
         * Перестраивает списки
         */
        function rebuild()
        {
            var trTmpl = $('.list__item-template', table).get(0).content;
            var scTmpl = $('.list__section-template', table).get(0).content;
            var items = window.ruksack.compile();
            var list = {};
            var tr, item;
            for (item of items) {
                tr = $(document.importNode(trTmpl, true));
                $('[data-name=title]', tr)
                    .text(item.title)
                    .attr('title', item.description);
                $('[data-name=quantity]', tr)
                    .text(item.quantity + ' ' + item.units);
                if (undefined === list[item.category]) {
                    list[item.category] = [];
                }
                list[item.category].push(tr);
            }
            var body = $('tbody', table);
            var newBody = body.clone();
            newBody.children().remove();
            for (var category in list) {
                if (list.hasOwnProperty(category)) {
                    if ('' !== category) {
                        tr = $(document.importNode(scTmpl, true));
                        $('.list__head', tr)
                            .text(category)
                            .appendTo(newBody);
                    }
                    for (item of list[category]) {
                        item.appendTo(newBody);
                    }
                }
            }
            body.replaceWith(newBody);
        }
    }
);