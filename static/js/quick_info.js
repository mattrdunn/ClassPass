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

    self.addInfo = function ()
    {
        if(self.vue.diffRating == "Choose a difficulty rating" ||
            self.vue.workAvg =="Choose hours of work per week" || self.vue.workAvg === "" || self.vue.diffRating === "")
        {
            console.log(self.vue.diffRating);
            console.log(self.vue.workAvg);
            alert("Please fill out all of the fields in your submission");
        }
        else
        {
            $.post(add_quick_info_url,
                // Data we will send
                {
                    difficulty_rating: self.vue.diffRating,
                    work_avg: self.vue.workAvg,
                },
                function() {
                    self.vue.diffRating = "";
                    self.vue.workAvg = "";
                    // Calls default.py/class_page and loads class_page.html without an ability to hit "back" and return to add_class_form.html
                    window.location.replace("class_page");
                }
            );
        }
    };


    self.vue = new Vue({
        el: "#vue-div4",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            diffRating: 0,
            workAvg: 0,
        },
        methods: {
            addInfo: self.addInfo,
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
