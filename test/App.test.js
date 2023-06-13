import React from "react";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

jest.mock("axios");

describe("App", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders App correctly", async () => {
    const mockData = [
      { id: 1, description: "Test Description 1", date: "2023-06-13T05:37:02.645Z", enabled: true },
      { id: 2, description: "Test Description 2", date: "2023-06-14T05:37:02.645Z", enabled: true },
    ];
    axios.get.mockResolvedValueOnce({ data: mockData });

    render(
      <Router>
        <App />
      </Router>
    );

    expect(screen.getByText("Mantenedor de Datos")).toBeInTheDocument();

    // Esperar a que se carguen los datos
    const dataListHeading = await screen.findByText("Data List Heading");
    expect(dataListHeading).toBeInTheDocument();

    // Comprobar que se muestra la lista de datos
    const dataItems = screen.getAllByTestId("data-item");
    expect(dataItems).toHaveLength(mockData.length);
    expect(dataItems[0]).toHaveTextContent("Test Description 1");
    expect(dataItems[1]).toHaveTextContent("Test Description 2");

    // Comprobar que se llama a la API
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith("mocked_api_url/task");
  });
});
