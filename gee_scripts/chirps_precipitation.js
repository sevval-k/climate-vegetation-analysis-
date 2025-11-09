// Annual time range
var startYear = 2016;
var endYear = 2020;

// Define Turkey boundaries
var turkey = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_na', 'Turkey'));

// List to store monthly mean precipitation images
var monthlyImages = [];

// Loop through each year and month
for (var year = startYear; year <= endYear; year++) {
  for (var month = 1; month <= 12; month++) {

    // Define start and end dates for each month
    var startDate = ee.Date.fromYMD(year, month, 1);
    var endDate = startDate.advance(1, 'month');

    // Calculate mean precipitation for the month
    var monthlyMean = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
      .filterDate(startDate, endDate)
      .filterBounds(turkey)
      .mean()
      .clip(turkey)
      .set({
        'year': year,
        'month': month,
        'system:time_start': startDate.millis()
      });

    // Add the image to the list
    monthlyImages.push(monthlyMean);
  }
}

// Convert the list of images to an ImageCollection
var monthlyCollection = ee.ImageCollection.fromImages(monthlyImages);

// Example: Display January 2020 precipitation on the map
var sample = monthlyCollection
  .filter(ee.Filter.and(
    ee.Filter.eq('year', 2020),
    ee.Filter.eq('month', 1)
  ))
  .first();

Map.centerObject(turkey, 6);
Map.addLayer(sample, {
  min: 0,
  max: 100,
  palette: ['lightblue', 'blue', 'darkblue']
}, 'January 2020 Precipitation');

// Compute mean precipitation values for each month over Turkey
var features = monthlyCollection.map(function(img) {
  var stats = img.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: turkey.geometry(),
    scale: 5000,
    maxPixels: 1e13
  });

  return ee.Feature(null, {
    'date': img.date().format('YYYY-MM'),
    'mean_precip_mm': stats.get('precipitation')
  });
});

// Export the results as a CSV file to Google Drive
Export.table.toDrive({
  collection: features,
  description: 'Turkey_Monthly_Mean_Precip_2016_2020',
  fileFormat: 'CSV'
});

/*
------------------------------------------------------------
NOTES:
- Dataset: UCSB-CHG/CHIRPS/DAILY (daily precipitation, mm).
- Computes monthly mean precipitation for Turkey (2016–2020).
- Example layer shows January 2020 precipitation map.
- Typical visualization range: min = 0, max = 100 mm/month.
- Results are exported as a CSV file to Google Drive.
------------------------------------------------------------
*/