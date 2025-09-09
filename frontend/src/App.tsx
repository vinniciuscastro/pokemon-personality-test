import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionScreen from './components/QuestionScreen';
import ResultScreen from './components/ResultScreen';
import ProgressBar from './components/ProgressBar';
import EeveeEvolutionPage from './components/EeveeEvolutionPage';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Pokemon', 'Arial', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    overflow-x: hidden;
  }

  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap');
  
  body {
    font-family: 'Nunito', sans-serif;
  }
`;

const AppContainer = styled.div<{ currentScreen: string; pokemonType?: string }>`
  min-height: 100vh;
  position: relative;
  background: ${props => {
    if (props.currentScreen === 'result' && props.pokemonType) {
      switch (props.pokemonType) {
        case 'bulbasaur': return 'linear-gradient(135deg, #78C850 0%, #A7DB8D 100%)';
        case 'charmander': return 'linear-gradient(135deg, #F08030 0%, #FFCC99 100%)';
        case 'squirtle': return 'linear-gradient(135deg, #6890F0 0%, #9DB7F5 100%)';
        case 'eevee': return 'linear-gradient(135deg, #A8A878 0%, #C6C6A7 100%)';
        default: return 'linear-gradient(135deg, #DC143C 0%, #FFFFFF 50%, #DC143C 100%)';
      }
    }
    // Pokeball colors for welcome and quiz screens - more readable
    return 'linear-gradient(135deg, #DC143C 0%, #FF6B6B 25%, #FFEEEE 50%, #FF6B6B 75%, #DC143C 100%)';
  }};
  transition: background 0.8s ease;
`;

const BackgroundPattern = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.3) 2px, transparent 2px);
  background-size: 100px 100px, 150px 150px, 120px 120px;
  pointer-events: none;
  z-index: 0;
`;

export interface Question {
  id: number;
  question: string;
  options: {
    [key: string]: {
      text: string;
      pokemon: string;
      weight: number;
    };
  };
}

export interface PokemonData {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    official_artwork: string;
  };
  types: string[];
  personality: {
    type: string;
    traits: string[];
    color_palette: {
      primary: string;
      secondary: string;
      accent: string;
    };
    evolution_chain: Array<{
      name: string;
      level: string;
      id: number;
    }>;
    type_interactions: {
      strengths_against: string[];
      weaknesses_against: string[];
      relationships: {
        [key: string]: string;
      };
    };
    growth_advice: {
      strengths: string;
      growth_tips: string[];
      potential_blocks: string[];
      evolution_path: string;
    };
  };
}

export interface TestResult {
  result_pokemon: string;
  scores: { [key: string]: number };
  percentages: { [key: string]: number };
  personality_data: any;
}

type Screen = 'welcome' | 'quiz' | 'result';

