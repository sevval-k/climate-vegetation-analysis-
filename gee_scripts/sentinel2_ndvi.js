// Define Turkey boundaries
var turkey = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_na', 'Turkey'));

// Define start and end years
var startYear = 2016;
var endYear = 2020;

// Function to calculate NDVI for Sentinel-2 images
function addNDVI(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
}

// List to store monthly NDVI images
var monthlyNDVI = [];

// Loop through each year and month
for (var year = startYear; year <= endYear; year++) {
  for (var month = 1; month <= 12; month++) {

    // Define start and end dates
    var startDate = ee.Date.fromYMD(year, month, 1);
    var endDate = startDate.advance(1, 'month');

    // Filter Sentinel-2 imagery and compute NDVI
    var collection = ee.ImageCollection('COPERNICUS/S2')
      .filterBounds(turkey)
      .filterDate(startDate, endDate)
      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)) // Only less cloudy images
      .map(addNDVI)
      .select('NDVI');

    // Compute monthly mean NDVI
    var meanImage = collection.mean().clip(turkey)
      .set({
        'year': year,
        'month': month,
        'system:time_start': startDate.millis()
      });

    monthlyNDVI.push(meanImage);
  }
}

// Convert list into an ImageCollection
var ndviCollection = ee.ImageCollection.fromImages(monthlyNDVI);

// Compute regional mean NDVI for each month across Turkey
var features = ndviCollection.map(function(img) {
  var stats = img.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: turkey.geometry(),
    scale: 1000,
    maxPixels: 1e13
  });

  return ee.Feature(null, {
    'date': img.date().format('YYYY-MM'),
    'mean_NDVI': stats.get('NDVI')
  });
});

// Export results as CSV to Google Drive
Export.table.toDrive({
  collection: features,
  description: 'Turkey_Monthly_Mean_NDVI_Sentinel2_2016_2020',
  fileFormat: 'CSV'
});

/*
------------------------------------------------------------
NOTES:
- NDVI is calculated as (NIR - Red) / (NIR + Red)
  using Sentinel-2 bands: B8 (NIR) and B4 (Red).

- Typical NDVI visualization range:
  min = 0, max = 1, palette = ['brown', 'yellow', 'green'].

- The script computes monthly mean NDVI for Turkey and
  exports the time series (2016–2020) as a CSV file.
------------------------------------------------------------
*/
