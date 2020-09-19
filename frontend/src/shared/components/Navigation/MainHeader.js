// 43-adding a main header
import React from 'react';
import './MainHeader.css';

const MainHeader = props => {
  return <header className="main-header">{props.children}</header>;
};

export default MainHeader;
// containment  https://reactjs.org/docs/composition-vs-inheritance.html