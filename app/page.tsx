import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import { ExperienceLayer } from "@/components/ExperienceLayer";
import { InteractiveDemo } from "@/components/InteractiveDemo";
import { SessionRecommender } from "@/components/SessionRecommender";
import { products, type ProductKey } from "@/lib/products";
import { isCheckoutEnabled, siteConfig } from "@/lib/site";

type SessionOption = {
  productKey: ProductKey;
  description: string;
  idealFor: string;
  features: readonly string[];
  featured?: boolean;
};

const sessions: SessionOption[] = [
  {
    productKey: "beginner",
    idealFor: "Your first confident step",
    description: "A patient, welcoming introduction to the AI tools reshaping everyday life.",
    features: ["AI fundamentals in plain English", "Guided ChatGPT practice", "Safety and scam awareness"],
  },
  {
    productKey: "workshop",
    idealFor: "Practical skills, fast",
    description: "Build useful workflows for work, school, creativity, and business with live guidance.",
    features: ["Hands-on prompt coaching", "Real-world workflow building", "Personalized use-case support"],
    featured: true,
  },
  {
    productKey: "bootcamp",
    idealFor: "Your complete AI reset",
    description: "An immersive day of tools, projects, safety, strategy, and a clear personal action plan.",
    features: ["Full AI toolkit orientation", "Multiple guided projects", "90-day clarity roadmap"],
  },
];

const outcomes = [
  { number: "01", title: "Ask with intention", copy: "Turn vague ideas into prompts that produce useful, dependable results." },
  { number: "02", title: "Create with confidence", copy: "Draft documents, images, plans, and content without losing your voice." },
  { number: "03", title: "Save meaningful time", copy: "Spot repeatable tasks and build simple workflows you can use every week." },
  { number: "04", title: "Use AI responsibly", copy: "Recognize misinformation, protect private data, and know when to verify." },
];

const audiences = ["Complete beginners", "Creators", "Small business owners", "Students and families", "Community groups", "Career changers"];

const testimonials = [
  { quote: "The pace felt human. I stopped feeling behind and started seeing where AI could genuinely help me.", label: "Beginner learner" },
  { quote: "I left with prompts and workflows I could use the same day—not another folder of notes I would never open.", label: "Small business owner" },
  { quote: "The safety guidance made the difference. It was practical, honest, and easy to explain to my family.", label: "Community participant" },
];

