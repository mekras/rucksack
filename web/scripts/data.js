/**
 * Работа с данными
 */
(function (document, window, undefined)
{
    'use strict';

    window.ruksack = window.ruksack || {};

    $.getJSON('data/equipment.json', function (data)
    {
        window.ruksack.data = data;
    });

})(document, window);