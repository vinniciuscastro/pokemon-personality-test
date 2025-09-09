import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ProgressContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #78C850 0%, #6890F0 50%, #F08030 100%);
  border-radius: 4px;
`;

interface ProgressBarProps {
  progress: number;
  currentQuestion: number;
  totalQuestions: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, currentQuestion, totalQuestions }) => {
  return (
    <ProgressContainer>
      <ProgressInfo>
        <span>Pokemon Personality Test</span>
        <span>Question {currentQuestion} of {totalQuestions}</span>
      </ProgressInfo>
      <ProgressBarContainer>
        <ProgressBarFill
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </ProgressBarContainer>
    </ProgressContainer>
  );
};

export default ProgressBar;