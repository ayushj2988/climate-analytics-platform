from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data_loader import (
    get_all_countries,
    get_emissions_by_country,
    get_global_temperature,
    get_top_emitters,
    get_emissions_trend,
)

app = FastAPI(title="Climate Analytics API")

# Allow frontend to access API (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Climate Change Analytics API is running 🚀"}


@app.get("/countries")
def countries():
    return {"countries": get_all_countries()}


@app.get("/temperature")
def temperature():
    return {"data": get_global_temperature()}


@app.get("/emissions/{country}")
def emissions_country(country: str):
    data = get_emissions_by_country(country)
    return {"country": country, "data": data}


@app.get("/top-emitters/{year}")
def top_emitters(year: int):
    return {"year": year, "top_emitters": get_top_emitters(year)}


@app.get("/trend/{country}")
def emissions_trend(country: str):
    return {"country": country, "trend": get_emissions_trend(country)}