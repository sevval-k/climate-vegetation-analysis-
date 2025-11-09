Project Results and Future Work

The linear regression-based machine learning model developed in this project demonstrated satisfactory performance in predicting NDVI (Normalized Difference Vegetation Index) values. The overall performance of the model was evaluated using the coefficient of determination (R²) and mean squared error (MSE), and the results indicate that the model successfully captured the fundamental relationships between climate variables, land cover, and vegetation health.

Several strategies can be considered to further enhance the model's performance. Variables showing high correlation in the correlation matrix (e.g., mean_temperature and mean_humidity) could be more effectively utilized, while variables with low correlation might be excluded to improve model accuracy.

In future studies, extending the analysis period to cover a longer timeframe would allow for a more comprehensive assessment of long-term climate change impacts. Additionally, exploring non-linear models could better capture complex relationships. Techniques such as PolynomialFeatures, Ridge, or Lasso regularization could be applied to assess the model's generalization capabilities.

Moreover, developing separate models for different crop types or regions could further improve prediction accuracy. For this purpose, high-quality, crop-specific datasets are critical, and institutional databases such as the Turkish Ministry of Agriculture and Forestry's “Plant Protection and Products Database” could serve as valuable resources.

Overall, this study demonstrates the effective integration of remote sensing, satellite imagery, and machine learning methods to analyze the relationship between climate data and vegetation health. By combining multiple satellite-derived datasets and supporting analyses with visualizations, the project provides a foundation for decision support systems in sustainable agriculture. Future applications of similar methodologies over longer time periods and in different regions could further test and validate the model's applicability.
