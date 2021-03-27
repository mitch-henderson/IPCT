
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
    .attr("x", svgWidth/2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("font-size", 25)

svg.append("text")
    .text("Q157. Roughly, how long do you think it will take from today, for your business to get back on track?")
    .attr("x", 10)
    .attr("y", svgHeight - 10)
    .attr("font-size", 10)

Promise.all([
    d3.csv("Wave_3.csv"),
    d3.csv("Wave_4.csv"),
    d3.csv("Wave_5.csv")
]).then((datas) => {
    const percentageArrays = []
    datas.forEach((data) => {
        const q157data = data.map((d) => { return Number(d.Q157Months); })
        console.log(q157data)
        const countArray = [{count: 0, key: "Not Impacted"}, { count: 0, key: "<=3 months" }, { count: 0, key: "4-6 months" }, { count: 0, key: "7-9 months" }, { count: 0, key: "10-12 months" }, { count: 0, key: "13-15 months" }, { count: 0, key: "16-18 months" }, { count: 0, key: ">= 18 months" }]
        q157data.forEach((d) => {
            if (d === 99) {
                countArray[0].count += 1
            } else if (d < 4) {
                countArray[1].count += 1
            } else if (d < 7) {
                countArray[2].count += 1
            } else if (d < 10) {
                countArray[3].count += 1
            } else if (d < 13) {
                countArray[4].count += 1
            } else if (d < 16) {
                countArray[5].count += 1
            } else if (d < 19) {
                countArray[6].count += 1
            } else if (d < 98) {
                countArray[7].count += 1
            }
        })
        const percentageArray = countArray.map((d) => {

            return {
                percentage: (d.count / q157data.length) * 100,
                key: d.key
            }
        })
        percentageArrays.push(percentageArray)
    })


    const xScale = d3.scaleBand()
        .domain(percentageArrays[0].map((d) => { return d.key }))
        .range([0, svgWidth - margins.right - margins.left])
    const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([svgHeight - margins.top - margins.bottom, 0])
    svg.append("g")
        .call(d3.axisBottom().scale(xScale))
        .attr("transform", `translate(${margins.left},${margins.top + plotHeight})`)


    svg.append("g")
        .call(d3.axisLeft().scale(yScale))
        .attr("transform", `translate(${margins.left},${margins.top})`)

    const timeFramesPadding = 20   
    const widthPerX = plotWidth / percentageArrays[0].length - timeFramesPadding
    const widthPerRect = widthPerX / percentageArrays.length
    const colorScale = ["#FF5B57", "#51E4EB", "#C2FB56"] //need to add colors if we add more data
    console.log(percentageArrays[0])

    percentageArrays.forEach((percentageArray,index) => {
        svg.selectAll(`.rect${index}`)
        .data(percentageArray)
        .join(
            (enter) => {
                enter.append("rect")
                .attr("x", (d) => { return margins.left + xScale(d.key) + index * widthPerRect + timeFramesPadding / 2 })
                .attr("y", (d) => { return margins.top + yScale(0) })
                .attr("width", widthPerRect)
                .attr("height", (d) => { return 0 })
                .attr("class", `rect${index}`)
                .attr("fill", colorScale[index])
                .append("title")
                .text((d)=> {return `percentage: ${Number.parseFloat(d.percentage).toPrecision(3)}`})


                enter.append("text")
                .attr("x", (d) => { return margins.left + xScale(d.key) + index * widthPerRect + timeFramesPadding / 2 + widthPerRect / 2 })
                .attr("y", (d) => { return margins.top + yScale(d.percentage) - 3})
                .text((d)=> {return `${Number.parseFloat(d.percentage).toPrecision(3)}`})
                .attr("font-size", 10)
                .attr("text-anchor", "middle")
                .attr("class", "percentage-text")
                .attr("opacity", 0)
            }
        )
        svg.selectAll(`.rect${index}`)
        .transition()
        .delay(function (d) {return Math.random()*1000;})
        .duration(1000)
        .attr("y", (d) => { return margins.top + yScale(d.percentage) })
        .attr("height", (d) => { return plotHeight - yScale(d.percentage) })
        
        


    })
    svg.selectAll(".percentage-text")
    .transition()
    .delay(2000)
    .duration(1000)
    .attr("opacity", 1)

})