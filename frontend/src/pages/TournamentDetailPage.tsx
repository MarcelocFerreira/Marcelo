import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useAppSelector } from '../hooks/useRedux';
import { getStatusColor, formatDate, getFormatLabel } from '../utils/helpers';

const TournamentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tournaments } = useAppSelector((state) => state.tournament);

  const tournament = tournaments.find((t) => t.id === id);

  if (!tournament) {
    return (
      <Box>
        <Typography variant="h5">Torneio não encontrado</Typography>
        <Button onClick={() => navigate('/tournaments')} sx={{ mt: 2 }}>
          Voltar
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/tournaments')}
        sx={{ mb: 3 }}
      >
        Voltar
      </Button>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={600}>
              {tournament.name}
            </Typography>
            <Chip label={tournament.status} color={getStatusColor(tournament.status)} />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Esporte
              </Typography>
              <Typography variant="body1" gutterBottom>
                {tournament.sport}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Categoria
              </Typography>
              <Typography variant="body1" gutterBottom>
                {tournament.category}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Formato
              </Typography>
              <Typography variant="body1" gutterBottom>
                {getFormatLabel(tournament.format)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Período
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Duração do Jogo
              </Typography>
              <Typography variant="body1" gutterBottom>
                {tournament.matchDuration} minutos
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Intervalo entre Jogos
              </Typography>
              <Typography variant="body1" gutterBottom>
                {tournament.breakBetweenMatches} minutos
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TournamentDetailPage;
