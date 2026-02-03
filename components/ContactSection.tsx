
import React, { useState } from 'react';
import { CONSTANTS, Language } from '../types';
import { saveLead } from '../firebase';

const ContactSection: React.FC<{ t: any; lang: Language }> = ({ t, lang }) => {
  const [formData, setFormData] = useState({ name: '', whatsapp: '', specialty: '', city: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const normalizeWhatsApp = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (digits.length >= 10 && digits.length <= 13) {
      return digits.startsWith('55') ? `+${digits}` : `+55${digits}`;
    }
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp || !formData.specialty || !formData.city) return;

    setIsSubmitting(true);
    setStatus({ type: null, msg: '' });

    try {
      await saveLead({
        ...formData,
        whatsapp: normalizeWhatsApp(formData.whatsapp),
        whatsappRaw: formData.whatsapp,
        language: lang
      });
      setStatus({ type: 'success', msg: t.form.success });
      setFormData({ name: '', whatsapp: '', specialty: '', city: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: t.form.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">{t.title}</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Left Column: Direct CTAs */}
        <div>
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-blue-200 mb-8 uppercase tracking-widest">{t.colA}</h3>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 flex flex-col items-center sm:flex-row gap-8">
              <div className="bg-white p-2 rounded-xl">
                <img src={CONSTANTS.QR_CODE_URL} alt="QR Code App" className="w-32 h-32" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <p className="text-xl font-bold mb-4">Acesse via App Store ou Google Play</p>
                <a 
                  href={CONSTANTS.LINK_APP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-primary px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105"
                >
                  Baixar Agora
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-blue-200 mb-8 uppercase tracking-widest">{t.colB}</h3>
            <div className="space-y-4">
              <a 
                href={CONSTANTS.LINK_DEMO}
                className="flex items-center justify-between bg-cta hover-cta p-6 rounded-2xl text-xl font-bold transition-all shadow-xl group"
              >
                <span>Agendar Demonstração</span>
                <svg className="w-6 h-6 transform transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
              <a 
                href={CONSTANTS.LINK_WHATS}
                className="flex items-center gap-4 bg-white/10 hover:bg-white/20 p-6 rounded-2xl text-xl font-bold transition-all border border-white/20"
              >
                <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span>{t.btnWhats}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-slate-700 font-bold block">{t.form.name}</label>
              <input 
                required
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: João Silva" 
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="whatsapp" className="text-slate-700 font-bold block">{t.form.whatsapp}</label>
              <input 
                required
                type="tel" 
                id="whatsapp" 
                name="whatsapp" 
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="Ex: (11) 99999-9999" 
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="specialty" className="text-slate-700 font-bold block">{t.form.specialty}</label>
                <input 
                  required
                  type="text" 
                  id="specialty" 
                  name="specialty" 
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder="Cardiologia" 
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="city" className="text-slate-700 font-bold block">{t.form.city}</label>
                <input 
                  required
                  type="text" 
                  id="city" 
                  name="city" 
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="São Paulo" 
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <button 
              disabled={isSubmitting}
              type="submit" 
              className={`w-full py-5 rounded-xl text-xl font-bold shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${isSubmitting ? 'bg-slate-300 cursor-not-allowed' : 'bg-cta hover-cta text-white'}`}
            >
              {isSubmitting ? t.form.sending : t.form.submit}
            </button>

            {status.type && (
              <div className={`p-4 rounded-xl text-center font-bold animate-bounce ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {status.msg}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
