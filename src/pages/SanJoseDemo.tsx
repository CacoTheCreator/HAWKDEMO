import React, { useState } from 'react';
import Header from '@/components/Header';
import SanJosePlayersList from '@/components/SanJosePlayersList';
import SanJosePlayerRadar from '@/components/SanJosePlayerRadar';
import SanJoseComparison from '@/components/SanJoseComparison';
import { SanJoseJugador } from '@/types/jugador';
import { useSanJoseData } from '@/hooks/usePlayerData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Trophy, Users, BarChart3, Star, Target } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';

const SanJoseDemo = () => {
  const [currentView, setCurrentView] = useState<'list' | 'player-detail'>('list');
  const [selectedPlayer, setSelectedPlayer] = useState<SanJoseJugador | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'comparison'>('list');
  
  // Usar el hook para cargar datos de San José
  const { jugadores, loading, error } = useSanJoseData();

  const handlePlayerSelect = (jugador: SanJoseJugador) => {
    setSelectedPlayer(jugador);
    setCurrentView('player-detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedPlayer(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="glass-card animate-scale-in">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-red-400">Error al cargar datos</h3>
                  <p className="text-muted-foreground max-w-md">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-8">
                {/* Header de la sección */}
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-football rounded-full flex items-center justify-center shadow-2xl">
                        <Trophy className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h1 className="text-5xl font-bold gradient-text">HAWK SAN JOSÉ DEMO</h1>
                      <p className="text-xl text-muted-foreground">
                        Performance Fit Index para San José Earthquakes
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-8">
                    <div className="flex items-center space-x-3 px-4 py-2 bg-card/50 rounded-lg border border-white/10">
                      <Users className="h-5 w-5 text-football-green" />
                      <span className="text-sm font-medium text-foreground">
                        {jugadores.length} jugadores
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 px-4 py-2 bg-card/50 rounded-lg border border-white/10">
                      <Target className="h-5 w-5 text-football-green" />
                      <span className="text-sm font-medium text-foreground">PFI San José M</span>
                    </div>
                  </div>
                </div>

                {/* Loading state */}
                {loading && (
                  <Card className="glass-card animate-scale-in">
                    <CardContent className="p-12 text-center">
                      <div className="flex flex-col items-center space-y-6">
                        <div className="w-16 h-16 bg-gradient-football rounded-full flex items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            Cargando datos de San José Earthquakes...
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Preparando análisis de rendimiento
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tabs para alternar entre vistas */}
                {!loading && (
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'list' | 'comparison')}>
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-card/50 border border-white/10 rounded-lg p-1">
                      <TabsTrigger 
                        value="list" 
                        className="flex items-center space-x-2 data-[state=active]:bg-gradient-football data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                      >
                        <Users className="h-4 w-4" />
                        <span>Lista de Jugadores</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="comparison" 
                        className="flex items-center space-x-2 data-[state=active]:bg-gradient-football data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>Comparación</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="list" className="space-y-6 mt-8">
                      <SanJosePlayersList
                        jugadores={jugadores}
                        onPlayerSelect={handlePlayerSelect}
                      />
                    </TabsContent>
                    
                    <TabsContent value="comparison" className="space-y-6 mt-8">
                      <SanJoseComparison jugadores={jugadores} />
                    </TabsContent>
                  </Tabs>
                )}
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
                    onClick={handleBackToList}
                    className="flex items-center space-x-2 border-football-green/30 text-football-green hover:bg-football-green/10 hover:border-football-green/50 transition-all duration-300"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver a la Lista</span>
                  </Button>
                </div>

                <SanJosePlayerRadar jugador={selectedPlayer} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SanJoseDemo; 