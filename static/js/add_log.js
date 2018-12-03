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

    self.addLog = function ()
    {
        if(self.vue.logContent === "" || self.vue.logProf === "" ||
            self.vue.logQuarter === "" || self.vue.logYear === "" ||
            self.vue.numAsgn == "Choose number of homework assignments" || 
            self.vue.numMidterm == "Choose number of midterms")
        {
            console.log(self.vue.logContent);
            console.log(self.vue.logProf);
            console.log(self.vue.logQuarter);
            console.log(self.vue.attCheck);
            console.log(self.vue.webCheck);
            console.log(self.vue.numAsgn);
            console.log(self.vue.numMidterm);
            alert("Please fill out all of the fields in your submission");
        }
        else
        {
			self.vue.logQuarter = self.vue.logQuarter + " " + self.vue.logYear;
            $.post(add_log_url,
                // Data we will send
                {
                    log_content: self.vue.logContent,
                    log_professor: self.vue.logProf,
                    log_quarter: self.vue.logQuarter,
                    attendance: self.vue.attCheck,
                    webcast: self.vue.webCheck,
                    log_asgn: self.vue.numAsgn,
                    log_midterm: self.vue.numMidterm,
                    log_final: self.vue.finalCheck
                },
                function() {
                    self.vue.logContent = "";
                    self.vue.logProf = "";
                    self.vue.logQuarter = "";
                    self.vue.attCheck = "";
                    self.vue.webCheck = "";
                    self.vue.numAsgn = "";
                    self.vue.numMidterm = "";
                    self.vue.finalCheck = "";
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
            logContent: "",
            logProf: "",
			logQuarter: "",
			logYear: "",
            attCheck: false,
            webCheck: false,
            numAsgn: "",
            numMidterm: "",
            finalCheck: false,
        },
        methods: {
            addLog: self.addLog,
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
