const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(url).then(data => drawgraph(data));

function drawgraph(data) {
  const margin = { top: 30, right: 30, bottom: 30, left: 65 },
    width = 1200,
    innerWidth = width - margin.left - margin.right,
    height = 450,
    innerHeight = height - margin.top - margin.bottom;

  const accessor = data.monthlyVariance,
    reference = data.baseTemperature,
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  accessor.forEach(point => {
    point.temp = Math.round((reference + point.variance) * 10) / 10
    point.month = months[point.month - 1]
  });

  const monthInt = d3.timeParse("%B");

  const decades = Array.from(new Set(accessor.map((y) => y.year - (y.year % 10))))
  decades.shift()

  const svg = d3.select("#heatMap")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform",
      `translate(${margin.left},${margin.top})`);

  const yScale = d3.scaleBand()
    .domain(months)
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
    .select(".domain").remove();

  axes.append("g")
    .attr("id", "y-axis")
    .call(d3.axisLeft(yScale))
    .select(".domain").remove()

  const Tooltip = d3.select("#heatMap")
    .append("div")
    .style("opacity", 0)
    .attr("id", "tooltip")
    .style("border", "solid")
    .style("border-width", "0px")
    .style("border-radius", "5px")
    .style("text-align", "center")
    .style("padding", "5px");

  const mouseOver = function (d) {
    Tooltip
      .style("opacity", 1)
      .style("box-shadow", "1px 1px 10px")
      .style("background-color", d3.select(this).attr('fill'));
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1);
  };
  const mouseMove = function (d, i) {
    Tooltip
      .attr("data-year", d.year)
      .html(`${d.month}, ${d.year}</br>${d.temp}ºC`)
      .style("position", "absolute")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px");
  };
  const mouseOut = function (d) {
    Tooltip
      .style("opacity", 0);
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8);
  };

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
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => d.temp)
    .attr("data-month", (d) => monthInt(d.month).getMonth())
    .attr("fill", (d) => colors(d.temp))
    .style("stroke-width", 2)
    .style("stroke", "none")
    .on("mouseover", mouseOver)
    .on("mousemove", mouseMove)
    .on("mouseleave", mouseOut);

  const legendWidth = 150,
    legendHeight = 50,
    legendRectWidth = legendWidth / colors.ticks().length;

  const legend = d3.select('body')
    .append('svg')
    .attr('id', 'legend')
    .attr('width', legendWidth)
    .attr('height', legendHeight);

  legend.selectAll('rect')
    .data(colors.ticks().reverse())
    .join('rect')
    .attr('x', (d, i) => i * legendRectWidth)
    .attr('y', 0)
    .attr("rx", 4)
    .attr("ry", 4)
    .attr('width', legendRectWidth)
    .attr('height', legendHeight-30)
    .attr('fill', (col) => colors(col))
};
