import pandas as pd

# Load datasets once (important for performance)
temperature_df = pd.read_csv("../data/processed/temperature.csv")
emissions_df = pd.read_csv("../data/processed/emissions.csv")

# Ensure correct datatypes
temperature_df["year"] = temperature_df["year"].astype(int)
emissions_df["year"] = emissions_df["year"].astype(int)


def get_all_countries():
    countries = sorted(emissions_df["country"].unique().tolist())
    return countries


def get_emissions_by_country(country: str):
    df = emissions_df[emissions_df["country"] == country]
    return df.to_dict(orient="records")


def get_global_temperature():
    return temperature_df.to_dict(orient="records")


def get_top_emitters(year: int):
    df = emissions_df[emissions_df["year"] == year]
    df = df.sort_values(by="co2", ascending=False).head(10)
    return df[["country", "co2"]].to_dict(orient="records")


def get_emissions_trend(country: str):
    df = emissions_df[emissions_df["country"] == country]
    return df[["year", "co2", "co2_per_capita", "methane"]].to_dict(orient="records")