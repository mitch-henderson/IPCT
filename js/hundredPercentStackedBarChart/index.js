window.IPCT.hundredPercentStackedBarChart = function ({
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

    const xScale = d3.scaleLinear()
        .domain([0, 100])
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
                        .attr("y", index * rectHeight)
                        .attr("fill", (d, i) => {
                            return colorScale[i]
                        })
                }
            )
    })
}