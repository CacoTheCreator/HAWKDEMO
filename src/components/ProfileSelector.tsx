
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { metricasPorPerfil, PerfilPFI } from '@/data/metricas-perfiles';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Users, TrendingUp } from 'lucide-react';

interface ProfileSelectorProps {
  selectedProfile: PerfilPFI | null;
  onProfileSelect: (profile: PerfilPFI) => void;
}

const profileIcons = {
  "Delantero (A)": "⚽",
  "Extremo (EX)": "🏃‍♂️",
  "Mediapunta (M)": "🎯",
  "Mediocentro Defensivo (MCD)": "🛡️",
  "Lateral Izquierdo (LI)": "↗️",
  "Lateral Derecho (LD)": "↖️",
  "Defensa Central (DC)": "🏰",
  "Arquero (GK)": "🥅"
};

const ProfileSelector: React.FC<ProfileSelectorProps> = ({ selectedProfile, onProfileSelect }) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold gradient-text">Selecciona un Perfil PFI</h2>
        <p className="text-muted-foreground">Explora los mejores fichajes por posición</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.keys(metricasPorPerfil).map((perfil) => {
          const perfilKey = perfil as PerfilPFI;
          const isSelected = selectedProfile === perfilKey;
          
          return (
            <Card 
              key={perfil}
              className={`glass-card hover-lift cursor-pointer transition-all duration-300 group ${
                isSelected ? 'ring-2 ring-football-green glow-effect' : ''
              }`}
              onClick={() => onProfileSelect(perfilKey)}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="text-4xl mb-2">
                  {profileIcons[perfilKey]}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg group-hover:text-football-green transition-colors">
                    {perfil}
                  </h3>
                  
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Datos listos</span>
                  </div>
                </div>
                
                <Badge variant="secondary" className="group-hover:bg-football-green/20">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {metricasPorPerfil[perfilKey].length} métricas
                </Badge>
                
                <div className="flex items-center justify-center text-football-green opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Explorar</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSelector;
