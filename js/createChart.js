window.IPCT = window.IPCT || {}
window.IPCT.createChart = function ({
    title,
    subtitle,
    questionText,
    plotType,
    plotData,
    textDomain
}) {
    const svgHeight = 640
    const svgWidth = 800
    const margins = { top: 30, bottom: 190, left: 50, right: 30 }
    const plotHeight = svgHeight - margins.top - margins.bottom
    const plotWidth = svgWidth - margins.left - margins.right

    const svg = d3.select("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)

    svg.append("text")
        .text(title)
        .attr("x", svgWidth / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("font-size", 25)

    svg.append("text")
        .text(questionText)
        .attr("x", 10)
        .attr("y", svgHeight - 10)
        .attr("font-size", 10)

    if (plotType === "lineChart") {

        window.IPCT.lineChart({
            plotData,
            textDomain,
            svgHeight,
            svgWidth,
            margins,
            plotHeight,
            plotWidth,
            svg
        })
    }
}
