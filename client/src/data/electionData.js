/**
 * Election walkthrough steps data
 * Used by the step-by-step guided flow
 */
export const ELECTION_STEPS = [
  {
    id: 'registration',
    icon: '📋',
    title: 'Voter Registration',
    subtitle: 'Your first step to democracy',
    color: 'primary',
    summary: 'Register as a voter with your local election authority to be eligible to cast your vote.',
    eli5: "It's like signing up for a library card — you need to put your name on the list so they know you're allowed to participate!",
    detailed: `**Voter Registration** is the process of adding your name to the electoral roll.

**Who can register?**
- Citizens who have reached the minimum voting age (18 in most countries)
- Residents of the constituency where they wish to vote

**How to register:**
1. **Online** — Visit the Election Commission website and fill Form 6
2. **Offline** — Visit your nearest Electoral Registration Office
3. **Special Drives** — Election authorities often hold registration camps

**Documents needed:**
- Proof of age (birth certificate, school certificate)
- Proof of address (utility bills, bank statement)
- Passport-size photographs
- Identity proof (Aadhaar, passport, etc.)

**Important:** Registration has a deadline before each election. Don't wait until the last minute!`,
    keyFacts: [
      'Minimum age: 18 years in most democracies',
      'Registration deadline: Usually 2-3 weeks before election day',
      'You can check your registration status online',
      'Change of address requires updating your registration',
    ],
  },
  {
    id: 'nominations',
    icon: '📝',
    title: 'Nominations & Candidates',
    subtitle: 'Who stands for election',
    color: 'secondary',
    summary: 'Candidates file their nomination papers and are scrutinized for eligibility.',
    eli5: "People who want to be the class president raise their hands and say 'Pick me!' — but they need to follow some rules first.",
    detailed: `**Nominations** is the phase where potential candidates officially declare their intention to contest.

**Process:**
1. **Filing** — Candidates submit nomination papers with required deposits
2. **Scrutiny** — Election officials verify eligibility
3. **Withdrawal** — Candidates may withdraw within a set period
4. **Final List** — The official candidate list is published

**Requirements vary but typically include:**
- Minimum age (usually 25 for parliament)
- Citizenship of the country
- No criminal disqualifications
- Security deposit (refunded if candidate gets sufficient votes)
- Required number of proposers from the constituency`,
    keyFacts: [
      'Security deposits prevent frivolous candidacies',
      'Independent candidates can contest without party backing',
      'Nomination papers are publicly available',
      'Symbols are allotted to candidates by the Election Commission',
    ],
  },
  {
    id: 'campaigning',
    icon: '📣',
    title: 'Election Campaigning',
    subtitle: 'Making voices heard',
    color: 'tertiary',
    summary: 'Candidates and parties campaign to win voter support through rallies, media, and outreach.',
    eli5: "It's like when candidates tell everyone why they'd be the best choice — they make posters, give speeches, and try to convince people to vote for them.",
    detailed: `**Campaigning** is the period where candidates actively seek voter support.

**Methods:**
- Public rallies and road shows
- Door-to-door canvassing
- Media advertisements (TV, radio, print)
- Social media campaigns
- Manifestos and policy documents

**Rules (Model Code of Conduct):**
- No appeal to religious or communal sentiments
- No use of government machinery for campaigning
- No bribery or vote-buying
- Campaign spending limits strictly enforced
- No campaigning 48 hours before polling (campaign silence)

**Campaign Finance:**
- Spending caps are set per constituency
- All expenditure must be documented
- Election Commission monitors through observers`,
    keyFacts: [
      'Campaign silence: 48 hours before voting',
      'Spending limits are strictly monitored',
      'Model Code of Conduct applies to all parties',
      'Exit polls are banned until the last phase concludes',
    ],
  },
  {
    id: 'voting',
    icon: '🗳️',
    title: 'Voting Day',
    subtitle: 'Your voice, your choice',
    color: 'primary',
    summary: 'Citizens cast their votes at designated polling stations using EVMs.',
    eli5: "On the big day, you go to a special place, show your ID, press a button next to the person you like, and your choice is saved secretly!",
    detailed: `**Voting Day** is when eligible voters cast their ballots.

**The Process:**
1. **Arrive at your polling station** — Check your voter slip for the address
2. **Queue up** — Separate queues may exist for different groups
3. **Identity verification** — Show your voter ID or approved photo ID
4. **Indelible ink** — Applied on your left index finger
5. **Enter the booth** — Private voting space
6. **Cast your vote** — Press the button for your candidate on the EVM
7. **VVPAT slip** — Verify your vote on the paper trail (visible for 7 seconds)
8. **Exit** — Your democratic duty is done!

**Key Facts:**
- Polling hours: Typically 7 AM to 6 PM
- NOTA option available if no candidate appeals
- Assistance available for voters with disabilities
- Booth-level officers assist with any issues`,
    keyFacts: [
      'Your vote is completely secret',
      'EVMs are standalone, not connected to any network',
      'NOTA (None of the Above) is a valid option',
      'Special provisions exist for disabled & elderly voters',
    ],
  },
  {
    id: 'counting',
    icon: '🔢',
    title: 'Vote Counting',
    subtitle: 'Every vote counts',
    color: 'secondary',
    summary: 'Sealed EVMs are opened and votes are tallied under strict security and observation.',
    eli5: "After everyone votes, officials open the voting machines and count who got the most votes — kind of like counting raised hands, but much more careful!",
    detailed: `**Vote Counting** is the process of tallying all votes cast.

**Process:**
1. EVMs are stored in secure strong rooms with 24/7 surveillance
2. On counting day, EVMs are opened in the presence of agents from all parties
3. Votes are counted round by round (one booth per round)
4. Results are tabulated and displayed on large screens
5. VVPAT paper trails are randomly verified
6. The Returning Officer declares the final result

**Security Measures:**
- Multi-layer security around strong rooms
- Candidate agents present during counting
- Media and observer access
- Any discrepancy leads to recounting`,
    keyFacts: [
      'Counting usually happens 2-3 days after voting',
      'Each round corresponds to one polling booth\'s EVM',
      'VVPAT verification adds physical paper trail',
      'Results are announced constituency by constituency',
    ],
  },
  {
    id: 'results',
    icon: '📊',
    title: 'Results & Formation',
    subtitle: 'Democracy in action',
    color: 'tertiary',
    summary: 'Winners are declared, and the process of forming a government begins.',
    eli5: "The person with the most votes wins! Then they and their team start working to run things for everyone.",
    detailed: `**Results Declaration** marks the conclusion of the electoral process.

**After Counting:**
1. Returning Officer declares constituency results
2. Winning candidates receive certificates of election
3. Party/coalition with majority is invited to form government
4. If no majority — coalition negotiations begin
5. Government formation and oath of office

**Key Concepts:**
- **Simple Majority**: More than half the seats
- **Coalition**: Multiple parties joining to form majority
- **Opposition**: Parties not in government, providing checks & balance
- **Hung Parliament**: When no party/coalition has clear majority`,
    keyFacts: [
      'The party/coalition with majority forms the government',
      'Results are typically declared within 24 hours of counting',
      'Elected representatives take oath of office',
      'Election disputes can be challenged in court',
    ],
  },
];

