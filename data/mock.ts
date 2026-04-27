export const navItems = [
  { href: '/', label: 'Overview' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/models', label: 'Models' },
  { href: '/signals', label: 'Signals' },
  { href: '/trades', label: 'Trades' },
  { href: '/settings', label: 'Settings' }
];

export const kpis = [
  {
    label: 'Net P&L',
    value: '£182,420',
    delta: '+12.8%',
    detail: 'vs previous 30 days',
    tone: 'positive' as const,
    progress: 78,
    footnote: 'Equity curve still rising'
  },
  {
    label: 'Win rate',
    value: '63.4%',
    delta: '+4.1%',
    detail: 'quality threshold 82',
    tone: 'positive' as const,
    progress: 63,
    footnote: 'Cleaner continuation set-ups'
  },
  {
    label: 'Open exposure',
    value: '£64,800',
    delta: '-1.9%',
    detail: '8 live positions',
    tone: 'warning' as const,
    progress: 54,
    footnote: 'Risk engine trimmed size'
  },
  {
    label: 'Model confidence',
    value: '91.2%',
    delta: '+2.7%',
    detail: 'HMM regime stable',
    tone: 'info' as const,
    progress: 91,
    footnote: 'Bias stack aligned'
  }
];

export const performanceSeries = [
  { day: 'Mon', pnl: 9200, volume: 182000, confidence: 81 },
  { day: 'Tue', pnl: 11400, volume: 205000, confidence: 84 },
  { day: 'Wed', pnl: 13800, volume: 226000, confidence: 88 },
  { day: 'Thu', pnl: 12100, volume: 198000, confidence: 86 },
  { day: 'Fri', pnl: 16500, volume: 248000, confidence: 92 },
  { day: 'Sat', pnl: 15750, volume: 214000, confidence: 90 },
  { day: 'Sun', pnl: 18240, volume: 236000, confidence: 91 }
];

export const equitySeries = [
  { point: '01', equity: 240000 },
  { point: '05', equity: 248500 },
  { point: '09', equity: 256200 },
  { point: '13', equity: 272800 },
  { point: '17', equity: 269400 },
  { point: '21', equity: 289600 },
  { point: '25', equity: 304400 },
  { point: '29', equity: 322100 }
];

export const activityFeed = [
  {
    title: 'Model ONYX-HMM-07 shifted into trending regime',
    meta: '2 mins ago · Confidence 92% · BTC/USD',
    tone: 'positive' as const,
    market: 'BTC/USD'
  },
  {
    title: 'Risk engine reduced position size by 1.2%',
    meta: '12 mins ago · Volatility spike filter · XAU/USD',
    tone: 'warning' as const,
    market: 'XAU/USD'
  },
  {
    title: 'Signal validation passed on 3 new entries',
    meta: '27 mins ago · EMA / order-flow alignment · ETH/USD',
    tone: 'info' as const,
    market: 'ETH/USD'
  },
  {
    title: 'Trade closed at target 2',
    meta: '41 mins ago · +£4,320 realised · BTC/USD',
    tone: 'positive' as const,
    market: 'BTC/USD'
  }
];

export const signalCards = [
  {
    pair: 'BTC/USD',
    bias: 'Long',
    confidence: '92%',
    quality: '88',
    regime: 'Trend expansion',
    status: 'Live',
    conviction: 'A-tier',
    note: 'High-liquidity continuation with aligned velocity'
  },
  {
    pair: 'ETH/USD',
    bias: 'Long',
    confidence: '84%',
    quality: '82',
    regime: 'Controlled breakout',
    status: 'Queued',
    conviction: 'B-tier',
    note: 'Waiting for cleaner spread compression'
  },
  {
    pair: 'SOL/USD',
    bias: 'Short',
    confidence: '79%',
    quality: '76',
    regime: 'Unstable chop',
    status: 'Blocked',
    conviction: 'Filtered',
    note: 'Flip risk still too high for clean follow-through'
  }
];

export const trades = [
  {
    market: 'BTC/USD',
    side: 'Long',
    entry: '63,240',
    exit: '64,980',
    pnl: '+£4,320',
    status: 'Closed',
    reason: 'Target 2 hit',
    openedAgo: 'Opened 2h ago',
    marketType: 'Spot market'
  },
  {
    market: 'ETH/USD',
    side: 'Long',
    entry: '3,180',
    exit: '3,142',
    pnl: '-£860',
    status: 'Closed',
    reason: 'Signal flip',
    openedAgo: 'Closed 38m ago',
    marketType: 'Spot market'
  },
  {
    market: 'SOL/USD',
    side: 'Short',
    entry: '142.4',
    exit: '138.8',
    pnl: '+£1,140',
    status: 'Open',
    reason: 'Runner active',
    openedAgo: 'Runner still live',
    marketType: 'Spot market'
  },
  {
    market: 'NAS100',
    side: 'Long',
    entry: '18,224',
    exit: '18,406',
    pnl: '+£2,060',
    status: 'Closed',
    reason: 'Momentum continuation',
    openedAgo: 'Closed 4h ago',
    marketType: 'Index contract'
  },
  {
    market: 'XAU/USD',
    side: 'Short',
    entry: '2,182',
    exit: '2,191',
    pnl: '-£540',
    status: 'Closed',
    reason: 'Risk cut',
    openedAgo: 'Closed 1h ago',
    marketType: 'Metal spot'
  }
];

export const systemHealth = [
  { label: 'Market data', status: 'Healthy', value: '99.98%' },
  { label: 'Execution latency', status: 'Healthy', value: '22ms' },
  { label: 'Risk engine', status: 'Monitoring', value: '2 flags' },
  { label: 'Broker bridge', status: 'Healthy', value: 'Connected' }
];

export const modelCards = [
  {
    name: 'ONYX HMM Regime Core',
    version: 'v2.8.1',
    confidence: '91.2%',
    accuracy: '63.4%',
    notes: 'Primary model governing regime stability and trade eligibility.'
  },
  {
    name: 'ONYX Flow Confirm',
    version: 'v1.4.3',
    confidence: '88.1%',
    accuracy: '58.9%',
    notes: 'Secondary confirmation layer combining velocity and imbalance.'
  },
  {
    name: 'ONYX Risk Compression',
    version: 'v1.1.9',
    confidence: '94.6%',
    accuracy: '71.0%',
    notes: 'Cuts exposure in unstable volatility pockets before entries are fired.'
  }
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
    title: 'Execution & Alerts',
    items: [
      ['Broker bridge', 'Interactive Brokers'],
      ['Alert routing', 'Telegram + Email'],
      ['Auto execution', 'Enabled'],
      ['Audit logging', 'Verbose']
    ]
  }
];
