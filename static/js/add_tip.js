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

    self.addTip = function ()
    {
        if(self.vue.tipContent === "" || self.vue.tipProf === "" ||
            self.vue.tipQuarter === "" || self.vue.tipQuarter === "" ||
            self.vue.diffRating === "Choose the quarter when you took this class" ||
            self.vue.diffRating == "Choose a difficulty rating" ||
            self.vue.workAvg =="Choose hours of work per week" || self.vue.workAvg === "")
        {
            console.log(self.vue.tipContent);
            console.log(self.vue.tipProf);
            console.log(self.vue.tipQuarter);
            console.log(self.vue.diffRating);
            console.log(self.vue.workAvg);
            console.log(self.vue.attCheck);
            console.log(self.vue.webCheck);
            alert("Please fill out all of the fields in your submission");
        }
        else
        {
            $.post(add_tip_url,
                // Data we will send
                {
                    tip_content: self.vue.tipContent,
                    tip_professor: self.vue.tipProf,
                    tip_quarter: self.vue.tipQuarter,
                    difficulty_rating: self.vue.diffRating,
                    work_avg: self.vue.workAvg,
                    attendance: self.vue.attCheck,
                    webcast: self.vue.webCheck,
                },
                function() {
                    self.vue.tipContent = "";
                    self.vue.tipProf = "";
                    self.vue.tipQuarter = "";
                    self.vue.diffRating = "";
                    self.vue.workAvg = "";
                    self.vue.attCheck = "";
                    self.vue.webCheck = "";
                            // Calls default.py/index and loads index.html without an ability to hit "back" and return to add_class_form.html
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
            tipContent: "",
            tipProf: "",
            tipQuarter: "",
            diffRating: "",
            workAvg: "",
            attCheck: false,
            webCheck: false,
        },
        methods: {
            addTip: self.addTip,
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
