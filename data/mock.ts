export const sidebarItems = [
  { href: '/', label: 'Overview' },
  { href: '/research', label: 'Research' },
  { href: '/shadow', label: 'Shadow' },
  { href: '/live', label: 'Live' },
  { href: '/signals', label: 'Signals' },
  { href: '/trades', label: 'Trades' },
  { href: '/settings', label: 'Settings' }
] as const;

export const heroStats = [
  { label: 'Tradability score', value: '74', tone: 'info' as const },
  { label: 'Expected edge', value: '+3.2 bps', tone: 'positive' as const },
  { label: 'Shadow fill match', value: '89%', tone: 'positive' as const }
];

export const overviewKpis = [
  {
    label: 'Net P&L', value: '£182,420', delta: '+12.8%', detail: 'vs previous 30 days', tone: 'positive' as const,
    progress: 78, footnote: 'Equity still climbing on BTC + ETH continuation'
  },
  {
    label: 'Shadow alpha', value: '+£24,180', delta: '+6.4%', detail: 'expected vs crossed execution', tone: 'info' as const,
    progress: 64, footnote: 'Passive entries still beating taker model'
  },
  {
    label: 'Live latency', value: '24ms', delta: '-4ms', detail: 'median order round trip', tone: 'warning' as const,
    progress: 56, footnote: 'Two spikes during London open need calibration'
  },
  {
    label: 'Model confidence', value: '91.2%', delta: '+2.7%', detail: 'HMM regime stable', tone: 'positive' as const,
    progress: 91, footnote: 'Long continuation still ranks above flip setups'
  }
];

export const performanceSeries = [
  { day: 'Mon', pnl: 9200, shadow: 10400, live: 8800 },
  { day: 'Tue', pnl: 11400, shadow: 12080, live: 10850 },
  { day: 'Wed', pnl: 13800, shadow: 14220, live: 13110 },
  { day: 'Thu', pnl: 12100, shadow: 12640, live: 11810 },
  { day: 'Fri', pnl: 16500, shadow: 17210, live: 15820 },
  { day: 'Sat', pnl: 15750, shadow: 16350, live: 15110 },
  { day: 'Sun', pnl: 18240, shadow: 18980, live: 17640 }
];

export const equitySeries = [
  { point: '01', equity: 240000, shadow: 242000 },
  { point: '05', equity: 248500, shadow: 251800 },
  { point: '09', equity: 256200, shadow: 259700 },
  { point: '13', equity: 272800, shadow: 277100 },
  { point: '17', equity: 269400, shadow: 275000 },
  { point: '21', equity: 289600, shadow: 295100 },
  { point: '25', equity: 304400, shadow: 310220 },
  { point: '29', equity: 322100, shadow: 329300 }
];

export const latencySeries = [
  { bucket: '08:00', latency: 19 },
  { bucket: '10:00', latency: 22 },
  { bucket: '12:00', latency: 18 },
  { bucket: '14:00', latency: 31 },
  { bucket: '16:00', latency: 24 },
  { bucket: '18:00', latency: 21 },
  { bucket: '20:00', latency: 17 }
];

export const activityFeed = [
  {
    title: 'HMM regime flipped back into continuation bias',
    meta: '2 mins ago · Confidence 92% · BTC/USDT',
    tone: 'positive' as const
  },
  {
    title: 'Shadow engine flagged adverse selection on ETH passive join',
    meta: '9 mins ago · 2.1 bps worse than expected · ETH/USDT',
    tone: 'warning' as const
  },
  {
    title: 'Risk engine reduced size on XAU runner after volatility spike',
    meta: '14 mins ago · Size cut 18% · XAU/USD',
    tone: 'warning' as const
  },
  {
    title: 'Live broker bridge healthy after reconnect',
    meta: '31 mins ago · All heartbeats green · Paper/live stack',
    tone: 'info' as const
  }
];

export const researchRuns = [
  {
    name: 'BTC perp continuation · passive entry sweep', venue: 'Bybit', window: '90d walk-forward', sharpe: '2.11', pnl: '+£48,220',
    status: 'Healthy', note: 'Queue-aware join beats market-take by 6.2 bps net'
  },
  {
    name: 'ETH perp controlled breakout · taker fallback', venue: 'Binance', window: '60d replay', sharpe: '1.42', pnl: '+£18,480',
    status: 'Monitoring', note: 'Latency-sensitive during US overlap'
  },
  {
    name: 'SOL perp short flip filter · adverse-selection cut', venue: 'Bybit', window: '45d replay', sharpe: '0.84', pnl: '+£5,120',
    status: 'Blocked', note: 'Live queue assumptions still too soft'
  }
];

