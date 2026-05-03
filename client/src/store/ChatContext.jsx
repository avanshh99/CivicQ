import { createContext, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
export const ChatContext = createContext({
  messages: [],
  isLoading: false,
  sendMessage: () => {},
  clearMessages: () => {},
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * ChatProvider — Manages chat state with AI backend
 * Falls back to built-in responses when backend is unavailable
 */
export function ChatProvider({ children }) {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Welcome to **CivicQ**! 🏛️ I'm your AI election assistant.\n\nI can help you understand:\n- 📋 How voter registration works\n- 🗳️ The voting process step by step\n- 📅 Important election timelines & deadlines\n- 🔮 \"What if\" scenarios\n\nAsk me anything about elections, or try one of the suggestions below!",
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Built-in response system for when backend is unavailable
  const getOfflineResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('register') || q.includes('registration')) {
      return `## 📋 Voter Registration\n\nHere's how voter registration typically works:\n\n**1. Check Eligibility**\n- Must be a citizen of the country\n- Must meet minimum age requirement (usually 18)\n- Must be a resident of the constituency\n\n**2. Gather Documents**\n- Valid ID proof (Aadhaar, Passport, etc.)\n- Address proof\n- Passport-size photograph\n\n**3. Apply**\n- **Online**: Visit the Election Commission website\n- **Offline**: Visit your nearest Electoral Registration Office\n- Fill Form 6 for new registration\n\n**4. Verification**\n- A Booth Level Officer (BLO) may visit for verification\n- Check your name on the voter list before election day\n\n**⏰ Deadline**: Registration closes approximately 2-3 weeks before election day.\n\nWould you like to know more about any specific step?`;
    }

    if (q.includes('vote') || q.includes('voting') || q.includes('how do i vote')) {
      return `## 🗳️ How Voting Works\n\n**On Election Day:**\n\n1. **Find Your Polling Station** — Check your voter slip or the Election Commission website for your designated booth.\n\n2. **Carry Valid ID** — Bring your Voter ID card (EPIC) or any approved photo ID.\n\n3. **Arrive & Queue** — Polling hours are typically 7 AM to 6 PM. Join the queue at your booth.\n\n4. **Verification** — Officials verify your identity and check your name on the voter roll.\n\n5. **Indelible Ink** — Your left index finger is marked with indelible ink to prevent duplicate voting.\n\n6. **Cast Your Vote** — Enter the booth, press the button next to your preferred candidate on the EVM (Electronic Voting Machine).\n\n7. **VVPAT Verification** — A paper slip shows your vote for 7 seconds before dropping into the VVPAT box.\n\n8. **Exit** — Your vote is recorded! Results are announced on counting day.\n\n**🔒 Your vote is secret and secure.**`;
    }

    if (q.includes('timeline') || q.includes('when') || q.includes('deadline') || q.includes('date')) {
      return `## 📅 Typical Election Timeline\n\n| Phase | Timeframe | Activity |\n|-------|-----------|----------|\n| **T-90 days** | Announcement | Election Commission announces dates |\n| **T-60 days** | Nominations | Candidates file nomination papers |\n| **T-45 days** | Campaigning begins | Official campaign period starts |\n| **T-21 days** | Registration deadline | Last day for voter registration |\n| **T-2 days** | Campaign silence | Campaigning must stop 48 hrs before voting |\n| **Election Day** | Voting | Polls open across constituencies |\n| **T+3 days** | Counting Day | Votes are counted and results declared |\n\n💡 *These are general timeframes. Actual dates vary by election and country.*\n\nWant me to generate a timeline for a specific election?`;
    }

    if (q.includes('count') || q.includes('counting') || q.includes('result')) {
      return `## 🔢 How Vote Counting Works\n\n**The Process:**\n\n1. **Sealed EVMs** — After polling, EVMs are sealed and transported to a strong room under security.\n\n2. **Strong Room Security** — 24/7 CCTV surveillance and multi-party guards protect the EVMs.\n\n3. **Counting Day** — Usually 2-3 days after the last phase of polling.\n\n4. **Round-by-Round Counting** — Each counting table processes one booth's EVM at a time.\n\n5. **VVPAT Verification** — VVPAT paper slips from randomly selected booths are cross-verified.\n\n6. **Tallying** — Votes are tallied round by round, with results updating in real-time.\n\n7. **Declaration** — The Returning Officer declares the winning candidate.\n\n**📊 Typical counting of one constituency takes 6-8 hours.**`;
    }

    if (q.includes('miss') || q.includes('scenario') || q.includes('what if') || q.includes('what happens')) {
      return `## 🔮 What-If Scenarios\n\nHere are common scenarios:\n\n**❓ What if I miss registration?**\nYou cannot vote in that election. Registration is mandatory. Apply early for the next election!\n\n**❓ What if I lose my voter ID?**\nYou can still vote with any of 12 approved photo IDs (Aadhaar, Passport, Driving License, etc.).\n\n**❓ What if I'm in a different city?**\nYou must vote at your registered polling station. Postal ballots are available only for certain categories (military, government duty).\n\n**❓ What if there's a tie?**\nThe Returning Officer conducts a lottery (draw of lots) to determine the winner.\n\n**❓ What if none of the candidates appeal to me?**\nYou can use the **NOTA** (None of the Above) option on the EVM.\n\nWant me to explore a specific scenario in detail?`;
    }

    if (q.includes('campaign') || q.includes('campaigning')) {
      return `## 📣 Election Campaigning\n\n**Key Rules:**\n\n- **Official Period**: Campaigning is allowed from nomination day until 48 hours before polling.\n- **Campaign Silence**: No campaigning allowed in the last 48 hours before voting.\n- **Spending Limits**: Each candidate has a spending cap set by the Election Commission.\n- **Code of Conduct**: The Model Code of Conduct (MCC) governs what candidates can and cannot do.\n\n**Prohibited:**\n- Appeal to religion, caste, or communal feelings\n- Bribery or offering inducements\n- Using government resources for campaigning\n- Hate speech or personal attacks\n\nWant to know more about campaign finance or the Model Code of Conduct?`;
    }

    return `Great question! Here's what I know:\n\nElections are the cornerstone of democracy. The typical process flows through these stages:\n\n**1. 📋 Registration** — Eligible citizens register as voters\n**2. 📣 Campaigning** — Candidates present their platforms\n**3. 🗳️ Voting** — Citizens cast their ballots\n**4. 🔢 Counting** — Votes are tallied securely\n**5. 📊 Results** — Winners are declared\n\nI can dive deeper into any of these stages. What would you like to explore?\n\nTry asking:\n- *"How do I register to vote?"*\n- *"What happens on voting day?"*\n- *"How are votes counted?"*\n- *"What if I miss registration?"*`;
  };

  const sendMessage = useCallback(async (content) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Try backend API first
      const res = await fetch(`${API_URL}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, language: i18n.language }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: Date.now(),
        }]);
      } else {
        throw new Error('Backend unavailable');
      }
    } catch {
      // Fallback to built-in responses
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
      const response = getOfflineResponse(content);
      setMessages((prev) => [...prev, {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [i18n.language]);

  const clearMessages = useCallback(() => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: "Chat cleared! How can I help you learn about elections? 🏛️",
      timestamp: Date.now(),
    }]);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
}
