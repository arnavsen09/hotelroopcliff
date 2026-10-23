import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

export const LocationPage: React.FC = () => {
  return (
    <>
      <main>
        <section className="page-hero">
          <span className="eyebrow light">LOCATION</span>
          <h1>
            Well placed for
            <br />
            <em>what brings you.</em>
          </h1>
          <p>Find Roop Cliff in Maharana Pratap Nagar, Bhopal.</p>
        </section>

        <div className="breadcrumb">
          <Link to="/">HOME</Link>　/　LOCATION
        </div>

        <section className="content-wrap">
          <div className="two-col">
            <div>
              <img
                style={{ width: '100%', maxHeight: '430px', objectFit: 'cover', borderRadius: '4px' }}
                src="/hotel img.jpeg"
                alt="Hotel Roop Cliff exterior illuminated in MP Nagar Bhopal"
              />
              <h2 style={{ font: '34px var(--serif)', fontWeight: 400, marginTop: '28px' }}>
                Roop Cliff, Bhopal
              </h2>
              <p style={{ fontSize: '12px', lineHeight: 2, color: '#74796f', marginBottom: '20px' }}>
                Plot No. 33, Zone-I, Maharana Pratap Nagar, Narmadapuram Road, near Chetak Bridge, Bhopal, Madhya Pradesh 462011.
              </p>
              <a
                className="button button-dark"
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.google.com/maps/search/?api=1&query=Roop+Cliff+MP+Nagar+Bhopal"
              >
                Open Google Maps <span>↗</span>
              </a>
            </div>

            <div className="surface-card">
              <span className="eyebrow">GETTING HERE</span>
              <h2>Make the arrival easy.</h2>
              <div className="summary-line">
                <span>Neighbourhood</span>
                <strong>MP Nagar, Zone-I</strong>
              </div>
              <div className="summary-line">
                <span>Landmark</span>
                <strong>Chetak Bridge</strong>
              </div>
              <div className="summary-line">
                <span>Address status</span>
                <strong>Public listing</strong>
              </div>
              <p className="notice">
                Please verify the exact address, directions and current contact details with the hotel before launch. Distances and travel times are not invented here.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};
