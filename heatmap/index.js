const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(url).then(data => drawgraph(data));

function testes(data) {
  accessor = data.monthlyVariance
  console.log(Array.from(new Set(accessor.map((y) => y.year))))
};

function drawgraph(data) {
  const margin = { top: 30, right: 30, bottom: 30, left: 30 },
    width = 1200,
    innerWidth = width - margin.left - margin.right,
    height = 450,
    innerHeight = height - margin.top - margin.bottom;

  const accessor = data.monthlyVariance,
    reference = data.baseTemperature;

  accessor.forEach(point => {
    point.temp = Math.round((reference + point.variance) * 10) / 10
  });

  const decades = Array.from(new Set(accessor.map((y) => y.year - (y.year % 10))))

  const svg = d3.select("#heatMap")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform",
      `translate(${margin.left},${margin.top})`);

  const yScale = d3.scaleBand()
    .domain(d3.range(d3.max(accessor, (d) => d.month)))
    .range([0, innerHeight])
    .padding(0.01);


  const xScale = d3.scaleBand()
    .domain(Array.from(new Set(accessor.map((y) => y.year))))
    .range([0, innerWidth])
    .padding(0.01);

  const colors = d3.scaleSequential()
    .interpolator(d3.interpolateRdYlBu)
    .domain([d3.max(accessor, (d) => d.temp), d3.min(accessor, (d) => d.temp)])

  const axes = svg.append("g");

  axes.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale).tickValues(decades))
    // .tickFormat(d3.format("d")))
    .select(".domain").remove();

  axes.append("g")
    .attr("id", "y-axis")
    .call(d3.axisLeft(yScale))
    .select(".domain").remove()

  heats = svg.append("g");

  heats.selectAll("#cells")
    .data(accessor)
    .join("rect")
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.month))
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("class", "cell")
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .style("fill", (d) => colors(d.temp))
    .style("stroke-width", 4)
    .style("stroke", "none")
  // .style("opacity", 0.8)
};