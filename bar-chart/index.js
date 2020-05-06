const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

let dataset = {
  'date': [],
  'gdp': []
};

function drawgraph() {
  const svg = d3.select("svg"),
    margin = 60,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin,
    barWidth = width / 275;


  const xScale = d3.scaleTime()
    .domain([d3.min(dataset.date), d3.max(dataset.date)])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset.gdp)])
    .range([height, 0]);

  const g = svg.append("g")
    .attr("transform", "translate(100,100)");


  axes = svg.append("g")
    .attr('transform', 'translate(40, 35)');

  axes.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  axes.append("g")
    .attr("id", "y-axis")
    .style("font-size", "9px")
    .call(d3.axisLeft(yScale).ticks(10));

  const Tooltip = d3.select("#barChart")
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
      .attr("data-date", dataset.date[i].toISOString().slice(0, 10))
      .html(dataset.date[i].toString().slice(3, 15) + "<br/>" + "$" + d + " Billion")
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

  g.selectAll(".bar")
    .data(dataset.gdp)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => xScale(dataset.date[i]))
    .attr("y", (d) => yScale(d))
    .attr("width", barWidth)
    .attr("height", (d) => height - yScale(d))
    .attr('transform', 'translate(-60, -65)')
    .attr('data-date', (d, i) => dataset.date[i].toISOString().slice(0, 10))
    .attr('data-gdp', (d, i) => d)
    .on("mouseover", mouseOver)
    .on("mousemove", mouseMove)
    .on("mouseleave", mouseOut);

};

d3.json(url).then(data => {
  data.data.forEach(element => {
    dataset.date.push(new Date(element[0]))
    dataset.gdp.push(element[1])
  });
  drawgraph()
})
