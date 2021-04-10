
const svgHeight = 640
const svgWidth = 800
const margins = { top: 30, bottom: 190, left: 50, right: 30 }
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

const questionsToPlot = [
  window.IPCT.questions.Q1,
  window.IPCT.questions.Q2,
  window.IPCT.questions.Q3,
  window.IPCT.questions.Q4,
  window.IPCT.questions.Q7,
  window.IPCT.questions.Q8,
  window.IPCT.questions.Q12,
  window.IPCT.questions.Q10,
  window.IPCT.questions.Q13,
  window.IPCT.questions.Q14
]

Promise.all([
  d3.csv("../data/Wave_3.csv"),
  d3.csv("../data/Wave_4.csv"),
  d3.csv("../data/Wave_5.csv")
]).then((datas) => {
  datas[0].name = "Wave_3"
  datas[1].name = "Wave_4"
  datas[2].name = "Wave_5"
  const plotData = []

  for (let i = 0; i < questionsToPlot.length; i++) {
    plotData.push([])
  }

  let textDomain = []
  datas.forEach((d, index) => {


    const countArray = new Array(questionsToPlot.length).fill(0)
    const sumArray = new Array(questionsToPlot.length).fill(0)
    const averageArray = new Array(questionsToPlot.length).fill(0)
    d.forEach((innerd) => {
      questionsToPlot.forEach((question) => {
        const questionSet = window.IPCT.waveQuestionSetMap[d.name]
        const questionIndex = questionSet.indexOf(question)
        if (questionIndex > -1) {
          countData(countArray, sumArray, questionIndex, innerd[`Q100r${questionIndex + 1}`])
        }

      })

      if (!textDomain[index] || (textDomain[index] < new Date(innerd.date))) {
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
  textDomain = textDomain.map((d) => {
    return d.toLocaleDateString()
  })

  const legendArray = window.IPCT.questionSets.questionSet1

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

  const legendGroup = svg.append("g")
    .attr("transform", `translate(${margins.left},${margins.top + plotHeight + 50})`)
  legendGroup.selectAll(".legend")
    .data(legendArray)
    .enter()
    .append("text")
    .attr("x", (d, i) => {
      if ((i / 6) < 1) { return 10 }
      else { return plotWidth / 2 + 10 }
    })
    .attr("y", (d, i) => {
      return (i % 6) * 20
    })
    .text((d, i) => {
      //return `${d} ${Number.parseFloat(plotData[i][0]).toPrecision(3)} -> ${Number.parseFloat(plotData[i][textDomain.length - 1]).toPrecision(3)}`
      //fix legend . import new dataset
    })
    .attr("font-size", 10)
  legendGroup.selectAll(".legend-circle")
    .data(legendArray)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", (d, i) => {
      if ((i / 6) < 1) { return 0 }
      else { return plotWidth / 2 }
    })
    .attr("cy", (d, i) => {
      return (i % 6) * 20 - 3
    })
    .attr("fill", (d, i) => {
      return colorScale(i)
    })

  const dataPointGroup = svg.append("g")
    .attr("transform", `translate(${margins.left + plotWidth / (textDomain.length * 2)},${margins.top})`)


  plotData.forEach((data, index) => {
    dataPointGroup.selectAll(`.data-point-${index}`)
      .data(data)
      .enter()
      .append("circle")
      .attr("r", (d) => { return d ? 5 : 0 })
      .attr("cx", (d, i) => { return xScale(textDomain[i]) })
      .attr("cy", (d) => { return yScale(d) })
      .attr("fill", colorScale(index))
    dataPointGroup.selectAll(`.line-${index}`)
      .data(data)
      .enter()
      .append("line")
      .attr("stroke", colorScale(index))
      .attr("x1", (d, i) => {
        if (i === 0 || !data[i - 1] || !data[i]) {
          return 0
        } else {
          return xScale(textDomain[i - 1])
        }
      })
      .attr("y1", (d, i) => {
        if (i === 0 || !data[i - 1] || !data[i]) {
          return 0
        } else {
          return yScale(data[i - 1])
        }
      })
      .attr("x2", (d, i) => {
        if (i === 0 || !data[i - 1] || !data[i]) {
          return 0
        } else {
          return xScale(textDomain[i])
        }
      })
      .attr("y2", (d, i) => {
        if (i === 0 || !data[i - 1] || !data[i]) {
          return 0
        } else {
          return yScale(data[i])
        }
      })
  })
});