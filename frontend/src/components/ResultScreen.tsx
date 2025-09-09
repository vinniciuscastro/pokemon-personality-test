import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { TestResult, PokemonData } from '../App';

const ResultContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 10;
`;

const ResultCard = styled(motion.div)<{ themeColor: string }>`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 3rem;
  max-width: 900px;
  width: 100%;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 3px solid ${props => props.themeColor};
  
  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const PokemonHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 2rem;
  text-align: center;
`;

const PokemonImage = styled(motion.img)`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: 1rem;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
`;

const PokemonName = styled.h1<{ themeColor: string }>`
  font-size: 3rem;
  font-weight: 800;
  color: ${props => props.themeColor};
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const PokemonSubtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  font-weight: 600;
`;

const TraitsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: center;
  margin: 2rem 0;
`;

const Trait = styled(motion.span)<{ themeColor: string }>`
  background: ${props => props.themeColor}20;
  color: ${props => props.themeColor};
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 600;
  border: 2px solid ${props => props.themeColor}40;
  font-size: 0.9rem;
`;

const EvolutionHighlight = styled(motion.div)<{ themeColor: string }>`
  background: ${props => `linear-gradient(135deg, ${props.themeColor}20, ${props.themeColor}10)`};
  border: 3px solid ${props => props.themeColor}60;
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: center;
`;

const EvolutionTitle = styled.h2<{ themeColor: string }>`
  color: ${props => props.themeColor};
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const EvolutionChain = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
`;

const EvolutionStage = styled(motion.div)<{ isActive: boolean; themeColor: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 15px;
  background: ${props => props.isActive ? `${props.themeColor}30` : 'rgba(255,255,255,0.3)'};
  border: 2px solid ${props => props.isActive ? props.themeColor : 'rgba(255,255,255,0.5)'};
  min-width: 100px;
`;

const EvolutionImage = styled.img<{ isClickable?: boolean }>`
  width: 60px;
  height: 60px;
  margin-bottom: 0.5rem;
  cursor: ${props => props.isClickable ? 'pointer' : 'default'};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: ${props => props.isClickable ? 'scale(1.1)' : 'none'};
  }
`;

const EvolutionName = styled.div<{ isActive: boolean; themeColor: string }>`
  font-weight: 700;
  font-size: 0.9rem;
  color: ${props => props.isActive ? props.themeColor : '#666'};
  margin-bottom: 0.3rem;
`;

const EvolutionLevel = styled.div`
  font-size: 0.8rem;
  color: #888;
  text-align: center;
`;

const EvolutionArrow = styled.div`
  font-size: 1.5rem;
  color: #666;
  margin: 0 0.5rem;
`;

const TabContainer = styled.div`
  margin-top: 1rem;
`;

const TabButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const TabButton = styled(motion.button)<{ isActive: boolean; themeColor: string }>`
  background: ${props => props.isActive ? props.themeColor : 'transparent'};
  color: ${props => props.isActive ? '#fff' : props.themeColor};
  border: 2px solid ${props => props.themeColor};
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.themeColor};
    color: #fff;
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const TabContent = styled(motion.div)`
  min-height: 300px;
`;

const ScoreChart = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const ScoreItem = styled(motion.div)<{ color: string; percentage: number }>`
  background: rgba(255, 255, 255, 0.8);
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
  border: 2px solid ${props => props.color}40;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${props => props.percentage}%;
    background: ${props => props.color}20;
    transition: height 0.8s ease;
    z-index: -1;
  }
`;

const ScoreName = styled.h3<{ color: string }>`
  color: ${props => props.color};
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const ScorePercentage = styled.div<{ color: string }>`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.color};
`;

const AdviceSection = styled.div`
  text-align: left;
`;

const AdviceTitle = styled.h3<{ themeColor: string }>`
  color: ${props => props.themeColor};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AdviceText = styled.p`
  color: #444;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const AdviceList = styled.ul`
  list-style: none;
  padding: 0;
`;

const AdviceItem = styled(motion.li)<{ themeColor: string }>`
  background: ${props => props.themeColor}10;
  border-left: 4px solid ${props => props.themeColor};
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0 10px 10px 0;
  font-size: 1rem;
  line-height: 1.5;
