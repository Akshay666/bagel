import json
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer

import fetch

class Handler(BaseHTTPRequestHandler):
	def _set_headers(self):
		self.send_response(200)
		self.send_header('Content-type', 'text/html')
		self.end_headers()

	def do_GET(self):
		data = fetch.fetch()

		self._set_headers()
		self.wfile.write(json.dumps(data))

	def do_HEAD(self):
		self._set_headers()
		
	def do_POST(self):
		# Doesn't do anything with posted data
		self._set_headers()
		self.wfile.write("<html><body><h1>POST!</h1></body></html>")
		
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

