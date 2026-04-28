import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext.jsx';
import Button from '../components/Button/Button.jsx';
import Card from '../components/Card/Card.jsx';
import './LoginPage.css';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await signup(email, password, name);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page" role="main" aria-label="Authentication">
      <div className="login-bg" aria-hidden="true">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
      </div>

      <Card variant="glass" className="login-card animate-scale-in">
        <div className="login-logo" aria-hidden="true">🏛️</div>
        <h1 className="login-title">
          {isSignUp ? 'Join CivicQ' : 'Welcome Back'}
        </h1>
        <p className="login-subtitle">
          {isSignUp ? 'Create an account to track your learning progress' : 'Sign in to continue your civic learning journey'}
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </div>

          {error && (
            <div className="form-error" role="alert">{error}</div>
          )}

          <Button type="submit" variant="primary" loading={loading} className="login-submit">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <Button variant="secondary" className="login-google" icon="🔵" onClick={() => { login('demo@civicq.com', 'demo'); navigate('/'); }}>
          Continue as Guest
        </Button>

        <p className="login-switch">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button className="login-switch-btn" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </Card>
    </main>
  );
}
