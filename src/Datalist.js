
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button 
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import axios from "axios";
import AddItemModal from "./AddItemModal";

function DataList({ data,setData, loading,setSelectedItem,selectedItem}) {
  const [open, setOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleItemAdded = () => {
    setShowSuccessMessage(true);
    const updatedData = fetchData(); 
    setData(updatedData); 
  };
  
  const handleDelete = async (id) => {
    try{   
        if(window.confirm("desea eliminar este registro?")){
            const apiUrl = process.env.REACT_APP_API_URL + "task/" +id;
            // Llamada al servicio REST utilizando axios
            const response = await axios.delete(apiUrl);
            console.log(response);
        }
    }catch(error){
        console.error("Error deleting data:", error);
    }
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    selectedItem=item;
    setOpen(true);
    
  };

  const fetchData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL + "task" ;
      const response = await axios.get(apiUrl);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (loading) {
    return <div>Cargando datos...</div>;
  }
  if (!Array.isArray(data)) {
    return <div>No hay datos disponibles</div>;
  }
  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Agregar Tarea
      </Button>
      {showSuccessMessage && <p style={{ color: 'green' }}>Registro correcto.</p>}
      <AddItemModal open={open} onClose={handleClose} onItemAdded={handleItemAdded} setSelectedItem={setSelectedItem} selectedItem={selectedItem} />
      <TableContainer style={{ width: "70%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Habilitado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.enabled ? "Sí" : "No"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(item)}>
                    <EditIcon />
                  </IconButton>
                </TableCell> 
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default DataList;
