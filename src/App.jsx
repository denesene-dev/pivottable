import { useEffect, useState } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import Plot from "react-plotly.js";
import "react-pivottable/pivottable.css";
import axios from "axios";

const PlotlyRenderers = createPlotlyRenderers(Plot);

const api = axios.create({
  baseURL: "https://dene-sene.net/api",
});

export default function App() {
  const [state, setState] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [pivotData, setPivotData] = useState([]);

  const getGraphData = async (controller) => {
    try {
      setIsDataLoading(true);
      const { data } = await api.get("/GetProGraph", {
        signal: controller.signal,
      });
      console.log(data);
      const formattedData = data.map((item) => {
        const orderedValues = [
          item.MaritalStatus,
          item.HasChildren,
          item.EducationDegreeName,
          item.JobStatus === "E" ? "Çalışıyor" : "Çalışmıyor",
          item.MonthlyIncomeDesc,
          item.HasPet,
          item.HasSocialMediaAccount === "1"
            ? "Sosyal Medya Kullanıyor"
            : "Sosyal Medya Kullanmıyor",
          item.HouseStatus === "S" ? "Ev Sahibi" : "Kiracı",
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
    } catch (e) {
      if (!axios.isCancel(e)) alert("Bir sorun oluştu!");
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getGraphData(controller);
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div id="wrapper">
      {isDataLoading ? (
        "Veri getiriliyor.."
      ) : (
        <PivotTableUI
          data={pivotData}
          onChange={(s) => setState(s)}
          renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
          {...state}
        />
      )}
    </div>
  );
}
