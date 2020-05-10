// https://observablehq.com/@d3/treemap
const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

d3.json(url).then(data => drawgraph(data));

function drawgraph(data) {
  const width = 1000,
    height = 1000;

  const colors = ["#4E79A7", "#A0CBE8", "#F28E2B", "#FFBE7D", "#59A14F", "#8CD17D", "#B6992D",
    "#F1CE63", "#499894", "#86BCB6", "#E15759", "#FF9D9A", "#79706E", "#BAB0AC",
    "#D37295", "#FABFD2", "#B07AA1", "#D4A6C8", "#9D7660", "#D7B5A6"]

  const color = d3.scaleOrdinal(colors);

  const treemap = data => d3.treemap()
    .tile(d3.treemapSquarify)
    .size([width, height])
    .padding(1)
    .round(true)
    (d3.hierarchy(data)
      .sum(d => +d.value)
      .sort((a, b) => b.value - a.value))

  const root = treemap(data);

  legend = d3.select("#treeMap").append('svg')
    .join("g")
    .attr("id", "legend")
    .attr("width", 960)
    .attr("height", 50);

  legend.selectAll('rect')
    .data(root.children)
    .join('rect')
    .attr('class', 'legend-item')
    .style('stroke', 'white')
    .attr('x', (d, i) => i * 50)
    .attr('width', 40)
    .attr('height', 20)
    .attr('rx', 4)
    .attr('ry', 4)
    .style('fill', d => color(d.data.name))

  legend.selectAll('text')
    .data(root.children)
    .join('text')
    .attr('x', (d, i) => i * 50 + 5)
    .attr('y', 14)
    .style('font-weight', 'bold')
    .style('font-size', '12px')
    .text(d => d.data.name);

  const svg = d3.select("#treeMap")
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .style("font", "9px Roboto");

  const leaf = svg.selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", d => `translate(${d.x0},${d.y0})`);

  const Tooltip = d3.select("#treeMap")
    .append("div")
    .style("opacity", 0)
    .attr("id", "tooltip")
    .style("border", "solid")
    .style("border-width", "0px")
    .style("border-radius", "5px")
    .style("text-align", "center")
    .style("padding", "5px");

  const mouseOver = function (d) {
    cell = d3.select(this)
    Tooltip
      .attr("data-value", cell.attr("data-value"))
      .style("background-color", cell.attr("fill"))
      .style("opacity", 1)
      .style("box-shadow", "1px 1px 10px")
      .html(`${cell.attr("data-name")}</br>${cell.attr("data-category")}</br>${cell.attr("data-value")}`)
      .style("position", "absolute")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px");
    cell
      .style("stroke", "black")
  };

  const mouseOut = function (d) {
    Tooltip
      .style("opacity", 0);
    d3.select(this)
      .style("stroke", "none")
  };

  leaf.append("rect")
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
    .attr("fill-opacity", 0.6)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseOut);

  leaf.append("text")
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))
    .join("tspan")
    .attr("x", 3)
    .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.0 + i * 0.9}em`)
    .text(d => d);
};
