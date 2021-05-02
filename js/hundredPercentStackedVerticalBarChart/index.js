window.IPCT.hundredPercentStackedVerticalBarChart = function ({
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
    const xDomain = plotDataSet.xDomain

    const xScale = d3.scaleBand()
        .domain(xDomain)
        .range([0, svgWidth - margins.right - margins.left])
    const yScale = d3.scaleLinear()
        .domain([100, 0])
        .range([svgHeight - margins.top - margins.bottom, 0])
    svg.append("g")
        .call(d3.axisBottom().scale(xScale))
        .attr("transform", `translate(${margins.left},${margins.top + plotHeight})`)

    const plotGroup = svg.append("g")
        .attr("transform", `translate(${margins.left},${margins.top})`)

    const rectWidth = plotWidth / plotData.length * 0.75
    const animationDuration = 1000
    const maxAnimationDelay = 1000

    plotData.forEach((data, index) => {
        plotGroup.selectAll(`.rect${index}`)
            .data(data)
            .join(
                (enter) => {
                    enter.append("rect")
                        .attr("height", (d) => {
                            return yScale(d)
                        })
                        .attr("width", rectWidth)
                        .attr("y", (d, i) => {
                            let sum = 0
                            for (let j = 0; j < i; j++) {
                                sum += data[j]
                            }
                            return yScale(sum)
                        })
                        .attr("x", xScale(xDomain[index]) + plotWidth / plotData.length / 2 - rectWidth / 2)
                        .attr("fill", (d, i) => {
                            return colorScale[i]
                        })
                    enter.append("text")
                        .text((d) => {
                            return `${Number.parseFloat(d).toPrecision(2)}%`
                        })
                        .attr("y", (d, i) => {
                            let sum = 0
                            for (let j = 0; j < i; j++) {
                                sum += data[j]
                            }
                            return (yScale(sum) + yScale(sum + d)) / 2
                        })
                        .attr("x", xScale(xDomain[index]) + plotWidth / plotData.length / 2)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                }
            )
    })
}