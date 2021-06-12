# zainstaluj na pipei:
# 	flask
#	pymongo

from flask import Flask, request, make_response
import pandas as pd
from surprise import Dataset, Reader, KNNWithMeans
import json
# import endpoints.testing as testing

app = Flask(__name__)

# @app.route('/test', methods=['POST', 'GET'])
# def index():
#     return testing.test()

@app.route('/recommendbooks', methods=['POST'])
def reccomend_books():
	content = request.get_json()
	user = content["user"]
	book = content["book"]

	# Formatuj dane o ocenach użytkowników
	data = {
		"item": [],
		"user": [],
		"rating": [],
	}

	df = pd.DataFrame(data)
	reader = Reader(rating_scale=(1, 5))

if __name__ == '__main__':  
	app.run(debug=True)