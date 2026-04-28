import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Phone, ArrowRight, Package, Truck, Ruler, ShieldCheck, FileText, CheckCircle2, ShoppingBag, MapPin, Star } from 'lucide-react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { saveQuoteRequest, getProducts } from './firebase';
import AdminPage from './pages/Admin';

const fadeUp: any = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const SectionWrapper = ({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) => {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.15 } }
      }}
      className={`py-24 px-6 md:px-12 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </motion.section>
  );
};



const REVIEWS = [
  { name: "Arjun Reddy", role: "Lead Architect", text: "Simhachalam Timber Depot provided the most exquisite Burmese Teak for our luxury villa project. The CNC cuts were precise to the millimeter." },
  { name: "Sophia M.", role: "Interior Designer", text: "Their rosewood selection is unmatched. Delivery was right on time and the quality exceeded all expectations. My go-to timber depot." },
  { name: "Raman Constructions", role: "Contractor", text: "Ordered 5,000 CFT of structural hardwood. They handled the bulk order effortlessly and pricing was very competitive." }
];

// --- PAGES ---

function HomePage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden text-center bg-transparent">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 z-0 w-full h-full object-cover opacity-80"
          src="/images/Timber_journey_from_202604262201 (3).mp4"
        />
        <div className="absolute inset-0 z-1 bg-surface/40" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-5xl px-6 flex flex-col items-center mt-10"
        >
          <div className="border border-gold/40 bg-white/30 backdrop-blur-md px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-brown font-bold mb-6 shadow-xl">
            Digital Timber Showroom
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-brown drop-shadow-sm">
            Premium Timber.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-brown">Precision Cut.</span><br />
            Delivered Fast.
          </h1>
          <p className="text-sm md:text-base text-forest tracking-[0.15em] uppercase mb-10 drop-shadow-sm font-bold">
            Teak | Hardwood | Custom Sizes | Bulk Supply
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#quote" className="bg-forest text-white px-12 py-5 text-sm font-bold uppercase tracking-widest hover:bg-brown hover:scale-105 transition-all duration-300 shadow-xl shadow-forest/20">
              Get Instant Quote
            </a>
            <Link to="/shop" className="glass-panel px-12 py-5 text-sm font-bold uppercase tracking-widest hover:bg-forest/5 hover:border-forest transition-all duration-300 flex items-center gap-2 text-forest">
              <ShoppingBag size={18} /> Shop Products
            </Link>
          </div>
        </motion.div>
      </section>

      {/* DEPOT ABOUT SECTION */}
      <SectionWrapper className="bg-white/40 backdrop-blur-md border-y border-gold/20 shadow-xl" id="about">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeUp}>
            <div className="text-forest text-[10px] uppercase tracking-[0.3em] font-bold mb-3">About Our Depot</div>
            <h2 className="font-heading text-4xl text-brown mb-6">A Heritage of Woodcraft.</h2>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              Located in the heart of the Industrial Timber District, Simhachalam Timber Depot is not just a supplier — we are curators of the world's finest wood. With over two decades of experience, our massive depot houses exotic teaks, resilient hardwoods, and premium softwoods.
            </p>
            <p className="text-text-muted text-sm leading-relaxed mb-8">
              We operate state-of-the-art CNC mills right on our premises, allowing us to supply bespoke, precision-cut timber for luxury residential projects, grand commercial builds, and everything in between.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="border-l-2 border-gold pl-4">
                <div className="text-3xl font-heading text-brown">10K+</div>
                <div className="text-[10px] text-text-muted uppercase tracking-widest font-bold">CFT Stocked</div>
              </div>
              <div className="border-l-2 border-gold pl-4">
                <div className="text-3xl font-heading text-brown">20+</div>
                <div className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Years Expertise</div>
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="relative aspect-video lg:aspect-square rounded-xl overflow-hidden border border-gold/30 shadow-2xl">
            <img src="/images/timberimg.jpeg" alt="Our Depot" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-forest/5" />
          </motion.div>
        </div>
      </SectionWrapper>


      {/* WHY US SECTION */}
      <SectionWrapper id="why-us">
        <div className="text-center mb-16">
          <div className="text-forest text-[10px] uppercase tracking-[0.3em] font-bold mb-3">The Advantage</div>
          <h2 className="font-heading text-4xl text-brown mb-4">Why Builders Trust Us.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: "Precision Cut", desc: "Computer-controlled cutting machines ensure zero wastage.", icon: <Ruler className="text-forest w-8 h-8" /> },
            { title: "Bulk Stock", desc: "Over 10,000+ CFT always ready for instant dispatch.", icon: <Package className="text-forest w-8 h-8" /> },
            { title: "Fast Delivery", desc: "48-hour local delivery. We respect project timelines.", icon: <Truck className="text-forest w-8 h-8" /> },
            { title: "Premium Grade", desc: "100% quality assured. Only the finest cuts make the cut.", icon: <ShieldCheck className="text-forest w-8 h-8" /> }
          ].map((item, i) => (
            <motion.div key={i} variants={fadeUp} className="glass-panel p-6 rounded-lg text-center hover:bg-forest/5 hover:border-gold/50 transition-all duration-500 group">
              <div className="flex justify-center mb-4 transition-transform group-hover:scale-110">{item.icon}</div>
              <h3 className="font-heading text-lg mb-2 text-brown">{item.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>


      {/* REVIEWS SECTION */}
      <SectionWrapper className="bg-surface-container/60 backdrop-blur-xl border-y border-gold/20" id="reviews">
        <div className="text-center mb-16">
          <div className="text-forest text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Testimonials</div>
          <h2 className="font-heading text-4xl text-brown mb-4">Words from our Clients.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, i) => (
            <motion.div key={i} variants={fadeUp} className="bg-white/60 border border-gold/10 p-8 rounded-xl shadow-lg hover:border-gold/40 transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, idx) => <Star key={idx} size={14} className="text-gold fill-gold" />)}
              </div>
              <p className="text-sm text-text-muted italic mb-6 leading-relaxed">"{review.text}"</p>
              <div>
                <div className="font-bold text-brown text-sm">{review.name}</div>
                <div className="text-[10px] text-forest uppercase tracking-widest mt-1 font-bold">{review.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* SHOWCASE GALLERY */}
      <SectionWrapper id="showcase">
        <div className="mb-12 text-center">
          <div className="text-forest text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Portfolio</div>
          <h2 className="font-heading text-4xl text-brown mb-4">Project Showcase</h2>
          <p className="text-text-muted text-sm max-w-2xl mx-auto">See how our premium timber powers real-world construction and luxury interiors.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Luxury Doors", img: "/images/door-project.png" },
            { title: "Custom Furniture", img: "/images/furniture-project.png" },
            { title: "Structural Beams", img: "/images/construction-project.png" }
          ].map((item, idx) => (
            <motion.div key={idx} variants={fadeUp} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-xl border border-gold/10 bg-surface-high">
              <img
                src={item.img}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                style={{
                  imageRendering: 'auto',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown/90 via-brown/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <h3 className="font-heading text-2xl text-surface">{item.title}</h3>
                <p className="text-xs uppercase tracking-widest text-surface mt-2 flex items-center gap-1 group-hover:text-gold transition-colors font-bold">
                  View Details <ArrowRight className="inline w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>


      {/* REQUEST QUOTE & CONTACT FORM */}
      <QuoteSection />
    </>
  );
}



function QuoteSection() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    woodType: 'Teak Wood',
    quantity: '',
    thickness: '',
    details: ''
  });

  const handleQuoteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Save to Firebase (fails silently if no env variables, simulating success)
      try {
        await saveQuoteRequest(formData);
      } catch (err) {
        console.log("Firebase not configured properly, skipping real save.");
      }
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 5000);
      setFormData({ name: '', phone: '', woodType: 'Teak Wood', quantity: '', thickness: '', details: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="bg-white/80 backdrop-blur-xl border border-gold/30 shadow-xl rounded-2xl overflow-hidden p-8 md:p-12 mb-12 max-w-7xl mx-auto" id="quote">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* LEFT COL: Contact Info & Map */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="text-forest text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Get In Touch</div>
          <h2 className="font-heading text-4xl text-brown mb-6">Visit the Depot or Request a Quote</h2>
          <p className="text-text-muted text-sm leading-relaxed mb-8">
            Come select your own premium logs from our massive inventory, or submit a request online and our team will get back to you within 30 minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 mb-8">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-full border border-forest/30 flex items-center justify-center text-forest bg-forest/5 shadow-md shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Address</div>
                <div className="text-brown text-sm pr-4 font-semibold">H.NO 3-4-95-8/1/364, New Narasimha Nagar, Mallapur, Hyderabad, Telangana</div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-full border border-forest/30 flex items-center justify-center text-forest bg-forest/5 shadow-md shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Direct Line</div>
                <div className="text-brown text-sm font-semibold">+91 9063617454</div>
              </div>
            </div>
          </div>

          <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-gold/20 shadow-inner">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15552.7133210553!2d77.580643!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map">
            </iframe>
          </div>
        </motion.div>


        {/* RIGHT COL: Form */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="relative bg-white p-8 rounded-xl border border-gold/20 shadow-lg">
          <h3 className="font-heading text-2xl text-brown mb-6">Online Request</h3>
          <AnimatePresence>
            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 border border-forest/20 rounded-xl"
              >
                <CheckCircle2 className="text-forest w-16 h-16 mb-4" />
                <h3 className="font-heading text-2xl text-brown mb-2">Quote Requested!</h3>
                <p className="text-sm text-text-muted">Our team will contact you shortly with the best pricing.</p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <form onSubmit={handleQuoteSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-surface-container border border-gold/30 rounded p-3 text-sm focus:border-forest focus:outline-none transition-colors text-brown font-semibold" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Phone</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-surface-container border border-gold/30 rounded p-3 text-sm focus:border-forest focus:outline-none transition-colors text-brown font-semibold" placeholder="+91" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Wood Type</label>
                <select value={formData.woodType} onChange={e => setFormData({ ...formData, woodType: e.target.value })} className="w-full bg-surface-container border border-gold/30 rounded p-3 text-sm focus:border-forest focus:outline-none transition-colors text-brown font-semibold">
                  <option>Teak Wood</option>
                  <option>Hardwood</option>
                  <option>Pine Wood</option>
                  <option>Custom Dimension</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Quantity</label>
                <input required type="text" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} className="w-full bg-surface-container border border-gold/30 rounded p-3 text-sm focus:border-forest focus:outline-none transition-colors text-brown font-semibold" placeholder="e.g., 50 CFT" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Thickness</label>
                <input required type="text" value={formData.thickness} onChange={e => setFormData({ ...formData, thickness: e.target.value })} className="w-full bg-surface-container border border-gold/30 rounded p-3 text-sm focus:border-forest focus:outline-none transition-colors text-brown font-semibold" placeholder="e.g., 2 inch" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">Project Details</label>
              <textarea required rows={3} value={formData.details} onChange={e => setFormData({ ...formData, details: e.target.value })} className="w-full bg-surface-container border border-gold/30 rounded p-3 text-sm focus:border-forest focus:outline-none transition-colors resize-none text-brown font-semibold" placeholder="What are you building?"></textarea>
            </div>

            <button type="submit" className="w-full bg-forest text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-brown hover:shadow-xl transition-all flex justify-center items-center gap-2 mt-2 rounded-sm">
              <FileText size={16} /> Submit Request
            </button>
          </form>
        </motion.div>
      </div>
    </section>

  );
}

const ShopPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(res => {
      setProducts(Array.isArray(res) ? res : []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="pt-32 text-center text-forest min-h-screen">Loading inventory...</div>;

  return (
    <div className="pt-20 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <SectionWrapper className="!pt-2">
        <div className="mb-12">
          <div className="text-forest text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Live Inventory</div>
          <h1 className="font-heading text-5xl text-brown mb-4">The Collection</h1>
          <p className="text-text-muted max-w-2xl mb-12">Every piece is hand-selected and ethically sourced. Real-time pricing from our Industrial Timber District depot.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length === 0 && <div className="text-text-muted uppercase tracking-widest text-xs">No products in showroom yet.</div>}
          {products.map((p, i) => (
            <motion.div
              key={p.id || i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="group bg-white border border-gold/20 overflow-hidden rounded-xl shadow-lg transition-all hover:border-forest/40 hover:shadow-2xl"
            >
              <div className="aspect-[4/5] overflow-hidden relative bg-surface-high">
                <img
                  src={p.image || "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80"}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                  style={{
                    imageRendering: 'auto',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown/60 via-transparent to-transparent opacity-40" />
              </div>
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-[10px] uppercase tracking-widest text-forest font-bold flex items-center gap-1">
                    <MapPin size={10} /> {p.origin || 'Unknown Origin'}
                  </div>
                  {p.stock && (
                    <div className="text-[9px] uppercase tracking-widest text-brown bg-gold/10 px-2 py-1 rounded font-bold flex items-center gap-1">
                      <Package size={10} /> {p.stock}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-heading text-xl text-brown">{p.name}</h3>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-text-muted font-bold">Starting from</span>
                    <span className="text-lg font-heading text-forest font-bold">
                      {p.price ? `₹${p.price}` : 'Quote'}
                      {p.price && <span className="text-[10px] font-sans text-text-muted ml-1 font-normal">/sqft</span>}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-text-muted mb-4 line-clamp-2 leading-relaxed flex-grow">{p.desc}</p>

                <div className="flex items-center justify-end border-t border-gold/10 pt-4 mt-auto">
                  <button 
                    onClick={() => {
                      setIsChatOpen(true);
                      setMessages([...messages, { role: 'user', content: `I'm interested in ${p.name}. Can you give me a quote?` }]);
                    }}
                    className="w-full bg-surface-container border border-gold/30 text-brown py-4 text-[11px] font-extrabold uppercase tracking-widest hover:bg-forest hover:text-white transition-all shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    Get a Quote <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>


      <div id="quote" className="mt-12">
        <QuoteSection />
      </div>
    </div>
  );
};

