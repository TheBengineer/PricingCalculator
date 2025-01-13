
export function getVmPriceData(setVmPriceData) {
    fetch("./data/machine-types-regions.csv").then(
        response => response.text()
    ).then(
        text => {
            const lines = text.split("\n");
            const data = [];
            const headers = lines[0].split(",");
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(",");
                const obj = {};
                for (let j = 0; j < values.length; j++) {
                    obj[headers[j]] = values[j];
                }
                data.push(obj);
            }
            console.log("loaded data", data);
            setVmPriceData(data);
        }
    )
}