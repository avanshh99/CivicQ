import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Confetti from 'react-confetti';
import Button from '../components/Button/Button.jsx';
import Card from '../components/Card/Card.jsx';
import { ProgressBar } from '../components/Badge/Badge.jsx';
import { ELECTION_STEPS } from '../data/electionData.js';
import './WalkthroughPage.css';

export default function WalkthroughPage() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [eli5Mode, setEli5Mode] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const step = ELECTION_STEPS[currentStep];
  const progress = (completedSteps.size / ELECTION_STEPS.length) * 100;
  const isCompleted = progress === 100;

  const goToStep = (idx) => {
    setCurrentStep(idx);
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
  };

  const nextStep = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    if (currentStep < ELECTION_STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const renderContent = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\- (.*$)/gm, '• $1')
      .replace(/^\d+\. /gm, (m) => m);
  };

  return (
    <main className="walkthrough-page" role="main" aria-label="Election walkthrough">
      {isCompleted && (
        <Confetti 
          width={windowSize.width} 
          height={windowSize.height} 
          recycle={false} 
          numberOfPieces={400} 
          gravity={0.15}
        />
      )}
      <header className="walkthrough-header">
        <h1>
          <span className="heading-neuro">{t('walkthroughPage.title')}</span>{' '}
          <span className="text-gradient">{t('walkthroughPage.titleAccent')}</span>
        </h1>
        <p>{t('walkthroughPage.subtitle')}</p>
      </header>

      {/* Progress */}
      <div className="walkthrough-progress">
        <div className="walkthrough-progress-steps" role="tablist" aria-label="Walkthrough steps">
          {ELECTION_STEPS.map((s, i) => (
            <button
              key={s.id}
              className={`progress-step-dot ${
                i === currentStep ? 'progress-step-dot-active' :
                completedSteps.has(i) ? 'progress-step-dot-completed' :
                'progress-step-dot-upcoming'
              }`}
              onClick={() => goToStep(i)}
              role="tab"
              aria-selected={i === currentStep}
              aria-label={`Step ${i + 1}: ${s.title}`}
              title={s.title}
            >
              {completedSteps.has(i) ? '✓' : s.icon}
            </button>
          ))}
        </div>
        <ProgressBar value={progress} max={100} label={t('walkthroughPage.progressLabel')} />
      </div>

      {/* Step Detail */}
      <div className="step-detail" key={currentStep} role="tabpanel" aria-label={step.title}>
        <Card variant="glass" className="step-detail-card">
          <div className="step-detail-header">
            <div className="step-detail-icon" aria-hidden="true">{step.icon}</div>
            <div className="step-detail-meta">
              <h2>{step.title}</h2>
              <p>{step.subtitle}</p>
            </div>
          </div>

          {/* ELI5 Toggle */}
          <div className="eli5-toggle">
            <span className={`eli5-toggle-label ${!eli5Mode ? 'active' : ''}`}>📚 {t('walkthroughPage.officialDetails')}</span>
            <button
              className={`toggle-switch ${eli5Mode ? 'active' : ''}`}
              onClick={() => setEli5Mode(!eli5Mode)}
              role="switch"
              aria-checked={eli5Mode}
              aria-label="Toggle simple explanation mode"
            />
            <span className={`eli5-toggle-label ${eli5Mode ? 'active' : ''}`}>🧒 {t('walkthroughPage.explainSimple')}</span>
          </div>

          <div className="step-content" dangerouslySetInnerHTML={{
            __html: renderContent(eli5Mode ? step.eli5 : step.detailed)
          }} />

          {step.keyFacts && (
            <div className="step-facts">
              <h4>💡 Key Facts</h4>
              <ul>
                {step.keyFacts.map((fact, i) => (
                  <li key={i}>{fact}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="step-nav">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
            icon="←"
          >
            {t('walkthroughPage.backBtn')}
          </Button>
          <Button
            variant="primary"
            onClick={nextStep}
            iconRight="→"
          >
            {currentStep === ELECTION_STEPS.length - 1 ? t('walkthroughPage.finishBtn') : t('walkthroughPage.nextBtn')}
          </Button>
        </div>
      </div>
    </main>
  );
}
