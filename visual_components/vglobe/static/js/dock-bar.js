$(function () {
    $.widget("earthserver.dock", {
        options: {
            container: $("#service-container"),
            position: "right",
            toggleId: undefined,
            toggleIcon: undefined,
            toggleStyle: ""
        },
        
        _create: function (opts) {
            var self = this;
            
            this.options = $.extend({}, this.options, opts);
            
            this._initDock();
//            this.scrollbar = this.element.mCustomScrollbar({
//                theme: "light-thin",
//                mouseWheel: {
//                    disableOver: ["textarea"]
//                }
//            });
        },
        
        _initDock: function () {
            var self = this;
            
            this.dock = this.element.addClass("row").appendTo(this.options.container);
            
//            if (this.options.position == "left") {
//                $(window).resize(function() {
//                    if (self.options.position == "left") {
//                        if ($(window).width() < 992) {
//                            var leftDockOpen = self.dock.hasClass("open");
//                            $(".dock").each(function(index, item) {
//                                if (leftDockOpen && $(this).hasClass("right-dock") && $(this).hasClass("open")) {
//                                    $(this).removeClass("open");
//                                }
//                            });
//                        }
//                    }
//
//                });
//            }
            
            this.dockToggleIconWrapper = $("<button>", {
                id: this.options.toggleId,
                type: "button", 
                class: "btn btn-circle btn-sm opener-" + this.options.position + " active is-closed",
                style: this.options.toggleStyle
            }).click(function () {
                $(this).hasClass("is-open") ? self.close() : self.open();
                
//                if ($(window).width() < 992) {
//                    openDocks.each(function (index, item) {
//                        $.each($(this).data(), function(key, value) {
//                            if (key.match("^dock-")) {
//                                $(item).data(key).close();
//                            }
//                        });
//                    })
//                }
            }).appendTo(this.dock);
            
//            this.dock.bind($.support.transition.end, function(e) {
//                if (!$(e.target).hasClass("dock-toggle")) {
//                    $(".bring-on-top").removeClass("bring-on-top");
//                }
//            });
        },
        
        open: function() {
            var self = this;
            
            // Flip animation for the dock toggle
            this.dockToggleIconWrapper.addClass('animated flip');
            this.dockToggleIconWrapper.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                self.dockToggleIconWrapper.removeClass('animated flip');
            });
            
            var dockClosed = this.dockToggleIconWrapper.hasClass("is-closed");
            if (dockClosed) {
                var panel = this.dock.find('.eecontainer-'+ this.options.position).filter(":first");
                panel.toggle('slide', { direction: this.options.position }, 350);
                
                this.dockToggleIconWrapper.addClass("is-open");
                this.dockToggleIconWrapper.removeClass("is-closed");
            }
        },
        
        close: function() {
            var self = this;
            
            // Flip animation for the dock toggle
            this.dockToggleIconWrapper.addClass('animated flip');
            this.dockToggleIconWrapper.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                self.dockToggleIconWrapper.removeClass('animated flip');
            });
            
            var dockOpen = this.dockToggleIconWrapper.hasClass("is-open");
            if (dockOpen) {
                var panel = this.dock.find('.eecontainer-'+ this.options.position).filter(":first");
                panel.toggle('slide', { direction: this.options.position }, 350);
                
                this.dockToggleIconWrapper.addClass("is-closed");
                this.dockToggleIconWrapper.removeClass("is-open");
            }
        },
        
        addEmptyPanel: function (panelId) {
            return $("<div>").panel({
                dock: this.dock,
                panelId: panelId
            }).panel("instance");
        }
    })
});