function AboutPage() {
  return (
    <div className="pt-20 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="mb-16 text-center">
        <div className="text-forest text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Our Story</div>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-brown mb-6">About Simhachalam Timber Depot</h1>
        <p className="text-text-muted max-w-3xl mx-auto text-sm leading-relaxed font-medium">
          Located in the heart of the Industrial Timber District, Simhachalam Timber Depot is not just a supplier — we are curators of the world's finest wood.
          With over two decades of experience, our massive depot houses exotic teaks, resilient hardwoods, and premium softwoods.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gold/30 shadow-2xl">
          <img src="/images/teak-texture.png" alt="Our Depot" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="font-heading text-3xl text-brown mb-6">Master Craftsmanship</h2>
          <p className="text-sm text-text-muted leading-relaxed mb-6">
            We operate state-of-the-art CNC mills right on our premises, allowing us to supply bespoke, precision-cut timber for luxury residential projects, grand commercial builds, and everything in between.
          </p>
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="border-l-2 border-forest pl-4">
              <div className="text-3xl font-heading text-brown">10K+</div>
              <div className="text-[10px] text-text-muted uppercase tracking-widest mt-1 font-bold">CFT Stocked</div>
            </div>
            <div className="border-l-2 border-forest pl-4">
              <div className="text-3xl font-heading text-brown">20+</div>
              <div className="text-[10px] text-text-muted uppercase tracking-widest mt-1 font-bold">Years Expertise</div>
            </div>
          </div>
        </div>
      </div>

      <QuoteSection />
    </div>
  );
}


