import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Styled Components
const TimerContainer = styled.div`
  font-size: 2em;
  font-weight: bold;
  color: #ff4500; /* Or any color you prefer */
  padding: 10px 20px;
  border: 2px solid #ff4500;
  border-radius: 10px;
  display: inline-block;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Timer = ({ timeLeft, onTimeUp }) => {
  const [time, setTime] = useState(timeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        localStorage.setItem('timeLeft', prevTime - 1);
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp]);

  useEffect(()=>{
    const timeLeft=localStorage.getItem('timeLeft');
    setTime(timeLeft);
  }, []);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <TimerContainer>
      {minutes}:{seconds < 10 ? '0' : ''}{seconds}
    </TimerContainer>
  );
};

export default Timer;
