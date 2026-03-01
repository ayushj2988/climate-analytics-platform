import pandas as pd

print("Cleaning Emissions Dataset (RAW with iso_code)...")

# Load raw emissions dataset
df = pd.read_csv("data/raw/emission_raw.csv")

print("Original Shape:", df.shape)

# Keep only important columns (resume + analytics ready)
columns_needed = [
    "iso_code",
    "country",
    "year",
    "co2",
    "co2_per_capita",
    "methane",
    "ghg",
    "population"
]

# Keep only columns that exist
columns_existing = [col for col in columns_needed if col in df.columns]
df = df[columns_existing]

# Remove OWID aggregates using iso_code (MOST IMPORTANT STEP)
# Removes: World, Asia, Europe, income groups, etc.
df = df[df["iso_code"].notna()]
df = df[~df["iso_code"].str.startswith("OWID")]

# Remove Antarctica (not useful for analytics)
df = df[df["country"] != "Antarctica"]

# Filter modern data (better visuals + faster queries)
df = df[df["year"] >= 1960]

# Handle missing values safely
df = df.dropna(subset=["co2"])  # CO2 is core metric
df["methane"] = df["methane"].fillna(0)
df["population"] = df["population"].fillna(method="ffill")

# Fix datatypes
df["year"] = df["year"].astype(int)
df["co2"] = df["co2"].astype(float)
df["co2_per_capita"] = df["co2_per_capita"].astype(float)

# Sort for time-series (important for ML + API)
df = df.sort_values(by=["country", "year"]).reset_index(drop=True)

# Save final production dataset
df.to_csv("data/processed/emissions.csv", index=False)

print("Emissions Cleaning Done")
print("Final Shape:", df.shape)
print("Unique Countries:", df["country"].nunique())
print(df.head())