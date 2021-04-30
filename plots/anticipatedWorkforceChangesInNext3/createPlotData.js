function countData(countArray, index, data) {
    const answer = Number(data)

    if (answer === 1) {
        countArray[index] += 1
    }
}

const questionsToPlot = [
    window.IPCT.questions.Q1,
    window.IPCT.questions.Q2,
    window.IPCT.questions.Q3,
    window.IPCT.questions.Q4,
    window.IPCT.questions.Q5,
    window.IPCT.questions.Q6,
    window.IPCT.questions.Q7,
    window.IPCT.questions.Q8,
    window.IPCT.questions.Q9
]

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

    for (let i = 0; i < questionsToPlot.length; i++) {
        plotData.push([])
    }

    let textDomain = []
    datas.forEach((d, index) => {

        const countArray = new Array(questionsToPlot.length).fill(0)

        d.forEach((innerd) => {
            questionsToPlot.forEach((question) => {
                const questionSet = window.IPCT.waveQuestionSetMap[d.name]
                const questionIndex = questionSet.indexOf(question)
                if (questionIndex > -1) {
                    const waveNumber = Number(d.name.split("_")[1])
                    let dataPoint
                    if (waveNumber < 6) {
                        if (questionIndex + 1 > 6) {
                            dataPoint = innerd[`Q115r99${questionIndex + 1}`]
                        } else {
                            dataPoint = innerd[`Q115r${questionIndex + 1}`]
                        }
                    } else {
                        if (questionIndex + 1 > 6) {
                            dataPoint = innerd[`Q110r99${questionIndex + 1}`]
                        } else {
                            dataPoint = innerd[`Q110r${questionIndex + 1}`]
                        }
                    }
                    countData(countArray, questionIndex, dataPoint)
                }
            })

            if (!textDomain[index] || (textDomain[index] < new Date(innerd.date))) {
                textDomain[index] = new Date(innerd.date)
            }
        })
        console.log(countArray)

        countArray.forEach((countEntry, index) => {
            plotData[index].push(countEntry / d.length * 100)

        })

    })
    textDomain = textDomain.map((d) => {
        return d.toLocaleDateString()
    })
    return {
        data: plotData,
        xDomain: textDomain,
        yDomain: [0, Math.max(...plotData.map((data) => {
            return Math.ceil(Math.max(...data) / 10) * 10
        }))],
        tooltipOptions: {
            width: 60,
            textRenderer: (d) => {
                return `${Number.parseFloat(d).toPrecision(3)}%`
            }
        }
    }
}

