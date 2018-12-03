# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.




# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)


import datetime

def get_user_email():
    return None if auth.user is None else auth.user.email

def get_current_time():
    return datetime.datetime.utcnow()


# Course Table
db.define_table('course',
                Field('course_code', 'text'),
                Field('course_title'),
                Field('difficulty_rating', 'float', default=0),
                Field('work_avg', 'float', default=0),
                Field('post_count', 'integer', default=1),
                Field('info_count', 'integer', default=1),
                )


db.define_table('quick_information',
                Field('info_author', default=get_user_email()),
                Field('course_code', 'text'),
                Field('difficulty_rating', 'float'),
                Field('work_avg', 'float')
                )


db.define_table('tips',
                Field('course_code', 'text'),
                Field('tip_author', default=get_user_email()),
                Field('tip_professor', 'text'),
                Field('tip_content', 'text'),
                Field('tip_time', default=get_current_time()),
                Field('tip_quarter', 'text', default=None)
                )

db.define_table('logs',
                Field('course_code', 'text'),
                Field('log_author', default=get_user_email()),
                Field('log_professor', 'text'),
                Field('log_content', 'text'),
                Field('log_time', default=get_current_time()),
                Field('log_quarter', 'text', default=None),
                Field('log_asgn', 'integer', default=0),
                Field('log_midterm', 'integer', default=1),
                Field('log_final', 'boolean', default=True),
                Field('attendance', 'boolean', default=None),
                Field('webcast', 'boolean', default=None)
                )

# current page table
db.define_table('current_page',
                Field('curr_page', 'text')
                )

