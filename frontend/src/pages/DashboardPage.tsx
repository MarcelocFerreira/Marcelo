import { useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import {
  EmojiEvents,
  People,
  SportsSoccer,
  CalendarToday,
  Add,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';
import { TournamentStatus } from '../types';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { tournaments } = useAppSelector((state) => state.tournament);
  const { players } = useAppSelector((state) => state.player);
  const { courts } = useAppSelector((state) => state.court);
  const { user } = useAppSelector((state) => state.auth);

  const stats = useMemo(() => {
    const activeTournaments = tournaments.filter(
      (t) => t.status === TournamentStatus.IN_PROGRESS
    ).length;
    const scheduledTournaments = tournaments.filter(
      (t) => t.status === TournamentStatus.SCHEDULED
    ).length;
    const completedTournaments = tournaments.filter(
      (t) => t.status === TournamentStatus.COMPLETED
    ).length;

    return {
      totalTournaments: tournaments.length,
      activeTournaments,
      scheduledTournaments,
      completedTournaments,
      totalPlayers: players.length,
      totalCourts: courts.length,
    };
  }, [tournaments, players, courts]);

  const statCards = [
    {
      title: 'Total de Torneios',
      value: stats.totalTournaments,
      icon: <EmojiEvents sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#1976d2',
      action: () => navigate('/tournaments'),
    },
    {
      title: 'Torneios Ativos',
      value: stats.activeTournaments,
      icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
      color: '#4caf50',
      action: () => navigate('/tournaments'),
    },
    {
      title: 'Total de Jogadores',
      value: stats.totalPlayers,
      icon: <People sx={{ fontSize: 40, color: 'info.main' }} />,
      color: '#2196f3',
      action: () => navigate('/players'),
    },
    {
      title: 'Total de Quadras',
      value: stats.totalCourts,
      icon: <SportsSoccer sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: '#ff9800',
      action: () => navigate('/courts'),
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Bem-vindo, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aqui está um resumo do seu sistema de agendamento
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={() => navigate('/tournaments')}
        >
          Novo Torneio
        </Button>
      </Box>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={card.action}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  {card.icon}
                </Box>
                <Typography variant="h3" fontWeight={600} gutterBottom>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  Torneios Recentes
                </Typography>
              </Box>
              {tournaments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nenhum torneio cadastrado ainda.
                </Typography>
              ) : (
                <Box>
                  {tournaments.slice(0, 5).map((tournament) => (
                    <Box
                      key={tournament.id}
                      sx={{
                        py: 1.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <Typography variant="body1" fontWeight={500}>
                        {tournament.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {tournament.sport} • {tournament.category}
                      </Typography>
                    </Box>
                  ))}
                  {tournaments.length > 5 && (
                    <Button
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => navigate('/tournaments')}
                    >
                      Ver Todos
                    </Button>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  Jogadores Recentes
                </Typography>
              </Box>
              {players.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nenhum jogador cadastrado ainda.
                </Typography>
              ) : (
                <Box>
                  {players.slice(0, 5).map((player) => (
                    <Box
                      key={player.id}
                      sx={{
                        py: 1.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <Typography variant="body1" fontWeight={500}>
                        {player.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {player.email}
                        {player.category && ` • ${player.category}`}
                      </Typography>
                    </Box>
                  ))}
                  {players.length > 5 && (
                    <Button
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => navigate('/players')}
                    >
                      Ver Todos
                    </Button>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
