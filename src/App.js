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
    const [allContinentRegions, setAllContinentRegions] = useState([]);
    const [regions, setRegions] = useState([]);
    const [datasets, setDatasets] = useState({datasets: []});

    function buildDatasets(data) {
        const vmFamilies = new Set(data.map(vm => vm["name"].split("-")[0]));
        const datasets = {
            datasets: [...vmFamilies].map(family => {
                return {
                    label: family,
                    data: data.filter(vm => vm["name"].startsWith(family)).map(vm => {
                        return {
                            x: vm["hour"] / vm["vCpus"],
                            y: vm["coremarkScore"] / vm["vCpus"],
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
                                const label = [];
                                let secondRow = "";
                                if (!context.dataset.data[context.dataIndex].label) {
                                    return "";
                                }
                                label.push(context.dataset.data[context.dataIndex].label);
                                secondRow += `Region: ${context.dataset.data[context.dataIndex].region}, vCpus: ${context.dataset.data[context.dataIndex].vCpus}, Mem: ${context.dataset.data[context.dataIndex].memoryGB}GB, Score: ${context.dataset.data[context.dataIndex].coremarkScore}, Price: ${context.dataset.data[context.dataIndex].price}`;
                                label.push(secondRow);
                                return label;
                            },
                            title: function (context) {
                                return "asdfasdf";
                            }
                        }
                    }
                };
            })
        };
        setDatasets(datasets);
    }

    function updateRegions() {
        const allRegionsOnContinent = Array.from(new Set(allVmPriceData.map(vm => vm["region"]).filter(region => continents.includes(region.split("-")[0]))));
        setAllContinentRegions(allRegionsOnContinent);
        setRegions(allRegionsOnContinent);
        console.log("All regions", allRegionsOnContinent);
    }

    function filterVms() {
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
        const newVmPriceData = allVmPriceData.filter(vm => vm["vCpus"] >= minCpus && vm["memoryGB"] >= minMemory && vm["memoryGB"] >= minCpuMemory * vm["vCpus"] && regions.includes(vm["region"])).sort((a, b) => a["hour"] - b["hour"]);
        setVmPriceData(newVmPriceData);
        buildDatasets(newVmPriceData);
    }

    useEffect(() => {
        getVmPriceData(setAllVmPriceData);
    }, []);
    useEffect(() => {
        updateRegions();
        filterVms();
    }, [allVmPriceData]);
    useEffect(() => {
        updateRegions();
    }, [continents]);
    useEffect(() => {
        filterVms();
    }, [minCpus, minMemory, minCpuMemory, regions]);


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
                                display: true,
                            },
                        },
                        scales: {
                            x: {
                                ticks: {
                                    color: 'black', // X-axis text color for dark mode
                                    callback: function (value, index, values) {
                                        return "$" + value.toFixed(3); // Format X-axis time
                                    }
                                },
                                grid: {
                                    color: 'rgba(10, 10, 10, 0.2)' // X-axis grid line color
                                },
                                title: {
                                    display: true,
                                    text: 'Price per vCPU Core' // X-axis title
                                }
                            },
                            y: {
                                ticks: {
                                    color: 'black' // Y-axis text color for dark mode
                                },
                                grid: {
                                    color: 'rgba(10, 10, 10, 0.2)' // Y-axis grid line color
                                },
                                title: {
                                    display: true,
                                    text: 'Coremark Score per vCPU Code' // Y-axis title
                                }
                            }
                        }
                    }}
                />
            </div>
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
                        <div className="check-row">
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
                        <div className="check-row">
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
            <Row>
                <Col>
                    <Form.Group controlId="regions">
                        <div className="check-row">
                            <Form.Label column="">Regions</Form.Label>
                        </div>
                        <div className="check-row">
                            <Form.Check type="checkbox" label="All"
                                        checked={regions.length === allContinentRegions.length}
                                        onChange={(e) => {
                                            if (regions.length === allContinentRegions.length) {
                                                setRegions([]);
                                            } else {
                                                setRegions(allContinentRegions);
                                            }
                                        }}/>
                            <Form.Check type="checkbox" label="None" checked={regions.length === 0}
                                        onChange={(e) => {
                                            if (regions.length === 0) {
                                                setRegions(allContinentRegions);
                                            } else {
                                                setRegions([]);
                                            }
                                        }}/>
                        </div>
                        <div className="check-row">
                            {allContinentRegions.map((region, index) => {
                                return <Form.Check
                                    key={index}
                                    type="checkbox"
                                    label={region}
                                    checked={regions.includes(region)}
                                    onChange={(e) => {
                                        if (regions.includes(region)) {
                                            setRegions(regions.filter(c => c !== region));
                                        } else {
                                            setRegions([...regions, region]);
                                        }
                                    }}
                                />;
                            })}
                        </div>
                    </Form.Group>
                </Col>
            </Row>
        </Form>


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
