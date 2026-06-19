import React from 'react'

export default function CtaSection() {
  return (
    <>
    <style>{styles}</style>
    <section id="cta">
      <div className="cta-inner reveal">
        <div className="sec-tag" id="ctaSectionTag">Get a Free Quote</div>
        <h2 className="sec-h" id="ctaTitle">Ready to Ship</h2>
        <p id="ctaDesc">Partner with MahaveerTrans for fast, reliable, and transparent logistics solutions that help your business scale.</p>
        <div className="cta-btns">
          <button className="btn-w" id="ctaCta1">Get Free Quote →</button>
          <button className="btn-wg" id="ctaPhone">📞 Call us</button>
        </div>
      </div>
    </section>
    </>
  )
}

const styles = `

    #cta {
      background: var(--dark-bg);
      position: relative;
      overflow: hidden;
      text-align: center;
      padding: 7.5rem 5%;
    }

    #cta::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80&auto=format&fit=crop');
      background-size: cover;
      background-position: center;
      opacity: .07;
    }

    #cta::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 55% 75% at 50% 50%, rgba(14, 165, 233, .18), transparent);
      pointer-events: none;
    }

    .cta-inner {
      position: relative;
      z-index: 2;
      max-width: 660px;
      margin: 0 auto;
    }

    .cta-inner .sec-tag {
      justify-content: center;
      color: var(--accent);
    }

    .cta-inner .sec-tag::before {
      display: none;
    }

    .cta-inner .sec-h {
      color: #f1f5f9;
      font-size: clamp(2.2rem, 4.5vw, 3.6rem);
      margin-bottom: 1.1rem;
    }

    .cta-inner>p {
      color: rgba(255, 255, 255, .42);
      line-height: 1.75;
      font-size: .97rem;
      margin-bottom: 2.25rem;
    }

    .cta-btns {
      display: flex;
      gap: .85rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-w {
      background: #fff;
      color: var(--dark-bg);
      padding: .82rem 1.9rem;
      border-radius: 10px;
      font-family: var(--font-body);
      font-size: .92rem;
      font-weight: 700;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: .45rem;
      transition: all .25s;
    }

    .btn-w:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(255, 255, 255, .12);
    }

    .btn-wg {
      background: rgba(255, 255, 255, .07);
      color: rgba(255, 255, 255, .78);
      padding: .82rem 1.9rem;
      border-radius: 10px;
      font-family: var(--font-body);
      font-size: .92rem;
      font-weight: 600;
      border: 1.5px solid rgba(255, 255, 255, .1);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: .45rem;
      transition: all .25s;
    }

    .btn-wg:hover {
      border-color: var(--accent);
      color: var(--accent);
    }

`;