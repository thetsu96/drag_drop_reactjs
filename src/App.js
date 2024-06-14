import React, { useState } from 'react';
import './App.css';

function App() {
  const initialQuestions = [
    {
      id: 1,
      mainQuestion: "Main Question 1",
      subQuestions: [
        { id: "1.1", question: "Sub Question 1.1", options: ["Option 1", "Option 2", "Option 3"], checked: [], text: "" },
        { id: "1.2", question: "Sub Question 1.2", options: ["Option A", "Option B", "Option C"], checked: [], text: "" },
        { id: "1.3", question: "Sub Question 1.3", options: ["Option D", "Option E", "Option F"], checked: [], text: "" }

      ]
    },
    {
      id: 2,
      mainQuestion: "Main Question 2",
      subQuestions: [
        { id: "2.1", question: "Sub Question 2.1", options: ["Yes", "No"], checked: [], text: "" },
        { id: "2.2", question: "Sub Question 2.2", options: ["True", "False"], checked: [], text: "" },
        { id: "2.3", question: "Sub Question 2.3", options: ["Yes", "No"], checked: [], text: "" },
        { id: "2.4", question: "Sub Question 2.4", options: ["True", "False"], checked: [], text: "" }
      ]
    }
  ];

  const [questions, setQuestions] = useState(initialQuestions);
  const [draggedItem, setDraggedItem] = useState(null);

  const onDragStart = (e, mainIndex, subIndex) => {
    setDraggedItem({ mainIndex, subIndex });
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, mainIndex, subIndex) => {
    e.preventDefault();
    const draggedFrom = draggedItem;
    const draggedTo = { mainIndex, subIndex };

    if (
      draggedFrom.mainIndex === draggedTo.mainIndex &&
      draggedFrom.subIndex === draggedTo.subIndex
    ) {
      return;
    }

    const updatedQuestions = [...questions];
    const itemToMove = updatedQuestions[draggedFrom.mainIndex].subQuestions.splice(draggedFrom.subIndex, 1)[0];
    updatedQuestions[draggedTo.mainIndex].subQuestions.splice(draggedTo.subIndex, 0, itemToMove);

    // Update IDs based on new order
    updatedQuestions.forEach((question) => {
      question.subQuestions.forEach((subQuestion, index) => {
        subQuestion.id = `${question.id}.${index + 1}`;
      });
    });

    setQuestions(updatedQuestions);
    setDraggedItem(null);
  };

  const handleCheckboxChange = (mainIndex, subIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[mainIndex].subQuestions[subIndex].checked[optionIndex] = !updatedQuestions[mainIndex].subQuestions[subIndex].checked[optionIndex];

    setQuestions(updatedQuestions);
  };

  const handleTextboxChange = (mainIndex, subIndex, text) => {
    const updatedQuestions = [...questions];
    updatedQuestions[mainIndex].subQuestions[subIndex].text = text;

    setQuestions(updatedQuestions);
  };

  return (
    <div className="App">
      {questions.map((mainQuestion, mainIndex) => (
        <div key={mainQuestion.id}>
          <div className="main-question">{mainQuestion.mainQuestion}</div>
          {mainQuestion.subQuestions.map((subQuestion, subIndex) => (
            <div
              key={subQuestion.id}
              className="draggable"
              draggable
              onDragStart={(e) => onDragStart(e, mainIndex, subIndex)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, mainIndex, subIndex)}
            >
              <div className="drag-handle">≡</div>
              <div className="id">ID: {subQuestion.id}</div>
              <div className="question">{subQuestion.question}</div>
              <div className="options">
                {subQuestion.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="option">
                    <input
                      type={subQuestion.checked[optionIndex] ? "checkbox" : "radio"}
                      checked={subQuestion.checked[optionIndex]}
                      onChange={() => handleCheckboxChange(mainIndex, subIndex, optionIndex)}
                    />
                    {option}
                  </div>
                ))}
              </div>
              <div className="text">
                <input
                  type="text"
                  value={subQuestion.text}
                  onChange={(e) => handleTextboxChange(mainIndex, subIndex, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
