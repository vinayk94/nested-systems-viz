import React, { useState, useEffect } from 'react';

const FocusedNestedSystemsViz = () => {
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hoveredEntity, setHoveredEntity] = useState(null);

  // Improved color scheme with better contrast
  const colorSchemes = {
    Cell: ['#E6F0FF', '#99C2FF', '#4D94FF', '#0066FF'],
    Organism: ['#E6FFF0', '#99FFD6', '#4DFFAD', '#00FF80'],
    Species: ['#FFF0E6', '#FFD699', '#FFAD4D', '#FF8000'],
    Ecosystem: ['#F0E6FF', '#D699FF', '#AD4DFF', '#8000FF']
  };

  const getColor = (level, value) => {
    const scheme = colorSchemes[level];
    const index = Math.min(Math.floor(value * scheme.length), scheme.length - 1);
    return scheme[index];
  };

  const initialLevels = [
    {
      name: 'Cell',
      entities: Array(100).fill().map(() => ({ health: Math.random(), resource: Math.random() })),
      calculate: (entity, _, time) => ({
        health: Math.min(1, Math.max(0, entity.health + (entity.resource > 0.5 ? 0.01 : -0.01) + Math.sin(time / 20) * 0.005)),
        resource: Math.max(0, Math.min(1, entity.resource - 0.005 + Math.random() * 0.01))
      }),
      optimize: 'Energy efficiency and reproduction'
    },
    {
      name: 'Organism',
      entities: Array(20).fill().map(() => ({ health: Math.random() })),
      calculate: (entity, cellsHealth) => ({
        health: Math.min(1, Math.max(0, entity.health + (cellsHealth > 0.6 ? 0.02 : -0.02)))
      }),
      optimize: 'Survival and growth'
    },
    {
      name: 'Species',
      entities: Array(5).fill().map(() => ({ health: Math.random(), population: 10 })),
      calculate: (entity, organismsHealth) => ({
        health: Math.min(1, Math.max(0, entity.health + (organismsHealth > 0.5 ? 0.01 : -0.01))),
        population: Math.max(0, entity.population + (entity.health > 0.5 ? 1 : -1))
      }),
      optimize: 'Population growth and genetic diversity'
    },
    {
      name: 'Ecosystem',
      entities: [{ health: 0.5, biodiversity: 5 }],
      calculate: (entity, speciesHealth, _, speciesCount) => ({
        health: Math.min(1, Math.max(0, entity.health * 0.9 + speciesHealth * 0.1)),
        biodiversity: speciesCount
      }),
      optimize: 'Biodiversity and stability'
    }
  ];

  const [levels, setLevels] = useState(initialLevels);

  useEffect(() => {
    let interval;
    if (!paused) {
      interval = setInterval(() => {
        setTime(t => t + 1);
        setLevels(prevLevels => {
          let newLevels = [...prevLevels];
          
          newLevels[0].entities = newLevels[0].entities.map(e => newLevels[0].calculate(e, null, time));
          
          for (let i = 1; i < newLevels.length; i++) {
            const lowerLevelHealth = newLevels[i-1].entities.reduce((sum, e) => sum + e.health, 0) / newLevels[i-1].entities.length;
            newLevels[i].entities = newLevels[i].entities.map(e => newLevels[i].calculate(e, lowerLevelHealth, time, newLevels[i].entities.length));
            
            if (i === 2) {
              newLevels[i].entities = newLevels[i].entities.filter(e => e.population > 0);
              if (Math.random() < 0.01 && newLevels[i].entities.length < 7) {
                newLevels[i].entities.push({ health: 0.5, population: 1 });
              }
            }
          }
          
          return newLevels;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [paused, time]);

  const renderEntities = (level, index) => {
    const size = 16 - index * 2;
    const spacing = size + 2;
    const columns = Math.floor(600 / spacing);
    return level.entities.map((entity, i) => (
      <g key={i} transform={`translate(${(i % columns) * spacing}, ${Math.floor(i / columns) * spacing})`}>
        <rect
          width={size}
          height={size}
          fill={getColor(level.name, entity.health)}
          stroke="#2c3e50"
          onMouseEnter={() => setHoveredEntity({ level: level.name, index: i, ...entity })}
          onMouseLeave={() => setHoveredEntity(null)}
        />
        {hoveredEntity && hoveredEntity.level === level.name && hoveredEntity.index === i && (
          <foreignObject x={size} y={0} width={150} height={100}>
            <div xmlns="http://www.w3.org/1999/xhtml" className="bg-white p-2 rounded shadow text-xs">
              <p><strong>{level.name} {i + 1}</strong></p>
              <p>Health: {entity.health.toFixed(2)}</p>
              {entity.resource && <p>Resource: {entity.resource.toFixed(2)}</p>}
              {entity.population && <p>Population: {entity.population}</p>}
              {entity.biodiversity && <p>Biodiversity: {entity.biodiversity}</p>}
            </div>
          </foreignObject>
        )}
      </g>
    ));
  };

  const renderLevel = (level, index) => {
    const yOffset = index * 150;
    return (
      <g key={level.name} transform={`translate(10, ${yOffset})`}>
        <text x="0" y="20" fill="#2c3e50" fontSize="16" fontWeight="bold">{level.name}</text>
        <text x="0" y="40" fill="#2c3e50" fontSize="14">Entities: {level.entities.length}</text>
        <text x="0" y="60" fill="#2c3e50" fontSize="14">Optimizing for: {level.optimize}</text>
        <g transform="translate(0, 70)">
          {renderEntities(level, index)}
        </g>
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Nested Biological Systems</h1>
      <div className="relative">
        <svg width="800" height="700" className="bg-white rounded-lg shadow-lg">
          {levels.map(renderLevel)}
        </svg>
      </div>
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setPaused(!paused)}
      >
        {paused ? 'Resume' : 'Pause'}
      </button>
      <div className="mt-8 max-w-2xl text-center">
        <p>This visualization demonstrates the interactions in nested biological systems:</p>
        <ul className="list-disc list-inside text-left mt-2">
          <li>Each rectangle represents an entity (cell, organism, species, or ecosystem)</li>
          <li>Color intensity shows the health/activity level of each entity</li>
          <li>Hover over entities to see detailed information</li>
          <li>Species can go extinct or evolve based on their health and population</li>
          <li>The ecosystem's health depends on the biodiversity of species</li>
        </ul>
      </div>
    </div>
  );
};

export default FocusedNestedSystemsViz;