"""
NDVI Regression Analysis (2016–2020, Turkey)
--------------------------------------------
This script analyzes the relationship between climate variables and vegetation health
using Sentinel-1, Sentinel-2, MODIS, CHIRPS, and GLDAS datasets.
A linear regression model is applied to predict NDVI (Normalized Difference Vegetation Index)
based on temperature, precipitation, soil moisture, and radar backscatter values.
Author: Şevval Köntek
"""

# Import  libraries
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import OneHotEncoder

# 1. Load datasets
df_ndvi = pd.read_csv('Turkey_Monthly_Mean_NDVI_Sentinel2_2016_2020.csv')
df_temp = pd.read_csv('Turkey_Monthly_Mean_Temperature_2016_2020.csv')
df_vv = pd.read_csv('Turkey_Monthly_Sentinel1_VV_2016_2020.csv')
df_precip = pd.read_csv('Turkey_Monthly_Mean_Precip_2016_2020.csv')
df_soil_humidity = pd.read_csv('Turkey_GLDAS_Soil_And_Humidity_2016_2020.csv')

# 2. Merge datasets
df_temp_vv = pd.merge(df_temp, df_vv, on=['system:index', 'date'])
df_temp_vv_precip = pd.merge(df_temp_vv, df_precip, on=['system:index', 'date'])
df_full = pd.merge(
    df_temp_vv_precip,
    df_soil_humidity[['system:index', 'date', 'mean_soil_moisture', 'mean_specific_humidity']],
    on=['system:index', 'date']
)

# Remove unnecessary geo columns if they exist
df_full = df_full.drop(columns=[col for col in df_full.columns if '.geo' in col], errors='ignore')
df = pd.merge(df_ndvi, df_full, on=['system:index', 'date'])
df = df.drop(columns=[col for col in df.columns if '.geo' in col], errors='ignore')

# 3. Add land cover data
df_landcover = pd.read_csv("Turkey_Yearly_LandCover_2016_2020.csv")
df['year'] = df['date'].str.slice(0, 4).astype(int)
df = df.merge(df_landcover[['year', 'dominant_land_cover']], on='year', how='left')

# 4. Convert categorical land cover to numerical via one-hot encoding
encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
landcover_encoded = encoder.fit_transform(df[['dominant_land_cover']])
landcover_encoded_df = pd.DataFrame(landcover_encoded, columns=encoder.get_feature_names_out(['dominant_land_cover']))
df = pd.concat([df.reset_index(drop=True), landcover_encoded_df], axis=1)
df.drop(columns=['dominant_land_cover'], inplace=True)

# 5. Define model inputs (X) and target (y)
X = df[['mean_temp_K', 'mean_VV_backscatter', 'mean_precip_mm',
        'mean_soil_moisture', 'mean_specific_humidity'] + list(landcover_encoded_df.columns)]
y = df['mean_NDVI']

# 6. Split dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 7. Linear regression model
model = LinearRegression()
model.fit(X_train, y_train)

# 8. Predictions and error calculation
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

# Save predicted vs actual
result = pd.DataFrame({
    'Actual_NDVI': y_test,
    'Predicted_NDVI': y_pred
})

# 9. Add error columns to full dataset
df['error'] = abs(df['mean_NDVI'] - model.predict(X))
df['squared_error'] = (df['mean_NDVI'] - model.predict(X))**2

# 10. Handle missing values
print("Number of missing values:\n", df.isna().sum())
df = df.dropna()

# 11. Model performance metrics
print("-"*50)
print(f"Mean Squared Error: {mse:.6f}")
print(f"R² Score: {r2:.6f}")
print("-"*50)
print("Sample of Actual vs Predicted NDVI values:")
print(result.head())

# 12. Model coefficients
print("Model Coefficients:")
for feature, coef in zip(X.columns, model.coef_):
    print(f"{feature}: {coef:.4f}")
print(f"Intercept: {model.intercept_:.4f}")

# 13. Visualize coefficients
coef_df = pd.DataFrame({
    'Variable': X.columns,
    'Coefficient': model.coef_
}).sort_values(by='Coefficient', key=abs, ascending=False)
print(coef_df)

# Optional bar plot for coefficients
plt.figure(figsize=(8,6))
plt.barh(coef_df['Variable'], coef_df['Coefficient'], color='skyblue')
plt.xlabel('Coefficient Value')
plt.title('Linear Regression Coefficients')
plt.gca().invert_yaxis()
plt.tight_layout()
plt.show()

# 14. Correlation matrix
plt.figure(figsize=(10, 6))
sns.heatmap(df.corr(numeric_only=True), annot=True, cmap='coolwarm')
plt.title('Correlation Matrix')
plt.tight_layout()
plt.show()

# 15. Time series plot
df['date_parsed'] = pd.to_datetime(df['date'])
plt.figure(figsize=(12, 5))
sns.lineplot(data=df, x='date_parsed', y='mean_NDVI', label='Actual NDVI')
sns.lineplot(data=df, x='date_parsed', y=model.predict(X), label='Predicted NDVI')
plt.title('NDVI Time Series')
plt.xlabel('Date')
plt.ylabel('NDVI')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()

# 16. Scatter plot: Actual vs Predicted NDVI
plt.figure(figsize=(6, 6))
plt.scatter(df['mean_NDVI'], model.predict(X), alpha=0.5, label='Data Points')
plt.plot([df['mean_NDVI'].min(), df['mean_NDVI'].max()],
         [df['mean_NDVI'].min(), df['mean_NDVI'].max()],
         color='red', linestyle='--', label='y = x')
plt.xlabel('Actual NDVI')
plt.ylabel('Predicted NDVI')
plt.title('Actual vs Predicted NDVI')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
