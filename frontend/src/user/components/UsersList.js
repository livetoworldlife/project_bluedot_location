//39- adding UsrList page-component
import React from 'react';
import UserItem from './UserItem';
import './UsersList.css';
//43-
import Card from '../../shared/components/UIElements/Card';

// const UsersList = props => {
//   // if there is no user -USE TERNARY EXPRESSION
//   if (props.items.length === 0) {
//     return (
//       <div className="center">
//         <h2>No users found.</h2>
//       </div>
//     );
//   }

//   return (
//     <ul className="users-list">
//       {props.items.map(user => (
//         <UserItem
//           key={user.id}
//           id={user.id}
//           image={user.image}
//           name={user.name}
//           placeCount={user.places}
//         />
//       ))}
//     </ul>
//   );
// };


const UsersList = props => {
  // if there is no user -USE TERNARY EXPRESSION


  return (
    props.items.length === 0 ?
      (
        <div className="center">
          <Card>
            <h2>No users found.</h2>
          </Card>
        </div>
      ) :

      <ul className="users-list">
        {props.items.map(user => (
          <UserItem
            key={user.id}
            id={user.id}
            image={user.image}
            name={user.name}
            placeCount={user.places}
          />
        ))}
      </ul>
  );
};









export default UsersList;
