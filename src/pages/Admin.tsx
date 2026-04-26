import { useState, useEffect } from 'react';
import { getQuotes, updateQuoteStatus, getProducts, saveProduct, deleteProduct, auth } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { CheckCircle2, Phone, User, Package, Trash2, Edit, LogOut, Save, Upload, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'quotes' | 'products'>('quotes');
  const [quotes, setQuotes] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const [form, setForm] = useState({ id: '', name: '', origin: '', price: '', desc: '', stock: '', image: '' });
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) fetchData();
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setLoginError(err.message || 'Failed to login');
    }
  };

  const handleLogout = () => signOut(auth);

  const fetchData = async () => {
    try {
      const q = await getQuotes();
      setQuotes(Array.isArray(q) ? q : []);
      const p = await getProducts();
      setProducts(Array.isArray(p) ? p : []);
    } catch (e) {
      console.error("Error fetching admin data:", e);
      setQuotes([]);
      setProducts([]);
    }
  };

  const handleMarkCalled = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'called' ? 'completed' : 'called';
    await updateQuoteStatus(id, newStatus);
    fetchData();
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = form.image;
      
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        const apiKey = import.meta.env.VITE_IMGBB_API_KEY; // Use .env key
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: 'POST',
          body: formData
        });
        
        const resData = await response.json();
        if (resData.success) {
          imageUrl = resData.data.url;
        } else {
          throw new Error("ImgBB upload failed");
        }
      }

      await saveProduct({ ...form, image: imageUrl });
      setForm({ id: '', name: '', origin: '', price: '', desc: '', stock: '', image: '' });
      setFile(null);
      fetchData();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload failed. Please check your internet or API key.");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (p: any) => setForm(p);
  const handleDelete = async (id: string) => {
    if(confirm("Delete this product?")) {
      await deleteProduct(id);
      fetchData();
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  if (!user) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-lg mx-auto min-h-screen">
        <h1 className="font-heading text-4xl text-white mb-8">Admin Login</h1>
        <form onSubmit={handleLogin} className="bg-black/80 backdrop-blur-md p-8 border border-gold/20 rounded-xl flex flex-col gap-4">
          {loginError && <div className="text-red-400 text-xs uppercase tracking-widest">{loginError}</div>}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-black/50 border border-gold/20 p-3 text-sm text-white" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-black/50 border border-gold/20 p-3 text-sm text-white" />
          <button type="submit" className="w-full bg-gold text-black py-4 font-bold uppercase tracking-widest text-xs hover:bg-white transition-all mt-4">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-4 gap-4">
        <div>
          <h1 className="font-heading text-4xl text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-beige-dim font-bold">AI Chatbot Synced with Inventory</span>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-beige-dim hover:text-white text-[10px] uppercase tracking-widest font-bold bg-white/5 px-4 py-2 rounded border border-white/10 transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>
      
      <div className="flex gap-4 mb-8">
        <button onClick={() => setActiveTab('quotes')} className={`px-6 py-2 uppercase tracking-widest text-[10px] font-bold border transition-colors ${activeTab === 'quotes' ? 'border-gold text-gold bg-gold/10' : 'border-white/10 text-beige-dim hover:text-white'}`}>Lead Quotes</button>
        <button onClick={() => setActiveTab('products')} className={`px-6 py-2 uppercase tracking-widest text-[10px] font-bold border transition-colors ${activeTab === 'products' ? 'border-gold text-gold bg-gold/10' : 'border-white/10 text-beige-dim hover:text-white'}`}>Products & Stock</button>
      </div>

      {activeTab === 'quotes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.length === 0 && <div className="text-white/50">No quotes found.</div>}
          {quotes.map(q => (
            <div key={q.id} className="bg-black/40 border border-white/10 p-6 rounded-xl flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-tertiary to-gold opacity-50" />
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-white text-lg flex items-center gap-2"><User size={16} className="text-gold" /> {q.name}</h3>
                  <div className="text-sm text-beige-dim flex items-center gap-2 mt-1"><Phone size={14} /> {q.phone}</div>
                </div>
                <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded font-bold ${q.status === 'completed' ? 'bg-green-500/20 text-green-400' : q.status === 'called' ? 'bg-blue-500/20 text-blue-400' : 'bg-gold/20 text-gold'}`}>
                  {q.status}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-white/50 text-[11px]"><Package size={14} className="text-gold/50" /> <span className="font-bold text-white/80">{q.woodType}</span> | {q.quantity} | <span className="text-gold/80">{q.thickness || 'N/A'} thick</span></div>
                <p className="text-xs text-beige-dim mt-2 bg-black/30 p-3 rounded border border-white/5 leading-relaxed">"{q.details}"</p>
              </div>
              <div className="mt-auto pt-4 flex gap-2">
                {q.status !== 'completed' && (
                  <button onClick={() => handleMarkCalled(q.id, q.status)} className="flex-1 bg-gold/10 hover:bg-gold hover:text-black border border-gold/30 text-gold py-2 text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2">
                    <CheckCircle2 size={14} /> Mark {q.status === 'called' ? 'Completed' : 'Called'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.length === 0 && <div className="text-white/50">No products found. Add some!</div>}
            {products.map(p => (
              <div key={p.id} className="bg-black/40 border border-white/10 p-5 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-bold">{p.name}</h3>
                  <span className="text-gold text-sm font-bold">₹{p.price}/sqft</span>
                </div>
                <div className="text-[10px] uppercase text-outline-dim mb-3">Origin: {p.origin} | Stock: {p.stock}</div>
                <p className="text-xs text-beige-dim mb-4 line-clamp-2">{p.desc}</p>
                <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
                  <button onClick={() => handleEdit(p)} className="text-beige-dim hover:text-white p-1" title="Edit"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 p-1" title="Delete"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#0a0604] border border-gold/20 p-6 rounded-xl sticky top-24">
            <h3 className="font-heading text-xl text-white mb-6 flex items-center gap-2"><Package size={20} className="text-gold" /> {form.id ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSaveProduct} className="flex flex-col gap-4">
              <input required type="text" placeholder="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-black/50 border border-gold/20 p-3 text-sm text-white" />
              
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="Origin" value={form.origin} onChange={e => setForm({...form, origin: e.target.value})} className="w-full bg-black/50 border border-gold/20 p-3 text-sm text-white" />
                <input required type="number" placeholder="Price (₹/sqft)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-black/50 border border-gold/20 p-3 text-sm text-white" />
              </div>

              <input required type="text" placeholder="Stock Available (e.g. 5000 CFT)" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full bg-black/50 border border-gold/20 p-3 text-sm text-white" />
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-beige-dim font-bold">Product Image</label>
                <div className="relative group cursor-pointer border-2 border-dashed border-gold/20 hover:border-gold/50 transition-colors rounded-xl p-4 flex flex-col items-center gap-2 bg-black/30">
                  <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <Upload size={24} className="text-gold" />
                  <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                    {file ? file.name : "Click to Upload Real Image"}
                  </span>
                </div>
                <input type="text" placeholder="Or paste Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full bg-black/10 border border-gold/10 p-2 text-[10px] text-white/40" />
              </div>

              <textarea required placeholder="Description" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full bg-black/50 border border-gold/20 p-3 text-sm text-white resize-none" rows={3}></textarea>
              
              <button disabled={uploading} type="submit" className="w-full bg-gold text-black font-bold uppercase tracking-widest text-[10px] py-3 flex items-center justify-center gap-2 hover:bg-white transition-colors mt-2 disabled:opacity-50">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                {uploading ? 'Processing...' : 'Save Product'}
              </button>
              {form.id && <button type="button" onClick={() => setForm({ id: '', name: '', origin: '', price: '', desc: '', stock: '', image: '' })} className="text-[10px] uppercase text-white/50 hover:text-white mt-2">Cancel Edit</button>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
