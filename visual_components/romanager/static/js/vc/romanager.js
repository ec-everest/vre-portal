/** @preserve
 * Author:        Sergio Ferraresi <ferraresi@meeo.it> 
 * Description:   Shows RO Data details
 * Namespace:     ever-est
 * Widget Name:   romanager
 * Changelog:     2016-07-12 First Version
 *                2016-11-24 Added View RO Details function
 */

( function ( $ ) {
// TODO aggiungere link a seafile
    var roData;

    $.fn.romanager = function() {
        roData = null;

        // Main Div Init
        this.addClass( 'row on-top' ).append(
            $( '<div>', { class: 'col-xs-12 col-sm-12 col-md-12 col-lg-12 padding-0' } ).append(
                // Create RO Bar
                _createRoBar(),

                // Create RO Info Panel
                _createRoInfoPanel()
            )
        );

        // Handlers
        _addHandlers();

        console.log('RO Manager Widget created');

        return this;
    };

    function _validRoData() {
        return null !== roData;
    };

    function _getRoText() {
        if ( ! _validRoData() ) {
            return 'Create a new RO';
        } else {
            // TODO
            return 'RO Title: ' + roData;
        }
    };

    // Create the RO Bar
    function _createRoBar() {
        var enablShowInfoPanelButton = _validRoData() ? '' : ' disabled';
        return $( '<div>', { 'id': 'r-ro-bar', 'class': 'input-group' } ).append(
            // Show Info Panel button
            $( '<span>', { 'class': 'input-group-btn' } ).append(
                $( '<button>', { 'id': 'r-show-info-panel', 'class': 'btn btn-default bg-white fg-ee-primary' + enablShowInfoPanelButton, 'type': 'button', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'top', 'title': 'RO Details' } ).append(
                    $( '<i>', { 'class': 'fa fa-info', 'aria-hidden': 'true' } )
                )
            ),

            // Info Bar
            $( '<label>', { 'id': 'r-info', 'class': 'form-control', 'type': 'text' } ).text( _getRoText() ),

            // Create RO button
            $( '<span>', { 'class': 'input-group-btn', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'top', 'title': 'Create RO' } ).rocreator()
        );
    };

    // Create the Info Panel
    function _createRoInfoPanel() {
        return $( '<div>', { 'id': 'r-info-panel', 'class': 'ee-box is-closed' } ).append(
            // Close Panel Button
            UTIL.createRow(
                $( '<i>', { 'id': 'r-info-panel-closer', 'class': 'fa fa-minus fg-ee-primary float-right cursor-pointer closer', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'right', 'title': 'Minimize RO Panel' } )
            ),

            // Form Title
            UTIL.createRow(
                $( '<h3>' ).text( 'Research Object Manager' )
            ),

            // Tab Navigator
            UTIL.createRow(
                $( '<ul>', { 'class': 'nav nav-tabs nav-justified' } ).append(
                    $( '<li>', { 'id': 'r-nav-info', 'class': 'r-nav active', 'role': 'presentation', 'data-form': 'r-info-form' } ).append(
                        $( '<a>', { 'class': 'cursor-pointer' } ).text( 'Information' )
                    ),
                    $( '<li>', { 'id': 'r-nav-content', 'class': 'r-nav', 'role': 'presentation', 'data-form': 'r-content-form' } ).append(
                        $( '<a>', { 'class': 'cursor-pointer' } ).text( 'Content' )
                    ),
                    $( '<li>', { 'id': 'r-nav-progress', 'class': 'r-nav', 'role': 'presentation', 'data-form': 'r-progress-form' } ).append(
                        $( '<a>', { 'class': 'cursor-pointer' } ).text( 'Progress' )
                    )
                )
            ),

            // Info Form
            UTIL.createRow(
                $( '<form>', { 'id': 'r-info-form', 'class': 'form-horizontal', 'role': 'form' } ).append(
                    // ID
                    UTIL.createFormRow(
                        $( '<div>', { 'class': 'col-xs-12 col-sm-2 col-md-2 col-lg-2' } ).append(
                            $( '<label>', { 'for': 'r-id' } ).text( 'Identifier' )
                        ),
                        $( '<div>', { 'class': 'col-xs-12 col-sm-10 col-md-10 col-lg-10' } ).append(
                            $( '<a>', { 'id': 'r-id', 'class': 'r-read-only', 'target': '_blank' } )
                        )
                    ),
                    // Title
                    UTIL.createFormRow(
                        $( '<div>', { 'class': 'col-xs-12 col-sm-2 col-md-2 col-lg-2' } ).append(
                            $( '<label>', { 'for': 'r-title' } ).text( 'Title' )
                        ),
                        $( '<div>', { 'class': 'col-xs-12 col-sm-10 col-md-10 col-lg-10' } ).append(
                            $( '<label>', { 'id': 'r-title', 'class': 'r-read-only' } )
                        )
                    ),
                    // Template
                    UTIL.createFormRow(
                        $( '<div>', { 'class': 'col-xs-12 col-sm-2 col-md-2 col-lg-2' } ).append(
                            $( '<label>', { 'for': 'r-templ' } ).text( 'Template' )
                        ),
                        $( '<div>', { 'class': 'col-xs-12 col-sm-10 col-md-10 col-lg-10' } ).append(
                            $( '<label>', { 'id': 'r-templ', 'class': 'r-read-only' } )
                        )
                    ),
                    // Creator
                    UTIL.createFormRow(
                        $( '<div>', { 'class': 'col-xs-12 col-sm-2 col-md-2 col-lg-2' } ).append(
                            $( '<label>', { 'for': 'r-creator' } ).text( 'Creator' )
                        ),
                        $( '<div>', { 'class': 'col-xs-12 col-sm-10 col-md-10 col-lg-10' } ).append(
                            $( '<a>', { 'id': 'r-creator', 'class': 'r-read-only', 'target': '_blank' } )
                        )
                    ),
                    // Created On
                    UTIL.createFormRow(
                        $( '<div>', { 'class': 'col-xs-12 col-sm-2 col-md-2 col-lg-2' } ).append(
                            $( '<label>', { 'for': 'r-created' } ).text( 'Created on' )
                        ),
                        $( '<div>', { 'class': 'col-xs-12 col-sm-10 col-md-10 col-lg-10' } ).append(
                            $( '<label>', { 'id': 'r-created', 'class': 'r-read-only' } )
                        )
                    ),
                    // Status
                    UTIL.createFormRow(
                        $( '<div>', { 'class': 'col-xs-12 col-sm-2 col-md-2 col-lg-2' } ).append(
                            $( '<label>', { 'for': 'r-status' } ).text( 'Status' )
                        ),
                        $( '<div>', { 'class': 'col-xs-12 col-sm-10 col-md-10 col-lg-10' } ).append(
                            $( '<label>', { 'id': 'r-status', 'class': 'r-read-only' } )
                        )
                    ),
                    // Description
                    UTIL.createFormRow(
                        $( '<div>', { 'class': 'col-xs-12 col-sm-2 col-md-2 col-lg-2' } ).append(
                            $( '<label>', { 'for': 'r-desc' } ).text( 'Description' )
                        ),
                        $( '<div>', { 'class': 'col-xs-12 col-sm-10 col-md-10 col-lg-10' } ).append(
                            $( '<label>', { 'id': 'r-desc', 'class': 'r-read-only' } )
                        )
                    )
                )
            ),

            // Content Form
            UTIL.createRow(
                $( '<form>', { 'id': 'r-content-form', 'class': 'form-horizontal', 'role': 'form' } ).append(
                    // TODO TEST
                    UTIL.createFormRow(
                        $( '<div>', { 'class': 'r-add-to-ro-test' } )
                    ),
                    UTIL.createFormRow(
                        $( '<div>', { 'class': 'r-rem-fr-ro-test' } )
                    )
                    // TODO TEST
                ).hide()
            ),

            // Progress Form
            UTIL.createRow(
                $( '<form>', { 'id': 'r-progress-form', 'class': 'form-horizontal', 'role': 'form' } ).hide()
            )
        ).hide()
    };

    // Add Handlers
    function _addHandlers() {
        // TODO TEST
        $( '.r-add-to-ro-test' ).each( function() {
            $( this ).addtoro( {
                btnClass: 'bg-white fg-ee-primary float-right',
            } );
        } );
        $( '.r-rem-fr-ro-test' ).each( function() {
            $( this ).removefromro( {
                btnClass: 'bg-white fg-ee-primary float-right',
            } );
        } );
        // TODO TEST

        // On RO Fill Content
        $( document ).on( 'fillRoContentEvent', function( event, name, title, c_name, c_url, date, status, desc, resources ) {
            roData = title;
            ro_resources = resources;

            if ( ro_resources.length > 0 ) {
                for ( var i in ro_resources ) {
                    var ro_res = ro_resources[ i ];
                    $( '#r-content-form' ).append( $( '<a>', { 'href': ro_res } ).text( ro_res ) );
                }
            } else {
                $( '#r-content-form' ).append( $( '<p>' ).text( 'The RO is empty. Add a new resource: ... TODO' ) );
            }
            $( '#r-info' ).text( _getRoText() );
            $( '#r-id' ).attr( 'href', name ).text( name );
            $( '#r-creator' ).attr( 'href', c_url).text( c_name );
            $( '#r-created' ).text( date );
            $( '#r-title' ).text( title );
            $( '#r-status' ).text( status );
            $( '#r-desc' ).text( desc );
            $( '#r-show-info-panel' ).removeClass( 'disabled' );
        } );

        // On Add-To-RO
        $( document ).on( 'addToRoEvent', function( event ) {
            if ( ! _validRoData() ) {
                eeNotify.error( 'You need to create or select an existing RO!' );
            } else {
                eeNotify.success( 'Resource added to the RO!' );
                // TODO
            }
        } );

        // On Remove-From-RO
        $( document ).on( 'removeFromRoEvent', function( event ) {
            if ( ! _validRoData() ) {
                eeNotify.error( 'You need to create or select an existing RO!' );
            } else {
                eeNotify.success( 'Resource removed from the RO!' );
                // TODO
            }
        } );

        var self = this;

        // Show/Hide Info Panel
        $( '#r-show-info-panel' ).on( 'click', function() {
            if ( ! $( this ).hasClass( 'disabled' ) ) {
                var panel = $( '#r-info-panel' );
                if ( panel.hasClass( 'is-closed' ) ) {
                    // Show Info Panel
                    $( panel ).slideDown( '350' );
                    $( panel ).removeClass( 'is-closed' );
                    $( panel ).addClass( 'is-open' );

                    $( this ).addClass( 'active' );
                } else if ( $( panel ).hasClass( 'is-open' ) ) {
                    // Hide Info Panel
                    $( panel ).slideUp( '350' );
                    $( panel ).removeClass( 'is-open' );
                    $( panel ).addClass( 'is-closed' );

                    $( this ).removeClass( 'active' );
                }
            }
        } );

        // Close Info Panel
        $( '#r-info-panel-closer' ).on( 'click', function() {
            $( '#r-show-info-panel' ).trigger( 'click' );
        } );

        // Show form on Tab click
        $( '.r-nav' ).each( function() {
            $( this ).on( 'click', function() {
                $( '.r-nav.active' ).each( function() {
                    $( this ).removeClass( 'active' );
                    $( '#' + $( this ).attr( 'data-form' ) ).hide();
                } );
                $( this ).addClass( 'active' );
                $( '#' + $( this ).attr( 'data-form' ) ).show();
            } );
        } );

        console.log( 'RO Manager Handlers initialized' );
    };

} ( jQuery ) );
