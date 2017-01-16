var MAIN = {
    init : function() {
        // Trigger Update Position Event
        $( document ).trigger( 'updatePositionEvent', '54.3498;-6.2603;2700000' );

        this._initUserHeaderMenu();

        this._initBottomBar();

        this._initRightBar();

        this._init3rdPartiesPlugins();

        this._addHandlers();
    },

    _initUserHeaderMenu: function() {
        $( '#user-header-menu' ).append(
            $( '<li>' ).append(
                $( '<a>', { 'id': 's-parent' } ).seafileuploader( { enableModal: true } )
            ),
            $( '<li>' ).append(
                $( '<a>', { 'id': 'r-search-ros' } )
            ),
            $( '<li>' ).append(
                $( '<a>', { 'class': 'nav-icon cursor-pointer', 'data-container': 'body', 'data-toggle': 'tooltip', 'data-placement': 'bottom', 'title': 'Recent Activity' } ).append(
                    $( '<span>', { 'class': 'fa fa-history' } )
                )
            )
        );

        $( '#r-search-ros' ).rosearch( { searchParent: '#right-bar', listContainer: '#right-bar > div.panel-body', listParent: '#bottom-bar', listContainer: '#bottom-bar > div.panel-body' } )
    },

    _initRightBar: function() {
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
        $( '#search-ros' ).on( 'click', function() {
            var rightBarBody = $( '#right-bar > div.panel-body' );
            var col1 = 3;
            var col2 = 9;

            rightBarBody.append(
                $( '<form>', { 'class': 'form-horizontal padding-0', 'role': 'form' } ).append(
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
                            $( '<label>', { 'for': 'title' } ).text( 'Title' )
                        ),
                        $( '<div>', { 'class': 'col-xs-12 col-sm-' + col2 + ' col-md-' + col2 + ' col-lg-' + col2 } ).append(
                            $( '<input>', { 'id': 'title', 'class': 'form-control', 'type': 'text' } )
                        )
                    ),

                    // Creator
                    UTIL.createFormRow(
                        $( '<div>', { 'class': 'col-xs-12 col-sm-' + col1 + ' col-md-' + col1 + ' col-lg-' + col1 } ).append(
                            $( '<label>', { 'for': 'creator' } ).text( 'Creator' )
                        ),
                        $( '<div>', { 'class': 'col-xs-12 col-sm-' + col2 + ' col-md-' + col2 + ' col-lg-' + col2 } ).append(
                            $( '<input>', { 'id': 'creator', 'class': 'form-control', 'type': 'text' } )
                        )
                    ),

                    UTIL.createFormRow(
                        $( '<div>', { 'class': 'col-xs-12 col-sm-12 col-md-12 col-lg-12' } ).append(
                            $( '<button>', { 'class': 'btn btn-default float-right bg-ee-primary fg-white', 'type': 'submit' } ).text( 'Search ROs' )
                        )
                    )
                )
            );
        } );
    },

    _remHandlers: function() {
    },
};

$( document ).ready( function() {
    MAIN.init();
} );
