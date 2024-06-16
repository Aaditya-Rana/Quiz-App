import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 20px auto;
`;

const QuestionText = styled.h2`
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #333;
`;

const OptionContainer = styled.div`
  margin-bottom: 10px;
`;

const OptionInput = styled.input`
  margin-right: 10px;
`;

const OptionLabel = styled.label`
  font-size: 1em;
  color: #555;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const Question = ({ question, options, onAnswer, currentQuestionIndex }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setSelectedOption(null);
  }, [question]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      onAnswer(selectedOption);
    } else {
      alert('Please select an option before submitting.');
    }
  };

  return (
    <Container>
      <QuestionText>{currentQuestionIndex + 1}. {question}</QuestionText>
      <form>
        {options.map((option, index) => (
          <OptionContainer key={index}>
            <OptionInput
              type="radio"
              id={`option-${index}`}
              name="question-option"
              value={option}
              checked={selectedOption === option}
              onChange={handleOptionChange}
            />
            <OptionLabel htmlFor={`option-${index}`}>{option}</OptionLabel>
          </OptionContainer>
        ))}
      </form>
      <SubmitButton type="button" onClick={handleSubmit}>Submit</SubmitButton>
    </Container>
  );
};

export default Question;
