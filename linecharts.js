const width = 1000;
const height = 600;
const margin = 50;

const padding = 5;
const adj = 30;

const svg = d3
  .select("div#container3")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr(
    "viewBox",
    "-" + 80 + " -" + adj + " " + (width + adj * 9) + " " + (height + adj * 3)
  )
  .style("padding", padding)
  .style("margin-right", 220)
  .style("margin-left", 150)
  .classed("svg-content", true);

const dataset = d3.csv("boardgame_ratings.csv");

dataset.then(function (data) {
  var slices = data.columns.slice(1).map(function (id) {
    return {
      id: id,
      values: data.map(function (d) {
        return {
          date: new Date(d.date),
          value: +d[id],
        };
      }),
    };
  });

  console.log(slices);
  let count_arr = [];
  let rank_arr = [];

  for (var i = 0; i < slices.length; i++) {
    if (i % 2 === 0) {
      count_arr.push(slices[i]);
    }
  }

  for (var i = 0; i < slices.length; i++) {
    if (i % 2 !== 0) {
      rank_arr.push(slices[i]);
    }
  }

  fin_arr = [];

  for (var i = 0; i < rank_arr.length; i++) {
    for (var j = 0; j < count_arr[i].values.length; j++) {
      count_arr[i].values[j].rank = rank_arr[i].values[j].value;
    }
  }

  console.log(count_arr);

  let id = 0;

  const xScale = d3.scaleTime().range([0, width]);
  const yScale = d3.scaleSqrt().rangeRound([height, 0]);
  xScale.domain(
    d3.extent(data, function (d) {
      return new Date(d.date);
    })
  );

  yScale.domain([
    1,
    d3.max(count_arr, function (c) {
      return d3.max(c.values, function (d) {
        return d.value + 3;
      });
    }),
  ]);

  const yaxis = d3
    .axisLeft()
    .ticks(count_arr[0].values.length / 4)
    .scale(yScale);

  const xaxis = d3
    .axisBottom()
    .ticks(d3.timeMonth.every(3))
    .tickFormat(d3.timeFormat("%b %Y"))
    .scale(xScale);

  const line = d3
    .line()
    .x(function (d) {
      return xScale(d.date);
    })
    .y(function (d) {
      return yScale(d.value);
    });

  const ids = function () {
    return "line-" + id++;
  };

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xaxis)
    .append("text")
    .attr("dx", ".2em")
    .attr("x", width / 2)
    .attr("y", 50)
    .style("text-anchor", "end")
    .style("font-size", 20)
    .text("Month");

  svg
    .append("g")
    .attr("class", "axis")
    .call(yaxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("dy", ".75em")
    .attr("y", -70)
    .attr("x", -height / 3)
    .style("text-anchor", "end")
    .style("font-size", 20)
    .text("Number of Ratings");

  svg
    .append("g")
    .append("circle")
    .attr("cx", width + 60)
    .attr("cy", 500)
    .attr("r", 15)
    .style("opacity", 1)
    .style("fill", "black");

  svg
    .append("g")
    .append("text")
    .attr("x", width + 60)
    .attr("y", 500)
    .style("opacity", 1)
    .style("fill", "red")
    .text("Rank");

  svg
    .append("g")
    .append("text")
    .attr("x", width)
    .attr("y", 540)
    .style("opacity", 1)
    .style("fill", "black")
    .text("BoardGameGeekRank");

  const lines = svg.selectAll("lines").data(count_arr).enter().append("g");

  lines
    .append("path")
    .attr("class", ids)
    .attr("d", function (d) {
      return line(d.values);
    });

  lines
    .append("text")

    .datum(function (d) {
      return {
        id: d.id,
        value: d.values[d.values.length - 1],
        rank: d.rank,
        col: d.id.split("=")[0].split(" ")[0].split(":")[0],
      };
    })
    .attr("transform", function (d) {
      return (
        "translate(" +
        (xScale(d.value.date) + 15) +
        "," +
        (yScale(d.value.value) + 25) +
        ")"
      );
    })
    .attr("class", function (d) {
      return d.col;
    })
    .attr("x", 5)
    .text(function (d) {
      return d.id.split("=")[0];
    });

  lines
    .selectAll("points")
    .data(function (d) {
      let k = [];
      if (
        d.id === "Catan=count" ||
        d.id === "Codenames=count" ||
        d.id === "Terraforming Mars=count" ||
        d.id === "Gloomhaven=count"
      ) {
        for (var i = 2; i < d.values.length; i += 3) {
          k.push(d.values[i]);
          d.values[i].col = d.id.split("=")[0].split(" ")[0];
        }
      }

      console.log(k);
      return k;
    })
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(d.date);
    })
    .attr("cy", function (d) {
      return yScale(d.value);
    })
    .attr("r", 15)
    .attr("class", function (d) {
      return d.col;
    })
    .style("opacity", 1);

  lines
    .selectAll("circles")
    .data(function (d) {
      let k = [];
      if (
        d.id === "Catan=count" ||
        d.id === "Codenames=count" ||
        d.id === "Terraforming Mars=count" ||
        d.id === "Gloomhaven=count"
      ) {
        for (var i = 2; i < d.values.length; i += 3) {
          k.push(d.values[i]);
        }
      }

      console.log(k);
      return k;
    })
    .enter()
    .append("text")
    .attr("x", function (d) {
      return xScale(d.date);
    })
    .attr("y", function (d) {
      return yScale(d.value);
    })
    .text(function (d) {
      return d.rank;
    });
});

