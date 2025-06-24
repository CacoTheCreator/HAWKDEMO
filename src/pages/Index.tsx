import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProfileSelector from '@/components/ProfileSelector';
import PlayersList from '@/components/PlayersList';
import PlayerRadar from '@/components/PlayerRadar';
import PlayerComparison from '@/components/PlayerComparison';
import ProfileStatistics from '@/components/ProfileStatistics';
import RadarChartJugador from '@/components/RadarChartJugador';
import { PerfilPFI, metricasPorPerfil } from '@/data/metricas-perfiles';
import { Jugador } from '@/types/jugador';
import { usePlayerData } from '@/hooks/usePlayerData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';

// Diccionario de mapeo de posiciones a claves de radar
const perfilRadarMap: Record<string, string> = {
  'Extremo': 'ex',
  'Delantero': 'a',
  'Mediapunta': 'm',
  'Mediocentro defensivo': 'mcd',
  'Defensa central': 'dc',
  'Lateral derecho': 'ld',
  'Lateral izquierdo': 'li',
  'Arquero': 'gk',
  // Agrega aquí otros posibles valores según tus datos
};

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'profiles' | 'players' | 'player-detail'>('home');
  const [selectedProfile, setSelectedProfile] = useState<PerfilPFI | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Jugador | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Usar el hook para cargar datos
  const { jugadores, loading, error } = usePlayerData(selectedProfile);

  const handleGetStarted = () => {
    setCurrentView('profiles');
  };

  const handleProfileSelect = async (profile: PerfilPFI) => {
    setIsTransitioning(true);
    setSelectedProfile(profile);
    // Pequeño delay para permitir la transición
    await new Promise(resolve => setTimeout(resolve, 300));
    setCurrentView('players');
    setIsTransitioning(false);
  };

  const handlePlayerSelect = (jugador: Jugador) => {
    setSelectedPlayer(jugador);
    setCurrentView('player-detail');
  };

  const handleBackToProfiles = () => {
    setCurrentView('profiles');
    setSelectedProfile(null);
  };

  const handleBackToPlayers = () => {
    setCurrentView('players');
    setSelectedPlayer(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSection onGetStarted={handleGetStarted} />
            </motion.div>
          )}

          {currentView === 'profiles' && (
            <motion.div
              key="profiles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentView('home')}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver al Inicio</span>
                  </Button>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Database className="h-4 w-4" />
                    <span>Datos JSON cargados</span>
                  </div>
                </div>
                
                <ProfileSelector 
                  selectedProfile={selectedProfile}
                  onProfileSelect={handleProfileSelect}
                />
              </div>
            </motion.div>
          )}

          {currentView === 'players' && (
            <motion.div
              key="players"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {(loading || isTransitioning) && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-football-green border-t-transparent" />
                    <span className="text-sm text-muted-foreground">Cargando datos...</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleBackToProfiles}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver a Perfiles</span>
                  </Button>
                </div>

                <Tabs defaultValue="lista" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 glass-card">
                    <TabsTrigger value="lista">Lista de Jugadores</TabsTrigger>
                    <TabsTrigger value="comparacion">Comparar Jugadores</TabsTrigger>
                    <TabsTrigger value="radar">Radar Comparativo</TabsTrigger>
                    <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="lista" className="mt-6">
                    <PlayersList
                      perfil={selectedProfile}
                      jugadores={jugadores}
                      onPlayerSelect={handlePlayerSelect}
                    />
                  </TabsContent>
                  
                  <TabsContent value="comparacion" className="mt-6">
                    <PlayerComparison 
                      jugadores={jugadores}
                      perfil={selectedProfile}
                    />
                  </TabsContent>

                  <TabsContent value="radar" className="mt-6">
                    <RadarChartJugador />
                  </TabsContent>
                  
                  <TabsContent value="estadisticas" className="mt-6">
                    <ProfileStatistics 
                      jugadores={jugadores}
                      perfil={selectedProfile}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          )}

          {currentView === 'player-detail' && selectedPlayer && (
            <motion.div
              key="player-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleBackToPlayers}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver a Jugadores</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Nombre:</span>
                          <span className="font-bold">{selectedPlayer.nombre}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Edad:</span>
                          <span className="font-bold">{selectedPlayer.edad} años</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Club:</span>
                          <span className="font-bold">{selectedPlayer.club}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Competición:</span>
                          <span className="font-bold">{selectedPlayer.competicion}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">PFI Score:</span>
                          <span className="font-bold text-football-green text-lg">{selectedPlayer.pfi}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <PlayerRadar 
                    jugador={{
                      Jugador: selectedPlayer.nombre,
                      Perfil: perfilRadarMap[selectedPlayer.posicion] || selectedPlayer.posicion || selectedProfile || '',
                      ...selectedPlayer
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
