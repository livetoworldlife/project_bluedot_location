// 71-adding auth context
import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,                          // 179-using and attaching token in React user
  login: () => { },
  logout: () => { }
});
