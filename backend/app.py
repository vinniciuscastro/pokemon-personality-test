from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

# Pokemon personality data
POKEMON_DATA = {
    "bulbasaur": {
        "id": 1,
        "name": "Bulbasaur",
        "type": "Grass/Poison",
        "traits": ["calm", "analytical", "patient", "logical"],
        "color_palette": {
            "primary": "#78C850",
            "secondary": "#A7DB8D",
            "accent": "#68A040"
        },
        "evolution_chain": [
            {"name": "Bulbasaur", "level": "Base", "id": 1},
            {"name": "Ivysaur", "level": "Level 16", "id": 2},
            {"name": "Venusaur", "level": "Level 32", "id": 3}
        ],
        "type_interactions": {
            "strengths_against": ["Water", "Ground", "Rock"],
            "weaknesses_against": ["Fire", "Psychic", "Flying", "Ice"],
            "relationships": {
                "fire_types": "Be cautious around Fire-type personalities (passionate, intense people) as they can overwhelm your calm nature and drain your energy with their intensity.",
                "water_types": "You naturally complement Water-type personalities (social, flowing people) - they appreciate your stability and you help ground their emotions.",
                "other_grass_types": "Fellow Grass-types understand your methodical approach and create harmonious, growth-focused relationships."
            }
        },
        "growth_advice": {
            "strengths": "Your analytical nature and patience make you an excellent problem-solver and trusted advisor. Like Grass-types, you're naturally resilient and help others grow.",
            "growth_tips": [
                "Practice expressing your ideas more boldly in group settings - evolve from Bulbasaur's quiet wisdom to Venusaur's commanding presence",
                "Take on leadership roles to develop your natural wisdom into powerful influence",
                "Don't overthink decisions - trust your analytical instincts and act with confidence",
                "Like Ivysaur developing its flower bud, nurture your ideas before sharing them fully"
            ],
            "potential_blocks": [
                "Tendency to overanalyze can lead to paralysis by analysis - avoid Fire-type pressure to decide quickly",
                "May avoid taking risks due to preference for certainty",
                "Could become too focused on details and miss the big picture",
                "Beware of Psychic-type personalities who might manipulate your overthinking tendencies"
            ],
            "evolution_path": "Your evolution mirrors Bulbasaur → Ivysaur → Venusaur: Start as a thoughtful observer, develop into a confident decision-maker (Ivysaur), then become a wise, powerful leader (Venusaur). Each stage builds on your analytical foundation while adding more decisive action and leadership presence."
        }
    },
    "charmander": {
        "id": 4,
        "name": "Charmander",
        "type": "Fire",
        "traits": ["bold", "introverted", "passionate", "determined"],
        "color_palette": {
            "primary": "#F08030",
            "secondary": "#FFCC99",
            "accent": "#E73C7E"
        },
        "evolution_chain": [
            {"name": "Charmander", "level": "Base", "id": 4},
            {"name": "Charmeleon", "level": "Level 16", "id": 5},
            {"name": "Charizard", "level": "Level 36", "id": 6}
        ],
        "type_interactions": {
            "strengths_against": ["Grass", "Ice", "Bug", "Steel"],
            "weaknesses_against": ["Water", "Ground", "Rock"],
            "relationships": {
                "water_types": "Water-type personalities (social, emotional people) can extinguish your inner fire if you let them overwhelm you with their constant social demands. Protect your energy.",
                "grass_types": "You can inspire Grass-type personalities with your passion, but be careful not to burn them out with your intensity.",
                "fellow_fire_types": "Other Fire-types understand your passion but can create explosive conflicts - channel your combined energy positively."
            }
        },
        "growth_advice": {
            "strengths": "Your inner fire and determination give you the courage to pursue your passions intensely. Like Fire-types, you have the power to ignite change and inspire others.",
            "growth_tips": [
                "Share your passionate insights with others more frequently - evolve from Charmander's shy flame to Charizard's blazing confidence",
                "Practice small social interactions to build confidence without burning out",
                "Use your determination to tackle challenges others avoid - you're naturally equipped to handle intense pressure",
                "Like Charmeleon's growing flame, gradually increase your social presence and leadership"
            ],
            "potential_blocks": [
                "May struggle with self-doubt despite inner strength - don't let Water-type personalities dampen your fire",
                "Could isolate yourself when you need support most, especially when faced with Ground/Rock-type stubborn personalities",
                "Tendency to be too hard on yourself when facing setbacks",
                "Avoid Water-type emotional manipulation that can extinguish your motivation"
            ],
            "evolution_path": "Your evolution follows Charmander → Charmeleon → Charizard: Begin with inner fire and determination (Charmander), develop bold action and confidence (Charmeleon), then soar to inspiring leadership that lifts others up (Charizard). Each stage amplifies your passion while building your ability to share it with the world."
        }
    },
    "squirtle": {
        "id": 7,
        "name": "Squirtle",
        "type": "Water",
        "traits": ["energetic", "extroverted", "social", "adaptable"],
        "color_palette": {
            "primary": "#6890F0",
            "secondary": "#9DB7F5",
            "accent": "#4F70C6"
        },
        "evolution_chain": [
            {"name": "Squirtle", "level": "Base", "id": 7},
            {"name": "Wartortle", "level": "Level 16", "id": 8},
            {"name": "Blastoise", "level": "Level 36", "id": 9}
        ],
        "type_interactions": {
            "strengths_against": ["Fire", "Ground", "Rock"],
            "weaknesses_against": ["Grass", "Electric"],
            "relationships": {
                "fire_types": "You can help cool down Fire-type personalities when they're too intense, but don't let them take advantage of your supportive nature.",
                "grass_types": "Grass-type personalities can drain your social energy with their slow, methodical approach - set boundaries to maintain your flow.",
                "electric_types": "Electric-type personalities (quick, energetic) can short-circuit your emotional nature - be cautious of their unpredictability."
            }
        },
        "growth_advice": {
            "strengths": "Your natural energy and social skills make you excellent at bringing people together and creating positive environments. Like Water-types, you're adaptable and can flow around obstacles.",
            "growth_tips": [
                "Channel your energy into long-term projects for greater impact - evolve from Squirtle's playful energy to Blastoise's focused power",
                "Develop deeper listening skills to complement your social nature",
                "Use your adaptability to help others navigate change without losing yourself",
                "Like Wartortle's tail growing fluffy with age, develop wisdom alongside your social skills"
            ],
            "potential_blocks": [
                "May struggle with focus and completing long-term projects - avoid Grass-type personalities who slow your momentum",
                "Could spread yourself too thin trying to help everyone, especially Fire-types who drain your energy",
                "Tendency to avoid difficult conversations despite social skills",
                "Watch out for Electric-type personalities who might shock you with sudden changes or demands"
            ],
            "evolution_path": "Your evolution mirrors Squirtle → Wartortle → Blastoise: Start with playful social energy (Squirtle), develop emotional wisdom and strategic thinking (Wartortle), then become a powerful, protective leader who can handle any challenge (Blastoise). Your journey is about channeling your natural flow into focused, decisive action."
        }
    },
    "eevee": {
        "id": 133,
        "name": "Eevee",
        "type": "Normal",
        "traits": ["creative", "adaptable", "curious", "versatile"],
        "color_palette": {
            "primary": "#A8A878",
            "secondary": "#C6C6A7",
            "accent": "#8A8A59"
        },
        "evolution_chain": [
            {"name": "Eevee", "level": "Base", "id": 133},
            {"name": "Vaporeon", "level": "Water Stone", "id": 134},
            {"name": "Jolteon", "level": "Thunder Stone", "id": 135},
            {"name": "Flareon", "level": "Fire Stone", "id": 136},
            {"name": "Espeon", "level": "Day + Friendship", "id": 196},
            {"name": "Umbreon", "level": "Night + Friendship", "id": 197},
            {"name": "Leafeon", "level": "Leaf Stone", "id": 470},
            {"name": "Glaceon", "level": "Ice Stone", "id": 471},
            {"name": "Sylveon", "level": "Fairy + Friendship", "id": 700}
        ],
        "type_interactions": {
            "strengths_against": ["None (Normal type has no advantages)"],
            "weaknesses_against": ["Fighting"],
            "relationships": {
                "all_types": "You can adapt to work with any personality type, but this versatility can be both your strength and weakness.",
                "fighting_types": "Fighting-type personalities (aggressive, confrontational) can overwhelm your peaceful, adaptable nature.",
                "specialized_types": "While others have clear strengths, your power lies in being able to become whatever is needed in any situation."
            }
        },
        "growth_advice": {
            "strengths": "Your creativity and adaptability allow you to find unique solutions and thrive in various situations. Like Eevee, you have unlimited potential to become anything.",
            "growth_tips": [
                "Focus your creative energy on one or two key areas for deeper expertise - choose your evolution path wisely",
                "Document your creative processes to build on your innovations",
                "Embrace your versatility as a strength, not indecision",
                "Like Eevee's evolution stones, seek specific experiences and relationships that will trigger your growth into specialized excellence"
            ],
            "potential_blocks": [
                "May struggle with decision-making due to seeing too many possibilities - avoid analysis paralysis",
                "Could lack direction from having too many interests",
                "Tendency to start many projects but not finish them",
                "Fighting-type personalities might pressure you into premature decisions before you're ready to evolve"
            ],
            "evolution_path": "Your evolution is unique among all personalities - you have 8+ different paths! Like Eevee → Vaporeon (emotional mastery), Jolteon (quick thinking), Flareon (passionate action), Espeon (psychic intuition), Umbreon (mysterious depth), Leafeon (natural growth), Glaceon (cool precision), or Sylveon (harmonious relationships). Your journey is about discovering which environment and relationships will trigger your ultimate transformation into your true specialized self."
        }
    }
}

