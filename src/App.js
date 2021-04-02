import React, { useEffect, useRef } from "react"
import * as d3 from "d3"
import { feature } from "topojson"
import './App.css';

const App = () => {

  const inputEl = useRef(null)

  useEffect(() => {
    var svg = d3.select(inputEl.current).append("svg")
    // var width = +svg.attr("width")
    // var height = +svg.attr("height")
    var path = d3.geoPath()
    var projection = d3.geoMercator()
        // .scale(100)
        // .center([0,0])
        // .translate([width / 2, height / 2])
    

    // d3.json("/world-110m.json", function(error, world) {
    //   if (error) throw error;
    //   console.log('dave world => ', world)
    //   svg.selectAll("path")
    //     .data(topojson.feature(world,world.objects.countries).features)
    //     .enter().append("path")
    //     .attr("d", path);
    // });

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
          console.log('dave ===============> ', world)

        svg.selectAll("path")
        .data(feature(world,world.objects.countries).features)
        .enter().append("path")
        .attr('class', 'country')
        .attr("d", path.projection(projection))
        .attr("d", path);
        })
      })

  }, [])

  return (
    <div ref={inputEl}></div>
  )
}

export default App