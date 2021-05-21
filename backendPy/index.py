# przed uruchomieniem nalezy wlaczyc virtual enviroment
# komenda env/Script/activate !!!

from flask import Flask, request, make_response
import endpoints.testing as testing

app = Flask(__name__)

@app.route('/test', methods=['POST', 'GET'])
def index():
    return testing.test()

if __name__ == '__main__':  
    app.run(debug=True)