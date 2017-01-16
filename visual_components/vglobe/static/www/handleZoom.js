$.extend( www, {

  handleZoom: function(o) {
    var self = www
    self.handleRectangle(o, self, "zoom");
  },

  handleZoomBox: function (self, bbox, polygon) {

    var centreLat = (bbox[0] + bbox[2]) / 2;
    var centreLon = (bbox[1] + bbox[3]) / 2;

    var range = self.www_object.navigator.range;

    if (range > 9999999) {
      newRange = 3e6;
    } else if (range <= 9999999 && range > 999999) {
      newRange = 2e6;
    } else if (range <= 999999 && range >= 308000) {
      newRange = 2e5;
    }


    self.www_object.navigator.lookAtLocation.latitude = centreLat
    self.www_object.navigator.lookAtLocation.longitude = centreLon

    if (range - newRange < 308000) {
      self.www_object.navigator.range = 308000
    } else {
      self.www_object.navigator.range -= newRange;
    }

  }
  //self.www_object.redraw();
})
