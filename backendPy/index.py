# przed uruchomieniem nalezy wlaczyc virtual enviroment
# komenda flask/Script/activate !!!

from flask import Flask, request, make_response

app = Flask(__name__)

@app.route('/', methods=['POST', 'GET'])
def index():
    return "yes"

if __name__ == '__main__':  
    app.run(debug=True)