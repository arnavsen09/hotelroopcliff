(() => {
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const rooms=window.ROOP_ROOMS||[];
 const fmt=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
 const today=()=>{let d=new Date();d.setHours(12,0,0,0);return d.toISOString().slice(0,10)};
 const plus=(date,n=1)=>{let d=new Date((date||today())+"T12:00:00");d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
 const getState=()=>{try{return JSON.parse(localStorage.getItem("roopCliffBooking")||"{}")}catch{return {}}};
 const saveState=s=>localStorage.setItem("roopCliffBooking",JSON.stringify({...getState(),...s}));
 const current=()=>{const s=getState();return {...s,room:rooms.find(r=>r.name===s.room)||rooms[0]}};
 const nights=(a,b)=>Math.max(1,Math.round((new Date(b+"T12:00:00")-new Date(a+"T12:00:00"))/86400000)||1);
 const amount=s=>{const r=s.room||rooms[0];const rate=s.plan==="breakfast"?r.breakfast:r.rate;const tax=s.plan==="breakfast"?r.breakfastTax:r.tax;const q=Math.max(1,Number(s.roomQty||1));return {n:nights(s.checkin,s.checkout),rate,tax,q,subtotal:rate*q*nights(s.checkin,s.checkout),taxTotal:tax*q*nights(s.checkin,s.checkout),total:(rate+tax)*q*nights(s.checkin,s.checkout)}};
 const toast=$("#toast");let toastTimer;
 function say(t){if(!toast)return;toast.textContent=t;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),3500)}
 function summaryHtml(s){const r=s.room||rooms[0],a=amount(s);return `<div class="mini-room"><img src="${r.img}" alt=""><div><small>${r.area} · up to ${r.guests} guests</small><strong>${r.name}</strong><small>${r.bed}</small></div></div><div class="summary-line"><span>Stay</span><strong>${s.checkin||"Select date"} → ${s.checkout||"Select date"}</strong></div><div class="summary-line"><span>Duration</span><strong>${a.n} night(s)</strong></div><div class="summary-line"><span>Rooms</span><strong>${a.q}</strong></div><div class="summary-line"><span>Guests</span><strong>${s.guests||2} adult(s) total</strong></div><div class="summary-line"><span>Rate plan</span><strong>${s.plan==="breakfast"?"Breakfast included":"Room only"}</strong></div><div class="summary-line"><span>Extra bed</span><strong>${s.extraBed==="yes"?"Requested — price not included":"No"}</strong></div><div class="summary-line"><span>Room subtotal</span><strong>${fmt(a.subtotal)}</strong></div><div class="summary-line"><span>Estimated taxes/fees</span><strong>${fmt(a.taxTotal)}</strong></div><div class="summary-total"><span>Demo total</span><strong>${fmt(a.total)}</strong></div>${s.extraBed==="yes"?'<div class="occupancy-note">Extra bed/mattress is only a request. Its availability, additional charge and whether breakfast is included must be confirmed with Roop Cliff. No extra-bed fee is included in this estimate.</div>':'<div class="occupancy-note">This estimate assumes the selected room rate applies to each room. The hotel must confirm maximum guests per room and any extra-person charges.</div>'}`}
 function validDates(a,b){if(!a||!b)return "Please choose check-in and check-out dates.";if(a<today())return "Check-in cannot be in the past.";if(b<=a)return "Check-out must be after check-in.";return ""}

 // Make room cards fully tappable, not just the tiny arrow/link target.
 function goToRoom(room){ location.href="booking.html?room="+encodeURIComponent(room); }
 $$(".room-card[data-room]").forEach(card=>{
   card.addEventListener("click",e=>{
     if(e.target.closest("a,button,input,select,textarea")) return;
     goToRoom(card.dataset.room);
   });
   card.addEventListener("keydown",e=>{
     if((e.key==="Enter"||e.key===" ")&&e.target===card){e.preventDefault();goToRoom(card.dataset.room)}
   });
 });
 $$(".room-list-card[data-room-card]").forEach(card=>{
   card.addEventListener("click",e=>{
     if(e.target.closest("a,button,input,select,textarea")) return;
     goToRoom(card.dataset.roomCard);
   });
   card.addEventListener("keydown",e=>{
     if((e.key==="Enter"||e.key===" ")&&e.target===card){e.preventDefault();goToRoom(card.dataset.roomCard)}
   });
 });

 // Global navigation and motion
 const toggle=$("#menuToggle"),nav=$("#navLinks");
 if(toggle&&nav)toggle.addEventListener("click",()=>{const o=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(o))});
 $$("#navLinks a").forEach(a=>a.addEventListener("click",()=>{nav?.classList.remove("open");toggle?.setAttribute("aria-expanded","false")}));
 const year=$("#year");if(year)year.textContent=new Date().getFullYear();
 if("IntersectionObserver"in window){const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");ob.unobserve(e.target)}}),{threshold:.12});$$(".reveal").forEach(el=>ob.observe(el))}else $$(".reveal").forEach(el=>el.classList.add("visible"));
 // Homepage date search now proceeds into the full booking journey.
 const homeForm=$("#availabilityForm");
 if(homeForm){const ci=$("#checkin"),co=$("#checkout");if(ci){ci.min=today();ci.value=ci.value||plus(today(),1)}if(co){co.min=plus(ci?.value||today());co.value=co.value||plus(ci?.value||today(),1)}ci?.addEventListener("change",()=>{co.min=plus(ci.value);if(co.value<=ci.value)co.value=plus(ci.value)});homeForm.addEventListener("submit",e=>{e.preventDefault();const issue=validDates(ci.value,co.value);if(issue)return say(issue);saveState({checkin:ci.value,checkout:co.value,guests:$("#guests")?.value||"2",roomQty:"1",extraBed:"no"});location.href="booking.html"})}
 // Booking selection
 const bookingForm=$("#bookingForm");
 if(bookingForm){const s=getState();const ci=$("#bookingCheckin"),co=$("#bookingCheckout"),gu=$("#bookingGuests"),qty=$("#bookingRoomQty"),bed=$("#bookingExtraBed"),rm=$("#bookingRoom"),pl=$("#bookingPlan");
 rooms.forEach(r=>{const o=document.createElement("option");o.value=r.name;o.textContent=r.name;rm.append(o)});
 ci.min=today();ci.value=s.checkin||plus(today(),1);co.min=plus(ci.value);co.value=s.checkout||plus(ci.value,1);gu.value=s.guests||"2";if(qty)qty.value=s.roomQty||"1";if(bed)bed.value=s.extraBed||"no";rm.value=new URLSearchParams(location.search).get("room")||s.room||rooms[0].name;pl.value=s.plan||"room";
 const draw=()=>{saveState({checkin:ci.value,checkout:co.value,guests:gu.value,roomQty:qty?.value||"1",extraBed:bed?.value||"no",room:rm.value,plan:pl.value});const target=$("#bookingSummary");if(target)target.innerHTML=summaryHtml(current())};
 [ci,co,gu,qty,bed,rm,pl].filter(Boolean).forEach(el=>el.addEventListener("change",()=>{if(el===ci){co.min=plus(ci.value);if(co.value<=ci.value)co.value=plus(ci.value)}draw()}));draw();
 bookingForm.addEventListener("submit",e=>{e.preventDefault();const issue=validDates(ci.value,co.value);if(issue)return say(issue);draw();location.href="checkout.html"})}
 // Guest details
 const checkoutForm=$("#checkoutForm");
 if(checkoutForm){const target=$("#checkoutSummary");if(target)target.innerHTML=summaryHtml(current());checkoutForm.addEventListener("submit",e=>{e.preventDefault();const fd=new FormData(checkoutForm);saveState({guest:{firstName:fd.get("firstName"),lastName:fd.get("lastName"),email:fd.get("email"),phone:fd.get("phone"),request:fd.get("request")}});location.href="payment.html"})}
 // Payment preview
 const paymentForm=$("#paymentForm");
 if(paymentForm){const target=$("#paymentSummary");if(target)target.innerHTML=summaryHtml(current());paymentForm.addEventListener("submit",e=>{e.preventDefault();const method=new FormData(paymentForm).get("method");saveState({paymentMethod:method,demoReference:"RC-DEMO-"+Math.random().toString(36).slice(2,8).toUpperCase()});location.href="confirmation.html"})}
 // Final summary
 const confirm=$("#confirmationSummary");if(confirm){const s=current();confirm.innerHTML=summaryHtml(s)+`<div class="summary-line"><span>Payment option selected</span><strong>${s.paymentMethod||"Demo only"}</strong></div><div class="summary-line"><span>Demo reference</span><strong>${s.demoReference||"RC-DEMO-PREVIEW"}</strong></div>`}
})();