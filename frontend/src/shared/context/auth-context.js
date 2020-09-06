// 71-adding auth context
import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  login: () => { },
  logout: () => { }
});
