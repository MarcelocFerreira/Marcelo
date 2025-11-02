import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  EmojiEvents,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { addTournament, deleteTournament } from '../store/tournamentSlice';
import { Tournament, TournamentStatus, TournamentFormat } from '../types';
import { generateId, getStatusColor, formatDate, getFormatLabel } from '../utils/helpers';

const TournamentsPage = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    category: '',
    startDate: '',
    endDate: '',
    format: TournamentFormat.GROUP,
    matchDuration: 90,
    breakBetweenMatches: 15,
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { tournaments } = useAppSelector((state) => state.tournament);
  const { categories } = useAppSelector((state) => state.category);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError('');
    setFormData({
      name: '',
      sport: '',
      category: '',
      startDate: '',
      endDate: '',
      format: TournamentFormat.GROUP,
      matchDuration: 90,
      breakBetweenMatches: 15,
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.sport || !formData.category || !formData.startDate || !formData.endDate) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const newTournament: Tournament = {
      id: generateId(),
      name: formData.name,
      sport: formData.sport,
      category: formData.category,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      status: TournamentStatus.DRAFT,
      format: formData.format,
      matchDuration: formData.matchDuration,
      breakBetweenMatches: formData.breakBetweenMatches,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch(addTournament(newTournament));
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este torneio?')) {
      dispatch(deleteTournament(id));
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Torneios
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie seus torneios esportivos
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={handleOpen}
        >
          Novo Torneio
        </Button>
      </Box>

      {tournaments.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <EmojiEvents sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum torneio cadastrado
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Clique no botão acima para criar seu primeiro torneio
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {tournaments.map((tournament) => (
            <Grid item xs={12} md={6} lg={4} key={tournament.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {tournament.name}
                    </Typography>
                    <Chip
                      label={tournament.status}
                      color={getStatusColor(tournament.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {tournament.sport} • {tournament.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Formato: {getFormatLabel(tournament.format)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/tournaments/${tournament.id}`)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(tournament.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Novo Torneio</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Torneio"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Esporte"
            fullWidth
            value={formData.sport}
            onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Categoria"
            fullWidth
            select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Formato"
            fullWidth
            select
            value={formData.format}
            onChange={(e) => setFormData({ ...formData, format: e.target.value as TournamentFormat })}
          >
            <MenuItem value={TournamentFormat.GROUP}>Grupos</MenuItem>
            <MenuItem value={TournamentFormat.ELIMINATION}>Eliminatórias</MenuItem>
            <MenuItem value={TournamentFormat.MIXED}>Misto</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Data de Início"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Data de Término"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Duração do Jogo (min)"
                type="number"
                fullWidth
                value={formData.matchDuration}
                onChange={(e) => setFormData({ ...formData, matchDuration: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Intervalo (min)"
                type="number"
                fullWidth
                value={formData.breakBetweenMatches}
                onChange={(e) => setFormData({ ...formData, breakBetweenMatches: parseInt(e.target.value) })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TournamentsPage;
