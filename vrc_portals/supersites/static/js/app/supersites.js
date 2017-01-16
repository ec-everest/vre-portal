var MAIN = {
    init : function() {
        // Trigger Update Position Event
        $( document ).trigger( 'updatePositionEvent', '44.8381;11.6198;7000000' );

        this._initUserHeaderMenu();

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
                $( '<a>', { 'class': 'nav-icon cursor-pointer' } ).append(
                    $( '<span>', { 'class': 'fa fa-map-marker' } )
                ),
                $( '<select>', { 'id': 'ss-supersite', 'class': 'multiselect' } ).append(
//                    $( '<option>', { 'value': 'EMP', 'data-pos': '44.8381;11.6198;7750000' } ).text( '' ),
                    $( '<option>', { 'value': 'ETN', 'data-pos': '37.7510;14.9934;400000' } ).text( 'Mt. Etna Volcano' ),
                    $( '<option>', { 'value': 'CFL', 'data-pos': '40.8270;14.1390;300000' } ).text( 'Campi Flegrei' ),
                    $( '<option>', { 'value': 'ICL', 'data-pos': '64.9631;-19.0208;800000' } ).text( 'Iceland Volcanoes' ),
                    $( '<option>', { 'value': 'HAW', 'data-pos': '20.8968;-157.5828;1400000' } ).text( 'Hawaii Volcanoes' )
                ).prop( 'selectedIndex', -1 )
            ),
            $( '<li>' ).append(
                $( '<a>', { 'class': 'nav-icon cursor-pointer' } ).append(
                    $( '<span>', { 'class': 'fa fa-book' } )
                ),
                $( '<select>', { 'id': 'ss-subject', 'class': 'multiselect' } ).append( //, 'multiple': 'multiple'
                    $( '<option>', { 'value': 'VOL'} ).text( 'Volcanology' ),
                    $( '<option>', { 'value': 'SEI'} ).text( 'Seismology' ),
                    $( '<option>', { 'value': 'GED'} ).text( 'Geodesy' ),
                    $( '<option>', { 'value': 'GEL'} ).text( 'Geology' ),
                    $( '<option>', { 'value': 'RES'} ).text( 'Remote Sensing' ),
                    $( '<option>', { 'value': 'GEC'} ).text( 'Geochemistry' )
                ).prop( 'selectedIndex', -1 )
            )
        );

        // TODO
        //$( '#r-search-ros' ).rosearch( { showFiltersOnInit: true, searchParent: '#right-bar-1', listContainer: '#right-bar > div.panel-body', listParent: '#bottom-bar', listContainer: '#bottom-bar > div.panel-body' } )
    },

    _initRightBar: function() {
    },

    // Init Third Parties Plugins
    _init3rdPartiesPlugins: function() {
        $( '#ss-supersite' ).multiselect( {
            nonSelectedText: 'Choose Supersite',
            buttonWidth: '9.5em',
        } );
        $( '#ss-subject' ).multiselect( {
            nonSelectedText: 'Choose Subject',
            buttonWidth: '10em',
        } );
    },

    _addHandlers: function() {
        $( '#ss-supersite' ).on( 'change', function( e ) {
            var pos = $( '#ss-supersite option:selected' ).attr( 'data-pos' );
            $( document ).trigger( 'updatePositionEvent', pos );

            $( '#bottom-bar > div.panel-body' ).empty();
            $( '#bottom-bar > div.panel-body' ).append(
                $( '<i>' ).text( 'EVER-EST Services for the ' + $( '#ss-supersite option:selected' ).text() + ' Supersite' )
            );
            $( '#right-bar-1 > div.panel-body' ).empty();
            $( '#right-bar-1 > div.panel-body' ).append(
                $( '<ul>' ).append(
                    $( '<li>' ).text( $( '#ss-supersite option:selected' ).text() + ' Supersite News' ),
                    $( '<li>' ).text( $( '#ss-supersite option:selected' ).text() + ' Supersite Links' ),
                    $( '<li>' ).text( $( '#ss-supersite option:selected' ).text() + ' Supersite Events' ),
                    $( '<li>' ).text( $( '#ss-supersite option:selected' ).text() + ' Supersite ...' )
                )
            );

            var text1 = ( null == $( '#ss-supersite option:selected' ).val() ) ? 'Generic Supersites' : $( '#ss-supersite option:selected' ).text();
            var text2 = ( null == $( '#ss-subject option:selected' ).val() ) ? 'Generic Subject' : $( '#ss-subject option:selected' ).text();
            $( '#right-bar-2 > div.panel-body' ).empty();
            $( '#right-bar-2 > div.panel-body' ).append(
                $( '<h3>' ).text( text1 + ' ' + text2 + ' Resources' ),
                $( '<ul>' ).append(
                    $( '<li>' ).text( 'Data' ),
                    $( '<li>' ).text( 'Products' ),
                    $( '<li>' ).text( 'Processing Services' ),
                    $( '<li>' ).text( 'Discussions' ),
                    $( '<li>' ).text( 'Reference Search' )
                )
            );
        } );
        $( '#ss-subject' ).on( 'change', function( e ) {
            var text1 = ( null == $( '#ss-supersite option:selected' ).val() ) ? 'Generic Supersites' : $( '#ss-supersite option:selected' ).text();
            var text2 = ( null == $( '#ss-subject option:selected' ).val() ) ? 'Generic Subject' : $( '#ss-subject option:selected' ).text();
            $( '#right-bar-2 > div.panel-body' ).empty();
            $( '#right-bar-2 > div.panel-body' ).append(
                $( '<h3>' ).text( text1 + ' ' + text2 + ' Resources' ),
                $( '<ul>' ).append(
                    $( '<li>' ).text( 'Data' ),
                    $( '<li>' ).text( 'Products' ),
                    $( '<li>' ).text( 'Processing Services' ),
                    $( '<li>' ).text( 'Discussions' ),
                    $( '<li>' ).text( 'Reference Search' )
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
