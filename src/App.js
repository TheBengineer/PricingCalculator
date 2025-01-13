import logo from './Logo/Price Calculator Logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {useEffect, useState} from "react";
import {getVmPriceData} from "./data";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


function App() {
    const [allVmPriceData, setAllVmPriceData] = useState([]);
    const [vmPriceData, setVmPriceData] = useState([]);
    const [minCpus, setMinCpus] = useState(4);
    const [minCpuMemory, setMinCpuMemory] = useState(2);
    const [minMemory, setMinMemory] = useState(8);
    const [continents, setContinents] = useState(["us"]);
    const allContinents = ['africa', 'asia', 'australia', 'europe', 'me', 'northamerica', 'southamerica', 'us'];
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
        setVmPriceData(allVmPriceData.filter(vm =>
            vm["vCpus"] >= minCpus &&
            vm["memoryGB"] >= minMemory &&
            vm["memoryGB"] >= minCpuMemory * vm["vCpus"] &&
            continents.includes(vm["region"].split("-")[0])
        ).sort((a, b) => a["hour"] - b["hour"]));
    }, [minCpus, minMemory, minCpuMemory, allVmPriceData]);
    return (<div className="App">
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
                                    return (
                                        <Form.Check
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
                                        />
                                    );
                                })}
                            </div>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <table className='vm-table'>
                <thead>
                <tr>
                    <th>VM Name</th>
                    <th>CPUs</th>
                    <th>Memory</th>
                    <th>Hour Price</th>
                </tr>
                </thead>
                {vmPriceData.map((vm, index) => {
                        return (
                            <tr key={index} className="vm-row">
                                <td>{vm["name"]}</td>
                                <td>{vm["vCpus"]}</td>
                                <td>{vm["memoryGB"]}</td>
                                <td>{vm["hour"]}</td>
                            </tr>
                        );
                    }
                )}

            </table>
        </div>
    );
}

export default App;
