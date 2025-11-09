// Define time range
var startYear = 2016;
var endYear = 2020;

// Define Turkey boundary
var turkey = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_na', 'Turkey'));

// Create an empty list to store monthly mean temperature images
var monthlyImages = [];

// Loop through each year and month
for (var year = startYear; year <= endYear; year++) {
  for (var month = 1; month <= 12; month++) {

    // Define start and end dates for each month
    var startDate = ee.Date.fromYMD(year, month, 1);
    var endDate = startDate.advance(1, 'month');

    // Compute monthly mean land surface temperature (LST)
    var monthlyMean = ee.ImageCollection('MODIS/006/MOD11A1')
      .filterDate(startDate, endDate)
      .filterBounds(turkey)
      .select('LST_Day_1km') // Daily daytime LST band
      .mean()
      .multiply(0.02) // Scale factor from MODIS documentation
      .subtract(273.15) // Convert from Kelvin to Celsius
      .clip(turkey)
      .set({
        'year': year,
        'month': month,
        'system:time_start': startDate.millis()
      });

    monthlyImages.push(monthlyMean);
  }
}

// Convert list into an ImageCollection
var monthlyCollection = ee.ImageCollection.fromImages(monthlyImages);

// Example visualization: January 2020 LST map
var sample = monthlyCollection
  .filter(ee.Filter.and(
    ee.Filter.eq('year', 2020),
    ee.Filter.eq('month', 1)
  ))
  .first();

Map.centerObject(turkey, 6);
Map.addLayer(sample, {
  min: -10,  // Celsius scale
  max: 50,
  palette: ['blue', 'green', 'yellow', 'orange', 'red']
}, 'January 2020 LST (°C)');

// Compute mean temperature values per month across Turkey
var features = monthlyCollection.map(function(img) {
  var stats = img.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: turkey.geometry(),
    scale: 1000,  // 1 km resolution
    maxPixels: 1e13
  });

  return ee.Feature(null, {
    'date': img.date().format('YYYY-MM'),
    'mean_temp_C': stats.get('LST_Day_1km') // already converted to °C
  });
});

// Export monthly mean temperature data as CSV to Google Drive
Export.table.toDrive({
  collection: features,
  description: 'Turkey_Monthly_Mean_LST_Celsius_2016_2020',
  fileFormat: 'CSV'
});

/*
------------------------------------------------------------
NOTES:
- The MODIS LST data are originally in Kelvin * 0.02 scale.
  The real temperature in Celsius is calculated as:
  LST (°C) = (LST_Day_1km × 0.02) − 273.15
------------------------------------------------------------
*/
