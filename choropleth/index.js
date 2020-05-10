// Some base function from https://observablehq.com/@d3/choropleth

files = ["https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json",
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"];

Promise.all(files.map(url => d3.json(url))).then((values) => drawgraph(values));

function drawgraph(values) {
  const US = values[0],
    edu = values[1]

  const color = d3.scaleQuantize()
    .domain(d3.extent(edu, (d) => d.bachelorsOrHigher))
    .range(d3.schemePurples[9])

  // const colorsReversed = color.range().reverse()

  const legendWidth = 300,
    legendHeight = 30,
    legendRectWidth = legendWidth / color.ticks().length;

  const legend = d3.select("#choro").append('svg')
    .join("g")
    .attr("id", "legend")
    .attr("width", legendWidth)
    .attr("height", legendHeight);

  legend.selectAll('rect')
    .data(color.ticks())
    .join('rect')
    .attr('class', 'legend-item')
    .style('stroke', 'black')
    .attr('x', (d, i) => i * 40)
    .attr('width', legendRectWidth)
    .attr('height', 20)
    .attr('rx', 4)
    .attr('ry', 4)
    .style('fill', d => color(d))

  legend.selectAll('text')
    .data(color.ticks())
    .join('text')
    .attr('x', (_, i) => i * 40 + 10)
    .attr('y', 14)
    // .attr('fill', (_,i) => colorsReversed[i])
    .attr('fill', (_, i) => ((i > 3) ? 'white' : 'black'))
    // .attr("stroke", "black")
    // .attr("stroke-weight", 0.001)
    .style('font-weight', 'bold')
    .style('font-size', '12px')
    .text(d => d + "%");

  path = d3.geoPath()

  const svg = d3.select("#choro")
    .append("svg")
    .attr("viewBox", [0, 0, 975, 610]);

  svg.append("g")
    .attr("transform", "translate(610,20)")

  const Tooltip = d3.select("#choro")
    .append("div")
    .style("opacity", 0)
    .attr("id", "tooltip")
    .style("border", "solid")
    .style("border-width", "0px")
    .style("border-radius", "5px")
    .style("text-align", "center")
    .style("padding", "5px");

  const mouseOver = function (d) {
    county = d3.select(this)
    Tooltip
      .attr("data-education", county.attr("data-education"))
      .style("background-color", county.attr("fill"))
      .style("opacity", 0.8)
      .style("box-shadow", "1px 1px 10px")
      .html(`${county.attr("area-name")}</br>${county.attr("data-education")}%`)
      .style("position", "absolute")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px");
    county
      .style("stroke", "black")
      .style("opacity", 1);
  };

  const mouseOut = function (d) {
    Tooltip
      .style("opacity", 0);
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8);
  };

  svg.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(US, US.objects.counties).features)
    .join("path")
    .attr("class", "county")
    .attr("data-fips", function (d) {
      return d.id
    })
    .attr("data-education", (d) => {
      same = edu.filter((obj) => obj.fips == d.id);
      return (same[0] ? same[0].bachelorsOrHigher : 0)
    })
    .attr("area-name", (d) => {
      same = edu.filter((obj) => obj.fips == d.id);
      return (same[0] ? same[0].area_name : 0)
    })
    .attr("fill", (d) => {
      same = edu.filter((obj) => obj.fips == d.id);
      return (same[0] ? color(same[0].bachelorsOrHigher) : color(0))
    })
    .attr("d", path)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseOut);


  svg.append("path")
    .datum(topojson.mesh(US, US.objects.states, (a, b) => a !== b))
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr("d", path);
};
