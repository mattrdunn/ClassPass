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

    self.addCourse = function ()
    {
        if(self.vue.courseCode === "" || self.vue.courseTitle === "" ||
            self.vue.diffRating === "" || self.vue.diffRating == "Choose a difficulty rating" || self.vue.workAvg == "Choose hours of work per week" || self.vue.workAvg === "")
        {
            console.log(self.vue.courseCode);
            console.log(self.vue.courseTitle);
            console.log(self.vue.diffRating);
            console.log(self.vue.workAvg);
            console.log(self.vue.attCheck);
            console.log(self.vue.webCheck);
            alert("Please fill out all of the fields in your submission");
        }
        else
        {
            $.post(add_course_url,
                // Data we will send
                {
                    course_code: self.vue.courseCode,
                    course_title: self.vue.courseTitle,
                    difficulty_rating: self.vue.diffRating,
                    work_avg: self.vue.workAvg,
                    attendance: self.vue.attCheck,
                    webcast: self.vue.webCheck,
                },
                function() {
                    self.vue.courseCode = "";
                    self.vue.courseTitle = "";
                    self.vue.diffRating = "";
                    self.vue.workAvg = "";
                    self.vue.attCheck = "";
                    self.vue.webCheck = "";
                }
            );
        }
    };


    self.vue = new Vue({
        el: "#vue-div2",
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
        },
        methods: {
            addCourse: self.addCourse,
        }
    });

    // If we are logged in, shows the form to add posts.
    if (is_logged_in) {
        $("#add_post").show();
    }


    return self;
};

var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
