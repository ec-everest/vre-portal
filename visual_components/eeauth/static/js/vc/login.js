/** @preserve
 * Author:      Sergio Ferraresi <ferraresi@meeo.it> 
 * Description: TODO
 * Namespace:   ever-est
 * Widget Name: auth
 * Changelog:   2016-07-12 First Version
 *              2016-09-22 Code Reorganization
 */

$( function() {
    $.widget( 'ever-est.auth', {
        
        // Contructor
        _create: function() {
            // Init Main Div
            $( '#l-form' ).addClass( 'form-signin' ).prop( { 'method': 'post', 'action': '/eeauth/do_login/' } ).append(
                $( '<div>', { class: 'panel bg-white fg-ee-primary' } ).append(
                    $( '<div>', { class: 'panel-header text-center' } ).append(
                        $( '<span>', { class: 'atomic-number' } ).text( 'Login' )
                    ),
                    $( '<div>', { class: 'panel-body text-center' } ).append(
                        $( '<h1>', { class: 'atomic-symbol' } ).append(
                            $( '<img>', { class: 'logo-lettering', 'alt': 'EVER-EST Logo', 'src': STATIC_URL + 'img/logo-lettering-150x46.png' } )
                        ),
                        $( '<div>', { class: 'form-group form-animate-text' } ).append(
                            $( '<input>', { 'id': 'usr', class: 'form-text', 'type': 'text', 'name': 'usr', 'required': 'true' } ),
                            $( '<span>', { class: 'bar' } ),
                            $( '<label>' ).text( 'Username' )
                        ),
                        $( '<div>', { 'class': 'form-group form-animate-text' } ).append(
                            $( '<input>', { 'id': 'pwd', class: 'form-text', 'type': 'password', 'name': 'pwd', 'required': 'true' } ),
                            $( '<span>', { 'class': 'bar' } ),
                            $( '<label>' ).text( 'Password' )
                        ),
                        //$( '<label>', { 'class': 'pull-left' } ).append(
                        //    $( '<input>', { 'class': 'icheck pull-left', 'type': 'checkbox', 'name': 'checkbox1' } )
                        //).text( ' Remember me' ),
                        $( '<input>', { 'id': 'loginButton', 'class': 'btn col-md-12 bg-ee-primary fg-white', 'type': 'submit' } ).val( 'Sign In' )
                    )
                    //, $( '<div>', { 'class': 'text-center', style: 'padding:5px;' } ).append(
                    //    $( '<a>', { 'href': 'forgotpass.html' } ).text( 'Forgot Password ' ),
                    //    $( '<a>', { 'href': 'register.html' } ).text( '| Signup' )
                    //)
            //        // Create Search Bar
            //        this._createSearchBar(),
            //        
            //        // Create Settings Panel
            //        this._createSettingsPanel(),
            //        
            //        // Create Results Panel
            //        this._createResultsPanel()
                )
            );
            
            // Init Third Parties Plugins
            this._init3rdPartiesPlugins();
            
            // Handlers
            //this._addHandlers();
            
            console.log( 'Auth Widget initialized' );
        },
        
        // Init Third Parties Plugins
        _init3rdPartiesPlugins: function() {
            $( 'input' ).iCheck( {
                checkboxClass: 'icheckbox_flat-aero',
                radioClass: 'iradio_flat-aereo',
            } );
        },
    } );
    
} );
