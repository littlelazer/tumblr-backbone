$(document).ready(function(){
    var Tumblr = Tumblr || {};

    Tumblr.apiURL = 'http://api.tumblr.com/v2/blog/<blog url>';
    Tumblr.apiKey = '<tumblr api key>';
    Tumblr.posts;

    Tumblr.TumblrPostModel = Backbone.Model.extend({});
    Tumblr.Tumblog = Backbone.Collection.extend({
        model : Tumblr.TumblrPostModel,
        initialize : function ( models, options) {
            this.bind("add", options.view.addNewPost);
            this.options = options;
        },
        type : function( postType ) {
            return this.filter(function(game) {
                return game.get('type') === postType;
            })
        }
    });

    Tumblr.TumblrPostView = Backbone.View.extend({
        tagName : "li",
        className : "post",
        template : $('#postTemplate').html(),

        initialize : function ( model ) {
            this.model = model;
            this.template = $('#' + model.model.attributes.type + 'Template').html();
        },
        render : function ( ) {
            var templ = _.template(this.template, this.model.model.attributes);
            this.$el.html(templ).addClass( this.model.model.attributes.type + '-post' );
            return this;
        }
    });

    Tumblr.TumblogView = Backbone.View.extend({
        el : '#tumblrblog',
        events : {},
        initialize : function ( ) {
            this.tumblog = new Tumblr.Tumblog( null, { view : this });
        },
        render : function ( ) {
            return this.tumblog.each( 
                function ( post ) {
                    this.renderPost( post );
                }, 
                this
            );
        },
        loadPosts : function ( ) {
            $.ajax({
                url : Tumblr.apiURL + '/posts/?api_key=' + Tumblr.apiKey,
                context : self,
                dataType : 'jsonp',
                jsonp : 'jsonp'
            })
                .success(function(json) {
                    Tumblr.posts = json;
                    Tumblr.myTumblr.tumblog.add(Tumblr.posts.response.posts);
                    //Tumblr.myTumblr.render();
                });
        },
        addNewPost : function ( post ) {
            var postView = new Tumblr.TumblrPostView({ model : post });
            this.options.view.$el.append( postView.render().el );
        },
        renderPost : function ( post ) {
            
        }
    });

    Tumblr.myTumblr = new Tumblr.TumblogView();
    Tumblr.myTumblr.loadPosts();
    window.Tumblr = Tumblr;
});