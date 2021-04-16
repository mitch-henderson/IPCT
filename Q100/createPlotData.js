function countData(countArray, sumArray, index, data) {
    const answer = Number(data)

    if (answer < 11 && answer > 0) {
        countArray[index] += 1
        sumArray[index] += answer
    }
}

const questionsToPlot = [
    window.IPCT.questions.Q1,
    window.IPCT.questions.Q2,
    window.IPCT.questions.Q3,
    window.IPCT.questions.Q4,
    window.IPCT.questions.Q7,
    window.IPCT.questions.Q8,
    window.IPCT.questions.Q12,
    window.IPCT.questions.Q10,
    window.IPCT.questions.Q13,
    window.IPCT.questions.Q14
]

window.IPCT.createPlotData = async function () {
    const datas = await Promise.all([
        d3.csv("../data/Wave_3.csv"),
        d3.csv("../data/Wave_4.csv"),
        d3.csv("../data/Wave_5.csv"),
        d3.csv("../data/Wave_6.csv")
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
        const sumArray = new Array(questionsToPlot.length).fill(0)
        const averageArray = new Array(questionsToPlot.length).fill(0)
        d.forEach((innerd) => {
            questionsToPlot.forEach((question) => {
                const questionSet = window.IPCT.waveQuestionSetMap[d.name]
                const questionIndex = questionSet.indexOf(question)
                if (questionIndex > -1) {
                    countData(countArray, sumArray, questionIndex, innerd[`Q100r${questionIndex + 1}`])
                }
            })

            if (!textDomain[index] || (textDomain[index] < new Date(innerd.date))) {
                textDomain[index] = new Date(innerd.date)
            }
        })

        countArray.forEach((countEntry, index) => {
            if (countEntry === 0) {
                averageArray[index] = null
            } else {
                averageArray[index] = sumArray[index] / countEntry
            }

        })

        averageArray.forEach((average, index) => {
            plotData[index].push(average)
        })


        console.log(averageArray)
    })
    textDomain = textDomain.map((d) => {
        return d.toLocaleDateString()
    })
    return {
        data: plotData,
        textDomain
    }
}

