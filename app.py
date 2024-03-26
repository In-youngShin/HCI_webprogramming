# Python file for Flask 
import os

from flask import Flask, render_template, request, session, jsonify
import random

# Configure application
app = Flask(__name__)
app._static_folder = os.path.abspath("static/")
app.secret_key = 'your_secret_key'


# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.route("/")
def index():
      session.clear()
      return render_template("questions.html")

# @app.route("/instructions")
# def instructions():
#       return render_template("instructions.html")

# @app.route("/pause")
# def pause():
#       return render_template("pause.html")

# @app.route("/questions")
# def questions():
#       return render_template("questions.html")

@app.route("/results", methods=["GET", "POST"])
def results():
    # get selection from URL parameter
    selection = request.args.get('selection').split(',')
    selection = [int(x) for x in selection]
    option = [0, 1, 2]
    index = random.randint(0, 2)

    # Parse selection to determine fan type
    numA = selection.count(0)
    numB = selection.count(1)
    numC = selection.count(2)
    if numA >= numB and numA >= numC:
        fantype = "instrumental music" ##'0'
    elif numB >= numC and numB >= numA:
        fantype = "pop music" ##'1'
    elif numC >= numA and numC >= numB:
        fantype = "hard rock" ##2
    else:
        fantype = option[index]

    ##matbe use session, session
    fans = session.get('fans', [])
    fans.append(fantype)
    session['fans'] = fans 

    counter = fans.count(fantype)

    returnval = ["You are a " + fantype + " fan!", str(counter) + " of AKWers are " + fantype + " fans like you!"]

    return jsonify(returnval)


"""
def errorhandler(e):
    # handle errors
    if not isinstance(e, HTTPException):
        e = InternalServerError()
    return error(e.name, e.code)

# Listen for errors
for code in default_exceptions:
    app.errorhandler(code)(errorhandler)
 """
if __name__ == '__main__':
    app.run(host="0.0.0.0", port="9999")
   