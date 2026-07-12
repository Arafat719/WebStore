import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import userContext from '../../context/userContext';
import './Help.css';

const BUYER_STEPS = [
  {
    n: 1,
    title: 'Browse & Discover',
    desc: 'Browse the marketplace and find a product you like.',
  },
  {
    n: 2,
    title: 'Buy Now',
    desc: 'Click "Buy Now" to place your order, then contact the seller on WhatsApp to arrange payment.',
  },
  {
    n: 3,
    title: 'Get Repository Access',
    desc: "Once the seller confirms your payment and marks the order complete, you get access to the product's GitHub repository.",
  },
  {
    n: 4,
    title: 'Download',
    desc: 'Download the ZIP from your order in MyOrders.',
  },
];

const SELLER_STEPS = [
  {
    n: 1,
    title: 'Become a Seller',
    desc: 'Go to Settings → Seller Settings and click "Become a Seller".',
  },
  {
    n: 2,
    title: 'Add Your Product',
    desc: 'Once approved, go to "Add Website" from the navbar.',
  },
  {
    n: 3,
    title: 'Fill in Details',
    desc: 'Fill in your product details and paste your GitHub repository URL.',
  },
  {
    n: 4,
    title: 'Go Live',
    desc: 'Your product goes live on the marketplace after verification.',
  },
];

const FAQS = [
  {
    q: 'How do I download a product after buying?',
    a: 'Go to MyOrders → Purchases tab. Find your order and click the Download button to get the ZIP file.',
  },
  {
    q: 'How does payment work on WebMarketX?',
    a: "WebMarketX doesn't process payments directly. After you click \"Buy Now\", you'll get the seller's WhatsApp contact to arrange payment. Once the seller confirms they've received it, they mark the order as completed and you can download the product from MyOrders.",
  },
  {
    q: "What if the seller doesn't respond after I contact them?",
    a: 'Give them a little time to reply on WhatsApp. If they remain unresponsive, use the Report button on the product page to notify WebMarketX and we\'ll follow up.',
  },
  {
    q: 'How much does it cost to become a seller?',
    a: 'Becoming a seller on WebMarketX is completely free. Go to Settings → Seller Settings and click "Become a Seller."',
  },
  {
    q: 'What kind of products can I sell?',
    a: 'You can sell any web-based digital product — websites, landing pages, React/Next.js templates, UI kits, or any GitHub repository containing web code.',
  },
  {
    q: 'What if I have a problem with a product I bought?',
    a: 'Contact the seller directly from your order page. If the issue is not resolved, use the Report button on the product page to notify WebMarketX. (Support system coming soon.)',
  },
];

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`wmx-help-faq-item${open ? ' open' : ''}`}>
      <button className="wmx-help-faq-q" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <span className="wmx-help-faq-icon" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="wmx-help-faq-a">{a}</p>}
    </div>
  );
}

