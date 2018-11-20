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
                Field('difficulty_rating', 'integer', default=None),
                Field('work_avg', 'integer', default=None),
                Field('post_count', "integer", default=0),
                Field('attendance', 'boolean', default=None),
                Field('webcast', 'boolean', default=None)
                )

# Tip table
db.define_table('tip',
                Field('course_code', 'reference course'),
                Field('tip_author', default=get_user_email()),
                Field('tip_professor', 'text'),
                Field('tip_content', 'text'),
                Field('tip_time', default=get_current_time()),
                Field('tip_quarter', 'text', default=None)
                )
