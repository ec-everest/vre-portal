$.extend( www, {

  handleSelection: function (o) {
    var self = www

    self.handleRectangle(o, self, "select");

  },

  handleRectangle: function (o, self, type) {
    o.preventDefault();

    var polygon = null;

    var attributes = new WorldWind.ShapeAttributes(null);
    if ( type == 'zoom') {
      attributes.outlineColor = WorldWind.Color.CYAN;
      attributes.drawInterior = false;
      attributes.depthTest = false;

      var zoomLayer = new WorldWind.RenderableLayer('Zoom Layer');
      self.www_object.addLayer(zoomLayer);

    } else {
      attributes.outlineColor = new WorldWind.Color.colorFromBytes(229, 200, 72, 230);
      attributes.drawInterior = false;

      var finalAttributes = new WorldWind.ShapeAttributes(null);
      finalAttributes.drawInterior = false;
      finalAttributes.outlineColor = WorldWind.Color.RED

      var layer = self.findLayerByName('Draw Layer');
    }


    var initX = null, initY = null;
    var initLat = null, initLon = null;

    var bbox = [];
    var setDraw = false;

    initX = o.clientX;
    initY = o.clientY;

    var initCanvas = self.www_object.canvasCoordinates(initX, initY);
    var initCoords = self.www_object.pick(initCanvas);
    initLat = initCoords.objects[0].position.latitude;
    initLon = initCoords.objects[0].position.longitude;

    setDraw = true

    var drawRectangle = function (o) {
      o.preventDefault();

      if (setDraw) {

        var currX = o.clientX;
        var currY = o.clientY;

        var currCoords = self.www_object.pick(self.www_object.canvasCoordinates(currX, currY));
        var currLat = currCoords.objects[0].position.latitude;
        var currLon = currCoords.objects[0].position.longitude;

        var pixelDimLat = Math.abs(Math.max(initLat, currLat) - Math.min(initLat, currLat)) / self.pixelRes;
        var lengthLon = Math.abs(Math.max(initLon, currLon) - Math.min(initLon, currLon))

        var boundaries = [];

        if (self.polygonCrossDateLine(initLat, currLat, initLon, currLon)) {
          var tmp = Math.min(initLon, currLon) + 180;

          var newMaxLon = Math.abs(Math.min(initLon, currLon) - tmp)
          var newMinLon = Math.max(initLon, currLon) - tmp

          lengthLon = 0
          lengthLon = Math.abs(newMaxLon - newMinLon);
          var pixelDimLon = lengthLon / self.pixelRes;

          if ((pixelDimLat > self.limitLatRectangle) && (pixelDimLon < self.limitLonRectangle)) {
            if ( initLat > currLat) {
              currLat = initLat - self.limitLatRectangle * self.pixelRes
            } else if (initLat < currLat) {
              currLat = initLat + self.limitLatRectangle * self.pixelRes
            }
          } else if ((pixelDimLat < self.limitLatRectangle) && (pixelDimLon > self.limitLonRectangle)) {
            if (initLon > currLon) {
              var dateLineDistance = 180 - initLon
              dateLineDistance = (self.limitLonRectangle * self.pixelRes) - dateLineDistance
              currLon = -180 + dateLineDistance
            } else if (initLon < currLon) {
              var dateLineDistance = Math.abs(-180 - initLon)
              dateLineDistance = (self.limitLonRectangle * self.pixelRes) - dateLineDistance
              currLon = 180 - dateLineDistance
            }
          } else if ((pixelDimLat > self.limitLatRectangle) && (pixelDimLon > self.limitLonRectangle)) {
            if (initLat > currLat && initLon > currLon) {
              currLat = initLat - self.limitLatRectangle * self.pixelRes

              var dateLineDistance = 180 - initLon
              dateLineDistance = (self.limitLonRectangle * self.pixelRes) - dateLineDistance
              currLon = -180 + dateLineDistance
            } else if ( initLat < currLat && initLon < currLon ) {
              currLat = initLat + self.limitLatRectangle * self.pixelRes

              var dateLineDistance = Math.abs(-180 - initLon)
              dateLineDistance = (self.limitLonRectangle * self.pixelRes) - dateLineDistance
              currLon = 180 - dateLineDistance
            } else if (initLat > currLat && initLon < currLon) {
              currLat = initLat - self.limitLatRectangle * self.pixelRes

              var dateLineDistance = Math.abs(-180 - initLon)
              dateLineDistance = (self.limitLonRectangle * self.pixelRes) - dateLineDistance
              currLon = 180 - dateLineDistance
            } else if (initLat < currLat && initLon > currLon) {
              currLat = initLat + self.limitLatRectangle * self.pixelRes

              var dateLineDistance = 180 - initLon
              dateLineDistance = (self.limitLonRectangle * self.pixelRes) - dateLineDistance
              currLon = -180 + dateLineDistance
            }
          }
          boundaries.push(new WorldWind.Location(initLat, initLon))
          boundaries.push(new WorldWind.Location(initLat, currLon))
          boundaries.push(new WorldWind.Location(currLat, currLon))
          boundaries.push(new WorldWind.Location(currLat, initLon))

        } else {
          var pixelDimLon = Math.abs(Math.max(initLon, currLon) - Math.min(initLon, currLon)) / self.pixelRes

          if ((pixelDimLat > self.limitLatRectangle) && (pixelDimLon < self.limitLonRectangle)) {
            if ( initLat > currLat) {
              currLat = initLat - self.limitLatRectangle * self.pixelRes
            } else if (initLat < currLat) {
              currLat = initLat + self.limitLatRectangle * self.pixelRes
            }
          } else if ((pixelDimLat < self.limitLatRectangle) && (pixelDimLon > self.limitLonRectangle)) {
            if (initLon > currLon) {
              currLon = initLon - self.limitLonRectangle * self.pixelRes
            } else if (initLon < currLon) {
              currLon = initLon + self.limitLonRectangle * self.pixelRes
            }
          } else if ((pixelDimLat > self.limitLatRectangle) && (pixelDimLon > self.limitLonRectangle)) {
            if (initLat > currLat && initLon > currLon) {
              currLat = initLat - self.limitLatRectangle * self.pixelRes
              currLon = initLon - self.limitLonRectangle * self.pixelRes
            } else if ( initLat < currLat && initLon < currLon ) {
              currLat = initLat + self.limitLatRectangle * self.pixelRes
              currLon = initLon + self.limitLonRectangle * self.pixelRes
            } else if (initLat > currLat && initLon < currLon) {
              currLat = initLat - self.limitLatRectangle * self.pixelRes
              currLon = initLon + self.limitLonRectangle * self.pixelRes
            } else if (initLat < currLat && initLon > currLon) {
              currLat = initLat + self.limitLatRectangle * self.pixelRes
              currLon = initLon - self.limitLonRectangle * self.pixelRes
            }
          }

          boundaries.push(new WorldWind.Location(initLat, initLon))
          boundaries.push(new WorldWind.Location(initLat, (initLon + currLon) / 2))
          boundaries.push(new WorldWind.Location(initLat, currLon))
          boundaries.push(new WorldWind.Location(currLat, currLon))
          boundaries.push(new WorldWind.Location(currLat, (initLon + currLon) / 2))
          boundaries.push(new WorldWind.Location(currLat, initLon))
        }

        polygon = new WorldWind.SurfacePolygon(boundaries, attributes);
        polygon.pathType = WorldWind.LINEAR

        if (type == 'select') {
          layer.removeAllRenderables();
          layer.refresh();

          layer.addRenderable(polygon);
          layer.refresh();
        } else if (type == 'zoom') {
          zoomLayer.removeAllRenderables();
          zoomLayer.refresh();

          zoomLayer.addRenderable(polygon);
          zoomLayer.refresh();
        }

        self.www_object.redraw();
      }
    }

    var endRectangle = function(o) {
      o.preventDefault();
      setDraw = false;
      if (polygon != null){

        bbox.push(polygon.sector.minLatitude);
        bbox.push(polygon.sector.minLongitude);
        bbox.push(polygon.sector.maxLatitude);
        bbox.push(polygon.sector.maxLongitude);

        if (type == 'zoom') {
          zoomLayer.removeAllRenderables();
          zoomLayer.refresh();
          self.www_object.removeLayer(zoomLayer);
          self.www_object.redraw();

          self.handleZoomBox(self, bbox);
        } else if (type == 'select') {
          //var boundaries = polygon._boundaries

          layer.removeAllRenderables();
          layer.refresh();

          polygon = new WorldWind.SurfacePolygon(polygon._boundaries, finalAttributes);
          polygon.pathType = WorldWind.LINEAR

          layer.addRenderable(polygon);
          layer.refresh()
          self.www_object.redraw()

          self.handleSelectionBox(self, bbox)
        }
      }

      $('#canvasOne').off('mousemove', drawRectangle);
      $('#canvasOne').off('mouseup', endRectangle);
    }

    $('#canvasOne').on('mousemove', drawRectangle);
    $('#canvasOne').on('mouseup', endRectangle);
  },

  handleSelectionBox: function (self, bbox) {
    console.log(bbox);

    self.handlePan(self);
  }
})
