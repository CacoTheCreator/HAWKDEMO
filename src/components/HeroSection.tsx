import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, TrendingUp, Users, BarChart3, ChevronDown, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();

  const handleSanJoseDemo = () => {
    navigate('/san-jose-demo');
  };

  return (
    <div className="relative py-20 space-y-16">
      {/* Hero principal */}
      <div className="text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <Eye className="h-4 w-4 mr-2" />
            Scouting Inteligente
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="gradient-text">Hawk</span>
            <br />
            <span className="text-foreground">Análisis PFI</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Herramienta profesional de scouting futbolístico basada en el Pellegrini Fit Index. 
            Análisis especializado para el Real Betis con 8 perfiles PFI y métricas avanzadas.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-gradient-football hover:scale-105 transition-all px-8 py-3 text-lg font-semibold"
            onClick={onGetStarted}
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            Comenzar Análisis
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 py-3"
            onClick={handleSanJoseDemo}
          >
            <Trophy className="h-5 w-5 mr-2" />
            San José Demo
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
        <Card className="glass-card text-center">
          <CardContent className="p-6 space-y-3">
            <div className="text-3xl font-bold gradient-text">8</div>
            <div className="font-semibold">Perfiles PFI</div>
            <div className="text-sm text-muted-foreground">
              Sistema Pellegrini Fit Index
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card text-center">
          <CardContent className="p-6 space-y-3">
            <div className="text-3xl font-bold gradient-text">9</div>
            <div className="font-semibold">Métricas por Perfil</div>
            <div className="text-sm text-muted-foreground">
              Análisis especializado Real Betis
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card text-center">
          <CardContent className="p-6 space-y-3">
            <div className="text-3xl font-bold gradient-text">∞</div>
            <div className="font-semibold">Jugadores</div>
            <div className="text-sm text-muted-foreground">
              Base de datos escalable
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Características principales */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold gradient-text mb-4">¿Qué puedes hacer?</h2>
          <p className="text-muted-foreground">Herramientas profesionales para el scouting moderno del Real Betis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Eye className="h-8 w-8" />,
              title: "Análisis por Perfil PFI",
              description: "Descubre jugadores ideales según el sistema Pellegrini"
            },
            {
              icon: <TrendingUp className="h-8 w-8" />,
              title: "Métricas Avanzadas",
              description: "9 métricas especializadas por perfil PFI"
            },
            {
              icon: <BarChart3 className="h-8 w-8" />,
              title: "Visualización Radar",
              description: "Gráficos interactivos para comparar rendimiento"
            },
            {
              icon: <Users className="h-8 w-8" />,
              title: "Comparador",
              description: "Compara jugadores lado a lado con insights"
            }
          ].map((feature, index) => (
            <Card key={index} className="glass-card hover-lift group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="text-football-green group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to action para scroll */}
      <div className="text-center animate-bounce">
        <ChevronDown className="h-8 w-8 text-muted-foreground mx-auto" />
      </div>
    </div>
  );
};

export default HeroSection;