// --- MAIN LAYOUT & APP ---

const SYSTEM_PROMPT = `You are a concise, highly intelligent AI sales assistant and voice receptionist for a premium timber depot (Simhachalam Timber Depot). Answer ANY question the user asks properly and accurately.

If the inquiry is about timber or our business, use this knowledge:
- We stock: Teak wood (premium), Hardwood (construction), Pine wood (budget).
- Services: Custom cutting, bulk supply, door frames.

🎯 GOAL & STYLE (CRITICAL RULES):
1. BE EXTREMELY CONCISE. Respond with short, natural conversational sentences (1-2 sentences max per response).
2. ONLY answer exactly what is asked. Answer their questions properly and directly.
3. NEVER use Markdown formatting. No asterisks, no bold text, no bullet points, no numbered lists. Use plain conversational text only.
4. Use the "CURRENT INVENTORY & PRICING" provided in the context below. This is REAL-TIME data. You MUST prioritize these specific prices. Quote everything in Indian Rupees (₹). If a customer asks for a price, quote the exact number from the list. Always state it is an example baseline and ask for their dimensions.
5. For specific price inquiries, provide the example baseline from our inventory.
6. For serious inquiries, bulk orders, or precision quotes, tell the user to use the "Request Quote" form on our website so our experts can contact them.
7. Never hallucinate final prices or stock. STRICTLY use the provided data in INR (₹). If no data is available, tell them our experts will provide a custom quote.`;