export const SUGGESTION_CHIPS = [
  { label: '📋 How do I register?', query: 'How do I register to vote?' },
  { label: '🗳️ How does voting work?', query: 'How does the voting process work?' },
  { label: '📅 Election timeline', query: 'Show me the election timeline and key dates' },
  { label: '🔮 What if I miss registration?', query: 'What happens if I miss the voter registration deadline?' },
  { label: '🔢 How are votes counted?', query: 'How does the vote counting process work?' },
  { label: '📣 Campaign rules', query: 'What are the rules for election campaigning?' },
];

export const ELECTION_TIMELINE = [
  { date: 'T-90 Days', title: 'Election Announced', icon: '📢', summary: 'Election Commission announces dates. Model Code of Conduct comes into effect.', status: 'completed', details: 'The Election Commission of India meets and decides poll dates based on various factors including weather, festivals, and security considerations.' },
  { date: 'T-75 Days', title: 'Nomination Period', icon: '📝', summary: 'Candidates file nomination papers with returning officers.', status: 'completed', details: 'Candidates must submit their nomination papers along with a security deposit. They also submit affidavits declaring criminal records, assets, and educational qualifications.' },
  { date: 'T-60 Days', title: 'Scrutiny & Withdrawals', icon: '🔍', summary: 'Nominations are scrutinized. Final candidate list published.', status: 'completed', details: 'The returning officer examines each nomination for validity. Candidates can withdraw within the specified period.' },
  { date: 'T-45 Days', title: 'Campaign Period', icon: '📣', summary: 'Official campaigning begins. Rallies, ads, and outreach.', status: 'active', details: 'Parties and candidates actively campaign through rallies, media, social media, and door-to-door canvassing within spending limits.' },
  { date: 'T-21 Days', title: 'Registration Closes', icon: '⏰', summary: 'Last date for voter registration updates.', status: 'upcoming', details: 'This is the final deadline to register as a new voter or update your details on the electoral roll.' },
  { date: 'T-2 Days', title: 'Campaign Silence', icon: '🤫', summary: 'All campaigning must stop 48 hours before polling.', status: 'upcoming', details: 'No public meetings, rallies, or advertisements are allowed. This period is meant to let voters make their decision without last-minute influence.' },
  { date: 'Election Day', title: 'Polling Day', icon: '🗳️', summary: 'Citizens cast their votes at designated polling stations.', status: 'upcoming', details: 'Polls typically open from 7 AM to 6 PM. Special provisions are made for differently-abled voters and those in remote areas.' },
  { date: 'T+3 Days', title: 'Counting Day', icon: '🔢', summary: 'Votes are counted and results declared.', status: 'upcoming', details: 'EVMs are opened in counting centers. Results are declared constituency by constituency.' },
  { date: 'T+7 Days', title: 'Government Formation', icon: '🏛️', summary: 'Winning party/coalition invited to form government.', status: 'upcoming', details: 'The party or coalition with majority support is invited to form the government and take oath of office.' },
];

