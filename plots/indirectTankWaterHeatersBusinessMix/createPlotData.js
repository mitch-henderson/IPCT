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

        if (dataPoint < 500) {
            plotData[0]++
        } else if (dataPoint < 1000) {
            plotData[1]++
        } else if (dataPoint < 1500) {
            plotData[2]++
        } else if (dataPoint < 2000) {
            plotData[3]++
        } else if (dataPoint < 3000) {
            plotData[4]++
        } else if (dataPoint < 5000) {
            plotData[5]++
        } else {
            plotData[6]++
        }
    })
    return plotData.map((d) => {
        return d / (data.length - emptyResponses) * 100
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