function Steps({ steps }) {
  return (
    <div className="wmx-help-steps">
      {steps.map(({ n, title, desc }) => (
        <div key={n} className="wmx-help-step">
          <div className="wmx-help-step-num" aria-hidden="true">{n}</div>
          <div className="wmx-help-step-body">
            <p className="wmx-help-step-title">{title}</p>
            <p className="wmx-help-step-desc">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SupportForm() {
  const { userId } = useContext(userContext);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim().length < 10) {
      setMsg({ text: 'Message must be at least 10 characters.', type: 'error' });
      return;
    }
    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      const res = await fetch(`${API}/reports/support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify({ subject: subject.trim(), message: message.trim() }),
      });
      if (res.ok) {
        setMsg({ text: "Your message has been sent. We'll get back to you soon.", type: 'success' });
        setSubject('');
        setMessage('');
      } else {
        const data = await res.json().catch(() => ({}));
        setMsg({ text: data.error || 'Something went wrong. Please try again.', type: 'error' });
      }
    } catch {
      setMsg({ text: 'Something went wrong. Please try again.', type: 'error' });
    }
    setLoading(false);
  };

  if (!userId) {
    return <p className="wmx-support-noauth">Please log in to contact support.</p>;
  }

  return (
    <form className="wmx-support-form" onSubmit={handleSubmit}>
      <div className="wmx-support-field">
        <label className="wmx-support-label">Subject</label>
        <input
          type="text"
          className="wmx-support-input"
          placeholder="What do you need help with?"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
        />
      </div>
      <div className="wmx-support-field">
        <label className="wmx-support-label">Message</label>
        <textarea
          className="wmx-support-textarea"
          placeholder="Describe your issue in detail..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={4}
          required
          minLength={10}
        />
      </div>
      {msg.text && (
        <p className={`wmx-support-msg wmx-support-msg-${msg.type}`}>{msg.text}</p>
      )}
      <button type="submit" className="wmx-support-submit" disabled={loading}>
        <Send size={14} />
        {loading ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}

export default function Help() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="wmx-help-page">

      {/* ── Hero ── */}
      <section className="wmx-help-hero">
        <div className="wmx-help-orb wmx-help-orb-1" />
        <div className="wmx-help-orb wmx-help-orb-2" />
        <div className="wmx-help-container">
          <div className="wmx-help-badge">Documentation</div>
          <h1 className="wmx-help-hero-title">How WebMarketX Works</h1>
          <p className="wmx-help-hero-sub">
            Everything you need to know about buying and selling digital products on WebMarketX.
          </p>
          <div className="wmx-help-hero-btns">
            <button className="wmx-help-btn wmx-help-btn-primary" onClick={() => scrollTo('buyers')}>
              I'm a Buyer
            </button>
            <button className="wmx-help-btn wmx-help-btn-ghost" onClick={() => scrollTo('sellers')}>
              I'm a Seller
            </button>
          </div>
        </div>
      </section>

      {/* ── Platform Overview ── */}
      <section className="wmx-help-section">
        <div className="wmx-help-container">
          <div className="wmx-help-card">
            <h2 className="wmx-help-section-title">What is WebMarketX?</h2>
            <p className="wmx-help-overview-text">
              WebMarketX is a digital marketplace where developers and entrepreneurs can buy and
              sell web products — websites, templates, UI kits, and GitHub repositories.
            </p>
            <div className="wmx-help-callout">
              <span className="wmx-help-callout-icon" aria-hidden="true">
                <FontAwesomeIcon icon={faLightbulb} />
              </span>
              <span>
                <strong>Buyer and Seller are not separate accounts.</strong> Any user can become a
                seller with one click from Settings.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── For Buyers ── */}
      <section id="buyers" className="wmx-help-section">
        <div className="wmx-help-container">
          <h2 className="wmx-help-section-title wmx-help-section-title-lg">For Buyers</h2>
          <Steps steps={BUYER_STEPS} />
          <p className="wmx-help-section-note">
            All your purchases are saved in{' '}
            <Link to="/myorders" className="wmx-help-link">MyOrders</Link> → Purchases tab.
          </p>
        </div>
      </section>

      {/* ── For Sellers ── */}
      <section id="sellers" className="wmx-help-section">
        <div className="wmx-help-container">
          <h2 className="wmx-help-section-title wmx-help-section-title-lg">For Sellers</h2>
          <Steps steps={SELLER_STEPS} />
          <p className="wmx-help-section-note">
            Track your earnings and orders in{' '}
            <Link to="/myorders" className="wmx-help-link">MyOrders</Link> → Sales tab.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="wmx-help-section">
        <div className="wmx-help-container wmx-help-container-narrow">
          <h2 className="wmx-help-section-title wmx-help-section-title-lg">
            Frequently Asked Questions
          </h2>
          <div className="wmx-help-faq-list">
            {FAQS.map(({ q, a }) => (
              <AccordionItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Still Need Help ── */}
      <section className="wmx-help-section wmx-help-section-last">
        <div className="wmx-help-container wmx-help-container-narrow">
          <div className="wmx-help-card wmx-help-support-card">
            <h2 className="wmx-help-section-title">Still Need Help?</h2>
            <p className="wmx-help-support-text">
              Send us a message and we'll get back to you as soon as possible.
            </p>
            <SupportForm />
          </div>
        </div>
      </section>

    </div>
  );
}
