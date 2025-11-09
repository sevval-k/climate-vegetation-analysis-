// Define Turkey boundaries
var turkey = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_na', 'Turkey'));

// Define time range
var startYear = 2016;
var endYear = 2020;

// List to store monthly mean images
var monthlyImages = [];

// Loop through each year and month
for (var year = startYear; year <= endYear; year++) {
  for (var month = 1; month <= 12; month++) {

    // Define start and end date for each month
    var startDate = ee.Date.fromYMD(year, month, 1);
    var endDate = startDate.advance(1, 'month');

    // Compute monthly mean for soil moisture and specific humidity
    var monthlyMean = ee.ImageCollection('NASA/GLDAS/V021/NOAH/G025/T3H')
      .filterDate(startDate, endDate)
      .filterBounds(turkey)
      .select(['SoilMoi0_10cm_inst', 'Qair_f_inst']) 
      .mean()
      .clip(turkey)
      .set({
        'year': year,
        'month': month,
        'system:time_start': startDate.millis()
      });

    // Add to list
    monthlyImages.push(monthlyMean);
  }
}

// Convert list to ImageCollection
var monthlyCollection = ee.ImageCollection.fromImages(monthlyImages);

// Compute regional mean values for each month over Turkey
var features = monthlyCollection.map(function(img) {
  var stats = img.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: turkey.geometry(),
    scale: 25000, // GLDAS spatial resolution (~0.25 degree)
    maxPixels: 1e13
  });

  return ee.Feature(null, {
    'date': img.date().format('YYYY-MM'),
    'mean_soil_moisture': stats.get('SoilMoi0_10cm_inst'),
    'mean_specific_humidity': stats.get('Qair_f_inst')
  });
});

// Export results as CSV to Google Drive
Export.table.toDrive({
  collection: features,
  description: 'Turkey_GLDAS_Soil_And_Humidity_2016_2020',
  fileFormat: 'CSV'
});

/*
------------------------------------------------------------
NOTES:
- Dataset: NASA/GLDAS/V021/NOAH/G025/T3H (3-hourly, ~0.25° resolution).
- Variables used:
   • SoilMoi0_10cm_inst → Top 0–10 cm soil moisture (kg/m² ≈ mm water)
   • Qair_f_inst → Near-surface specific humidity (kg/kg)
- The script computes monthly mean values (2016–2020)
  over Turkey and exports them as a CSV file.
- Spatial scale: 25 km (GLDAS native grid)
------------------------------------------------------------
*/