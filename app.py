from datetime import datetime, date
from json import dumps

from bson import ObjectId
from flask import Flask, make_response, send_file

from dotenv import load_dotenv
import os

from flask import request
from flask_pymongo import pymongo
from gridfs import GridFS

load_dotenv()

MONGO_DB_URL = "mongodb+srv://{}:{}@cluster0-prcpb.mongodb.net/test?retryWrites=true&w=majority" \
    .format(os.getenv("MONGO_USER"), os.getenv("MONGO_PASSWORD"))

app = Flask(__name__)

mongo_client = pymongo.MongoClient(MONGO_DB_URL)
posts_db = mongo_client.get_database('posts_db')
posts = posts_db.get_collection('posts')
posts_img = GridFS(posts_db)

headers = {"Content-Type": "application/json"}

# posts.createIndex({'location': "2dsphere"})

'''
todo add documentation to all methods
Every post shall have 

# Title (title) [string][required]
# Date Created [date format string]
# Coords [required][not implemented] [float][float]
# Image(s) [array][required] - NOTE: PLEASE UPLOAD JPEG IMAGES ONLY FOR NOW
# No. ratings (scale of 0 - 1) (rating_ct) [int]
# Avg. rating (rating) [float]

(extra)
# post creator id [id]
# comments (by users) 

(Theoretical) Every use shall have
# Username
# Posts Created
# Posts added to
# Posts rated / liked?
--- more to be added
'''


@app.route('/')
def index():
    return "Welcome to the PictureThis API"


@app.route('/post/<post_id>', methods=['GET'])
def get_post(post_id):
    try:
        post = posts.find_one({'_id': ObjectId(post_id)})
        return dumps(post)
    except:
        return not_found()


@app.route('/post/search_nearby/<float:lat>&<float:lon>', methods=['GET'])
def search_posts(lat, lon):
    # TODO do geo-spatial query here
    return


@app.route('/post/create/', methods=['POST'])
def create_post():
    if 'multipart/form-data' not in request.content_type:
        return make_response('request must be made in multipart/form-data format; received {}'
                             .format(request.content_type),
                             500,
                             headers)

    if 'title' not in request.form or \
            'lat' not in request.form or \
            'lon' not in request.form or \
            'attraction_img' not in request.files:
        return make_response('request does not have required fields (title, lat, lon, attraction_img)', 500, headers)

    title = request.form['title']
    lat = request.form['lat']
    lon = request.form['lon']

    attraction_img_id = upload_attraction_img(request.files['attraction_img'])

    try:
        entry_id = posts.insert_one({'title': title,
                                     'date_created': datetime.timestamp(datetime.now()),
                                     'rating': 0,
                                     'rating_ct': 0,
                                     'location': {
                                        'type': 'Point',
                                        'coordinates': [lat, lon]
                                     },
                                     'imgs': [attraction_img_id]})
        return make_response('successfully created post {}'.format(entry_id.inserted_id), 200, headers)
    except:
        return make_response('failed creating post', 500, headers)


@app.route('/post/add_rating/<post_id>', methods=['PUT'])
def update_post_rating(post_id):
    if 'application/json' not in request.content_type:
        return make_response('request must be made in json format; received {}'
                             .format(request.content_type),
                             500,
                             headers)

    if 'attraction_img' not in request.form:
        return make_response('request does not have required fields (rating)', 500, headers)

    sent_rating = request.json['rating']

    try:
        post = posts.find_one({'_id': ObjectId(post_id)})

        existing_rating = float(post['rating'])
        old_rating_ct = float(post['rating_ct'])

        # naive average only
        new_rating = (old_rating_ct * existing_rating + sent_rating) / (old_rating_ct + 1)

        posts.update_one(
            {'_id': ObjectId(post_id)},
            {'$set': {'rating_ct': old_rating_ct + 1, 'rating': new_rating}}
        )

        return make_response('post {} updated successfully'.format(post_id), 200, headers)
    except:
        not_found()


@app.route('/post/add_img/<post_id>', methods=['PUT'])
def add_post_image(post_id):
    if 'multipart/form-data' not in request.content_type:
        return make_response('request must be made in multipart/form-data format; received {}'
                             .format(request.content_type),
                             500,
                             headers)

    if 'attraction_img' not in request.files:
        return make_response('request does not have required fields (attraction_img)', 500, headers)

    attraction_img_id = upload_attraction_img(request.files['attraction_img'])

    try:
        post = posts.find_one({'_id': ObjectId(post_id)})

        exisiting_imgs = post['imgs']
        exisiting_imgs.append(attraction_img_id)

        posts.update_one(
            {'_id': ObjectId(post_id)},
            {'$set': {'imgs': exisiting_imgs}}
        )

        return make_response('post {} updated successfully'.format(post_id), 200, headers)
    except:
        not_found()


@app.route('/post/delete/<post_id>', methods=['DELETE'])
def delete_user(post_id):
    try:
        posts.delete_one({'_id': ObjectId(post_id)})
        return make_response('post deleted successfully', 200, headers)
    except:
        return not_found()


@app.route('/post/get_attraction_img/<img_id>', methods=['GET'])
def get_img(img_id):

    try:
        attraction_img = posts_img.find_one({'_id': ObjectId(img_id)})
    except:
        return not_found()

    response = make_response(attraction_img.read())
    response.headers['Content-Type'] = 'image/jpeg'
    response.headers["Content-Disposition"] = "attachment; filename={}".format(attraction_img.filename)
    return response


def upload_attraction_img(attraction_img):
    attraction_img_name = "attraction_{}".format(date.today())  # image_hash.average_hash(attraction_img)

    attraction_img_id = posts_img.put(attraction_img,
                                      content_type=attraction_img.content_type,
                                      filename=attraction_img_name)

    return attraction_img_id


@app.errorhandler(404)
def not_found(error=None):
    return make_response('Request not found {}'.format(request.url), 404, headers)


if __name__ == '__main__':
    app.run()