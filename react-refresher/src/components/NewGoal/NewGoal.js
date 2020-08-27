import React, { useState } from 'react';

import './NewGoal.css';

const NewGoal = props => {
  const [enteredText, setEnteredText] = useState('');

  // submit form handler
  const addGoalHandler = event => {
    //console.log(event.target);
    event.preventDefault();

    const newGoal = {
      id: Math.random().toString(),
      text: enteredText
    };
    //clear last input area
    setEnteredText('');
    props.onAddGoal(newGoal);
  };
  // input event handler
  const textChangeHandler = event => { setEnteredText(event.target.value); };
  //30-handle events
  return (
    <form className="new-goal" onSubmit={addGoalHandler}>
      <input type="text" value={enteredText} onChange={textChangeHandler} />
      <button type="submit">Add Goal</button>
    </form>
  );
};

export default NewGoal;
