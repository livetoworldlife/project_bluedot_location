// 187- Creating a Custom Authentication Hook
import { useState, useCallback, useEffect } from 'react';

let logoutTimer;                                        // 186 - Finished Auto-Login & Auto-Logout

export const useAuth = () => {
  // 71-adding auth context
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(); // 186 - Finished Auto-Login & Auto-Logout
  const [userId, setUserId] = useState(false);    // 153- adding places POST

  const login = useCallback((uid, token, expirationDate) => {           // 179-using and attaching token in React user
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);   // 185 managing the token expiration date
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(                                               //183- storing the token in the browser storage
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {                                 //  186 - Finished Auto-Login & Auto-Logout
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {                                 // 184-adding auto token info from browser
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  return { token, login, logout, userId };
};