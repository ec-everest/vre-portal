$.extend( www, {

    createLayerMenu: function ( self ) {
        var toogleIdFull = $( '#manage-layer-tool' );
        var dock = '#v-main-dock';
        var position = 'right';
        var layerManager = $('<div>', { 'id': 'layer-manager', 'class': 'col-md-11 eecontainer-right', 'style': 'display: block;'})

        $( '#manage-layer-tool' ).on( 'click', function() {
            if ( $( this ).hasClass( 'is-open' ) ) {
                // Flip animation for the dock toggle
                toogleIdFull.addClass( 'animated flip' );
                toogleIdFull.one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                    toogleIdFull.removeClass( 'animated flip' );
                });

                toogleIdFull.addClass( "is-closed" );
                toogleIdFull.removeClass( "is-open" );

                $( '#layer-manager' ).toggle( 'slide', { direction: position }, 350 );
            } else {
                // Flip animation for the dock toggle
                toogleIdFull.addClass('animated flip');
                toogleIdFull.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                    toogleIdFull.removeClass('animated flip');
                });

                toogleIdFull.addClass( "is-open" );
                toogleIdFull.removeClass( "is-closed" );

                self.updateLayerMenu( self )

                $( '#layer-manager' ).toggle( 'slide', { direction: position }, 350 );
            }
        } );

        $('#manage-layer-tool').after(layerManager)

        var closer = $('<div>', {'class': 'row'}).append(
            $('<div>', {'class': 'col-sm-12'}).append(
                $('<i>', {'class': 'fa fa-times fg-ee-primary float-right cursor-pointer closer'})
            )
        )
        closer.on( 'click', function() {
            toogleIdFull.addClass( 'animated flip' );
            toogleIdFull.one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                toogleIdFull.removeClass( 'animated flip' );
            } );

            toogleIdFull.addClass( 'is-closed' );
            toogleIdFull.removeClass( 'is-open' );

            $( '#layer-manager' ).toggle( 'slide', { direction: position }, 350 );
        } );
        layerManager.append(closer)

        var title = $('<div>', {'class': 'row'}).append(
            $('<div>', {'class': 'col-sm-12'}).append(
                $('<div>', {'class': 'form-group'}).append(
                    $('<div>', {'class': 'col-sm-12'}).append(
                        $('<h3> Layers </h3>')
                    )
                )
            )
        )
        layerManager.append(title)

        var sortable = $('<div>', {'class': 'row'}).append(
            $('<div>', {'class': 'col-sm-12'}).append(
                $('<table>', { 'id': 'sortable-table'}).css( 'padding', '1em' ).append(
                    $('<tbody></tbody>')
                )
            )
        )
        layerManager.append(sortable)

        $('#layer-manager').hide()
    },

    updateLayerMenu: function( self ) {

        $('#sortable-table tbody').remove()

        var table = $('#sortable-table')
        table.append('<tbody></tbody>');

        for (var i = 1; i < self.www_object.layers.length; i++) {
            var row = $('<tr id="'+ i +'"></tr>')
            row.append('<td>' + self.www_object.layers[i].displayName +'</td>')
            row.append('<td><button id="hideButton" class="transparentbutton fa fa-eye fg-ee-primary" data-container="body" data-toggle="tooltip" data-placement="bottom" title="Hide Layer"></button></td>')
            row.append('<td><button class="transparentbutton fa fa-minus-square fg-ee-primary" data-container="body" data-toggle="tooltip" data-placement="bottom" title="Remove Layer"></button></td>')

            $('#sortable-table tbody').prepend(row)
        }

        $( "#sortable-table tbody" ).sortable({
            cursor: 'move',
            stop: function () {
                var layerList = $(this).sortable('toArray')
                self.reorderLayers( self, layerList.reverse() )
            }
        })

        $(".fa-eye, .fa-eye-slash").on('click', function() {
            var parent = $(this).closest("tr")
            var parentId = $(parent).attr('id')

            if ($(this).hasClass("fa-eye-slash")) {
                self.showAllRenderables( self, parentId )
            } else {
                self.hideAllRenderables( self, parentId )
            }

            $(this).toggleClass("fa-eye-slash")
        })

        $('#sortable-table .fa-minus-square').on('click', function () {
            var parent = $(this).closest("tr")
            var parentId = $(parent).attr('id')

            if (self.www_object.layers[parentId].displayName == 'Draw Layer') {
                self.www_object.layers[parentId].removeAllRenderables()
            } else {
                self.www_object.layers[parentId].removeAllRenderables()
                self.www_object.removeLayer( self.www_object.layers[parentId] )

            }
            self.www_object.redraw()

            self.updateLayerMenu( self )
        })

    },

    reorderLayers: function ( self, list ) {
        var tmpList = []
        for (var i = 1; i < self.www_object.layers.length; i++) {
            tmpList.push( self.www_object.layers[list[i - 1]] )
        }
        tmpList.unshift( self.www_object.layers[0] );

        self.www_object.layers = tmpList
        self.www_object.redraw()

        self.updateLayerMenu( self )
    },

    showAllRenderables: function ( self, id ) {
        var layer = self.www_object.layers[id]
        for (var i = 0; i < layer.renderables.length; i++) {
            layer.renderables[i].enabled = true;
        }

        layer.refresh()
        self.www_object.redraw()
    },

    hideAllRenderables: function ( self, id ) {
        var layer = self.www_object.layers[id]
        for (var i = 0; i < layer.renderables.length; i++) {
            layer.renderables[i].enabled = false;
        }

        layer.refresh()
        self.www_object.redraw()
    }
})
