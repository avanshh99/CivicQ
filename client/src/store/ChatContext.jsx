import { createContext, useState, useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  collection, addDoc, doc, setDoc, getDoc, getDocs,
  query, orderBy, onSnapshot, serverTimestamp,
  deleteDoc, updateDoc, limit
} from 'firebase/firestore';
import { db } from '../firebase.js';
import { AuthContext } from './AuthContext.jsx';

export const ChatContext = createContext({
  messages: [],
  sessions: [],
  activeSessionId: null,
  isLoading: false,
  sendMessage: () => {},
  clearMessages: () => {},
  createNewSession: () => {},
  switchSession: () => {},
  deleteSession: () => {},
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const WELCOME_MSG = {
  id: 'welcome',
  role: 'assistant',
  content: "Welcome to **CivicQ**! 🏛️ I'm your AI election assistant.\n\nI can help you understand:\n- 📋 How voter registration works\n- 🗳️ The voting process step by step\n- 📅 Important election timelines & deadlines\n- 🔮 \"What if\" scenarios\n\nAsk me anything about elections, or try one of the suggestions below!",
  timestamp: Date.now(),
};

/**
 * ChatProvider — Multi-session chat with Firestore persistence.
 * Supports creating, switching, and deleting chat sessions.
 * Each session's messages are stored under users/{uid}/sessions/{sessionId}/messages.
 */
export function ChatProvider({ children }) {
  const { i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ---- Load sessions list ----
  useEffect(() => {
    if (!user?.uid) {
      setSessions([]);
      setActiveSessionId(null);
      setMessages([WELCOME_MSG]);
      return;
    }

    const sessionsRef = collection(db, 'users', user.uid, 'sessions');
    const q = query(sessionsRef, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        updatedAt: d.data().updatedAt?.toMillis?.() || Date.now(),
        createdAt: d.data().createdAt?.toMillis?.() || Date.now(),
      }));
      setSessions(list);

      // Auto-select the most recent session if none is active
      if (!activeSessionId && list.length > 0) {
        setActiveSessionId(list[0].id);
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // ---- Load messages for active session ----
  useEffect(() => {
    if (!user?.uid || !activeSessionId) {
      setMessages([WELCOME_MSG]);
      return;
    }

    const msgsRef = collection(db, 'users', user.uid, 'sessions', activeSessionId, 'messages');
    const q = query(msgsRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setMessages([WELCOME_MSG]);
        return;
      }
      const firestoreMessages = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        timestamp: d.data().timestamp?.toMillis?.() || Date.now(),
      }));
      setMessages([WELCOME_MSG, ...firestoreMessages]);
    });

    return () => unsubscribe();
  }, [user?.uid, activeSessionId]);

  // ---- Create a new session ----
  const createNewSession = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const sessionsRef = collection(db, 'users', user.uid, 'sessions');
      const docRef = await addDoc(sessionsRef, {
        title: 'New Chat',
        preview: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setActiveSessionId(docRef.id);
      setMessages([WELCOME_MSG]);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  }, [user?.uid]);

  // ---- Switch to a session ----
  const switchSession = useCallback((sessionId) => {
    setActiveSessionId(sessionId);
  }, []);

  // ---- Delete a session ----
  const deleteSession = useCallback(async (sessionId) => {
    if (!user?.uid) return;
    try {
      // Delete all messages in the session
      const msgsRef = collection(db, 'users', user.uid, 'sessions', sessionId, 'messages');
      const snap = await getDocs(msgsRef);
      await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));

      // Delete the session document
      await deleteDoc(doc(db, 'users', user.uid, 'sessions', sessionId));

      // If we deleted the active session, switch to the first remaining
      if (sessionId === activeSessionId) {
        setActiveSessionId(null);
        setMessages([WELCOME_MSG]);
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  }, [user?.uid, activeSessionId]);

  // ---- Save message to Firestore ----
  const saveMessage = async (msg, sessionId) => {
    if (!user?.uid || !sessionId) return;
    try {
      const msgsRef = collection(db, 'users', user.uid, 'sessions', sessionId, 'messages');
      await addDoc(msgsRef, {
        role: msg.role,
        content: msg.content,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to save message:', err);
    }
  };

  // ---- Update session metadata ----
  const updateSessionMeta = async (sessionId, userMessage) => {
    if (!user?.uid || !sessionId) return;
    try {
      const sessionRef = doc(db, 'users', user.uid, 'sessions', sessionId);
      const snap = await getDoc(sessionRef);
      const data = snap.data();

      const updates = { updatedAt: serverTimestamp() };
      // Set the title to first user message (truncated)
      if (data?.title === 'New Chat') {
        updates.title = userMessage.substring(0, 40) + (userMessage.length > 40 ? '...' : '');
      }
      updates.preview = userMessage.substring(0, 60);

      await updateDoc(sessionRef, updates);
    } catch (err) {
      console.error('Failed to update session:', err);
    }
  };

  // Built-in offline responses
  const getOfflineResponse = (q) => {
    const lower = q.toLowerCase();
    if (lower.includes('register') || lower.includes('registration')) {
      return `## 📋 Voter Registration\n\nHere's how voter registration typically works:\n\n**1. Check Eligibility** — Must be a citizen, 18+, resident of constituency\n**2. Gather Documents** — Valid ID proof, address proof, passport photo\n**3. Apply** — Online via Election Commission website or offline at ERO\n**4. Verification** — BLO may visit for verification\n\n**⏰ Deadline**: Registration closes ~2-3 weeks before election day.`;
    }
    if (lower.includes('vote') || lower.includes('voting')) {
      return `## 🗳️ How Voting Works\n\n1. **Find Your Polling Station** — Check voter slip or EC website\n2. **Carry Valid ID** — Voter ID or approved photo ID\n3. **Verification** — Officials verify identity\n4. **Indelible Ink** — Finger marked to prevent duplicates\n5. **Cast Your Vote** — Press button on EVM\n6. **VVPAT** — Paper slip confirms your vote\n\n**🔒 Your vote is secret and secure.**`;
    }
    if (lower.includes('timeline') || lower.includes('deadline')) {
      return `## 📅 Election Timeline\n\n| Phase | Activity |\n|-------|----------|\n| T-90 days | EC announces dates |\n| T-60 days | Nominations open |\n| T-21 days | Registration deadline |\n| T-2 days | Campaign silence |\n| Election Day | Voting |\n| T+3 days | Counting & results |`;
    }
    return `Great question! Elections follow these stages:\n\n**1. 📋 Registration** → **2. 📣 Campaigning** → **3. 🗳️ Voting** → **4. 🔢 Counting** → **5. 📊 Results**\n\nI can dive deeper into any stage. What interests you?`;
  };

  // ---- Send message ----
  const sendMessage = useCallback(async (content) => {
    let sessionId = activeSessionId;

    // Auto-create session if none exists
    if (!sessionId && user?.uid) {
      try {
        const sessionsRef = collection(db, 'users', user.uid, 'sessions');
        const docRef = await addDoc(sessionsRef, {
          title: content.substring(0, 40) + (content.length > 40 ? '...' : ''),
          preview: content.substring(0, 60),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        sessionId = docRef.id;
        setActiveSessionId(sessionId);
      } catch (err) {
        console.error('Failed to auto-create session:', err);
      }
    }

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    saveMessage(userMsg, sessionId);
    updateSessionMeta(sessionId, content);

    try {
      const res = await fetch(`${API_URL}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, language: i18n.language }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        saveMessage(assistantMsg, sessionId);
      } else {
        throw new Error('Backend unavailable');
      }
    } catch {
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));
      const response = getOfflineResponse(content);
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      saveMessage(assistantMsg, sessionId);
    } finally {
      setIsLoading(false);
    }
  }, [i18n.language, user?.uid, activeSessionId]);

  // ---- Clear current session messages ----
  const clearMessages = useCallback(async () => {
    if (activeSessionId) {
      await deleteSession(activeSessionId);
    }
    setMessages([WELCOME_MSG]);
  }, [activeSessionId, deleteSession]);

  return (
    <ChatContext.Provider value={{
      messages, sessions, activeSessionId, isLoading,
      sendMessage, clearMessages, createNewSession, switchSession, deleteSession,
    }}>
      {children}
    </ChatContext.Provider>
  );
}