# Personality test questions
QUESTIONS = [
    {
        "id": 1,
        "question": "When facing a difficult problem, what's your first instinct?",
        "options": {
            "A": {"text": "Take time to analyze all possible solutions", "pokemon": "bulbasaur", "weight": 3},
            "B": {"text": "Dive in headfirst with determination", "pokemon": "charmander", "weight": 3},
            "C": {"text": "Ask others for their input and brainstorm together", "pokemon": "squirtle", "weight": 3},
            "D": {"text": "Look for creative, unconventional approaches", "pokemon": "eevee", "weight": 3}
        }
    },
    {
        "id": 2,
        "question": "How do you prefer to spend your free time?",
        "options": {
            "A": {"text": "Reading, learning, or working on personal projects", "pokemon": "bulbasaur", "weight": 3},
            "B": {"text": "Pursuing a passionate hobby or skill", "pokemon": "charmander", "weight": 3},
            "C": {"text": "Hanging out with friends or meeting new people", "pokemon": "squirtle", "weight": 3},
            "D": {"text": "Trying new activities or exploring different interests", "pokemon": "eevee", "weight": 3}
        }
    },
    {
        "id": 3,
        "question": "In group settings, you typically:",
        "options": {
            "A": {"text": "Listen carefully and offer thoughtful insights", "pokemon": "bulbasaur", "weight": 3},
            "B": {"text": "Contribute when you feel strongly about something", "pokemon": "charmander", "weight": 3},
            "C": {"text": "Keep the energy up and help everyone participate", "pokemon": "squirtle", "weight": 3},
            "D": {"text": "Bring fresh perspectives and innovative ideas", "pokemon": "eevee", "weight": 3}
        }
    },
    {
        "id": 4,
        "question": "What motivates you most?",
        "options": {
            "A": {"text": "Understanding complex systems and solving puzzles", "pokemon": "bulbasaur", "weight": 3},
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
            "B": {"text": "Focus intensely on pushing through the challenge", "pokemon": "charmander", "weight": 3},
            "C": {"text": "Talk it out with friends or find a fun distraction", "pokemon": "squirtle", "weight": 3},
            "D": {"text": "Look for alternative approaches or change perspectives", "pokemon": "eevee", "weight": 3}
        }
    },
    {
        "id": 6,
        "question": "Your ideal work environment would be:",
        "options": {
            "A": {"text": "Quiet and organized, with time for deep thinking", "pokemon": "bulbasaur", "weight": 3},
            "B": {"text": "Focused and intense, with clear goals to achieve", "pokemon": "charmander", "weight": 3},
            "C": {"text": "Collaborative and energetic, with lots of interaction", "pokemon": "squirtle", "weight": 3},
            "D": {"text": "Dynamic and flexible, with variety and new challenges", "pokemon": "eevee", "weight": 3}
        }
    },
    {
        "id": 7,
        "question": "When learning something new, you prefer to:",
        "options": {
            "A": {"text": "Study the theory first, then practice systematically", "pokemon": "bulbasaur", "weight": 3},
            "B": {"text": "Practice intensively until you master it", "pokemon": "charmander", "weight": 3},
            "C": {"text": "Learn with others in a fun, interactive way", "pokemon": "squirtle", "weight": 3},
            "D": {"text": "Experiment and find your own unique method", "pokemon": "eevee", "weight": 3}
        }
    },
    {
        "id": 8,
        "question": "What's your biggest strength?",
        "options": {
            "A": {"text": "Logical thinking and attention to detail", "pokemon": "bulbasaur", "weight": 3},
            "B": {"text": "Determination and inner strength", "pokemon": "charmander", "weight": 3},
            "C": {"text": "Social skills and positive energy", "pokemon": "squirtle", "weight": 3},
            "D": {"text": "Creativity and adaptability", "pokemon": "eevee", "weight": 3}
        }
    },
    {
        "id": 9,
        "question": "How do you make important decisions?",
        "options": {
            "A": {"text": "Carefully weigh all pros and cons", "pokemon": "bulbasaur", "weight": 3},
            "B": {"text": "Trust your gut instinct and commit fully", "pokemon": "charmander", "weight": 3},
            "C": {"text": "Discuss with trusted friends and consider their advice", "pokemon": "squirtle", "weight": 3},
            "D": {"text": "Consider multiple options and stay flexible", "pokemon": "eevee", "weight": 3}
        }
    },
    {
        "id": 10,
        "question": "What would others say is your most noticeable quality?",
        "options": {
            "A": {"text": "Thoughtful and reliable", "pokemon": "bulbasaur", "weight": 3},
            "B": {"text": "Passionate and determined", "pokemon": "charmander", "weight": 3},
            "C": {"text": "Friendly and energetic", "pokemon": "squirtle", "weight": 3},
            "D": {"text": "Creative and versatile", "pokemon": "eevee", "weight": 3}
        }
    }
]

