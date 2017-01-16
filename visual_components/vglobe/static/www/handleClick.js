$.extend( www, {

    handlePlacemark: function (latitude, longitude, imgPath, scale) {

      var placemarkAttributes = new WorldWind.PlacemarkAttributes(null)
      placemarkAttributes.imageScale = scale;
      placemarkAttributes.imageOffset = new WorldWind.Offset(
          WorldWind.OFFSET_FRACTION, 0.3,
          WorldWind.OFFSET_FRACTION, 0.0);
      placemarkAttributes.imageColor = WorldWind.Color.WHITE;
      placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
          WorldWind.OFFSET_FRACTION, 0.5,
          WorldWind.OFFSET_FRACTION, 1.0);
      placemarkAttributes.drawLeaderLine = true;
      placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;

      var placemarkPosition = new WorldWind.Position(latitude, longitude, 0)

      var placemark = new WorldWind.Placemark(placemarkPosition, true, null);
      placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
      placemark.alwaysOnTop = true;

      placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
      placemarkAttributes.imageSource = imgPath;
      placemark.attributes = placemarkAttributes;

      return placemark
    },

    handDrawPolygon: function( o ) {
        var polygonLayer = www.findLayerByName('Polygon Layer');
        var drawLayer = www.findLayerByName('Draw Layer');

        var attributes = new WorldWind.ShapeAttributes(null);
        attributes.outlineColor = WorldWind.Color.YELLOW
        attributes.interiorColor = new WorldWind.Color(1, 1, 1, 0);

        var finalAttributes = new WorldWind.ShapeAttributes(null);
        finalAttributes.outlineColor = WorldWind.Color.RED;
        finalAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 0);

        var imagePath = '/static/images/white-dot.png'

        if (o.which == 1) {
            var n = 0;
            var coordinates = www.www_object.pick( www.www_object.canvasCoordinates(o.clientX, o.clientY) )

            if ( coordinates.objects.length > n ) {
                www.handCoordList.push(new WorldWind.Location(coordinates.objects[0].position.latitude, coordinates.objects[0].position.longitude));

                var polygon = new WorldWind.SurfacePolygon(www.handCoordList, attributes);
                polygon.pathType = WorldWind.LINEAR;
                polygon.displayName = 'Drawed Polygon'

                drawLayer.removeAllRenderables();
                drawLayer.addRenderable(polygon);

                for (var i = 0; i < www.handCoordList.length; i++) {
                    var placemark = www.handlePlacemark(www.handCoordList[i].latitude, www.handCoordList[i].longitude, imagePath, 0.15)
                    drawLayer.addRenderable(placemark)
                }

                drawLayer.refresh();

                www.www_object.redraw();
            }
        } else if ( o.which == 2) {
            if (www.handCoordList.length > 1) {
                www.handCoordList.pop()

                var polygon = new WorldWind.SurfacePolygon(www.handCoordList, attributes);
                polygon.pathType = WorldWind.LINEAR;
                polygon.displayName = 'Drawed Polygon'

                drawLayer.removeAllRenderables();
                drawLayer.addRenderable(polygon);

                for (var i = 0; i < www.handCoordList.length; i++) {
                    var placemark = www.handlePlacemark(www.handCoordList[i].latitude, www.handCoordList[i].longitude, imagePath, 0.15)
                    drawLayer.addRenderable(placemark)
                }

                drawLayer.refresh();

                www.www_object.redraw();
            } else {
                drawLayer.removeAllRenderables();
                drawLayer.refresh();
                www.www_object.redraw();

                www.handlePan( www )
                www.handCoordList = [];
            }
        } else if ( o.which == 3) {
            o.preventDefault();

            if (www.handCoordList.length > 0) {
                var polygon = new WorldWind.SurfacePolygon(www.handCoordList, finalAttributes);
                polygon.pathType = WorldWind.LINEAR;

                drawLayer.removeAllRenderables();
                drawLayer.addRenderable(polygon);
                drawLayer.refresh();

                www.www_object.redraw();

                var bbox = www.getBboxFromPolygon( polygon );
                console.log(bbox);
            }

            www.handlePan( www )
            www.handCoordList = [];
        }
    }
})
