from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Simple test to verify Pokemon API is working
        test_data = {
            'debug': True,
            'message': 'Pokemon API debug endpoint working',
            'available_pokemon': ['bulbasaur', 'charmander', 'squirtle', 'eevee'],
            'test_urls': {
                'bulbasaur': '/api/pokemon/bulbasaur',
                'charmander': '/api/pokemon/charmander', 
                'squirtle': '/api/pokemon/squirtle',
                'eevee': '/api/pokemon/eevee'
            }
        }
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(test_data).encode())