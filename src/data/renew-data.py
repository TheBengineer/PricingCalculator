import requests

if __name__ == "__main__":
    response = requests.get("https://gcloud-compute.com/machine-types-regions.csv?1736481191")
    with open("machine-types-regions.csv", "wb") as f:
        f.write(response.content)
