window.IPCT.divergingStackedBarChart = function ({
    plotDataSet,
    svgHeight,
    svgWidth,
    margins,
    plotHeight,
    plotWidth,
    svg
}) {
    const plotData = plotDataSet.data
    const yLabels = plotDataSet.yLabels
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
    const animationDuration = 1000
    const maxAnimationDelay = 1000

    plotGroup.selectAll(".rect")
        .data(plotData)
        .join(
            (enter) => {
                enter.append("rect")
                    .attr("width", 0)
                    .attr("x", xScale(0))
                    .attr("y", (d, i) => {
                        return yScale(yLabels[i])
                    })
                    .attr("height", rectHeight)
                    .attr("fill", colorScale[0])
                    .transition()
                    .delay(() => {
                        return Math.random() * maxAnimationDelay
                    })
                    .duration(animationDuration)
                    .attr("x", (d) => {
                        return xScale(d[0] * -1)
                    })
                    .attr("width", (d) => {
                        return xScale(0) - xScale(d[0] * -1)
                    })
                enter.append("rect")
                    .attr("x", (d) => {
                        return xScale(0)
                    })
                    .attr("y", (d, i) => {
                        return yScale(yLabels[i])
                    })
                    .attr("height", rectHeight)
                    .attr("width", (d) => {
                        return 0
                    })
                    .attr("fill", colorScale[1])
                    .transition()
                    .delay(() => {
                        return Math.random() * maxAnimationDelay
                    })
                    .duration(animationDuration)
                    .attr("x", (d) => {
                        return xScale(0)
                    })
                    .attr("width", (d) => {
                        return xScale(d[1]) - xScale(0)
                    })
                enter.append("rect")
                    .attr("x", (d) => {
                        return xScale(0)
                    })
                    .attr("y", (d, i) => {
                        return yScale(yLabels[i])
                    })
                    .attr("height", rectHeight)
                    .attr("width", (d) => {
                        return 0
                    })
                    .attr("fill", colorScale[2])
                    .transition()
                    .delay(() => {
                        return Math.random() * maxAnimationDelay
                    })
                    .duration(animationDuration)
                    .attr("x", (d) => {
                        return xScale(d[1])
                    })
                    .attr("width", (d) => {
                        return xScale(d[2] + d[1]) - xScale(d[1])
                    })
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
                    .attr("opacity", 0)
                    .transition()
                    .delay(animationDuration + maxAnimationDelay - 200)
                    .duration(animationDuration / 2)
                    .attr("opacity", 1)
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
                    .attr("opacity", 0)
                    .transition()
                    .delay(animationDuration + maxAnimationDelay - 200)
                    .duration(animationDuration / 2)
                    .attr("opacity", 1)
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
                    .attr("opacity", 0)
                    .transition()
                    .delay(animationDuration + maxAnimationDelay - 200)
                    .duration(animationDuration / 2)
                    .attr("opacity", 1)
            }

        )
    plotGroup.append("line")
        .attr("x1", xScale(0))
        .attr("y1", 0)
        .attr("x2", xScale(0))
        .attr("y2", plotHeight)
        .attr("stroke", "black")
}