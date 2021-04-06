const svgHeight = 500
const svgWidth = 800
const margins = { top: 30, bottom: 50, left: 50, right: 30 }
const plotHeight = svgHeight - margins.top - margins.bottom
const plotWidth = svgWidth - margins.left - margins.right

const svg = d3.select("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

svg.append("text")
    .text("Estimated Time for Business to Get Back on Track")
    .attr("x", svgWidth / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("font-size", 25)

svg.append("text")
    .text("Q157. Roughly, how long do you think it will take from today, for your business to get back on track?")
    .attr("x", 10)
    .attr("y", svgHeight - 10)
    .attr("font-size", 10)

function countData(d,plotData,index,key){
    const responseData = d[key]
    if (responseData === "1"){
        plotData[index][0]+=1
    } else if (responseData === "2"){
        plotData[index][1]+=1
    } else if (responseData === "3"){
        plotData[index][2]+=1
    }
}

d3.csv("../data/Wave_5.csv").then((data)=>{
    const plotData = new Array(16).fill(0).map(()=>{return [0,0,0]})
    data.forEach((d)=>{
        countData(d,plotData,0,"Q156Br1")
        countData(d,plotData,1,"Q156Br2")
        countData(d,plotData,2,"Q156Br3")
        countData(d,plotData,3,"Q156Br4")
        countData(d,plotData,4,"Q156Br5")
        countData(d,plotData,5,"Q156Br6")
        countData(d,plotData,6,"Q156Br7")
        countData(d,plotData,7,"Q156Br8")
        countData(d,plotData,8,"Q156Br9")
        countData(d,plotData,9,"Q156Br10")
        countData(d,plotData,10,"Q156Br11")
        countData(d,plotData,11,"Q156Br12")
        countData(d,plotData,12,"Q156Br13")
        countData(d,plotData,13,"Q156Br14")
        countData(d,plotData,14,"Q156Br15")
        countData(d,plotData,15,"Q156Br16")

    })
    console.log(plotData)
})