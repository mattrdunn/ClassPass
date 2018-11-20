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

                    self.process_courses();

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
                console.log(self.vue.course_list.course_code);
                console.log(self.vue.course_list.course_title);
                // Course-processing
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
            course_list: [],
            showForm: false,
        },
        methods: {
            show_form: self.show_form,
            add_course: self.add_course,
            process_courses: self.process_courses,
            get_courses: self.get_courses
        }

    });

    // If we are logged in, shows the form to add posts.
    if (is_logged_in) {
        $("#add_post").show();
    }

    // Gets the courses.
    self.get_courses();

    return self;
};

var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