export const shadowComparisons = [
  {
    symbol: 'BTC/USDT', expected: '+4.8 bps', realised: '+3.9 bps', discrepancy: '-0.9 bps', action: 'Join bid', cause: 'Fill 180ms later than modelled'
  },
  {
    symbol: 'ETH/USDT', expected: '+2.6 bps', realised: '+0.7 bps', discrepancy: '-1.9 bps', action: 'Join ask', cause: 'Queue drift during spread compression'
  },
  {
    symbol: 'XAU/USD', expected: '+3.1 bps', realised: '+3.4 bps', discrepancy: '+0.3 bps', action: 'Passive short', cause: 'Adverse move filter prevented chase'
  }
];

export const livePositions = [
  { market: 'BTC/USDT', side: 'Long', exposure: '£18,400', pnl: '+£4,320', status: 'Open', note: 'Runner still live' },
  { market: 'ETH/USDT', side: 'Long', exposure: '£9,800', pnl: '-£860', status: 'Open', note: 'Watching flip risk' },
  { market: 'XAU/USD', side: 'Short', exposure: '£6,100', pnl: '+£1,140', status: 'Open', note: 'Protective stop lifted' }
];

export const liveOrders = [
  { market: 'BTC/USDT', type: 'Passive join', price: '63,240.5', qty: '0.18', queue: 'P72', eta: '0.8s' },
  { market: 'ETH/USDT', type: 'Reprice watch', price: '3,180.4', qty: '1.40', queue: 'P91', eta: '1.3s' },
  { market: 'XAU/USD', type: 'Stop adjust', price: '2,181.9', qty: '0.90', queue: '—', eta: 'Instant' }
];

export const signalCards = [
  {
    pair: 'BTC/USDT', bias: 'Long', confidence: 92, quality: 88, regime: 'Trend expansion', status: 'Live', conviction: 'A-tier',
    note: 'Continuation state still favours patient passive entry.', tradability: 74
  },
  {
    pair: 'ETH/USDT', bias: 'Long', confidence: 84, quality: 82, regime: 'Controlled breakout', status: 'Queued', conviction: 'B-tier',
    note: 'Wait for tighter spread before crossing.', tradability: 61
  },
  {
    pair: 'SOL/USDT', bias: 'Short', confidence: 79, quality: 76, regime: 'Unstable chop', status: 'Blocked', conviction: 'Filtered',
    note: 'Weak edge after queue and latency costs.', tradability: 39
  }
];

export const trades = [
  {
    market: 'BTC/USDT', side: 'Long', entry: '63,240', exit: '64,980', pnl: '+£4,320', status: 'Closed', reason: 'Target 2 hit',
    openedAgo: 'Opened 2h ago', marketType: 'Perp', expectancy: '+5.2 bps'
  },
  {
    market: 'ETH/USDT', side: 'Long', entry: '3,180', exit: '3,142', pnl: '-£860', status: 'Closed', reason: 'Signal flip',
    openedAgo: 'Closed 38m ago', marketType: 'Perp', expectancy: '-1.2 bps'
  },
  {
    market: 'SOL/USDT', side: 'Short', entry: '142.4', exit: '138.8', pnl: '+£1,140', status: 'Open', reason: 'Runner active',
    openedAgo: 'Runner still live', marketType: 'Perp', expectancy: '+2.8 bps'
  },
  {
    market: 'NAS100', side: 'Long', entry: '18,224', exit: '18,406', pnl: '+£2,060', status: 'Closed', reason: 'Momentum continuation',
    openedAgo: 'Closed 4h ago', marketType: 'Index CFD', expectancy: '+3.4 bps'
  },
  {
    market: 'XAU/USD', side: 'Short', entry: '2,182', exit: '2,191', pnl: '-£540', status: 'Closed', reason: 'Risk cut',
    openedAgo: 'Closed 1h ago', marketType: 'Metal spot', expectancy: '-0.6 bps'
  }
];

export const systemHealth = [
  { label: 'Market data collector', status: 'Healthy', value: '99.98%' },
  { label: 'Research queue', status: 'Healthy', value: '12 jobs' },
  { label: 'Shadow engine', status: 'Monitoring', value: '2 mismatches' },
  { label: 'Broker bridge', status: 'Healthy', value: 'Connected' }
];

export const settingsGroups = [
  {
    title: 'Trading Controls',
    items: [
      ['Minimum quality threshold', '82'],
      ['Confidence floor', '85%'],
      ['Max risk per trade', '1.25%'],
      ['Max concurrent trades', '8']
    ]
  },
  {
    title: 'Execution Policies',
    items: [
      ['Default execution mode', 'Passive first'],
      ['Cross if expected edge >', '2.4 bps'],
      ['Max order latency', '45ms'],
      ['Cancel/reprice interval', '250ms']
    ]
  },
  {
    title: 'Deployment Modes',
    items: [
      ['UI deployment', 'Vercel'],
      ['Research engine', 'Python worker'],
      ['Collectors', 'Low-latency host'],
      ['Database', 'Postgres / Timescale']
    ]
  }
];
