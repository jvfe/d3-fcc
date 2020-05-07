const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

d3.json(url).then(data => drawgraph(data));

function drawgraph(data) {
  const svg = d3.select("svg"),
    margin = 60,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;

  data.forEach(element => {
    let time_split = (element.Time.split(':'))
    element.Time = new Date(1970, 0, 1, 0, time_split[0], time_split[1])
  });

  const xScale = d3.scaleLinear()
    .domain([d3.min(data, (d) => d.Year - 1),
    d3.max(data, (d) => d.Year + 1)])
    .range([0, width]);


  const yScale = d3.scaleTime()
    .domain(d3.extent(data, (d) => d.Time))
    .range([0, height]);

  const color = d3.scaleOrdinal(d3.schemeSet2);

  const onlyMinutes = d3.timeFormat("%M:%S");

  const dots = svg.append("g")
    .attr('transform', 'translate(40, 35)');

  axes = svg.append("g")
    .attr('transform', 'translate(40, 35)');

  const Tooltip = d3.select("#scatterChart")
    .append("div")
    .style("opacity", 0)
    .attr("id", "tooltip")
    .style("background-color", "#ffe876")
    .style("border", "solid")
    .style("border-width", "0px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  const mouseOver = function (d) {
    Tooltip
      .style("opacity", 1)
      .style("box-shadow", "1px 1px 10px");
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1);
  };
  const mouseMove = function (d, i) {
    Tooltip
      .attr("data-year", d.Year)
      .html(`${d.Name}: ${d.Nationality}<br/>Year: ${d.Year}, Time: ${onlyMinutes(d.Time)}${d.Doping ? "<br/><br/>" + d.Doping : ""}`)
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

  dots.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 7)
    .attr("cy", (d) => yScale(d.Time))
    .attr("cx", (d) => xScale(d.Year))
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Time)
    .attr("opacity", 0.5)
    .attr("stroke", "black")
    .attr("fill", (d) => color(d.Doping != ""))
    .on("mouseover", mouseOver)
    .on("mousemove", mouseMove)
    .on("mouseleave", mouseOut);

  axes.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)
      .tickFormat(d3.format("d")));

  axes.append("g")
    .attr("id", "y-axis")
    // .style("font-size", "9px")
    .call(d3.axisLeft(yScale)
      .ticks(10)
      .tickFormat((d) => onlyMinutes(d)));
  
  legend = svg.append('g').selectAll("#legend")
    .data(color.domain())
    .enter().append("g")
    .attr("id", "legend")
    .attr("transform", (d, i) => `translate(0, ${height / 3 - i * 30})`)

  legend.append("ellipse")
    .attr("cx", width - 10)
    .attr("ry", 5)
    .attr("rx", 10)
    .attr("cy", 10)
    .attr("stroke", "black")
    .style("fill", color);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text((d) => (d) ? "Doping allegations" : "No doping allegations")
}