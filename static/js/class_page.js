// This is the js for the default/add_class_form.html view.
var app = function() {
    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };


    /* Course functions */

    self.getCourse = function()
    {
        $.getJSON(get_page_url,
            function(data)
            {
                self.vue.courseCode = data.course_code;
                self.vue.courseTitle = data.course_title;
                self.vue.diffRating = data.difficulty_rating;
                self.vue.workAvg = data.work_avg;
                self.vue.attCheck = data.attendance;
                self.vue.webCheck = data.webcast;


            }
        );
    }



    self.vue = new Vue({
        el: "#vue-div3",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            courseCode: "",
            courseTitle: "",
            diffRating: "",
            workAvg: "",
            attCheck: false,
            webCheck: false,
            courseList: [],
            currPage: null,
        },
        methods: {
            getCourse: self.getCourse,
        }
    });

    // If we are logged in, shows the form to add posts.
    if (is_logged_in) {
        $("#add_post").show();
    }

    self.getCourse();

    return self;
};

var APP = null;


// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
