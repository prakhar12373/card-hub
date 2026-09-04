import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Copy,
  CreditCard,
  Gift,
  LockKeyhole,
  MoreHorizontal,
  PackageCheck,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  WalletCards,
  X,
  Zap,
} from 'lucide-react';

type Category = 'All cards' | 'Mastercard' | 'Visa' | 'Rupay';

type RewardCard = {
  id: string;
  network: Exclude<Category, 'All cards'>;
  name: string;
  price: number;
  was?: number;
  limit: string;
  expiry: string;
  buyers: string;
  tone: 'hot' | 'cool';
  tag: string;
};

const cards: RewardCard[] = [
  { id: 'mc-gold', network: 'Mastercard', name: 'Mastercard Gold', price: 499, limit: '₹62k', expiry: '08/29', buyers: '3,87,420+', tone: 'hot', tag: 'Everyday rewards' },
  { id: 'mc-platinum', network: 'Mastercard', name: 'Mastercard Platinum', price: 648, was: 800, limit: '₹79k', expiry: '11/30', buyers: '4,12,150+', tone: 'hot', tag: '19% special discount' },
  { id: 'visa-gold', network: 'Visa', name: 'Visa Gold', price: 599, limit: '₹68k', expiry: '08/29', buyers: '3,87,420+', tone: 'cool', tag: 'Instant delivery' },
  { id: 'visa-premium', network: 'Visa', name: 'Visa Premium', price: 972, was: 1200, limit: '₹1.2L', expiry: '02/31', buyers: '1,64,880+', tone: 'cool', tag: 'Premium pick' },
  { id: 'rupay-elite', network: 'Rupay', name: 'Rupay Elite', price: 799, was: 950, limit: '₹91k', expiry: '05/30', buyers: '2,08,610+', tone: 'hot', tag: 'Fast favourite' },
];

const reviews = [
  { initials: 'RM', name: 'Riya M.', quote: '“Process ekdum fast tha. Card landed in minutes and the whole thing felt genuinely premium.”', product: 'Platinum Card', price: '₹648' },
  { initials: 'AK', name: 'Aarav K.', quote: '“Picked one for a friend, got the delivery before I finished writing the note. Perfect little surprise.”', product: 'Visa Gold', price: '₹599' },
  { initials: 'NS', name: 'Nisha S.', quote: '“No clutter, no confusing steps. Just chose a card, paid in demo mode and got the details instantly.”', product: 'Rupay Elite', price: '₹799' },
];

const feedItems = [
  { initials: 'KP', name: 'Kavya P.', card: 'Premium Card', amount: '₹648', time: 'just now' },
  { initials: 'AD', name: 'Arjun D.', card: 'Visa Gold', amount: '₹599', time: '38 sec ago' },
  { initials: 'SI', name: 'Sahil I.', card: 'Rupay Elite', amount: '₹799', time: '2 min ago' },
  { initials: 'MN', name: 'Meera N.', card: 'Gold Card', amount: '₹499', time: '3 min ago' },
];

const categories: Category[] = ['All cards', 'Mastercard', 'Visa', 'Rupay'];
const amounts = [499, 648, 799, 999];

function formatMoney(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function QRPreview({ value }: { value: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setDataUrl(null);
    void QRCode.toDataURL(value, {
      width: 220,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#111324', light: '#f6f2ed' },
    }).then((url) => {
      if (!cancelled) setDataUrl(url);
    });

    return () => {
      cancelled = true;
    };
  }, [value]);

  return (
    <div className="qr-wrap" data-testid="display-upi-qr">
      {dataUrl ? <img className="qr-image" src={dataUrl} alt="Dynamic demo UPI QR code" /> : <div className="qr-loading">Generating</div>}
      <div className="qr-scan" />
    </div>
  );
}

