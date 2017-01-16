var MAIN = {

    init : function() {
        // Trigger Update Position Event
        $( document ).trigger( 'updatePositionEvent', '44.8381;11.6198;7750000' );

//        this._initUserHeaderMenu();

        this._initBottomBar();

        this._initRightBar();

        this._init3rdPartiesPlugins();

//        this._addHandlers();
    },

    _initUserHeaderMenu: function( smFilters ) {
        $( '#user-header-menu' ).append(
            $( '<li>' ).append(
                $( '<a>', { 'id': 's-parent' } ).seafileuploader( { enableModal: true } )
            ),
            $( '<li>' ).append(
                $( '<a>', { 'id': 'r-search-ros' } )
            )
        );

        $( '#r-search-ros' ).rosearch( { showFiltersOnInit: true, searchParent: '#right-bar', listContainer: '#right-bar > div.panel-body', listParent: '#bottom-bar', listContainer: '#bottom-bar > div.panel-body', moreFilters: smFilters } )
    },

    _initRightBar: function() {
        var self = this;

        $.ajax({
            url: '/seamonitoring/init/',
            type: 'GET',
            async: true,
            dataType: 'json',
            success: function ( response ) {
                console.log( '"/seamonitoring/init/": success' );

//                var rightBarBody = $( '#right-bar > div.panel-body' );
                var col1 = 3;
                var col2 = 9;

                // Countries
                var keys = []
                for ( k in response.countries ) {
                    keys.push( k );
                }
                keys.sort();
                var countries = $( '<select>', { 'id': 'sm-country', 'name': 'sm-country', 'class': 'form-control multiselect drawable', 'multiple': 'multiple', 'data-layer': 'Countries Layer' } );
                for ( k in keys ) {
                    countries.append(
                        $( '<option>', { 'value': keys[ k ] } ).text( keys[ k ] )
                            .data( 'crs', response.countries[ keys[ k ] ].crs )
                            .data( 'properties', response.countries[ keys[ k ] ].properties )
                            .data( 'geometry', response.countries[ keys[ k ] ].geometry )
                    );
                }

                // Sub-Regions
                var keys = []
                for ( k in response.subreg ) {
                    keys.push( k );
                }
                keys.sort();
                var subreg = $( '<select>', { 'id': 'sm-subreg', 'name': 'sm-subreg', 'class': 'form-control multiselect drawable', 'multiple': 'multiple', 'data-layer': 'Sub-Regions Layer' } );
                for ( k in keys ) {
                    subreg.append(
                        $( '<option>', { 'value': keys[ k ] } ).text( keys[ k ] )
                            .data( 'crs', response.subreg[ keys[ k ] ].crs )
                            .data( 'properties', response.subreg[ keys[ k ] ].properties )
                            .data( 'geometry', response.subreg[ keys[ k ] ].geometry )
                    );
                }

                // Descriptors
                var descriptor = $( '<select>', { 'id': 'sm-descriptor', 'name': 'sm-descriptor', 'class': 'form-control multiselect' } );
                var descriptorList = response.ges.descriptors;
                var gesList = [];
                for ( d in descriptorList ) {
                    var descriptorElem = descriptorList[ d ];
                    var msg = descriptorElem.code + ' ' + descriptorElem.description;

                    var dataCriteria = [];
                    var criteriaList = descriptorElem.criterias;
                    for ( var c in criteriaList ) {
                        var criteriaElem = criteriaList[ c ];
                        var m = criteriaElem.code + ' ' + criteriaElem.description;

                        var cTmp = {};
                        cTmp[ 'label' ] = m;
                        cTmp[ 'children' ] = [];
                        var indicatorList = criteriaElem.indicators;
                        for ( var i in indicatorList ) {
                            var indicatorElem = indicatorList[ i ];
                            var m2 = indicatorElem.code + ' ' + indicatorElem.description;

                            var iTmp = {};
                            iTmp[ 'label' ] = m2;
                            iTmp[ 'value' ] = m2;
                            cTmp[ 'children' ].push( iTmp );
                        }
                        dataCriteria.push( cTmp );
                        gesList.push( cTmp );
                    }

                    descriptor.append(
                        $( '<option>', { 'value': msg } ).text( msg ).data( 'data-criteria', dataCriteria )
                    );
                }
                descriptor.prop( 'selectedIndex', -1 );

                var smFilters = [
//                rightBarBody.append(
//                    $( '<form>', { 'class': 'form-horizontal padding-0', 'role': 'form' } ).append(
//                        // Form Title
//                        UTIL.createRow(
//                            $( '<h3>' ).text( 'Search' )
//                        ),

                        // Country
                        UTIL.createFormRow(
                            $( '<div>', { 'class': 'col-xs-12 col-sm-' + col1 + ' col-md-' + col1 + ' col-lg-' + col1 } ).append(
                                $( '<label>', { 'for': 'sm-country' } ).text( 'Country' )
                            ),
                            $( '<div>', { 'class': 'col-xs-12 col-sm-' + col2 + ' col-md-' + col2 + ' col-lg-' + col2 } ).append(
                                countries
                            )
                        ),

                        // Sub-Region
                        UTIL.createFormRow(
                            $( '<div>', { 'class': 'col-xs-12 col-sm-' + col1 + ' col-md-' + col1 + ' col-lg-' + col1 } ).append(
                                $( '<label>', { 'for': 'sm-subreg' } ).text( 'Sub-Region' )
                            ),
                            $( '<div>', { 'class': 'col-xs-12 col-sm-' + col2 + ' col-md-' + col2 + ' col-lg-' + col2 } ).append(
                                subreg
                            )
                        ),

                        // Descriptor
                        UTIL.createFormRow(
                            $( '<div>', { 'class': 'col-xs-12 col-sm-' + col1 + ' col-md-' + col1 + ' col-lg-' + col1 } ).append(
                                $( '<label>', { 'for': 'sm-descriptor' } ).text( 'Descriptor' )
                            ),
                            $( '<div>', { 'class': 'col-xs-12 col-sm-' + col2 + ' col-md-' + col2 + ' col-lg-' + col2 } ).append(
                                descriptor
                            )
                        ),

                        // Criterias / Indicators
                        UTIL.createFormRow(
                            $( '<div>', { 'class': 'col-xs-12 col-sm-' + col1 + ' col-md-' + col1 + ' col-lg-' + col1 } ).append(
                                $( '<label>', { 'for': 'sm-ges' } ).text( 'Crit./Ind.' )
                            ),
                            $( '<div>', { 'class': 'col-xs-12 col-sm-' + col2 + ' col-md-' + col2 + ' col-lg-' + col2 } ).append(
                                $( '<select>', { 'id': 'sm-ges', 'name': 'sm-ges', 'class': 'form-control', 'multiple': 'multiple' } )
                            )
                        )
                ];
//                        ,
//                        
//                        UTIL.createFormRow(
//                            $( '<div>', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12' } ).append(
//                                $( '<button>', { 'class': 'btn btn-default float-right bg-ee-primary fg-white', 'type': 'submit' } ).text( 'Search ROs' )
//                            )
//                        )
//                    )
//                );
                
                self._initUserHeaderMenu( smFilters );

                $( '#sm-country, #sm-descriptor' ).each( function() {
                    $( this ).multiselect( {
                        nonSelectedText: 'Nothing Selected',
                        enableFiltering: true,
                        enableCaseInsensitiveFiltering: true,
    //                    includeSelectAllOption: true,
                        buttonWidth: '20em',
                        maxHeight: 500,
                    } );
                } );
                $( '#sm-subreg' ).multiselect( {
                    nonSelectedText: 'Nothing Selected',
                    enableFiltering: true,
                    enableCaseInsensitiveFiltering: true,
//                includeSelectAllOption: true,
                    buttonWidth: '20em',
                    maxHeight: 500,
                    dropRight: true,
                } );
                $( '#sm-ges' ).multiselect( {
                    nonSelectedText: 'Nothing Selected',
                    enableClickableOptGroups: true,
                    enableCollapsibleOptGroups: true,
                    enableFiltering: true,
                    enableCaseInsensitiveFiltering: true,
                    filterBehavior: 'value',
                    includeSelectAllOption: true,
                    buttonWidth: '20em',
                    dropRight: true,
                } );
                $( '#sm-ges' ).data( 'data-criteria', gesList );
                $( '#sm-ges' ).multiselect( 'dataprovider', gesList );
                $( '#sm-ges' ).multiselect( 'rebuild' );

                self._addHandlers();
            },
            error: function( response ) {
                console.log( '"/seamonitoring/init/": failure' );

                // Show Error Message
                eeNotify.error( 'Error during Portal initialization' );
            }
        } );
    },

    _initBottomBar: function() {
        var self = this;
        $.ajax({
            url: '/eeauth/is_auth/',
            type: 'POST',
            async: false,
            dataType: 'json',
            data: {
                csrfmiddlewaretoken: UTIL.getCookie( 'csrftoken' ),
            },
            success: function (response) {
                console.log( '"/eeauth/is_auth/": success');
                
                if ( response.auth == true ) {
                    console.log( '"/eeauth/is_auth/": authenticated');

                    self._showBottomBar( false );
                } else {
                    console.log( '"/eeauth/is_auth/": NOT authenticated');

                    self._showBottomBar( true );
                }
            },
            error: function(response) {
                console.log( '"/eeauth/is_auth/": failure' );

                // NO ERROR MESSAGE
            }
        } );
    },

    _showBottomBar: function( show ) {
        if ( show ) {
            $( '#canvasOne' ).css( { 'min-height': '60vh', 'height': '60vh' } );
            $( '#bottom-bar' ).css( { 'min-height': '20vh', 'height': '20vh' } );
            $( '#bottom-bar' ).show();
        } else {
            $( '#canvasOne' ).css( { 'min-height': '80.8vh', 'height': '80.8vh' } );
            $( '#bottom-bar' ).hide();
        }
    },

    // Init Third Parties Plugins
    _init3rdPartiesPlugins: function() {
    },

    _addHandlers: function() {
        $( '.drawable' ).each( function() {
            $( this ).on( 'change', function() {
                var id = '#' + $( this ).attr( 'id' );
                var layerName = $( id ).attr( 'data-layer' );

                $( document ).trigger( 'addRenderableLayerEvent', [ layerName ] );
//                $( document ).trigger( 'removeAllPolygonsEvent', [ layerName ] );

                $( id + '>option:selected' ).each( function() {
                    var polygonData = $( this ).data( 'geometry' );

                    // Trigger Data Available Event
                    // TODO , $( this ).data( 'crs' )
                    $( document ).trigger( 'discoveryDataAvailableEvent', [ layerName, polygonData.type, 'longlat', polygonData.coordinates ] );
                } );
            } );
        } );

        $( '#sm-descriptor' ).on( 'change', function() {
            var data = $( '#sm-descriptor > option:selected' ).data( 'data-criteria' );
            if ( null == $( this ).val() ) {
                data = $( '#sm-ges' ).data( 'data-criteria' );
            }
            $( '#sm-ges' ).multiselect( 'dataprovider', data );
            $( '#sm-ges' ).multiselect( 'rebuild' );
        } );
    },

    _remHandlers: function() {
    },
};

$( document ).ready( function() {
    MAIN.init();
} );