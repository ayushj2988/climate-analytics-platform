import pandas as pd

print("Cleaning NASA Dataset...")

# Load raw NASA file
df = pd.read_csv("data/raw/nasa_raw.csv", skiprows=1)

# Clean column names
df.columns = df.columns.str.strip()

# Keep only required columns
df = df[["Year", "J-D"]]

# Rename for clarity
df.rename(columns={
    "Year": "year",
    "J-D": "temp_anomaly"
}, inplace=True)

# Convert to numeric
df["year"] = pd.to_numeric(df["year"], errors="coerce")
df["temp_anomaly"] = pd.to_numeric(df["temp_anomaly"], errors="coerce")

# Drop missing values
df = df.dropna().reset_index(drop=True)

# Save processed file
df.to_csv("data/processed/temperature.csv", index=False)

print("NASA Cleaning Done")
print("Shape:", df.shape)
print(df.head())