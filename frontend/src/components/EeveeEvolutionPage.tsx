import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';

const PageContainer = styled.div<{ themeColor: string }>`
  min-height: 100vh;
  background: linear-gradient(135deg, ${props => props.themeColor}30 0%, ${props => props.themeColor}10 100%);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BackButton = styled(motion.button)<{ themeColor: string }>`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: ${props => props.themeColor};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  z-index: 100;
  
  &:hover {
    background: ${props => props.themeColor}dd;
  }
`;

const EvolutionCard = styled(motion.div)<{ themeColor: string }>`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 3rem;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 3px solid ${props => props.themeColor};
  margin-top: 4rem;
`;

const EvolutionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 2rem;
  text-align: center;
`;

const EvolutionImage = styled(motion.img)`
  width: 200px;
  height: 200px;
  margin-bottom: 1rem;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
`;

const EvolutionName = styled.h1<{ themeColor: string }>`
  font-size: 3rem;
  font-weight: 800;
  color: ${props => props.themeColor};
  margin-bottom: 0.5rem;
`;

const EvolutionMethod = styled.p<{ themeColor: string }>`
  font-size: 1.2rem;
  color: ${props => props.themeColor};
  font-weight: 600;
  margin-bottom: 1rem;
`;

const TypeBadge = styled.span<{ themeColor: string }>`
  background: ${props => props.themeColor}20;
  color: ${props => props.themeColor};
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-weight: 700;
  font-size: 0.9rem;
  border: 2px solid ${props => props.themeColor}40;
`;

const Section = styled.div`
  margin: 2rem 0;
`;

const SectionTitle = styled.h3<{ themeColor: string }>`
  color: ${props => props.themeColor};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionContent = styled.p`
  color: #444;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const PersonalityList = styled.ul`
  list-style: none;
  padding: 0;
`;

const PersonalityItem = styled(motion.li)<{ themeColor: string }>`
  background: ${props => props.themeColor}10;
  border-left: 4px solid ${props => props.themeColor};
  padding: 1rem;
  margin-bottom: 0.8rem;
  border-radius: 0 10px 10px 0;
  font-size: 1rem;
  line-height: 1.5;
