function countData(countArray, topBoxCountArray, index, data) {
    const answer = Number(data)

    if (answer < 11 && answer > 7) {

        topBoxCountArray[index] += 1
    }
    if (answer < 11 && answer > 0) {
        countArray[index] += 1
    }
}

window.IPCT.createPlotData = async function () {
    const datas = await Promise.all([
        d3.csv("../../data/Wave_3.csv"),
        d3.csv("../../data/Wave_4.csv"),
        d3.csv("../../data/Wave_5.csv"),
        d3.csv("../../data/Wave_6.csv")
    ])
    datas[0].name = "Wave_3"
    datas[1].name = "Wave_4"
    datas[2].name = "Wave_5"
    datas[3].name = "Wave_6"
    const plotData = []
    const questionsToPlot = window.IPCT.questionsToPlot

    for (let i = 0; i < questionsToPlot.length; i++) {
        plotData.push([])
    }

    let textDomain = []
    datas.forEach((d, index) => {

        const countArray = new Array(questionsToPlot.length).fill(0)
        const topBoxCountArray = new Array(questionsToPlot.length).fill(0)
        d.forEach((innerd) => {
            questionsToPlot.forEach((question, index) => {
                const questionSet = window.IPCT.waveQuestionSetMap[d.name]
                const questionIndex = questionSet.indexOf(question)

                if (questionIndex > -1) {
                    countData(countArray, topBoxCountArray, index, innerd[`Q100r${questionIndex + 1}`])
                }
            })

            if (!textDomain[index] || (textDomain[index] < new Date(innerd.date))) {
                textDomain[index] = new Date(innerd.date)
            }
        })

        countArray.forEach((count, index) => {
            if (count === 0) {
                plotData[index].push(null)
            } else {
                plotData[index].push(topBoxCountArray[index] / count * 100)
            }

        })

    })
    textDomain = textDomain.map((d) => {
        return d.toLocaleDateString()
    })
    return {
        data: plotData,
        xDomain: textDomain,
        yDomain: [0, 10 + Math.max(...plotData.map((data) => {
            return Math.ceil(Math.max(...data))
        }))],
        tooltipOptions: {
            width: 60,
            textRenderer: (d) => {
                return `${Number.parseFloat(d).toPrecision(3)}%`
            }
        }
    }
}

