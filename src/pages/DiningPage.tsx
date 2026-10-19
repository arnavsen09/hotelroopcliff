import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

export const DiningPage: React.FC = () => {
  return (
    <>
      <main>
        <section className="page-hero">
          <span className="eyebrow light">FOOD &amp; DINING</span>
          <h1>
            A little pause
            <br />
            in the <em>day.</em>
          </h1>
          <p>Make room for a relaxed start or a simple meal during your stay.</p>
        </section>

        <div className="breadcrumb">
          <Link to="/">HOME</Link>　/　DINING
        </div>

        <section className="content-wrap">
          <div className="photo-strip">
            <img
              src="https://r1imghtlak.mmtcdn.com/78404fdd-27fd-47a7-a929-3def08deee17.jpeg?crop=480%3A336&downsize=480%3A336&downsize=520%3A350&output-format=jpg&output-quality=75"
              alt="Roop Cliff exterior listing photo"
            />
            <img
              src="https://images.trvl-media.com/lodging/123000000/122350000/122349500/122349432/66991da1.jpg?h=800&impolicy=fcrop&w=1200"
              alt="Hotel room listing photo"
            />
          </div>

          <div className="two-col">
            <div>
              <span className="eyebrow">ON-SITE DINING</span>
              <h2>Simple, convenient, close at hand.</h2>
              <p style={{ fontSize: '12px', lineHeight: 2, color: '#74796f', marginBottom: '24px' }}>
                Public hotel listings indicate an on-site restaurant and vegetarian breakfast. Menu, service hours, breakfast inclusions and current availability should be confirmed directly with the property before publishing detailed claims.
              </p>
              <Link className="button button-dark" to="/booking">
                Plan your stay <span>↗</span>
              </Link>
            </div>

            <div className="surface-card">
              <h3>Before you visit</h3>
              <div className="summary-line">
                <span>Restaurant</span>
                <strong>Listed on OTA</strong>
              </div>
              <div className="summary-line">
                <span>Breakfast</span>
                <strong>Vegetarian listing</strong>
              </div>
              <div className="summary-line">
                <span>Menu &amp; hours</span>
                <strong>Confirm with hotel</strong>
              </div>
              <p className="fine-print">
                No unverified menu, pricing or service hours are being invented for this preview.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};
