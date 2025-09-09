from http.server import BaseHTTPRequestHandler
import json
import requests

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Extract pokemon name from the URL
        path_parts = self.path.split('/')
        pokemon_name = path_parts[-1] if len(path_parts) > 0 else ''
        
        # Pokemon data with personality information
        pokemon_data = {
            'bulbasaur': {
                'id': 1,
                'name': 'Bulbasaur',
                'sprites': {
                    'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
                    'official_artwork': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
                },
                'types': ['grass', 'poison'],
                'personality': {
                    'type': 'The Thoughtful Strategist',
                    'traits': ['Analytical', 'Patient', 'Wise', 'Methodical', 'Growth-Oriented'],
                    'color_palette': {
                        'primary': '#78C850',
                        'secondary': '#A7DB8D',
                        'accent': '#68A040'
                    },
                    'evolution_chain': [
                        {'name': 'Bulbasaur', 'level': 'Base Form', 'id': 1},
                        {'name': 'Ivysaur', 'level': 'Level 16', 'id': 2},
                        {'name': 'Venusaur', 'level': 'Level 32', 'id': 3}
                    ],
                    'type_interactions': {
                        'strengths_against': ['Water', 'Ground', 'Rock'],
                        'weaknesses_against': ['Fire', 'Psychic', 'Flying', 'Ice'],
                        'relationships': {
                            'fire_types': 'Learn to be more decisive - your thoughtful nature is valuable, but don\'t let analysis paralysis hold you back',
                            'water_types': 'Your steady growth complements their emotional flow - great partnership potential',
                            'electric_types': 'Balance their quick energy with your grounded wisdom for powerful collaboration'
                        }
                    },
                    'growth_advice': {
                        'strengths': 'You are the wise strategist who thinks before acting. Your methodical approach and love of learning make you excellent at long-term planning and solving complex problems.',
                        'growth_tips': [
                            'Practice making faster decisions - your analysis is valuable but don\'t overthink every choice',
                            'Share your knowledge more openly - others can benefit from your insights',
                            'Set specific growth goals and track your progress regularly',
                            'Learn to act on good enough information rather than waiting for perfect data'
                        ],
                        'potential_blocks': [
                            'Analysis paralysis - overthinking decisions',
                            'Reluctance to take risks or act without complete information',
                            'Tendency to be too critical of yourself and others',
                            'Difficulty adapting when plans don\'t work out'
                        ],
                        'evolution_path': 'Like Bulbasaur evolving into Venusaur, your growth comes from combining your natural wisdom with decisive action. Focus on building confidence in your decisions while maintaining your thoughtful approach.'
                    }
                }
            },
            'charmander': {
                'id': 4,
                'name': 'Charmander',
                'sprites': {
                    'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
                    'official_artwork': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png'
                },
                'types': ['fire'],
                'personality': {
                    'type': 'The Passionate Achiever',
                    'traits': ['Determined', 'Energetic', 'Competitive', 'Leadership-Oriented', 'Goal-Focused'],
                    'color_palette': {
                        'primary': '#F08030',
                        'secondary': '#FFCC99',
                        'accent': '#E8620A'
                    },
                    'evolution_chain': [
                        {'name': 'Charmander', 'level': 'Base Form', 'id': 4},
                        {'name': 'Charmeleon', 'level': 'Level 16', 'id': 5},
                        {'name': 'Charizard', 'level': 'Level 36', 'id': 6}
                    ],
                    'type_interactions': {
                        'strengths_against': ['Grass', 'Ice', 'Bug', 'Steel'],
                        'weaknesses_against': ['Water', 'Ground', 'Rock'],
                        'relationships': {
                            'water_types': 'Learn patience and emotional intelligence from them - balance your fire with their flow',
                            'grass_types': 'Respect their thoughtful approach while sharing your motivational energy',
                            'electric_types': 'Natural allies in high-energy pursuits - great for competitive environments'
                        }
                    },
                    'growth_advice': {
                        'strengths': 'You are the natural leader with boundless energy and determination. Your competitive spirit and goal-focused approach inspire others and drive remarkable achievements.',
                        'growth_tips': [
                            'Practice patience - not every goal needs to be achieved immediately',
                            'Learn to collaborate rather than always leading - others have valuable perspectives',
                            'Develop emotional intelligence to better understand team dynamics',
                            'Set sustainable pace to avoid burnout from your intense drive'
                        ],
                        'potential_blocks': [
                            'Impatience with slower progress or people',
                            'Tendency to take on too much and burn out',
                            'Difficulty accepting failure or setbacks',
                            'May overlook others\' feelings in pursuit of goals'
                        ],
                        'evolution_path': 'Like Charmander\'s flame growing stronger through challenges, your evolution comes from learning to channel your intense energy wisely. True leadership means lifting others up, not just charging ahead.'
                    }
                }
            },
            'squirtle': {
                'id': 7,
                'name': 'Squirtle',
                'sprites': {
                    'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
                    'official_artwork': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png'
                },
                'types': ['water'],
                'personality': {
                    'type': 'The Supportive Collaborator',
                    'traits': ['Empathetic', 'Loyal', 'Team-Oriented', 'Adaptable', 'Nurturing'],
                    'color_palette': {
                        'primary': '#6890F0',
                        'secondary': '#9DB7F5',
                        'accent': '#4F70C2'
                    },
                    'evolution_chain': [
                        {'name': 'Squirtle', 'level': 'Base Form', 'id': 7},
                        {'name': 'Wartortle', 'level': 'Level 16', 'id': 8},
                        {'name': 'Blastoise', 'level': 'Level 36', 'id': 9}
                    ],
                    'type_interactions': {
                        'strengths_against': ['Fire', 'Ground', 'Rock'],
                        'weaknesses_against': ['Grass', 'Electric'],
                        'relationships': {
                            'fire_types': 'Your calming presence balances their intensity - help them develop patience',
                            'grass_types': 'Great learning partnership - they provide structure while you provide emotional support',
                            'electric_types': 'You ground their high energy while they energize your sometimes passive nature'
                        }
                    },
                    'growth_advice': {
                        'strengths': 'You are the heart of any team, with natural ability to understand and support others. Your emotional intelligence and collaborative spirit create harmony and bring out the best in people.',
                        'growth_tips': [
                            'Assert yourself more - your opinions and needs matter too',
                            'Set boundaries to avoid taking on everyone else\'s problems',
                            'Practice making decisions independently before seeking input',
                            'Develop confidence in your own abilities and judgment'
                        ],
                        'potential_blocks': [
                            'Difficulty saying no to others\' requests',
                            'Tendency to avoid conflict even when necessary',
                            'May neglect own needs while caring for others',
                            'Can be indecisive when forced to choose between people\'s needs'
                        ],
                        'evolution_path': 'Like Squirtle\'s protective shell growing stronger, your evolution involves learning to protect your own energy while maintaining your caring nature. True support sometimes means tough love.'
                    }
                }
            },
            'eevee': {
                'id': 133,
                'name': 'Eevee',
                'sprites': {
                    'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png',
                    'official_artwork': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png'
                },
                'types': ['normal'],
                'personality': {
                    'type': 'The Adaptive Explorer',
                    'traits': ['Versatile', 'Curious', 'Open-minded', 'Creative', 'Evolutionary'],
                    'color_palette': {
                        'primary': '#A8A878',
                        'secondary': '#C6C6A7',
                        'accent': '#8A8A59'
                    },
                    'evolution_chain': [
                        {'name': 'Eevee', 'level': 'Base Form', 'id': 133},
                        {'name': 'Vaporeon', 'level': 'Water Stone', 'id': 134},
                        {'name': 'Jolteon', 'level': 'Thunder Stone', 'id': 135},
                        {'name': 'Flareon', 'level': 'Fire Stone', 'id': 136},
                        {'name': 'Espeon', 'level': 'Friendship + Day', 'id': 196},
                        {'name': 'Umbreon', 'level': 'Friendship + Night', 'id': 197},
                        {'name': 'Leafeon', 'level': 'Leaf Stone', 'id': 470},
                        {'name': 'Glaceon', 'level': 'Ice Stone', 'id': 471},
                        {'name': 'Sylveon', 'level': 'Fairy Move + Friendship', 'id': 700}
                    ],
                    'type_interactions': {
                        'strengths_against': ['None - but adaptable to all'],
                        'weaknesses_against': ['Fighting'],
                        'relationships': {
                            'all_types': 'Your adaptability allows you to connect with anyone - use this to build bridges between different personality types'
                        }
                    },
                    'growth_advice': {
                        'strengths': 'You are the ultimate adapter with unlimited potential. Your curiosity and openness to change make you capable of growth in any direction you choose.',
                        'growth_tips': [
                            'Focus your diverse interests - depth can be as valuable as breadth',
                            'Commit to seeing projects through rather than jumping to the next interesting thing',
                            'Use your adaptability to help others navigate change',
                            'Choose your evolution path thoughtfully - you have infinite possibilities'
                        ],
                        'potential_blocks': [
                            'Difficulty committing to one path when so many options exist',
                            'May struggle with routine or restrictive environments',
                            'Can be seen as unreliable if constantly changing direction',
                            'Might avoid making important decisions to keep options open'
                        ],
                        'evolution_path': 'Like Eevee\'s multiple evolution possibilities, your path is about conscious choice. You can become whatever you put your mind to - the key is choosing with intention and commitment.'
                    }
                }
            }
        }
        
        if pokemon_name in pokemon_data:
            data = pokemon_data[pokemon_name]
        else:
            data = {'error': 'Pokemon not found'}
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())