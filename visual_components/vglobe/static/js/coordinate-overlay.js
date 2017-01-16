$( function () {
    $.widget( 'earthserver.coordinateOverlay', {
        options: {
            container: $( '#service-container' )
        },

        _create: function () {
            $( '<div>', { 'id': 'coordinate-overlay' } ).append(
                $( '<span>', { 'class': 'coordinate-container' } ).append(
                    $( '<span>' ).text( 'Latitude: ' ),
                    $( '<span>', { 'id': 'terrainLatitude' } )
                ),
                $( '<span>', { 'class': 'coordinate-container' } ).append(
                    $( '<span>' ).text( 'Longitude: ' ),
                    $( '<span>', { 'id': 'terrainLongitude' } )
                ),
                $( '<span>', { 'class': 'coordinate-container' } ).append(
                    $( '<span>' ).text( 'Elevation: ' ),
                    $( '<span>', { 'id': 'terrainElevation' } )
                ),
                $( '<span>', { 'class': 'coordinate-container' } ).append(
                    $( '<span>' ).text( 'Altitude: ' ),
                    $( '<span>', { 'id': 'eyeAltitude' } )
                )
            ).appendTo( this.options.container );
        }
    } )
} );
