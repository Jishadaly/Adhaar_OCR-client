import { createBrowserRouter } from 'react-router-dom';
import Landing from '../Page/Landing';
import SignUp from '../Page/Signup';
import SignIn from '../Page/Login';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Landing />
  },
  {
    path:'/signup',
    element:<SignUp/>
  },
  {
    path:'/login',
    element:<SignIn/>
  }
]);

export default appRouter;
