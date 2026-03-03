'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function RateItem() {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`https://johnryqadornado03091.pythonanywhere.com/api/items/${id}/`)
      .then(res => res.json())
      .then(data => setItem(data));
  }, [id]);

  const handleSubmit = async () => {
    if (rating === 0) return alert("Please select a rating!");
    
    const res = await fetch(`https://johnryqadornado03091.pythonanywhere.com/api/reviews/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: id, stars: rating, comment })
    });

    if (res.ok) setSubmitted(true);
  };

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-4xl font-bold text-green-600 mb-4">Thank You!</h1>
        <p className="text-slate-600 mb-8">Your feedback helps us improve.</p>
        <a href="https://www.facebook.com/JohnryAdornado/" className="text-blue-600 font-bold underline">Return to CRM</a>
      </div>
    </div>
  );

  if (!item) return <div className="p-10 text-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-white p-6 max-w-xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">CRM FEEDBACK</h1>
        <h2 className="text-2xl font-bold text-slate-900">{item.title}</h2>
        <p className="text-slate-500 mt-2">{item.description}</p>
      </header>

      {item.image && (
        <img src={item.image} className="w-full h-64 object-cover rounded-2xl shadow-lg mb-8" alt="Preview" />
      )}

      <section className="space-y-8">
        <div>
          <label className="block text-center font-bold text-slate-700 mb-4 text-lg">
            How would you rate this? (1-10)
          </label>
          <div className="flex flex-wrap justify-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                onClick={() => setRating(num)}
                className={`w-12 h-12 rounded-full font-bold transition-all ${
                  rating === num ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-2">Any specific comments?</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none h-32"
            placeholder="Tell us what you think..."
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-transform"
        >
          SUBMIT FEEDBACK
        </button>
      </section>
    </main>
  );
}