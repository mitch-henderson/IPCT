window.IPCT.hundredPercentStackedBarChart = function ({
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

    const xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, svgWidth - margins.right - margins.left])
    const yScale = d3.scaleBand()
        .domain(yDomain)
        .range([svgHeight - margins.top - margins.bottom, 0])

    svg.append("g")
        .call(d3.axisLeft().scale(yScale))
        .attr("transform", `translate(${margins.left},${margins.top})`)

    const plotGroup = svg.append("g")
        .attr("transform", `translate(${margins.left},${margins.top})`)

    const rectHeight = plotHeight / plotData.length * 0.75
    const animationDuration = 1000
    const maxAnimationDelay = 1000

    plotData.forEach((data, index) => {
        plotGroup.selectAll(`.rect${index}`)
            .data(data)
            .join(
                (enter) => {
                    enter.append("rect")
                        .attr("width", (d) => {
                            return xScale(d)
                        })
                        .attr("height", rectHeight)
                        .attr("x", (d, i) => {
                            let sum = 0
                            for (let j = 0; j < i; j++) {
                                sum += data[j]
                            }
                            return xScale(sum)
                        })
                        .attr("y", yScale(yDomain[index]) + plotHeight / plotData.length / 2 - rectHeight / 2)
                        .attr("fill", (d, i) => {
                            return colorScale[i]
                        })
                    enter.append("text")
                        .text((d) => {
                            return `${Number.parseFloat(d).toPrecision(2)}%`
                        })
                        .attr("x", (d, i) => {
                            let sum = 0
                            for (let j = 0; j < i; j++) {
                                sum += data[j]
                            }
                            return (xScale(sum) + xScale(sum + d)) / 2
                        })
                        .attr("y", yScale(yDomain[index]) + plotHeight / plotData.length / 2)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                }
            )
    })
}