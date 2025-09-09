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
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<TestResult | null>(null);
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/api/questions');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
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
      console.error('Error calculating result:', error);
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

          {currentScreen === 'quiz' && questions.length > 0 && (
            <motion.div
              key={`question-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionScreen
                question={questions[currentQuestionIndex]}
                onAnswer={handleAnswer}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
              />
            </motion.div>
          )}

          {currentScreen === 'result' && result && pokemonData && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <ResultScreen
                result={result}
                pokemonData={pokemonData}
                onRestart={restartQuiz}
              />
            </motion.div>
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
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<PersonalityTestApp />} />
        <Route path="/evolution/:evolutionName" element={<EeveeEvolutionPage />} />
      </Routes>
    </Router>
  );
};

export default App;
