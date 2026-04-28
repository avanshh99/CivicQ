import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext.jsx';
import Card from '../components/Card/Card.jsx';
import { GameBadge, ProgressBar } from '../components/Badge/Badge.jsx';
import { GAMIFICATION_BADGES } from '../data/electionData.js';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  // Mock progress data
  const unlockedBadges = ['first-step', 'registration-pro'];
  const questionsAsked = 7;
  const stepsCompleted = 3;
  const totalSteps = 6;

  return (
    <main className="profile-page" role="main" aria-label="User Profile">
      <header className="profile-header">
        <h1>
          <span className="heading-neuro">Your</span>{' '}
          <span className="text-gradient">Progress</span>
        </h1>
      </header>

      <div className="profile-grid">
        {/* User Info */}
        <Card variant="glass" className="profile-user-card">
          <div className="profile-avatar">
            {(user?.displayName || 'G')[0].toUpperCase()}
          </div>
          <h2>{user?.displayName || 'Guest User'}</h2>
          <p className="text-muted">{user?.email || 'guest@civicq.com'}</p>
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
        </Card>

        {/* Progress */}
        <Card variant="glass" className="profile-progress-card">
          <h3>Learning Progress</h3>
          <div className="profile-progress-items">
            <ProgressBar value={stepsCompleted} max={totalSteps} label="Walkthrough" />
            <ProgressBar value={questionsAsked} max={10} label="Questions Asked" />
            <ProgressBar value={unlockedBadges.length} max={GAMIFICATION_BADGES.length} label="Badges Earned" />
          </div>
        </Card>

        {/* Badges */}
        <Card variant="glass" className="profile-badges-card">
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
