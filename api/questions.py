from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        questions = [
            {
                "id": 1,
                "question": "What's your ideal way to spend a weekend?",
                "options": {
                    "A": {"text": "Reading a good book or learning something new", "pokemon": "bulbasaur", "weight": 3},
                    "B": {"text": "Going on an adventure or trying extreme sports", "pokemon": "charmander", "weight": 3},
                    "C": {"text": "Spending quality time with friends and family", "pokemon": "squirtle", "weight": 3},
                    "D": {"text": "Exploring new places or trying new experiences", "pokemon": "eevee", "weight": 3}
                }
            },
            {
                "id": 2,
                "question": "How do you approach challenges?",
                "options": {
                    "A": {"text": "Think it through carefully and plan methodically", "pokemon": "bulbasaur", "weight": 3},
                    "B": {"text": "Face it head-on with determination and energy", "pokemon": "charmander", "weight": 3},
                    "C": {"text": "Work with others and seek support when needed", "pokemon": "squirtle", "weight": 3},
                    "D": {"text": "Adapt and find creative solutions", "pokemon": "eevee", "weight": 3}
                }
            },
            {
                "id": 3,
                "question": "What motivates you most?",
                "options": {
                    "A": {"text": "Knowledge and understanding", "pokemon": "bulbasaur", "weight": 3},
                    "B": {"text": "Achievement and recognition", "pokemon": "charmander", "weight": 3},
                    "C": {"text": "Helping others and building relationships", "pokemon": "squirtle", "weight": 3},
                    "D": {"text": "Freedom and new possibilities", "pokemon": "eevee", "weight": 3}
                }
            },
            {
                "id": 4,
                "question": "What do you value most in life?",
                "options": {
                    "A": {"text": "Wisdom and continuous growth", "pokemon": "bulbasaur", "weight": 3},
                    "B": {"text": "Achieving personal goals and mastering skills", "pokemon": "charmander", "weight": 3},
                    "C": {"text": "Making positive connections and helping others succeed", "pokemon": "squirtle", "weight": 3},
                    "D": {"text": "Exploring possibilities and creating something new", "pokemon": "eevee", "weight": 3}
                }
            },
            {
                "id": 5,
                "question": "How do you handle stress?",
                "options": {
                    "A": {"text": "Step back, analyze the situation, and plan methodically", "pokemon": "bulbasaur", "weight": 3},
                    "B": {"text": "Channel it into action and tackle problems directly", "pokemon": "charmander", "weight": 3},
                    "C": {"text": "Talk to friends or family for support and perspective", "pokemon": "squirtle", "weight": 3},
                    "D": {"text": "Look for new approaches or change the environment", "pokemon": "eevee", "weight": 3}
                }
            },
            {
                "id": 6,
                "question": "What's your communication style?",
                "options": {
                    "A": {"text": "Thoughtful and precise, I think before I speak", "pokemon": "bulbasaur", "weight": 3},
                    "B": {"text": "Direct and passionate, I speak with conviction", "pokemon": "charmander", "weight": 3},
                    "C": {"text": "Warm and supportive, I focus on understanding others", "pokemon": "squirtle", "weight": 3},
                    "D": {"text": "Flexible and curious, I adapt to the conversation", "pokemon": "eevee", "weight": 3}
                }
            },
            {
                "id": 7,
                "question": "How do you make decisions?",
                "options": {
                    "A": {"text": "Research thoroughly and weigh all options carefully", "pokemon": "bulbasaur", "weight": 3},
                    "B": {"text": "Trust my instincts and act quickly", "pokemon": "charmander", "weight": 3},
                    "C": {"text": "Consider how it affects others and seek input", "pokemon": "squirtle", "weight": 3},
                    "D": {"text": "Keep options open and be ready to pivot", "pokemon": "eevee", "weight": 3}
                }
            },
            {
                "id": 8,
                "question": "What's your ideal work environment?",
                "options": {
                    "A": {"text": "Quiet, organized space where I can focus deeply", "pokemon": "bulbasaur", "weight": 3},
                    "B": {"text": "Dynamic, competitive environment with clear goals", "pokemon": "charmander", "weight": 3},
                    "C": {"text": "Collaborative space with supportive team members", "pokemon": "squirtle", "weight": 3},
                    "D": {"text": "Flexible environment with variety and autonomy", "pokemon": "eevee", "weight": 3}
                }
            },
            {
                "id": 9,
                "question": "How do you handle change?",
                "options": {
                    "A": {"text": "I prefer stability but adapt when necessary with planning", "pokemon": "bulbasaur", "weight": 3},
                    "B": {"text": "I embrace challenges and see change as opportunity", "pokemon": "charmander", "weight": 3},
                    "C": {"text": "I adjust better with support from others", "pokemon": "squirtle", "weight": 3},
                    "D": {"text": "I thrive on change and see it as natural evolution", "pokemon": "eevee", "weight": 3}
                }
            },
            {
                "id": 10,
                "question": "What describes your approach to relationships?",
                "options": {
                    "A": {"text": "I form deep, meaningful connections with a few close people", "pokemon": "bulbasaur", "weight": 3},
                    "B": {"text": "I'm loyal and protective of those I care about", "pokemon": "charmander", "weight": 3},
                    "C": {"text": "I'm naturally nurturing and love bringing people together", "pokemon": "squirtle", "weight": 3},
                    "D": {"text": "I connect with diverse people and adapt to different personalities", "pokemon": "eevee", "weight": 3}
                }
            }
        ]
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(questions).encode())