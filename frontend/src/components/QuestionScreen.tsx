import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Question } from '../App';

const QuestionContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  padding-top: 120px;
  position: relative;
  z-index: 10;
`;

const QuestionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 3rem;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const QuestionNumber = styled.div`
  color: #666;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
`;

const QuestionText = styled.h2`
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  text-align: center;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionButton = styled(motion.button)<{ 
  isSelected: boolean;
}>`
  background: ${props => props.isSelected ? 'linear-gradient(135deg, #DC143C, #FF6B6B)' : 'rgba(255, 255, 255, 0.8)'};
  color: ${props => props.isSelected ? '#fff' : '#333'};
  border: ${props => props.isSelected ? 'none' : '2px solid #DC143C'};
  padding: 1.5rem;
  border-radius: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: ${props => props.isSelected ? '0 8px 25px rgba(220, 20, 60, 0.3)' : '0 4px 15px rgba(0,0,0,0.1)'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(220, 20, 60, 0.3);
    background: linear-gradient(135deg, #DC143C, #FF6B6B);
    color: #fff;
  }
  
  @media (max-width: 768px) {
    padding: 1.2rem;
    font-size: 1rem;
  }
`;

const OptionLabel = styled.span`
  font-weight: 700;
  margin-right: 0.8rem;
  font-size: 1.2rem;
`;

interface QuestionScreenProps {
  question: Question;
  onAnswer: (questionId: number, answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({ 
  question, 
  onAnswer, 
  questionNumber, 
  totalQuestions 
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (optionKey: string) => {
    setSelectedOption(optionKey);
    
    setTimeout(() => {
      onAnswer(question.id, optionKey);
    }, 300);
  };

  return (
    <QuestionContainer>
      <QuestionCard
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
      >
        <QuestionNumber>
          Question {questionNumber} of {totalQuestions}
        </QuestionNumber>
        
        <QuestionText>{question.question}</QuestionText>
        
        <OptionsContainer>
          {Object.entries(question.options).map(([optionKey, option], index) => (
            <OptionButton
              key={optionKey}
              isSelected={selectedOption === optionKey}
              onClick={() => handleOptionClick(optionKey)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <OptionLabel>{optionKey}.</OptionLabel>
              {option.text}
            </OptionButton>
          ))}
        </OptionsContainer>
      </QuestionCard>
    </QuestionContainer>
  );
};

export default QuestionScreen;