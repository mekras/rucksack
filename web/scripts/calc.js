/**
 * Модуль расчётов
 */
(function (document, window, undefined)
{
    'use strict';

    var ctx = {
        'type': 'пеший',
        'weekend': false,
        'season': 'лето',
        'duration': 7
    };

    window.ruksack = window.ruksack || {};

    window.ruksack.setType = function (type)
    {
        ctx.type = type;
    };

    window.ruksack.setSeason = function (season)
    {
        ctx.season = season;
    };

    window.ruksack.setDuration = function (duration)
    {
        ctx.duration = duration;
    };

    /**
     * Производит расчёт и возвращает список нужных вещей
     *
     * @return {Array}
     */
    window.ruksack.compile = function ()
    {
        var items = [];
        var quantity;
        for (var item of window.ruksack.data) {

            /*
             * Проверяем условия
             */
            if (!contains(item.seasons, ctx.season)
                || !contains(item.types, ctx.type)
                || undefined !== item.condition && !eval(item.condition)) {
                continue;
            }

            /*
             * Вычисляем количество
             */
            quantity = undefined === item.quantity
                ? 1
                : eval(item.quantity);
            if (undefined !== item.limits) {
                quantity = applyLimits(quantity, item.limits);
            }

            quantity = Math.ceil(quantity);

            if (quantity > 0) {
                items.push({
                    'category': undefined === item.category ? '' : item.category,
                    'title': item.title,
                    'description': item.description,
                    'quantity': quantity,
                    'units': undefined === item.units ? 'шт.' : item.units
                });
            }
        }
        return items;
    };

    function contains(haystack, needle)
    {
        if (undefined === haystack) {
            return true;
        }
        for (var value of haystack) {
            if (value === needle) {
                return true;
            }
        }
        return false;
    }

    function applyLimits(quantity, limits)
    {
        if (limits.min && quantity < limits.min) {
            return limits.min;
        }

        if (limits.max && quantity > limits.max) {
            return limits.max;
        }

        return quantity;
    }

})(document, window);
