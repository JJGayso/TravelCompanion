import os

from google.appengine.api import users
import jinja2
import webapp2
import email


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


class MainHandler(webapp2.RequestHandler):
    def get(self):
        # A basic template could just send text out the response stream, but we use Jinja
        # self.response.write("Hello world!")
        user = users.get_current_user()
        template = jinja_env.get_template("templates/base_page.html")
        if user:
            email = user.email().lower()
            values = {"user_email": email, "logout_url": users.create_logout_url('/login')}
        else:
            self.redirect('/login')
            return
        self.response.out.write(template.render(values))

class HomeHandler(webapp2.RequestHandler):
    def get(self):
        template = jinja_env.get_template("templates/home.html")
        self.response.out.write(template.render())
        
class LoginPage(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        
        template = jinja_env.get_template("templates/login.html")
        values = {"login_url": users.create_login_url("/")}
        self.response.out.write(template.render(values))
        
app = webapp2.WSGIApplication([
    ('/login', LoginPage),
    ('/', HomeHandler)
    
], debug=True)
