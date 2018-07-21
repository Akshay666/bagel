import json
import urlparse
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer

import fetch
data = fetch.fetch()

class Handler(BaseHTTPRequestHandler):
	def _set_headers(self):
		self.send_response(200)
		self.send_header('Content-type', 'text/html')
		self.end_headers()

	def parse_path(self, path):
		if '?' in path:
			p, q = path.split('?')[:2]
			return p, urlparse.parse_qs(q, keep_blank_values=True)
		else:
			return path, {}

	def process_request(self, request):
		path, query = self.parse_path(request)
		print("path: {}, query: {}".format(path, query))

		if path == '/full_data_raw':
			return json.dumps(data)
		else:
			return 'unknown query'

	def do_GET(self):
		self._set_headers()

		self.wfile.write(self.process_request(self.path))

	def do_HEAD(self):
		self._set_headers()

	def do_POST(self):
		# Doesn't do anything with posted data
		self._set_headers()
		self.wfile.write("please use GET requests")

def run(server_class=HTTPServer, handler_class=Handler, port=80):
	server_address = ('', port)
	server = server_class(server_address, handler_class)
	print('serving')
	server.serve_forever()

if __name__ == "__main__":
	from sys import argv

	if len(argv) == 2:
		run(port=int(argv[1]))
	else:
		run(port=8080)

