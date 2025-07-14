import csv
import json

input_file = "District_FloodImpact.csv"  # <-- Replace with your CSV file name
output_file = "india_flood.geojson"

features = []

with open(input_file, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        try:
            lat = float(row["Latitude"])
            lon = float(row["Longitude"])
        except (KeyError, ValueError):
            continue

        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lon, lat]
            },
            "properties": {
                "district": row.get("District"),
                "year": row.get("Year"),
                "area_affected": row.get("FloodedArea") or row.get("Impact")
            }
        }
        features.append(feature)

geojson = {
    "type": "FeatureCollection",
    "features": features
}

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(geojson, f, indent=2)

print(f"✅ Converted to {output_file}")
