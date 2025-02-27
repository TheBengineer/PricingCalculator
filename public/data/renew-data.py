import csv
import json

import requests

if __name__ == "__main__":
    response = requests.get("https://gcloud-compute.com/machine-types-regions.csv?1736481191")
    decoded_content = response.content.decode('utf-8')
    with open("machine-types-regions.csv", "wb") as f:
        f.write(response.content)
    reader = csv.DictReader(decoded_content.splitlines(), delimiter=',')
    price_data = []
    for row in reader:
        for key in row:
            try:
                row[key] = float(row[key])
            except ValueError:
                pass
        price_data.append(row)
    with open("price_data.json", "w") as f:
        f.write(json.dumps(price_data))