export const SCENARIOS = [
  {
    id: 'miss-registration',
    icon: '😰',
    title: 'Missed Registration Deadline',
    question: 'What happens if I miss the voter registration deadline?',
    color: 'warning',
  },
  {
    id: 'lost-voter-id',
    icon: '🪪',
    title: 'Lost Voter ID',
    question: 'I lost my voter ID card. Can I still vote?',
    color: 'info',
  },
  {
    id: 'different-city',
    icon: '🏙️',
    title: 'Moved to a Different City',
    question: 'I moved to a different city. How do I vote?',
    color: 'primary',
  },
  {
    id: 'evm-malfunction',
    icon: '⚡',
    title: 'EVM Malfunction',
    question: 'What happens if the EVM malfunctions during voting?',
    color: 'error',
  },
  {
    id: 'tie',
    icon: '🤝',
    title: 'Election Tie',
    question: 'What happens if two candidates get the exact same number of votes?',
    color: 'secondary',
  },
  {
    id: 'nota-wins',
    icon: '❌',
    title: 'NOTA Gets Most Votes',
    question: 'What if NOTA gets more votes than any candidate?',
    color: 'tertiary',
  },
];

export const GAMIFICATION_BADGES = [
  { id: 'first-step', icon: '🌱', label: 'First Step', description: 'Started your civic learning journey' },
  { id: 'registration-pro', icon: '📋', label: 'Reg. Pro', description: 'Learned about voter registration' },
  { id: 'vote-expert', icon: '🗳️', label: 'Vote Expert', description: 'Completed the voting walkthrough' },
  { id: 'timeline-explorer', icon: '📅', label: 'Explorer', description: 'Explored the election timeline' },
  { id: 'scenario-master', icon: '🔮', label: 'Scenario Master', description: 'Explored 3+ scenarios' },
  { id: 'civic-scholar', icon: '🎓', label: 'Scholar', description: 'Completed all learning modules' },
  { id: 'curious-mind', icon: '💡', label: 'Curious', description: 'Asked 10+ questions' },
  { id: 'democracy-champion', icon: '🏆', label: 'Champion', description: '100% completion' },
];
