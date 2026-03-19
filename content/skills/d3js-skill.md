---
title: "D3.js Visualization"
description: "Creating interactive data visualisations using d3.js for custom charts, graphs, network diagrams, geographic visualisations, and complex SVG-based data visualisations."
author: "chrisvoncsefalvay"
repoUrl: "https://github.com/chrisvoncsefalvay/claude-d3js-skill"
categories: ["development"]
tags: ["d3js", "visualization", "charts", "svg", "data-viz"]
date: "2026-03-19T08:00:08Z"
---

<Callout type="tip">
Who this is for: Developers who need custom, interactive data visualizations with fine-grained control over visual elements, transitions, and interactions beyond standard charting libraries.
</Callout>

## What This Skill Does

Provides guidance for creating sophisticated, interactive data visualizations using d3.js (Data-Driven Documents) with precise control over every visual element.

<Card title="Core Capabilities">

- **Custom Visualizations** — Unique visual encodings and layouts not available in standard libraries
- **Interactive Explorations** — Complex pan, zoom, and brush behaviors
- **Network/Graph Visualizations** — Force-directed layouts, tree diagrams, hierarchies, chord diagrams
- **Geographic Visualizations** — Custom projections and map-based data
- **Smooth Transitions** — Choreographed animations between states
- **Publication-Quality Graphics** — Fine-grained styling control

</Card>

## When to Use D3.js

### Use D3.js For
| Use Case | Description |
|----------|-------------|
| **Custom Visualizations** — Unique visual encodings or layouts |
| **Interactive Explorations** — Pan, zoom, brush behaviors |
| **Network/Graph Visualizations** — Force-directed, trees, hierarchies |
| **Geographic Visualizations** — Custom projections |
| **Smooth Transitions** — Choreographed animations |
| **Publication-Quality** — Fine-grained styling control |
| **Novel Chart Types** — Not available in standard libraries |

### Consider Alternatives For
- **3D Visualizations** — Use Three.js instead

## Usage

### Basic Bar Chart

```javascript
function drawBarChart(data, svgElement) {
  const svg = d3.select(svgElement);
  svg.selectAll("*").remove();

  const width = 800, height = 400;
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.category))
    .range([0, innerWidth])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([innerHeight, 0]);

  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale));

  g.append("g").call(d3.axisLeft(yScale));

  g.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => xScale(d.category))
    .attr("y", d => yScale(d.value))
    .attr("width", xScale.bandwidth())
    .attr("height", d => innerHeight - yScale(d.value))
    .attr("fill", "steelblue");
}
```

### Line Chart

```javascript
const line = d3.line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.value))
  .curve(d3.curveMonotoneX);

g.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2)
  .attr("d", line);
```

### Scatter Plot

```javascript
g.selectAll("circle")
  .data(data)
  .join("circle")
  .attr("cx", d => xScale(d.x))
  .attr("cy", d => yScale(d.y))
  .attr("r", d => sizeScale(d.size))
  .attr("fill", d => colourScale(d.category))
  .attr("opacity", 0.7);
```

### Chord Diagram

```javascript
function drawChordDiagram(data) {
  const width = 600, height = 600;
  const innerRadius = Math.min(width, height) * 0.3;
  const outerRadius = innerRadius + 30;

  const chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending);
  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  const ribbon = d3.ribbon();
  const colourScale = d3.scaleOrdinal(d3.schemeCategory10);

  const g = svg.append("g")
    .attr("transform", `translate(${width/2},${height/2})`);

  const chords = chord(matrix);

  // Draw ribbons
  g.append("g").selectAll("path")
    .data(chords)
    .join("path")
    .attr("d", ribbon)
    .attr("fill", d => colourScale(nodes[d.source.index]));

  // Draw groups (arcs)
  const group = g.append("g").selectAll("g")
    .data(chords.groups)
    .join("g");

  group.append("path").attr("d", arc)
    .attr("fill", d => colourScale(nodes[d.index]));
}
```

## Integration Patterns

### Pattern A: Direct DOM Manipulation (Recommended)

```javascript
function drawChart(data) {
  if (!data || data.length === 0) return;

  const svg = d3.select('#chart');
  svg.selectAll("*").remove();

  const width = 800, height = 400;
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };

  // Create scales, axes, and draw visualization
  // ... d3 code here ...
}

drawChart(myData);
```

### Pattern B: Declarative Rendering (For Frameworks)

```javascript
function getChartElements(data) {
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([0, 400]);

  return data.map((d, i) => ({
    x: 50,
    y: i * 30,
    width: xScale(d.value),
    height: 25
  }));
}

// In React: {getChartElements(data).map((d, i) => <rect key={i} {...d} />)}
```

## Responsive Sizing

```javascript
function setupResponsiveChart(containerId, data) {
  const container = document.getElementById(containerId);
  const svg = d3.select(`#${containerId}`).append('svg');

  function updateChart() {
    const { width, height } = container.getBoundingClientRect();
    svg.attr('width', width).attr('height', height);
    drawChart(data, svg, width, height);
  }

  updateChart();
  window.addEventListener('resize', updateChart);
  return () => window.removeEventListener('resize', updateChart);
}
```

## Related Use Cases

- Custom chart and graph creation
- Interactive data exploration dashboards
- Network and relationship visualizations
- Geographic and map-based data display
- Animated data storytelling
- Scientific and academic visualizations
- Real-time data monitoring displays
