import React from 'react';
import { Activity, Trophy } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSanJoseDemo = () => {
    navigate('/san-jose-demo');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-football rounded-full blur-sm opacity-40"></div>
            <div className="relative bg-white/10 backdrop-blur-sm p-2 rounded-full border border-white/20 shadow-md flex items-center justify-center">
              <img 
                src="/Isotipo Hawkview (2).png" 
                alt="Hawk Logo" 
                className="h-12 w-12 object-cover rounded-full border-2 border-white shadow-lg bg-white/80"
                style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
                onError={(e) => {
                  console.log('Error loading logo:', e);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => console.log('Logo loaded successfully')}
              />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Hawk</h1>
            <p className="text-xs text-muted-foreground">Análisis Inteligente PFI: Pellegrini Fit Index for Real Betis</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {location.pathname === '/san-jose-demo' ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleGoHome}
              className="flex items-center space-x-2"
            >
              <Activity className="h-4 w-4" />
              <span>Volver a Hawk</span>
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSanJoseDemo}
              className="flex items-center space-x-2"
            >
              <Trophy className="h-4 w-4" />
              <span>San José Demo</span>
            </Button>
          )}
          
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-football-green animate-pulse" />
            <span className="text-sm text-muted-foreground">Sistema Activo</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
