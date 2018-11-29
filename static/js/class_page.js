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
            Vue.set(e, 'editStatus', false);

        });
    };

    self.getTips = function()
    {
        $.getJSON(get_tips_url,
            function (data)
            {
                self.vue.tipList = data.tip_list;
                self.processTips();
            }

        );
    };

    self.processLogs = function ()
    {
        enumerate(self.vue.logList);
        console.log(self.vue.logList);

        self.vue.logList.map(function (e)
        {
            Vue.set(e, 'editStatus', false);
        });
    };

    self.getLogs = function()
    {
        $.getJSON(get_logs_url,
            function (data)
            {
                self.vue.logList = data.log_list;
                console.log(data);

                self.processLogs();
            }

        );
    };

    // Enables specified edit button for certain tip
    self.enableEdit = function(author, time,list)
    {
        if(list === 'tipList')
        {
            let list = self.vue.tipList;
            for(let i = 0; i < list.length; i++)
            {
                if(author === list[i].tip_author && time === list[i].tip_time)
                {
                    if(list[i].editStatus === true)
                    {
                        list[i].editStatus = false;
                    }
                    else
                    {
                        list[i].editStatus = true;
                    }
                }
            }
        }
        else if(list === 'logList')
        {
            let list = self.vue.logList;
            for(let i = 0; i < list.length; i++)
            {
                if(author === list[i].log_author && time === list[i].log_time)
                {
                    if(list[i].editStatus === true)
                    {
                        list[i].editStatus = false;
                    }
                    else
                    {
                        list[i].editStatus = true;
                    }
                }
            }
        }
 
    }

    self.editTip = function(author, time)
    {
        let tipList = self.vue.tipList;

        for(let i = 0; i < tipList.length; i++)
        {
            if(author === tipList[i].tip_author && time === tipList[i].tip_time)
            {
                $.post(edit_tip_url,{
                    tip_content: tipList[i].tip_content
                }, function(data){
                    self.enableEdit(author,time,'tipList');
                }
                );
                
            }
        }
    };

    self.editLog = function(author, time)
    {
        let logList = self.vue.logList;

        for(let i = 0; i < logList.length; i++)
        {
            if(author === logList[i].log_author && time === logList[i].log_time)
            {
                $.post(edit_log_url,{
                    log_content: logList[i].log_content
                }, function(data){
                    self.enableEdit(author,time,'logList');
                }
                );
                
            }
        }
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
            logList:[],
        },
        methods: {
            getCourse: self.getCourse,
            getTips: self.getTips,
            processTips: self.processTips,
            enableEdit: self.enableEdit,
            editTip: self.editTip,
            getLogs: self.getLogs,
            processLogs: self.processLogs,
            editLog: self.editLog,
        }
    });

    // If we are logged in, shows the form to add posts.
    if (is_logged_in) {
        $("#add_post").show();
    }

    self.getCourse();
    self.getTips();
    self.getLogs();

    return self;
};

var APP = null;


// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
