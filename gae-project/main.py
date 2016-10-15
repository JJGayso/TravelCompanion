import os

import jinja2
import webapp2

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
        
        template = jinja_env.get_template("templates/base_page.html")
        values = {"sampleMap": "Visit '/sampleMap' to view a Sample Map",
                  "sampleDirections": "Visit '/sampleRoute' to view a Sample Route"}
        self.response.out.write(template.render(values))

class SampleMapHandler(webapp2.RequestHandler):
    def get(self):
        template = jinja_env.get_template("templates/sample_map.html")
        self.response.out.write(template.render())

class SampleRouteHandler(webapp2.RequestHandler):
    def get(self):
        template = jinja_env.get_template("templates/sample_route_map.html")
        self.response.out.write(template.render())
        
app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/sampleMap', SampleMapHandler),
    ('/sampleRoute', SampleRouteHandler),
    
], debug=True)
