
const svgHeight = 500
const svgWidth = 800
const margins = { top: 30, bottom: 50, left: 50, right: 30 }
const plotHeight = svgHeight - margins.top - margins.bottom
const plotWidth = svgWidth - margins.left - margins.right

const svg = d3.select("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

svg.append("text")
  .text("Title...")
  .attr("x", svgWidth / 2)
  .attr("y", 20)
  .attr("text-anchor", "middle")
  .attr("font-size", 25)

svg.append("text")
  .text("Q100. ...")
  .attr("x", 10)
  .attr("y", svgHeight - 10)
  .attr("font-size", 10)

function countData(countArray, sumArray, index, data) {
  const answer = Number(data)

  if (answer < 11 && answer > 0) {
    countArray[index] += 1
    sumArray[index] += answer
  }
}

Promise.all([
  d3.csv("../data/Wave_3.csv"),
  d3.csv("../data/Wave_4.csv"),
  d3.csv("../data/Wave_5.csv")
]).then((datas) => {
  const plotData = [
    [], [], [], [], [], [], [], [], [], [], [], []
  ]
  let textDomain = []
  datas.forEach((d, index) => {

    
    const countArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const sumArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const averageArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    d.forEach((innerd) => {
      countData(countArray, sumArray, 0, innerd["Q100r1"])
      countData(countArray, sumArray, 1, innerd["Q100r2"])
      countData(countArray, sumArray, 2, innerd["Q100r3"])
      countData(countArray, sumArray, 3, innerd["Q100r4"])
      countData(countArray, sumArray, 4, innerd["Q100r5"])
      countData(countArray, sumArray, 5, innerd["Q100r6"])
      countData(countArray, sumArray, 6, innerd["Q100r7"])
      countData(countArray, sumArray, 7, innerd["Q100r8"])
      countData(countArray, sumArray, 8, innerd["Q100r9"])
      countData(countArray, sumArray, 9, innerd["Q100r10"])
      countData(countArray, sumArray, 10, innerd["Q100r11"])
      countData(countArray, sumArray, 11, innerd["Q100r12"])

      if (!textDomain[index] || (textDomain[index] < new Date(innerd.date))){
        textDomain[index] = new Date(innerd.date)
      }

    })

    countArray.forEach((countEntry, index) => {
      if (countEntry === 0) {
        averageArray[index] = null
      } else {
        averageArray[index] = sumArray[index] / countEntry
      }

    })

    averageArray.forEach((average, index) => {
      plotData[index].push(average)
    })


    console.log(averageArray)
  })
textDomain = textDomain.map((d)=>{
  return d.toLocaleDateString()
})

  console.log(plotData)
  console.log(textDomain)
  
const colorScale = d3.scaleOrdinal(d3.schemePaired)

  const xScale = d3.scaleBand()
  .domain(textDomain)
  .range([0, svgWidth - margins.right - margins.left])
const yScale = d3.scaleLinear()
  .domain([0, 10])
  .range([svgHeight - margins.top - margins.bottom, 0])
svg.append("g")
  .call(d3.axisBottom().scale(xScale))
  .attr("transform", `translate(${margins.left},${margins.top + plotHeight})`)

svg.append("g")
  .call(d3.axisLeft().scale(yScale))
  .attr("transform", `translate(${margins.left},${margins.top})`)

const dataPointGroup = svg.append("g")
.attr("transform", `translate(${margins.left},${margins.top})`)


plotData.forEach((data, index)=>{
  dataPointGroup.selectAll(`.data-point-${index}`)
  .data(data)
  .enter()
  .append("circle")
  .attr("r",(d)=>{return d ? 5 : 0})
  .attr("cx", (d,i)=>{return xScale(textDomain[i])})
  .attr("cy", (d)=>{return yScale(d)})
  .attr("fill", colorScale(index))
  dataPointGroup.selectAll(`.line-${index}`)
  .data(data)
  .enter()
  .append("line")
  .attr("stroke", colorScale(index))
  .attr("x1", (d,i)=>{
    if (i === 0 || !data[i-1] || !data[i]){
      return 0
    } else {
      return xScale(textDomain[i-1])
    }
  })
  .attr("y1", (d,i)=>{
    if (i === 0 || !data[i-1] || !data[i]){
      return 0
    } else {
      return yScale(data[i-1])
    }
  })
  .attr("x2", (d,i)=>{
    if (i === 0 || !data[i-1] || !data[i]){
      return 0
    } else {
      return xScale(textDomain[i])
    }
  })
  .attr("y2", (d,i)=>{
    if (i === 0 || !data[i-1] || !data[i]){
      return 0
    } else {
      return yScale(data[i])
    }
  })
})

  console.log(data);
  color.domain(d3.keys(data[0]).filter(function (key) {
    return key !== "date";
  }));

  data.forEach(function (d) {
    d.date = parseDate(d.date);
  });

  var cities = color.domain().map(function (name) {
    return {
      name: name,
      values: data.map(function (d) {
        return {
          date: d.date,
          temperature: +d[name]
        };
      })
    };
  });

  x.domain(d3.extent(data, function (d) {
    return d.date;
  }));

  y.domain([
    d3.min(cities, function (c) {
      return d3.min(c.values, function (v) {
        return v.temperature;
      });
    }),
    d3.max(cities, function (c) {
      return d3.max(c.values, function (v) {
        return v.temperature;
      });
    })
  ]);

  var title = svg.append("text")
    //.text("Areas of Concern - Mean Rating (1-10 Scale)")
    .attr('x', margin.left) //want it to be centered
    .attr('y', -(margin.top) / 2) //moved it to top
    .style("font", "40px sans-serif")


  var legend = svg.selectAll('g') //creating the legend
    .data(cities)
    .enter()
    .append('g')
    .attr('class', 'legend');

  legend.append('rect') //adding a rectangle
    .attr('x', margin.left) //changing from -20 to margin.left
    .attr('y', function (d, i) {
      return i * 20 + 500; //went to adding 500
    })
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', function (d) { //filling in colors here
      return color(d.name);
    });

  legend.append('text') //text 
    .attr('x', margin.left + 12) //moving text to left hand side as well +12
    .attr('y', function (d, i) {
      return (i * 20) + 509;  //went from 9 to 500
    })
    .text(function (d) {
      return d.name;
    });

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Mean Rating (0-10 scale)");

  var city = svg.selectAll(".city")
    .data(cities)
    .enter().append("g")
    .attr("class", "city");

  city.append("path")
    .attr("class", "line")
    .attr("d", function (d) {
      return line(d.values);
    })
    .style("stroke", function (d) {
      return color(d.name);
    });

  var mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");

  mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  var lines = document.getElementsByClassName('line');

  var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(cities)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

  mousePerLine.append("circle")
    .attr("r", 7)
    .style("stroke", function (d) {
      return color(d.name);
    })
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  mousePerLine.append("text")
    .attr("transform", "translate(10,3)");

  mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', width) // can't catch mouse events on a g element
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function () { // on mouse out hide line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "0");
    })
    .on('mouseover', function () { // on mouse in show line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "1");
    })
    .on('mousemove', function () { // mouse moving over canvas
      var mouse = d3.mouse(this);
      d3.select(".mouse-line")
        .attr("d", function () {
          var d = "M" + mouse[0] + "," + height;
          d += " " + mouse[0] + "," + 0;
          return d;
        });

      d3.selectAll(".mouse-per-line")
        .attr("transform", function (d, i) {
          console.log(width / mouse[0])
          var xDate = x.invert(mouse[0]),
            bisect = d3.bisector(function (d) { return d.date; }).right;
          idx = bisect(d.values, xDate);

          var beginning = 0,
            end = lines[i].getTotalLength(),
            target = null;

          while (true) {
            target = Math.floor((beginning + end) / 2);
            pos = lines[i].getPointAtLength(target);
            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
              break;
            }
            if (pos.x > mouse[0]) end = target;
            else if (pos.x < mouse[0]) beginning = target;
            else break; //position found
          }

          d3.select(this).select('text')
            .text(y.invert(pos.y).toFixed(2));

          return "translate(" + mouse[0] + "," + pos.y + ")";
        });
    });
});