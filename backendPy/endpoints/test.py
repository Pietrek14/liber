from flask import Flask, request, make_response, jsonify


def test():
	content = request.get_json()
	name = content['name']
	# return 'Hello ' + name
	print(type(content))
	return content