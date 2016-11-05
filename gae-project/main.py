import email
import os

from google.appengine.api import users
from google.appengine.ext import ndb
import jinja2
import webapp2

from handlers import base_handlers
from models import Route, Notification
import utils


# Jinja environment instance necessary to use Jinja templates.
def __init_jinja_env():
    jenv = jinja2.Environment(
        loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
        extensions=["jinja2.ext.do", "jinja2.ext.loopcontrols", "jinja2.ext.with_"],
        autoescape=True)
    # Example of a Jinja filter (useful for formatting data sometimes)
    #   jenv.filters["time_and_date_format"] = date_utils.time_and_date_format
    return jenv


jinja_env = __init_jinja_env()


class MainHandler(base_handlers.BasePage):
    def update_values(self, values):
        pass

    def get_template(self):
        return jinja_env.get_template("templates/base_page.html")


class HomeHandler(base_handlers.BasePage):
    def update_values(self, values):
        pass

    def get_template(self):
        return jinja_env.get_template("templates/home.html")


class LoginPage(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()

        template = jinja_env.get_template("templates/login.html")
        values = {"login_url": users.create_login_url("/")}
        self.response.out.write(template.render(values))


class CreateRouteAction(webapp2.RequestHandler):
    def post(self):
        if self.request.get('entity_key'):
            route_key = ndb.Key(urlsafe=self.request.get('entity_key'))
            route = route_key.get();

            # Update Route Info
            route.name = self.request.get('name')
            route.type = self.request.get('saved')
            route.daily = self.request.get('daily')
            route.put();
        else:
            user = users.get_current_user()
            email = user.email().lower()
            # TODO: Name will change when modal has dynamic number of routes
            # NOTE: Created routes start with type = 0 (not saved)
            # NOTE: Created routes start with daily = 0 (non-recurring)
            new_route = Route(parent=utils.get_parent_key_for_email(email),
                              created_by=user,
                              name=self.request.get('stop1') + "to" + self.request.get('stop3'),
                              type=0,
                              daily=0,
                              last_touch_date_time=ndb.DateTimeProperty())
        self.redirect(self.request.referrer)


class ShareRouteAction(webapp2.RequestHandler):
    def post(self):
        if self.request.get('entity_key'):
            notification = ndb.Key(urlsafe=self.request.get('entity_key'))
            notification = notification.get();

            # Update Route Info
            notification.name = self.request.get('time')
            notification.type = self.request.get('type')
            notification.daily = self.request.get('message')
            notification.put();
        else:
            user = users.get_current_user()
            email = user.email().lower()
            # NOTE: Created notifications start with type = 0 (email)
            notification = Notification(parent=utils.get_parent_key_for_email(email),
                                        creator=user,
                                        receiver=self.request.get('receiver'),
                                        time=self.request.get('time'),
                                        type=0,
                                        message=self.request.get('message'))
        self.redirect(self.request.referrer)


app = webapp2.WSGIApplication([
    ('/login', LoginPage),
    ('/', HomeHandler),
    ('/edit-route', CreateRouteAction),
    ('/share', ShareRouteAction)

], debug=True)
