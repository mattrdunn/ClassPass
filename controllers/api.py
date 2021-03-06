# Course functions

@auth.requires_signature()
def add_course():
    db.course.insert(
        course_code=request.vars.course_code,
        course_title=request.vars.course_title,
        difficulty_rating=request.vars.difficulty_rating,
        work_avg=request.vars.work_avg,
        hw_difficulty=request.vars.hw_difficulty,
        midterm_difficulty=request.vars.midterm_difficulty,
        final_difficulty=request.vars.final_difficulty,

    )
    db.quick_information.insert(
        course_code=request.vars.course_code,
        difficulty_rating=request.vars.difficulty_rating,
        work_avg=request.vars.work_avg,
        hw_difficulty=request.vars.hw_difficulty,
        midterm_difficulty=request.vars.midterm_difficulty,
        final_difficulty=request.vars.final_difficulty,
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
                hw_difficulty=row.hw_difficulty,
                midterm_difficulty=row.midterm_difficulty,
                final_difficulty=row.final_difficulty,
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
                hw_difficulty=row.hw_difficulty,
                midterm_difficulty=row.midterm_difficulty,
                final_difficulty=row.final_difficulty,
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
                hw_difficulty=row.hw_difficulty,
                midterm_difficulty=row.midterm_difficulty,
                final_difficulty=row.final_difficulty,
            )

    return response.json(info)


# gets professors for a class
def get_profs():
    profs = []
    rows = db().select(db.current_page.ALL)
    curr_page = rows[0].curr_page
    tips_profs = db(db.tips.course_code == curr_page).select(db.tips.ALL)
    logs_profs = db(db.logs.course_code == curr_page).select(db.logs.ALL)
    for row in tips_profs:
        if row.tip_professor not in profs:
            profs.append(row.tip_professor)
    for row in logs_profs:
        if row.log_professor not in profs:
            profs.append(row.log_professor)
    return response.json(dict(profs=profs))


@auth.requires_signature()
def add_quick_info():
    rows = db().select(db.current_page.ALL)
    curr_page = rows[0].curr_page
    print "print1"
    db.quick_information.insert(
        course_code=curr_page,
        difficulty_rating=request.vars.difficulty_rating,
        work_avg=request.vars.work_avg,
        hw_difficulty=request.vars.hw_difficulty,
        midterm_difficulty=request.vars.midterm_difficulty,
        final_difficulty=request.vars.final_difficulty,
    )
    print "print2"
    info_course = db(db.course.course_code == curr_page).select(db.course.ALL)
    ic = info_course[0].info_count + 1
    wa = 0.0
    dr = 0.0
    hd = 0.0
    md = 0.0
    fd = 0.0
    print "print3"
    qi_rows = db(db.quick_information.course_code == curr_page).select(db.quick_information.ALL)
    print "print4"
    for row in qi_rows:
        wa = wa + row.work_avg
        dr = dr + row.difficulty_rating
        hd = hd + row.hw_difficulty
        md = md + row.midterm_difficulty
        fd = fd + row.final_difficulty
    print "print5"
    wa = wa / ic
    dr = dr / ic
    hd = hd / ic
    md = md / ic
    fd = fd / ic
    print "print6"


    db.course.update_or_insert((db.course.course_code == curr_page),
                               info_count=ic,
                               difficulty_rating=dr,
                               work_avg=wa,
                               hw_difficulty=hd,
                               midterm_difficulty=md,
                               final_difficulty=fd)
    print "print7"
    return



# used to edit the quick information table for averaging purposes
@auth.requires_signature()
def edit_quick_info():
    course_code = request.vars.course_code
    rating_change = request.vars.difficulty_rating
    work_change = request.var.work_avg

    db.quick_information.update_or_insert(
        (db.quick_information.course_code == course_code),
        difficulty_rating = rating_change,
        work_avg = work_change,
    )


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
    # TODO: FIX AVERAGING ALGO
    tip_course = db(db.course.course_code == curr_page).select(db.course.ALL)
    pc = tip_course[0].post_count + 1
    db.course.update_or_insert((db.course.course_code == curr_page),
                               post_count=pc,
                               )
    return


# used to display the list of tips
def get_tip():
    results = []
    cp_row = db().select(db.current_page.ALL)
    curr_page = cp_row[0].curr_page

    rows = db(db.tips.course_code == curr_page).select(db.tips.ALL)

    for row in rows:
        results.append(dict(
            course_code=row.course_code,
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
    tip_time = request.vars.tip_time

    db.tips.update_or_insert(
        (db.tips.tip_time == tip_time),
        tip_content=content_change,
    )


# add logs to database
# increment db.course.post_count by 1
# take work average here with respect to post_count and update db.course.work_avg
@auth.requires_signature()
def add_logs():
    rows = db().select(db.current_page.ALL)
    curr_page = rows[0].curr_page
    print "curr_page = ", curr_page
    db.logs.insert(
        course_code=curr_page,
        log_professor=request.vars.log_professor,
        log_content=request.vars.log_content,
        log_quarter=request.vars.log_quarter,
        log_asgn=request.vars.log_asgn,
        log_midterm=request.vars.log_midterm,
        log_final=request.vars.log_final,
        attendance=request.vars.attendance,
        webcast=request.vars.webcast,
    )
    #TODO: FIX AVERAGEING ALGO
    log_course = db(db.course.course_code == curr_page).select(db.course.ALL)
    pc = log_course[0].post_count + 1
    db.course.update_or_insert((db.course.course_code == curr_page),
                               post_count=pc,
                               )
    return


# used to display the list of tips
def get_logs():
    results = []
    cp_row = db().select(db.current_page.ALL)
    curr_page = cp_row[0].curr_page

    rows = db(db.logs.course_code == curr_page).select(db.logs.ALL)

    for row in rows:
        results.append(dict(
            log_course=row.course_code,
            log_author=row.log_author,
            log_professor=row.log_professor,
            log_content=row.log_content,
            log_time=row.log_time,
            log_quarter=row.log_quarter,
            log_asgn=row.log_asgn,
            log_midterm=row.log_midterm,
            log_final=row.log_final,
            attendance=row.attendance,
            webcast=row.webcast,
        ))

    return response.json(dict(log_list=results))

# Edit a log in the database
@auth.requires_signature()
def edit_log():
    content_change = request.vars.log_content
    log_time = request.vars.log_time

    db.logs.update_or_insert(
        (db.logs.log_time == log_time),
        log_content=content_change
    )
