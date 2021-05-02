window.IPCT.horizontalBarChart = function ({
    plotDataSet,
    svgHeight,
    svgWidth,
    margins,
    plotHeight,
    plotWidth,
    svg,
    colorScale
}) {
    const plotData = plotDataSet.data
    const yDomain = plotDataSet.yDomain
    let xMax = 0
    plotData.forEach((d) => {
        d.forEach((innerd) => {
            if (innerd > xMax) {
                xMax = innerd
            }
        })
    })
    const xScale = d3.scaleLinear()
        .domain([0, xMax])
        .range([0, svgWidth - margins.right - margins.left])
    const yScale = d3.scaleBand()
        .domain(yDomain)
        .range([svgHeight - margins.top - margins.bottom, 0])

    svg.append("g")
        .call(d3.axisLeft().scale(yScale))
        .attr("transform", `translate(${margins.left},${margins.top})`)

    const plotGroup = svg.append("g")
        .attr("transform", `translate(${margins.left},${margins.top})`)

    const rectHeight = plotHeight / (plotData.length * plotData[0].length) * 0.75
    const animationDuration = 1000
    const maxAnimationDelay = 1000

    plotData.forEach((data, index) => {
        plotGroup.selectAll(`.rect${index}`)
            .data(data)
            .join(
                (enter) => {
                    enter.append("rect")
                        .attr("width", (d) => {
                            return 0
                        })
                        .attr("height", rectHeight)
                        .attr("x", (d, i) => {
                            return xScale(0)
                        })
                        .attr("y", (d, i) => {
                            return yScale(yDomain[index]) + i * rectHeight + plotHeight / plotData.length * 0.125
                        })
                        .attr("fill", (d, i) => {
                            return colorScale[i]
                        })
                        .transition()
                        .delay(() => {
                            return Math.random() * maxAnimationDelay
                        })
                        .duration(animationDuration)
                        .attr("width", (d) => {
                            return xScale(d)
                        })
                    enter.append("text")
                        .text((d) => {
                            return Number.parseFloat(d).toPrecision(2)
                        })
                        .attr("x", (d, i) => {
                            return (xScale(0) + xScale(d)) / 2
                        })
                        .attr("y", (d, i) => {
                            return yScale(yDomain[index]) + i * rectHeight + plotHeight / plotData.length * 0.125 + rectHeight / 2
                        })
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .attr("opacity", 0)
                        .transition()
                        .delay(animationDuration + maxAnimationDelay - 200)
                        .duration(animationDuration / 2)
                        .attr("opacity", 1)
                }
            )
    })
}