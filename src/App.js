import React, { useEffect } from "react"
import * as d3 from "d3"
import { feature } from "topojson"
import './App.css';

const App = () => {

  var data = [
    {name: 'Red', lon: -122.43, lat: 37.77, color: 'red', scale: 1},
    {name: 'Orange', lon: 25, lat: 25, color: 'orange', scale: .75},
    {name: 'Green', lon: 35, lat: 35, color: 'black', scale: .5},
    {name: 'Green', lon: 15, lat: 35, color: 'black', scale: .5},
    {name: 'Green', lon: 0, lat: 0, color: 'green', scale: .5},
  ]

  useEffect(() => {
    var svg = d3.select('svg')
    var width = +svg.attr("width")
    var height = +svg.attr("height")
    var path = d3.geoPath()
    var projection = d3.geoMercator()
        .scale(100)
        .center([0,0])
        .translate([width / 2, height / 2])

      var div = d3.select('#map-container').append("div")	
          .attr("class", "d3-tooltip")				
          .style("opacity", 0)
  
      const mouseOver = (d) => {		
          div.transition()		
              .duration(200)		
              .style("opacity", .9);		
          div.html('Maximum: ' + d.name + '<br/>' +
                  'Upper Quartail: ' + d.lon + '<br/>' +
                  'Median: ' + d.lat + '<br/>' +
                  'Lower Quartail: ' + d.color + '<br/>' +
                  'Minimum: ' + d.scale)	
              // .style("left", (d3.event.pageX + 10) + "px")		
              // .style("top", (d3.event.pageY) + "px");	
      }		
      const mouseOut = (d) => {		
          div.transition()		
              .duration(500)		
              .style("opacity", 0)
      }

    
    fetch("/world-110m.json", {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    })
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(world => {
          svg.selectAll("path")
          .data(feature(world,world.objects.countries).features)
          .enter().append("path")
          .attr('class', 'country')
          .attr("d", path.projection(projection))
          .attr("d", path)
        })

        console.log('dave svg =====> ', svg)
        var groupsRegion = svg.selectAll(".region")
            .data([{name: 'pepe', lon: 0, lat: 0}])
            .enter()
            .append("g")
            .attr("class", "region");

            groupsRegion.append('circle')
            .attr('stroke', '#ffffff')
            .attr('fill', '#68b3c8')
            .attr('cx', d => projection([d.lon, d.lat])[0])
            .attr('cy', d => projection([d.lon, d.lat])[1])
            .attr('r', 4)
            .style('opacity', 1)
            .style('stroke-width', 0)
            .append('title')
            .text(d => d.name);

        // location markers
        var groupMarker = svg.selectAll(".marker")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "marker");

        groupMarker.append('path')
            .attr('stroke', '#ffffff')
            .attr('fill', d => d.color)
            .attr('fill', d => d.color)
            // .attr('x', d => projection([d.lon, d.lat])[0])
            // .attr('y', d => projection([d.lon, d.lat])[1])
            .attr("d", d => {
                var lon = projection([d.lon, d.lat])[0]/d.scale;
                var lat = projection([d.lon, d.lat])[1]/d.scale - 30;
                return 'M' + lon + ' ' + lat + 'a10 10 0 0 0-10 10c0 9 10 20 10 20s10-11 10-20a10 10 0 0 0-10-10zm0 12a2 2 0 1 1 2-2 2 2 0 0 1-2 2z';
            })
            .attr("transform", d => 'scale(' + d.scale + ')')
            .on("click", (d) => {console.log('=> ', d) /*mouseOver(d) */ })
            .on("mouseout", (d) => { mouseOut(d) })
            .append('title')
            .text(d => d.name);







      })

  }, [])

  return (
    <div id="map-container">
      <svg width="800" height="400"></svg>
    </div>
  
  )
}

export default App