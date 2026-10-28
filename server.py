#!/usr/bin/env python3
"""
SmartCanteen AI - Local Development HTTP Server
Serves the web application on an available local port with CORS headers.
"""
import http.server
import socketserver
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def run_server(port=PORT):
    for p in range(port, port + 20):
        try:
            with socketserver.TCPServer(("", p), Handler) as httpd:
                print(f"=======================================================")
                print(f"🚀 SmartCanteen AI Web App is running!")
                print(f"👉 Local URL: http://localhost:{p}")
                print(f"📂 Serving directory: {DIRECTORY}")
                print(f"Press Ctrl+C to stop the server.")
                print(f"=======================================================")
                httpd.serve_forever()
        except OSError:
            continue

if __name__ == "__main__":
    port_arg = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    try:
        run_server(port_arg)
    except KeyboardInterrupt:
        print("\nStopping SmartCanteen AI Server...")
