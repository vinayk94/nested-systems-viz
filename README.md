# Nested Biological Systems Visualization

## Overview

This project is an interactive visualization of nested biological systems, demonstrating the complex interactions and interdependencies between different levels of biological organization: from cells to ecosystems. It's built using React and SVG, providing a dynamic and engaging way to explore how lower-level biological processes contribute to higher-level outcomes.

## Key Features

- Hierarchical representation of four biological levels: Cells, Organisms, Species, and Ecosystem
- Dynamic simulation of entity health, resources, and populations
- Color-coded visualization of entity health and activity
- Interactive hover functionality for detailed entity information
- Simulation of resource competition, adaptation, extinction, and evolution

## System Interactions

### Cell Level
- Entities: Individual cells
- Properties: Health, Resource
- Optimization: Energy efficiency and reproduction
- Interactions: Cells manage resources and adapt to a simulated environmental cycle

### Organism Level
- Entities: Individual organisms
- Properties: Health
- Optimization: Survival and growth
- Interactions: Organism health is determined by the collective health of its constituent cells

### Species Level
- Entities: Different species
- Properties: Health, Population
- Optimization: Population growth and genetic diversity
- Interactions: Species can go extinct if population drops to zero, and new species can evolve

### Ecosystem Level
- Entities: The overall ecosystem
- Properties: Health, Biodiversity
- Optimization: Biodiversity and stability
- Interactions: Ecosystem health depends on the number and health of species

## Code Structure

The main component, `FocusedNestedSystemsViz`, manages the state and rendering of the visualization:

- `initialLevels`: Defines the initial state and behavior of each biological level
- `useEffect` hook: Manages the simulation loop, updating entity states over time
- `renderEntities` and `renderLevel` functions: Handle the SVG rendering of entities and levels
- Interactive elements: Hover functionality and pause/resume button

## Mathematical Model

Each level's entities are updated based on their current state and the state of the level below:

- Cell health = previous health + resource factor + environmental factor
- Organism health = previous health + cell health factor
- Species health = previous health + organism health factor
- Species population = previous population + health factor
- Ecosystem health = weighted average of previous health and species health

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm start`
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Customization

You can customize various aspects of the simulation:

- Adjust the number of entities at each level in the `initialLevels` object
- Modify the `calculate` functions to change how entities interact and evolve
- Alter the color schemes in the `colorSchemes` object for different visual representations

## Future Enhancements

- Add user controls to adjust simulation parameters
- Implement more complex inter-entity interactions within levels
- Create detailed views for examining specific entities or levels
- Add time-series data visualization for long-term trend analysis