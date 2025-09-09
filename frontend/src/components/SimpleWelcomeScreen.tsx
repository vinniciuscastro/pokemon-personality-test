import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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

const WelcomeCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 3px solid #DC143C;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 800;
  color: #DC143C;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const StartButton = styled(motion.button)`
  background: linear-gradient(135deg, #DC143C, #FF6B6B);
  color: white;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.5rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(220, 20, 60, 0.4);
  transition: all 0.3s ease;
`;

interface WelcomeScreenProps {
  onStart: () => void;
}

const SimpleWelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <WelcomeContainer>
      <WelcomeCard
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
      >
        <Title
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Pokemon Personality Test
        </Title>
        
        <Subtitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Discover your inner Pokemon and learn how to grow your personality traits for a happier life!
        </Subtitle>

        <StartButton
          onClick={onStart}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Your Journey!
        </StartButton>
      </WelcomeCard>
    </WelcomeContainer>
  );
};

export default SimpleWelcomeScreen;