/* Imports */
import { useLayoutEffect, useState } from 'react';
import { MapChart, geoOrthographic, MapPolygonSeries, getGeoRectangle, GraticuleSeries } from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from "@amcharts/amcharts5";
import { StyledTable } from './Map.styled';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';

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
                console.log('huh: ', entry[0]['Country']);
                if (entry[0]['Country'] === name) {
                    console.log('YAYYYY: ', entry);
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

        // TODO: okay so we just need to modify this!!! Iterate through this really quickly with a for each and 
        // create a new data structure that is identical to this but within properties includes the # of invoices
        // So a simple for each, pulling up the country name, comparing it to our list of countries, and modifying 
        // properties to include that value if so!! Easy
        // Create main polygon series for countries
        // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
        let polygonSeries = chart.series.push(MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow 
        }));

        polygonSeries.mapPolygons.template.setAll({
            tooltipText: "{name} \n # of orders in {name}",
            toggleKey: "active",
            interactive: true
        });

        console.log('test: ', am5geodata_worldLow);

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
            fill: root.interfaceColors.get("alternativeBackground"),
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
            console.log('clicked element: ', element.dataItem, element.dataItem.get("id"), element.dataItem.dataContext.name);

            grabSomeCoolData(element.dataItem.dataContext.name);
            setShowTable(true);
        }

        // Set up events
        let previousPolygon: any;
        let clickedElement: any;

        // TODO: we want a function just like this but on double click to trigger the dialog
        // Make this an MUI dialog and import it and just return it in the base of this component
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
            console.log('cool!!! ');
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
                <div id="chartdiv" style={{ width: "100%", height: "80%" }}></div>
            </>
        ) : (
            <StyledTable dataSource={filteredData} columns={columns} />
        )}
      </>
    );
}

export default Map;