import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card/Card.jsx';
import { ChatContext } from '../store/ChatContext.jsx';
import { SCENARIOS } from '../data/electionData.js';
import './ScenariosPage.css';

export default function ScenariosPage() {
  const navigate = useNavigate();
  const { sendMessage } = useContext(ChatContext);

  const handleScenario = (scenario) => {
    sendMessage(scenario.question);
    navigate('/chat');
  };

  return (
    <main className="scenarios-page" role="main" aria-label="Scenario Simulations">
      <header className="scenarios-header">
        <h1>
          <span className="heading-neuro">What If</span>{' '}
          <span className="text-gradient">Scenarios</span>
        </h1>
        <p className="scenarios-subtitle">
          Explore real-world scenarios and understand what happens in different election situations.
          Click any scenario to get a detailed AI-powered explanation.
        </p>
      </header>

      <div className="scenarios-grid stagger-children">
        {SCENARIOS.map((scenario) => (
          <Card
            key={scenario.id}
            variant="bento"
            glow
            interactive
            onClick={() => handleScenario(scenario)}
            className="scenario-card animate-fade-in-up"
            ariaLabel={`Explore: ${scenario.title}`}
          >
            <div className="scenario-icon" aria-hidden="true">{scenario.icon}</div>
            <h3 className="scenario-title">{scenario.title}</h3>
            <p className="scenario-question">{scenario.question}</p>
            <div className="scenario-cta">
              <span>Explore →</span>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