// Start of 2
const svg312 = d3
  .select("div#container")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr(
    "viewBox",
    "-" + 80 + " -" + adj + " " + (width + adj * 9) + " " + (height + adj * 3)
  )
  .style("padding", padding)
  .style("margin-right", 220)
  .style("margin-left", 150)
  .classed("svg-content", true);

const datasetk2 = d3.csv("boardgame_ratings.csv");

datasetk2.then(function (data) {
  var slices = data.columns.slice(1).map(function (id) {
    return {
      id: id,
      values: data.map(function (d) {
        return {
          date: new Date(d.date),
          value: +d[id],
        };
      }),
    };
  });

  console.log(slices);
  let count_arr = [];
  let rank_arr = [];

  for (var i = 0; i < slices.length; i++) {
    if (i % 2 === 0) {
      count_arr.push(slices[i]);
    }
  }

  for (var i = 0; i < slices.length; i++) {
    if (i % 2 !== 0) {
      rank_arr.push(slices[i]);
    }
  }

  fin_arr = [];

  for (var i = 0; i < rank_arr.length; i++) {
    for (var j = 0; j < count_arr[i].values.length; j++) {
      count_arr[i].values[j].rank = rank_arr[i].values[j].value;
    }
  }

  console.log(count_arr);

  let id = 0;

  const xScale312 = d3.scaleTime().range([0, width]);
  const yScale312 = d3.scaleLinear().rangeRound([height, 0]);
  xScale312.domain(
    d3.extent(data, function (d) {
      return new Date(d.date);
    })
  );

  yScale312.domain([
    1,
    d3.max(count_arr, function (c) {
      return d3.max(c.values, function (d) {
        return d.value + 3;
      });
    }),
  ]);

  const yaxis312 = d3
    .axisLeft()
    .ticks(count_arr[0].values.length / 4)
    .scale(yScale312);

  const xaxis312 = d3
    .axisBottom()
    .ticks(d3.timeMonth.every(3))
    .tickFormat(d3.timeFormat("%b %Y"))
    .scale(xScale312);

  const line312 = d3
    .line()
    .x(function (d) {
      return xScale312(d.date);
    })
    .y(function (d) {
      return yScale312(d.value);
    });

  const ids = function () {
    return "line-" + id++;
  };

  svg312
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xaxis312)
    .append("text")
    .attr("dx", ".2em")
    .attr("x", width / 2)
    .attr("y", 50)
    .style("text-anchor", "end")
    .style("font-size", 20)
    .text("Month");

  svg312
    .append("g")
    .attr("class", "axis")
    .call(yaxis312)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("dy", ".75em")
    .attr("y", -70)
    .attr("x", -height / 3)
    .style("text-anchor", "end")
    .style("font-size", 20)
    .text("Number of Ratings");

  const lines312 = svg312
    .selectAll("lines")
    .data(count_arr)
    .enter()
    .append("g");

  lines312
    .append("path")
    .attr("class", ids)
    .attr("d", function (d) {
      return line312(d.values);
    });

  lines312
    .append("text")

    .datum(function (d) {
      return {
        id: d.id,
        value: d.values[d.values.length - 1],
        rank: d.rank,
        col: d.id.split("=")[0].split(" ")[0].split(":")[0],
      };
    })
    .attr("transform", function (d) {
      return (
        "translate(" +
        (xScale312(d.value.date) + 15) +
        "," +
        (yScale312(d.value.value) + 25) +
        ")"
      );
    })
    .attr("class", function (d) {
      return d.col;
    })
    .attr("x", 5)
    .text(function (d) {
      return d.id.split("=")[0];
    });
});

