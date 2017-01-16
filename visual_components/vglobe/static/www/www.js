 /**
 * @preserve Author: Damiano Barboni <barboni@meeo.it> Version: 3.0 Description:
 *           JS used to manage Web World Wind (www) map Changelog: Wed Oct 7
 *           16:54:30 CEST 2015 JS Module definition for MEA
 *
 */

// (function( mea, undefined ) {
function www(){
    this.__init__ = function(){
        // create www map
        this.create();
    };

    this.setZoom = false;
    this.setSelect = false;
    this.setHandDraw = false;
    this.setManageLayer = false;

    this.handCoordList = [];
    //AOI limit
    self.limitLatRectangle = 1000;
    self.limitLonRectangle = 1000;
    self.pixelRes = 0.1;
    // www object
    this.www_object  = null;
    // www static var
    this.sector         = WorldWind.Sector.FULL_SPHERE;
    this.levelZeroDelta = new WorldWind.Location(45, 45);
    this.numLevels      = 10;
    this.imageFormat    = "image/png";
    this.tileWidth      = 512;
    this.tileHeight     = 512;
}

$.extend( www.prototype, {

    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // www initialization and controll handlers
    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    // initialize map object
    create: function(){
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        this.highListMouse = [];

        this.www_object = new WorldWind.WorldWindow( "canvasOne" );
        this.www_object.deepPicking = true;

        // Reduce goTo Animation Timinig (from 3000 to 1000)
        var goToAnimator = new WorldWind.GoToAnimator( this.www_object );
        goToAnimator.travelTime = 1000;
        this.www_object.goToAnimator = goToAnimator;

        var layers = [
            //{layer: new WorldWind.BMNGLayer(), enabled: true}
            // {layer: new WorldWind.BMNGLandsatLayer(), enabled: true},
            {layer: new WorldWind.BingAerialLayer(null), enabled: true},
            // {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled:
            // false},
            // {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
            // {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled:
            // true}
            // {layer: new WorldWind.CoordinatesDisplayLayer( this.www_object ),
            // enabled: true},
            // {layer: new WorldWind.ViewControlsLayer( this.www_object ),
            // enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            this.www_object.addLayer(layers[l].layer);
        }

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager( this.www_object );
        // coordinate controller
        var coordinateController = new CoordinateController( this.www_object );

        var drawLayer = new WorldWind.RenderableLayer("Draw Layer");
        this.www_object.addLayer(drawLayer);

        // Create a layer to hold the polygons.
        //this.polygonsLayer = new WorldWind.RenderableLayer();
        //this.polygonsLayer.displayName = "Polygons";
        //this.www_object.addLayer( this.polygonsLayer );

        // Create a layer to manage Polygon click.
        //this.clickPolygonLayer = new WorldWind.RenderableLayer( "SelectedPolygon" );
        //this.www_object.addLayer( this.clickPolygonLayer );

        var clickAttributes = new WorldWind.ShapeAttributes(null);
        clickAttributes.drawOutline = false;
        clickAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 0.5);

        var self = this;
        $( document ).on( 'removeAllPolygonsEvent', function( event, layerName ) {
            self.www_object.removeEventListener('mousedown', self.handleZoom);
            self.www_object.removeEventListener('mousedown', self.handleSelection);
            self.www_object.removeEventListener('mousedown', self.handDrawPolygon)

            self.setZoom = false;
            self.setSelect = false;
            self.setHandDraw = false;

            $('.btn-circle').addClass('is-closed');
            $('.btn-circle').removeClass('is-open');
            $('#pan-tool').addClass('is-open');
            $('#pan-tool').removeClass('is-closed');

            self.handCoordList = [];

            self.limitLatRectangle = 1000;
            self.limitLonRectangle = 1000;
            self.pixelRes = 0.1;

            self.cleanRenderableLayer( layerName );
        });

        $( document ).on( 'addRenderableLayerEvent', function( event, layerName ) {
            // Add the Layer, if required
            self.addRenderableLayer( layerName );
            // Clean the Layer
            self.cleanRenderableLayer( layerName );
        } );

        // Draw polygons where data is available
        $( document ).on( 'discoveryDataAvailableEvent', function( event, layerName, type, mode, polygonData ) {
            // TODO TEST
            //type = 'MultiPolygon';
            //mode = 'latlong';
            //polygonData = [ [ [80.06955, 130.596695], [81.481154, 123.644224], [82.730735, 114.21219], [83.72093, 101.451472], [84.314649, 85.115614], [84.384731, 66.813673], [83.913055, 49.740909], [83.008374, 36.054375], [81.812919, 25.861278], [80.43501, 18.365798], [78.942542, 12.762762], [75.759605, 5.075505], [72.432371, 0.072308], [67.308359, -4.898269], [62.100495, -8.289532], [55.086806, -11.566063], [48.025107, -14.076283], [37.375978, -17.098559], [-14.429316, -28.729431], [-26.87244, -31.982201], [-35.700548, -34.73883], [-44.449757, -38.118637], [-53.073041, -42.573799], [-59.817672, -47.519942], [-64.719919, -52.65047], [-67.866192, -57.163433], [-70.859967, -62.995863], [-73.618644, -70.74194], [-74.869505, -75.579625], [-76.990816, -87.726968], [-77.795187, -95.176261], [-78.707731, -112.477828], [-78.529992, -130.89742], [-78.03582, -139.491737], [-76.383022, -154.12956], [-75.298798, -160.073698], [-72.775888, -169.580403], [-71.38501, -173.364316], [-68.680961, -179.045016], [-68.845314, -180.0], [-78.832436, -180.0], [-80.570768, -173.529648], [-81.929006, -165.857123], [-83.098614, -155.433447], [-83.969003, -141.503389], [-84.399019, -124.30602], [-84.28838, -106.128662], [-83.665353, -90.088512], [-82.659219, -77.620052], [-81.403383, -68.403613], [-79.991304, -61.595222], [-78.480184, -56.460883], [-76.904141, -52.484432], [-73.632414, -46.746173], [-71.958154, -44.602255], [-68.562163, -41.217179], [-63.393287, -37.546137], [-56.421676, -34.074383], [-47.633408, -30.889781], [-37.019774, -27.898326], [12.932188, -16.714207], [25.397528, -13.521048], [34.252654, -10.837069], [43.039526, -7.575707], [51.714736, -3.327253], [58.517766, 1.324075], [63.482057, 6.082941], [68.241055, 12.697627], [71.223676, 18.755651], [72.628528, 22.494753], [75.183637, 31.894481], [77.231817, 44.580801], [78.499578, 60.891279], [78.720944, 79.370027], [77.838641, 96.835703], [76.06044, 110.973282], [80.06955, 130.596695] ], [ [-68.845314, 180.0], [-71.226045, 166.16618], [-74.295627, 170.104506], [-75.93606, 172.893372], [-78.832436, 180.0], [-68.845314, 180.0] ] ];
            self.drowPolygonList( layerName, type, mode, polygonData );
        });

        // Update canvas position
        $( document ).on( 'updatePositionEvent', function( event, latLon ) {
            self.updatePosition( latLon );
        });

        // Updates Bounding Box coordinates when required
        $( document ).on( 'requestUpdateBoundingBox', function( event ) {
            var coordinates = self.handleCanvas();
            console.log( 'GoTo Bounding Box Coordinates: ' + coordinates );
            document.dispatchEvent( new CustomEvent( 'updateBoundingBox', { 'detail': coordinates } ) );
        });

        $('#pan-tool').on('click', function () {
            self.handlePan(self);
        })

        $('#zoom-box-tool').on('click', function () {
            if (!self.setZoom) {
                $('#select-tool').addClass('is-closed')
                $('#select-tool').removeClass('is-open')
                $(this).addClass('is-open')
                $(this).removeClass('is-closed')
                self.setSelect = false;

                self.www_object.removeEventListener('mousedown', self.handleSelection)
                self.www_object.removeEventListener('mousedown', self.handDrawPolygon)

                self.www_object.addEventListener('mousedown', self.handleZoom);
            } else {
                $(this).addClass('is-closed')
                $(this).removeClass('is-open')

                if (self.setHandDraw) {
                    self.www_object.addEventListener('mousedown', self.handDrawPolygon);
                    $('#hand-draw-tool').addClass('is-open')
                    $('#hand-draw-tool').removeClass('is-closed')
                }

                self.www_object.removeEventListener('mousedown', self.handleZoom);
            }

            self.setZoom = !self.setZoom
        });

        $('#select-tool').on('click', function () {
            if (!self.setSelect) {
                $('#pan-tool').addClass('is-closed');
                $('#pan-tool').removeClass('is-open');
                $('#zoom-box-tool').addClass('is-closed')
                $('#zoom-box-tool').removeClass('is-open')
                $('#hand-draw-tool').addClass('is-closed')
                $('#hand-draw-tool').removeClass('is-open')
                $(this).addClass('is-open')
                $(this).removeClass('is-closed')

                self.www_object.removeEventListener('mousedown', self.handleZoom)
                self.www_object.removeEventListener('mousedown', self.handDrawPolygon)
                self.setZoom = false;
                self.setHandDraw = false

                self.www_object.addEventListener('mousedown', self.handleSelection)
            } else {
                $(this).addClass('is-closed')
                $(this).removeClass('is-open')
                $('#pan-tool').addClass('is-open');
                $('#pan-tool').removeClass('is-closed');
                self.www_object.removeEventListener('mousedown', self.handleSelection)
            }

            self.setSelect = !self.setSelect
        });

        $('#hand-draw-tool').on('click', function () {
            if (!self.setHandDraw) {
                $(this).css('background-color', '#191970')
                self.www_object.removeEventListener('mousedown', self.handleZoom);
                self.www_object.removeEventListener('mousedown', self.handleSelection);

                $(this).addClass('is-open')
                $(this).removeClass('is-closed')
                $('#pan-tool').addClass('is-closed');
                $('#pan-tool').removeClass('is-open');
                $('#zoom-box-tool').addClass('is-closed');
                $('#zoom-box-tool').removeClass('is-open');
                $('#select-tool').addClass('is-closed');
                $('#select-tool').removeClass('is-open');

                self.setZoom = false;
                self.setSelect = false

                self.www_object.addEventListener('mousedown', self.handDrawPolygon)
            } else {
                self.www_object.removeEventListener('mousedown', self.handDrawPolygon)
                self.handCoordList = [];

                $(this).addClass('is-closed')
                $(this).removeClass('is-open')
                $('#pan-tool').addClass('is-open');
                $('#pan-tool').removeClass('is-closed');
            }

            self.setHandDraw = !self.setHandDraw
        })

        self.createShapefileModal()
        $('#shapefile-uploader-tool').on('click', function( ) {
            self.getShapefileName( self )
        })

        // 2016-11-25 (ferraresi): 'manage-layer-tool' onclick function moved to handleLayer.js
        self.createLayerMenu( self );
    },

        ////////////////// IMAGE TEST
//        // Create a surface image using a static image.
//        var surfaceImage1 = new WorldWind.SurfaceImage(new WorldWind.Sector(40, 50, -120, -100), STATIC_URL + 'basemap_sea.png');
//
//        // Add the surface images to a layer and the layer to the World Window's layer list.
//        var surfaceImageLayer = new WorldWind.RenderableLayer();
//        surfaceImageLayer.displayName = "Surface Images";
//        surfaceImageLayer.addRenderable(surfaceImage1);
//        this.www_object.addLayer(surfaceImageLayer);

    cleanRenderableLayer: function ( layerName ) {
        var layer = this.findLayerByName( layerName );
        if ( layer ) {
            if ( layer.renderables ) {
                layer.removeAllRenderables();
                layer.refresh();
            }
        } else {
            for (var i = 0; i < this.www_object.layers.length; i++) {
              if (this.www_object.layers[i].renderables) {
                  this.www_object.layers[i].removeAllRenderables();
                  this.www_object.layers[i].refresh()

                 if (this.www_object.layers[i].displayName != "Draw Layer") {
                     this.www_object.removeLayer( self.www_object.layers[i] )
                 }
              }
            }
        }

        this.www_object.redraw();
    },

    handlePan: function ( self ) {
      self.www_object.removeEventListener('mousedown', self.handleSelection);
      self.www_object.removeEventListener('mousedown', self.handleZoom);
      self.www_object.removeEventListener('mousedown', self.handDrawPolygon)

      self.setSelect = false;
      self.setZoom = false;
      self.setHandDraw = false;

      $('.btn-circle').addClass('is-closed');
      $('.btn-circle').removeClass('is-open');
      $('#pan-tool').addClass('is-open');
      $('#pan-tool').removeClass('is-closed');
    },

    updatePosition: function( latLon ) {
        var self = this;
        // Get latitude, longitude, and altitude
        var positionSplit = latLon.split( ';' );
        // Go to position and trigger 'updateBoundingBox' event on completion
        this.www_object.goTo( new WorldWind.Position( positionSplit[ 0 ], positionSplit[ 1 ], positionSplit[ 2 ] ), function() {
            var coordinates = self.handleCanvas();
            console.log( 'GoTo Bounding Box Coordinates: ' + coordinates );
            document.dispatchEvent( new CustomEvent( 'updateBoundingBox', { 'detail': coordinates } ) );
        } );
    },

    drowPolygonList: function( layerName, type, mode, polygonList ) {
        var boundaries = [];
        var bIndex = 0;
        var order = ( 'latlong' == mode ) ? [ 0, 1 ] : [ 1, 0 ];
        var height = 0;
        for ( var p in polygonList ) {
            coordinates = polygonList[ p ];

            switch( type ) {
                case 'Polygon':
                    for ( var i = 0 ; i < coordinates.length ; i++ ) {
                        if ( ( 2 == coordinates[ i ].length ) || ( 3 == coordinates[ i ].length ) ){
                            boundaries.push( new WorldWind.Location( coordinates[ i ][ order[ 0 ] ], coordinates[ i ][ order[ 1 ] ] ) );
//                            boundaries.push( new WorldWind.Position( coordinates[ i ][ order[ 0 ] ], coordinates[ i ][ order[ 1 ] ], height ) );
                        } else {
                            for ( var j = 0 ; j < coordinates[ i ].length ; j++ ) {
                                boundaries.push( new WorldWind.Location( coordinates[ i ][ j ][ order[ 0 ] ], coordinates[ i ][ j ][ order[ 1 ] ] ) );
//                                boundaries.push( new WorldWind.Position( coordinates[ i ][ j ][ order[ 0 ] ], coordinates[ i ][ j ][ order[ 1 ] ], height ) );
                            }
                        }
                    }
                    break
                case 'MultiPolygon':
                    var incBIndex = false;
                    boundaries[ bIndex ] = [];
                    for ( var i = 0 ; i < coordinates.length ; i++ ) {
                        if ( ( 2 == coordinates[ i ].length ) || ( 3 == coordinates[ i ].length ) ){
                            boundaries[ bIndex ].push( new WorldWind.Location( coordinates[ i ][ order[ 0 ] ], coordinates[ i ][ order[ 1 ] ] ) );
//                            boundaries[ bIndex ].push( new WorldWind.Position( coordinates[ i ][ order[ 0 ] ], coordinates[ i ][ order[ 1 ] ], height ) );
                            incBIndex = true;
                        } else {
                            var incBIndex2 = false;
                            boundaries[ bIndex ] = [];
                            for ( var j = 0 ; j < coordinates[ i ].length ; j++ ) {
                                if ( ( 2 == coordinates[ i ][ j ].length ) || ( 3 == coordinates[ i ][ j ].length ) ) {
                                    boundaries[ bIndex ].push( new WorldWind.Location( coordinates[ i ][ j ][ order[ 0 ] ], coordinates[ i ][ j ][ order[ 1 ] ] ) );
//                                    boundaries[ bIndex ].push( new WorldWind.Position( coordinates[ i ][ j ][ order[ 0 ] ], coordinates[ i ][ j ][ order[ 1 ] ], height ) );
                                    incBIndex2 = true;
                                } else {
                                    boundaries[ bIndex ] = [];
                                    for ( var k = 0 ; k < coordinates[ i ][ j ].length ; k++ ) {
                                        boundaries[ bIndex ].push( new WorldWind.Location( coordinates[ i ][ j ][ k ][ order[ 0 ] ], coordinates[ i ][ j ][ k ][ order[ 1 ] ] ) );
//                                        boundaries[ bIndex ].push( new WorldWind.Position( coordinates[ i ][ j ][ k ][ order[ 0 ] ], coordinates[ i ][ j ][ k ][ order[ 1 ] ], height ) );
                                    }
                                    bIndex++;
                                }
                            }
                            if ( incBIndex2 ) {
                                bIndex++;
                            }
                        }
                    }
                    if ( incBIndex ) {
                        bIndex++;
                    }
                    break;
            }
        }

        polygonAttributes = new WorldWind.ShapeAttributes( null );
        polygonAttributes.drawInterior = true;
        polygonAttributes.applyLighting = true;
        polygonAttributes.outlineColor = new WorldWind.Color( 1, 0, 0, 1 );
        polygonAttributes.outlineWidth = 0.5;
        polygonAttributes.interiorColor = new WorldWind.Color( 0, 0, 0, 0.1 );
        highlightAttributes = new WorldWind.ShapeAttributes( polygonAttributes );
        highlightAttributes.outlineColor = new WorldWind.Color( 1, 1, 0, 1 );
        highlightAttributes.outlineWidth = 0.5;
        highlightAttributes.interiorColor = new WorldWind.Color( 0, 0, 0, 0.1 );

//        polygon = new WorldWind.Polygon( boundaries, polygonAttributes );
//        if (boundaries[ 0 ] instanceof Array ) {
//        var tmp = [];
////        boundaries[1][0].longitude = 179;
//        tmp.push(boundaries[1][0]);
//        tmp.push(boundaries[1][1]);
//        tmp.push(boundaries[1][2]);
//        tmp.push(boundaries[1][3]);
//        tmp.push(boundaries[1][4]);
        polygon = new WorldWind.SurfacePolygon( boundaries, polygonAttributes );
//        console.log(boundaries[1])
//        console.log( polygon );
//        }
////        if (boundaries[ 0 ] instanceof Array ) {
////            console.log(boundaries[ 0 ]);
////            console.log(boundaries[ 1 ]);
////            var tmp = (boundaries[ 0 ]).concat(boundaries[ 1 ]);
////            console.log(tmp)
////            polygon = new WorldWind.SurfacePolygon( tmp, polygonAttributes );
////            
////            var array = polygon.repeatAroundDateline(tmp);
////            console.log( array );
////        }
//        polygon = new WorldWind.Polygon( boundaries, polygonAttributes );
        polygon.pathType = WorldWind.LINEAR;
        polygon.highlightAttributes = highlightAttributes;

        var layer = this.findLayerByName( layerName );
        layer.addRenderable( polygon );
        layer.refresh();
//        this.polygonsLayer.addRenderable( polygon );
//        this.polygonsLayer.refresh();
        this.www_object.redraw();
    },

    addRenderableLayer: function ( layer_label ) {
        if ( ! this.exist( layer_label ) ){
            try {
                var tmp_layer = new WorldWind.RenderableLayer( layer_label );
                tmp_layer.enabled = true;
                this.www_object.addLayer( tmp_layer );
                this.www_object.redraw();
            } catch(err) {
                console.log( err );
            }
        }
    },

    add: function( wms_url, layer_id, layer_label ){
        if ( !this.exist( layer_id ) ){
            try {
                var urlBuilder     = new WorldWind.WmsUrlBuilder(
                    wms_url,
                    "subset",
                    "",
                    "1.3.0"
                );
                var wms_layer         = new WorldWind.TiledImageLayer( this.sector, this.levelZeroDelta, this.numLevels, this.imageFormat, layer_id, this.tileWidth, this.tileHeight );
                wms_layer.enabled     = true;
                wms_layer.displayName = layer_label;
                wms_layer.currentTilesInvalid = true;
                wms_layer.urlBuilder  = urlBuilder;
                this.www_object.addLayer( wms_layer );
                this.www_object.redraw();

            } catch(err) {
                console.log( err );
            }
        }
    },

    remove: function( layer_id ){
        for (var i = 0, len = this.www_object.layers.length; i < len; i++) {
            var layer = this.www_object.layers[i];
            if ( layer.cachePath == layer_id ){
                this.www_object.removeLayer( layer )
                $( '#' + layer.cachePath + '_button' ).remove();
                this.www_object.redraw();
                break
            }
        }
    },

    exist: function( layer_id ){
        for (var i = 0, len = this.www_object.layers.length; i < len; i++) {
            var layer = this.www_object.layers[i];
            if ( ( layer.cachePath == layer_id ) || ( layer.displayName == layer_id ) ){
                return true;
            }
        }
        return false;
    },

    findLayerByName: function(layerName) {
      var find = false;

      for (var i = 0; i < www.www_object.layers.length; i++) {
        if (www.www_object.layers[i].displayName == layerName) {
          find = true;
          return www.www_object.layers[i]
        }
      }

      if (!find) {
        return null;
      }
    },

    polygonCrossDateLine: function(lat1, lat2, lon1, lon2) {
      var locationList = []

      locationList.push(new WorldWind.Location(lat1, lon1))
      locationList.push(new WorldWind.Location(lat1, lon2))
      locationList.push(new WorldWind.Location(lat2, lon2))
      locationList.push(new WorldWind.Location(lat2, lon1))

      return WorldWind.Location.locationsCrossDateLine(locationList);
    },

    getBboxFromPolygon: function ( polygon ) {
        var boundaries = null

        if (polygon.referencePosition) {
            boundaries = polygon.boundaries
        } else {
            boundaries = polygon._boundaries
        }
        var latMin = boundaries[0].latitude,
            latMax = boundaries[0].latitude,
            lonMin = boundaries[0].longitude,
            lonMax = boundaries[0].longitude

        for ( var i = 1; i < boundaries.length; i++ ) {
            if (boundaries[i].latitude < latMin) {
                latMin = boundaries[i].latitude
            }
            if (boundaries[i].latitude > latMax) {
                latMax = boundaries[i].latitude
            }
            if (boundaries[i].longitude < lonMin) {
                lonMin = boundaries[i].longitude;
            }
            if (boundaries[i].longitude > lonMax) {
                lonMax = boundaries[i].longitude;
            }
        }
        return [latMin, lonMin, latMax, lonMax];
    }
})

www = new www(); // singleton instance

// })(mea);
