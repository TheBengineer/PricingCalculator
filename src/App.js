import logo from './Logo/Price Calculator Logo.png';
import './App.css';
import {useEffect, useState} from "react";
import {getVmPriceData} from "./data";


function App() {
    const [vmPriceData, setVmPriceData] = useState([]);
    useEffect(() => {
        getVmPriceData(setVmPriceData);
    }, [setVmPriceData]);
    return (<div className="App">
        <div className="App-header">
            <img src={logo} className="App-logo" alt="Price Calculator Logo" width="40px"/>
            <h1>
                Price Calculator
            </h1>
        </div>
        <div>
            {vmPriceData.map((vm, index) => {
                    return (
                        <div key={index} className="vm">
                            <h2>{vm["name"]}</h2>
                            <h3>CPUs: {vm["vCpus"]}</h3>
                            <h3>Memory: {vm["memoryGB"]}</h3>
                            <h3>Price: {vm["hour"]}</h3>
                        </div>
                    );
                }
            )}

        </div>
    </div>);
}

export default App;
