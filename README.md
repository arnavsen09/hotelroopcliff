# Roop Cliff Bhopal — React Web Application

A modern, responsive React and Vite application for Roop Cliff in Maharana Pratap Nagar, Bhopal. Rewritten from the original static web project into a modular, production-ready React SPA while preserving 100% of the original features, visual identity, rate calculation logic, and interactive booking preview journeys.

## Features

- **Editorial City-Hotel Identity**: Retains the custom editorial typography and color palette (ink, stone, deep slate, terracotta/gold) with full responsive layout support.
- **Interactive Booking Journey (4-Step Flow)**:
  1. **Stay & Room Selection (`/booking`)**: Real-time date validation, room quantity selection (1–4 rooms), guest counts (1–8 adults), extra bed/mattress requests, and rate plan toggling (Room only vs. Breakfast included).
  2. **Guest Details (`/checkout`)**: Form validation for guest name, email, phone, special requests, and safety demo disclaimer.
  3. **Payment Preview (`/payment`)**: Method selection (UPI, Credit/Debit card, Net banking, Pay at property) with demo transaction simulation.
  4. **Confirmation (`/confirmation`)**: Formatted reservation preview with unique reference code (`RC-DEMO-XXXXXX`), complete breakdown, and occupancy notes.
- **Quick Availability Search**: Homepage date bar with automated date constraint logic (min date today, checkout after checkin) passing parameters seamlessly into the booking flow.
- **Room Catalog (`/rooms`)**: Comprehensive cards for Deluxe Room, Cliff Twin, Super Luxe, and Cliff Suite with room dimensions, capacities, inclusions, and sample OTA pricing breakdowns.
- **Dining (`/dining`)**: Overview of on-site dining and vegetarian breakfast features with listing notes.
- **Gallery (`/gallery`)**: Curated photo grid of property exterior, lobby, and guest rooms.
- **Location & Directions (`/location`)**: Address in MP Nagar Zone-I near Chetak Bridge, interactive stylized map visual, and direct links to Google Maps.
- **Interactive Enquiry Modal**: Accessible enquiry modal on the homepage with date picking, room preferences, and demo ticket generation.
- **State Persistence**: Stay parameters stored in `localStorage` (`roopCliffBooking`) allowing smooth back-and-forth navigation across steps.

## Development

Run the development server on port 3000:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router v7
- Custom CSS with responsive breakpoints and typography
