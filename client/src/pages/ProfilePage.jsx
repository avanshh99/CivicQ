import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.js';
import { AuthContext } from '../store/AuthContext.jsx';
import Card from '../components/Card/Card.jsx';
import { GameBadge, ProgressBar } from '../components/Badge/Badge.jsx';
import { GAMIFICATION_BADGES } from '../data/electionData.js';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoadingProfile(false);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setProfile(snap.data());
      }
      setLoadingProfile(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  if (!user) {
    return (
      <main className="profile-page" role="main" aria-label="User Profile">
        <div className="profile-empty">
          <div className="profile-empty-icon">🔒</div>
          <h2>Sign in to view your profile</h2>
          <p>Track your learning progress, earn badges, and save your chat history.</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </main>
    );
  }

  const questionsAsked = profile?.questionsAsked || 0;
  const stepsCompleted = profile?.stepsCompleted || 0;
  const unlockedBadges = profile?.badges || ['first-step'];
  const totalSteps = 6;
  const memberSince = profile?.createdAt?.toDate?.()?.toLocaleDateString() || 'Today';

  return (
    <main className="profile-page" role="main" aria-label="User Profile">
      <header className="profile-header">
        <h1>
          <span className="heading-neuro">Your</span>{' '}
          <span className="text-gradient">Profile</span>
        </h1>
      </header>

      <div className="profile-grid">
        {/* User Info */}
        <Card variant="neuro" className="profile-user-card">
          <div className="profile-avatar-wrapper">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="profile-avatar-img"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="profile-avatar">
                {(user.displayName || 'U')[0].toUpperCase()}
              </div>
            )}
            <div className="profile-online-dot" />
          </div>
          <h2>{user.displayName || 'User'}</h2>
          <p className="text-muted">{user.email}</p>
          <p className="profile-member-since">Member since {memberSince}</p>
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-value">{questionsAsked}</span>
              <span className="profile-stat-label">Questions</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">{stepsCompleted}</span>
              <span className="profile-stat-label">Steps Done</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">{unlockedBadges.length}</span>
              <span className="profile-stat-label">Badges</span>
            </div>
          </div>
          <button className="btn btn-secondary profile-logout-btn" onClick={logout}>
            Sign Out
          </button>
        </Card>

        {/* Progress */}
        <Card variant="neuro" className="profile-progress-card">
          <h3>Learning Progress</h3>
          <div className="profile-progress-items">
            <ProgressBar value={stepsCompleted} max={totalSteps} label="Walkthrough" />
            <ProgressBar value={questionsAsked} max={10} label="Questions Asked" />
            <ProgressBar value={unlockedBadges.length} max={GAMIFICATION_BADGES.length} label="Badges Earned" />
          </div>
        </Card>

        {/* Badges */}
        <Card variant="neuro" className="profile-badges-card">
          <h3>Badges</h3>
          <div className="profile-badges-grid">
            {GAMIFICATION_BADGES.map((badge) => (
              <GameBadge
                key={badge.id}
                icon={badge.icon}
                label={badge.label}
                unlocked={unlockedBadges.includes(badge.id)}
              />
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
