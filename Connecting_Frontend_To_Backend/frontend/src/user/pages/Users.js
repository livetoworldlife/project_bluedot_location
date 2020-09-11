// 39- send user data to UsersList components
import React, { useEffect, useState } from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';      // 149- getting users with a  get request
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import UsersList from '../components/UsersList';
import { useHttpClient } from '../../shared/hooks/http-hook';       // 152 - using the http-hook to get users

const Users = () => {
  // 149- getting users with a  get request
  const [loadedUsers, setLoadedUsers] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();    // 152 - using the http-hook to get users


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest('http://localhost:5000/api/users');  // 152 - using the http-hook to get users
        setLoadedUsers(responseData.users);
      } catch (error) {
      };
    };
    fetchUsers();
  }, [sendRequest])

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>)}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
