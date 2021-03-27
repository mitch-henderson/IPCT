// https://observablehq.com/@d3/diverging-stacked-bar-chart@343
import define1 from "./a33468b95d0b15b0@699.js";

function ourcolor(key) {
  if (key == "No Plans to Use") return "#FF5B57";
  if (key == "Planning to Use") return "#51E4EB";
  if (key == "Currently Using") return "#C2FB56";

}

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["politifact.csv", new URL("../data/TechnologyImplementation.csv", import.meta.url)]]); //00677154fd47f6e479b42c7e5e95120a918d07c06cb2eee835a24e01a52d65c03afba70fbbe4c760f1bc41efec40d793f7b374c8b9bc86df5c1da482e33f0f78
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function (md) {
    return (
      md`# Diverging Stacked Bar Chart
      This chart stacks negative categories to the left and positive categories to the right.`
    )
  });
  main.variable(observer()).define(["swatches", "color"], function (swatches, color) {
    console.log(color)
    return (
      swatches({ color })
    )
  });
  main.variable(observer("chart")).define("chart", ["d3", "width", "height", "series", "color", "x", "y", "formatValue", "xAxis", "yAxis"], function (d3, width, height, series, color, x, y, formatValue, xAxis, yAxis) {
    const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

    console.log(series)

    svg.append("g")
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("fill", d => ourcolor(d.key))
      .selectAll("rect")
      .data(d => d.map(v => Object.assign(v, { key: d.key })))
      .join((enter) => {
        console.log(enter)
        const rect = enter.append('rect')
        .attr("x", d => x(d[0]))
      .attr("y", ({ data: [name] }) => y(name))
      .attr("width", d => x(d[1]) - x(d[0]))
      .attr("height", y.bandwidth())
      .append("title")
      .text(({ key, data: [name, value] }) => `${name}
      ${formatValue(value.get(key))} ${key}`);
        try{
          enter.append('text')
        .text(({ key, data: [name, value] }) => formatValue(value.get(key)))
        .attr("x", d => x(d[0]) + (x(d[1]) - x(d[0])) / 2)
      .attr("y", ({ data: [name] }) => y(name) + 20)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      console.log("getting here")
        } catch (e) {
          console.log(e)
        }
        return rect;
      }, (update) => update)

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

    return svg.node();
  }
  );
  main.variable(observer("data")).define("data", ["d3", "FileAttachment"], async function (d3, FileAttachment) {
    const categories = {
      "no-plans-to-use": "No Plans to Use",
      "planning-to-use": "Planning to Use",
      "currently-using": "Currently Using"
    };

    const data = d3.csvParse(await FileAttachment("politifact.csv").text(), ({ speaker: name, ruling: category, count: value }) => categories[category] ? { name, category: categories[category], value: +value } : null);
    console.log(await FileAttachment("politifact.csv").text())
    console.log(data)
    // Normalize absolute values to percentage.
    //alert(JSON.stringify(data)); //commented out for now
    d3.rollup(data, group => {
      const sum = d3.sum(group, d => d.value);
      for (const d of group) d.value /= sum;
    }, d => d.name);

    return Object.assign(data, {
      format: ".0%",
      negative: "← Less Likely",
      positive: "More Likely →",
      negatives: ["No Plans to Use"],
      positives: ["Planning to Use", "Currently Using"]
    });
  }
  );
  main.variable(observer("signs")).define("signs", ["data"], function (data) {
    return (
      new Map([].concat(
        data.negatives.map(d => [d, -1]),
        data.positives.map(d => [d, +1])
      ))
    )
  });
  main.variable(observer("bias")).define("bias", ["d3", "data", "signs"], function (d3, data, signs) {
    return (
      d3.rollups(data, v => d3.sum(v, d => d.value * Math.min(0, signs.get(d.category))), d => d.name)
        .sort(([, a], [, b]) => d3.descending(a, b))
    )
  });
  main.variable(observer("series")).define("series", ["d3", "data", "signs"], function (d3, data, signs) {
    return (
      d3.stack()
        .keys([].concat(data.negatives.slice().reverse(), data.positives))
        .value(([, value], category) => signs.get(category) * (value.get(category) || 0))
        .offset(d3.stackOffsetDiverging)
        (d3.rollups(data, data => d3.rollup(data, ([d]) => d.value, d => d.category), d => d.name))
    )
  });
  main.variable(observer("x")).define("x", ["d3", "series", "margin", "width"], function (d3, series, margin, width) {
    return (
      d3.scaleLinear()
        .domain(d3.extent(series.flat(2)))
        .rangeRound([margin.left, width - margin.right])
    )
  });
  main.variable(observer("y")).define("y", ["d3", "bias", "margin", "height"], function (d3, bias, margin, height) {
    return (
      d3.scaleBand()
        .domain(bias.map(([name]) => name))
        .rangeRound([margin.top, height - margin.bottom])
        .padding(2 / 33)
    )
  });
  main.variable(observer("color")).define("color", ["d3", "data"], function (d3, data) {
    console.log(data)
    return (
      d3.scaleOrdinal()
        .domain([].concat(data.negatives, data.positives))
        .range([ourcolor("No Plans to Use"), ourcolor("Planning to Use"), ourcolor("Currently Using")])
    )
  });
  main.variable(observer("xAxis")).define("xAxis", ["margin", "d3", "x", "width", "formatValue", "data"], function (margin, d3, x, width, formatValue, data) {
    return (
      g => g
        .attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisTop(x)
          .ticks(width / 80)
          .tickFormat(formatValue)
          .tickSizeOuter(0))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
          .attr("x", x(0) + 20)
          .attr("y", -24)
          .attr("fill", "grey")//"currentColor")
          .attr("text-anchor", "start")
          .text(data.positive))
        .call(g => g.append("text")
          .attr("x", x(0) - 20)
          .attr("y", -24)
          .attr("fill", "grey")//"currentColor")
          .attr("text-anchor", "end")
          .text(data.negative))
    )
  });
  main.variable(observer("yAxis")).define("yAxis", ["d3", "y", "bias", "x"], function (d3, y, bias, x) {
    return (
      g => g
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call(g => g.selectAll(".tick").data(bias).attr("transform", ([name, min]) => `translate(${x(min)},${y(name) + y.bandwidth() / 2})`))
        .call(g => g.select(".domain").attr("transform", `translate(${x(0)},0)`))
    )
  });
  main.variable(observer("formatValue")).define("formatValue", ["d3", "data"], function (d3, data) {
    const format = d3.format(data.format || "");
    return x => format(Math.abs(x));
  }
  );
  main.variable(observer("height")).define("height", ["bias", "margin"], function (bias, margin) {
    return (
      bias.length * 33 + margin.top + margin.bottom
    )
  });
  main.variable(observer("margin")).define("margin", function () {
    return (
      { top: 40, right: 30, bottom: 0, left: 80 }
    )
  });
  main.variable(observer("d3")).define("d3", ["require"], function (require) {
    return (
      require("d3@6")
    )
  });
  const child1 = runtime.module(define1);
  main.import("swatches", child1);
  return main;
}