const faqs = [
  ["Do I need any AI or technical experience?", "None. Sessions begin with the fundamentals and every step is explained in everyday language. You will never be expected to code."],
  ["What should I bring?", "Bring a charged phone, tablet, or laptop. A laptop offers the most room to practice, but any modern device works."],
  ["Are sessions available for private groups?", "Yes. Sessions can be adapted for families, teams, churches, community organizations, and small businesses. Use the contact page to discuss your group."],
  ["Can teenagers attend?", "Yes. Family-friendly, age-appropriate sessions can be arranged. A parent or guardian should contact us before booking for a minor."],
  ["What happens after I pay?", `Stripe emails your receipt immediately. We then contact you ${siteConfig.schedulingWindow} to agree on the session date, format, and location.`],
  ["What is the refund policy?", "If a workable date cannot be agreed within 14 days, you may request a full refund. See the refund policy for complete terms."],
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: siteConfig.name,
  url: `https://${siteConfig.domain}`,
  email: siteConfig.supportEmail,
  founder: { "@type": "Person", name: "Osborn G. Nelson II" },
  description: "Beginner-friendly, hands-on artificial intelligence education for everyday people, creators, families, and organizations.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(([question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

export default function Home() {
  const checkoutEnabled = isCheckoutEnabled();

  return (
    <main id="main-content" className="site-shell">
      <ExperienceLayer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="site-header">
        <div className="site-container nav-wrap">
          <Link href="/" className="brand" aria-label="AI Clarity Sessions home">
            <span className="brand-glyph" aria-hidden="true">AC</span>
            <span><strong>AI Clarity</strong><small>Sessions</small></span>
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#experience">Experience</a>
            <a href="#instructor">Instructor</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a href="#pricing" className="nav-cta">Reserve a seat <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orb hero-orb-a" aria-hidden="true" />
        <div className="hero-orb hero-orb-b" aria-hidden="true" />
        <div className="site-container hero-layout">
          <div className="hero-copy">
            <p className="pill"><span aria-hidden="true" /> AI education for real life</p>
            <h1 id="hero-title">Understand AI.<br /><em>Use it with confidence.</em></h1>
            <p className="hero-lede">A hands-on learning experience that turns fast-moving technology into clear, practical skills—without code, jargon, or judgment.</p>
            <div className="hero-actions">
              <a href="#pricing" className="button-glow">Explore sessions <span aria-hidden="true">→</span></a>
              <a href="#demo" className="button-quiet"><span className="play" aria-hidden="true">▶</span> Try the live demo</a>
            </div>
            <div className="hero-proof" aria-label="Session benefits">
              <span><b>01</b> Plain English</span><span><b>02</b> Guided practice</span><span><b>03</b> Skills for today</span>
            </div>
          </div>

          <div className="hero-stage" aria-label="A preview of the learning experience">
            <div className="stage-glow" aria-hidden="true" />
            <div className="prompt-window">
              <div className="window-top"><span /><span /><span /><small>clarity.session</small></div>
              <div className="window-body">
                <p className="window-label">YOUR IDEA</p>
                <p className="user-prompt">Help me turn a rough idea into a clear plan I can start this week.</p>
                <div className="thinking-line"><i /><span>Turning uncertainty into next steps</span></div>
                <div className="result-lines" aria-hidden="true"><i /><i /><i /></div>
                <div className="clarity-score"><span>Clarity gained</span><strong>94%</strong></div>
              </div>
            </div>
            <div className="float-card float-card-one"><span>✦</span><div><small>NO CODE REQUIRED</small><strong>Built for beginners</strong></div></div>
            <div className="float-card float-card-two"><small>YOUR NEXT STEP</small><strong>Clear. Useful. Yours.</strong></div>
          </div>
        </div>
        <div className="scroll-cue" aria-hidden="true"><span /> Scroll to discover</div>
      </section>

      <section className="trust-strip" aria-label="What makes the sessions different">
        <div className="site-container trust-grid"><span>Beginner-first</span><span>Human-guided</span><span>Safety-conscious</span><span>Secure Stripe checkout</span></div>
      </section>

      <section id="experience" className="section section-light">
        <div className="site-container">
          <div className="section-heading split-heading">
            <div><p className="kicker">The clarity method</p><h2>Less overwhelm.<br />More forward motion.</h2></div>
            <p>You will not sit through a technical lecture. You will watch, practice, ask questions, and build useful skills in a calm, encouraging environment.</p>
          </div>
          <div className="outcome-grid">
            {outcomes.map((outcome) => <article className="outcome" key={outcome.number}><span>{outcome.number}</span><h3>{outcome.title}</h3><p>{outcome.copy}</p><i aria-hidden="true">↗</i></article>)}
          </div>
          <div className="audience-row"><p>Designed with room for</p><div>{audiences.map((audience) => <span key={audience}>{audience}</span>)}</div></div>
        </div>
      </section>

      <InteractiveDemo />
      <SessionRecommender />

      <section id="instructor" className="section instructor-section">
        <div className="site-container instructor-grid">
          <div className="portrait-card" aria-label="Instructor portrait monogram for Osborn G. Nelson II">
            <div className="portrait-halo" aria-hidden="true" />
            <span className="portrait-monogram">ON</span>
            <div className="portrait-caption"><small>YOUR INSTRUCTOR</small><strong>Patient guidance.<br />Practical perspective.</strong></div>
          </div>
          <div className="instructor-copy">
            <p className="kicker kicker-dark">Meet your guide</p>
            <h2>Osborn G.<br />Nelson II</h2>
            <p className="instructor-lede">AI should expand what people can do—not make them feel left behind.</p>
            <p>Osborn teaches with patience, clarity, and respect for where every learner begins. Sessions focus on practical results, thoughtful questions, and the confidence to keep learning after class ends.</p>
            <div className="instructor-values"><span><b>01</b> No judgment</span><span><b>02</b> Plain language</span><span><b>03</b> Real practice</span></div>
          </div>
        </div>
      </section>

      <section className="section testimonials-section">
        <div className="site-container">
          <div className="section-heading center-heading"><p className="kicker">The learning experience</p><h2>Clarity changes what feels possible.</h2><p>What learners value most about a patient, practical approach to AI.</p></div>
          <div className="testimonial-grid">{testimonials.map((item) => <figure key={item.label}><div className="stars" aria-label="Five stars">★★★★★</div><blockquote>“{item.quote}”</blockquote><figcaption><span aria-hidden="true">✦</span>{item.label}</figcaption></figure>)}</div>
        </div>
      </section>

      <section id="pricing" className="section pricing-section">
        <div className="site-container">
          <div className="section-heading center-heading"><p className="kicker">Choose your starting point</p><h2>One clear investment.<br />Skills that keep paying back.</h2><p>Every session includes patient instruction, guided practice, and secure checkout through Stripe.</p></div>
          <div className="pricing-grid">
            {sessions.map((session) => {
              const product = products[session.productKey];
              return <article className={`pricing-card${session.featured ? " featured" : ""}`} key={session.productKey}>
                {session.featured && <p className="popular">Most popular</p>}
                <p className="plan-for">{session.idealFor}</p><h3>{product.shortName}</h3>
                <div className="price"><strong>{product.displayPrice}</strong><span>per person</span></div>
                <p className="duration">{product.duration} · {product.delivery}</p><p className="plan-copy">{session.description}</p>
                <ul>{session.features.map((feature) => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}</ul>
                <CheckoutButton product={session.productKey} label={`Reserve ${product.shortName}`} disabled={!checkoutEnabled} disabledMessage="Secure registration is opening soon." />
              </article>;
            })}
          </div>
          <article className="membership-card"><div><p className="kicker">Keep learning</p><h3>{products.membership.shortName}</h3><p>Ongoing AI tips, educational resources, updates, and member benefits. Renews monthly until canceled.</p></div><div className="membership-action"><strong>{products.membership.displayPrice}</strong><CheckoutButton product="membership" label="Join the membership" disabled={!checkoutEnabled} /></div></article>
          <p className="pricing-note"><span aria-hidden="true">◇</span> Secure payment · Clear refund policy · Personal scheduling support</p>
        </div>
      </section>

      <section id="faq" className="section faq-section">
        <div className="site-container faq-layout"><div className="faq-intro"><p className="kicker">Questions, answered</p><h2>Everything you need to feel ready.</h2><p>Still wondering whether a session fits? We are happy to help.</p><Link href="/contact">Ask a question <span aria-hidden="true">→</span></Link></div>
          <div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary><span>{question}</span><i aria-hidden="true">+</i></summary><p>{answer}</p></details>)}</div></div>
      </section>

      <section className="final-cta"><div className="cta-orb" aria-hidden="true" /><div className="site-container"><p>YOUR NEXT CHAPTER CAN START HERE</p><h2>AI is moving fast.<br /><em>You can move with it.</em></h2><a href="#pricing" className="button-glow">Find your session <span aria-hidden="true">→</span></a></div></section>

      <footer className="site-footer"><div className="site-container footer-grid"><div><Link href="/" className="brand brand-footer"><span className="brand-glyph">AC</span><span><strong>AI Clarity</strong><small>Sessions</small></span></Link><p>Practical AI education presented clearly, safely, and personally.</p></div><div><h2>Explore</h2><a href="#experience">The experience</a><a href="#instructor">Instructor</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></div><div><h2>Information</h2><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/refunds">Refunds</Link></div><div><h2>Stay curious</h2><p>Questions about a session or private group?</p><a className="email-link" href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a></div></div><div className="site-container footer-bottom"><span>© {new Date().getFullYear()} AI Clarity Sessions</span><span>Human-first AI education</span></div></footer>

      <a href="#pricing" className="mobile-cta">Reserve your seat <span aria-hidden="true">→</span></a>
    </main>
  );
}
