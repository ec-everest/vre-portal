$.extend( www, {
    handleCanvas : function() {
        // 2016-11-02 (ferraresi&gardenghi): if the canvas containing the
        // Virtual Globe has an offset to the page, it must be added to
        // viewport x/y to get the right position.
        var canvasOneRect = document.getElementById( 'canvasOne' ).getBoundingClientRect();
        var minX = canvasOneRect.left + www.www_object.viewport.getMinX() + 1;
        var minY = canvasOneRect.top + www.www_object.viewport.getMinY() + 1;
        var maxX = www.www_object.viewport.getMaxX();
        var maxY = www.www_object.viewport.getMaxY();

        var upper = www.www_object.pick( www.www_object.canvasCoordinates( minX, minY ) );
        if ( upper.objects.length > 0 ) {
            var upperLat = upper.objects[ 0 ].position.latitude;
            var upperLon = upper.objects[ 0 ].position.longitude;
        }

        var lower = www.www_object.pick( www.www_object.canvasCoordinates( maxX, maxY ) );
        if ( lower.objects.length > 0 ) {
            var lowerLat = lower.objects[ 0 ].position.latitude;
            var lowerLon = lower.objects[ 0 ].position.longitude;
        }

        if ( upper.objects.length < 1 || lower.objects.length < 1 ) {
            var type = 'ALL';

            return [ type, -180, -90, 180, 90 ];
        } else {
            var type = 'AREA';
            var latMax = Math.max( upperLat, lowerLat );
            var latMin = Math.min( upperLat, lowerLat );
            var lonMax = Math.max( upperLon, lowerLon );
            var lonMin = Math.min( upperLon, lowerLon );

            return [ type, latMin, lonMin, latMax, lonMax ];
        }
    }
} );
