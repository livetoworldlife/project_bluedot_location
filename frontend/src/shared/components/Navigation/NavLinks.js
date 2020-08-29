// 44-
import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavLinks.css';

export default function NavLinks() {
  return (
    <ul className="nav-links">
      <li>
        <NavLink to='/' exact>ALL USERS</NavLink>
      </li>
      <li>
        <NavLink to='/u1/places'>MY USERS</NavLink>
      </li>
      <li>
        <NavLink to='/places/new'>ADD PLACE</NavLink>
      </li>
      <li>
        <NavLink to='/auth'>AUTHENTICATE</NavLink>
      </li>
    </ul>
  )
}
