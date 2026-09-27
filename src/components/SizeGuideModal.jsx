import React, { useEffect } from 'react';

const sizeCharts = {
  'T-Shirts': {
    headers: ['Size', 'Chest (in)', 'Length (in)', 'Shoulder (in)'],
    rows: [
      ['S', '36', '26', '16'],
      ['M', '38', '27', '17'],
      ['L', '40', '28', '18'],
      ['XL', '42', '29', '19']
    ]
  },
  'Kurtis': {
    headers: ['Size', 'Bust (in)', 'Waist (in)', 'Length (in)'],
    rows: [
      ['S', '34', '30', '40'],
      ['M', '36', '32', '41'],
      ['L', '38', '34', '42'],
      ['XL', '40', '36', '43']
    ]
  }
};

const SizeGuideModal = ({ isOpen, onClose, category = 'T-Shirts' }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const chart = sizeCharts[category] || sizeCharts['T-Shirts'];

  return (
    <div className="sizeguide-overlay" onClick={onClose}>
      <div className="sizeguide-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sizeguide-close" onClick={onClose}>✕</button>
        
        <div className="sizeguide-header">
          <h2>📏 Size Guide</h2>
          <p>Find your perfect fit</p>
        </div>

        <div className="sizeguide-category-tabs">
          <button className={category === 'T-Shirts' ? 'active' : ''}>T-Shirts</button>
          <button className={category === 'Kurtis' ? 'active' : ''}>Kurtis</button>
        </div>

        <div className="sizeguide-table-wrapper">
          <table className="sizeguide-table">
            <thead>
              <tr>
                {chart.headers.map((h, i) => <th key={i}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {chart.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => <td key={j}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sizeguide-tips">
          <h4>💡 How to Measure</h4>
          <ul>
            <li><strong>Chest/Bust:</strong> Wrap measuring tape around the fullest part</li>
            <li><strong>Waist:</strong> Measure around the narrowest part of your waist</li>
            <li><strong>Length:</strong> From shoulder to bottom hem</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;