const svgHeight = 500
const svgWidth = 800 //fits on mobile because of "double" pixels
const margins = { top: 30, bottom: 50, left: 300, right: 30 }
const plotHeight = svgHeight - margins.top - margins.bottom
const plotWidth = svgWidth - margins.left - margins.right

const svg = d3.select("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

svg.append("text")
    .text("Estimated Time for Business to Get Back on Track")
    .attr("x", svgWidth / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("font-size", 25)

svg.append("text")
    .text("Q157. Roughly, how long do you think it will take from today, for your business to get back on track?")
    .attr("x", 10)
    .attr("y", svgHeight - 10)
    .attr("font-size", 10)

function countData(d, plotData, index, key) {
    const responseData = d[key]
    if (responseData === "1") {
        plotData[index][0] += 1
    } else if (responseData === "2") {
        plotData[index][1] += 1
    } else if (responseData === "3") {
        plotData[index][2] += 1
    }
}

d3.csv("../data/Wave_5.csv").then((data) => {
    let plotData = new Array(16).fill(0).map(() => { return [0, 0, 0] })
    data.forEach((d) => {
        countData(d, plotData, 0, "Q156Br1")
        countData(d, plotData, 1, "Q156Br2")
        countData(d, plotData, 2, "Q156Br3")
        countData(d, plotData, 3, "Q156Br4")
        countData(d, plotData, 4, "Q156Br5")
        countData(d, plotData, 5, "Q156Br6")
        countData(d, plotData, 6, "Q156Br7")
        countData(d, plotData, 7, "Q156Br8")
        countData(d, plotData, 8, "Q156Br9")
        countData(d, plotData, 9, "Q156Br10")
        countData(d, plotData, 10, "Q156Br11")
        countData(d, plotData, 11, "Q156Br12")
        countData(d, plotData, 12, "Q156Br13")
        countData(d, plotData, 13, "Q156Br14")
        countData(d, plotData, 14, "Q156Br15")
        countData(d, plotData, 15, "Q156Br16")

    })
    plotData = plotData.map((d) => {
        const total = d[0] + d[1] + d[2]
        return [d[0] / total * 100, d[1] / total * 100, d[2] / total * 100]
    })
    console.log(plotData)

    const yLabels = [
        "3D printing/Additive manufacturing",
        "APIs (application programming interface)",
        "Artificial Intelligence/Predictive data analytics",
        "Augmented/Virtual reality",
        "Automation/Digitization/Internet of things (IoT)",
        "Blockchain technology",
        "Cloud services/computing",
        "Drones",
        "Integration of smart, connected machines and manufacturing assets with the wider enterprise",
        "Infrared Fever Warning Systems",
        "On-the-job required mobile devices/Wearables – The connected worker",
        "Robots",
        "Social Media Monitoring",
        "Video Chat/Conferencing Software",
        "Video Surveillance",
        "Wireless sensors"
    ]
    const xMin = Math.max(-100, -5 + Math.min(...plotData.map((d) => {
        return d[0] * -1
    })))
    const xMax = Math.min(100, 5 + Math.max(...plotData.map((d) => {
        return d[1] + d[2]
    })))

    const xScale = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([0, svgWidth - margins.right - margins.left])
    const yScale = d3.scaleBand()
        .domain(yLabels)
        .range([svgHeight - margins.top - margins.bottom, 0])
    svg.append("g")
        .call(d3.axisBottom().scale(xScale))
        .attr("transform", `translate(${margins.left},${margins.top + plotHeight})`)

    svg.append("g")
        .call(d3.axisLeft().scale(yScale))
        .attr("transform", `translate(${margins.left},${margins.top})`)

    const plotGroup = svg.append("g")
        .attr("transform", `translate(${margins.left},${margins.top})`)


    const colorScale = ["#FF5B57", "#51E4EB", "#C2FB56"]

    const rectHeight = plotHeight / plotData.length - 5

    plotGroup.selectAll(".rect")
        .data(plotData)
        .join(
            (enter) => {
                enter.append("rect")
                    .attr("x", (d) => {
                        return xScale(d[0] * -1)
                    })
                    .attr("y", (d, i) => {
                        return yScale(yLabels[i])
                    })
                    .attr("height", rectHeight)
                    .attr("width", (d) => {
                        return xScale(0) - xScale(d[0] * -1)
                    })
                    .attr("fill", colorScale[0])
                enter.append("rect")
                    .attr("x", (d) => {
                        return xScale(0)
                    })
                    .attr("y", (d, i) => {
                        return yScale(yLabels[i])
                    })
                    .attr("height", rectHeight)
                    .attr("width", (d) => {
                        return xScale(d[1]) - xScale(0)
                    })
                    .attr("fill", colorScale[1])
                enter.append("rect")
                    .attr("x", (d) => {
                        return xScale(d[1])
                    })
                    .attr("y", (d, i) => {
                        return yScale(yLabels[i])
                    })
                    .attr("height", rectHeight)
                    .attr("width", (d) => {
                        return xScale(d[2] + d[1]) - xScale(d[1])
                    })
                    .attr("fill", colorScale[2])
                enter.append("text")
                    .text((d) => {
                        return Number.parseFloat(d[0]).toPrecision(2) + "%"
                    })
                    .attr("x", (d) => {
                        return (xScale(0) + xScale(d[0] * -1)) / 2
                    })
                    .attr("y", (d, i) => {
                        return yScale(yLabels[i]) + 15
                    })
                    .attr("text-anchor", "middle")
                    .attr("font-size", 10)
                enter.append("text")
                    .text((d) => {
                        return Number.parseFloat(d[1]).toPrecision(2) + "%"
                    })
                    .attr("x", (d) => {
                        return (xScale(0) + xScale(d[1])) / 2
                    })
                    .attr("y", (d, i) => {
                        return yScale(yLabels[i]) + 15
                    })
                    .attr("text-anchor", "middle")
                    .attr("font-size", 10)
                enter.append("text")
                    .text((d) => {
                        return Number.parseFloat(d[2]).toPrecision(2) + "%"
                    })
                    .attr("x", (d) => {
                        return (xScale(d[1]) + xScale(d[1] + d[2])) / 2
                    })
                    .attr("y", (d, i) => {
                        return yScale(yLabels[i]) + 15
                    })
                    .attr("text-anchor", "middle")
                    .attr("font-size", 10)
            }

        )
    plotGroup.append("line")
        .attr("x1", xScale(0))
        .attr("y1", 0)
        .attr("x2", xScale(0))
        .attr("y2", plotHeight)
        .attr("stroke", "black")
})