import React, { useRef, useEffect,useState } from "react";

import { Modal, Box, TextField, Button } from "@mui/material";
import axios from "axios";

function AddItemModal({
  open,
  onClose,
  onItemAdded,
  setSelectedItem,
  selectedItem
}) {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [buttonText, setButtonText] = useState('Agregar');

  useEffect(() => {
    
    if (selectedItem) {
      setDescription(selectedItem.description);
      setDate(selectedItem.date);
      setButtonText('Actualizar');
    } else {
      setDescription("");
      setDate("");
    }
  }, [selectedItem]);

  const descriptionRef = useRef(null);
  const dateRef = useRef(null);
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (selectedItem) {
        const descriptionValue = descriptionRef.current.value;
        const dateValue = dateRef.current.value;
        const values = {
          description: descriptionValue,
          date: dateValue,
          enabled: true,
          id: selectedItem.id,
        };
        const apiUrl = process.env.REACT_APP_API_URL + "task";
        const response = await axios.put(apiUrl, values);
        console.log(response);
      } else {
        const descriptionValue = descriptionRef.current.value;
        const dateValue = dateRef.current.value;
        const values = {
          description: descriptionValue,
          date: dateValue,
          enabled: true,
          id: 0,
        };
        const apiUrl = process.env.REACT_APP_API_URL + "task";

        const response = await axios.post(apiUrl, values);
        console.log(response);
        onItemAdded(values);
      }
    } catch (error) {
      console.error(error);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2 id="modal-title">Tarea</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Descripción"
            inputRef={descriptionRef}
            value={description}
            onChange={handleDescriptionChange}
            fullWidth
            required
            // Otras propiedades y eventos del TextField
          />
          <p></p>
          <TextField
            label="Fecha"
            inputRef={dateRef}
            fullWidth
            required
            value={date}
            onChange={handleDateChange}
            inputProps={{
              maxLength: 10,
              pattern: "\\d{2}/\\d{2}/\\d{4}",
              placeholder: "dd/MM/aaaa",
            }}
          />
          <p></p>
          <Button type="submit" variant="contained" >
            {buttonText}
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

export default AddItemModal;