// ====================
// Start of chart 2
// ====================

const svg31 = d3
  .select("div#container2")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr(
    "viewBox",
    "-" + 80 + " -" + adj + " " + (width + adj * 9) + " " + (height + adj * 3)
  )
  .style("padding", padding)
  .style("margin-right", 220)
  .style("margin-left", 150)
  .classed("svg-content", true);

const datasetk = d3.csv("boardgame_ratings.csv");

datasetk.then(function (data) {
  var slices = data.columns.slice(1).map(function (id) {
    return {
      id: id,
      values: data.map(function (d) {
        return {
          date: new Date(d.date),
          value: +d[id],
        };
      }),
    };
  });

  console.log(slices);
  let count_arr = [];
  let rank_arr = [];

  for (var i = 0; i < slices.length; i++) {
    if (i % 2 === 0) {
      count_arr.push(slices[i]);
    }
  }

  for (var i = 0; i < slices.length; i++) {
    if (i % 2 !== 0) {
      rank_arr.push(slices[i]);
    }
  }

  fin_arr = [];

  for (var i = 0; i < rank_arr.length; i++) {
    for (var j = 0; j < count_arr[i].values.length; j++) {
      count_arr[i].values[j].rank = rank_arr[i].values[j].value;
    }
  }

  console.log(count_arr);

  let id = 0;

  const xScale31 = d3.scaleTime().range([0, width]);
  const yScale31 = d3.scaleLinear().rangeRound([height, 0]);
  xScale31.domain(
    d3.extent(data, function (d) {
      return new Date(d.date);
    })
  );

  yScale31.domain([
    1,
    d3.max(count_arr, function (c) {
      return d3.max(c.values, function (d) {
        return d.value + 3;
      });
    }),
  ]);

  const yaxis31 = d3
    .axisLeft()
    .ticks(count_arr[0].values.length / 4)
    .scale(yScale31);

  const xaxis31 = d3
    .axisBottom()
    .ticks(d3.timeMonth.every(3))
    .tickFormat(d3.timeFormat("%b %Y"))
    .scale(xScale31);

  const line = d3
    .line()
    .x(function (d) {
      return xScale31(d.date);
    })
    .y(function (d) {
      return yScale31(d.value);
    });

  const ids = function () {
    return "line-" + id++;
  };

  svg31
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xaxis31)
    .append("text")
    .attr("dx", ".2em")
    .attr("x", width / 2)
    .attr("y", 50)
    .style("text-anchor", "end")
    .style("font-size", 20)
    .text("Month");

  svg31
    .append("g")
    .attr("class", "axis")
    .call(yaxis31)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("dy", ".75em")
    .attr("y", -70)
    .attr("x", -height / 3)
    .style("text-anchor", "end")
    .style("font-size", 20)
    .text("Number of Ratings");

  svg31
    .append("g")
    .append("circle")
    .attr("cx", width + 60)
    .attr("cy", 500)
    .attr("r", 15)
    .style("opacity", 1)
    .style("fill", "black");
  svg31
    .append("g")
    .append("text")
    .attr("x", width + 60)
    .attr("y", 500)
    .style("opacity", 1)
    .style("fill", "red")
    .text("Rank");

  svg31
    .append("g")
    .append("text")
    .attr("x", width)
    .attr("y", 540)
    .style("opacity", 1)
    .style("fill", "black")
    .text("BoardGameGeekRank");

  const lines31 = svg31.selectAll("lines").data(count_arr).enter().append("g");

  lines31
    .append("path")
    .attr("class", ids)
    .attr("d", function (d) {
      return line(d.values);
    });

  lines31
    .append("text")

    .datum(function (d) {
      return {
        id: d.id,
        value: d.values[d.values.length - 1],
        rank: d.rank,
        col: d.id.split("=")[0].split(" ")[0].split(":")[0],
      };
    })
    .attr("transform", function (d) {
      return (
        "translate(" +
        (xScale31(d.value.date) + 15) +
        "," +
        (yScale31(d.value.value) + 25) +
        ")"
      );
    })
    .attr("class", function (d) {
      return d.col;
    })
    .attr("x", 5)
    .text(function (d) {
      return d.id.split("=")[0];
    });

  lines31
    .selectAll("points")
    .data(function (d) {
      let k = [];
      if (
        d.id === "Catan=count" ||
        d.id === "Codenames=count" ||
        d.id === "Terraforming Mars=count" ||
        d.id === "Gloomhaven=count"
      ) {
        for (var i = 2; i < d.values.length; i += 3) {
          k.push(d.values[i]);
          d.values[i].col = d.id.split("=")[0].split(" ")[0];
        }
      }

      console.log(k);
      return k;
    })
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale31(d.date);
    })
    .attr("cy", function (d) {
      return yScale31(d.value);
    })
    .attr("r", 15)
    .attr("class", function (d) {
      return d.col;
    })
    .style("opacity", 1);

  lines31
    .selectAll("circles")
    .data(function (d) {
      let k = [];
      if (
        d.id === "Catan=count" ||
        d.id === "Codenames=count" ||
        d.id === "Terraforming Mars=count" ||
        d.id === "Gloomhaven=count"
      ) {
        for (var i = 2; i < d.values.length; i += 3) {
          k.push(d.values[i]);
        }
      }

      console.log(k);
      return k;
    })
    .enter()
    .append("text")
    .attr("x", function (d) {
      return xScale31(d.date);
    })
    .attr("y", function (d) {
      return yScale31(d.value);
    })
    .text(function (d) {
      return d.rank;
    });
});

