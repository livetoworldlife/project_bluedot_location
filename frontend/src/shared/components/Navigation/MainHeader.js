// 43-adding a main header
import React from 'react';
import './MainHeader.css';

export default function MainHeader(props) {
  return (
    <header className="main-header">
      {props.children}
    </header>
  )
}
