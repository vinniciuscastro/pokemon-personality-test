from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        answers = data.get('answers', {})
        
        # Calculate scores
        scores = {
            'bulbasaur': 0,
            'charmander': 0,
            'squirtle': 0,
            'eevee': 0
        }
        
        # Count votes for each Pokemon based on answers
        for answer in answers.values():
            if answer.upper() == 'A':
                scores['bulbasaur'] += 1
            elif answer.upper() == 'B':
                scores['charmander'] += 1
            elif answer.upper() == 'C':
                scores['squirtle'] += 1
            elif answer.upper() == 'D':
                scores['eevee'] += 1
        
        # Find the Pokemon with the highest score
        result_pokemon = max(scores, key=scores.get)
        
        # Calculate percentages
        total_questions = len(answers)
        percentages = {}
        if total_questions > 0:
            for pokemon, score in scores.items():
                percentages[pokemon] = (score / total_questions) * 100
        else:
            percentages = {pokemon: 0 for pokemon in scores}
        
        result = {
            'result_pokemon': result_pokemon,
            'scores': scores,
            'percentages': percentages
        }
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()