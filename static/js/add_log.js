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
        let lp;
        if(self.vue.currProf != "Add a new professor" && self.vue.courseProfs.length > 0)
            lp = self.vue.currProf;
        else
            lp = self.vue.logProf;
        if(self.vue.logContent === "" || lp === "" ||
            self.vue.logQuarter === "" || self.vue.logYear === "" ||
            self.vue.numAsgn == "Choose number of homework assignments" || 
            self.vue.numMidterm == "Choose number of midterms")
        {
            console.log(lp);
            console.log(self.vue.currProf);
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
                    log_professor: lp,
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
                    window.history.back();
                }
            );
        }
    };

    self.getProfs = function() {
        $.getJSON(get_profs_url,
            function(data){
                self.vue.courseProfs = data.profs;
        });
    }

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
            currProf: "",
            courseProfs: [],
        },
        methods: {
            addLog: self.addLog,
            getProfs: self.getProfs,
        }
    });

    self.getProfs();

    return self;
};

var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
