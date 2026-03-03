'use client';
import { useState, useEffect } from 'react';

// Define the type for our CRM items coming from Django
interface CRMItem {
  id: number;
  title: string;
  description: string;
  image: string;
  is_active: boolean;
  average_rating: number;
  reviews: any[];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('current');
  const [items, setItems] = useState<CRMItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch items from Django Backend
  const fetchItems = async () => {
    try {
      const res = await fetch('https://johnryqadornado03091.pythonanywhere.com/api/items/');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle Launch (New -> Current)
  const handleLaunch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append('is_active', 'true'); // Automatically make it active/launched

    try {
      const response = await fetch('https://johnryqadornado03091.pythonanywhere.com/api/items/', {
        method: 'POST',
        body: formData, // Send as FormData to handle images correctly
      });

      if (response.ok) {
        alert("Success! Item launched.");
        fetchItems();
        setActiveTab('current');
      }
    } catch (err) {
      alert("Error launching item. Make sure Django is running.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this CRM?")) return;

    try {
      const res = await fetch(`https://johnryqadornado03091.pythonanywhere.com/api/items/${id}/`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (err) {
      alert("Delete failed.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <nav className="w-full md:w-64 bg-slate-900 text-white p-6 shadow-xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-blue-400">Johnry CRM</h1>
          <p className="text-xs text-slate-400">https://www.facebook.com/JohnryAdornado/</p>
        </div>
        
        <ul className="space-y-3">
          {[
            { id: 'new', label: '+ New Item' },
            { id: 'current', label: 'Current CRM' },
            { id: 'data', label: 'View Data' }
          ].map((tab) => (
            <li key={tab.id}>
              <button 
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium ${
                  activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content Area */}
      <section className="flex-1 p-4 md:p-10">
        <div className="max-w-5xl mx-auto">
          
          {/* TAB: CURRENT */}
          {activeTab === 'current' && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Current CRM</h2>
              <p className="text-slate-500 mb-6">Manage your active products and copy feedback links.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.length === 0 ? (
                  <div className="col-span-full bg-white p-10 rounded-xl border-2 border-dashed border-slate-200 text-center">
                    <p className="text-slate-400">No active items. Go to "+ New Item" to launch one!</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                      <div className="h-48 bg-slate-100 relative">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
                        )}
                      </div>
                      <div className="p-4 flex-1">
                        <h3 className="font-bold text-lg text-slate-800">{item.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{item.description}</p>
                        <div className="flex flex-col gap-2 mt-auto">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`https://mycrm-tau.vercel.app/rate/${item.id}`);
                              alert("Link copied to clipboard!");
                            }}
                            className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors"
                          >
                            Generate Feedback Link
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="w-full text-red-500 py-2 text-xs hover:underline"
                          >
                            Delete Item
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: NEW */}
          {activeTab === 'new' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Launch New CRM Item</h2>
              <form onSubmit={handleLaunch} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">Item Title</label>
                  <input name="title" required type="text" placeholder="e.g. New Product Design" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea name="description" required rows={4} placeholder="What should people give feedback on?" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Upload Photo</label>
                  <input name="image" type="file" accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors shadow-lg disabled:bg-slate-400"
                >
                  {loading ? 'Launching...' : 'Launch to Current'}
                </button>
              </form>
            </div>
          )}

          {/* TAB: DATA */}
          {activeTab === 'data' && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Data & Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-slate-800">{item.title}</h3>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                        Avg: {item.average_rating} / 10
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase">Latest Comments</p>
                      {item.reviews && item.reviews.length > 0 ? (
                        item.reviews.map((rev, idx) => (
                          <div key={idx} className="text-sm p-2 bg-slate-50 rounded italic text-slate-600">
                            "{rev.comment}" — {rev.stars}★
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400 italic">No feedback yet.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}