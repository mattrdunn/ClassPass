# Course functions

@auth.requires_signature()
def add_course():
    db.course.insert(
        course_code=request.vars.course_code,
        course_title=request.vars.course_title,
        difficulty_rating=request.vars.difficulty_rating,
        work_avg=request.vars.work_avg,
        attendance=request.vars.attendance,
        webcast=request.vars.webcast,
    )
    return


def get_course_list():
    results = []

    # Not logged in functionality
    rows = db().select(db.course.ALL)
    if auth.user is None:
        for row in rows:
            results.append(dict(
                id=row.id,
                course_code=row.course_code,
                course_title=row.course_title,
                post_count=row.post_count,
                difficulty_rating=row.difficulty_rating,
            ))
    else:
        # Logged in functionality
        for row in rows:
            results.append(dict(
                id=row.id,
                course_code=row.course_code,
                course_title=row.course_title,
                post_count=row.post_count,
                difficulty_rating=row.difficulty_rating,
            ))

    return response.json(dict(course_list=results))


def check_dup():
    course_code = request.vars.course_code
    rows = db().select(db.course.ALL)
    dup = False
    for row in rows:
        if row.course_code == course_code:
            dup = True
    return dup

def set_page():
    rows = db().select(db.current_page.ALL)
    if len(rows) < 1:
        db.current_page.insert(curr_page=request.vars.course_code)
    else:
        db.current_page.update_or_insert((db.current_page.id == 1),
            curr_page=request.vars.course_code,
        )

    return

def get_page():
    rows = db().select(db.current_page.ALL)
    curr_page = rows[0].curr_page

    rows = db().select(db.course.ALL)
    results = []
    # Logged in functionality
    for row in rows:
        if(row.course_code == curr_page):
            info = dict(
                course_code=row.course_code,
                course_title=row.course_title,
                post_count=row.post_count,
                difficulty_rating=row.difficulty_rating,
            )

    return response.json(info)




