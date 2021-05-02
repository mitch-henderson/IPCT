const getAverage = (csvData, year, columnName) => {
    const data = csvData.filter((d) => {
        return d.StudyYear === year
    })
    let total = 0
    let emptyResponses = 0
    data.forEach((d) => {
        if (d[columnName] === " ") {
            emptyResponses++
            return
        }
        const dataPoint = Number(d[columnName])
        total += dataPoint
    })
    return total / (data.length - emptyResponses)

}

window.IPCT.createPlotData = async function () {
    const csvData = await d3.csv("../../data/Water_Heater.csv")
    const plotDataInstall = [getAverage(csvData, "2020", "Q1r1"), getAverage(csvData, "2019", "Q1r1"), getAverage(csvData, "2018", "Q1r1"),
    getAverage(csvData, "2017", "Q1r1"), getAverage(csvData, "2016", "Q1r1")]
    const plotDataReplace = [getAverage(csvData, "2020", "Q1r2"), getAverage(csvData, "2019", "Q1r2"), getAverage(csvData, "2018", "Q1r2"),
    getAverage(csvData, "2017", "Q1r2"), getAverage(csvData, "2016", "Q1r2")]
    const plotDataService = [getAverage(csvData, "2020", "Q1r3"), getAverage(csvData, "2019", "Q1r3"), getAverage(csvData, "2018", "Q1r3"),
    getAverage(csvData, "2017", "Q1r3"), getAverage(csvData, "2016", "Q1r3")]

    return {
        data: [plotDataService, plotDataReplace, plotDataInstall],
        yDomain: ["Service", "Replace", "Install"]
    }
}