# REST API for file browser
from flask import Flask, escape, request, jsonify
import os
import json
from file_type import FileType


app = Flask(__name__)

def get_root_dir_from_config():
	config = None
	with open("config.json", 'r') as read_file:
		config = json.load(read_file)
	return config["root"]

def determine_entry_type(entry):
	if entry.is_dir():
		return FileType.DIRECTORY.name
	elif entry.is_file():
		return FileType.FILE.name
	elif entry.is_symlink():
		return FileType.SYMLINK.name
	else:
		return FileType.UNKNOWN.name

def get_entries_by_path(root_dir, child_dir, origin):
	entries = os.scandir(root_dir + "\\" + child_dir)
	response = []
	for entry in entries:
		dir_entry = {
			"name": entry.name,
			"type": determine_entry_type(entry) 
		}
		response.append(dir_entry)
	response_json = jsonify(response) 
	response_json.headers.add('Access-Control-Allow-Origin', origin)
	return response_json, 200

def get_error_response(message, error, code, origin):
	response = jsonify({
			"message": message,
			"exception": str(type(error)),
			"cause": f'{escape(str(error))}'
		})
	response.headers.add('Access-Control-Allow-Origin', origin)
	return response, code

@app.route('/')
def directories():
	root_dir = get_root_dir_from_config()
	child_dir = request.args.get("path", "/")
	origin = request.headers.get("origin")
	try:
		return get_entries_by_path(root_dir, child_dir, origin)
	except NotADirectoryError as error:
		return get_error_response(
			f'{escape(child_dir)} is not a directory',
			error,
			400,
			origin
		)
	except FileNotFoundError as error:
		return get_error_response(
			f'Directory {escape(child_dir)} not found',
			error,
			400,
			origin
		)
	except PermissionError as error:
		return get_error_response(
				f'You have no rights to access {escape(child_dir)}',
				error,
				403,
				origin
			)