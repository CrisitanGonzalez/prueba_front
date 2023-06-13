import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import DataList from './DataList';

jest.mock('axios'); // Mockear axios

describe('DataList', () => {
  const data = [
    { id: 1, description: 'Tarea 1', date: '2023-06-01', enabled: true },
    { id: 2, description: 'Tarea 2', date: '2023-06-02', enabled: false },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data }); // Mockear la respuesta de axios.get
  });

  test('renders loading message', () => {
    render(<DataList loading={true} />);
    const loadingMessage = screen.getByText('Cargando datos...');
    expect(loadingMessage).toBeInTheDocument();
  });

  test('renders no data message', () => {
    render(<DataList loading={false} data={null} />);
    const noDataMessage = screen.getByText('No hay datos disponibles');
    expect(noDataMessage).toBeInTheDocument();
  });

  test('renders data rows', async () => {
    render(<DataList loading={false} data={data} />);
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(data.length + 1); // +1 para la fila de encabezado

    const firstRowCells = within(rows[1]).getAllByRole('cell');
    expect(firstRowCells[0]).toHaveTextContent('1'); // ID
    expect(firstRowCells[1]).toHaveTextContent('Tarea 1'); // Descripción
    expect(firstRowCells[2]).toHaveTextContent('2023-06-01'); // Fecha
    expect(firstRowCells[3]).toHaveTextContent('Sí'); // Habilitado
  });

  test('deletes an item', async () => {
    const deleteMock = jest.fn();
    axios.delete.mockResolvedValue({ data: {} }); // Mockear la respuesta de axios.delete

    render(<DataList loading={false} data={data} setData={deleteMock} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledTimes(1); // Verificar que se mostró el mensaje de confirmación

    const apiUrl = process.env.REACT_APP_API_URL + 'task/1';
    expect(axios.delete).toHaveBeenCalledWith(apiUrl); // Verificar que se llamó a axios.delete con la URL correcta

    await screen.findByText('No hay datos disponibles'); // Verificar que se actualizó la vista correctamente
    expect(deleteMock).toHaveBeenCalledTimes(1); // Verificar que setData se llamó correctamente
  });

  test('edits an item', () => {
    const editMock = jest.fn();
    render(
      <DataList
        loading={false}
        data={data}
        setSelectedItem={editMock}
        selectedItem={null}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(editMock).toHaveBeenCalledTimes(1); // Verificar que setSelectedItem se llamó correctamente
    expect(editMock).toHaveBeenCalledWith(data[0]); // Verificar que setSelectedItem recibió el objeto de la primera fila
  });
});
