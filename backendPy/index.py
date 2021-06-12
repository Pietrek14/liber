# zainstaluj na pipei:
# 	flask
#	pymongo
#	dnspython
#	pandas
#	surprise
#	bson (chyba)
#	numpy

from flask import Flask, request, make_response, abort
import pandas as pd
from surprise import Dataset, Reader, KNNWithMeans
import pymongo
from bson.objectid import ObjectId
import numpy as np
from datetime import datetime
import json
# import endpoints.testing as testing

app = Flask(__name__)

client = pymongo.MongoClient("mongodb+srv://admin:admin@liber.4efko.mongodb.net/liber?retryWrites=true&w=majority", 27017)
db = client.liber

# @app.route('/test', methods=['POST', 'GET'])
# def index():
#     return testing.test()

def averageRating(book):
	users = db.readers.find({})

	ratings = 0
	quantity = 0

	for user in users:
		for rating in user["ratings"]:
			if rating["book"] == book:
				ratings += rating["rating"]
				quantity += 1
	
	if quantity > 0:
		return ratings / quantity, quantity

	return 0, quantity

@app.route('/recommendbooks', methods=['POST'])
def reccomend_books():
	content = request.get_json()

	if "user" not in content:
		return json.dumps({"message": "Nie podano użytkownika"}), 400

	if not ObjectId.is_valid(content["user"]):
		return json.dumps({"message": "Podano niepoprawnego użytkownika"}), 400

	user = db.readers.find_one({"_id": ObjectId(content["user"])})
	users = db.readers.find({})
	books = np.array(list(db.books.find({})))
	points = np.zeros(len(books))

	data_items = []
	data_users = []
	data_ratings = []

	tags_data_items = []
	tags_data_users = []
	tags_data_ratings = []

	author_data_items = []
	author_data_users = []
	author_data_ratings = []

	for user in users:
		for rating in user["ratings"]:
			data_items.append(rating["book"])
			data_users.append(str(user["_id"]))
			data_ratings.append(str(rating["rating"]))

	for user in users:
		for rating in user["ratings"]:
			book = db.books.findOne({"_id": rating["book"]})
			for tag in book.tags:
				tags_data_items.append(tag)
				tags_data_users.append(str(user["_id"]))
				tags_data_ratings.append(rating["rating"])
			author_data_items.append(book["author"])
			author_data_users.append(str(user["_id"]))
			author_data_users.append(rating["rating"])

	# Formatuj dane o ocenach użytkowników
	data = {
		"item": data_items,
		"user": data_users,
		"rating": data_ratings,
	}

	tags_data = {
		"item": tags_data_items,
		"user": tags_data_users,
		"rating": tags_data_ratings,
	}

	author_data = {
		"item": author_data_items,
		"user": author_data_users,
		"rating": author_data_ratings,
	}

	df = pd.DataFrame(data)
	tags_df = pd.DataFrame(tags_data)
	author_df = pd.DataFrame(author_data)

	# Wytrenuj algorytm

	reader = Reader(rating_scale=(1, 5))

	data = Dataset.load_from_df(df[["user", "item", "rating"]], reader)
	tags_data = Dataset.load_from_df(tags_df[["user", "item", "rating"]], reader)
	author_data = Dataset.load_from_df(author_df[["user", "item", "rating"]], reader)

	sim_options = {
		"name": "cosine",
		"user_based": True,  # Compute  similarities between items
	}

	algo = KNNWithMeans(sim_options=sim_options)
	tags_algo = KNNWithMeans(sim_options=sim_options)
	author_algo = KNNWithMeans(sim_options=sim_options)

	trainingSet = data.build_full_trainset()
	tags_trainingSet = tags_data.build_full_trainset()
	author_trainingSet = author_data.build_full_trainset()

	algo.fit(trainingSet)
	tags_algo.fit(tags_trainingSet)
	author_algo.fit(author_trainingSet)

	# Przydziel punkty

	for index, book in enumerate(books):
		# Na podstawie AI
		book_prediciton = algo.predict(user["_id"], book["_id"])
		points[index] += book_prediciton.est * 1000

		for tag in book["tags"]:
			points[index] += tags_algo.predict(user["_id"], tag).est * 250

		points[index] += author_algo.predict(user["_id"], book["author"]).est * 500

		# Staraj się nie pokazywać książek już przeczytanych przez czytelnika
		if book in user["readBooks"]:
			points[index] -= 7000
		else:
			# Jeśli użytkownik ocenił książkę to prawdopodobnie już ją czytał
			for rating in user["ratings"]:
				if rating["book"] == str(book["_id"]):
					points[index] -= 6000

		# Preferuj książki niedawno dodane do biblioteki
		points[index] -= (datetime.now() - book["addDate"]).total_seconds() * 0.0002

		# Dodaj punkty na podstawie średniej oceny książki
		average_rating, ratingQuantity = averageRating(book["_id"])

		if ratingQuantity > 0:
			points[index] += averageRating(book["_id"]) * 2000
		else:
			points[index] += 1000

	# Posortuj książki na podstawie punktów
	sorted_books = [str(book["_id"]) for _, book in sorted(zip(points, books), key=lambda pair: pair[0])]	# https://stackoverflow.com/questions/6618515/sorting-list-based-on-values-from-another-list

	# Zwróć pierwsze 150 książek
	return json.dumps(sorted_books[:150])

if __name__ == '__main__':  
	app.run(debug=True)