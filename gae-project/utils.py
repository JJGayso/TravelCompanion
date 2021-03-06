import logging

from google.appengine.ext import ndb

def get_parent_key_for_email(email):
    """ Gets the parent key (the key that is the parent to all Datastore data for this user) from the user's email. """
    return ndb.Key("Entity", email.lower())

def get_parent_key(user):
    return get_parent_key_for_email(user.email())
