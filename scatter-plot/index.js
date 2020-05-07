const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

d3.json(url).then(data => drawgraph(data))

function drawgraph(data) {
  const svg = d3.select("svg"),
        margin = 60,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin

  time = []
  years = []
  
  data.forEach(element => {
    time.push(+element.Time)
    years.push(+element.Year)
  });

  const xScale = d3.scaleTime()
    .domain([d3.min(years), d3.max(years)])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([d3.min(time), d3.max(time)])
    .range([height, 0]);

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
}