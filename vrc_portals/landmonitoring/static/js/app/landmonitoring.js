var MAIN = {
    init : function() {
        // Trigger Update Position Event
        $( document ).trigger( 'updatePositionEvent', '40.4168;-3.7038;2300000' );

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
            )
        );

        $( '#r-search-ros' ).rosearch( { searchParent: '#right-bar', listContainer: '#right-bar > div.panel-body', listParent: '#bottom-bar', listContainer: '#bottom-bar > div.panel-body' } )
    },

    _initRightBar: function() {
//        var rightBarBody = $( '#right-bar > div.panel-body' );
//        rightBarBody.rosearch();
    },

    _initBottomBar: function() {
        var self = this;
        // TODO TEST
//        $.ajax({
//            url: '/eeauth/is_auth/',
//            type: 'POST',
//            async: false,
//            dataType: 'json',
//            data: {
//                csrfmiddlewaretoken: UTIL.getCookie( 'csrftoken' ),
//            },
//            success: function (response) {
//                console.log( '"/eeauth/is_auth/": success');
//
//                if ( response.auth == true ) {
//                    console.log( '"/eeauth/is_auth/": authenticated');
//
//                    self._showBottomBar( false );
//                } else {
//                    console.log( '"/eeauth/is_auth/": NOT authenticated');

                    self._showBottomBar( true );
//                }
//            },
//            error: function(response) {
//                console.log( '"/eeauth/is_auth/": failure' );
//
//                // NO ERROR MESSAGE
//            }
//        } );
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
    },

    _remHandlers: function() {
    },
};

$( document ).ready( function() {
    MAIN.init();
} );
