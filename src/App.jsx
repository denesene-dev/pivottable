import { useEffect, useState } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import Plot from "react-plotly.js";
import "react-pivottable/pivottable.css";
import axios from "axios";

const PlotlyRenderers = createPlotlyRenderers(Plot);

export default function App() {
  const [state, setState] = useState({});
  const [pivotData, setPivotData] = useState([]);

  const getGraphData = async () => {
    const { data } = await axios.get(`https://dene-sene.net/api/GetProGraph`);
    console.log(data);
    const formattedData = data.map((item) => {
      const orderedValues = [
        item.MaritalStatus,
        item.HasChildren,
        item.EducationDegreeName,
        item.JobStatus,
        item.MonthlyIncomeDesc,
        item.HasPet,
        item.HasSocialMediaAccount,
        item.HouseStatus,
        item.Sex === "E" ? "Erkek" : "Kadın",
        item.BirthDate,
        item.CityId,
        item.LanguageId,
      ];
      return orderedValues;
    });

    const headers = [
      "Medeni Hal",
      "Çocuk",
      "Eğitim Seviyesi",
      "Mesleki Durum",
      "Aylık Gelir",
      "Evcil Hayvan",
      "Sosyal Medya",
      "Ev Durumu",
      "Cinsiyet",
      "Yaş",
      "Şehir",
      "Dil",
    ];

    const formattedOutput = [headers, ...formattedData];
    console.log(formattedOutput);
    setPivotData(formattedOutput);
  };

  useEffect(() => {
    getGraphData();
  }, []);

  return (
    <div id="wrapper">
      <PivotTableUI
        data={pivotData}
        onChange={(s) => setState(s)}
        renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
        {...state}
      />
    </div>
  );
}
