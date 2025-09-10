import React from 'react';
import styled from 'styled-components';

const WelcomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 10;
`;

const WelcomeCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 3rem;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 3px solid #DC143C;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: #DC143C;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(220, 20, 60, 0.1);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const StarterPokemonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const StarterPokemon = styled.div<{ color: string }>`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: ${props => `linear-gradient(135deg, ${props.color}ee, ${props.color}aa)`};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px) scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 110px;
    height: 110px;
  }
`;

const PokemonImage = styled.img`
  width: 90px;
  height: 90px;
  object-fit: contain;
  
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
  }
`;

const StarterName = styled.div`
  position: absolute;
  bottom: -30px;
  font-size: 0.9rem;
  color: #333;
  font-weight: 600;
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, #DC143C, #FF6B6B);
  color: #fff;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.3rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(220, 20, 60, 0.4);
  transition: all 0.3s ease;
  margin-top: 2rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(220, 20, 60, 0.6);
    background: linear-gradient(135deg, #FF6B6B, #DC143C);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 2rem;
    font-size: 1.1rem;
  }
`;

const FeatureList = styled.div`
  margin: 2rem 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  max-width: 800px;
`;

const Feature = styled.div`
  background: rgba(220, 20, 60, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-radius: 25px;
  color: #DC143C;
  font-weight: 600;
  border: 1px solid rgba(220, 20, 60, 0.3);
`;

interface WelcomeScreenProps {
  onStart: () => void;
}

const starterPokemons = [
  { name: 'Bulbasaur', id: 1, color: '#78C850' },
  { name: 'Charmander', id: 4, color: '#F08030' },
  { name: 'Squirtle', id: 7, color: '#6890F0' },
  { name: 'Eevee', id: 133, color: '#A8A878' }
];

const SimpleWelcomeScreenWithImages: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <WelcomeContainer>
      <WelcomeCard>
        <Title>Pokemon Personality Test</Title>
        
        <Subtitle>
          Discover your inner Pokemon and learn how to grow your personality traits for a happier life!
        </Subtitle>

        <StarterPokemonContainer>
          {starterPokemons.map((pokemon) => (
            <StarterPokemon key={pokemon.name} color={pokemon.color}>
              <PokemonImage
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                alt={pokemon.name}
              />
              <StarterName>{pokemon.name}</StarterName>
            </StarterPokemon>
          ))}
        </StarterPokemonContainer>

        <FeatureList>
          <Feature>🧠 10 Personality Questions</Feature>
          <Feature>📊 Detailed Analysis</Feature>
          <Feature>🌟 Growth Recommendations</Feature>
          <Feature>🎯 Evolution Insights</Feature>
        </FeatureList>

        <StartButton onClick={onStart}>
          Start Your Journey!
        </StartButton>
      </WelcomeCard>
    </WelcomeContainer>
  );
};

export default SimpleWelcomeScreenWithImages;