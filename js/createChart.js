window.IPCT = window.IPCT || {}
window.IPCT.createChart = function ({
    title,
    subtitle,
    questionText,
    plotType,
    plotDataSet,
    legendArray
}) {
    console.log(plotDataSet)
    const svgHeight = 640
    const svgWidth = 800
    let margins
    if (plotType === "lineChart") {
        margins = { top: 30, bottom: 190, left: 50, right: 30 }
    } else if (plotType === "divergingStackedBarChart") {
        margins = { top: 50, bottom: 50, left: 250, right: 30 }
    }

    const plotHeight = svgHeight - margins.top - margins.bottom
    const plotWidth = svgWidth - margins.left - margins.right
    const colorScale = d3.scaleOrdinal(d3.schemePaired)

    const svg = d3.select("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)

    svg.append("text")
        .text(title)
        .attr("x", svgWidth / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("font-size", 25)

    if (subtitle) {
        svg.append("text")
            .text(subtitle)
            .attr("x", svgWidth / 2)
            .attr("y", 40)
            .attr("text-anchor", "middle")
            .attr("font-size", 15)
    }

    svg.append("text")
        .text(questionText)
        .attr("x", 10)
        .attr("y", svgHeight - 10)
        .attr("font-size", 10)

    if (legendArray) {
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
                return d
                // `${d} ${Number.parseFloat(plotData[i][0]).toPrecision(3)} -> ${Number.parseFloat(plotData[i][textDomain.length - 1]).toPrecision(3)}`
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
    }

    if (plotType === "lineChart") {

        window.IPCT.lineChart({
            plotDataSet,
            svgHeight,
            svgWidth,
            margins,
            plotHeight,
            plotWidth,
            svg,
            colorScale
        })
    } else if (plotType === "divergingStackedBarChart") {
        window.IPCT.divergingStackedBarChart({
            plotDataSet,
            svgHeight,
            svgWidth,
            margins,
            plotHeight,
            plotWidth,
            svg
        })
    }
}