function CardTile({ card, onBuy }: { card: RewardCard; onBuy: (card: RewardCard) => void }) {
  return (
    <article className={`reward-card ${card.tone} rise-in`} data-testid={`card-product-${card.id}`}>
      <div className="card-top">
        <span className="card-logo" aria-label="Fictional rewards card chip" />
        <CreditCard size={23} strokeWidth={1.6} className="contactless" />
      </div>
      <div className="card-brand">{card.name}</div>
      <div className="card-number" data-testid={`text-masked-number-${card.id}`}>5281 ···· ···· ····</div>
      <p className="card-price">
        {formatMoney(card.price)}
        {card.was && <del>{formatMoney(card.was)}</del>}
        {card.was && <span className="save">SAVE 19%</span>}
      </p>
      <div className="card-stats">
        <div className="card-stat"><label>Limit</label><strong>{card.limit}</strong></div>
        <div className="card-stat"><label>Expiry</label><strong>{card.expiry}</strong></div>
        <div className="card-stat"><label>Access</label><strong>Protected</strong></div>
      </div>
      <div className="card-footer">
        <span className="buyers">Chosen by <strong>{card.buyers}</strong></span>
        <span className="eyebrow" style={{ color: 'hsl(var(--accent))' }}>{card.tag}</span>
      </div>
      <button className="plan-button" type="button" onClick={() => onBuy(card)} data-testid={`button-buy-${card.id}`}>
        View purchase plan <ArrowRight size={14} />
      </button>
    </article>
  );
}

function PurchaseDialog({ card, onClose }: { card: RewardCard; onClose: () => void }) {
  const [amount, setAmount] = useState(card.price);
  const upiValue = `upi://pay?pa=paytm@ptyes&pn=Neon%20Card%20Shop&am=${amount}&cu=INR`;
  const copyHandle = () => {
    void navigator.clipboard?.writeText('paytm@ptyes');
  };

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="purchase-title" data-testid="dialog-purchase-plan">
        <div className="dialog-head">
          <div>
            <div className="eyebrow">Demo checkout / selected card</div>
            <h2 id="purchase-title">{card.name}</h2>
          </div>
          <button className="close-button" type="button" onClick={onClose} aria-label="Close purchase plan" data-testid="button-close-dialog"><X size={18} /></button>
        </div>
        <div className="checkout-note">
          This is a presentation-only demo payment flow. No real payment verification, bank account or card credentials are collected.
        </div>
        <div className="qr-layout">
          <QRPreview value={upiValue} />
          <div className="pay-details">
            <p>Scan to simulate the selected amount</p>
            <b>{formatMoney(amount)}</b>
            <p style={{ marginTop: 16 }}>Demo UPI payee handle</p>
            <b>{'paytm@ptyes'} <button className="text-button" type="button" onClick={copyHandle} data-testid="button-copy-upi"><Copy size={12} /> Copy</button></b>
          </div>
        </div>
        <div className="amount-picker">
          <label htmlFor="amount-select">Choose a demo amount</label>
          <div className="amount-options" id="amount-select">
            {amounts.map((option) => (
              <button className={`amount-option ${option === amount ? 'active' : ''}`} type="button" key={option} onClick={() => setAmount(option)} data-testid={`button-amount-${option}`}>
                {formatMoney(option)}
              </button>
            ))}
          </div>
        </div>
        <button className="demo-pay" type="button" onClick={onClose} data-testid="button-simulate-payment"><QrCode size={17} /> Simulate demo payment <ArrowRight size={17} /></button>
        <p className="dialog-foot">Fictional prepaid rewards card · masked sample details only · no CVV/CVC</p>
      </section>
    </div>
  );
}

