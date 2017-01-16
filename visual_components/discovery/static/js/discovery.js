/**
 * @preserve
 * Author:      Sergio Ferraresi <ferraresi@meeo.it>
 * Description: EVER-EST Discovery Visual Component. The component aim is to 
 *              allow users to discover EO Products via OpenSarch. It is 
 *              possible to add custom OpenSearch catalogues through the 
 *              "Add Repository" button.
 * Namespace:   ever-est
 * Widget Name: discovery
 * Changelog:   2016-07-12 First Version
 *              2016-08-26 Graphic Re-style
 *              2016-09-21 Mobile-ready
 *              2016-10-03/11 OpenSearch double-step results retriving. 
 *              Settings Fields dinamically generated. Pagination. Download to 
 *              VRC.
 *              2016-10-17/21 Discovery interface improvements. Added "results" 
 *              functionalities. Improved "download to VRC". General 
 *              improvements.
 * TODO
 * Generic:     Add Repository (default and type (collection, results, wms) 
 *              fields)
 *              Back to Collection List
 *              Reset Button?
 * Down.toVRC:  manage download with credentials
 * Sett. Panel: Show Primary Fields
 *              Add "Show All Filters" button
 */

$( function() {
    var dictionary = { 
        'eop:parentIdentifier'        : 'Parent Identifier'         , 'eo:parentIdentifier'        : 'Parent Identifier'         ,
        'eop:platform'                : 'Platform'                  , 'eo:platform'                : 'Platform'                  ,
        'eop:instrument'              : 'Instrument'                , 'eo:instrument'              : 'Instrument'                ,
        'eop:organisationName'        : 'Organisation Name'         , 'eo:organisationName'        : 'Organisation Name'         ,
        'eop:productType'             : 'Product Type'              , 'eo:productType'             : 'Product Type'              ,
        'eop:orbitType'               : 'Orbit Type'                , 'eo:orbitType'               : 'Orbit Type'                ,
        'eop:orbitDirection'          : 'Orbit Direction'           , 'eo:orbitDirection'          : 'Orbit Direction'           ,
        'eop:cloudCover'              : 'Cloud Cover'               , 'eo:cloudCover'              : 'Cloud Cover'               ,
        'eop:swathIdentifier'         : 'Swath Identifier'          , 'eo:swathIdentifier'         : 'Swath Identifier'          ,
        'eop:platformSerialIdentifier': 'Platform Serial Identifier', 'eo:platformSerialIdentifier': 'Platform Serial Identifier',
        'eop:keyword'                 : 'Keyword'                   , 'eo:keyword'                 : 'Keyword'                   ,
        'eop:track'                   : 'Track'                     , 'eo:track'                   : 'Track'                     ,
        'eop:sensorType'              : 'Sensor Type'               , 'eo:sensorType'              : 'Sensor Type'               ,
        'eop:processingLevel'         : 'Processing Level'          , 'eo:processingLevel'         : 'Processing Level'          ,
        'eop:frame'                   : 'Frame'                     , 'eo:frame'                   : 'Frame'                     ,

        'dc:title'    : 'Title'    ,
        'dc:type'     : 'Type'     ,
        'dc:publisher': 'Publisher',
        'dc:subject'  : 'Subject'  ,

        'dct:modified': 'Modified',

        'geo:uid'     : 'UID'         , 
        'geo:box'     : 'Bounding Box',
        'geo:geometry': 'Geometry'    ,
        'geo:relation': 'Geo Relation',
        'geo:radius'  : 'Radius'      ,
        'geo:name'    : 'Name'        ,

        'time:start'   : 'Start'        ,
        'time:end'     : 'Stop'         ,
        'time:relation': 'Time Relation',

        't2:enclosureSource': 'Enclosure Source',
        't2:landCover'      : 'Land Cover'      ,

        'sru:recordSchema': 'Record Schema',

        'semantic:classifiedAs': 'Classified As'
    };

    $.widget( 'ever-est.discovery', {
        // Contructor
        _create: function() {
            // Init Main Div
            $( '#d-parent' ).addClass( 'row on-top' ).append(
                $( '<div>', { class: 'col-xs-12 col-sm-12 col-md-12 col-lg-12 padding-0' } ).append(
                    // Create Search Bar
                    this._createSearchBar(),
                    
                    // Create Settings Panel
                    this._createSettingsPanel(),
                    
                    // Create Results Panel
                    this._createResultsPanel()
                )
            );

            // Handlers
            this._addHandlers();

            // Init Settings Panel
            $( '#d-rep' ).trigger( 'change' );

            // Init Third Parties Plugins
            this._init3rdPartiesPlugins();

            console.log( 'Discovery Widget initialized' );
        },

        // Add a row to the form with the specified formId.
        _addSimpleFormRow: function ( formId, label, id, type, options ) {
            var inner = $( '<input>', { 'id': id, 'name': id, 'class': 'form-control', 'type': 'text' } );
            if ( 'select' == type ) {
                inner = $( '<select>', { 'id': id, 'name': id, 'class': 'form-control selectize', 'type': type } );
                inner.append( $( '<option>', { 'value': '' } ).text( '' ) )
                for ( var i in options ) {
                    inner.append( $( '<option>', { 'value': options[ i ] } ).text( i ) )
                }
            } else if ( 'date' == type ) {
                inner = $( '<div>', { 'class': 'input-group date dtPicker' } ).append(
                    $( '<input>', { 'id': id, 'name': id, 'class': 'form-control', 'type': 'text' } )
                ).append(
                    $( '<span>', { 'class': 'input-group-addon' } ).append(
                        $( '<i>', { 'class': 'fa fa-calendar', 'aria-hidden': 'true' } )
                    )
                )
            }
            $( formId ).append(
                UTIL.createFormRow(
                    $( '<div>', { 'class': 'col-xs-12 col-sm-2 col-md-2 col-lg-2' } ).append(
                        $( '<label>', { 'class': 'vertical-align-center', 'for': id } ).text( label )
                    ),
                    $( '<div>', { 'class': 'col-xs-12 col-sm-10 col-md-10 col-lg-10' } ).append(
                        inner
                    )
                )
            )
        },

        // Add a row to the form with the specified formId.
        _addComplexFormRow: function ( formId, label_1, id_1, type_1, options_1, label_2, id_2, type_2, options_2 ) {
            var inner_1 = $( '<input>', { 'id': id_1, 'name': id_1, 'class': 'form-control', 'type': 'text' } );
            if ( 'select' == type_1 ) {
                inner_1 = $( '<select>', { 'id': id_1, 'name': id_1, 'class': 'form-control', 'type': type_1 } );
                inner_1.append( $( '<option>', { 'value': '' } ).text( '' ) )
                for ( var i in options_1 ) {
                    inner_1.append( $( '<option>', { 'value': options_1[ i ] } ).text( i ) )
                }
            } else if ( 'date' == type_1 ) {
                inner_1 = $( '<div>', { 'class': 'input-group date dtPicker' } ).append(
                    $( '<input>', { 'id': id_1, 'name': id_1, 'class': 'form-control', 'type': 'text' } )
                ).append(
                    $( '<span>', { 'class': 'input-group-addon' } ).append(
                        $( '<i>', { 'class': 'fa fa-calendar', 'aria-hidden': 'true' } )
                    )
                )
            }
            var inner_2 = $( '<input>', { 'id': id_2, 'name': id_2, 'class': 'form-control', 'type': 'text' } );
            if ( 'select' == type_2 ) {
                inner_2 = $( '<select>', { 'id': id_2, 'name': id_2, 'class': 'form-control', 'type': type_2 } );
                inner_2.append( $( '<option>', { 'value': '' } ).text( '' ) )
                for ( var i in options_2 ) {
                    inner_2.append( $( '<option>', { 'value': options_2[ i ] } ).text( i ) )
                }
            } else if ( 'date' == type_2 ) {
                inner_2 = $( '<div>', { 'class': 'input-group date dtPicker' } ).append(
                    $( '<input>', { 'id': id_2, 'name': id_2, 'class': 'form-control', 'type': 'text' } )
                ).append(
                    $( '<span>', { 'class': 'input-group-addon' } ).append(
                        $( '<i>', { 'class': 'fa fa-calendar', 'aria-hidden': 'true' } )
                    )
                )
            }
            $( formId ).append(
                UTIL.createFormRow(
                    $( '<div>', { 'class': 'col-xs-12 col-sm-2 col-md-2 col-lg-2' } ).append(
                        $( '<label>', { 'class': 'vertical-align-center', 'for': id_1 } ).text( label_1 )
                    ),
                    $( '<div>', { 'class': 'col-xs-12 col-sm-4 col-md-4 col-lg-4' } ).append(
                        inner_1
                    ),
                    $( '<div>', { 'class': 'col-xs-12 col-sm-2 col-md-2 col-lg-2' } ).append(
                        $( '<label>', { 'class': 'vertical-align-center', 'for': id_2 } ).text( label_2 )
                    ),
                    $( '<div>', { 'class': 'col-xs-12 col-sm-4 col-md-4 col-lg-4' } ).append(
                        inner_2
                    )
                )
            )
        },

        // Create the Search Bar
        _createSearchBar: function() {
            return $( '<div>', { 'id': 'd-search-bar', 'class': 'input-group' } ).append(
                // Show Settings Panel button
                $( '<span>', { 'class': 'input-group-btn' } ).append(
                    $( '<button>', { 'id': 'd-show-settings-panel', 'class': 'btn btn-default bg-white fg-ee-primary', 'type': 'button', 'aria-label': 'Advanced Search', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'top', 'title': 'Advanced Search' } ).append(
                        $( '<i>', { 'class': 'fa fa-gear', 'aria-hidden': 'true' } )
                    )
                ),

                // Search Bar
                $( '<input>', { 'id': 'd-search-text', 'class': 'form-control', 'type': 'text', 'placeholder': 'Search for...' } ),

                // Show Results Panel and Search buttons
                $( '<span>', { 'class': 'input-group-btn' } ).append(
                    // Show Results Panel button
                    $( '<button>', { 'id': 'd-show-results-panel', 'class': 'btn btn-default bg-white fg-ee-primary', 'type': 'button', 'aria-label': 'Show Results', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'top', 'title': 'Show Results' } ).append(
                        $( '<i>', { 'class': 'fa fa-list', 'aria-hidden': 'true' } )
                    ).hide(),
                    // Search button
                    $( '<button>', { 'id': 'd-search', 'class': 'btn btn-default bg-ee-primary fg-white', 'type': 'button', 'aria-label': 'Search', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'top', 'title': 'Search' } ).append(
                        $( '<i>', { 'class': 'fa fa-search', 'aria-hidden': 'true' } )
                    )
                ),

                // Add Repository Modal
                $( '<div>', { 'id': 'd-rep-add-modal', 'class': 'modal fade', 'tabindex': '-1', 'role': 'dialog' } ).append(
                    $( '<div>', { 'class': 'modal-dialog', 'role': 'document' } ).append(
                        $( '<div>', { 'class': 'modal-content' } ).append(
                            $( '<div>', { 'class': 'modal-header' } ).append(
                                $( '<button>', { 'class': 'close fg-ee-primary', 'type': 'button', 'data-dismiss': 'modal', 'aria-label': 'Close' } ).append(
                                    $( '<span>', { 'class': 'fa fa-times', 'aria-hidden': 'true' } )
                                ),
                                $( '<h4>', { 'class': 'modal-title' } ).text( 'Repository Information' )
                            ),
                            $( '<div>', { 'class': 'modal-body' } ).append(
                                $( '<div>', { 'class': 'row' } ).append(
                                    $( '<div>', { 'class': 'form-group col-xs-12 col-sm-12 col-md-12 col-lg-12' } ).append(
                                        $( '<div>', { 'class': 'col-xs-12 col-sm-6 col-md-6 col-lg-6' } ).append(
                                            $( '<label>', { 'for': 'd-rep-add-name' } ).text( 'Name' )
                                        ),
                                        $( '<div>', { 'class': 'col-xs-12 col-sm-6 col-md-6 col-lg-6' } ).append(
                                            $( '<input>', { 'id': 'd-rep-add-name', 'class': 'form-control', 'type': 'text' } )
                                        )
                                    )
                                ),
                                $( '<div>', { 'class': 'row' } ).append(
                                    $( '<div>', { 'class': 'form-group col-xs-12 col-sm-12 col-md-12 col-lg-12' } ).append(
                                        $( '<div>', { 'class': 'col-xs-12 col-sm-6 col-md-6 col-lg-6' } ).append(
                                            $( '<label>', { 'for': 'd-rep-add-endp' } ).text( 'End-point' )
                                        ),
                                        $( '<div>', { 'class': 'col-xs-12 col-sm-6 col-md-6 col-lg-6' } ).append(
                                            $( '<input>', { 'id': 'd-rep-add-endp', 'class': 'form-control', 'type': 'text' } )
                                        )
                                    )
                                )
// ,
// $( '<div>', { 'class': 'row' } ).append(
// $( '<div>', { 'class': 'form-group col-xs-12 col-sm-12 col-md-12 col-lg-12' }
// ).append(
// $( '<div>', { 'class': 'col-xs-12 col-sm-6 col-md-6 col-lg-6' } ).append(
// $( '<label>', { 'for': 'd-rep-add-endp' } ).text( 'Default' )
// ),
// $( '<div>', { 'class': 'col-xs-12 col-sm-6 col-md-6 col-lg-6' } ).append(
// $( '<input>', { 'id': 'd-rep-add-def', 'class': 'form-control', 'type':
// 'checkbox' } )
// )
// )
// )
                            ),
                            $( '<div>', { 'class': 'modal-footer' } ).append(
                                $( '<button>', { 'id': 'd-rep-add-conf', 'class': 'btn btn-primary fg-white bg-ee-primary bd-ee-primary', 'type': 'button', 'data-dismiss': 'modal' } ).text( 'Add' )
                            )
                        )
                    )
                )
            );
        },

        // Create the Results Panel
        _createResultsPanel: function() {
            return $( '<div>', { 'id': 'd-results-panel', 'class': 'ee-box is-closed' } ).append(
                // Resize and Close Panel Buttons
                UTIL.createRow(
                    $( '<i>', { 'id': 'd-results-panel-closer', 'class': 'fa fa-minus fg-ee-primary float-right cursor-pointer closer', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'right', 'title': 'Minimize Results Panel' } ),
                    $( '<i>', { 'id': 'd-results-panel-resizer', 'class': 'fa fa-expand fg-ee-primary float-right cursor-pointer closer', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'bottom', 'title': 'Expand Results Panel' } )
                ),

                // Form Title
                UTIL.createRow(
                    $( '<h3>' ).text( 'Results' )
                ),
                UTIL.createRow(
                    $( '<nav>', { 'id': 'd-results-panel-navigator', 'aria-label': 'Results Navigator' } ).append(
                        $( '<ul>', { 'class': 'pager' } ).append(
                            $( '<li>', { 'class': 'previous' } ).append(
                                $( '<a>', { 'id': 'd-results-panel-navigator-first', 'class': 'd-results-panel-navigator-el', 'href': '#', 'aria-label': 'First Page', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'left', 'title': 'First Page' } ).append(
                                    $( '<span>', { 'aria-hidden': 'true', 'class': 'fa fa-angle-double-left' } )
                                )
                            ),
                            $( '<li>', { 'class': 'previous' } ).append(
                                $( '<a>', { 'id': 'd-results-panel-navigator-prev', 'class': 'd-results-panel-navigator-el', 'href': '#', 'aria-label': 'Previous Page', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'left', 'title': 'Previous Page' } ).append(
                                    $( '<span>', { 'aria-hidden': 'true', 'class': 'fa fa-angle-left' } )
                                )
                            ),
                            // ActualPageNumber of TotalPageNumber | Results X-Y
                            // of TotalResultsNumber
                            $( '<li>' ).append(
                                $( '<i>' ).text( 'Page ' ),
                                $( '<i id="d-results-panel-navigator-curr-page-num">' ).text( '' ),
                                $( '<i>' ).text( ' of ' ),
                                $( '<i id="d-results-panel-navigator-total-page-num">' ).text( '' ),
                                $( '<i>' ).text( ' | ' ),
                                $( '<i>' ).text( 'Results ' ),
                                $( '<i id="d-results-panel-navigator-curr-res-num">' ).text( '' ),
                                $( '<i>' ).text( ' of ' ),
                                $( '<i id="d-results-panel-navigator-total-res-num">' ).text( '' )
                            ),
                            $( '<li>', { 'class': 'next' } ).append(
                                $( '<a>', { 'id': 'd-results-panel-navigator-last', 'class': 'd-results-panel-navigator-el', 'href': '#', 'aria-label': 'Last Page', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'left', 'title': 'Last Page' } ).append(
                                    $( '<span>', { 'aria-hidden': 'true', 'class': 'fa fa-angle-double-right' } )
                                )
                            ),
                            $( '<li>', { 'class': 'next' } ).append(
                                $( '<a>', { 'id': 'd-results-panel-navigator-next', 'class': 'd-results-panel-navigator-el', 'href': '#', 'aria-label': 'Next Page', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'left', 'title': 'Next Page' } ).append(
                                    $( '<span>', { 'aria-hidden': 'true', 'class': 'fa fa-angle-right' } )
                                )
                            )
                        )
                    )
                ),

                // Data
                UTIL.createRow(
                    $( '<div>', { 'class': 'clusterize' } ).append(
                        UTIL.createRow(
                            $( '<div>', { 'id': 'scrollArea', 'class': 'clusterize-scroll table-responsive' } ).append(
                                $( '<table>', { 'id': 'd-results-table', 'class': 'table table-striped table-hover' } ).append(
                                    $( '<tbody>', { 'id': 'contentArea', 'class': 'clusterize-content' } ).append(
                                        $( '<tr>', { 'class': 'clusterize-no-data' } ).append(
                                            $( '<td>' ).text( 'No Data' )
                                        )
                                    )
                                )
                            )
                        )
                    )
                ),

                UTIL.createRow(
                    $( '<button>', { 'id': 'd-results-cart', 'class': 'btn fa fa-shopping-cart bg-white fg-ee-primary float-right cursor-pointer closer disabled', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'bottom', 'title': 'Show Cart' } ).data( 'data-products', {} )
                )
            ).hide();
        },

        // Create the Settings Panel
        _createSettingsPanel: function() {
            return $( '<div>', { 'id': 'd-settings-panel', 'class': 'ee-box is-closed' } ).append(
                // Close Panel Button
                UTIL.createRow(
                    $( '<i>', { 'id': 'd-settings-panel-closer', 'class': 'fa fa-minus fg-ee-primary float-right cursor-pointer closer', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'right', 'title': 'Minimize Advanced Search Panel' } )
                ),

                // Settings Form
                UTIL.createRow(
                    $( '<form>', { 'id': 'd-settings-form', 'class': 'form-horizontal', 'role': 'form' } ).append(
                        // Form Title
                        UTIL.createRow(
                            $( '<h3>' ).text( 'Advanced Search' )
                        ),

                        // Data Set
                        UTIL.createFormRow(
                            $( '<div>', { 'class': 'col-xs-12 col-sm-2 col-md-2 col-lg-2' } ).append(
                                $( '<label>', { 'for': 'd-rep' } ).text( 'Data Set' )
                            ),
                            $( '<div>', { 'class': 'col-xs-12 col-sm-10 col-md-10 col-lg-10' } ).append(
                                $( '<div>', { 'class': 'col-xs-12 col-sm-9 col-md-9 col-lg-9 padding-0' } ).append(
                                    $( '<select>', { id: 'd-rep', 'name': 'd-rep', 'class': 'form-control multiselect', 'required': 'required' } ).append(
                                        $( '<option>', { 'value': 'FEDEO' , 'data-mode': 'collection', 'data-desx': 'http://fedeo.esa.int/opensearch/description.xml' } ).text( 'FEDEO' ),
                                        $( '<option>', { 'value': 'Sentinel1A', 'data-mode': 'results'   , 'data-endp': 'https://data2.terradue.com/eop/ever-est/dataset/search/', 'selected': 'selected' } ).text( 'Sentinel1A' )
                                    )
                                ),
                                $( '<div>', { 'class': 'col-xs-12 col-sm-1 col-md-1 col-lg-1 padding-0 float-right' } ).append(
                                    $( '<button>', { id: 'd-rep-add', 'class': 'form-control btn btn-primary text-center fg-ee-primary bg-white bd-white', 'type': 'button', 'data-toggle': 'modal', 'data-target': '#d-rep-add-modal' } ).append(
                                        $( '<i>', { 'class': 'fa fa-plus', 'aria-hidden': 'true' } )
                                    )
                                )
                            )
                        ),

                        // Variable Fields div
                        $( '<div>', { 'id': 'd-settings-fields' } )
                    )
                )
            ).hide();
        },

        // Init Third Parties Plugins
        _init3rdPartiesPlugins: function() {
            // Init DateTime Pickers
            $( '.dtPicker' ).each( function(){
                $( this ).datetimepicker( {
                    format: 'DD/MM/YYYY HH:mm:ss',
                    showTodayButton: true,
                    showClear: true,
                    showClose: true,
                    toolbarPlacement: 'top',
                } );
            } );

            // Init Multi-select
            $( '.multiselect' ).each( function() {
                $( this ).multiselect();
            } );

// $('.number').each(function(i, obj) {
// $(this).spinner({
// min: 0,
// max: 100,
// step: 1
// }).height(20).width(50).on('change spinstop', function() {
// // Avoid numbers > 100.
// if ($(this).val() > 100) {
// $(this).val(100);
// }
// // Avoid numbers < 0.
// if ($(this).val() < 0) {
// $(this).val(0);
// }
//                    
// // Gets the closest form (that's the a grand....parent).
// var parentForm = $(this).closest('form');
// // Gets the ID of the Data Field.
// var fieldId = $(this).attr('name');
// // Validate the date when user change it
// parentForm.data('formValidation').updateStatus(fieldId, 'NOT_VALIDATED',
// null).validateField(fieldId);
// });
// });
        },

        // Add Handlers
        _addHandlers: function() {
            var self = this;

            // Update Search Bounding Box on 'updateBoundingBox' event
            document.addEventListener( 'updateBoundingBox', function( e ) {
                var coords = e.detail;
                // coords: [ type, latMax, latMin, lonMax, lonMin ]
                if ( 'AREA' === coords[ 0 ] ) {
                    // From "[ type, latMin, lonMin, latMax, lonMax ]" to "lonMin;latMin;lonMax;latMax"
                    var tmp = coords.slice( 1 );
                    document.getElementById( 'd-geo_box' ).value = [ tmp[ 1 ], tmp[ 0 ], tmp[ 3 ], tmp[ 2 ] ].join( ',' );
                }
            }, true );

            // Show Search Settings
            $( '#d-show-settings-panel' ).on( 'click', function() {
                var panel = $( '#d-settings-panel' );
                if ( panel.hasClass( 'is-closed' ) ) {
                    // Close Results Panel
                    if ( $( '#d-results-panel' ).hasClass( 'is-open' ) ) {
                        $( '#d-show-results-panel' ).trigger( 'click' );
                    }

                    // Show Settings Panel
                    $( panel ).slideDown( '350' );
                    $( panel ).removeClass( 'is-closed' );
                    $( panel ).addClass( 'is-open' );

                    $( this ).addClass( 'active' );
                } else if ( $( panel ).hasClass( 'is-open' ) ) {
                    // Hide Settings Panel
                    $( panel ).slideUp( '350' );
                    $( panel ).removeClass( 'is-open' );
                    $( panel ).addClass( 'is-closed' );

                    $( this ).removeClass( 'active' );
                }
            } );

            // Show results Panel
            $( '#d-show-results-panel' ).on( 'click', function() {
                var panel = $( '#d-results-panel' );
                if (panel.hasClass( 'is-closed' )) {
                    // Close Settings Panel
                    if ( $( '#d-settings-panel' ).hasClass( 'is-open' ) ) {
                        $( '#d-show-settings-panel' ).trigger( 'click' );
                    }

                    // Show Results Panel
                    panel.slideDown( '350' );
                    panel.removeClass( 'is-closed' );
                    panel.addClass( 'is-open' );

                    $( this ).addClass( 'active' );
                } else if ( panel.hasClass( 'is-open' ) ) {
                    // Hide Results Panel
                    panel.slideUp( '350' );
                    panel.removeClass( 'is-open' );
                    panel.addClass( 'is-closed' );

                    $( this ).removeClass( 'active' );
                }
            } );

            // Close Settings Panel
            $( '#d-settings-panel-closer' ).on( 'click', function() {
                $( '#d-show-settings-panel' ).trigger( 'click' );
            } );

            // Close Results Panel
            $( '#d-results-panel-closer' ).on( 'click', function() {
                $( '#d-show-results-panel' ).trigger( 'click' );
            } );

            // Resize Results Panel
            $( '#d-results-panel-resizer' ).on( 'click', function() {
                var width = $( '#d-results-panel' ).width();
                var height = $( '#d-results-panel' ).height();
                var saWidth = $( '#scrollArea' ).width();
                var saHeight = $( '#scrollArea' ).height();

                if ( $( this ).hasClass( 'fa-expand' ) ) {
                    // Save original size to sessionStorage
                    if ( sessionStorage.getItem( 'd-results-panel-original-width') == null ) {
                        sessionStorage.setItem( 'd-results-scrollarea-original-width', String( saWidth ) + 'px' );
                        sessionStorage.setItem( 'd-results-scrollarea-original-height', String( saHeight ) + 'px' );
                        sessionStorage.setItem( 'd-results-panel-original-width', String( width ) + 'px' );
                        sessionStorage.setItem( 'd-results-panel-original-height', String( height ) + 'px' );
                    }

                    $( this ).removeClass( 'fa-expand' );
                    $( this ).addClass( 'fa-compress' );
                    $( this ).prop( 'title', 'Reduce Results Panel' );

                    var hSpace = ($( document ).width() - $( '#d-results-panel' ).offset().left) / 100 * 85;
                    var vSpace = ($( document ).height() - $( '#d-results-panel' ).offset().top) / 100 * 75;
                    width = hSpace;
                    height = vSpace + 17;
                    saWidth = hSpace ;
                    saHeight = vSpace - 110;
                } else if ( $( this ).hasClass( 'fa-compress' ) ) {
                    $( this ).removeClass( 'fa-compress' );
                    $( this ).addClass( 'fa-expand' );
                    $( this ).prop( 'title', 'Expand Results Panel' );
                    
                    // Restore original size from sessionStorage
                    width = sessionStorage.getItem( 'd-results-panel-original-width');
                    height = sessionStorage.getItem( 'd-results-panel-original-height');
                    saWidth = sessionStorage.getItem( 'd-results-scrollarea-original-width');
                    saHeight = sessionStorage.getItem( 'd-results-scrollarea-original-height');
                }

                // Update divs' sizes
                $( '#d-results-panel' ).width( width );
                $( '#d-results-panel' ).height( height );
                $( '#scrollArea' ).css( {
                    'min-width': saWidth,
                    'width': saWidth,
                    'min-height': saHeight,
                    'height': saHeight
                } );
            } );

            // Search
            $( '#d-search' ).on( 'click', function() {
                // Restore Setting and Result Panels
                if ( $( '#d-settings-panel' ).hasClass( 'is-open' ) ) {
                    $( '#d-show-settings-panel' ).trigger( 'click' );
                }
                if ( $( '#d-results-panel-resizer' ).hasClass( 'fa-compress' ) ) {
                    $( '#d-results-panel-resizer' ).trigger( 'click' );
                }
                if ( $( '#d-results-panel' ).hasClass( 'is-open' ) ) {
                    $( '#d-show-results-panel' ).trigger( 'click' );
                }

                // Update Bounding Box Coordinates
                document.dispatchEvent( new Event( 'requestUpdateBoundingBox' ) );

                var dRepValu = $( '#d-rep' ).val();
                var dRepEndp = $( '#d-rep>option[value="' + dRepValu + '"]' ).attr( 'data-endp' );
                var dRepDesx = $( '#d-rep>option[value="' + dRepValu + '"]' ).attr( 'data-desx' );
                var dRepMode = $( '#d-rep>option[value="' + dRepValu + '"]' ).attr( 'data-mode' );

                // Get Data
                $.ajax({
                  url: '/discovery/search/',
                  type: 'GET',
                  async: true,
                  dataType: 'json',
                  data: {
                      dMode: dRepMode,
                      dForm: $( '#d-settings-form' ).serialize(),
                      dSearchTerms: $( '#d-search-text' ).val(),
                      dRepEndP: dRepEndp,
                      dRepDesX: dRepDesx,
                  },
                  success: function ( response ) {
                      // 'Id', 'Preview', 'Number of Records', 'Media Type',
                        // 'Metadata',
                      var fieldList = [ 'Identifier', 'Title', 'Date', 'Published', 'Updated', 'Description', 'Product Type', 'Orbit', 'Track', 'Swath', 'Start', 'End' ]
                      self._onSuccessSearch( response, fieldList, 'PolygonList', function() {
                          // Close the Search Settings Panel
                          if ($( '#d-show-settings-panel' ).hasClass( 'is-open' ) ) {
                              $( '#d-show-settings-panel' ).trigger( 'click' );
                          }
                      }, function() {
                          // Show Results Panel
                          $( '#d-show-results-panel' ).show();
                          $( '#d-show-results-panel' ).trigger( 'click' );
                      } );
                  },
                  error: function( response ) {
                      self._onFailureSearch( 'Error during Data Discovery (collection)!' );
                  }
              } );
              return false
            } );

            // Confirm Add Repository
            $( '#d-rep-add-conf' ).on( 'click', function() {
                var isDescriptorXml = ( $( '#d-rep-add-endp' ).val().endsWith( 'descriptor' ) || $( '#d-rep-add-endp' ).val().endsWith( 'descriptor.xml' ) ) ? 'data-desx' : 'data-endp';
                $( '#d-rep' ).append(
                    $( '<option>', { 'value': $( '#d-rep-add-name' ).val(), isDescriptorXml: $( '#d-rep-add-endp' ).val() } ).text( $( '#d-rep-add-name' ).val() ) // , 'selected': $( '#d-rep-add-def' )
                );
                $( '#d-rep' ).multiselect( 'rebuild' );
            } );

            // Change Repository
            $( '#d-rep' ).on( 'change', function() {
                var dRepValu = $( this ).val();
                var dRepEndp = $( '#d-rep>option[value="' + dRepValu + '"]' ).attr( 'data-endp' );
                var dRepDesx = $( '#d-rep>option[value="' + dRepValu + '"]' ).attr( 'data-desx' );
                var dRepMode = $( '#d-rep>option[value="' + dRepValu + '"]' ).attr( 'data-mode' );
                $.ajax( {
                    url: '/discovery/repoinit/',
                    type: 'GET',
                    async: true,
                    dataType: 'json',
                    data: {
                        dMode: dRepMode,
                        dRep: dRepValu,
                        dRepEndP: dRepEndp,
                        dRepDesX: dRepDesx,
                    },
                    success: function (response) {
                        console.log( '"/discovery/repoinit/": success');
                        
                        // TODO Manage JSON Response
                        $( '#d-settings-fields' ).empty();
                        for ( var t in response ) {
                            // TEST
                            var clean_tag = response[ t ].clean_tag;
                            // ( clean_tag.indexOf( 'platform' ) !== -1 )
                            if ( ( clean_tag.indexOf( 'geo:uid' ) !== -1 ) || ( clean_tag.indexOf( 'geo:box' ) !== -1 ) || ( clean_tag.indexOf( 'time:start' ) !== -1 ) || ( clean_tag.indexOf( 'parentIdentifier' ) !== -1 ) ) {
                                var type = response[ t ].type;
                                var options = response[ t ].options;
                                
                                if ( 'time:start' == clean_tag ) { // Check only for start time ( i.indexOf( 'time:end' ) !== -1 )
                                    self._addComplexFormRow( '#d-settings-fields', dictionary[ clean_tag ], 'd-' + t, response[ t ].type, response[ t ].options, dictionary[ 'time:end' ], 'd-time_end', response[ 'time_end' ].type, response[ 'time_end' ].options );
                                } else if ( 'geo:lat' == clean_tag ) { // Check only for latitude ( i.indexOf( 'geo:lon' ) !== -1 )
                                    self._addComplexFormRow( '#d-settings-fields', dictionary[ clean_tag ], 'd-' + t, response[ t ].type, response[ t ].options, dictionary[ 'geo:lon' ], 'd-geo_lon', response[ 'geo_lon' ].type, response[ 'geo_lon' ].options );
                                } else if ( clean_tag in dictionary ) {
                                    self._addSimpleFormRow( '#d-settings-fields', dictionary[ clean_tag ], 'd-' + t, response[ t ].type, response[ t ].options );
                                }
                            }
                        }

                        // Init DateTime Pickers TODO
                        $( '.dtPicker' ).each( function(){
                            $( this ).datetimepicker( {
                                format: 'DD/MM/YYYY HH:mm:ss',
                                showTodayButton: true,
                                showClear: true,
                                showClose: true,
                                toolbarPlacement: 'top',
                            } );
                        } );

                    },
                    error: function(response) {
                        console.log( '"/discovery/repoinit/": failure' );

                        // Hide Results Panel
                        $( '#d-show-results-panel' ).hide();

                        // Show Error Message
                        eeNotify.error( 'Error during Discovery Widget Init!' );
                    }
                } );
                return false;
            } );

            // Click on Search Text field: select all
            $( '#d-search-text' ).on( 'click', function() {
                $( this ).select();
            } );

            // Manage Pagination
            $( '.d-results-panel-navigator-el' ).each( function() {
                $( this ).on( 'click', function() {
                    $.ajax({
                        url: '/discovery/search/',
                        type: 'GET',
                        async: true,
                        dataType: 'json',
                        data: {
                            dMode: $( this ).data( 'data-mode' ),
                            dCustomStart: JSON.stringify( $( this ).data( 'data-sr' ) ),
                            dForm: $( '#d-settings-form' ).serialize(),
                            dSearchTerms: $( '#d-search-text' ).val(),
                            dRepDesX: $( this ).data( 'data-descx' ),
                        },
                        success: function ( response ) {
                            var fieldList = [ 'Identifier', 'Title', 'Date', 'Published', 'Updated', 'Description', 'Product Type', 'Orbit', 'Track', 'Swath', 'Start', 'End' ];
                            self._onSuccessSearch( response, fieldList, 'PolygonList', null, null );
                        },
                        error: function( response ) {
                            self._onFailureSearch( 'Error during Data Discovery (results)!' );
                        }
                    } );
                } );
            } );

            // Cart
            $( '#d-results-cart' ).on( 'click', function() {
                self._showCart( $( this ) );
            } );

            console.log( 'Discovery Handlers initialized' );
        },

        _onSuccessSearch: function( response, fieldsToShow, polygonField, preManageDataFunction, preDrawOnGlobeFunction ) {
            console.log( '"/discovery/search/": success' );

            var self = this;

            if ( preManageDataFunction && ( typeof preManageDataFunction == "function" ) ) {
                preManageDataFunction();
            }

            // Navigator
            $( '#d-results-panel-navigator-curr-page-num' ).text( Math.ceil( parseInt( response.startIndex ) / parseInt( response.itemsPerPage ) ) );
            $( '#d-results-panel-navigator-total-page-num' ).text( Math.ceil( parseInt( response.totalResults ) / parseInt( response.itemsPerPage ) ) );
            var min = Math.min( response.totalResults, ( parseInt( response.startIndex ) + parseInt( response.itemsPerPage ) - 1 ) )
            $( '#d-results-panel-navigator-curr-res-num' ).text( response.startIndex + '-' + min );
            $( '#d-results-panel-navigator-total-res-num' ).text( response.totalResults );
            $( '#d-results-panel-navigator-first' ).data( { 'data-sr': response.first, 'data-mode': response.mode, 'data-descx': response.dataDescX } );
            $( '#d-results-panel-navigator-prev' ).data( { 'data-sr': response.prev, 'data-mode': response.mode, 'data-descx': response.dataDescX } );
            $( '#d-results-panel-navigator-next' ).data( { 'data-sr': response.next, 'data-mode': response.mode, 'data-descx': response.dataDescX } );
            $( '#d-results-panel-navigator-last' ).data( { 'data-sr': response.last, 'data-mode': response.mode, 'data-descx': response.dataDescX } );

            var data = ( Object.keys( response.data ).length > 0 ) ? [] : null;
            var polygonData = [];
            for ( var i in response.data ) {
                var rowId = 'd-row-' + i;

                var row = $( '<tr>', { 'id': rowId, 'class': 'cursor-pointer d-row' } ).append( funcCell, dataCell );
                sessionStorage.setItem( rowId + '-data-params', JSON.stringify( response.data[ i ][ 'entryParams' ] ) );
                sessionStorage.setItem( rowId + '-data-descx', response.data[ i ][ 'descx' ] );

                var dataCell = $( '<td>', { 'class': 'container data-cell' , 'width': '90%' } );
                for ( var j in fieldsToShow ) {
                    if ( response.data[ i ][ fieldsToShow[ j ] ] ) {
                        dataCell.append(
                            $( '<div>', { 'class': 'row' } ).append(
                                $( '<div>', { 'class': 'col-md-2' } ).text( fieldsToShow[ j ] ),
                                $( '<div>', { 'class': 'col-md-10 ' + fieldsToShow[ j ].toLowerCase() } ).text( response.data[ i ][ fieldsToShow[ j ] ] )
                            )
                        );
                    }
                }
                polygonData.push( response.data[ i ][ polygonField ] );

                // Functions cell
                var downloadButton = '';
                if ( $.inArray( 'Download', fieldsToShow ) ) {
                    downloadButton = $( '<div>', { 'class': 'col-md-12 text-center fg-ee-primary' } ).append(
                        $( '<a>', { 'class': 'd-results-download-to-vrc', 'href': response.data[ i ][ 'Download' ], 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'left', 'title': 'Download to VRC' } ).append(
                            $( '<span>', { 'class': 'fa fa-download' } )
                        )
                    );
                }
                var funcCell = $( '<td>', { 'class': 'func-cell', 'width': '5%' } );
                if ( 'results' == response.mode ) {
                    $( document ).data( rowId + '-data-pos', response.data[ i ][ polygonField ] );
                    funcCell.append(
                        $( '<div>', { 'id': rowId + '-func-row', 'class': 'row func-row' } ).append(
                            $( '<div>', { 'id': rowId + '-data-pos', 'class': 'col-md-12 text-center fg-ee-primary d-results-show-on-map', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'left', 'title': 'Center on Map' } ).append(
                                $( '<span>', { 'class': 'fa fa-map-marker' } )
                            ),
                            $( '<div>', { 'class': 'col-md-12 text-center fg-ee-primary d-results-details', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'left', 'title': 'Show Details' } ).append(
                                $( '<span>', { 'class': 'fa fa-eye' } )
                            ),
                            $( '<div>', { 'class': 'col-md-12 text-center fg-ee-primary d-results-add-to-cart', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'left', 'title': 'Add to Cart' } ).append(
                                $( '<span>', { 'class': 'fa fa-cart-plus' } )
                            ),
//                            $( '<div>', { 'class': 'col-md-12 text-center fg-ee-primary d-results-add-to-ro', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'left', 'title': 'Add To RO' } ).append(
//                                    $( '<span>', { 'class': 'fa fa-plus' } )
//                            ),
                            $( '<div>', { 'class': 'col-md-12 text-center' } ).addtoro( { btnStyle: 'background-color: inherit' } ),
                            downloadButton
                        )
                    );
                }

                data.push( row.prop( 'outerHTML' ) );
            }

            if ( ! data || ( data.length == 0 ) ) {
                var clusterize = new Clusterize( {
                    scrollId: 'scrollArea',
                    contentId: 'contentArea'
                } );
                clusterize.clear();
            } else {
                var clusterize = new Clusterize( {
                    rows: data,
                    scrollId: 'scrollArea',
                    contentId: 'contentArea'
                } );
            }

            // Add Collection Row Handlers
            if ( 'collection' == response.mode ) {
                $( '.d-row' ).each( function() {
                    $( this ).on( 'click', function() {
                        var id = $( this ).attr( 'id' );
                        var params = JSON.parse( sessionStorage.getItem( id + '-data-params') );
                        var descx = sessionStorage.getItem( id + '-data-descx');
    
                        for ( var i in params ) {
                            var value = params[ i ];
                            switch ( i ) {
                                case 'parentIdentifier':
                                    $( '#d-eo_parentIdentifier' ).val( value );
                                    break;
                                case 'uid':
    // $( '#d-geo_uid' ).val( value );
                                    break;
                            }
                        }
    
                        $.ajax({
                            url: '/discovery/search/',
                            type: 'GET',
                            async: true,
                            dataType: 'json',
                            data: {
                                dMode: 'results',
                                dForm: $( '#d-settings-form' ).serialize(),
                                dSearchTerms: $( '#d-search-text' ).val(),
                                dRepDesX: descx,
                            },
                            success: function ( response ) {
                                var fieldList = [ 'Identifier', 'Title', 'Date', 'Published', 'Updated', 'Description', 'Product Type', 'Orbit', 'Track', 'Swath', 'Start', 'End' ];
                                self._onSuccessSearch( response, fieldList, 'PolygonList', null, null );
                            },
                            error: function( response ) {
                                self._onFailureSearch( 'Error during Data Discovery (results)!' );
                            }
                        } );
                    });
                } );
            } else if ( 'results' == response.mode ) {
                $( '.d-results-show-on-map' ).each( function() {
                    var self = $( this );
                    self.on( 'click', function() {
                        var polygon = $( document ).data( self.attr( 'id' ) );

                        // TODO call VGLOBE DRAW / KEEP ROW HIGHLIGHTED
                        alert( 'TODO: call VGLOBE DRAW / KEEP ROW HIGHLIGHTED' );
                    } );
                } );
                $( '.d-results-add-to-cart' ).each( function() {
                    $( this ).on( 'click', function() {
                        self._addToCart( $( this ) );
                    } );
                } );
//                $( '.d-results-add-to-ro' ).each( function() {
//                    $( this ).on( 'click', function() {
//                        self._addToRO( $( this ) );
//                    } );
//                } );
                $( '.d-results-download-to-vrc' ).each( function() {
                    $( this ).on( 'click', function( e ) {
                        e.preventDefault();
                        
                        $.ajax({
                            url: '/discovery/download/',
                            type: 'GET',
                            async: true,
                            dataType: 'html',
                            data: {
                                dHref: $( this ).attr( "href" ) + ';',
                            },
                            success: function ( response ) {
                                console.log( '"/discovery/download/": success' );

                                eeNotify.success( 'Download on VRC started' );
                            },
                            error: function( response ) {
                                console.log( '"/discovery/download/": failure' );

                                // Show Error Message
                                eeNotify.error( 'Error during products download' );
                            }
                        } );
                    } );
                } );
            }

            if ( preDrawOnGlobeFunction && ( typeof preDrawOnGlobeFunction == "function" ) ) {
                preDrawOnGlobeFunction();
            }

            // Trigger Data Available Event
            $( document ).trigger( 'addRenderableLayerEvent', [ 'Discovery Poligons' ] );
//            $( document ).trigger( 'removeAllPolygonsEvent' );
            for ( var i in polygonData ) {
                // TODO TEST
                //if (i == 0) {
                    $( document ).trigger( 'discoveryDataAvailableEvent', [ 'Discovery Poligons', polygonData[ i ].type, 'latlong', polygonData[ i ].coordinates ] );
                //}
            }
        },

        _onFailureSearch: function( msg ) {
            console.log( '"/discovery/search/": failure' );

            // Hide Results Panel
            $( '#d-show-results-panel' ).hide();

            // Show Error Message
            eeNotify.error( msg );
        },

        _addToCart: function( elto ) {
            var rowId = '#' + elto.parents( 'tr' ).attr( 'id' );
            var downLink = $( rowId + ' > td.func-cell > div > div > a.d-results-download-to-vrc' ).attr( 'href' );
            var productId = $( rowId + ' > td.data-cell > div.row > div.identifier' ).text();
            if ( ! productId ) {
                productId = $( rowId + ' > td.data-cell > div.row > div.title' ).text();
            }

            var data = $( '#d-results-cart' ).data( 'data-products' );
            if ( $( rowId ).hasClass( 'added-to-cart' ) ) {
                $( rowId ).removeClass( 'added-to-cart' );
                elto.removeClass( ' fg-green' );
                elto.addClass( 'fg-ee-primary' );

                eeNotify.warning( 'Product "' + productId + '" removed from Cart!' );
                delete data[ productId ];
            } else {
                $( rowId ).addClass( 'added-to-cart' );
                elto.addClass( ' fg-green' );
                elto.removeClass( 'fg-ee-primary' );

                eeNotify.success( 'Product "' + productId + '" added to Cart!' );

                data[ productId ] = downLink;
            }
            $( '#d-results-cart' ).data( 'data-products', data );

            // Disable cart if no products are selected
            if ( Object.keys( data ).length > 0 ) {
                $( '#d-results-cart' ).removeClass( 'disabled' );
            } else {
                $( '#d-results-cart' ).addClass( 'disabled' );
            }
        },

//        _addToRO: function( elto ) {
//            alert( 'TODO' );
//        },

        _showCart: function( elto ) {
            if ( elto.hasClass( 'disabled' ) ) {
                eeNotify.info( 'Add products to the cart' );
            } else {
                var data = elto.data( 'data-products' );

                if ( data ) {
                    $.ajax({
                        url: '/discovery/download/',
                        type: 'GET',
                        async: true,
                        dataType: 'html',
                        data: {
                            dHref: JSON.stringify( data ),
                        },
                        success: function ( response ) {
                            console.log( '"/discovery/download/": success' );

                            eeNotify.success( 'Download of the Products to the VRC started!' );
                        },
                        error: function( response ) {
                            console.log( '"/discovery/download/": failure' );

                            // Show Error Message
                            eeNotify.error( 'Error during Products download.' );
                        }
                    } );
                } else {
                    eeNotify.warning( 'Empty Cart!' );
                }
            }
        }

    } );

} );