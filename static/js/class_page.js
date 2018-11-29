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

    // Enumerates an array.
    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};


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
    };

    self.processTips = function ()
    {
        enumerate(self.vue.tipList);

        self.vue.tipList.map(function (e)
        {

        });
    };

    self.getTips = function()
    {
        console.log("we here");
        $.getJSON(get_tips_url,
            function (data)
            {
                self.vue.tipList = data.tip_list;
                console.log(data);

                //self.processTips();
            }

        );
    };


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
            currPage: null,
            tipList: [],
        },
        methods: {
            getCourse: self.getCourse,
            getTips: self.getTips,
            processTips: self.processTips,
        }
    });

    // If we are logged in, shows the form to add posts.
    if (is_logged_in) {
        $("#add_post").show();
    }

    self.getCourse();
    self.getTips();

    return self;
};

var APP = null;


// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