function BottomNav({ active, onNavigate }: { active: string; onNavigate: (target: string) => void }) {
  const items = [
    { id: 'cards', label: 'Cards', icon: WalletCards },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'more', label: 'More', icon: MoreHorizontal },
  ];
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map(({ id, label, icon: Icon }) => (
        <button className={`nav-item ${active === id ? 'active' : ''}`} type="button" key={id} onClick={() => onNavigate(id)} data-testid={`nav-${id}`}>
          <Icon size={19} strokeWidth={1.8} /><span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function App() {
  const [category, setCategory] = useState<Category>('All cards');
  const [selectedCard, setSelectedCard] = useState<RewardCard | null>(null);
  const [activeNav, setActiveNav] = useState('cards');
  const [feedIndex, setFeedIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 3, minutes: 55, seconds: 39 });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current.seconds > 0) return { ...current, seconds: current.seconds - 1 };
        if (current.minutes > 0) return { ...current, minutes: current.minutes - 1, seconds: 59 };
        if (current.hours > 0) return { ...current, hours: current.hours - 1, minutes: 59, seconds: 59 };
        if (current.days > 0) return { days: current.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return current;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setFeedIndex((index) => (index + 1) % feedItems.length), 3800);
    return () => window.clearInterval(interval);
  }, []);

  const visibleCards = category === 'All cards' ? cards : cards.filter((card) => card.network === category);
  const scrollTo = (id: string) => {
    setActiveNav(id);
    const target = document.getElementById(id === 'cards' ? 'card-catalog' : id === 'reviews' ? 'reviews' : 'delivery');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const currentFeed = feedItems[feedIndex];

  return (
    <main className="app-shell">
      <div className="page-wrap">
        <header className="topbar rise-in">
          <a href="#top" className="brand-mark" data-testid="link-home">
            <span className="brand-symbol"><Zap size={19} fill="currentColor" /></span>
            <span className="brand-name">neon <span style={{ color: 'hsl(var(--secondary))' }}>card shop</span></span>
          </a>
          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="Help and support" onClick={() => scrollTo('more')} data-testid="button-help"><CircleHelp size={18} /></button>
            <button className="icon-button" type="button" aria-label="Notifications" onClick={() => scrollTo('reviews')} data-testid="button-notifications"><Bell size={17} /></button>
          </div>
        </header>

        <section id="top" className="hero">
          <div className="hero-copy rise-in delay-1">
            <div className="eyebrow"><Sparkles size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Digital rewards, with a pulse</div>
            <h1>Make every<br /><span>moment count.</span></h1>
            <p className="hero-sub">Fictional prepaid reward cards for the people you want to delight. Pick a color, choose a value, send the good stuff.</p>
          </div>
          <div className="hero-sticker drift" aria-label="Limited time nineteen percent discount"><strong>19%</strong> instant<br />saving</div>
        </section>

        <section className="offer-ribbon rise-in delay-2" aria-label="Limited time offer">
          <div><p>Neon season is on.</p><small>Flat 19% off selected cards</small></div>
          <div className="countdown" data-testid="text-offer-countdown">
            <b>{String(timeLeft.days).padStart(2, '0')}d</b><b>{String(timeLeft.hours).padStart(2, '0')}h</b><b>{String(timeLeft.minutes).padStart(2, '0')}m</b><b>{String(timeLeft.seconds).padStart(2, '0')}s</b>
          </div>
        </section>

        <section className="section" id="card-catalog">
          <div className="section-top">
            <div><div className="eyebrow">The collection</div><h2 className="section-heading">Pick your <em>energy.</em></h2></div>
            <p>5 fictional cards</p>
          </div>
          <div className="category-row" role="tablist" aria-label="Card categories">
            {categories.map((item) => (
              <button className={`category-chip ${category === item ? 'active' : ''}`} type="button" role="tab" aria-selected={category === item} key={item} onClick={() => setCategory(item)} data-testid={`tab-category-${item.toLowerCase().replace(' ', '-')}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="cards-grid">
            {visibleCards.map((card, index) => <div key={card.id} style={{ animationDelay: `${index * 70}ms` }}><CardTile card={card} onBuy={setSelectedCard} /></div>)}
          </div>
        </section>

        <section className="section" id="delivery">
          <div className="section-top">
            <div><div className="eyebrow">After you tap buy</div><h2 className="section-heading">Good things,<br /><em>delivered.</em></h2></div>
          </div>
          <div className="split-panel">
            <div className="reassurance">
              <div className="eyebrow" style={{ color: 'hsl(var(--accent))' }}>Your delivery, your way</div>
              <h3>Access and receive your purchased goods securely.</h3>
              <p>Instant digital delivery with a clear order trail. No waiting, no mystery steps, no real financial credentials.</p>
              <button className="text-button" type="button" onClick={() => setSelectedCard(cards[1])} data-testid="button-check-goods">Check a demo order <ArrowRight size={15} /></button>
            </div>
            <div className="trust-grid">
              <div className="trust-item"><PackageCheck className="trust-icon" size={19} /><strong>Instant access</strong><p>Digital delivery in minutes.</p></div>
              <div className="trust-item"><ShieldCheck className="trust-icon" size={19} /><strong>Protected flow</strong><p>Built for safe demo play.</p></div>
              <div className="trust-item"><LockKeyhole className="trust-icon" size={19} /><strong>Privacy first</strong><p>Never ask for CVV or CVC.</p></div>
            </div>
          </div>
        </section>

        <section className="section" id="reviews">
          <div className="section-top">
            <div><div className="eyebrow">Little love notes</div><h2 className="section-heading">Real people.<br /><em>Big reactions.</em></h2></div>
            <button className="text-button" type="button" onClick={() => setActiveNav('reviews')} data-testid="button-all-reviews">All reviews <ChevronRight size={15} /></button>
          </div>
          <div className="reviews-rail">
            {reviews.map((review, index) => (
              <article className="review-card rise-in" style={{ animationDelay: `${index * 100}ms` }} key={review.name} data-testid={`review-card-${index}`}>
                <div className="review-head"><div className="avatar">{review.initials}</div><div className="reviewer"><strong>{review.name}</strong><span className="verified"><BadgeCheck size={13} /> Verified buyer</span></div></div>
                <div className="stars" aria-label="Five stars">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill="currentColor" />)}</div>
                <blockquote>{review.quote}</blockquote>
                <div className="review-tag"><span>{review.product}</span><b>{review.price}</b></div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-label="Live purchase feed">
          <div className="live-feed">
            <div className="feed-title"><span className="live-dot" /><strong>Live purchase feed</strong><span>updating now</span></div>
            <div className="feed-row" key={currentFeed.name} data-testid="live-purchase-row">
              <div className="feed-avatar">{currentFeed.initials}</div>
              <p><strong>{currentFeed.name}</strong> picked a {currentFeed.card}<small>{currentFeed.time} · demo activity</small></p>
              <span className="feed-price">{currentFeed.amount}</span>
            </div>
            <div className="feed-row"><div className="feed-avatar"><Check size={15} /></div><p><strong>Community pulse</strong> is feeling neon<small>4,120+ cards explored today</small></p><span className="feed-price"><Zap size={15} /></span></div>
          </div>
        </section>

        <footer className="section" id="more" style={{ paddingBottom: 24 }}>
          <div className="glass" style={{ borderRadius: 20, padding: 20 }}>
            <div className="eyebrow">Neon card shop / demo 01</div>
            <p className="muted" style={{ maxWidth: 530, lineHeight: 1.5, fontSize: '.76rem', marginBottom: 0 }}>A vivid storefront concept for fictional prepaid rewards cards. Sample masked details are for display only. This is not a bank, credit product, or real payment service.</p>
          </div>
        </footer>
      </div>

      <BottomNav active={activeNav} onNavigate={scrollTo} />
      {selectedCard && <PurchaseDialog card={selectedCard} onClose={() => setSelectedCard(null)} />}
    </main>
  );
}

export default App;