
@auth.requires_signature()
def add_post():
    post_id = db.post.insert(
        post_title=request.vars.post_title,
        post_content=request.vars.post_content,
    )
    # We return the id of the new post, so we can insert it along all the others.
    return response.json(dict(post_id=post_id))


@auth.requires_signature()
def add_reply():
    reply_id = db.reply.insert(
        post_id=request.vars.post_id,
        reply_content=request.vars.reply_content,
    )
    # We return the id of the new post, so we can insert it along all the others.
    return response.json(dict(reply_id=reply_id))


def get_post_list():
    results = []
    if auth.user is None:
        # Not logged in.
        rows = db().select(db.post.ALL, orderby=~db.post.post_time)
        for row in rows:
            results.append(dict(
                id=row.id,
                post_title=row.post_title,
                post_content=row.post_content,
                post_author=row.post_author,
                thumb = None,
            ))
    else:
        # Logged in.
        rows = db().select(db.post.ALL, db.thumb.ALL,
                            left=[
                                db.thumb.on((db.thumb.post_id == db.post.id) & (db.thumb.user_email == auth.user.email)),
                            ],
                            orderby=~db.post.post_time)
        for row in rows:
            results.append(dict(
                id=row.post.id,
                post_title=row.post.post_title,
                post_content=row.post.post_content,
                post_author=row.post.post_author,
                thumb = None if row.thumb.id is None else row.thumb.thumb_state,
            ))
    # For homogeneity, we always return a dictionary.
    return response.json(dict(post_list=results))


def get_reply_list():
    results = []
    post_id = request.vars.post_id
    # db(db.reply.post_id == post_id).select...
    rows = db().select(db.reply.ALL)
    if auth.user is None:
        # Not logged in.
        for row in rows:
            results.append(dict(
                id=row.id,
                reply_content=row.reply_content,
                reply_author=row.reply_author,
            ))
    else:
        # Logged in.
        for row in rows:
            results.append(dict(
                id=row.id,
                post_id=row.post_id,
                reply_content=row.reply_content,
                reply_author=row.reply_author,
            ))
    # For homogeneity, we always return a dictionary.
    return response.json(dict(reply_list=results))


def get_count():
    post_id = int(request.vars.post_id)
    count = 0
    for row in db(db.thumb.post_id == post_id).select(db.thumb.thumb_state):
        if row.thumb_state == 'u':
            count += 1
        elif row.thumb_state == 'd':
            count -= 1
    return count


@auth.requires_signature()
def set_thumb():
    post_id = int(request.vars.post_id)
    thumb_status = request.vars.thumb
    if thumb_status == 'u' or thumb_status == 'd':
        db.thumb.update_or_insert(
            (db.thumb.post_id == post_id) & (db.thumb.user_email == auth.user.email),
            user_email=auth.user.email,
            post_id=post_id,
            thumb_state=thumb_status
        )
    else:
        db((db.thumb.post_id == post_id) & (db.thumb.user_email == auth.user.email)).delete()
    return "ok"


@auth.requires_signature()
def edit_post():
    post_id = request.vars.post_id
    new_post_title = request.vars.post_title
    new_post_content = request.vars.post_content
    db.post.update_or_insert(
        (db.post.id == post_id) & (db.post.post_author == auth.user.email),
        post_title=new_post_title,
        post_content=new_post_content
    )
    return "ok"


@auth.requires_signature()
def edit_reply():
    post_id = request.vars.post_id
    reply_id = request.vars.reply_id
    new_reply_content = request.vars.reply_content
    db.reply.update_or_insert(
        (db.reply.reply_author == auth.user.email) & (db.reply.id == reply_id),
        reply_content=new_reply_content
    )
    return "ok"

# Course functions

@auth.requires_signature()
def add_class():
    class_code = db.course.insert(
        course_title=request.vars.course_title,
        course_code=request.vars.course_code,
    )

    return response.json(dict(class_code=class_code))


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

