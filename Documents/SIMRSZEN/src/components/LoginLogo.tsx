import React from 'react';
import logoImage from '../assets/zen-logo.png';

const LoginLogo: React.FC = () => {
  return (
    <div className="flex justify-center mb-8">
      <img 
        src={logoImage} 
        alt="SIMRS ZEN Logo" 
        className="h-24 w-auto"
      />
    </div>
  );
};

export default LoginLogo;