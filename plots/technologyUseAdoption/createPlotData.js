function countData(d, plotData, index, key) {
    const responseData = d[key]
    if (responseData === "1") {
        plotData[index][2] += 1
    } else if (responseData === "2") {
        plotData[index][1] += 1
    } else if (responseData === "3") {
        plotData[index][0] += 1
    }
}

window.IPCT.createPlotData = async function () {
    const data = await d3.csv("../../data/Wave_6.csv")
    let plotData = new Array(16).fill(0).map(() => { return [0, 0, 0] })
    data.forEach((d) => {
        countData(d, plotData, 0, "Q201r1")
        countData(d, plotData, 1, "Q201r2")
        countData(d, plotData, 2, "Q201r3")
        countData(d, plotData, 3, "Q201r4")
        countData(d, plotData, 4, "Q201r5")
        countData(d, plotData, 5, "Q201r6")
        countData(d, plotData, 6, "Q201r7")
        countData(d, plotData, 7, "Q201r8")
        countData(d, plotData, 8, "Q201r9")
        countData(d, plotData, 9, "Q201r10")
        countData(d, plotData, 10, "Q201r11")
        countData(d, plotData, 11, "Q201r12")
        countData(d, plotData, 12, "Q201r13")
        countData(d, plotData, 13, "Q201r14")
        countData(d, plotData, 14, "Q201r15")
        countData(d, plotData, 15, "Q201r16")

    })
    plotData = plotData.map((d) => {
        const total = d[0] + d[1] + d[2]
        return [d[0] / total * 100, d[1] / total * 100, d[2] / total * 100]
    })
    console.log(plotData)

    const yLabels = [
        "3D printing/Additive manufacturing",
        "APIs (application programming interface)",
        "AI/Predictive data analytics",
        "Augmented/Virtual reality",
        "Automation/Digitization/Internet of things",
        "Blockchain technology",
        "Cloud services/computing",
        "Drones",
        "Integration of smart, connected machines",
        "Infrared Fever Warning Systems",
        "Mobile devices/Wearables",
        "Robots",
        "Social Media Monitoring",
        "Video Chat/Conferencing Software",
        "Video Surveillance",
        "Wireless sensors"
    ]

    return {
        data: plotData,
        yDomain: yLabels
    }
}