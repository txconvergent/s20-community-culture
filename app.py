from json import dumps

from bson import ObjectId
from flask import Flask, make_response

from dotenv import load_dotenv
import os

from flask import request
from flask_pymongo import pymongo

load_dotenv()

MONGO_DB_URL = "mongodb+srv://{}:{}@cluster0-prcpb.mongodb.net/test?retryWrites=true&w=majority" \
    .format(os.getenv("MONGO_USER"), os.getenv("MONGO_PASSWORD"))

app = Flask(__name__)

mongo_client = pymongo.MongoClient(MONGO_DB_URL)
posts_db = mongo_client.get_database('posts_db')
posts = posts_db.get_collection('posts')

headers = {"Content-Type": "application/json"}

'''
Every post shall have 

# Title (title) [string][required]
# Image(s) [array][required][not implemented]
# No. ratings (scale of 0 - 1) (rating_ct) [int][not implemented]
# Avg. rating (rating) [float][not implemented]

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


@app.route('/post/<post_id>')
def get_user(post_id):
    try:
        post = posts.find_one({'_id': ObjectId(post_id)})
        return dumps(post)
    except:
        return not_found()


@app.route('/post/create/', methods=['POST'])
def create_post():
    received = request.json

    try:
        title = received['title']
    except:
        return make_response('request does not have required fields (title)', 500, headers)

    try:
        entry_id = posts.insert_one({'title': title, 'rating': 0, 'rating_ct': 0})
        return make_response('successfully created post {}'.format(entry_id.inserted_id), 200, headers)
    except:
        return make_response('failed creating post', 500, headers)


@app.route('/post/add_rating/<post_id>', methods=['PUT'])
def update_post(post_id):
    received = request.json

    try:
        new_rating = received['rating']
    except:
        return make_response('request does not have required fields (rating)', 500, headers)

    try:
        post = posts.find_one({'_id': ObjectId(post_id)})

        existing_rating = post['rating']
        old_rating_ct = post['rating_ct']

        # naive average only
        new_rating = (old_rating_ct * existing_rating + new_rating) / (old_rating_ct + 1)

        mongo_client.db.users.update_one(
            {'_id': ObjectId(post_id)},
            {'$set': {'rating_ct': old_rating_ct + 1, 'rating': new_rating}}
        )

        return make_response('post {} updated successfully'.format(post_id), 200, headers)
    except:
        not_found()


@app.route('/post/delete/<post_id>', methods=['DELETE'])
def delete_user(post_id):
    try:
        mongo_client.db.users.delete_one({'_id': ObjectId(post_id)})
        return make_response('post deleted successfully', 200, headers)
    except:
        return not_found()


@app.errorhandler(404)
def not_found(error=None):
    return make_response('Request not found {}'.format(request.url), 404, headers)


if __name__ == '__main__':
    app.run()
