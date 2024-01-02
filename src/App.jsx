import { useState } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import Plot from "react-plotly.js";
import data from "./data";
import "react-pivottable/pivottable.css";

const PlotlyRenderers = createPlotlyRenderers(Plot);

export default function App() {
  const [state, setState] = useState({});

  return (
    <div id="wrapper">
      <PivotTableUI
        data={data}
        onChange={(s) => setState(s)}
        renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
        {...state}
      />
    </div>
  );
}
