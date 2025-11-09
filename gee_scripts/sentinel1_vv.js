// Define Turkey boundary
var turkey = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_na', 'Turkey'));

// Define time range
var startYear = 2016;
var endYear = 2020;

// List to store monthly VV backscatter images
var monthlyVVImages = [];

// Loop through each year and month
for (var year = startYear; year <= endYear; year++) {
  for (var month = 1; month <= 12; month++) {

    // Define start and end dates for each month
    var startDate = ee.Date.fromYMD(year, month, 1);
    var endDate = startDate.advance(1, 'month');

    // Compute monthly mean VV backscatter
    var monthlyVV = ee.ImageCollection('COPERNICUS/S1_GRD')
      .filterDate(startDate, endDate)
      .filterBounds(turkey)
      .filter(ee.Filter.eq('instrumentMode', 'IW')) // Interferometric Wide mode
      .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV')) // VV polarization
      .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING')) // Only descending orbit (optional)
      .select('VV')
      .mean()
      .clip(turkey)
      .set({
        'year': year,
        'month': month,
        'system:time_start': startDate.millis()
      });

    monthlyVVImages.push(monthlyVV);
  }
}

// Convert list to ImageCollection
var monthlyCollection = ee.ImageCollection.fromImages(monthlyVVImages);

// Calculate Turkey-wide mean VV backscatter for each month
var features = monthlyCollection.map(function(img) {
  var stats = img.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: turkey.geometry(),
    scale: 1000,
    maxPixels: 1e13
  });

  return ee.Feature(null, {
    'date': img.date().format('YYYY-MM'),
    'mean_VV_backscatter': stats.get('VV')
  });
});

// Export the monthly mean VV values as a CSV file to Google Drive
Export.table.toDrive({
  collection: features,
  description: 'Turkey_Monthly_Sentinel1_VV_2016_2020',
  fileFormat: 'CSV'
});

/*
------------------------------------------------------------
NOTES:
- Sentinel-1 GRD (Ground Range Detected) data were used with
  VV polarization in IW (Interferometric Wide Swath) mode.

- The data represent radar backscatter intensity (in dB).
  Typical visualization range: min = -25 dB, max = 0 dB.

- Only DESCENDING orbit data were used to ensure consistency;
  remove the orbit filter if both passes are needed.

- The script computes monthly mean backscatter over Turkey and
  exports the results as a CSV file.
------------------------------------------------------------
*/