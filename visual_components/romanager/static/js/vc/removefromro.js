/** @preserve
 * Author:        Sergio Ferraresi <ferraresi@meeo.it> 
 * Description:   Allows resource removing from RO
 * Namespace:     ever-est
 * Widget Name:   addtoro
 * Changelog:     2016-10-27 First Version 
 */

( function ( $ ) {

    $.fn.removefromro = function( options ) {
        var settings = $.extend({
            // These are the defaults.
            btnClass: 'fg-ee-primary text-center',
            btnStyle: '',
            faClass: 'fa-minus',
        }, options );

        this.append(
            $( '<button>', { 'class': 'r-remove-from-ro closer btn ' + settings.btnClass, 'type': 'button', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'bottom', 'title': 'Remove From RO', 'style': 'position: relative; ' + settings.btnStyle } ).append(
                $( '<img>', { 'src': STATIC_URL + 'img/ROhub_logo_1_16x16.png', 'alt': 'ROhub Logo' } ),
                $( '<i>', { 'class': 'fa ' + settings.faClass, 'style': 'position: absolute; bottom: 0.3em; right: 0.4em;' } )
            )
        );

        // Handlers
        _addHandlers();

        return this;
    };

    function _addHandlers() {
        $( '.r-remove-from-ro' ).each( function() {
            $( this ).on( 'click', function() {
                alert( 'TODO: call ACS API' );

                $( document ).trigger( 'removeFromRoEvent' );
            } );
        } );
    };

} ( jQuery ) );
