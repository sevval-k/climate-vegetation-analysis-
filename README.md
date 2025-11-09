# Climate and Vegetation Analysis (Turkey, 2016–2020)
Integrating remote sensing and machine learning to analyze the impact of climate change on vegetation health in Turkiye. (2016–2020)

## Project Overview
This project aims to analyze the impacts of climate change on vegetation health in Turkey during 2016–2020. It combines NDVI (Normalized Difference Vegetation Index) data from Sentinel-2 with key climate and environmental parameters, including temperature, precipitation, soil moisture, and Sentinel-1 radar backscatter, to study temporal and spatial changes in vegetation health.

Land cover data has also been incorporated to evaluate its influence on vegetation using statistical models. The linear regression-based machine learning model developed predicts NDVI from climate and land cover variables, providing insights for sustainable agriculture and environmental management. The project is designed to offer data-driven recommendations to farmers for irrigation planning, crop selection, and optimized agricultural practices under changing climate conditions.

## Problem Statement
The effects of climate change on agriculture are becoming increasingly evident and require urgent intervention. Temperature fluctuations, changing precipitation patterns, and extreme weather events such as droughts, floods, and frost threaten agricultural production, reduce crop yields, and negatively impact soil and water resources.

## Machine Learning Integration and Analysis
Machine learning models were employed to study the relationship between climate variables and vegetation health.

### Datasets Used
- **Sentinel-2 NDVI:** Indicator of vegetation health
- **Sentinel-1 VV Radar:** Provides information on soil structure and moisture content
- **CHIRPS Precipitation Data**
- **MOD11A1 Temperature Data**
- **GLDAS Soil Moisture and Specific Humidity**
- **Land Cover Data:** Annual classification dataset

### Data Processing
- Raster datasets were acquired and preprocessed using **Google Earth Engine**.
- Monthly mean values were calculated and exported as CSV files.
- All datasets were merged using Python, and inconsistencies and missing values were handled.
- Categorical land cover data was converted to numerical format using **One-Hot Encoding**.

### Modeling
- **Linear Regression** was applied to predict NDVI based on climate and land cover data.
- Model performance was evaluated using **R²** (coefficient of determination) and **Mean Squared Error (MSE)**.
- Residuals and errors were analyzed to identify conditions under which predictions are most accurate.

### Code Overview
The main script performs the following steps:

1. Load NDVI, climate, soil moisture, and radar datasets.
2. Merge datasets on date and index columns.
3. Incorporate yearly land cover data and apply One-Hot Encoding.
4. Define model features (X) and target variable (y).
5. Split data into training and testing sets.
6. Fit a Linear Regression model.
7. Calculate predictions, errors, and performance metrics (MSE, R²).
8. Visualize model coefficients, correlation matrix, time series, and actual vs predicted NDVI.

### Visual Outputs
The script generates:
- **Linear regression coefficients bar plot**
- **Correlation matrix heatmap**
- **Time series of actual vs predicted NDVI**
- **Scatter plot: Actual vs predicted NDVI**

## Future Work
- Explore **non-linear models** to capture complex relationships.
- Extend the analysis period to assess long-term climate impacts.
- Develop crop-specific or region-specific models for improved accuracy.
- Integrate additional remote sensing and satellite data for more robust analyses.
- Results can serve as a foundation for decision support systems in **sustainable agriculture** and **environmental management**.

## Author
**Şevval Köntek**
# Climate and Vegetation Analysis (Turkey, 2016–2020)

## Project Overview
This project aims to analyze the impacts of climate change on vegetation health in Turkey during 2016–2020. It combines NDVI (Normalized Difference Vegetation Index) data from Sentinel-2 with key climate and environmental parameters, including temperature, precipitation, soil moisture, and Sentinel-1 radar backscatter, to study temporal and spatial changes in vegetation health.

Land cover data has also been incorporated to evaluate its influence on vegetation using statistical models. The linear regression-based machine learning model developed predicts NDVI from climate and land cover variables, providing insights for sustainable agriculture and environmental management. The project is designed to offer data-driven recommendations to farmers for irrigation planning, crop selection, and optimized agricultural practices under changing climate conditions.

## Problem Statement
The effects of climate change on agriculture are becoming increasingly evident and require urgent intervention. Temperature fluctuations, changing precipitation patterns, and extreme weather events such as droughts, floods, and frost threaten agricultural production, reduce crop yields, and negatively impact soil and water resources.

## Machine Learning Integration and Analysis
Machine learning models were employed to study the relationship between climate variables and vegetation health.

### Datasets Used
- **Sentinel-2 NDVI:** Indicator of vegetation health
- **Sentinel-1 VV Radar:** Provides information on soil structure and moisture content
- **CHIRPS Precipitation Data**
- **MOD11A1 Temperature Data**
- **GLDAS Soil Moisture and Specific Humidity**
- **Land Cover Data:** Annual classification dataset

### Data Processing
- Raster datasets were acquired and preprocessed using **Google Earth Engine**.
- Monthly mean values were calculated and exported as CSV files.
- All datasets were merged using Python, and inconsistencies and missing values were handled.
- Categorical land cover data was converted to numerical format using **One-Hot Encoding**.

### Modeling
- **Linear Regression** was applied to predict NDVI based on climate and land cover data.
- Model performance was evaluated using **R²** (coefficient of determination) and **Mean Squared Error (MSE)**.
- Residuals and errors were analyzed to identify conditions under which predictions are most accurate.

### Code Overview
The main script performs the following steps:

1. Load NDVI, climate, soil moisture, and radar datasets.
2. Merge datasets on date and index columns.
3. Incorporate yearly land cover data and apply One-Hot Encoding.
4. Define model features (X) and target variable (y).
5. Split data into training and testing sets.
6. Fit a Linear Regression model.
7. Calculate predictions, errors, and performance metrics (MSE, R²).
8. Visualize model coefficients, correlation matrix, time series, and actual vs predicted NDVI.

### Visual Outputs
The script generates:
- **Linear regression coefficients bar plot**
- **Correlation matrix heatmap**
- **Time series of actual vs predicted NDVI**
- **Scatter plot: Actual vs predicted NDVI**

## Future Work
- Explore **non-linear models** to capture complex relationships.
- Extend the analysis period to assess long-term climate impacts.
- Develop crop-specific or region-specific models for improved accuracy.
- Integrate additional remote sensing and satellite data for more robust analyses.
- Results can serve as a foundation for decision support systems in **sustainable agriculture** and **environmental management**.

## Author
**Şevval Köntek**
