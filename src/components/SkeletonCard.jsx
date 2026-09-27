import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-body">
        <div className="skeleton-line long"></div>
        <div className="skeleton-line short"></div>
        <div className="skeleton-line btn"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;