const createPlotDataForYear = (csvData, year) => {
    const data = csvData.filter((d) => {
        return d.StudyYear === year
    })
    let plotData = new Array(3).fill(0)
    let emptyResponses = 0
    data.forEach((d) => {
        if (d.Q11Dr1 === " ") {
            emptyResponses++
            return
        }
        const dataPoint1 = Number(d.Q11Dr1)
        const dataPoint2 = Number(d.Q11Dr2)
        const dataPoint3 = Number(d.Q11Dr3)

        plotData[0] += dataPoint1
        plotData[1] += dataPoint2
        plotData[2] += dataPoint3
    })
    return plotData.map((d) => {
        return d / (data.length - emptyResponses)
    })
}

window.IPCT.createPlotData = async function () {
    const csvData = await d3.csv("../../data/Water_Heater.csv")
    const plotData2018 = createPlotDataForYear(csvData, "2018")
    const plotData2019 = createPlotDataForYear(csvData, "2019")
    const plotData2020 = createPlotDataForYear(csvData, "2020")

    return {
        data: [plotData2018, plotData2019, plotData2020],
        xDomain: ["2018", "2019", "2020"]
    }
}