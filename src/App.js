import logo from './Logo/Price Calculator Logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {useEffect, useState} from "react";
import {getVmPriceData} from "./data";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Chart as ChartJS, Legend, registerables, Tooltip} from "chart.js";
import {Bubble} from "react-chartjs-2";
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(...registerables);
ChartJS.register(Tooltip, Legend);
ChartJS.register(zoomPlugin);


function App() {
    const [allVmPriceData, setAllVmPriceData] = useState([]);
    const [vmPriceData, setVmPriceData] = useState([]);
    const [minCpus, setMinCpus] = useState(4);
    const [minCpuMemory, setMinCpuMemory] = useState(2);
    const [minMemory, setMinMemory] = useState(8);
    const [continents, setContinents] = useState(["us"]);
    const allContinents = ['africa', 'asia', 'australia', 'europe', 'me', 'northamerica', 'southamerica', 'us'];
    const [datasets, setDatasets] = useState({datasets: []});

    function buildDatasets(data) {
        const vmFamilies = new Set(data.map(vm => vm["name"].split("-")[0]));
        console.log("filter", data, vmFamilies);
        const datasets = {
            datasets: [...vmFamilies].map(family => {
                return {
                    label: family,
                    data: data.filter(vm => vm["name"].startsWith(family)).map(vm => {
                        return {
                            x: vm["hour"] / vm["vCpus"],
                            y: vm["coremarkScore"],
                            r: vm["memoryGB"] / vm["vCpus"],
                            label: vm["name"],
                            series: vm["name"].split("-")[0],
                            region: vm["region"],
                            vCpus: vm["vCpus"],
                            memoryGB: vm["memoryGB"],
                            coremarkScore: vm["coremarkScore"],
                            hour: vm["hour"],
                            price: `$${vm["hour"]}`,
                        };
                    }),
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                var label = context.dataset.data[context.dataIndex].label || '';

                                if (label) {
                                    label += ': ';
                                }
                                label += `vCPUs: ${context.dataset.data[context.dataIndex].vCpus}, Memory: ${context.dataset.data[context.dataIndex].memoryGB}GB, Benchmark Score: ${context.dataset.data[context.dataIndex].coremarkScore}`;
                                label += `, Price: ${context.dataset.data[context.dataIndex].price}`;
                                return label;
                            },
                            title: function (context) {
                                return context[0].dataset.label;
                            }
                        }
                    }
                };
            })
        };
        console.log("Datasets", datasets);
        setDatasets(datasets);
    }

    useEffect(() => {
        getVmPriceData(setAllVmPriceData);
    }, [setAllVmPriceData]);
    useEffect(() => {
        console.log("Filtering VMs");
        if (!(minCpus > 0)) {
            setMinMemory(0);
        }
        if (!(minMemory > 0)) {
            setMinMemory(0);
        }
        if (!(minCpuMemory > 0)) {
            setMinCpuMemory(0);
        }
        const newVmPriceData = allVmPriceData.filter(vm => vm["vCpus"] >= minCpus && vm["memoryGB"] >= minMemory && vm["memoryGB"] >= minCpuMemory * vm["vCpus"] && continents.includes(vm["region"].split("-")[0])).sort((a, b) => a["hour"] - b["hour"]);
        setVmPriceData(newVmPriceData);
        buildDatasets(newVmPriceData);
    }, [minCpus, minMemory, minCpuMemory, allVmPriceData, continents]);


    return <div className="App">
        <div className="App-header">
            <img src={logo} className="App-logo" alt="Price Calculator Logo" width="40px"/>
            <h1>
                GCP VM Price Calculator
            </h1>
        </div>
        <Form>
            <Row>
                <h2>Filters</h2>
                <div>Use the filters below to select what VMs are suitable for your workload</div>
            </Row>
            <br className="horiz"/>
            <Row>
                <Col>
                    <Form.Group controlId="minCpus">
                        <Form.Label column="">Minimum vCPU Cores</Form.Label>
                        <Form.Control type="number"
                                      value={minCpus}
                                      onChange={(e) => setMinCpus(e.target.value)}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="minCpuMemory">
                        <Form.Label column="">Min Memory per Core</Form.Label>
                        <Form.Control type="number"
                                      value={minCpuMemory}
                                      onChange={(e) => setMinCpuMemory(e.target.value)}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="minMemory">
                        <Form.Label column="">Min memory overall</Form.Label>
                        <Form.Control type="number"
                                      value={minMemory}
                                      onChange={(e) => setMinMemory(e.target.value)}/>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="continents">
                        <div>
                            <Form.Label column="">Continents</Form.Label>
                        </div>
                        <div className="continents">
                            <Form.Check type="checkbox" label="All"
                                        checked={continents.length === allContinents.length}
                                        onChange={(e) => {
                                            if (continents.length === allContinents.length) {
                                                setContinents([]);
                                            } else {
                                                setContinents(allContinents);
                                            }
                                        }}/>
                            <Form.Check type="checkbox" label="None" checked={continents.length === 0}
                                        onChange={(e) => {
                                            if (continents.length === 0) {
                                                setContinents(allContinents);
                                            } else {
                                                setContinents([]);
                                            }
                                        }}/>

                        </div>
                        <div className="continents">
                            {allContinents.map((continent, index) => {
                                return <Form.Check
                                    key={index}
                                    type="checkbox"
                                    label={continent}
                                    checked={continents.includes(continent)}
                                    onChange={(e) => {
                                        if (continents.includes(continent)) {
                                            setContinents(continents.filter(c => c !== continent));
                                        } else {
                                            setContinents([...continents, continent]);
                                        }
                                    }}
                                />;
                            })}
                        </div>
                    </Form.Group>
                </Col>
            </Row>
        </Form>
        <div className="chart-container">
            <Bubble
                className="chart"
                data={datasets}
                options={{
                    responsive: true,
                    maintainAspectRatio: false, // Add this to allow custom width and height
                    plugins: {
                        zoom: {
                            zoom: {
                                wheel: {
                                    enabled: true // SET SCROOL ZOOM TO TRUE
                                },
                                mode: "x",
                                speed: 100
                            },
                            pan: {
                                enabled: true,
                                mode: "x",
                                speed: 100
                            }
                        },
                        legend: {
                            position: 'top',
                            labels: {
                                color: 'white' // Legend text color for dark mode
                            }
                        },
                        title: {
                            display: false,
                        },
                        tooltip: {
                            bodyColor: 'white', // Tooltip text color
                            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Tooltip background color
                            borderColor: 'white', // Tooltip border color
                            borderWidth: 1,
                            callbacks: {
                                label: function (data) {
                                    return data.dataset.label + ': (' + new Date(data.parsed.x).toLocaleTimeString() + ', ' + data.parsed.y + ')';
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: 'white', // X-axis text color for dark mode
                                callback: function (value, index, values) {
                                    return new Date(value).toLocaleString(); // Format X-axis time
                                }
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.2)' // X-axis grid line color
                            }
                        },
                        y: {
                            ticks: {
                                color: 'white' // Y-axis text color for dark mode
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.2)' // Y-axis grid line color
                            }
                        }
                    }
                }}
            />
        </div>

        <table className='vm-table'>
            <thead>
            <tr>
                <th>Region</th>
                <th>VM Name</th>
                <th>CPUs</th>
                <th>Memory</th>
                <th>Benchmark Score</th>
                <th>Price per Hour</th>
            </tr>
            </thead>
            <tbody>
            {vmPriceData.map((vm, index) => {
                return <tr key={index} className="vm-row">
                    <td>{vm["region"]}</td>
                    <td>{vm["name"]}</td>
                    <td>{vm["vCpus"]}</td>
                    <td>{vm["memoryGB"]}</td>
                    <td>{vm["coremarkScore"]}</td>
                    <td>${vm["hour"]}</td>
                </tr>;
            })}
            </tbody>
        </table>
    </div>
        ;
}

export default App;
