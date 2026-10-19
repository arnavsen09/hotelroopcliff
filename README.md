# Roop Cliff — Website Preview

A responsive, premium-style frontend concept for Roop Cliff, Bhopal. Built with plain HTML, CSS and JavaScript so it can be previewed without installing packages or using an AI coding subscription.

## Run it

1. Extract the ZIP file.
2. Open `index.html` in a modern browser.

For a more realistic local web server, open a terminal in this folder and run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Included

- Responsive homepage with sticky navigation and mobile menu
- Room cards for Deluxe Room, Cliff Twin, Super Luxe and Cliff Suite
- Date selection and guest count
- Date validation (check-out must be after check-in)
- Enquiry dialog with client-side validation
- Demo reference number and success-state preview
- Scroll reveal animations and reduced-motion support
- Location link to Google Maps
- No build step and no external JavaScript dependencies

## Important: demo vs production

This project is a **frontend demo**, not a live hotel reservation system.

- The enquiry form does not transmit or save submitted details.
- Demo reference numbers are generated in the browser and are not real booking IDs.
- Date selection does not check live room inventory.
- No rates, taxes, availability, payment gateway, email/SMS notifications or secure admin dashboard are connected.
- The room details and amenities marked with asterisks must be verified with the hotel.
- Some images now reference photos shown on third-party hotel listing pages for Roop Cliff. The listing images are externally hosted, not bundled in this ZIP, and may be subject to the listing provider’s terms or copyright. Get the hotel’s original/approved image files and permission for website use before public launch; external image links can change or stop working.
- The address shown is a working draft and must be verified by the hotel before publication.

Before launch, replace illustrative images with owner-approved property photography, confirm every hotel detail, implement a secure backend/database and staff authentication, validate availability/pricing server-side, and test all booking and payment flows. Never treat this preview's demo confirmation as a reservation.

## Files

- `index.html` — page structure and content
- `styles.css` — visual design, responsive layouts, animation
- `script.js` — date checks, menu, demo enquiry interaction


## Indicative prices added

Room cards now display a snapshot of rates surfaced on MakeMyTrip for a sample 1-night stay around 21 October 2026:
- Deluxe Room: ₹3,903 room-only / ₹4,600 with breakfast, plus approximate taxes
- Cliff Twin: ₹4,739 room-only / ₹5,436 with breakfast, plus approximate taxes
- Super Luxe: ₹5,436 room-only / ₹6,133 with breakfast, plus approximate taxes
- Cliff Suite: ₹6,273 room-only / ₹6,830 with breakfast, plus approximate taxes

These are third-party listing rates, not verified direct hotel tariffs. Rates vary by dates, occupancy, offers and availability. Confirm current prices with the hotel before public launch. Source: MakeMyTrip Roop Cliff listing (accessed 14 October 2026): https://www.makemytrip.com/hotels/roop_cliff-details-bhopal.html


## Room-specific information and images updated

Room cards now use property-listing photography rather than generic Unsplash stock photos:
- Deluxe Room: 230 sq ft, up to 3 guests, king bed, city view.
- Cliff Twin: 250 sq ft, up to 2 guests, two single beds, city view.
- Super Luxe: 280 sq ft, up to 3 guests, king bed, city view.
- Cliff Suite: 425 sq ft, up to 3 guests, king bed, city view.

Current sample MakeMyTrip listing rates for 26–27 October 2026 are shown as room-only and breakfast-inclusive options. Taxes/fees are additional and the rates are not guaranteed direct tariffs. Prices should be verified with the hotel before launch.

Sources:
- MakeMyTrip: https://www.makemytrip.com/hotels/roop_cliff-details-bhopal.html
- Hotels.com: https://in.hotels.com/ho3916181824/
- Booking.com property listing: https://www.booking.com/hotel/in/roop-cliff-bhopal.html

Image rights are not assumed. Obtain owner approval or permission to reuse listing photos before public launch.


## UI refinement
The visual palette has been toned down to charcoal, warm white and muted terracotta, with Inter and Lora typography. Room cards are now fully tappable/clickable, with keyboard activation and an obvious hover/focus affordance. Explicit buttons remain usable independently.


## Stronger visual redesign (V2)
This pass changes the overall visual language, not just the palette:
- Bodoni Moda display typography and Manrope UI/body type.
- Ink charcoal, chalk, warm stone and rust/terracotta accents.
- Larger editorial headlines, tighter tracking, simpler square-edged controls.
- More restrained room cards and image treatments; less decorative gold/green styling.
- Responsive adjustments for mobile.


## V3 design direction
The display serif is removed. Manrope is used for headlines and Inter for body/UI text. Palette is now deep blue, cool mist, white and muted teal. Components use a modern city-hotel style with restrained borders, rounded controls and clear room pricing.


## Price consistency fix
The same MakeMyTrip sample-rate snapshot is now used by the homepage and the booking/checkout flow:
- Deluxe Room: ₹3,579 room only + ₹546 estimated taxes; ₹4,218 breakfast rate + ₹644 estimated taxes.
- Cliff Twin: ₹4,345 room only + ₹664 estimated taxes; ₹4,984 breakfast rate + ₹761 estimated taxes.
- Super Luxe: ₹4,984 room only + ₹761 estimated taxes; ₹5,623 breakfast rate + ₹859 estimated taxes.
- Cliff Suite: ₹5,752 room only + ₹879 estimated taxes; ₹6,262 breakfast rate + ₹957 estimated taxes.

The rate data is a static OTA snapshot, not date-dependent or live availability pricing. Confirm with the hotel before launch.


## Room quantity, occupancy and extra-bed selection
The booking step now lets guests select 1–4 rooms, total adult count and whether they want to request an extra bed/mattress. The estimate multiplies the selected room rate and listed taxes by room quantity. It does not invent an extra-bed fee or promise breakfast for an extra guest. Roop Cliff must confirm room-wise occupancy, extra-bed availability and cost, and whether the extra-person/extra-bed plan includes breakfast. Public listings mention extra mattress availability may depend on property policy; Booking.com currently indicates extra beds are unavailable for its listed rate/property setup, so this must be explicitly confirmed with the hotel before launch.
