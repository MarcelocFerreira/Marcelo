import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
} from '@mui/material';
import { Add, Delete, SportsSoccer } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { addCourt, deleteCourt } from '../store/courtSlice';
import { Court } from '../types';
import { generateId } from '../utils/helpers';

const CourtsPage = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    sport: '',
    tournamentId: '',
  });
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();
  const { courts } = useAppSelector((state) => state.court);
  const { tournaments } = useAppSelector((state) => state.tournament);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError('');
    setFormData({ name: '', location: '', sport: '', tournamentId: '' });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.sport) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const newCourt: Court = {
      id: generateId(),
      tournamentId: formData.tournamentId || '',
      name: formData.name,
      location: formData.location || undefined,
      sport: formData.sport,
      isActive: true,
      createdAt: new Date(),
    };

    dispatch(addCourt(newCourt));
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta quadra?')) {
      dispatch(deleteCourt(id));
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Quadras
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie as quadras disponíveis
          </Typography>
        </div>
        <Button variant="contained" startIcon={<Add />} size="large" onClick={handleOpen}>
          Nova Quadra
        </Button>
      </Box>

      {courts.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <SportsSoccer sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhuma quadra cadastrada
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Clique no botão acima para adicionar quadras
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {courts.map((court) => (
            <Grid item xs={12} sm={6} md={4} key={court.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {court.name}
                    </Typography>
                    <Chip
                      label={court.isActive ? 'Ativa' : 'Inativa'}
                      color={court.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Esporte: {court.sport}
                  </Typography>
                  {court.location && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Local: {court.location}
                    </Typography>
                  )}
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton size="small" color="error" onClick={() => handleDelete(court.id)}>
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
        <DialogTitle>Nova Quadra</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Quadra"
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
            label="Localização"
            fullWidth
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Adicionar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourtsPage;
