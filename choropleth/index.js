files = ["https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json",
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"];

Promise.all(files.map(url => d3.json(url))).then((values) => drawgraph(values));


function testes(data) {


};

function drawgraph(values) {
  const US = values[0],
    edu = values[1]

  const color = d3.scaleQuantize()
    .domain(d3.extent(edu, (d) => d.bachelorsOrHigher))
    .range(d3.schemePurples[9])

  path = d3.geoPath()

  const svg = d3.select("#heatMap")
    .append("svg")
    .attr("viewBox", [0, 0, 975, 610]);

  svg.append("g")
    .attr("transform", "translate(610,20)")

    const Tooltip = d3.select("#heatMap")
    .append("div")
    .style("opacity", 0)
    .attr("id", "tooltip")
    .style("background-color", "#ffe876")
    .style("border", "solid")
    .style("border-width", "0px")
    .style("border-radius", "5px")
    .style("text-align", "center")
    .style("padding", "5px");

  const mouseOver = function (d) {
    county = d3.select( this )
    Tooltip
      .attr("data-education", county.attr("data-education"))
      .style("opacity", 1)
      .style("box-shadow", "1px 1px 10px")
      .html(`${county.attr("data-education")}%`)
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
      result = edu.filter((obj) => obj.fips == d.id);
      return (result[0] ? result[0].bachelorsOrHigher : 0)
    })
    .attr("fill", (d) => {
      result = edu.filter((obj) => obj.fips == d.id);
      return (result[0] ? color(result[0].bachelorsOrHigher) : color(0))
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




  const legendWidth = 150,
    legendHeight = 50,
    legendRectWidth = legendWidth / color.ticks().length;

  const legend = d3.select('body')
    .append('svg')
    .attr('id', 'legend')
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .selectAll('rect')
    .data(color.ticks())
    .join('rect')
    .attr('x', (d, i) => i * legendRectWidth)
    .attr('y', 0)
    .attr("rx", 4)
    .attr("ry", 4)
    .attr('width', legendRectWidth)
    .attr('height', legendHeight)
    .attr('fill', (col) => color(col))
  // console.log(topojson.feature(US, US.objects.counties).features)

};
