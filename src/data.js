export function getVmPriceData(setVmPriceData) {
    fetch("./data/price_data.json").then(response => response.json()).then(
        data => {
            setVmPriceData(data);
        }).then(() => {
            console.log("Data loaded");
        }
    ).catch(error => {
        console.error("Error loading data", error);
    });

}