import React from 'react';
import styled from 'styled-components';

// Styled Components
const ScoreContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 20px auto;
  text-align: center;
`;

const ScoreHeading = styled.h2`
  font-size: 2em;
  color: #007bff;
  margin-bottom: 20px;
`;

const ScoreText = styled.p`
  font-size: 1.5em;
  color: #333;
`;

const Score = ({ score, totalQuestions }) => {
  return (
    <ScoreContainer>
      <ScoreHeading>Your Score</ScoreHeading>
      <ScoreText>
        {score} out of {totalQuestions}
      </ScoreText>
    </ScoreContainer>
  );
};

export default Score;