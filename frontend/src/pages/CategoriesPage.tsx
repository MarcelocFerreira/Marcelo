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
  Alert,
} from '@mui/material';
import { Add, Delete, Category as CategoryIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { addCategory, deleteCategory } from '../store/categorySlice';
import { Category } from '../types';
import { generateId } from '../utils/helpers';

const CategoriesPage = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#1976d2',
  });
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError('');
    setFormData({ name: '', color: '#1976d2' });
  };

  const handleSubmit = () => {
    if (!formData.name) {
      setError('Por favor, preencha o nome da categoria');
      return;
    }

    const newCategory: Category = {
      id: generateId(),
      name: formData.name,
      color: formData.color,
    };

    dispatch(addCategory(newCategory));
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Categorias
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie as categorias de jogadores
          </Typography>
        </div>
        <Button variant="contained" startIcon={<Add />} size="large" onClick={handleOpen}>
          Nova Categoria
        </Button>
      </Box>

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={category.name}
                    sx={{
                      backgroundColor: category.color,
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '1rem',
                      px: 2,
                      py: 2.5,
                    }}
                  />
                  <IconButton size="small" color="error" onClick={() => handleDelete(category.id)}>
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Nova Categoria</DialogTitle>
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
            label="Cor"
            type="color"
            fullWidth
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
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

export default CategoriesPage;
