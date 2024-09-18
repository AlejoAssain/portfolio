import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './providers';

const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <LanguageProvider>
        <App />
      </LanguageProvider>
    ),
  },
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);
