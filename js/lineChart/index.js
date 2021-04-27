window.IPCT.lineChart = function ({
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
    const textDomain = plotDataSet.textDomain
    const yDomain = plotDataSet.yDomain
    const tooltipOptions = plotDataSet.tooltipOptions

    const xScale = d3.scaleBand()
        .domain(textDomain)
        .range([0, svgWidth - margins.right - margins.left])
    const yScale = d3.scaleLinear()
        .domain(yDomain)
        .range([svgHeight - margins.top - margins.bottom, 0])
    svg.append("g")
        .call(d3.axisBottom().scale(xScale))
        .attr("transform", `translate(${margins.left},${margins.top + plotHeight})`)

    svg.append("g")
        .call(d3.axisLeft().scale(yScale))
        .attr("transform", `translate(${margins.left},${margins.top})`)

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
            .attr("fill", colorScale[index])
            .on("mouseover", (event, d) => {
                console.log(event)
                const circle = d3.select(event.target)
                circle.attr("r", 10)
                const tooltipHeight = 25
                const tooltipWidth = tooltipOptions.width
                const topLeftX = circle.attr("cx") - tooltipWidth / 2
                const topLeftY = circle.attr("cy") - circle.attr("r") - tooltipHeight - 5
                const tooltipGroup = dataPointGroup.append("g")
                    .attr("transform", `translate(${topLeftX},${topLeftY})`)
                    .attr("class", "tooltip")
                tooltipGroup.append("rect")
                    .attr("height", tooltipHeight)
                    .attr("width", tooltipWidth)
                    .attr("stroke", "black")
                    .attr("rx", 5)
                    .attr("ry", 5)
                    .attr("fill", "white")

                tooltipGroup.append("text")
                    .text(tooltipOptions.textRenderer(d))
                    .attr("x", 10)
                    .attr("y", 5)
                    .attr("dominant-baseline", "hanging")

            })
            .on("mouseout", (event, d) => {
                const circle = d3.select(event.target)
                circle.attr("r", 5)
                d3.selectAll(".tooltip")
                    .remove()
            })
        dataPointGroup.selectAll(`.line-${index}`)
            .data(data)
            .enter()
            .append("line")
            .attr("stroke", colorScale[index])
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
}