@app.route('/api/questions', methods=['GET'])
def get_questions():
    """Get all personality test questions"""
    return jsonify(QUESTIONS)

@app.route('/api/pokemon/<pokemon_name>', methods=['GET'])
def get_pokemon_data(pokemon_name):
    """Get Pokemon data from PokeAPI and combine with personality data"""
    try:
        # Get Pokemon data from PokeAPI
        response = requests.get(f'https://pokeapi.co/api/v2/pokemon/{pokemon_name.lower()}')
        if response.status_code != 200:
            return jsonify({"error": "Pokemon not found"}), 404
        
        poke_data = response.json()
        
        # Combine with our personality data
        personality_data = POKEMON_DATA.get(pokemon_name.lower(), {})
        
        result = {
            "id": poke_data["id"],
            "name": poke_data["name"].title(),
            "sprites": {
                "front_default": poke_data["sprites"]["front_default"],
                "official_artwork": poke_data["sprites"]["other"]["official-artwork"]["front_default"]
            },
            "types": [type_data["type"]["name"] for type_data in poke_data["types"]],
            "personality": personality_data
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/calculate-result', methods=['POST'])
def calculate_result():
    """Calculate personality test result based on answers"""
    try:
        answers = request.json.get('answers', {})
        
        # Initialize scores
        scores = {
            "bulbasaur": 0,
            "charmander": 0,
            "squirtle": 0,
            "eevee": 0
        }
        
        # Calculate scores based on answers
        for question_id, answer_option in answers.items():
            question = next((q for q in QUESTIONS if q["id"] == int(question_id)), None)
            if question and answer_option in question["options"]:
                option = question["options"][answer_option]
                pokemon = option["pokemon"]
                weight = option["weight"]
                scores[pokemon] += weight
        
        # Find the winning Pokemon
        winner = max(scores.items(), key=lambda x: x[1])
        winning_pokemon = winner[0]
        
        # Calculate percentages
        total_score = sum(scores.values())
        percentages = {pokemon: (score / total_score * 100) if total_score > 0 else 0 
                      for pokemon, score in scores.items()}
        
        result = {
            "result_pokemon": winning_pokemon,
            "scores": scores,
            "percentages": percentages,
            "personality_data": POKEMON_DATA[winning_pokemon]
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Pokemon Personality Test API is running!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)