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


# returns the page to go to
def get_page():
    rows = db().select(db.current_page.ALL)
    curr_page = rows[0].curr_page

    rows = db().select(db.course.ALL)
    # Logged in functionality
    for row in rows:
        if row.course_code == curr_page:
            info = dict(
                course_code=row.course_code,
                course_title=row.course_title,
                post_count=row.post_count,
                difficulty_rating=row.difficulty_rating,
                work_avg=row.work_avg,
                attendance=row.attendance,
                webcast=row.webcast,
            )

    return response.json(info)


# add tip to database
# increment db.course.post_count by 1
# take work average here with respect to post_count and update db.course.work_avg
@auth.requires_signature()
def add_tip():
    rows = db().select(db.current_page.ALL)
    curr_page = rows[0].curr_page
    print "curr_page = ", curr_page
    db.tips.insert(
        course_code=curr_page,
        tip_professor=request.vars.tip_professor,
        tip_content=request.vars.tip_content,
        tip_quarter=request.vars.tip_quarter,
    )

    tip_course = db(db.course.course_code == curr_page).select(db.course.ALL)
    pc = tip_course[0].post_count + 1
    print "PC = ", pc
    wa = request.vars.work_avg
    course_wa = tip_course[0].work_avg
    # plus one for initial creation
    course_wa = round((int(course_wa) + int(wa)) / (pc + 1))
    print "Course WA = ", course_wa
    dr = request.vars.difficulty_rating
    course_dr = tip_course[0].difficulty_rating
    # plus one for initial creation
    course_dr = round((int(course_dr) + int(dr)) / (pc + 1))
    print "Course DR = ", course_dr

    db.course.update_or_insert((db.course.course_code == curr_page),
                               post_count=pc,
                               difficulty_rating=course_dr,
                               work_avg=course_wa)
    return


# used to display the list of tips
def get_tip():
    results = []
    cp_row = db().select(db.current_page.ALL)
    curr_page = cp_row[0].curr_page

    rows = db(db.tips.course_code == curr_page).select(db.tips.ALL)

    for row in rows:
        results.append(dict(
            tip_author=row.tip_author,
            tip_professor=row.tip_professor,
            tip_content=row.tip_content,
            tip_time=row.tip_time,
            tip_quarter=row.tip_quarter,
        ))

    return response.json(dict(tip_list=results))


# Edit a tip in the database
@auth.requires_signature()
def edit_tip():
    content_change = request.vars.tip_content

    db.tips.update_or_insert(
        (db.tips.tip_author == auth.user.email),
        tip_content=content_change
    )
