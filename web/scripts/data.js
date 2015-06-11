/**
 * Работа с данными
 */
(function (document, window, undefined)
{
    'use strict';

    window.vpohod = window.vpohod || {};

    /**
     * Создаёт предмет снаряжения
     */
    function Item(data)
    {
        if (undefined === data.title) {
            throw Error('Equipment item has not "title" property');
        }

        this.list = undefined !== data.list ? data.list : 'private';
        this.category = undefined !== data.category ? data.category : '';
        this.condition = undefined !== data.condition ? data.condition : true;
        this.description = data.description;
        this.limits = data.limits instanceof Object ? data.limits : {};
        this.person = data.person instanceof Object ? data.person : {};
        this.quantity = undefined !== data.quantity ? data.quantity : 1;
        this.title = data.title;
        this.tour = data.tour instanceof Object ? data.tour : {};
        this.units = undefined !== data.units ? data.units : 'шт.';
    }

    $.getJSON('data/equipment.json', function (data)
    {
        window.vpohod.equipment = [];
        for (var raw of data) {
            window.vpohod.equipment.push(new Item(raw));
        }
    });

})(document, window);