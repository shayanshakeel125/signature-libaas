import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSettings, DEFAULT_SETTINGS } from '../../context/SettingsContext';
import { showToast } from '../../components/Toaster';

const AdminSettings = () => {
  const { settings, updateSettings, resetSettings } = useSettings();

  // local draft state — sirf "Save Settings" par localStorage me jata hai
  const [form, setForm] = useState(() => ({
    brandName: settings.brandName,
    logo: settings.logo || '',
    heroSlides: settings.heroSlides.map(s => ({ ...s })),
    navLinks: settings.navLinks.map(l => ({ ...l }))
  }));
  const [errors, setErrors] = useState({});
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const logoFileRef = useRef(null);

  /* ---------- logo ---------- */
  const applyLogoUrl = () => {
    const url = logoUrlInput.trim();
    if (!/^https?:\/\/.+/i.test(url)) {
      setErrors(prev => ({ ...prev, logo: 'Enter a valid image URL (https://…).' }));
      return;
    }
    setForm(prev => ({ ...prev, logo: url }));
    setLogoUrlInput('');
    setErrors(prev => ({ ...prev, logo: '' }));
  };

  // FileReader → base64 logo
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file.', 'error');
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      showToast('Logo too large (max 1.5MB). Use an image URL instead.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm(prev => ({ ...prev, logo: reader.result }));
      setErrors(prev => ({ ...prev, logo: '' }));
      showToast('Logo loaded — remember to Save Settings.', 'info');
    };
    reader.onerror = () => showToast('Could not read that file.', 'error');
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  /* ---------- hero slides ---------- */
  const updateSlide = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      heroSlides: prev.heroSlides.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    }));
    setErrors(prev => ({ ...prev, [`slide-${index}`]: '' }));
  };

  /* ---------- navbar links ---------- */
  const updateLink = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      navLinks: prev.navLinks.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    }));
    setErrors(prev => ({ ...prev, navLinks: '' }));
  };

  const addLink = () => {
    setForm(prev => ({ ...prev, navLinks: [...prev.navLinks, { label: '', to: '' }] }));
  };

  const removeLink = (index) => {
    setForm(prev => ({ ...prev, navLinks: prev.navLinks.filter((_, i) => i !== index) }));
    setErrors(prev => ({ ...prev, navLinks: '' }));
  };

  /* ---------- validation + save ---------- */
  const validate = () => {
    const errs = {};
    if (!form.brandName.trim()) errs.brandName = 'Brand name is required.';
    else if (form.brandName.trim().length < 2) errs.brandName = 'Brand name is too short.';

    form.heroSlides.forEach((slide, i) => {
      if (!slide.title.trim()) errs[`slide-${i}`] = 'Title is required.';
      else if (!slide.subtitle.trim()) errs[`slide-${i}`] = 'Subtitle is required.';
    });

    if (form.navLinks.some(l => !l.label.trim() || !l.to.trim())) {
      errs.navLinks = 'Every link needs both a label and a path (e.g. /about).';
    } else if (form.navLinks.some(l => !l.to.trim().startsWith('/'))) {
      errs.navLinks = 'Link paths must start with "/" (e.g. /faq).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the highlighted fields.', 'error');
      return;
    }
    updateSettings({
      brandName: form.brandName.trim(),
      logo: form.logo.trim(),
      heroSlides: form.heroSlides.map((s, i) => ({ ...s, id: s.id || i + 1 })),
      navLinks: form.navLinks.map(l => ({ label: l.label.trim(), to: l.to.trim() }))
    });
    showToast('Site settings saved & applied everywhere!', 'success');
  };

  const handleReset = () => {
    resetSettings();
    setForm({
      brandName: DEFAULT_SETTINGS.brandName,
      logo: DEFAULT_SETTINGS.logo,
      heroSlides: DEFAULT_SETTINGS.heroSlides.map(s => ({ ...s })),
      navLinks: DEFAULT_SETTINGS.navLinks.map(l => ({ ...l }))
    });
    setShowResetConfirm(false);
    setErrors({});
    showToast('Settings restored to defaults.', 'info');
  };

  return (
    <div className="admin-page">
      <form onSubmit={handleSave} className="admin-settings-form" noValidate>

        {/* ===== BRAND ===== */}
        <section className="admin-card">
          <header className="admin-card-header">
            <h2>Branding</h2>
            <Link to="/" className="admin-link">Preview store →</Link>
          </header>

          <div className="admin-field-row">
            <div className="admin-field">
              <label>Brand Name *</label>
              <input
                type="text"
                value={form.brandName}
                onChange={(e) => {
                  setForm(prev => ({ ...prev, brandName: e.target.value }));
                  setErrors(prev => ({ ...prev, brandName: '' }));
                }}
                className={errors.brandName ? 'invalid' : ''}
                placeholder="Signature Libaas"
              />
              {errors.brandName && <small className="admin-field-error">{errors.brandName}</small>}
            </div>

            <div className="admin-field">
              <label>Current Logo</label>
              <div className="admin-logo-preview">
                {form.logo ? (
                  <img src={form.logo} alt="Logo preview" />
                ) : (
                  <img
                    src={`${import.meta.env.BASE_URL}images/logo-light.png`}
                    alt="Default logo"
                  />
                )}
                <span>{form.logo ? 'Custom logo' : 'Default theme logo'}</span>
              </div>
            </div>
          </div>

          <div className="admin-field">
            <label>Change Logo <span className="admin-label-hint">(paste URL or upload)</span></label>
            <div className="admin-image-actions">
              <input
                type="url"
                className="admin-url-input"
                placeholder="https://example.com/logo.png"
                value={logoUrlInput}
                onChange={(e) => { setLogoUrlInput(e.target.value); setErrors(prev => ({ ...prev, logo: '' })); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyLogoUrl(); } }}
              />
              <button type="button" className="admin-btn admin-btn-outline" onClick={applyLogoUrl}>Use URL</button>
              <button type="button" className="admin-btn admin-btn-outline" onClick={() => logoFileRef.current?.click()}>
                📤 Upload
              </button>
              <input ref={logoFileRef} type="file" accept="image/*" hidden onChange={handleLogoUpload} />
              {form.logo && (
                <button
                  type="button"
                  className="admin-btn admin-btn-danger"
                  onClick={() => setForm(prev => ({ ...prev, logo: '' }))}
                >
                  Remove
                </button>
              )}
            </div>
            {errors.logo && <small className="admin-field-error">{errors.logo}</small>}
          </div>
        </section>

        {/* ===== HERO SLIDER ===== */}
        <section className="admin-card">
          <header className="admin-card-header">
            <h2>Hero Slider</h2>
            <span className="admin-count-chip">{form.heroSlides.length} slides</span>
          </header>

          <div className="admin-slides">
            {form.heroSlides.map((slide, i) => (
              <div className="admin-slide-box" key={slide.id || i}>
                <div className="admin-slide-head">
                  <span className="admin-slide-number">0{i + 1}</span>
                  <strong>Slide {i + 1}</strong>
                </div>

                <div className="admin-field-row">
                  <div className="admin-field">
                    <label>Tag / Eyebrow</label>
                    <input
                      type="text"
                      value={slide.tag || ''}
                      onChange={(e) => updateSlide(i, 'tag', e.target.value)}
                      placeholder="NEW ARRIVALS 2026"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Accent Word</label>
                    <input
                      type="text"
                      value={slide.accent || ''}
                      onChange={(e) => updateSlide(i, 'accent', e.target.value)}
                      placeholder="Summer"
                    />
                  </div>
                </div>

                <div className="admin-field">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => updateSlide(i, 'title', e.target.value)}
                    className={errors[`slide-${i}`] ? 'invalid' : ''}
                    placeholder="Summer Collection"
                  />
                </div>

                <div className="admin-field">
                  <label>Subtitle *</label>
                  <textarea
                    rows="2"
                    value={slide.subtitle}
                    onChange={(e) => updateSlide(i, 'subtitle', e.target.value)}
                    className={errors[`slide-${i}`] ? 'invalid' : ''}
                    placeholder="Discover timeless elegance…"
                  />
                </div>

                <div className="admin-field">
                  <label>Background Image URL</label>
                  <input
                    type="url"
                    value={slide.image || ''}
                    onChange={(e) => updateSlide(i, 'image', e.target.value)}
                    placeholder="https://…"
                  />
                </div>

                {errors[`slide-${i}`] && <small className="admin-field-error">{errors[`slide-${i}`]}</small>}
              </div>
            ))}
          </div>
        </section>

        {/* ===== NAVBAR LINKS ===== */}
        <section className="admin-card">
          <header className="admin-card-header">
            <h2>Navbar Links</h2>
            <button type="button" className="admin-btn admin-btn-outline" onClick={addLink}>＋ Add Link</button>
          </header>

          <p className="admin-hint">
            Home &amp; Categories are always shown. These links appear after them in the navbar.
          </p>

          <div className="admin-links-list">
            {form.navLinks.map((link, i) => (
              <div className="admin-link-row" key={i}>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink(i, 'label', e.target.value)}
                  placeholder="Label (e.g. FAQ)"
                />
                <input
                  type="text"
                  value={link.to}
                  onChange={(e) => updateLink(i, 'to', e.target.value)}
                  placeholder="Path (e.g. /faq)"
                />
                <button
                  type="button"
                  className="admin-icon-action delete"
                  title="Remove link"
                  onClick={() => removeLink(i)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            ))}
            {form.navLinks.length === 0 && (
              <p className="admin-hint">No extra links — the navbar will only show Home &amp; Categories.</p>
            )}
          </div>
          {errors.navLinks && <small className="admin-field-error">{errors.navLinks}</small>}
        </section>

        {/* ===== SAVE BAR ===== */}
        <div className="admin-save-bar">
          <button type="button" className="admin-btn admin-btn-outline" onClick={() => setShowResetConfirm(true)}>
            Reset to Defaults
          </button>
          <button type="submit" className="admin-btn admin-btn-gradient">💾 Save Settings</button>
        </div>
      </form>

      {/* ===== RESET CONFIRM ===== */}
      {showResetConfirm && (
        <div className="admin-modal-backdrop" onClick={() => setShowResetConfirm(false)}>
          <div className="admin-modal admin-modal-sm" onClick={(e) => e.stopPropagation()}>
            <header className="admin-modal-header">
              <h2>Reset all settings?</h2>
              <button className="admin-modal-close" onClick={() => setShowResetConfirm(false)} aria-label="Close">✕</button>
            </header>
            <div className="admin-confirm-body">
              <p>Brand name, logo, hero slides and navbar links will return to their default values.</p>
            </div>
            <footer className="admin-modal-footer">
              <button className="admin-btn admin-btn-outline" onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button className="admin-btn admin-btn-danger" onClick={handleReset}>Yes, Reset</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