`;

interface EeveeEvolution {
  name: string;
  id: number;
  type: string;
  method: string;
  color: string;
  personality: {
    description: string;
    strengths: string[];
    weaknesses: string[];
    ideal_for: string;
    growth_path: string;
  };
}

const eeveeEvolutions: { [key: string]: EeveeEvolution } = {
  vaporeon: {
    name: 'Vaporeon',
    id: 134,
    type: 'Water',
    method: 'Water Stone',
    color: '#6890F0',
    personality: {
      description: 'The emotional master - You flow like water, adapting to any situation while maintaining deep emotional intelligence.',
      strengths: ['Deep empathy and emotional intelligence', 'Natural mediator and peacemaker', 'Highly adaptable to social situations', 'Intuitive understanding of others needs'],
      weaknesses: ['May absorb others emotions too easily', 'Can be overwhelmed in high-stress environments', 'Tendency to avoid confrontation', 'May sacrifice own needs for others'],
      ideal_for: 'People who want to develop stronger emotional intelligence, work in counseling or social work, or become better at reading and responding to others emotions.',
      growth_path: 'Your path involves learning to set emotional boundaries while maintaining your natural empathy. Like water finding its course, you must learn when to flow around obstacles and when to carve through them with gentle persistence.'
    }
  },
  jolteon: {
    name: 'Jolteon',
    id: 135,
    type: 'Electric',
    method: 'Thunder Stone',
    color: '#F8D030',
    personality: {
      description: 'The quick thinker - Your mind sparks with electric speed, making connections others miss.',
      strengths: ['Lightning-fast problem solving', 'High energy and enthusiasm', 'Excellent at multitasking', 'Natural innovator and early adopter'],
      weaknesses: ['May act impulsively without thinking', 'Can be impatient with slower thinkers', 'Tendency to burn out from overexertion', 'May struggle with routine tasks'],
      ideal_for: 'People who thrive in fast-paced environments, work in technology or innovation, or want to develop quicker decision-making skills.',
      growth_path: 'Your evolution focuses on channeling your electric energy productively. Learn to pause before acting, but dont lose your natural speed. Like controlled lightning, your power is most effective when directed with precision.'
    }
  },
  flareon: {
    name: 'Flareon',
    id: 136,
    type: 'Fire',
    method: 'Fire Stone',
    color: '#F08030',
    personality: {
      description: 'The passionate achiever - Your inner fire drives you to pursue goals with unwavering determination.',
      strengths: ['Intense passion and dedication', 'Natural leadership abilities', 'Resilient in face of challenges', 'Inspiring and motivating to others'],
      weaknesses: ['Can be too intense for some people', 'May burn out from pushing too hard', 'Tendency to be impatient with slow progress', 'Can struggle with work-life balance'],
      ideal_for: 'People who want to develop stronger leadership skills, work in competitive environments, or need to build more confidence in pursuing their goals.',
      growth_path: 'Your journey involves learning to modulate your inner fire - burning bright when needed but also knowing when to dim to a warm glow. True leadership comes from inspiring others, not overwhelming them with your intensity.'
    }
  },
  espeon: {
    name: 'Espeon',
    id: 196,
    type: 'Psychic',
    method: 'Friendship + Day',
    color: '#A040A0',
    personality: {
      description: 'The intuitive guide - You possess deep insight into patterns and possibilities others cannot see.',
      strengths: ['Strong intuitive abilities', 'Excellent at reading between the lines', 'Natural counselor and advisor', 'Sees the big picture clearly'],
      weaknesses: ['May be seen as aloof or mysterious', 'Can overthink situations', 'Tendency to withdraw when overwhelmed', 'May struggle with practical details'],
      ideal_for: 'People who want to develop their intuition, work in strategic planning or counseling, or learn to trust their inner wisdom more.',
      growth_path: 'Your evolution path requires balancing your psychic insights with grounded action. Like the sun bringing clarity to shadows, learn to share your insights in ways others can understand and apply.'
    }
  },
  umbreon: {
    name: 'Umbreon',
    id: 197,
    type: 'Dark',
    method: 'Friendship + Night',
    color: '#705848',
    personality: {
      description: 'The mysterious guardian - You work from the shadows, protecting and observing with quiet strength.',
      strengths: ['Deep loyalty and protective instincts', 'Calm under pressure', 'Excellent observer of human nature', 'Strong sense of justice'],
      weaknesses: ['May seem unapproachable to others', 'Tendency to bottle up emotions', 'Can be overly suspicious', 'May struggle with expressing vulnerability'],
      ideal_for: 'People who want to develop inner strength, work in security or investigation fields, or learn to be comfortable with solitude and reflection.',
      growth_path: 'Your path illuminates the power found in darkness and quiet strength. Like the moon guiding travelers at night, learn to be a steady presence for others while remaining true to your mysterious nature.'
    }
  },
  leafeon: {
    name: 'Leafeon',
    id: 470,
    type: 'Grass',
    method: 'Leaf Stone',
    color: '#78C850',
    personality: {
      description: 'The natural healer - You grow steadily and help others flourish through patience and nurturing care.',
      strengths: ['Patient and steady growth mindset', 'Natural healer and nurturer', 'Strong connection to nature and cycles', 'Excellent at long-term planning'],
      weaknesses: ['May be too slow to act in urgent situations', 'Can be stubborn about changing methods', 'Tendency to avoid conflict', 'May neglect own needs while caring for others'],
      ideal_for: 'People who want to develop patience, work in healthcare or environmental fields, or learn to create sustainable, long-term success.',
      growth_path: 'Your evolution mirrors the steady growth of a tree - from seed to mighty oak. Learn that true strength comes from deep roots and the patience to grow sustainably, providing shelter and oxygen for others.'
    }
  },
  glaceon: {
    name: 'Glaceon',
    id: 471,
    type: 'Ice',
    method: 'Ice Stone',
    color: '#98D8D8',
    personality: {
      description: 'The precise perfectionist - You approach life with cool logic and crystalline clarity.',
      strengths: ['Excellent analytical and critical thinking', 'Maintains calm in chaotic situations', 'High attention to detail', 'Reliable and consistent performance'],
      weaknesses: ['May seem cold or unemotional to others', 'Can be overly critical of self and others', 'Tendency to perfectionism paralysis', 'May struggle with spontaneity'],
      ideal_for: 'People who want to develop analytical skills, work in technical or scientific fields, or learn to make decisions based on logic rather than emotion.',
      growth_path: 'Your evolution teaches the beauty of precision and the strength found in clarity. Like ice crystals forming perfect patterns, learn to appreciate both structure and the unique beauty in imperfection.'
    }
  },
  sylveon: {
    name: 'Sylveon',
    id: 700,
    type: 'Fairy',
    method: 'Fairy-type move + Friendship',
    color: '#EE99AC',
    personality: {
      description: 'The harmonious connector - You create bonds and bring out the best in everyone around you.',
      strengths: ['Exceptional at building relationships', 'Natural peacemaker and diplomat', 'Brings out the best in others', 'Creates harmony in group settings'],
      weaknesses: ['May avoid necessary conflicts', 'Can be hurt easily by criticism', 'Tendency to people-please', 'May lose sense of self in relationships'],
      ideal_for: 'People who want to improve their relationship skills, work in team leadership or human resources, or learn to create more harmonious environments.',
      growth_path: 'Your evolution represents the magic of connection and the fairy-tale ending that comes from bringing out the best in others. Learn to weave bonds that strengthen everyone involved while maintaining your own magical essence.'
    }
  }
};

const EeveeEvolutionPage: React.FC = () => {
  const { evolutionName } = useParams<{ evolutionName: string }>();
  const navigate = useNavigate();
  
  const evolution = evolutionName ? eeveeEvolutions[evolutionName.toLowerCase()] : null;
  
  if (!evolution) {
    return (
      <PageContainer themeColor="#A8A878">
        <BackButton
          themeColor="#A8A878"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Test
        </BackButton>
        <EvolutionCard themeColor="#A8A878">
          <h1>Evolution not found!</h1>
          <p>This Eevee evolution doesn't exist in our database.</p>
        </EvolutionCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer themeColor={evolution.color}>
      <BackButton
        themeColor={evolution.color}
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        ← Back to Test
      </BackButton>

      <EvolutionCard
        themeColor={evolution.color}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <EvolutionHeader>
          <EvolutionImage
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png`}
            alt={evolution.name}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
          />
          <EvolutionName themeColor={evolution.color}>
            {evolution.name}
          </EvolutionName>
          <EvolutionMethod themeColor={evolution.color}>
            Evolution Method: {evolution.method}
          </EvolutionMethod>
          <TypeBadge themeColor={evolution.color}>
            {evolution.type} Type
          </TypeBadge>
        </EvolutionHeader>

        <Section>
          <SectionTitle themeColor={evolution.color}>
            🌟 Personality Overview
          </SectionTitle>
          <SectionContent>
            {evolution.personality.description}
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle themeColor={evolution.color}>
            💪 Your Strengths
          </SectionTitle>
          <PersonalityList>
            {evolution.personality.strengths.map((strength, index) => (
              <PersonalityItem
                key={index}
                themeColor={evolution.color}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                {strength}
              </PersonalityItem>
            ))}
          </PersonalityList>
        </Section>

        <Section>
          <SectionTitle themeColor={evolution.color}>
            ⚠️ Potential Challenges
          </SectionTitle>
          <PersonalityList>
            {evolution.personality.weaknesses.map((weakness, index) => (
              <PersonalityItem
                key={index}
                themeColor={evolution.color}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                {weakness}
              </PersonalityItem>
            ))}
          </PersonalityList>
        </Section>

        <Section>
          <SectionTitle themeColor={evolution.color}>
            🎯 This Path Is Ideal For
          </SectionTitle>
          <SectionContent>
            {evolution.personality.ideal_for}
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle themeColor={evolution.color}>
            🦋 Your Growth Journey
          </SectionTitle>
          <SectionContent>
            {evolution.personality.growth_path}
          </SectionContent>
        </Section>
      </EvolutionCard>
    </PageContainer>
  );
};

export default EeveeEvolutionPage;