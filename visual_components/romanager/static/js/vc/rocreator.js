/** @preserve
 * Author:        Sergio Ferraresi <ferraresi@meeo.it> 
 * Description:   Allows RO creation
 * Namespace:     ever-est
 * Widget Name:   rocreator
 * Changelog:     2016-10-24 First Version
 *                2016-11-25 Added 'fillRoContentEvent' event
 */

( function ( $ ) {

    var array = null;
    var size = -1;
    var curr = null;
    var currIndx = -1;

    $.fn.rocreator = function() {
        this.append(
            _createButton()
        );

        // Create RO Modal
        _createModal();

        array = $( '#r-create-ro-modal div.step' ).toArray();
        size = array.length;
        currIndx = -1;
        for ( var a in array ) {
            var elto = $( array[ a ] );
            if ( ! elto.hasClass( 'active' ) ) {
                elto.hide();
            } else {
                $( '#r-create-ro-modal-step' ).text( 'Step ' + elto.attr( 'data-step-number') + ': ' + elto.attr( 'data-step-title' ) );
                elto.show();
                currIndx = parseInt( a );
                curr = $( array[ currIndx ] )
            }
        }

        // Handlers
        _addHandlers();

        return this;
    };

    function _createButton() {
        return $( '<button>', { 'id': 'r-create-ro', 'class': 'btn btn-default bg-ee-primary fg-white', 'type': 'button', 'data-container': 'body', 'data-toggle': 'modal', 'data-target': '#r-create-ro-modal' } ).append(
            $( '<img>', { 'src': STATIC_URL + 'img/ROhub_logo_1_16x16.png', 'alt': 'ROhub Logo' } )
        );
    }

    function _createModal() {
        $( 'body' ).append(
            $( '<div>', { 'id': 'r-create-ro-modal', 'class': 'modal fade', 'tabindex': '-1', 'role': 'dialog' } ).append(
                $( '<div>', { 'class': 'modal-dialog', 'role': 'document' } ).append(
                    $( '<div>', { 'class': 'modal-content' } ).append(
                        $( '<div>', { 'class': 'modal-header' } ).append(
                            $( '<button>', { 'class': 'close fg-ee-primary', 'type': 'button', 'data-dismiss': 'modal', 'aria-label': 'Close' } ).append(
                                $( '<span>', { 'class': 'fa fa-times', 'aria-hidden': 'true' } )
                            ),
                            $( '<h4>', { 'class': 'modal-title' } ).text( 'Research Object Creation' )
                        ),
                        $( '<div>', { 'class': 'modal-body' } ).append(
                            UTIL.createRow(
                                $( '<h3>', { 'id': 'r-create-ro-modal-step' } )
                            ),
                            $( '<div>', { 'class': 'row step active', 'data-step-number': '1', 'data-step-title': 'RO Data' } ).append(
                                $( '<div>', { 'class': 'form-group col-xs-12 col-sm-12 col-md-12 col-lg-12' } ).append(
                                    $( '<div>', { 'class': 'col-xs-12 col-sm-12 col-md-3 col-lg-3' } ).append(
                                        $( '<label>', { 'for': 'r-modal-id' } ).text( 'Identifier' )
                                    ),
                                    $( '<div>', { 'class': 'col-xs-12 col-sm-12 col-md-9 col-lg-9' } ).append(
                                        $( '<input>', { id: 'r-modal-id', 'class': 'form-control', 'type': 'text', 'required': 'required' } )
                                    )
                                ),
                                $( '<div>', { 'class': 'form-group col-xs-12 col-sm-12 col-md-12 col-lg-12' } ).append(
                                    $( '<div>', { 'class': 'col-xs-12 col-sm-12 col-md-3 col-lg-3' } ).append(
                                        $( '<label>', { 'for': 'r-modal-title' } ).text( 'Title' )
                                    ),
                                    $( '<div>', { 'class': 'col-xs-12 col-sm-12 col-md-9 col-lg-9' } ).append(
                                        $( '<input>', { id: 'r-modal-title', 'class': 'form-control', 'type': 'text', 'required': 'required' } )
                                    )
                                ),
                                $( '<div>', { 'class': 'form-group col-xs-12 col-sm-12 col-md-12 col-lg-12' } ).append(
                                    $( '<div>', { 'class': 'col-xs-12 col-sm-12 col-md-3 col-lg-3' } ).append(
                                        $( '<label>', { 'for': 'r-modal-templ' } ).text( 'Template' )
                                    ),
                                    $( '<div>', { 'class': 'col-xs-12 col-sm-12 col-md-9 col-lg-9' } ).append(
                                        $( '<select>', { 'id': 'r-modal-templ', 'name': 'r-modal-templ', 'class': 'form-control multiselect', 'required': 'required' } ).append(
                                            $( '<option>', { 'value': 'T1' } ).text( 'Template 1' ),
                                            $( '<option>', { 'value': 'T2' } ).text( 'Template 2' ),
                                            $( '<option>', { 'value': 'T3' } ).text( 'Template 3' )
                                        )
                                    )
                                ),
                                $( '<div>', { 'class': 'form-group col-xs-12 col-sm-12 col-md-12 col-lg-12' } ).append(
                                    $( '<div>', { 'class': 'col-xs-12 col-sm-12 col-md-3 col-lg-3' } ).append(
                                        $( '<label>', { 'for': 'r-modal-desc' } ).text( 'Description' )
                                    ),
                                    $( '<div>', { 'class': 'col-xs-12 col-sm-12 col-md-9 col-lg-9' } ).append(
                                        $( '<textarea>', { 'id': 'r-modal-desc', 'class': 'form-control', 'rows': '5' } )
                                    )
                                )
                            ),
                            $( '<div>', { 'class': 'row step', 'data-step-number': '2', 'data-step-title': 'RO Initial Content' } ).append(
                                $( '<div>', { 'class': 'form-group col-xs-12 col-sm-12 col-md-12 col-lg-12' } ).append(
                                    $( '<div>', { 'class': 'col-xs-12 col-sm-12 col-md-6 col-lg-6' } ).append(
                                        $( '<button>', { 'id': 'r-modal-up-indt', 'class': 'btn btn-primary fg-white bg-ee-primary bd-ee-primary r-create-ro-modal-up', 'type': 'button', 'data-container': 'body', 'data-toggle': 'modal', 'data-target': '#r-upload-modal' } ).text( 'Upload Input Data' )
                                    ),
                                    $( '<div>', { 'class': 'col-xs-12 col-sm-12 col-md-6 col-lg-6' } ).append(
                                        $( '<button>', { 'id': 'r-modal-up-wf', 'class': 'btn btn-primary fg-white bg-ee-primary bd-ee-primary r-create-ro-modal-up', 'type': 'button' } ).text( 'Upload Workflow' )
                                    )
                                ),
                                $( '<div>', { 'class': 'form-group col-xs-12 col-sm-12 col-md-12 col-lg-12' } ).append(
                                    $( '<div>', { 'class': 'col-xs-12 col-sm-12 col-md-6 col-lg-6' } ).append(
                                        $( '<button>', { 'id': 'r-modal-up-oudt', 'class': 'btn btn-primary fg-white bg-ee-primary bd-ee-primary r-create-ro-modal-up', 'type': 'button' } ).text( 'Upload Output Data' )
                                    ),
                                    $( '<div>', { 'class': 'col-xs-12 col-sm-12 col-md-6 col-lg-6' } ).append(
                                        $( '<button>', { 'id': 'r-modal-up-doc', 'class': 'btn btn-primary fg-white bg-ee-primary bd-ee-primary r-create-ro-modal-up', 'type': 'button' } ).text( 'Upload Documentation' )
                                    )
                                )
                            ),
                            $( '<div>', { 'class': 'row step', 'data-step-number': '3', 'data-step-title': 'RO Metadata' } ).append(
                                $( '<div>', { 'class': 'form-group col-xs-12 col-sm-12 col-md-12 col-lg-12' } ).append(
                                    $( '<div>', { 'class': 'col-xs-12 col-sm-12 col-md-3 col-lg-3' } ).append(
                                        $( '<label>', { 'for': 'r-modal-meta' } ).text( 'Metadata' )
                                    ),
                                    $( '<div>', { 'class': 'col-xs-12 col-sm-12 col-md-9 col-lg-9' } ).append(
                                        $( '<textarea>', { 'id': 'r-modal-meta', 'class': 'form-control', 'rows': '5', 'required': 'required' } )
                                    )
                                )
                            )
                        ),
                        $( '<div>', { 'class': 'modal-footer' } ).append(
                            $( '<button>', { 'id': 'r-create-ro-modal-exit', 'class': 'btn btn-primary fg-white bg-ee-primary bd-ee-primary float-left', 'type': 'button', 'data-dismiss': 'modal' } ).text( 'Close' ),
                            $( '<button>', { 'id': 'r-create-ro-modal-prev', 'class': 'btn btn-primary fg-white bg-ee-primary bd-ee-primary disabled float-left', 'type': 'button' } ).text( '< Previous' ),
                            $( '<button>', { 'id': 'r-create-ro-modal-next', 'class': 'btn btn-primary fg-white bg-ee-primary bd-ee-primary', 'type': 'button' } ).text( 'Next >' ),
                            $( '<button>', { 'id': 'r-create-ro-modal-conf', 'class': 'btn btn-primary fg-white bg-ee-primary bd-ee-primary disabled', 'type': 'button' } ).text( 'Create' )
                        )
                    )
                )
            ).hide(),
            $( '<div>', { 'id': 'r-upload-modal', 'class': 'modal fade', 'tabindex': '-1', 'role': 'dialog' } ).append(
                $( '<div>', { 'class': 'modal-dialog', 'role': 'document' } ).append(
                    $( '<div>', { 'class': 'modal-content' } ).append(
                        $( '<div>', { 'class': 'modal-header' } ).append(
                            $( '<button>', { 'class': 'close fg-ee-primary', 'type': 'button', 'data-dismiss': 'modal', 'aria-label': 'Close' } ).append(
                                $( '<span>', { 'class': 'fa fa-times', 'aria-hidden': 'true' } )
                            ),
                            $( '<h4>', { 'class': 'modal-title' } ).text( 'Upload' )
                        ),
                        $( '<div>', { 'class': 'modal-body' } ),
                        $( '<div>', { 'class': 'modal-footer' } ).append(
                            $( '<button>', { 'id': 'r-upload-modal-exit', 'class': 'btn btn-primary fg-white bg-ee-primary bd-ee-primary float-left', 'type': 'button', 'data-dismiss': 'modal' } ).text( 'Exit' ),
                            $( '<button>', { 'id': 'r-upload-modal-conf', 'class': 'btn btn-primary fg-white bg-ee-primary bd-ee-primary disabled', 'type': 'button' } ).text( 'Create' )
                        )
                    )
                )
            ).hide()
        );
    };

    function _addHandlers() {
        $( '#r-create-ro-modal-next' ).on( 'click', function() {
            if ( ! $( this ).hasClass( 'disabled' ) ) {
                // Check next element
                var next = ( ( currIndx + 1 ) in array ) ? $( array[ currIndx + 1 ] ) : null;

                // Disable current element and activate next element
                if ( next ) {
                    curr.removeClass( 'active' );
                    curr.hide();
                    next.addClass( 'active' );
                    $( '#r-create-ro-modal-step' ).text( 'Step ' + next.attr( 'data-step-number') + ': ' + next.attr( 'data-step-title' ) );
                    next.show();
                }

                // Update nav buttons
                $( '#r-create-ro-modal-prev' ).removeClass( 'disabled' );
                if ( ( currIndx + 2 ) in array ) {
                    $( '#r-create-ro-modal-next' ).removeClass( 'disabled' );
                    $( '#r-create-ro-modal-conf' ).addClass( 'disabled' );
                } else {
                    $( '#r-create-ro-modal-next' ).addClass( 'disabled' );
                    $( '#r-create-ro-modal-conf' ).removeClass( 'disabled' );
                }

                // Update current element
                currIndx += 1;
                curr = next;
            }
        } );

        $( '#r-create-ro-modal-prev' ).on( 'click', function() {
            if ( ! $( this ).hasClass( 'disabled' ) ) {
                // Check prev element
                var prev = ( ( currIndx - 1 ) in array ) ? $( array[ currIndx - 1 ] ) : null;

                // Disable current element and activate prev element
                if ( prev ) {
                    curr.removeClass( 'active' );
                    curr.hide();
                    prev.addClass( 'active' );
                    $( '#r-create-ro-modal-step' ).text( 'Step ' + prev.attr( 'data-step-number') + ': ' + prev.attr( 'data-step-title' ) );
                    prev.show();
                }

                // Update nav buttons
                $( '#r-create-ro-modal-next' ).removeClass( 'disabled' );
                if ( ( currIndx - 2 ) in array ) {
                    $( '#r-create-ro-modal-prev' ).removeClass( 'disabled' );
                    $( '#r-create-ro-modal-conf' ).addClass( 'disabled' );
                } else {
                    $( '#r-create-ro-modal-prev' ).addClass( 'disabled' );
                    $( '#r-create-ro-modal-conf' ).addClass( 'disabled' );
                }

                // Update current element
                currIndx -= 1;
                curr = prev;
            }
        } );

        $( '#r-modal-up-indt' ).on( 'click', function() {
            // TODO
        } );

        $( '#r-modal-up-wf' ).on( 'click', function() {
            // TODO
        } );

        $( '#r-modal-up-oudt' ).on( 'click', function() {
            // TODO
        } );

        $( '#r-modal-up-doc' ).on( 'click', function() {
            // TODO
        } );

        $( '#r-create-ro-modal-conf' ).on( 'click', function() {
            var ro_name = $( '#r-modal-id' ).val();
            var ro_title = $( '#r-modal-title' ).val();
            var ro_desc = $( '#r-modal-desc' ).val();

            $.ajax( {
                url: '/romanager/create/',
                type: 'POST',
                async: false,
                dataType: 'json',
                data: {
                    csrfmiddlewaretoken: UTIL.getCookie( 'csrftoken' ),
                    id: ro_name,
                    title: ro_title,
                    //templ: document.getElementById( 'r-modal-templ' ).innerHTML,
                    desc: ro_desc,
                    //r-modal-up-indt
                    //r-modal-up-wf
                    //r-modal-up-oudt
                    //r-modal-up-doc
                    //r-modal-meta
                },
                success: function ( response ) {
                    if ( response.error_message ) {
                        console.log( '"/romanager/create/": failure' );
                        console.log( 'Error during RO creation: "' + response.error_message + '"' );

                        eeNotify.error( 'Error during RO creation: "' + response.error_message + '"' );
                    } else {
                        console.log( '"/romanager/create/": success');

                        eeNotify.success( '"' + response.title + '" succesfully created!' );

                        var d = new Date();
                        d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);
                        $( document ).trigger( 'fillRoContentEvent', [ ro_name, ro_title, '', '', d, 'LiveRO', ro_desc, [] ] );
                        // Dispose Modal
                        $( '#r-create-ro-modal' ).modal( 'hide' );
                    }
                },
                error: function( response ) {
                    console.log( '"/romanager/create/": failure' );
                    console.log( 'Error during RO creation: "' + response.error_message + '"' );

                    eeNotify.error( 'Error during RO creation: "' + response.error_message + '"' );
                }
            } );
        } );
    };

} ( jQuery ) );
