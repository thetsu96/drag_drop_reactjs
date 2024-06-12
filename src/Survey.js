import React, { useState, useEffect, useRef, useCallback } from 'react';

const Survey = () => {
  const [answers, setAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem('surveyAnswers');
    return savedAnswers ? JSON.parse(savedAnswers) : {
      mainQuestion1: '',
      subQuestion2: '',
      mainQuestion2: '',
      mainQuestion3: '',
      mainQuestion4: '',
      mainQuestion5: [],
      mainQuestion6: '',
      mainQuestion7: ''
    };
  });

  const [currentScreen, setCurrentScreen] = useState(() => {
    const savedScreen = localStorage.getItem('currentScreen');
    return savedScreen ? parseInt(savedScreen, 10) : 1;
  });

  const [screenHistory, setScreenHistory] = useState(() => {
    const savedHistory = localStorage.getItem('screenHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [remainingTime, setRemainingTime] = useState(60); // Initial remaining time in seconds (1 minute)
  const timeoutIdRef = useRef(null); // Ref to hold the timeout ID

  const saveToLocalStorage = useCallback(() => {
    localStorage.setItem('surveyAnswers', JSON.stringify(answers));
    localStorage.setItem('currentScreen', currentScreen.toString());
    localStorage.setItem('screenHistory', JSON.stringify(screenHistory));
  }, [answers, currentScreen, screenHistory]);

  const resetAnswers = useCallback(() => {
    setAnswers({
      mainQuestion1: '',
      subQuestion2: '',
      mainQuestion2: '',
      mainQuestion3: '',
      mainQuestion4: '',
      mainQuestion5: [],
      mainQuestion6: '',
      mainQuestion7: ''
    });
    setCurrentScreen(1); // Set current screen to Main Question 1 after resetting answers
    setScreenHistory([]);
    localStorage.removeItem('surveyAnswers');
    localStorage.removeItem('currentScreen');
    localStorage.removeItem('screenHistory');
    window.location.reload(); // Reload the page to reset the answers in UI
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('Clearing local storage after timeout');
      resetAnswers();
    }, remainingTime * 1000); // Timeout set based on remaining time

    saveToLocalStorage(); // Save data to local storage on component mount

    return () => {
      clearTimeout(timeoutId);
      console.log('Clearing timeout');
    };
  }, [answers, currentScreen, screenHistory, remainingTime, saveToLocalStorage, resetAnswers]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setAnswers((prevAnswers) => {
        const newMainQuestion5 = checked
          ? [...prevAnswers.mainQuestion5, value]
          : prevAnswers.mainQuestion5.filter((v) => v !== value);
        return {
          ...prevAnswers,
          mainQuestion5: newMainQuestion5
        };
      });
    } else {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [name]: value
      }));
    }

    clearTimeout(timeoutIdRef.current); // Reset the timeout on user interaction
    timeoutIdRef.current = setTimeout(() => {
      console.log('Clearing local storage after user interaction');
      resetAnswers();
    }, remainingTime * 1000);
  };

  useEffect(() => {
    if (remainingTime > 0) {
      const intervalId = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1); // Decrease remaining time by 1 second
      }, 1000); // Update every second

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [remainingTime]);
  
  const handleNext = () => {
    if (currentScreen === 1) {
      if (answers.mainQuestion1 === 'option1') {
        setCurrentScreen(2); // Link Option 1 to Main Question 2
      } else if (answers.mainQuestion1 === 'option2') {
        setCurrentScreen(3); // Link Option 2 to Sub-Question 2
      } else if (answers.mainQuestion1 === 'option3') {
        setCurrentScreen(4); // Link Option 3 to Main Question 4
      }
    } else if (currentScreen === 2) {
      setCurrentScreen(5); // Link Main Question 2 to Main Question 3
    } else if (currentScreen === 3) {
      if (answers.subQuestion2 === 'option2.1') {
        setCurrentScreen(6); // Link Option 2.1 to Main Question 5
      } else if (answers.subQuestion2 === 'option2.2') {
        setCurrentScreen(7); // Link Option 2.2 to Main Question 6
      } else if (answers.subQuestion2 === 'option2.3') {
        setCurrentScreen(8); // Link Option 2.3 to Main Question 7
      }
    } else if (currentScreen === 4) {
      setCurrentScreen(6); // Link Main Question 4 to Main Question 5
    } else if (currentScreen === 5) {
      setCurrentScreen(8); // Link Main Question 3 to Main Question 7
    } else if (currentScreen === 6) {
      setCurrentScreen(7); // Link Main Question 5 to Main Question 6
    } else if (currentScreen === 7) {
      setCurrentScreen(8); // Link Main Question 6 to Main Question 7
    }
    setScreenHistory([...screenHistory, currentScreen]); // Add current screen to history
  };

  const handleBack = () => {
    if (screenHistory.length > 0) {
      const prevScreen = screenHistory.pop(); // Get the previous screen from history
      setCurrentScreen(prevScreen);
      setScreenHistory([...screenHistory]); // Update history
    }
  };

  return (
    <div>
      <h1>Survey</h1>
      <div>Remaining Time: {remainingTime} seconds</div>

      {currentScreen === 1 && (
        <div>
          {/* Main Question 1 */}
          <label>
            1. What is your favorite color?
            <div>
              <input
                type="radio"
                name="mainQuestion1"
                value="option1"
                checked={answers.mainQuestion1 === 'option1'}
                onChange={handleChange}
              />
              Option 1
            </div>
            <div>
              <input
                type="radio"
                name="mainQuestion1"
                value="option2"
                checked={answers.mainQuestion1 === 'option2'}
                onChange={handleChange}
              />
              Option 2
            </div>
            <div>
              <input
                type="radio"
                name="mainQuestion1"
                value="option3"
                checked={answers.mainQuestion1 === 'option3'}
                onChange={handleChange}
              />
              Option 3
            </div>
          </label>
          <button onClick={handleNext} disabled={!answers.mainQuestion1}>
            Next
          </button>
        </div>
      )}

      {currentScreen === 2 && (
        <div>
          {/* Main Question 2 */}
          <label>
            2. What is your favorite food?
            <input
              type="text"
              name="mainQuestion2"
              value={answers.mainQuestion2}
              onChange={handleChange}
            />
          </label>
          <button onClick={handleBack}>Back</button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {currentScreen === 3 && (
        <div>
          {/* Sub-Question 2 */}
          <label>
            What is your favorite activity?
            <div>
              <input
                type="radio"
                name="subQuestion2"
                value="option2.1"
                checked={answers.subQuestion2 === 'option2.1'}
                onChange={handleChange}
              />
              Option 2.1
            </div>
            <div>
              <input
                type="radio"
                name="subQuestion2"
                value="option2.2"
                checked={answers.subQuestion2 === 'option2.2'}
                onChange={handleChange}
              />
              Option 2.2
            </div>
            <div>
              <input
                type="radio"
                name="subQuestion2"
                value="option2.3"
                checked={answers.subQuestion2 === 'option2.3'}
                onChange={handleChange}
              />
              Option 2.3
            </div>
          </label>
          <button onClick={handleBack}>Back</button>
          <button onClick={handleNext} disabled={!answers.subQuestion2}>Next</button>
        </div>
      )}

      {currentScreen === 4 && (
        <div>
          {/* Main Question 4 */}
          <label>
            4. What is your favorite movie?
            <input
              type="text"
              name="mainQuestion4"
              value={answers.mainQuestion4}
              onChange={handleChange}
            />
          </label>
          <button onClick={handleBack}>Back</button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {currentScreen === 5 && (
        <div>
          {/* Main Question 3 */}
          <label>
            3. What is your favorite book?
            <input
              type="text"
              name="mainQuestion3"
              value={answers.mainQuestion3}
              onChange={handleChange}
            />
          </label>
          <button onClick={handleBack}>Back</button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {currentScreen === 6 && (
        <div>
          {/* Main Question 5 */}
          <label>
            5. What are your favorite activities?
            <div>
              <input
                type="checkbox"
                name="mainQuestion5"
                value="activity1"
                checked={answers.mainQuestion5.includes('activity1')}
                onChange={handleChange}
              />
              Activity 1
            </div>
            <div>
              <input
                type="checkbox"
                name="mainQuestion5"
                value="activity2"
                checked={answers.mainQuestion5.includes('activity2')}
                onChange={handleChange}
              />
              Activity 2
            </div>
            <div>
              <input
                type="checkbox"
                name="mainQuestion5"
                value="activity3"
                checked={answers.mainQuestion5.includes('activity3')}
                onChange={handleChange}
              />
              Activity 3
            </div>
          </label>
          <button onClick={handleBack}>Back</button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {currentScreen === 7 && (
        <div>
          {/* Main Question 6 */}
          <label>
            6. What is your preferred mode of transport?
            <div>
              <input
                type="radio"
                name="mainQuestion6"
                value="car"
                checked={answers.mainQuestion6 === 'car'}
                onChange={handleChange}
              />
              Car
            </div>
            <div>
              <input
                type="radio"
                name="mainQuestion6"
                value="bike"
                checked={answers.mainQuestion6 === 'bike'}
                onChange={handleChange}
              />
              Bike
            </div>
            <div>
              <input
                type="radio"
                name="mainQuestion6"
                value="publicTransport"
                checked={answers.mainQuestion6 === 'publicTransport'}
                onChange={handleChange}
              />
              Public Transport
            </div>
          </label>
          <button onClick={handleBack}>Back</button>
          <button onClick={handleNext} disabled={!answers.mainQuestion6}>Next</button>
        </div>
      )}

      {currentScreen === 8 && (
        <div>
          {/* Main Question 7 */}
          <label>
            7. How do you like to relax?
            <input
              type="text"
              name="mainQuestion7"
              value={answers.mainQuestion7}
              onChange={handleChange}
            />
          </label>
          <button onClick={handleBack}>Back</button>
          <button onClick={() => alert('Survey completed!')}>Finish</button>
        </div>
      )}
    </div>
  );
};

export default Survey;
