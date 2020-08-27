import React from 'react';

import './GoalList.css';

// 28-using 
const GoalList = props => {
  console.log(props);
  return (
    // 29-rendering lists of data
    <ul className="goal-list">
      {props.goals.map(goal => {
        return <li key={goal.id}>{goal.text}</li>;
      })}
    </ul>
  );
};

export default GoalList;
