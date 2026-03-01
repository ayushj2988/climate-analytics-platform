import pandas as pd
import matplotlib.pyplot as plt

# Load cleaned temperature dataset
df = pd.read_csv("data/processed/temperature.csv")

# Basic info
print(df.head())
print(df.describe())

# Plot Global Temperature Trend
plt.figure(figsize=(10, 5))
plt.plot(df["year"], df["temp_anomaly"])
plt.title("Global Temperature Anomaly (1880–Present)")
plt.xlabel("Year")
plt.ylabel("Temperature Anomaly (°C)")
plt.grid(True)

plt.show()



# Load emissions dataset
emissions = pd.read_csv("data/processed/emissions.csv")

# Select a country (change anytime)
country = "India"

country_df = emissions[emissions["country"] == country]

plt.figure(figsize=(10, 5))
plt.plot(country_df["year"], country_df["co2"])
plt.title(f"CO2 Emissions Trend - {country}")
plt.xlabel("Year")
plt.ylabel("CO2 Emissions")
plt.grid(True)

plt.show()



from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
import numpy as np

# Prepare data
X = df[["year"]]
y = df["temp_anomaly"]

# Create polynomial features (curve fitting)
poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(X)

# Train improved model
model = LinearRegression()
model.fit(X_poly, y)

# Future prediction till 2050
future_years = np.arange(2025, 2051).reshape(-1, 1)
future_poly = poly.transform(future_years)
predictions = model.predict(future_poly)

# Plot
plt.figure(figsize=(10, 5))
plt.plot(df["year"], df["temp_anomaly"], label="Actual Data")
plt.plot(future_years, predictions, linestyle="dashed", label="Polynomial Prediction (2025-2050)")
plt.title("Improved Global Temperature Prediction till 2050")
plt.xlabel("Year")
plt.ylabel("Temperature Anomaly (°C)")
plt.legend()
plt.grid(True)
plt.show()