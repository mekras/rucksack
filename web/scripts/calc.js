/**
 * Модуль расчётов
 */
(function (document, window, undefined)
{
    'use strict';

    /**
     * Настройки
     */
    var settings = {
        /* Поход */
        'tour': {
            // Виды похода
            'types': ['пеший'],
            // Время года
            'season': 'лето',
            // Продолжительность в днях
            'duration': 7,
            // Дополнительные опции
            'options': {
                // Категория сложности реки
                'rdc': 0
            }
        },
        /* Человек */
        'person': {
            // Пол
            'gender': 'муж',
            // Возрастная группа
            'age': 'взрослый'
        }
    };

    /**
     * API модуля
     */
    window.vpohod = window.vpohod || {};

    /**
     * Задаёт виды похода
     *
     * @param {Array} types пеший или водный
     */
    window.vpohod.setTypes = function (types)
    {
        var valid = ['пеший', 'водный'];
        for (var type of types) {
            if (valid.indexOf(type) === -1) {
                throw new Error('Неподдерживаемй вид похода: ' + type);
            }
        }
        settings.tour.types = types;
    };

    /**
     * Задаёт время года
     *
     * @param {String} season весна, лето, осень или зима
     */
    window.vpohod.setSeason = function (season)
    {
        var valid = ['весна', 'лето', 'осень', 'зима'];
        if (valid.indexOf(season) === -1) {
            throw new Error('Неизвестное время года: ' + season);
        }
        settings.tour.season = season;
    };

    /**
     * Задаёт длительность похода
     *
     * @param {Number} duration количество дней
     */
    window.vpohod.setDuration = function (duration)
    {
        settings.tour.duration = Math.ceil(duration);
    };

    /**
     * Производит расчёт и возвращает список нужных вещей
     *
     * @return {Array}
     */
    window.vpohod.compile = function ()
    {
        var lists = {"private": [], "shared": []};
        var quantity;
        for (var item of window.vpohod.equipment) {
            /*
             * Проверяем условия
             */
            if (!contains(item.tour.seasons, settings.tour.season)
                || !contains(item.tour.types, settings.tour.types)
                || (
                    undefined !== item.condition
                    && !evaluate(item.condition, settings.tour, settings.person)
                )) {
                continue;
            }

            /*
             * Вычисляем количество
             */
            quantity = undefined === item.quantity
                ? 1
                : evaluate(item.quantity, settings.tour, settings.person);
            if (undefined !== item.limits) {
                quantity = applyLimits(quantity, item.limits);
            }

            quantity = Math.ceil(quantity);

            if (quantity > 0) {
                if (undefined === lists[item.list]) {
                    lists[item.list] = [];
                }
                lists[item.list].push({
                    'category': item.category,
                    'title': item.title,
                    'description': item.description,
                    'quantity': quantity,
                    'units': item.units
                });
            }
        }
        return lists;
    };

    /**
     * Проверяет, содержит ли массив указанное значение
     *
     * @param {Array|undefined} haystack массив
     * @param {String|Array}    needle   искомое значение
     *
     * @return {Boolean}
     */
    function contains(haystack, needle)
    {
        if (undefined === haystack) {
            return true;
        }
        if (needle instanceof Array) {
            for (var value of needle) {
                if (haystack.indexOf(value) > -1) {
                    return true;
                }
            }
        } else {
            return haystack.indexOf(needle) > -1;
        }
        return false;
    }

    /**
     * Применяет ограничения к количеству
     *
     * @param {Number} quantity количество
     * @param {Object} limits   ограничения
     */
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

    /**
     * Вычисляет выражение
     *
     * @param {String} expr
     * @param {Object} tour
     * @param {Object} person
     *
     * @return {*}
     */
    function evaluate(expr, tour, person)
    {
        return eval("'use strict'; " + expr);
    }

})(document, window);
