window.IPCT.lineChart = function ({
    plotData,
    textDomain,
    svgHeight,
    svgWidth,
    margins,
    plotHeight,
    plotWidth,
    svg
}) {
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
}