const PersonalityTestApp: React.FC = () => {
  console.log('PersonalityTestApp component rendering');
  
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<TestResult | null>(null);
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(false);
  
  console.log('Current state:', { currentScreen, questionsCount: questions.length, result: !!result, pokemonData: !!pokemonData });

  // Fallback questions in case API fails
  const fallbackQuestions: Question[] = [
    {
      id: 1,
      question: "What's your ideal way to spend a weekend?",
      options: {
        "A": {"text": "Reading a good book or learning something new", "pokemon": "bulbasaur", "weight": 3},
        "B": {"text": "Going on an adventure or trying extreme sports", "pokemon": "charmander", "weight": 3},
        "C": {"text": "Spending quality time with friends and family", "pokemon": "squirtle", "weight": 3},
        "D": {"text": "Exploring new places or trying new experiences", "pokemon": "eevee", "weight": 3}
      }
    },
    {
      id: 2,
      question: "How do you approach challenges?",
      options: {
        "A": {"text": "Think it through carefully and plan methodically", "pokemon": "bulbasaur", "weight": 3},
        "B": {"text": "Face it head-on with determination and energy", "pokemon": "charmander", "weight": 3},
        "C": {"text": "Work with others and seek support when needed", "pokemon": "squirtle", "weight": 3},
        "D": {"text": "Adapt and find creative solutions", "pokemon": "eevee", "weight": 3}
      }
    },
    {
      id: 3,
      question: "What motivates you most?",
      options: {
        "A": {"text": "Knowledge and understanding", "pokemon": "bulbasaur", "weight": 3},
        "B": {"text": "Achievement and recognition", "pokemon": "charmander", "weight": 3},
        "C": {"text": "Helping others and building relationships", "pokemon": "squirtle", "weight": 3},
        "D": {"text": "Freedom and new possibilities", "pokemon": "eevee", "weight": 3}
      }
    }
  ];

  // Fetch questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/api/questions');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions, using fallback:', error);
        // Use fallback questions if API fails
        setQuestions(fallbackQuestions);
      }
    };
    
    fetchQuestions();
  }, []);

  const startQuiz = () => {
    setCurrentScreen('quiz');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz completed, calculate result
      calculateResult();
    }
  };

  const calculateResult = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/calculate-result', {
        answers
      });
      const testResult = response.data;
      setResult(testResult);
      
      // Fetch Pokemon data
      const pokemonResponse = await axios.get(`/api/pokemon/${testResult.result_pokemon}`);
      setPokemonData(pokemonResponse.data);
      
      setCurrentScreen('result');
    } catch (error) {
      console.error('Error calculating result, using fallback:', error);
      
      // Fallback calculation if API fails
      const scores = {
        'bulbasaur': 0,
        'charmander': 0,
        'squirtle': 0,
        'eevee': 0
      };
      
      // Count votes for each Pokemon based on answers
      Object.values(answers).forEach(answer => {
        if (answer.toUpperCase() === 'A') scores['bulbasaur']++;
        else if (answer.toUpperCase() === 'B') scores['charmander']++;
        else if (answer.toUpperCase() === 'C') scores['squirtle']++;
        else if (answer.toUpperCase() === 'D') scores['eevee']++;
      });
      
      const resultPokemon = Object.keys(scores).reduce((a, b) => scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b);
      const total = Object.values(answers).length;
      const percentages = Object.fromEntries(
        Object.entries(scores).map(([pokemon, score]) => [pokemon, (score / total) * 100])
      );
      
      setResult({
        result_pokemon: resultPokemon,
        scores,
        percentages,
        personality_data: null
      });
      
      // Create fallback Pokemon data with complete structure
      const fallbackPokemonData = {
        id: resultPokemon === 'bulbasaur' ? 1 : resultPokemon === 'charmander' ? 4 : resultPokemon === 'squirtle' ? 7 : 133,
        name: resultPokemon.charAt(0).toUpperCase() + resultPokemon.slice(1),
        sprites: {
          front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${resultPokemon === 'bulbasaur' ? 1 : resultPokemon === 'charmander' ? 4 : resultPokemon === 'squirtle' ? 7 : 133}.png`,
          official_artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${resultPokemon === 'bulbasaur' ? 1 : resultPokemon === 'charmander' ? 4 : resultPokemon === 'squirtle' ? 7 : 133}.png`
        },
        types: [resultPokemon === 'bulbasaur' ? 'grass' : resultPokemon === 'charmander' ? 'fire' : resultPokemon === 'squirtle' ? 'water' : 'normal'],
        personality: (() => {
          if (resultPokemon === 'bulbasaur') {
            return {
              type: 'The Thoughtful Strategist',
              traits: ['Analytical', 'Patient', 'Wise', 'Methodical', 'Growth-Oriented'],
              color_palette: { primary: '#78C850', secondary: '#A7DB8D', accent: '#68A040' },
              evolution_chain: [
                { name: 'Bulbasaur', level: 'Base Form', id: 1 },
                { name: 'Ivysaur', level: 'Level 16', id: 2 },
                { name: 'Venusaur', level: 'Level 32', id: 3 }
              ],
              type_interactions: {
                strengths_against: ['Water', 'Ground', 'Rock'],
                weaknesses_against: ['Fire', 'Psychic', 'Flying', 'Ice'],
                relationships: {
                  'fire_types': 'Learn to be more decisive - your thoughtful nature is valuable, but don\'t let analysis paralysis hold you back',
                  'water_types': 'Your steady growth complements their emotional flow - great partnership potential'
                }
              },
              growth_advice: {
                strengths: 'You are the wise strategist who thinks before acting. Your methodical approach and love of learning make you excellent at long-term planning.',
                growth_tips: [
                  'Practice making faster decisions - your analysis is valuable but don\'t overthink every choice',
                  'Share your knowledge more openly - others can benefit from your insights',
                  'Set specific growth goals and track your progress regularly'
                ],
                potential_blocks: [
                  'Analysis paralysis - overthinking decisions',
                  'Reluctance to take risks or act without complete information',
                  'Tendency to be too critical of yourself and others'
                ],
                evolution_path: 'Like Bulbasaur evolving into Venusaur, your growth comes from combining your natural wisdom with decisive action.'
              }
            };
          } else if (resultPokemon === 'charmander') {
            return {
              type: 'The Passionate Achiever',
              traits: ['Determined', 'Energetic', 'Competitive', 'Leadership-Oriented', 'Goal-Focused'],
              color_palette: { primary: '#F08030', secondary: '#FFCC99', accent: '#E8620A' },
              evolution_chain: [
                { name: 'Charmander', level: 'Base Form', id: 4 },
                { name: 'Charmeleon', level: 'Level 16', id: 5 },
                { name: 'Charizard', level: 'Level 36', id: 6 }
              ],
              type_interactions: {
                strengths_against: ['Grass', 'Ice', 'Bug', 'Steel'],
                weaknesses_against: ['Water', 'Ground', 'Rock'],
                relationships: {
                  'water_types': 'Learn patience and emotional intelligence from them - balance your fire with their flow',
                  'grass_types': 'Respect their thoughtful approach while sharing your motivational energy'
                }
              },
              growth_advice: {
                strengths: 'You are the natural leader with boundless energy and determination. Your competitive spirit inspires others.',
                growth_tips: [
                  'Practice patience - not every goal needs to be achieved immediately',
                  'Learn to collaborate rather than always leading - others have valuable perspectives',
                  'Develop emotional intelligence to better understand team dynamics'
                ],
                potential_blocks: [
                  'Impatience with slower progress or people',
                  'Tendency to take on too much and burn out',
                  'Difficulty accepting failure or setbacks'
                ],
                evolution_path: 'Like Charmander\'s flame growing stronger through challenges, your evolution comes from learning to channel your intense energy wisely.'
              }
            };
          } else if (resultPokemon === 'squirtle') {
            return {
              type: 'The Supportive Collaborator',
              traits: ['Empathetic', 'Loyal', 'Team-Oriented', 'Adaptable', 'Nurturing'],
              color_palette: { primary: '#6890F0', secondary: '#9DB7F5', accent: '#4F70C2' },
              evolution_chain: [
                { name: 'Squirtle', level: 'Base Form', id: 7 },
                { name: 'Wartortle', level: 'Level 16', id: 8 },
                { name: 'Blastoise', level: 'Level 36', id: 9 }
              ],
              type_interactions: {
                strengths_against: ['Fire', 'Ground', 'Rock'],
                weaknesses_against: ['Grass', 'Electric'],
                relationships: {
                  'fire_types': 'Your calming presence balances their intensity - help them develop patience',
                  'grass_types': 'Great learning partnership - they provide structure while you provide emotional support'
                }
              },
              growth_advice: {
                strengths: 'You are the heart of any team, with natural ability to understand and support others. Your emotional intelligence creates harmony.',
                growth_tips: [
                  'Assert yourself more - your opinions and needs matter too',
                  'Set boundaries to avoid taking on everyone else\'s problems',
                  'Practice making decisions independently before seeking input'
                ],
                potential_blocks: [
                  'Difficulty saying no to others\' requests',
                  'Tendency to avoid conflict even when necessary',
                  'May neglect own needs while caring for others'
                ],
                evolution_path: 'Like Squirtle\'s protective shell growing stronger, your evolution involves learning to protect your own energy while maintaining your caring nature.'
              }
            };
          } else { // eevee
            return {
              type: 'The Adaptive Explorer',
              traits: ['Versatile', 'Curious', 'Open-minded', 'Creative', 'Evolutionary'],
              color_palette: { primary: '#A8A878', secondary: '#C6C6A7', accent: '#8A8A59' },
              evolution_chain: [
                { name: 'Eevee', level: 'Base Form', id: 133 },
                { name: 'Vaporeon', level: 'Water Stone', id: 134 },
                { name: 'Jolteon', level: 'Thunder Stone', id: 135 },
                { name: 'Flareon', level: 'Fire Stone', id: 136 },
                { name: 'Espeon', level: 'Friendship + Day', id: 196 },
                { name: 'Umbreon', level: 'Friendship + Night', id: 197 },
                { name: 'Leafeon', level: 'Leaf Stone', id: 470 },
                { name: 'Glaceon', level: 'Ice Stone', id: 471 },
                { name: 'Sylveon', level: 'Fairy Move + Friendship', id: 700 }
              ],
              type_interactions: {
                strengths_against: ['None - but adaptable to all'],
                weaknesses_against: ['Fighting'],
                relationships: {
                  'all_types': 'Your adaptability allows you to connect with anyone - use this to build bridges between different personality types'
                }
              },
              growth_advice: {
                strengths: 'You are the ultimate adapter with unlimited potential. Your curiosity and openness to change make you capable of growth in any direction.',
                growth_tips: [
                  'Focus your diverse interests - depth can be as valuable as breadth',
                  'Commit to seeing projects through rather than jumping to the next interesting thing',
                  'Use your adaptability to help others navigate change'
                ],
                potential_blocks: [
                  'Difficulty committing to one path when so many options exist',
                  'May struggle with routine or restrictive environments',
                  'Can be seen as unreliable if constantly changing direction'
                ],
                evolution_path: 'Like Eevee\'s multiple evolution possibilities, your path is about conscious choice. You can become whatever you put your mind to.'
              }
            };
          }
        })()
      };
      
      setPokemonData(fallbackPokemonData as unknown as PokemonData);
      setCurrentScreen('result');
    } finally {
      setLoading(false);
    }
  };

  const restartQuiz = () => {
    setCurrentScreen('welcome');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setPokemonData(null);
  };

  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  return (
    <>
      <AppContainer currentScreen={currentScreen} pokemonType={result?.result_pokemon}>
        <BackgroundPattern />
        
        {currentScreen === 'quiz' && (
          <ProgressBar 
            progress={progress} 
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        )}

        <AnimatePresence mode="wait">
          {currentScreen === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <WelcomeScreen onStart={startQuiz} />
            </motion.div>
          )}

          {currentScreen === 'quiz' && (
            <motion.div
              key={`question-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {questions.length > 0 && currentQuestionIndex < questions.length ? (
                <QuestionScreen
                  question={questions[currentQuestionIndex]}
                  onAnswer={handleAnswer}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                />
              ) : (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  minHeight: '50vh', 
                  color: 'white',
                  fontSize: '1.2rem',
                  textAlign: 'center'
                }}>
                  Loading questions...
                </div>
              )}
            </motion.div>
          )}

          {currentScreen === 'result' && (
            result && pokemonData ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <ResultScreen
                result={result!}
                pokemonData={pokemonData!}
                onRestart={restartQuiz}
              />
            </motion.div>
            ) : (
              <motion.div
                key="result-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '50vh',
                  color: 'white',
                  fontSize: '1.2rem',
                  textAlign: 'center'
                }}
              >
                Preparing your results...
              </motion.div>
            )
          )}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
          >
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '1rem',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              Calculating your Pokemon personality...
            </div>
          </motion.div>
        )}
      </AppContainer>
    </>
  );
};

const App: React.FC = () => {
  console.log('App component rendering');
  
  return (
    <ErrorBoundary>
      <Router>
        <GlobalStyle />
        <Routes>
          <Route path="/" element={
            <ErrorBoundary>
              <PersonalityTestApp />
            </ErrorBoundary>
          } />
          <Route path="/evolution/:evolutionName" element={
            <ErrorBoundary>
              <EeveeEvolutionPage />
            </ErrorBoundary>
          } />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
