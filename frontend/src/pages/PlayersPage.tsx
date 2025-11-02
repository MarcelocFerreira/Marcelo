import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { Add, Delete, People } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { addPlayer, deletePlayer } from '../store/playerSlice';
import { Player } from '../types';
import { generateId } from '../utils/helpers';

const PlayersPage = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
  });
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();
  const { players } = useAppSelector((state) => state.player);
  const { categories } = useAppSelector((state) => state.category);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError('');
    setFormData({ name: '', email: '', phone: '', category: '' });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const newPlayer: Player = {
      id: generateId(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      category: formData.category || undefined,
      createdAt: new Date(),
    };

    dispatch(addPlayer(newPlayer));
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este jogador?')) {
      dispatch(deletePlayer(id));
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Jogadores
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie os jogadores cadastrados
          </Typography>
        </div>
        <Button variant="contained" startIcon={<Add />} size="large" onClick={handleOpen}>
          Novo Jogador
        </Button>
      </Box>

      {players.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <People sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum jogador cadastrado
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Clique no botão acima para adicionar jogadores
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.email}</TableCell>
                  <TableCell>{player.phone || '-'}</TableCell>
                  <TableCell>{player.category || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="error" onClick={() => handleDelete(player.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Novo Jogador</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Telefone"
            fullWidth
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Adicionar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlayersPage;
