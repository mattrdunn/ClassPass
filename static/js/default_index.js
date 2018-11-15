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
        if(self.vue.showForm) {
            self.vue.showForm = false;
        }
        else {
            self.vue.showForm = true;
        }
    };

    self.editing_post = function(id) {
        var p = self.vue.post_list[self.vue.post_list.length-id];
        if(p.editing) {
            p.editing = false;
        }
        else {
            p.editing = true;
        }
    };

    self.edit_content = function(id) {
        var p = self.vue.post_list[self.vue.post_list.length-id];
        $.post(edit_post_url,
            {
                post_id: id,
                post_title: p.post_title,
                post_content: p.post_content
            }

        );
        self.editing_post(id);
    };



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


    /* Course functions */

    self.add_course = function ()
    {
        // Make a copy of the title & content
        var sent_title = self.vue.course_title;
        var sent_code = self.vue.course_code;

        if(sent_title === "" || send_name === "")
        {
            alert("Please add a course title or course name to your submission");
        }
        else
        {
            $.post(add_course_url,
                // Data we will send
                {
                    course_title: self.vue.course_title,
                    course_code: self.vue.course_code
                },
                function(data)
                {
                    // After this succeeds, we will clear the fields
                    self.vue.course_title = "";
                    self.vue.course_code = "";

                    let new_course = {
                        course_code: sent_code,
                        course_title: sent_title
                    };

                    self.vue.course_list.unshift(new_course);

                    self.process_course();

                }
            );
        }
    };

    self.process_courses = function ()
    {
        enumerate(self.vue.course_list);

        // Initialization of course variables
        self.vue.course_list.map(function (e)
        {

        });
    };

    self.get_courses = function ()
    {
        $.getJSON(get_course_list_url,
            function(data)
            {
                self.vue.course_list = data.course_list;

                // Post-processing
                self.process_courses();
            }
        );
    };


    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            form_title: "",
            form_content: "",
            course_title: "",
            course_code: "",
            post_list: [],
            course_list: [],
            showForm: false,
        },
        methods: {
            add_post: self.add_post,
            add_reply: self.add_reply,
            show_form: self.show_form,
            editing_post: self.editing_post,
            edit_content: self.edit_content,
            add_course: self.add_course,
            process_courses: self.process_courses,
            get_courses: self.get_courses
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
