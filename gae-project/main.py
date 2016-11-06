from datetime import date
import datetime
import email
import os

from google.appengine.api import users
from google.appengine.ext import ndb
import jinja2
import webapp2

from handlers import base_handlers
from models import Route, Notification, Stop
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
        values["user_email"] = users.get_current_user().email().lower()
        url_route_key = self.request.get('route')
        if url_route_key != "":
            route_key = ndb.Key(urlsafe=url_route_key)
            #Next two lines are so that the recent routes list populates correctly.
            route = route_key.get()
            route.put()
            stops_query = Stop.query(ancestor=route_key).order(Stop.order_number).fetch()
            stop1 = stops_query[0].stop_name
            values["stop1"] = stop1
            if(len(stops_query) > 1):
                stop2 = stops_query[1].stop_name
                values["stop2"] = stop2
            if(len(stops_query) > 2):
                stop3 = stops_query[2].stop_name
                values["stop3"] = stop3
            if(len(stops_query) > 3):
                stop4 = stops_query[3].stop_name
                values["stop4"] = stop4
            if(len(stops_query) > 4):
                stop5 = stops_query[4].stop_name
                values["stop5"] = stop5
            values["entity_key"] = url_route_key
        else:
            route_key = ""
        recent_routes_query = Route.query(ancestor=utils.get_parent_key_for_email(users.get_current_user().email())).order(-Route.last_touch_date_time)
        values["recent_routes"] = recent_routes_query.fetch(5)
        values["temp"]="Bob"
        
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
            firstStop = self.request.get('stop1')
            lastStop = self.request.get('stop2')
            secondStop = lastStop
            thirdStop = ""
            fourthStop = ""
            fifthStop = ""
            
            if self.request.get('stop3'):
                lastStop = self.request.get('stop3')
                thirdStop = lastStop
                
            if self.request.get('stop4'):
                lastStop = self.request.get('stop4')
                fourthStop = lastStop

            if self.request.get('stop5'):
                lastStop = self.request.get('stop5')
                fifthStop = lastStop

            user = users.get_current_user()
            email = user.email().lower()
            # TODO: Name will change when modal has dynamic number of routes
            # NOTE: Created routes start with type = 0 (not saved)
            # NOTE: Created routes start with daily = 0 (non-recurring)
            new_route = Route(parent=utils.get_parent_key_for_email(email),
                                   created_by = email,
                                   name = firstStop + " to " + lastStop,
                                   type = 0,                                
                                   daily = 0,
                                   start_time = datetime.datetime.now())
            new_route.put()
            
            
            
            new_stop1 = Stop(parent=new_route.key,
                             route_key = new_route.key,
                             order_number = 1,
                             stop_name = self.request.get('stop1'))
            new_stop1.put()
            new_stop2 = Stop(parent=new_route.key,
                             route_key = new_route.key,
                             order_number = 2,
                             stop_name = self.request.get('stop2'))
            new_stop2.put()
            if thirdStop != "":
                new_stop3 = Stop(parent=new_route.key,
                                 route_key = new_route.key,
                                 order_number = 3,
                                 stop_name = self.request.get('stop3'))
                new_stop3.put()
            if fourthStop != "":
                new_stop4 = Stop(parent=new_route.key,
                                 route_key = new_route.key,
                                 order_number = 4,
                                 stop_name = self.request.get('stop4'))
                new_stop4.put()
            if fifthStop != "":
                new_stop5 = Stop(parent=new_route.key,
                                 route_key = new_route.key,
                                 order_number = 5,
                                 stop_name = self.request.get('stop5'))
                new_stop5.put()


        self.redirect('/'.join(self.request.referer.split("/")[:3]) + "?route=" + str(new_route.key.urlsafe()))
        
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

class SaveRouteAction(webapp2.RequestHandler):
    def post(self):
        if self.request.get('save_entity_key'):
            route_key = ndb.Key(urlsafe=self.request.get('save_entity_key'))
            route = route_key.get()
            route.name = self.request.get('name')
            route.type = 1
            route.put()
            
            
        
        self.redirect('/'.join(self.request.referer.split("/")[:3]) + "?route=" + str(route.key.urlsafe()))

app = webapp2.WSGIApplication([
    ('/login', LoginPage),
    ('/', HomeHandler),
    ('/edit-route', CreateRouteAction),
    ('/share', ShareRouteAction),
    ('/save', SaveRouteAction)

], debug=True)
