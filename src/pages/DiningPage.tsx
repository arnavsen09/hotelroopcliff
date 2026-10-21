import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { CardTilt } from '../components/CardTilt';

export const DiningPage: React.FC = () => {
  return (
    <>
      <main>
        <section className="page-hero">
          <span className="eyebrow light">EPICUREAN EXPERIENCES</span>
          <h1>
            Pure Vegetarian
            <br />
            <em>Artisanal Dining.</em>
          </h1>
          <p>
            Awaken to bespoke morning breakfast spreads, authentic Malwa flavors, and round-the-clock in-room dining prepared with pure ingredients.
          </p>
        </section>

        <div className="breadcrumb">
          <Link to="/">HOME</Link>　/　DINING &amp; CULINARY
        </div>

        <section className="content-wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <CardTilt maxTilt={4} glare={true} style={{ borderRadius: '8px', overflow: 'hidden', height: '340px' }}>
              <img
                src="https://gos3.ibcdn.com/c3155b2b-7d32-40b8-b436-e69452890389.jpeg"
                alt="Roop Cliff Dining Room"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </CardTilt>
            <CardTilt maxTilt={4} glare={true} style={{ borderRadius: '8px', overflow: 'hidden', height: '340px' }}>
              <img
                src="https://images.trvl-media.com/lodging/123000000/122350000/122349500/122349432/66991da1.jpg?h=800&impolicy=fcrop&w=1200"
                alt="In-suite Morning Breakfast Service"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </CardTilt>
          </div>

          <div className="two-col">
            <div>
              <span className="eyebrow">REFINED GASTRONOMY</span>
              <h2>Flavors of Warmth &amp; Tradition</h2>
              <p style={{ fontSize: '13px', lineHeight: 2, color: '#4C5D54', marginBottom: '24px' }}>
                Roop Cliff Hotel takes pride in serving pure vegetarian delicacies with a focus on fresh regional sourcing. Enjoy wholesome breakfast platters with hot filter coffee, poha-jalebi, parathas, and light continental options.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link className="button button-gold" to="/booking">
                  Book Stay with Breakfast <span>↗</span>
                </Link>
                <Link className="button button-dark" to="/rooms">
                  Explore Suites <span>↗</span>
                </Link>
              </div>
            </div>

            <div className="surface-card">
              <span className="eyebrow">DINING INFORMATION</span>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '24px', margin: '8px 0 16px', color: 'var(--green-deep)' }}>
                Gastronomy Guidelines
              </h3>
              <div className="summary-line">
                <span>Cuisine Concept</span>
                <strong>100% Pure Vegetarian</strong>
              </div>
              <div className="summary-line">
                <span>Morning Breakfast</span>
                <strong>7:30 AM – 10:30 AM Daily</strong>
              </div>
              <div className="summary-line">
                <span>In-Room Service</span>
                <strong>Available to All Suites</strong>
              </div>
              <div className="summary-line">
                <span>Banqueting &amp; Gatherings</span>
                <strong>Customized Menu on Request</strong>
              </div>
              <p className="fine-print" style={{ marginTop: '18px' }}>
                Dietary preferences, Jain food preparations, and customized family dining packages can be arranged in advance through our guest concierge.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};
