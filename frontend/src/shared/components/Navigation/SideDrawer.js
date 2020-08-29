//45-
import React from 'react';
import ReactDOM from 'react-dom';
import './SideDrawer.css';
//48-animation sidedrawer
import { CSSTransition } from 'react-transition-group';

export default function SideDrawer(props) {
  //46-portal
  const content = (
    < CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit>
      <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>
    </CSSTransition >);
  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};
