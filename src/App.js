import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams, Navigate } from 'react-router-dom';
import Question from './components/Question';
import Timer from './components/Timer';
import Score from './components/Score';
import styled from "styled-components";
import './styles.css';


const CenterDiv = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(239, 239, 239);
  flex-direction: column;
`;

const InnerDiv=styled.div`
  width: 50%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background:  #1a1a4b;
  outline: 3px solid #1a1a4b;
  outline-offset: 5px;
`;

const FancyText=styled.h1`
  font-family: 'Dancing Script', cursive;
  font-size: 3em;
  font-weight: bold;
  background: linear-gradient(45deg, #ff0066, #ffcc00, #00ccff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  display: inline-block;
  font-weight: bold;
`;

const GradientButton = styled.button`
  font-size: 1.5em;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: linear-gradient(45deg, #ff0066, #ffcc00, #00ccff);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(45deg, #00ccff, #ffcc00, #ff0066);
    transform: scale(1.1);
  }
`;

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [fullscreenEnabled, setFullscreenEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/questions.json')
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(error => console.error('Error fetching questions:', error));

    const savedIndex = localStorage.getItem('currentQuestionIndex');
    const savedTime = localStorage.getItem('timeLeft');
    const savedAnswers = JSON.parse(localStorage.getItem('answers')) || [];

    if (savedIndex) setCurrentQuestionIndex(Number(savedIndex));
    if (savedTime) setTimeLeft(Number(savedTime));
    setAnswers(savedAnswers);

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenEnabled(false);
        alert('Please enable fullscreen mode to continue the quiz.');
      } else {
        setFullscreenEnabled(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const requestFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
      document.documentElement.msRequestFullscreen();
    }
  };

  const handleAnswer = (answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = answer;
    setAnswers(updatedAnswers);
    localStorage.setItem('answers', JSON.stringify(updatedAnswers));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      localStorage.setItem('currentQuestionIndex', currentQuestionIndex + 1);
      navigate(`/question/${currentQuestionIndex + 1}`);
    } else {
      calculateScore(updatedAnswers);
    }
  };

  const calculateScore = (answers) => {
    const score = answers.reduce((score, answer, index) => {
      return score + (answer === questions[index].answer ? 1 : 0);
    }, 0);
    setScore(score);
    localStorage.removeItem('currentQuestionIndex');
    localStorage.removeItem('timeLeft');
    localStorage.removeItem('answers');
    navigate('/score');
  };

  const handleTimeUp = () => {
    alert('Time is up!');
    calculateScore(answers);
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  if (!fullscreenEnabled) {
    return (
      <CenterDiv>
        <InnerDiv>
          <FancyText>
            Welcome to the Quiz App
          </FancyText>
          <GradientButton onClick={requestFullscreen}>Enable Fullscreen to Start Quiz</GradientButton>
        </InnerDiv>
      </CenterDiv>
    );
  }

  return (
    <div className="App">
      <CenterDiv>
      {score === null ? (
        <>
          <Timer timeLeft={timeLeft} onTimeUp={handleTimeUp} />
          <Routes>
            <Route
              path="/question/:index"
              element={<QuestionPage questions={questions} currentQuestionIndex={currentQuestionIndex} handleAnswer={handleAnswer} />}
            />
            <Route path="*" element={<Navigate to={`/question/${currentQuestionIndex}`} replace />} />
          </Routes>
        </>
      ) : (
        <Score score={score} totalQuestions={questions.length} />
      )}
      </CenterDiv>
    </div>
  );
};

const QuestionPage = ({ questions, currentQuestionIndex, handleAnswer }) => {
  const { index } = useParams();
  useEffect(() => {
    if (questions.length > 0 && Number(index) !== currentQuestionIndex) {
      handleAnswer(null);
    }
  }, [index, questions, currentQuestionIndex, handleAnswer]);

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Question
      question={questions[currentQuestionIndex].question}
      options={questions[currentQuestionIndex].options}
      onAnswer={handleAnswer}
      currentQuestionIndex={currentQuestionIndex}
    />
  );
};

export default App;
