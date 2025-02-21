/* Imports */
import { useLayoutEffect, useState } from 'react';
import { MapChart, geoOrthographic, MapPolygonSeries, getGeoRectangle, GraticuleSeries } from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from "@amcharts/amcharts5";
import { StyledTable } from './Map.styled';
import { Button } from 'antd';

function Map(props: any) {
    const [showTable, setShowTable] = useState(false);
    const [filteredData, setFilteredData] = useState<any[]>([]);

    const dataSource = [
        {
          key: '1',
          country: 'Brazil',
          customerId: 32,
          description: 'Cool product name',
          invoiceDate: '',
          invoiceNo: '',
          quantity: '',
          stockCode: '',
          unitPrice: '',
        },
        {
          key: '2',
          country: 'Brazil',
          customerId: 32,
          description: 'Cool product name',
          invoiceDate: '',
          invoiceNo: '',
          quantity: '',
          stockCode: '',
          unitPrice: '',
        },
      ];
      
      const columns = [
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
        },
        {
            title: 'Customer Id',
            dataIndex: 'customerId',
            key: 'customerId',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Invoice Date',
            dataIndex: 'invoiceDate',
            key: 'invoiceDate',
        },
        {
            title: 'Invoice No',
            dataIndex: 'invoiceNo',
            key: 'invoiceNo',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Stock Code',
            dataIndex: 'stockCode',
            key: 'stockCode',
        },
        {
            title: 'Unit Price',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
        },
    ];

    useLayoutEffect(() => {
        /* Chart code */
        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        let root = am5.Root.new("chartdiv");;

        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        // Create the map chart
        // https://www.amcharts.com/docs/v5/charts/map-chart/
        let chart = root.container.children.push(MapChart.new(root, {
            panX: "rotateX",
            panY: "rotateY",
            projection: geoOrthographic(),
            paddingBottom: 20,
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 20
        }));

        let grabSomeCoolData = (name: 'string') => {
            let countryData: any[] = [];
            props.data.forEach((entry: any) => {
                if (entry[0]['Country'] === name) {
                    //
                    entry.forEach((row: any, index: number) => {
                        countryData.push({
                            key: index,
                            country: row['Country'],
                            customerId: row['CustomerID'],
                            description: row['Description'],
                            invoiceDate: row['InvoiceDate'],
                            invoiceNo: row['InvoiceNo'],
                            quantity: row['Quantity'],
                            stockCode: row['StockCode'],
                            unitPrice: row['UnitPrice'],
                        })
                    })
                    setFilteredData(countryData);
                }
            });
        }

        // Create main polygon series for countries
        // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
        let polygonSeries = chart.series.push(MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow 
        }));

        polygonSeries.mapPolygons.template.setAll({
            tooltipText: "{name}",
            toggleKey: "active",
            interactive: true
        });

        polygonSeries.mapPolygons.template.states.create("hover", {
            fill: root.interfaceColors.get("primaryButtonHover")
        });

        polygonSeries.mapPolygons.template.states.create("active", {
            fill: root.interfaceColors.get("primaryButtonHover")
        });

        // Create series for background fill
        // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
        let backgroundSeries = chart.series.push(MapPolygonSeries.new(root, {}));
            backgroundSeries.mapPolygons.template.setAll({
            // fill: root.interfaceColors.get("alternativeBackground"),
            fill: am5.color('#1E90FF'),
            fillOpacity: 0.1,
            strokeOpacity: 0
        });
        backgroundSeries.data.push({
            geometry: getGeoRectangle(90, 180, -90, -180)
        });

        let graticuleSeries = chart.series.unshift(
            GraticuleSeries.new(root, {
                step: 10
            })
        );

        graticuleSeries.mapLines.template.set("strokeOpacity", 0.1)

        let handleDoubleClick = (element: any) => {
            grabSomeCoolData(element.dataItem.dataContext.name);
            setShowTable(true);
        }

        // Set up events
        let previousPolygon: any;
        let clickedElement: any;

        // Listens for double click
        polygonSeries.mapPolygons.template.on("active", function(active: any, target: any) {
            if (previousPolygon && previousPolygon != target) {
                previousPolygon.set("active", false);
            }
            if (target.get("active")) {
                selectCountry(target.dataItem.get("id"));
            }
            previousPolygon = target;
            if (clickedElement && clickedElement === target) {
                handleDoubleClick(clickedElement);
                // we're going to open a dialog here by setting open to true
                return;
            }
            clickedElement = target;
            setTimeout(function() {
                clickedElement = null;
            }, 300);
        });

        function selectCountry(id: any) {
            let dataItem = polygonSeries.getDataItemById(id);
            let target = dataItem?.get("mapPolygon");
            if (target) {
                let centroid = target.geoCentroid();
                if (centroid) {
                    chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
                    chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
                }
            }
        }

        // TODO: FINALLY!!!!! Got the colors working! Now set it to a different color that goes better with the blue and give the user
        // a key at the top so they know that the orange ones contain customers
        polygonSeries.events.on("datavalidated", function(ev) {
            ev.target.mapPolygons.each(function(polygon) {
                if (props.countries.includes(polygon.dataItem.dataContext.name)) {
                    polygon.adapters.add("fill", function(fill, target) {
                        return am5.color('#FFD700');
                    });
                }
            });
        });

        // Make stuff animate on load
        chart.appear(1000, 100);

        return () => {
            root.dispose();
        };
    }, []);

    return (
      <>
        {!showTable ? (
            <>
                <h1>Customer Map</h1>
                <div id="chartdiv"></div>
            </>
        ) : (
            <>
                <StyledTable dataSource={filteredData} columns={columns} />
            </>
        )}
      </>
    );
}

export default Map;