// ======================
// Start of chart 4
// =======================

const svg2 = d3
  .select("div#container4")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr(
    "viewBox",
    "-" + 80 + " -" + adj + " " + (width + adj * 9) + " " + (height + adj * 3)
  )
  .style("padding", padding)
  .style("margin-right", 220)
  .style("margin-left", 150)
  .classed("svg-content", true);

const dataset2 = d3.csv("boardgame_ratings.csv");

dataset2.then(function (data) {
  var slices = data.columns.slice(1).map(function (id) {
    return {
      id: id,
      values: data.map(function (d) {
        return {
          date: new Date(d.date),
          value: +d[id],
        };
      }),
    };
  });

  console.log(slices);
  let count_arr = [];
  let rank_arr = [];

  for (var i = 0; i < slices.length; i++) {
    if (i % 2 === 0) {
      count_arr.push(slices[i]);
    }
  }

  for (var i = 0; i < slices.length; i++) {
    if (i % 2 !== 0) {
      rank_arr.push(slices[i]);
    }
  }

  fin_arr = [];

  for (var i = 0; i < rank_arr.length; i++) {
    for (var j = 0; j < count_arr[i].values.length; j++) {
      count_arr[i].values[j].rank = rank_arr[i].values[j].value;
    }
  }

  console.log(count_arr);

  let id = 0;

  const xScale2 = d3.scaleTime().range([0, width]);
  const yScale2 = d3.scaleLog().rangeRound([height, 0]);
  xScale2.domain(
    d3.extent(data, function (d) {
      return new Date(d.date);
    })
  );

  yScale2.domain([
    1,
    d3.max(count_arr, function (c) {
      return d3.max(c.values, function (d) {
        return d.value + 3;
      });
    }),
  ]);

  const yaxis2 = d3
    .axisLeft()
    .ticks(count_arr[0].values.length / 4)
    .scale(yScale2);

  const xaxis2 = d3
    .axisBottom()
    .ticks(d3.timeMonth.every(3))
    .tickFormat(d3.timeFormat("%b %Y"))
    .scale(xScale2);

  const line2 = d3
    .line()
    .x(function (d) {
      return xScale2(d.date);
    })
    .y(function (d) {
      return yScale2(d.value);
    });

  const ids = function () {
    return "line-" + id++;
  };

  svg2
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xaxis2)
    .append("text")
    .attr("dx", ".2em")
    .attr("x", width / 2)
    .attr("y", 50)
    .style("text-anchor", "end")
    .style("font-size", 20)
    .text("Month");

  svg2
    .append("g")
    .attr("class", "axis")
    .call(yaxis2)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("dy", ".75em")
    .attr("y", -70)
    .attr("x", -height / 3)
    .style("text-anchor", "end")
    .style("font-size", 20)
    .text("Number of Ratings");

  svg2
    .append("g")
    .append("circle")
    .attr("cx", width + 60)
    .attr("cy", 500)
    .attr("r", 15)
    .style("opacity", 1)
    .style("fill", "black");

  svg2
    .append("g")
    .append("text")
    .attr("x", width + 60)
    .attr("y", 500)
    .style("opacity", 1)
    .style("fill", "red")
    .text("Rank");

  svg2
    .append("g")
    .append("text")
    .attr("x", width)
    .attr("y", 540)
    .style("opacity", 1)
    .style("fill", "black")
    .text("BoardGameGeekRank");

  const lines2 = svg2.selectAll("lines2").data(count_arr).enter().append("g");

  lines2
    .append("path")
    .attr("class", ids)
    .attr("d", function (d) {
      return line2(d.values);
    });

  lines2
    .append("text")

    .datum(function (d) {
      return {
        id: d.id,
        value: d.values[d.values.length - 1],
        rank: d.rank,
        col: d.id.split("=")[0].split(" ")[0].split(":")[0],
      };
    })
    .attr("transform", function (d) {
      return (
        "translate(" +
        (xScale2(d.value.date) + 15) +
        "," +
        (yScale2(d.value.value) + 25) +
        ")"
      );
    })
    .attr("class", function (d) {
      return d.col;
    })
    .attr("x", 5)
    .text(function (d) {
      return d.id.split("=")[0];
    });

  lines2
    .selectAll("points")
    .data(function (d) {
      let k = [];
      if (
        d.id === "Catan=count" ||
        d.id === "Codenames=count" ||
        d.id === "Terraforming Mars=count" ||
        d.id === "Gloomhaven=count"
      ) {
        for (var i = 2; i < d.values.length; i += 3) {
          k.push(d.values[i]);
          d.values[i].col = d.id.split("=")[0].split(" ")[0];
        }
      }

      console.log(k);
      return k;
    })
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale2(d.date);
    })
    .attr("cy", function (d) {
      return yScale2(d.value);
    })
    .attr("r", 15)
    .attr("class", function (d) {
      return d.col;
    })
    .style("opacity", 1);

  lines2
    .selectAll("circles")
    .data(function (d) {
      let k = [];
      if (
        d.id === "Catan=count" ||
        d.id === "Codenames=count" ||
        d.id === "Terraforming Mars=count" ||
        d.id === "Gloomhaven=count"
      ) {
        for (var i = 2; i < d.values.length; i += 3) {
          k.push(d.values[i]);
        }
      }

      console.log(k);
      return k;
    })
    .enter()
    .append("text")
    .attr("x", function (d) {
      return xScale2(d.date);
    })
    .attr("y", function (d) {
      return yScale2(d.value);
    })
    .text(function (d) {
      return d.rank;
    });
});