function AppLayout() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([
    { role: 'bot', content: 'Hello! Welcome to our timber depot. How can I help you today?' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [liveInventory, setLiveInventory] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    // Fetch live products for AI context
    getProducts()
      .then(res => setLiveInventory(Array.isArray(res) ? res : []))
      .catch(() => setLiveInventory([]));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleSendChat = async () => {
    if (!inputMsg.trim()) return;

    const userMessage = inputMsg;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputMsg('');
    setIsTyping(true);

    try {
      const liveContext = liveInventory.length > 0
        ? `\nCURRENT INVENTORY & PRICING: ${JSON.stringify(liveInventory.map(p => ({ name: p.name, price_per_sqft: p.price, stock: p.stock })))}`
        : '';

      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT + liveContext },
        ...messages.map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content })),
        { role: 'user', content: userMessage }
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: apiMessages,
          temperature: 0.60,
          stream: false
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        setMessages(prev => [...prev, { role: 'bot', content: data.choices[0].message.content }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', content: 'System error. Please try again.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Connection issue. Please call us directly.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-gold selection:text-white flex flex-col text-text-main relative">
      {/* BACKGROUND TEXTURE FOR THE REST OF THE PAGE */}
      <div
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url('/images/teak-texture.png')" }}
      />
      <div className="fixed inset-0 z-[-2] bg-surface" />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gold/20 shadow-lg">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link to="/" className="font-heading text-lg md:text-xl tracking-[0.15em] font-bold text-brown shrink-0">
            SIMHACHALAM TIMBER DEPOT
          </Link>
          
          <div className="hidden lg:flex flex-1 justify-center px-12">
            <div className="flex gap-10 font-bold tracking-widest uppercase text-[9px]">
              <Link to="/" className={`${location.pathname === '/' ? 'text-forest' : 'text-text-muted hover:text-brown'} transition-colors`}>Home</Link>
              <Link to="/shop" className={`${location.pathname === '/shop' ? 'text-forest' : 'text-text-muted hover:text-brown'} transition-colors`}>Shop</Link>
              <Link to="/about" className={`${location.pathname === '/about' ? 'text-forest' : 'text-text-muted hover:text-brown'} transition-colors`}>About</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 shrink-0">
            <a href="tel:+919063617454" className="flex items-center gap-2 text-forest hover:text-brown transition-colors group">
              <Phone size={14} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold tracking-[0.1em] whitespace-nowrap">+91 9063617454</span>
            </a>
            <a href="#quote" className="bg-forest text-white hover:bg-brown transition-all px-10 py-3.5 text-[10px] uppercase tracking-[0.2em] font-bold shadow-lg shadow-forest/10 hover:shadow-xl">
              Request Quote
            </a>
          </div>

          <div className="md:hidden ml-auto flex items-center gap-4">
            <a href="tel:+919063617454" className="text-forest"><Phone size={20} /></a>
          </div>
        </div>
      </nav>


      {/* PAGE CONTENT */}
      <div className="flex-1 relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>

      {/* FOOTER */}
      <footer className="py-12 text-center bg-surface-container border-t border-gold/20 relative z-10">
        <div className="font-heading text-xl tracking-[0.2em] font-bold text-brown mb-6">SIMHACHALAM TIMBER DEPOT</div>
        <div className="flex justify-center gap-6 mb-6">
          <Link to="/shop" className="text-[10px] uppercase tracking-widest text-text-muted hover:text-brown font-bold">Shop</Link>
          <a href="#quote" className="text-[10px] uppercase tracking-widest text-text-muted hover:text-brown font-bold">Contact</a>
        </div>
        <p className="text-[10px] text-text-muted/60 uppercase tracking-widest font-bold">© 2026. Premium Timber Showroom.</p>
      </footer>


      {/* AI CHATBOT WIDGET */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white backdrop-blur-2xl rounded-xl flex flex-col overflow-hidden z-50 border border-forest/30 shadow-2xl"
          >
            <div className="bg-surface-container p-4 border-b border-forest/20 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-forest/10 p-2 rounded-full border border-forest/30"><Bot className="text-forest w-5 h-5" /></div>
                <div>
                  <div className="font-bold text-sm text-brown">Timber AI Agent</div>
                  <div className="text-[10px] text-forest uppercase tracking-widest font-bold">Online</div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-text-muted hover:text-brown"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-surface/50">
              {messages.map((m, i) => (
                <div key={i} className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-forest text-white self-end rounded-br-none' : 'bg-white border border-gold/30 self-start rounded-bl-none text-text-main font-medium'}`}>
                  {m.content}
                </div>
              ))}
              {isTyping && (
                <div className="bg-white border border-gold/30 self-start rounded-bl-none max-w-[85%] p-3 rounded-xl text-sm text-text-muted italic">
                  Typing...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 bg-surface-container border-t border-forest/20 flex gap-2">
              <input
                type="text" value={inputMsg} onChange={e => setInputMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask about wood or pricing..."
                className="flex-1 bg-white border border-gold/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-forest text-brown placeholder:text-text-muted/40 font-medium"
              />
              <button onClick={handleSendChat} className="bg-forest text-white p-2 rounded hover:bg-brown transition-all shadow-md">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-forest text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform z-50 border border-white/20"
      >
        {isChatOpen ? <X size={24} /> : <Bot size={24} />}
      </button>


    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