`;

const RestartButton = styled(motion.button)<{ themeColor: string }>`
  background: linear-gradient(135deg, ${props => props.themeColor}, ${props => props.themeColor}dd);
  color: #fff;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 8px 25px ${props => props.themeColor}40;
  transition: all 0.3s ease;
  margin-top: 2rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px ${props => props.themeColor}60;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

interface ResultScreenProps {
  result: TestResult;
  pokemonData: PokemonData;
  onRestart: () => void;
}

type Tab = 'scores' | 'strengths' | 'growth' | 'blocks' | 'relationships' | 'evolution';

const pokemonColors = {
  bulbasaur: '#78C850',
  charmander: '#F08030',
  squirtle: '#6890F0',
  eevee: '#A8A878'
};

const pokemonNames = {
  bulbasaur: 'Bulbasaur',
  charmander: 'Charmander',
  squirtle: 'Squirtle',
  eevee: 'Eevee'
};

const ResultScreen: React.FC<ResultScreenProps> = ({ result, pokemonData, onRestart }) => {
  const [activeTab, setActiveTab] = useState<Tab>('scores');
  const navigate = useNavigate();
  const themeColor = pokemonColors[result.result_pokemon as keyof typeof pokemonColors];
  
  const handleEvolutionClick = (evolutionName: string, pokemonName: string) => {
    // Only navigate for Eevee evolutions
    if (result.result_pokemon === 'eevee' && evolutionName.toLowerCase() !== 'eevee') {
      navigate(`/evolution/${evolutionName.toLowerCase()}`);
    }
  };
  
  const tabs = [
    { id: 'scores' as Tab, label: 'Personality Breakdown', icon: '📊' },
    { id: 'strengths' as Tab, label: 'Your Strengths', icon: '💪' },
    { id: 'growth' as Tab, label: 'Growth Tips', icon: '🌱' },
    { id: 'blocks' as Tab, label: 'Potential Blocks', icon: '🚧' },
    { id: 'relationships' as Tab, label: 'Type Relationships', icon: '🔥💧' },
    { id: 'evolution' as Tab, label: 'Evolution Journey', icon: '🦋' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'scores':
        return (
          <ScoreChart>
            {Object.entries(result.percentages).map(([pokemon, percentage], index) => (
              <ScoreItem
                key={pokemon}
                color={pokemonColors[pokemon as keyof typeof pokemonColors]}
                percentage={percentage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ScoreName color={pokemonColors[pokemon as keyof typeof pokemonColors]}>
                  {pokemonNames[pokemon as keyof typeof pokemonNames]}
                </ScoreName>
                <ScorePercentage color={pokemonColors[pokemon as keyof typeof pokemonColors]}>
                  {Math.round(percentage)}%
                </ScorePercentage>
              </ScoreItem>
            ))}
          </ScoreChart>
        );
      
      case 'strengths':
        return (
          <AdviceSection>
            <AdviceTitle themeColor={themeColor}>
              💪 Your Core Strengths
            </AdviceTitle>
            <AdviceText>
              {pokemonData.personality.growth_advice.strengths}
            </AdviceText>
          </AdviceSection>
        );
      
      case 'growth':
        return (
          <AdviceSection>
            <AdviceTitle themeColor={themeColor}>
              🌱 Areas for Growth
            </AdviceTitle>
            <AdviceList>
              {pokemonData.personality.growth_advice.growth_tips.map((tip, index) => (
                <AdviceItem
                  key={index}
                  themeColor={themeColor}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {tip}
                </AdviceItem>
              ))}
            </AdviceList>
          </AdviceSection>
        );
      
      case 'blocks':
        return (
          <AdviceSection>
            <AdviceTitle themeColor={themeColor}>
              🚧 Watch Out For These
            </AdviceTitle>
            <AdviceList>
              {pokemonData.personality.growth_advice.potential_blocks.map((block, index) => (
                <AdviceItem
                  key={index}
                  themeColor={themeColor}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {block}
                </AdviceItem>
              ))}
            </AdviceList>
          </AdviceSection>
        );
      
      case 'relationships':
        return (
          <AdviceSection>
            <AdviceTitle themeColor={themeColor}>
              🔥💧 Type Relationships & Interactions
            </AdviceTitle>
            <AdviceText style={{ fontWeight: 600, marginBottom: '1rem' }}>
              Your type: {pokemonData.personality.type}
            </AdviceText>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: themeColor, marginBottom: '0.5rem' }}>💪 Strong Against:</h4>
              <p style={{ marginBottom: '1rem' }}>
                {pokemonData.personality.type_interactions.strengths_against.join(', ')}
              </p>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: themeColor, marginBottom: '0.5rem' }}>⚠️ Weak Against:</h4>
              <p style={{ marginBottom: '1rem' }}>
                {pokemonData.personality.type_interactions.weaknesses_against.join(', ')}
              </p>
            </div>
            <AdviceList>
              {Object.entries(pokemonData.personality.type_interactions.relationships).map(([type, advice], index) => (
                <AdviceItem
                  key={type}
                  themeColor={themeColor}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <strong>{type.replace('_', ' ').toUpperCase()}:</strong> {advice}
                </AdviceItem>
              ))}
            </AdviceList>
          </AdviceSection>
        );
      
      case 'evolution':
        return (
          <AdviceSection>
            <AdviceTitle themeColor={themeColor}>
              🦋 Your Complete Evolution Journey
            </AdviceTitle>
            <AdviceText>
              {pokemonData.personality.growth_advice.evolution_path}
            </AdviceText>
          </AdviceSection>
        );
      
      default:
        return null;
    }
  };

  return (
    <ResultContainer>
      <ResultCard
        themeColor={themeColor}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      >
        <PokemonHeader>
          <PokemonImage
            src={pokemonData.sprites.official_artwork}
            alt={pokemonData.name}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}
          />
          <PokemonName themeColor={themeColor}>
            You are {pokemonData.name}!
          </PokemonName>
          <PokemonSubtitle>
            Your personality Pokemon has been revealed
          </PokemonSubtitle>
        </PokemonHeader>

        <TraitsList>
          {pokemonData.personality.traits.map((trait, index) => (
            <Trait
              key={trait}
              themeColor={themeColor}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            >
              {trait}
            </Trait>
          ))}
        </TraitsList>

        {/* Evolution Chain Highlight */}
        <EvolutionHighlight
          themeColor={themeColor}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <EvolutionTitle themeColor={themeColor}>
            🦋 Your Evolution Journey
          </EvolutionTitle>
          <EvolutionChain>
            {pokemonData.personality.evolution_chain.map((evolution, index) => (
              <React.Fragment key={evolution.id}>
                <EvolutionStage
                  isActive={index === 0}
                  themeColor={themeColor}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.0 + index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleEvolutionClick(evolution.name, pokemonData.name)}
                  style={{ cursor: result.result_pokemon === 'eevee' && evolution.name.toLowerCase() !== 'eevee' ? 'pointer' : 'default' }}
                >
                  <EvolutionImage
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png`}
                    alt={evolution.name}
                    isClickable={result.result_pokemon === 'eevee' && evolution.name.toLowerCase() !== 'eevee'}
                  />
                  <EvolutionName isActive={index === 0} themeColor={themeColor}>
                    {evolution.name}
                  </EvolutionName>
                  <EvolutionLevel>{evolution.level}</EvolutionLevel>
                  {result.result_pokemon === 'eevee' && evolution.name.toLowerCase() !== 'eevee' && (
                    <div style={{ 
                      fontSize: '0.7rem', 
                      color: themeColor, 
                      fontWeight: '600',
                      marginTop: '0.3rem' 
                    }}>
                      Click to explore →
                    </div>
                  )}
                </EvolutionStage>
                {index < pokemonData.personality.evolution_chain.length - 1 && (
                  <EvolutionArrow>→</EvolutionArrow>
                )}
              </React.Fragment>
            ))}
          </EvolutionChain>
          <AdviceText style={{ marginBottom: 0 }}>
            {pokemonData.personality.growth_advice.evolution_path}
          </AdviceText>
        </EvolutionHighlight>

        <TabContainer>
          <TabButtons>
            {tabs.map(tab => (
              <TabButton
                key={tab.id}
                isActive={activeTab === tab.id}
                themeColor={themeColor}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.icon} {tab.label}
              </TabButton>
            ))}
          </TabButtons>

          <AnimatePresence mode="wait">
            <TabContent
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </TabContent>
          </AnimatePresence>
        </TabContainer>

        <div style={{ textAlign: 'center' }}>
          <RestartButton
            themeColor={themeColor}
            onClick={onRestart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Take Test Again
          </RestartButton>
        </div>
      </ResultCard>
    </ResultContainer>
  );
};

export default ResultScreen;