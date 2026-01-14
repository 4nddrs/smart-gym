import { useState } from 'react';
import {
  Box,
  Paper,
  Tooltip,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import { User } from '../types/User';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onFaceID: (user: User) => void;
}

const UserList = ({ users, onEdit, onDelete, onFaceID }: UserListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('nombre');
  const [filterDepartamento, setFilterDepartamento] = useState<string>('todos');

  const handleDeleteClick = (id: number | undefined) => {
    if (id !== undefined) {
      setSelectedUserId(id);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedUserId !== null) {
      onDelete(selectedUserId);
      setDeleteDialogOpen(false);
      setSelectedUserId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterDepartamento(event.target.value);
  };

  // Filtrar y ordenar usuarios
  const filteredAndSortedUsers = users
    .filter(user => filterDepartamento === 'todos' || user.departamento === filterDepartamento)
    .sort((a, b) => {
      switch (sortBy) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'apellido':
          return a.apellido.localeCompare(b.apellido);
        case 'codigo':
          return (a.codigo || '').localeCompare(b.codigo || '');
        case 'fecha_inicio':
          return new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime();
        case 'fecha_fin':
          return new Date(a.fecha_fin).getTime() - new Date(b.fecha_fin).getTime();
        default:
          return 0;
      }
    });

  const columns: GridColDef[] = [
    {
      field: 'codigo',
      headerName: 'Código',
      width: 100,
      renderCell: (params) => (
        <Chip label={params.value} color="error" size="small" />
      ),
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 150,
      flex: 1,
    },
    {
      field: 'apellido',
      headerName: 'Apellido',
      width: 150,
      flex: 1,
    },
    {
      field: 'departamento',
      headerName: 'Departamento',
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color="primary" 
          variant="outlined" 
          size="small" 
        />
      ),
    },
    {
      field: 'celular',
      headerName: 'Celular',
      width: 120,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      flex: 1,
    },
    {
      field: 'fecha_inicio',
      headerName: 'Inicio',
      width: 110,
      valueFormatter: (params) => {
        if (!params) return '';
        return new Date(params).toLocaleDateString('es-ES');
      },
    },
    {
      field: 'fecha_fin',
      headerName: 'Fin',
      width: 110,
      valueFormatter: (params) => {
        if (!params) return '';
        return new Date(params).toLocaleDateString('es-ES');
      },
      renderCell: (params) => {
        const fechaFin = new Date(params.value);
        const hoy = new Date();
        const isExpired = fechaFin < hoy;
        
        return (
          <Chip 
            label={fechaFin.toLocaleDateString('es-ES')}
            color={isExpired ? 'error' : 'success'}
            size="small"
            variant={isExpired ? 'filled' : 'outlined'}
          />
        );
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <Tooltip title="Registrar FaceID">
              <FingerprintIcon color="error" />
            </Tooltip>
          }
          label="FaceID"
          onClick={() => onFaceID(params.row)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Editar">
              <EditIcon color="primary" />
            </Tooltip>
          }
          label="Editar"
          onClick={() => onEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Eliminar">
              <DeleteIcon color="error" />
            </Tooltip>
          }
          label="Eliminar"
          onClick={() => handleDeleteClick(params.row._id || params.row.id)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={0} sx={{ 
        p: 4, 
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(18, 18, 18, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 59, 59, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              background: 'linear-gradient(135deg, #ff3b3b 0%, #ff6b6b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
            }}
          >
            Lista de Usuarios ({filteredAndSortedUsers.length})
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': { color: '#ff3b3b' },
                }}
              >
                <SortIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Ordenar por
              </InputLabel>
              <Select
                value={sortBy}
                label="Ordenar por"
                onChange={handleSortChange}
                sx={{
                  color: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 59, 59, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff3b3b',
                  },
                  '& .MuiSelect-icon': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                <MenuItem value="nombre">Nombre</MenuItem>
                <MenuItem value="apellido">Apellido</MenuItem>
                <MenuItem value="codigo">Código</MenuItem>
                <MenuItem value="fecha_inicio">Fecha Inicio</MenuItem>
                <MenuItem value="fecha_fin">Fecha Fin</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': { color: '#ff3b3b' },
                }}
              >
                <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Filtrar por
              </InputLabel>
              <Select
                value={filterDepartamento}
                label="Filtrar por"
                onChange={handleFilterChange}
                sx={{
                  color: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 59, 59, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff3b3b',
                  },
                  '& .MuiSelect-icon': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="fuerza">Fuerza</MenuItem>
                <MenuItem value="funcional">Funcional</MenuItem>
                <MenuItem value="crossfit">CrossFit</MenuItem>
                <MenuItem value="aerobico">Aeróbico</MenuItem>
                <MenuItem value="natacion">Natación</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredAndSortedUsers}
            columns={columns}
            getRowId={(row) => row._id || row.id || row.codigo}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              background: 'rgba(10, 10, 10, 0.6)',
              border: '1px solid rgba(255, 59, 59, 0.3)',
              borderRadius: '16px',
              color: '#ffffff',
              '& .MuiDataGrid-cell': {
                borderColor: 'rgba(255, 255, 255, 0.05)',
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: '0.95rem',
              },
              '& .MuiDataGrid-columnHeaders': {
                background: 'linear-gradient(135deg, rgba(255, 59, 59, 0.2) 0%, rgba(255, 59, 59, 0.1) 100%)',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 600,
                borderBottom: '2px solid rgba(255, 59, 59, 0.4)',
                borderRadius: '16px 16px 0 0',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600,
                color: '#ffffff',
              },
              '& .MuiDataGrid-footerContainer': {
                background: 'rgba(26, 26, 26, 0.8)',
                borderTop: '1px solid rgba(255, 59, 59, 0.3)',
                borderRadius: '0 0 16px 16px',
              },
              '& .MuiTablePagination-root': {
                color: 'rgba(255, 255, 255, 0.9)',
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                color: 'rgba(255, 255, 255, 0.9)',
              },
              '& .MuiCheckbox-root': {
                color: '#ff3b3b',
              },
              '& .MuiCheckbox-root.Mui-checked': {
                color: '#ff3b3b',
              },
              '& .MuiDataGrid-row': {
                '&:hover': {
                  backgroundColor: 'rgba(255, 59, 59, 0.08)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 59, 59, 0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 59, 59, 0.2)',
                  },
                },
              },
              '& .MuiDataGrid-iconSeparator': {
                color: 'rgba(255, 255, 255, 0.2)',
              },
              '& .MuiDataGrid-sortIcon': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(18, 18, 18, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            color: '#ffffff',
            border: '1px solid rgba(255, 59, 59, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(255, 59, 59, 0.3)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #ff3b3b 0%, #ff6b6b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 700,
          fontSize: '1.5rem',
        }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem' }}>
            ¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel} 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            sx={{ 
              background: 'linear-gradient(135deg, #ff3b3b 0%, #ff6b6b 100%)',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(255, 59, 59, 0.4)',
              '&:hover': { 
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff3b3b 100%)',
                boxShadow: '0 6px 20px rgba(255, 59, 59, 0.6)',
              },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;
