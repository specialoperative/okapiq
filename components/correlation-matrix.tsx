"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

const correlationData = [
  { x: "Revenue", y: "Revenue", value: 1.0 },
  { x: "Revenue", y: "EBITDA", value: 0.82 },
  { x: "Revenue", y: "Owner Age", value: 0.12 },
  { x: "Revenue", y: "Market Density", value: 0.45 },
  { x: "Revenue", y: "Median Income", value: 0.67 },
  { x: "Revenue", y: "Population", value: 0.58 },

  { x: "EBITDA", y: "Revenue", value: 0.82 },
  { x: "EBITDA", y: "EBITDA", value: 1.0 },
  { x: "EBITDA", y: "Owner Age", value: 0.18 },
  { x: "EBITDA", y: "Market Density", value: 0.31 },
  { x: "EBITDA", y: "Median Income", value: 0.72 },
  { x: "EBITDA", y: "Population", value: 0.42 },

  { x: "Owner Age", y: "Revenue", value: 0.12 },
  { x: "Owner Age", y: "EBITDA", value: 0.18 },
  { x: "Owner Age", y: "Owner Age", value: 1.0 },
  { x: "Owner Age", y: "Market Density", value: -0.05 },
  { x: "Owner Age", y: "Median Income", value: 0.21 },
  { x: "Owner Age", y: "Population", value: -0.08 },

  { x: "Market Density", y: "Revenue", value: 0.45 },
  { x: "Market Density", y: "EBITDA", value: 0.31 },
  { x: "Market Density", y: "Owner Age", value: -0.05 },
  { x: "Market Density", y: "Market Density", value: 1.0 },
  { x: "Market Density", y: "Median Income", value: 0.38 },
  { x: "Market Density", y: "Population", value: 0.85 },

  { x: "Median Income", y: "Revenue", value: 0.67 },
  { x: "Median Income", y: "EBITDA", value: 0.72 },
  { x: "Median Income", y: "Owner Age", value: 0.21 },
  { x: "Median Income", y: "Market Density", value: 0.38 },
  { x: "Median Income", y: "Median Income", value: 1.0 },
  { x: "Median Income", y: "Population", value: 0.29 },

  { x: "Population", y: "Revenue", value: 0.58 },
  { x: "Population", y: "EBITDA", value: 0.42 },
  { x: "Population", y: "Owner Age", value: -0.08 },
  { x: "Population", y: "Market Density", value: 0.85 },
  { x: "Population", y: "Median Income", value: 0.29 },
  { x: "Population", y: "Population", value: 1.0 },
]

export function CorrelationMatrix() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const margin = { top: 30, right: 30, bottom: 70, left: 70 }
    const width = 500 - margin.left - margin.right
    const height = 450 - margin.top - margin.bottom

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // List of variables
    const variables = Array.from(new Set(correlationData.map((d) => d.x)))

    // Build X scales and axis
    const x = d3.scaleBand().range([0, width]).domain(variables).padding(0.01)

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)")

    // Build Y scales and axis
    const y = d3.scaleBand().range([height, 0]).domain(variables).padding(0.01)

    svg.append("g").call(d3.axisLeft(y))

    // Build color scale
    const colorScale = d3.scaleLinear<string>().domain([-1, 0, 1]).range(["#e74c3c", "#f5f5f5", "#2ecc71"])

    // Create tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("padding", "10px")
      .style("background", "rgba(0,0,0,0.8)")
      .style("border-radius", "4px")
      .style("color", "#fff")
      .style("font-size", "12px")

    // Add squares
    svg
      .selectAll()
      .data(correlationData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.x) as number)
      .attr("y", (d) => y(d.y) as number)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", (d) => colorScale(d.value))
      .on("mouseover", (event, d) => {
        tooltip.html(`${d.x} vs ${d.y}: ${d.value.toFixed(2)}`).style("visibility", "visible")
      })
      .on("mousemove", (event) => {
        tooltip.style("top", event.pageY - 10 + "px").style("left", event.pageX + 10 + "px")
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden")
      })

    // Add correlation values
    svg
      .selectAll()
      .data(correlationData)
      .enter()
      .append("text")
      .attr("x", (d) => (x(d.x) as number) + x.bandwidth() / 2)
      .attr("y", (d) => (y(d.y) as number) + y.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text((d) => d.value.toFixed(2))
      .style("font-size", "10px")
      .style("fill", (d) => (Math.abs(d.value) > 0.5 ? "white" : "black"))

    return () => {
      tooltip.remove()
    }
  }, [])

  return (
    <div className="flex justify-center overflow-auto">
      <svg ref={svgRef}></svg>
    </div>
  )
}
