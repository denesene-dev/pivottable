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

const calculateAge = (BirthDate) => {
  const currentDate = new Date();
  const birthDate = new Date(BirthDate);

  const ageInMilliseconds = currentDate - birthDate;
  const ageInYears = Math.floor(
    ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000)
  );

  if (ageInYears < 20) {
    return "18-19";
  } else if (ageInYears === 20 || ageInYears < 25) {
    return "20-24";
  } else if (ageInYears === 25 || ageInYears < 30) {
    return "25-29";
  } else if (ageInYears === 30 || ageInYears < 35) {
    return "30-34";
  } else if (ageInYears === 35 || ageInYears < 40) {
    return "35-39";
  } else if (ageInYears === 40 || ageInYears < 45) {
    return "40-44";
  } else if (ageInYears === 45 || ageInYears < 50) {
    return "45-49";
  } else if (ageInYears === 50 || ageInYears < 55) {
    return "50-54";
  } else {
    return "Gruplandırılamadı";
  }
};

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
          item.MaritalStatus === "B" ? "Bekar" : "Evli",
          item.HasChildren === "1" ? "Var" : "Yok",
          item.EducationDegreeName,
          item.JobStatus === "E" ? "Çalışıyor" : "Çalışmıyor",
          item.MonthlyIncomeDesc,
          item.HasPet === "E" ? "Var" : "Yok",
          item.HasSocialMediaAccount === "1"
            ? "Sosyal Medya Kullanıyor"
            : "Sosyal Medya Kullanmıyor",
          item.HouseStatus === "S" ? "Ev Sahibi" : "Kiracı",
          item.Sex === "E" ? "Erkek" : "Kadın",
          calculateAge(item.BirthDate),
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
        <div id="wifi-loader">
          <svg class="circle-outer" viewBox="0 0 86 86">
            <circle class="back" cx="43" cy="43" r="40"></circle>
            <circle class="front" cx="43" cy="43" r="40"></circle>
            <circle class="new" cx="43" cy="43" r="40"></circle>
          </svg>
          <svg class="circle-middle" viewBox="0 0 60 60">
            <circle class="back" cx="30" cy="30" r="27"></circle>
            <circle class="front" cx="30" cy="30" r="27"></circle>
          </svg>
          <svg class="circle-inner" viewBox="0 0 34 34">
            <circle class="back" cx="17" cy="17" r="14"></circle>
            <circle class="front" cx="17" cy="17" r="14"></circle>
          </svg>
          <div class="text" data-text="Veri Getiriliyor..."></div>
        </div>
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
