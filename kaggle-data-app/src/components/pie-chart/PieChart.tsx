/* Imports */
import { useLayoutEffect } from 'react';
import { PieChart, PieSeries } from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from "@amcharts/amcharts5";

/* Chart code */
function DividedPieChart(props: any) {
    useLayoutEffect(() => {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    let root = am5.Root.new("chartdiv");


    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
        am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    let chart = root.container.children.push(PieChart.new(root, {
        layout: root.verticalLayout,
        radius: am5.percent(70),
        
    }));


    // Create series
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
    let series = chart.series.push(PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false
    }));


    // Set data
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
    // series.data.setAll([
    //     { value: 10, category: "One" },
    //     { value: 9, category: "Two" },
    //     { value: 6, category: "Three" },
    //     { value: 5, category: "Four" },
    //     { value: 4, category: "Five" },
    //     { value: 3, category: "Six" },
    //     { value: 1, category: "Seven" }
    // ]);
    series.data.setAll(props.data);

    // Create legend
    // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
    let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
    }));

    series.labels.template.setAll({
        text: "{category}"
    });

    series.events.on("datavalidated", function() {
        am5.array.each(series.dataItems, function(dataItem) {
          if (dataItem.get("category") == "United Kingdom") {
            dataItem.hide();
            legend.data.push(dataItem);
          } else if (dataItem.get("value") <= 2000) {
            dataItem.hide();
            legend.data.push(dataItem);
            console.log('okay: ', dataItem);
          }
          else {
            legend.data.push(dataItem);
          }
        })
    });

    // Play initial series animation
    // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
    series.appear(1000, 100);

        return () => {
            root.dispose();
        };
    }, []);

    return (
        <>
          <h1>Profit Margin</h1>
          <div id="chartdiv"></div>
        </>
    );
}
export default DividedPieChart;