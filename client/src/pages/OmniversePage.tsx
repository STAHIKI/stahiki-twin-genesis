import React from 'react';
import OmniverseStudio from '@/components/omniverse/OmniverseStudio';

const OmniversePage: React.FC = () => {
  return (
    <div className="h-screen">
      <OmniverseStudio collaborationMode={true} />
    </div>
  );
};

export default OmniversePage;