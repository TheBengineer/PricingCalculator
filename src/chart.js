import {Bubble} from "react-chartjs-2";
import {Chart as ChartJS, Legend, registerables, Tooltip} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(...registerables);
ChartJS.register(Tooltip, Legend);
ChartJS.register(zoomPlugin);

export const SCOREvPRICE = 0;
export const PRICEvSPOT = 1;

const tooltip = {
    callbacks: {
        label: function (context) {
            const label = [];
            let secondRow = "";
            if (!context.dataset.data[context.dataIndex].label) {
                return "";
            }
            label.push(context.dataset.data[context.dataIndex].label);
            secondRow += `Region: ${context.dataset.data[context.dataIndex].region}, vCpus: ${context.dataset.data[context.dataIndex].vCpus}, Mem: ${context.dataset.data[context.dataIndex].memoryGB}GB, Score: ${context.dataset.data[context.dataIndex].coremarkScore}, Price: ${context.dataset.data[context.dataIndex].price}, Spot: ${context.dataset.data[context.dataIndex].spot}`;
            secondRow += context.dataset.data[context.dataIndex].accelerator ? `, Accelerator: ${context.dataset.data[context.dataIndex].accelerator}` : "";
            label.push(secondRow);
            return label;
        }
    }
};

export function buildOptions(mode) {
    let xLabel;
    let yLabel;
    let xCallback;

    switch (mode) {
        case SCOREvPRICE:
            xLabel = "Coremark Score per vCPU Core";
            yLabel = "Price per vCPU Core";
            xCallback = function (value, index, values) {
                return "$" + value.toFixed(3);
            };
            break;
        case PRICEvSPOT:
            xLabel = "Performance per Dollar";
            yLabel = "Spot Performance per Dollar";
            xCallback = function (value, index, values) {
                return value.toLocaleString();
            };
            break;
        default:
            xLabel = "Coremark Score per vCPU Core";
            yLabel = "Price per vCPU Core";
            xCallback = function (value, index, values) {
                return value.toLocaleString();
            };
    }


    return {
        responsive: true,
        maintainAspectRatio: false, // Add this to allow custom width and height
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true // SET SCROOL ZOOM TO TRUE
                    }, mode: "x", speed: 100
                }, pan: {
                    enabled: true, mode: "x", speed: 100
                }
            }, legend: {
                position: 'top',
                labels: {
                    color: 'black' // Legend text color for dark mode
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: 'black', // X-axis text color for dark mode
                    callback: xCallback
                }, grid: {
                    color: 'rgba(10, 10, 10, 0.2)' // X-axis grid line color
                }, title: {
                    display: true,
                    text: xLabel
                }
            }, y: {
                ticks: {
                    color: 'black' // Y-axis text color for dark mode
                }, grid: {
                    color: 'rgba(10, 10, 10, 0.2)' // Y-axis grid line color
                }, title: {
                    display: true,
                    text: yLabel
                }
            },
        }
    };
}

export function buildDatasets(data, mode) {
    const vmFamilies = new Set(data.map(vm => vm["name"].split("-")[0]));
    let xVal;
    let yVal;
    let rVal;
    switch (mode) {
        case SCOREvPRICE + 11:
            xVal = (vm) => vm["coremarkScore"] / vm["vCpus"];
            yVal = (vm) => vm["hour"];
            rVal = (vm) => vm["memoryGB"];
            break;
        case PRICEvSPOT:
            xVal = (vm) => vm["coremarkScore"] / vm["hour"];
            yVal = (vm) => vm["coremarkScore"] / vm["hourSpot"];
            rVal = (vm) => Math.log(vm["vCpus"]);
            break;
        default:
            xVal = (vm) => vm["coremarkScore"] / vm["vCpus"];
            yVal = (vm) => vm["hour"];
            rVal = (vm) => vm["memoryGB"];
            break;
    }


    return {
        datasets: [...vmFamilies].map(family => {
            return {
                label: family,
                data: data.filter(vm => vm["name"].startsWith(family)).map(vm => {
                    return {
                        x: xVal(vm),
                        y: yVal(vm),
                        r: rVal(vm),
                        label: vm["name"],
                        series: vm["name"].split("-")[0],
                        region: vm["region"],
                        vCpus: vm["vCpus"],
                        memoryGB: vm["memoryGB"],
                        coremarkScore: vm["coremarkScore"],
                        hour: vm["hour"],
                        price: `$${vm["hour"]}`,
                        spot: `$${vm["hourSpot"]}`,
                        accelerator: vm["acceleratorType"] ? vm["acceleratorCount"] + "x" + vm["acceleratorType"] : ""
                    };
                }),
                tooltip: tooltip
            };
        })
    };
}


export function ScatterChart({options, datasets}) {

    return (
        <Bubble
            className="chart"
            data={datasets}
            options={options}
        />
    );
}