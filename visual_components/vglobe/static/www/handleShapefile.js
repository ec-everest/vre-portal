$.extend( www, {

    getShapefileName: function ( self ) {
        var filesDirectory = STATIC_URL + 'upload/';

        $.ajax({
            method: 'POST',
            url: '/vglobe/getShapefileList.py',
            data: {
                path: filesDirectory,
                csrfmiddlewaretoken: UTIL.getCookie( 'csrftoken' )
            },
            success: function (data) {
                self.updateShapefileModal( self, data )
            }
        });
    },

    createShapefileModal: function ( ) {
        var modal = $('<div class="modal fade centredmodal" id="shapefileModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"></div>')
        var dialog = $('<div class="modal-dialog" role="document"></div>')
        var content = $('<div class="modal-content"></div>')

        var header = $('<div class="modal-header"></div>')
        header.append('<button type="button" class="close fg-ee-primary" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
        header.append('<h4 class="modal-title"> Select the shapefiles to draw </h4>')

        //var form = $('<form id="modal-form"></div>')
        var body = $('<div id="shapemodal-body" class="modal-body"></div>')

        //form.append(body)

        var footer = $('<div id="shapemodal-footer" class="modal-footer">')
        footer.append('<button type="button" class="btn btn-primary fg-white bg-ee-primary bd-ee-primary float-left" data-dismiss="modal"> Close </button>')
        //form.append(footer)

        content.append(header)
        content.append(body)
        content.append(footer)
        //content.append(form)
        dialog.append(content)
        modal.append(dialog)

        $('body').append(modal)
    },

    updateShapefileModal: function( self, shapeList) {

        $('#shapemodal-body').html('')

        if (shapeList.length > 0) {
            $('#shapeSendButton').remove()
            $('#shapemodal-footer').append('<button id="shapeSendButton" class="btn btn-default float-right bg-ee-primary fg-white "> Send </button>')

            var table = $('<table id="shapefileTable"></table>')
            for (var i = 0; i < shapeList.length; i++){
                var row = $("<tr></tr>")

                row.append('<th>' + shapeList[i].substring(0, shapeList[i].length - 4) + '</th>')
                row.append('<input type="checkbox" name="shapefile" class="shape-check" value="'+ shapeList[i] + '">')
                table.append(row)
            }

            var checkallBox = $('<input type="checkbox" id="checkAll"> Select All</input>')
            $('#shapemodal-body').append(
                $( '<p>' ).text( 'Shapefile list:' ),
                table,
                $( '<hr>' ),
                $( '<p>' ).text( 'Options:' ),
                checkallBox,
                $( '<br>' ),
                '<input type="checkbox" id="colorShape" name="colorShape" value="colorShape"> Set different colors for each shapefile section</input>'
            )

            $("#checkAll").change(function () {
                $("input:checkbox").not('#colorShape').prop('checked', $(this).prop("checked"));
            });

            $('#shapeSendButton').on('click', function () {
                self.handleChecked(self, $('.shape-check') , $('#colorShape') )
                
                $( '#shapefileModal' ).modal( 'toggle' );
            })


        } else {
            $('#shapemodal-body').append('<p> No shapefiles available </p>')
        }

    },

    handleChecked: function(self, shapes, color ) {
        var colorFlag = false
        if (color[0].checked) {
            colorFlag = true;
        }

        for (var i = 0; i < shapes.length; i++) {
            if (shapes[i].checked) {
                self.drawShapefile(self, shapes[i].value, colorFlag)
            }
        }

        self.updateLayerMenu( self )
    },

    drawShapefile: function (self, shapeName, colorFlag ) {

        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.imageScale = 0.15;
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.imageSource = '/static/images/white-dot.png'


        var shapeConfigurationCallback = function (attributes, record) {
            var configuration = {};

            if (record.isPointType() || record.isMultiPointType()) {

                configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

            } else if (record.isPolygonType()) {
                configuration.attributes = new WorldWind.ShapeAttributes(null);

                if (colorFlag) {
                    configuration.attributes.interiorColor = new WorldWind.Color(
                        0.375 + 0.5 * Math.random(),
                        0.375 + 0.5 * Math.random(),
                        0.375 + 0.5 * Math.random(),
                        0.5);
                    } else {
                        configuration.attributes.interiorColor = new WorldWind.Color(1, 1, 1, 0.1)

                    }

                    configuration.attributes.outlineColor = WorldWind.Color.RED

                    //configuration._highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 0.1)
                    //configuration._highlightAttributes.outlineColor = WorldWind.Color.WHITE
            } else if ( record.isPolylineType() ) {

                if (colorFlag) {
                    configuration.attributes.outlineColor = new WorldWind.Color(
                        0.375 + 0.5 * Math.random(),
                        0.375 + 0.5 * Math.random(),
                        0.375 + 0.5 * Math.random(),
                        0.5);
                    } else {
                        configuration.attributes.outlineColor = new WorldWind.Color(1, 1, 1, 0.1)
                    }

                    //configuration.highlightAttributes.outlineColor = WorldWind.Color.WHITE
            } else {
                eeNotify.error('Geometry not supported')
            }

            configuration.userProperties = record._attributes.values

            return configuration;
        };

               var path = STATIC_URL + 'upload/' + shapeName;
               var shapeFileLayer = new WorldWind.RenderableLayer(shapeName.substring(0, shapeName.length - 4) + " Shapelayer");
               var worldShapefile = new WorldWind.Shapefile(path);
               worldShapefile.load(null, shapeConfigurationCallback, shapeFileLayer);
               self.www_object.addLayer(shapeFileLayer);
    }
})
