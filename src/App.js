import React from 'react';
import { UserProvider, useUserContext } from './context/UserContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Header from './components/Header'; // for public pages
import Footer from './components/Footer'; // for public pages
import Search from './pages/Search';
import Finalize from './pages/Finalize';
import Settings from './pages/Settings';
import SMM from './pages/SMM';
import { SearchProvider } from "./context/SearchContext";
import Drafts from './pages/Drafts';
import Email from './pages/Email';
import SEO from './pages/SEO';
import SMS from './pages/SMS'

function App() {
  return (
    <UserProvider>
      <SearchProvider>
      <Router>
        <div className="App flex flex-col min-h-screen">
          <main className="flex-grow">
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route
                path="/"
                element={<RedirectBasedOnLogin />}
              />
              <Route path="/homepage" element={<PublicLayout><HomePage /></PublicLayout>} />
              <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
              <Route path="/signup" element={<PublicLayout><Register /></PublicLayout>} />

              {/* PROTECTED ROUTES */}
              <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
              <Route path="/search/finalize" element={<PrivateRoute><Finalize /></PrivateRoute>} />
              <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
              <Route path="/smm" element={<SMM />} />
              <Route path="/drafts" element={<Drafts />} />
              <Route path="/seo" element={<SEO />} />
              <Route path="/sms" element={<SMS />} />
              <Route path="/email" element={<Email />} />
            </Routes>
          </main>
        </div>
      </Router>
      </SearchProvider>
    </UserProvider>
  );
}

// Redirect '/' based on login
const RedirectBasedOnLogin = () => {
  const { user } = useUserContext();
  return user ? <Navigate to="/search" /> : <Navigate to="/homepage" />;
};

// Authenticated route wrapper
const PrivateRoute = ({ children }) => {
  const { user } = useUserContext();
  return user ? children : <Navigate to="/homepage" />;
};

// Public layout with header/footer
const PublicLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default App;
