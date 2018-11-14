// This is the js for the default/index.html view.
var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};

    self.show_form = function() {
        if(self.vue.showForm==true) {
            self.vue.showForm = false;
        }
        else {
            self.vue.showForm = true;
        }
    };

    self.editing_post = function(id) {
        var p = self.vue.post_list[self.vue.post_list.length-id];
        if(p.editing==true) {
            p.editing = false;
        }
        else {
            p.editing = true;
        }
    };

    self.editing_reply = function(id) {
        var r = self.vue.reply_list[id-1];
        if(r.editing==true) {
            r.editing = false;
        }
        else {
            r.editing = true;
        }
    };

    self.show_replies = function(id) {
        var p = self.vue.post_list[self.vue.post_list.length-id];
        if(p.replies==true) {
            p.replies = false;
            p.reply_form = false;
        }
        else {
            p.replies = true;
            self.get_replies(id);
        }
    };

    self.show_reply_form = function(id) {
        var p = self.vue.post_list[self.vue.post_list.length-id];
        if(p.reply_form==true) {
            p.reply_form = false;
        }
        else {
            p.reply_form = true;
        }
    };

    self.edit_content = function(id) {
        //$.web2py.disableElement($("#edit-post-btn"));
        var p = self.vue.post_list[self.vue.post_list.length-id];
        $.post(edit_post_url,
            {
                post_id: id,
                post_title: p.post_title,
                post_content: p.post_content
            }
            // function(data) {
            //     $.web2py.enableElement($("#edit-post-btn"));
            // }
        );
        self.editing_post(id);
    };

    self.edit_reply_content = function(id, reply_id) {
        //$.web2py.disableElement($("#edit-post-btn"));
        $.post(edit_reply_url,
            {
                post_id: id,
                reply_id: reply_id,
                reply_content: self.vue.reply_list[reply_id-1].reply_content
            }
            // function(data) {
            //     $.web2py.enableElement($("#edit-post-btn"));
            // }
        );
        self.editing_reply(reply_id);
    }

    self.add_post = function () {
        $.web2py.disableElement($("#add-post"));
        var sent_title = self.vue.form_title; // Makes a copy
        var sent_content = self.vue.form_content;
        if(sent_title=="" || sent_content=="")
        {
            alert("Please add more content to your post");
            self.vue.showForm = false;
        }
        else {
            // We disable the button, to prevent double submission.
            $.post(add_post_url,
                // Data we are sending.
                {
                    post_title: self.vue.form_title,
                    post_content: self.vue.form_content
                },
                // What do we do when the post succeeds?
                function (data) {
                    // Re-enable the button.
                    $.web2py.enableElement($("#add-post"));
                    // Clears the form.
                    self.vue.form_title = "";
                    self.vue.form_content = "";
                    // Adds the post to the list of posts.
                    var new_post = {
                        id: data.post_id,
                        post_title: sent_title,
                        post_content: sent_content
                    };
                    self.vue.post_list.unshift(new_post);
                    // We re-enumerate the array.
                    self.process_posts();
                    self.vue.showForm = false;
                });
        }
        // If you put code here, it is run BEFORE the call comes back.
    };

    self.add_reply = function (id) {
        $.web2py.disableElement($("#reply-post"));
        var sent_content = self.vue.form_content;
        if(sent_content=="")
        {
            alert("Please add more content to your reply");
        }
        else {
            // We disable the button, to prevent double submission.
            $.post(add_reply_url,
                // Data we are sending.
                {
                    post_id: id,
                    reply_content: self.vue.form_content
                },
                // What do we do when the post succeeds?
                function (data) {
                    // Re-enable the button.
                    $.web2py.enableElement($("#reply-post"));
                    // Clears the form.
                    self.vue.form_content = "";
                    // Adds the post to the list of posts.
                    var new_reply = {
                        id: data.post_id,
                        reply_content: sent_content,
                        editing: false,
                    };
                    self.vue.reply_list.unshift(new_reply);
                    // We re-enumerate the array.
                    self.process_replies();
                    self.get_replies(id);
                });
        }
        self.show_reply_form(id);
        // If you put code here, it is run BEFORE the call comes back.
    };

    self.get_posts = function() {
        $.getJSON(get_post_list_url,
            function(data) {
                // I am assuming here that the server gives me a nice list
                // of posts, all ready for display.
                self.vue.post_list = data.post_list;
                // Post-processing.
                self.process_posts();
            }
        );
    };

    self.get_replies = function(id) {
        $.getJSON(get_reply_list_url, {post_id: id},
            function(data) {
                // I am assuming here that the server gives me a nice list
                // of posts, all ready for display.
                self.vue.reply_list = data.reply_list;
                // Post-processing.
                self.process_replies();
            }
        );
    };

    self.process_posts = function() {
        // This function is used to post-process posts, after the list has been modified
        // or after we have gotten new posts.
        // We add the _idx attribute to the posts.
        enumerate(self.vue.post_list);
        // We initialize the smile status to match the like.
        self.vue.post_list.map(function (e) {

            Vue.set(e, '_thumb', null);
            Vue.set(e, 'count', 0);
            Vue.set(e, 'editing', false); // true when editing a post
            Vue.set(e, 'replies', false); // shows replies when true
            Vue.set(e, 'reply_form', false); // true when adding reply
        });
    };

    self.process_replies = function() {
        enumerate(self.vue.reply_list);
        // We initialize the smile status to match the like.
        self.vue.reply_list.map(function (e) {
            Vue.set(e, 'editing', false); // true when editing reply
        });
    };

    self.get_counts = function(id) {
        var p = self.vue.post_list[self.vue.post_list.length-id];
        $.get(get_thumb_count, {
                post_id: id
            }, function(data){
                p.count = data;
        });
    }

    self.handle_thumb_click = function(iconClicked, id) {
        // The like status is toggled; the UI is not changed.
        var p = self.vue.post_list[self.vue.post_list.length-id];
        if(iconClicked=='u') {
            if(p.thumb==null || p.thumb=='d') {
                p.thumb = iconClicked;
            }
            else { // deselect up thumb
                p.thumb = null;
            }
        }
        else { // iconClicked = 'd'
            if(p.thumb==null || p.thumb=='u') {
                p.thumb = iconClicked;
            }
            else { // deselect down thumb
                p.thumb = null;
            }
        }

            // We need to post back the change to the server.
            $.post(set_thumb_url, {
                post_id: id,
                thumb: p.thumb
            }); // Nothing to do upon completion.
    };

    // Smile change code.
    self.thumb_mouseover = function (thumbState, id) {
        var p = self.vue.post_list[self.vue.post_list.length-id];
        p._thumb = thumbState;
    };

    self.thumb_mouseout = function (id) {
        var p = self.vue.post_list[self.vue.post_list.length-id];
        p._thumb = null;
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            form_title: "",
            form_content: "",
            post_list: [],
            reply_list: [],
            showForm: false,
        },
        methods: {
            add_post: self.add_post,
            add_reply: self.add_reply,
            show_form: self.show_form,
            editing_post: self.editing_post,
            editing_reply: self.editing_reply,
            edit_content: self.edit_content,
            edit_reply_content: self.edit_reply_content,
            handle_thumb_click: self.handle_thumb_click,
            thumb_mouseover: self.thumb_mouseover,
            thumb_mouseout: self.thumb_mouseout,
            get_counts: self.get_counts,
            show_replies: self.show_replies,
            show_reply_form: self.show_reply_form,
        }

    });

    // If we are logged in, shows the form to add posts.
    if (is_logged_in) {
        $("#add_post").show();
    }

    // Gets the posts.
    self.get_posts();

    return self;
};

var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
