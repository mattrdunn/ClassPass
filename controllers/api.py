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
    redirect(URL('default', 'index'))


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

