/** @preserve
 * Author:        Sergio Ferraresi <ferraresi@meeo.it> 
 * Description:   Allows resource add to RO
 * Namespace:     ever-est
 * Widget Name:   addtoro
 * Changelog:     2016-10-25 First Version 
 */

( function ( $ ) {

    $.fn.addtoro = function( options ) {
        var settings = $.extend({
            // These are the defaults.
            btnClass: 'fg-ee-primary text-center',
            btnStyle: '',
            faClass: 'fa-plus',
        }, options );

        this.append(
            $( '<button>', { 'class': 'r-add-to-ro closer btn ' + settings.btnClass, 'type': 'button', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'bottom', 'title': 'Add To RO', 'style': 'position: relative; ' + settings.btnStyle } ).append(
                $( '<img>', { 'src': STATIC_URL + 'img/ROhub_logo_1_16x16.png', 'alt': 'ROhub Logo' } ),
                $( '<i>', { 'class': 'fa ' + settings.faClass, 'style': 'position: absolute; bottom: 0.3em; right: 0.4em;' } )
            )
        );

        // Handlers
        _addHandlers();

        return this;
    };

    function _addHandlers() {
        $( '.r-add-to-ro' ).each( function() {
            $( this ).on( 'click', function() {
                alert( 'TODO: call ACS API' );

                $( document ).trigger( 'addToRoEvent' );
            } );
        } );
    };

} ( jQuery ) );
