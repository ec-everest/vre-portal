/** @preserve
 * Author:        Sergio Ferraresi <ferraresi@meeo.it> 
 * Description:   Search ROs
 * Namespace:     ever-est
 * Widget Name:   rosearch
 * Changelog:     2016-10-25 First Version 
 */

( function ( $ ) {

    var componentId = null;

    var settings = {
        showFiltersOnInit: false,
        searchParent: undefined,
        searchContainer: undefined,
        listParent: undefined,
        listContainer: undefined,
        moreFilters: undefined,
    };

    $.fn.rosearch = function( options ) {
        settings = $.extend( settings, options );

        componentId = this.attr( 'id' );

        // TODO check searchParent, listParent undefined

        if ( ! settings.searchContainer ) {
            settings.searchContainer = settings.searchParent
        }
        if ( ! settings.listContainer ) {
            settings.listContainer = settings.listParent
        }

        this.attr( { 'class': 'nav-icon cursor-pointer', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'bottom', 'title': 'Search ROs' } ).append(
            $( '<span>', { 'class': 'fa fa-search' } ).append(
                $( '<i>', { 'style': 'font-size: small;' } ).text( 'ROs' )
            )
        );

        // Create filters
        $( settings.searchContainer ).append(
            _createRoSearchPanel()
        );

//        // Create results
//        $( settings.listContainer ).append(
//            _createRoListPanel()
//        );

        // Handlers
        _addHandlers();

        console.log('RO Search Widget created');

        return this;
    };

    function _createRoListPanel() {
        // TODO
        return $( '<div>', { 'id': 'r-results' } ).append(
            // Data
            UTIL.createRow(
                $( '<div>', { 'class': 'clusterize' } ).append(
                    UTIL.createRow(
                        $( '<div>', { 'class': 'table-responsive' } ).append(
                        ),
                        $( '<div>', { 'id': 'r-results-scrollArea', 'class': 'clusterize-scroll table-responsive' } ).append(
                            $( '<table>', { 'id': 'r-results-table', 'class': 'table table-striped table-hover' } ).append(
                                $( '<thead>' ).append(
                                    $( '<tr>' ).append(
                                        $( '<th>' ).text( 'Info' ),
                                        $( '<th>' ).text( 'Title' ),
                                        $( '<th>' ).text( 'Status' ),
                                        $( '<th>' ).text( 'Created On' ),
                                        $( '<th>' ).text( 'Creator' ),
                                        $( '<th>' ).text( 'Description' ),
                                        $( '<th>' ).text( 'Delete' )
                                    )
                                ),
                                $( '<tbody>', { 'id': 'r-results-contentArea', 'class': 'clusterize-content' } ).append(
                                    $( '<tr>', { 'class': 'clusterize-no-data' } ).append(
                                        $( '<td>', { 'colspan': '5' } ).text( 'No Data' )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        );
    };

    function _createRoSearchPanel() {
        var col1 = 3;
        var col2 = 9;

        var form = $( '<form>', { 'id': 'r-search-form', 'class': 'form-horizontal', 'role': 'form' } ).append(
            // Form Title
            UTIL.createRow(
                $( '<h3>' ).text( 'Search' )
            ),

            // Type
            UTIL.createFormRow(
                $( '<div>', { 'class': 'col-xs-12 col-sm-' + col1 + ' col-md-' + col1 + ' col-lg-' + col1 } ).append(
                    $( '<label>', { 'for': 'type' } ).text( 'Type' )
                ),
                $( '<div>', { 'class': 'col-xs-12 col-sm-' + col2 + ' col-md-' + col2 + ' col-lg-' + col2 } ).append(
                    $( '<select>', { 'id': 'type', 'name': 'sm-descriptor', 'class': 'form-control multiselect' } ).append(
                        $( '<option>', { 'value': 'DT' } ).text( 'Data' ),
                        $( '<option>', { 'value': 'MD' } ).text( 'Model' ),
                        $( '<option>', { 'value': 'PP' } ).text( 'Paper' ),
                        $( '<option>', { 'value': 'WF' } ).text( 'Workflow' )
                    )
                )
            ),

            // Date
            UTIL.createFormRow(
                $( '<div>', { 'class': 'col-xs-12 col-sm-' + col1 + ' col-md-' + col1 + ' col-lg-' + col1 } ).append(
                    $( '<label>', { 'for': 'date' } ).text( 'Date' )
                ),
                $( '<div>', { 'class': 'col-xs-12 col-sm-' + col2 + ' col-md-' + col2 + ' col-lg-' + col2 } ).append(
                    $( '<div>', { 'class': 'input-group date dtPicker' } ).append(
                        $( '<input>', { 'id': 'date', 'class': 'form-control', 'type': 'text' } ),
                        $( '<span>', { 'class': 'input-group-addon' } ).append(
                            $( '<i>', { 'class': 'fa fa-calendar', 'aria-hidden': 'true' } )
                        )
                    )
                )
            ),

            // Title
            UTIL.createFormRow(
                $( '<div>', { 'class': 'col-xs-12 col-sm-' + col1 + ' col-md-' + col1 + ' col-lg-' + col1 } ).append(
                    $( '<label>', { 'for': 'r-search-form-title' } ).text( 'Title' )
                ),
                $( '<div>', { 'class': 'col-xs-12 col-sm-' + col2 + ' col-md-' + col2 + ' col-lg-' + col2 } ).append(
                    $( '<input>', { 'id': 'r-search-form-title', 'class': 'form-control', 'type': 'text' } )
                )
            ),

            // Creator
            UTIL.createFormRow(
                $( '<div>', { 'class': 'col-xs-12 col-sm-' + col1 + ' col-md-' + col1 + ' col-lg-' + col1 } ).append(
                    $( '<label>', { 'for': 'r-search-form-creator' } ).text( 'Creator' )
                ),
                $( '<div>', { 'class': 'col-xs-12 col-sm-' + col2 + ' col-md-' + col2 + ' col-lg-' + col2 } ).append(
                    $( '<input>', { 'id': 'r-search-form-creator', 'class': 'form-control', 'type': 'text' } )
                )
            )
        );

        // VRC related filters
        if ( settings.moreFilters !== undefined ) {
            for ( var i in settings.moreFilters ) {
                form.append(
                    settings.moreFilters[ i ]
                );
            }
        }

        form.append(
            UTIL.createFormRow(
                $( '<div>', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12' } ).append(
                    $( '<button>', { 'id': 'r-search-form-conf', 'class': 'btn btn-default float-right bg-ee-primary fg-white', 'type': 'button' } ).text( 'Search ROs' )
                )
            )
        );

        if ( ! settings.showFiltersOnInit ) {
            form.addClass( 'closed' );
            $( settings.searchParent ).toggle('slide', { direction: 'right' }, 500);
            $( settings.searchParent ).parents( '.box-container' ).siblings().each( function() {
                $( this ).animate( {
                    width: '100%'
                }, { duration: 500, queue: false, start: function() { form.hide(); } } );
            } );
        } else {
            form.addClass( 'open' );
            form.show();
        }

        return form;
    };

    // Add Handlers
    function _addHandlers() {
        var self = this;

        $( '#' + componentId ).on( 'click', function() {
            var form = $( '#r-search-form' );
            if ( form.hasClass( 'closed' ) ) {
                form.removeClass( 'closed' );
                form.addClass( 'open' );
                $( settings.searchParent ).toggle('slide', { direction: 'right' }, 500);
                $( settings.searchParent ).parents( '.box-container' ).siblings().each( function() {
                    $( this ).animate( {
                        width: '75%'
                    }, { duration: 500, queue: false, start: function() { form.show(); } } );
                } );
            } else {
                form.removeClass( 'open' );
                form.addClass( 'closed' );
                $( settings.searchParent ).toggle('slide', { direction: 'right' }, 500);
                $( settings.searchParent ).parents( '.box-container' ).siblings().each( function() {
                    $( this ).animate( {
                        width: '100%'
                    }, { duration: 500, queue: false, start: function() { form.hide(); } } );
                } );
            }
        } );

        $( '#r-search-form-conf' ).on( 'click', function() {
            $.ajax( {
                url: '/romanager/search/',
                type: 'POST',
                async: false,
                dataType: 'json',
                data: {
                    csrfmiddlewaretoken: UTIL.getCookie( 'csrftoken' ),
                    title: $( '#r-search-form-title' ).val(),
                    creator: $( '#r-search-form-creator' ).val()
                    // TODO
                },
                success: function ( response ) {
                    if ( response.error_message ) {
                        console.log( '"/romanager/search/": failure' );
                        console.log( 'Error during RO search: "' + response.error_message + '"' );

                        eeNotify.error( 'Error during RO search: "' + response.error_message + '"' );
                    } else {
                        console.log( '"/romanager/search/": success');

                        // Create results
                        $( settings.listContainer ).empty();
                        $( settings.listContainer ).append(
                            _createRoListPanel()
                        );

                        var data = ( Object.keys( response.ros ).length > 0 ) ? [] : null;
                        for ( var i in response.ros ) {
                            var ro = response.ros[ i ];
                            var row = $( '<tr>' ).append(
                                $( '<td>', { 'class': 'ro-detail-info' } ).append( $( '<i>', { 'class': 'fa fa-info cursor-pointer ro-detail', 'aria-hidden': 'true' } ).attr( 'name', ro.name ) ),
                                $( '<td>' ).append( $( '<a>', { 'class': 'ro-detail-titl', 'href': ro.name, 'target': '_blank' } ).text( ro.title ) ),
                                $( '<td>', { 'class': 'ro-detail-stat' } ).text( ro.status ),
                                $( '<td>', { 'class': 'ro-detail-date' } ).text( ro.date ),
                                $( '<td>' ).append( $( '<a>', { 'class': 'ro-detail-crea', 'href': ro.creator_url, 'target': '_blank' } ).text( ro.creator_name ) ),
                                $( '<td>', { 'class': 'ro-detail-desc' } ).text( ro.desc ),
                                $( '<td>', { 'class': 'ro-detail-dele' } ).text( $( '<i>', { 'class': 'fa fa-minus', 'aria-hidden': 'true' } ) )
                            );
                            
                            data.push( row.prop( 'outerHTML' ) );
                        }

                        if ( ! data || ( data.length == 0 ) ) {
                            var clusterize = new Clusterize( {
                                scrollId: 'r-results-scrollArea',
                                contentId: 'r-results-contentArea'
                            } );
                            clusterize.clear();
                        } else {
                            var clusterize = new Clusterize( {
                                rows: data,
                                scrollId: 'r-results-scrollArea',
                                contentId: 'r-results-contentArea'
                            } );
                        }
                        //eeNotify.success( '"' + response.title + '" succesfully created!' );
                        $( '.ro-detail' ).each( function() {
                            $( this ).on( 'click', function() {
                                var tr_parent = $( this ).parents( 'tr' );
                                var ro_title = tr_parent.find('.ro-detail-titl').text();
                                var ro_status = tr_parent.find('.ro-detail-stat').text();
                                var ro_date = tr_parent.find('.ro-detail-date').text();
                                var ro_c_name = tr_parent.find('.ro-detail-crea').text();
                                var ro_c_url = tr_parent.find('.ro-detail-crea').attr( 'href' );
                                var ro_desc = tr_parent.find('.ro-detail-desc').text();

                                var ro_name = $( this ).attr( 'name' );

                                $.ajax( {
                                    url: '/romanager/content/',
                                    type: 'POST',
                                    async: false,
                                    dataType: 'json',
                                    data: {
                                        csrfmiddlewaretoken: UTIL.getCookie( 'csrftoken' ),
                                        name: name,
                                    },
                                    success: function ( response ) {
                                        if ( response.error_message ) {
                                            console.log( '"/romanager/content/": failure' );
                                            console.log( 'Error during RO search: "' + response.error_message + '"' );

                                            eeNotify.error( 'Error during RO search: "' + response.error_message + '"' );
                                        } else {
                                            console.log( '"/romanager/search/": success');

                                            // TODO
                                            $( document ).trigger( 'fillRoContentEvent', [ ro_name, ro_title, ro_c_name, ro_c_url, ro_date, ro_status, ro_desc, response.resources ] );
                                        }
                                    },
                                    error: function( response ) {
                                        console.log( '"/romanager/content/": failure' );
                                        console.log( 'Error during RO search: "' + response.error_message + '"' );

                                        eeNotify.error( 'Error during RO search: "' + response.error_message + '"' );
                                    }
                                } );
                            } );
                        } );

                        //$( document ).trigger( 'createdRoEvent', [ response.title ] );
                        // Dispose Modal
                        //$( '#r-create-ro-modal' ).modal( 'hide' );
                    }
                },
                error: function( response ) {
                    console.log( '"/romanager/search/": failure' );
                    console.log( 'Error during RO search: "' + response.error_message + '"' );

                    eeNotify.error( 'Error during RO search: "' + response.error_message + '"' );
                }
            } );
        } );

        console.log( 'RO Search Handlers initialized' );
    };

} ( jQuery ) );
