import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import AddItemModal from "./AddItemModal";

jest.mock("axios");

describe("AddItemModal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders AddItemModal correctly", () => {
    const open = true;
    const onClose = jest.fn();
    const onItemAdded = jest.fn();
    const setSelectedItem = jest.fn();
    const selectedItem = {
      id: 1,
      description: "Test Description",
      date: "13/01/2023",
      enabled: true,
    };

    render(
      <AddItemModal
        open={open}
        onClose={onClose}
        onItemAdded={onItemAdded}
        setSelectedItem={setSelectedItem}
        selectedItem={selectedItem}
      />
    );

    expect(screen.getByLabelText("Descripción")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha")).toBeInTheDocument();
    expect(screen.getByText("Actualizar")).toBeInTheDocument();
  });

  test("submits form correctly on add", async () => {
    const open = true;
    const onClose = jest.fn();
    const onItemAdded = jest.fn();
    const setSelectedItem = jest.fn();
    const selectedItem = null;

    render(
      <AddItemModal
        open={open}
        onClose={onClose}
        onItemAdded={onItemAdded}
        setSelectedItem={setSelectedItem}
        selectedItem={selectedItem}
      />
    );

    const descriptionInput = screen.getByLabelText("Descripción");
    const dateInput = screen.getByLabelText("Fecha");
    const submitButton = screen.getByText("Agregar");

    fireEvent.change(descriptionInput, { target: { value: "Test Description" } });
    fireEvent.change(dateInput, { target: { value: "13/06/2023" } });
    fireEvent.click(submitButton);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      "mocked_api_url/task",
      {
        description: "Test Description",
        date: "13/06/2023",
        enabled: true,
        id: 0,
      }
    );
    expect(onItemAdded).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("submits form correctly on update", async () => {
    const open = true;
    const onClose = jest.fn();
    const onItemAdded = jest.fn();
    const setSelectedItem = jest.fn();
    const selectedItem = {
      id: 1,
      description: "Test Description",
      date: "2023-06-13T05:37:02.645Z",
      enabled: true,
    };

    render(
      <AddItemModal
        open={open}
        onClose={onClose}
        onItemAdded={onItemAdded}
        setSelectedItem={setSelectedItem}
        selectedItem={selectedItem}
      />
    );

    const descriptionInput = screen.getByLabelText("Descripción");
    const dateInput = screen.getByLabelText("Fecha");
    const submitButton = screen.getByText("Actualizar");

    fireEvent.change(descriptionInput, { target: { value: "Updated Description" } });
    fireEvent.change(dateInput, { target: { value: "13/06/2023" } });
    fireEvent.click(submitButton);

    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(
      "mocked_api_url/task",
      {
        description: "Updated Description",
        date: "13/06/2023",
        enabled: true,
        id: 1,
      }
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});