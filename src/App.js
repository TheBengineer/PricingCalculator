import logo from './Logo/Price Calculator Logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {useEffect, useState} from "react";
import {getVmPriceData} from "./data";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";


import {buildDatasets, buildOptions, PRICEvSPOT, ScatterChart, SCOREvPRICE} from "./chart";


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
    const [options, setOptions] = useState({});
    const [mode, setMode] = useState(PRICEvSPOT)


    useEffect(() => {
        getVmPriceData(setAllVmPriceData);
    }, []);
    useEffect(() => {
        const allRegionsOnContinent = Array.from(new Set(allVmPriceData.map(vm => vm["region"]).filter(region => continents.includes(region.split("-")[0]))));
        setAllContinentRegions(allRegionsOnContinent);
        setRegions(allRegionsOnContinent);
    }, [allVmPriceData, continents]);
    useEffect(() => {
        if (!(minCpus > 0)) {
            setMinMemory(0);
        }
        if (!(minMemory > 0)) {
            setMinMemory(0);
        }
        if (!(minCpuMemory > 0)) {
            setMinCpuMemory(0);
        }
        const newVmPriceData = allVmPriceData.filter(vm => vm["vCpus"] >= minCpus && vm["memoryGB"] >= minMemory && vm["memoryGB"] >= minCpuMemory * vm["vCpus"] && regions.includes(vm["region"]))
            .sort((a, b) => b["coremarkScore"] / b["hour"] - a["coremarkScore"] / a["hour"]);
        console.log("Filtered " + newVmPriceData.length + " VMs");
        setVmPriceData(newVmPriceData);
        setOptions(buildOptions(mode));
        setDatasets(buildDatasets(newVmPriceData, mode));
    }, [minCpus, minMemory, minCpuMemory, regions, allVmPriceData, mode]);


    return <div className="App">
        <div className="App-header">
            <img src={logo} className="App-logo" alt="Price Calculator Logo" width="40px"/>
            <h1>
                GCP VM Price Calculator
            </h1>
        </div>

        <Form>
            <Row>
                <div>The following Chart shows Google VM price performance using te following modes. Use the filters
                    below the chart to show only VMs suitable for your workflow. There is a table below with VM details.
                </div>
            </Row>
            <Row>
                <Col>
                    <ButtonGroup controlId="mode" style={{display: "flex"}}>
                        <ToggleButton type="checkbox"
                                      variant="outline-primary"
                                      id="mode-score-price"
                                      checked={mode === SCOREvPRICE}
                                      onChange={(e) => setMode(SCOREvPRICE)}
                                      value={SCOREvPRICE}>
                            Performance Vs Price
                        </ToggleButton>
                        <ToggleButton type="checkbox"
                                      id="mode-price-spot"
                                      variant="outline-primary"
                                      checked={mode === PRICEvSPOT}
                                      onChange={(e) => setMode(PRICEvSPOT)}
                                      value={PRICEvSPOT}>
                            Price performance vs Spot Price Performance
                        </ToggleButton>
                    </ButtonGroup>
                </Col>
            </Row>
            <div className="chart-container">
                <ScatterChart
                    options={options}
                    datasets={datasets}
                />
            </div>
            <h2>Filters</h2>
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
                    <Form.Group controlId="continents" id="continents">
                        <div>
                            <Form.Label column="">Continents</Form.Label>
                        </div>
                        <div className="check-row">
                            <Form.Check type="checkbox"
                                        label="All"
                                        id="cont-all"
                                        checked={continents.length === allContinents.length}
                                        onChange={(e) => {
                                            if (continents.length === allContinents.length) {
                                                setContinents([]);
                                            } else {
                                                setContinents(allContinents);
                                            }
                                        }}/>
                            <Form.Check type="checkbox"
                                        label="None"
                                        id="cont-none"
                                        checked={continents.length === 0}
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
                                    id={"cont-" + continent}
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
                            <Form.Check type="checkbox"
                                        label="All"
                                        id="region-all"
                                        checked={regions.length === allContinentRegions.length}
                                        onChange={(e) => {
                                            if (regions.length === allContinentRegions.length) {
                                                setRegions([]);
                                            } else {
                                                setRegions(allContinentRegions);
                                            }
                                        }}/>
                            <Form.Check type="checkbox"
                                        label="None"
                                        id="region-none"
                                        checked={regions.length === 0}
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
                                    id={"region-" + region}
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
                <th>Performance per Dollar</th>
                <th>Accelerator</th>
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
                    <td>{vm["coremarkScore"] / vm["hour"]}</td>
                    <td>{vm["acceleratorType"] && vm["acceleratorCount"] + "x" + vm["acceleratorType"]}</td>
                </tr>;
            })}
            </tbody>
        </table>
    </div>;
}

export default App;
