///////////////////////////////////////////////////////////////////////////////////////////////////
// Download rainfall forecast for 1 - 5 days ahead from NOAA GFS
//
// Benny Istanto | Earth Observation and Climate Analyst | benny.istanto@wfp.org
// Vulnerability Analysis and Mapping (VAM) unit, UN World Food Programme - Indonesia
///////////////////////////////////////////////////////////////////////////////////////////////////



// Center of the map
Map.setCenter(117.7, -2.5, 5);



// Strip time off current date/time
var d = new Date();
var today = ee.Date(d);
print(d); // Print date for latest GFS data



// GFS Dataset Availability:
// https://developers.google.com/earth-engine/datasets/catalog/NOAA_GFS0P25#citations
var start_period = ee.Date('2019-07-01'); // First GFS data 1 Jul 2015



// MAIN INPUT
//---
// Import GFS data - https://developers.google.com/earth-engine/datasets/catalog/NOAA_GFS0P25
// 24-hours/1-day forecast from selected date
var GFS0P25_1day = ee.ImageCollection('NOAA/GFS0P25')
  .select('total_precipitation_surface')
  .filterMetadata('forecast_hours', 'equals', 24);

// 48-hours/2-day forecast from selected date
var GFS0P25_2day = ee.ImageCollection('NOAA/GFS0P25')
  .select('total_precipitation_surface')
  .filterMetadata('forecast_hours', 'equals', 48);

// 72-hours/3-day forecast from selected date 
var GFS0P25_3day = ee.ImageCollection('NOAA/GFS0P25')
  .select('total_precipitation_surface')
  .filterMetadata('forecast_hours', 'equals', 72);

// 96-hours/4-day forecast from selected date
var GFS0P25_4day = ee.ImageCollection('NOAA/GFS0P25')
  .select('total_precipitation_surface')
  .filterMetadata('forecast_hours', 'equals', 96);

// 120-hours/5-day forecast from selected date
var GFS0P25_5day = ee.ImageCollection('NOAA/GFS0P25')
  .select('total_precipitation_surface')
  .filterMetadata('forecast_hours', 'equals', 120);



// Define an SLD style of discrete intervals to apply to the image.
// Notes: SLD visualisation will make the data rendered as RGB during point inspector into a pixel.
var visRainForecastSLD =
  '<RasterSymbolizer>' +
    '<ColorMap  type="ramp" extended="false" >' +
      '<ColorMapEntry color="#ffffff" opacity="0.0" quantity="1" label="No Rain" />' +
      '<ColorMapEntry color="#cccccc" opacity="0.5" quantity="3" label="1-3" />' +
      '<ColorMapEntry color="#f9f3d5" opacity="0.5" quantity="10" label="4-10" />' +
      '<ColorMapEntry color="#dce2a8" opacity="0.5" quantity="20" label="11-20" />' +
      '<ColorMapEntry color="#a8c58d" opacity="0.5" quantity="30" label="21-30" />' +
      '<ColorMapEntry color="#77a87d" opacity="0.5" quantity="40" label="31-40" />' +
      '<ColorMapEntry color="#ace8f8" opacity="0.5" quantity="60" label="41-60" />' +
      '<ColorMapEntry color="#4cafd9" opacity="0.5" quantity="80" label="61-80" />' +
      '<ColorMapEntry color="#1d5ede" opacity="0.5" quantity="100" label="81-100" />' +
      '<ColorMapEntry color="#001bc0" opacity="0.5" quantity="120" label="101-120" />' +
      '<ColorMapEntry color="#9131f1" opacity="0.5" quantity="150" label="121-150" />' +
      '<ColorMapEntry color="#e983f3" opacity="0.5" quantity="200" label="151-200" />' +
      '<ColorMapEntry color="#f6c7ec" opacity="0.5" quantity="1000" label="&gt; 200" />' +
    '</ColorMap>' +
  '</RasterSymbolizer>'; 

var visRainForecast = {min: 1, max: 50, opacity: 0.5, palette: [
    'cccccc','f9f3d5','dce2a8','a8c58d','77a87d','ace8f8',
    '4cafd9','1d5ede','001bc0','9131f1','e983f3','f6c7ec'
  ]};



// INITIAL PROCESS WHEN MAP LOADED
//---
// Add today's GFS data to the map
var gfs1day = GFS0P25_1day    
      .filterDate(today.advance(-1, 'day'), today)
      .median(); // make a composite of the collection
var layer1day = ui.Map.Layer(gfs1day.sldStyle(visRainForecastSLD),{},'GFS 1-day', true);
// var layer1day = ui.Map.Layer(gfs1day,visRainForecast,'GFS 1-day', true);

var gfs2day = GFS0P25_2day    
      .filterDate(today.advance(-1, 'day'), today)
      .median(); // make a composite of the collection
var layer2day = ui.Map.Layer(gfs2day.sldStyle(visRainForecastSLD),{},'GFS 2-day', false);
// var layer2day = ui.Map.Layer(gfs2day,visRainForecast,'GFS 2-day', false);

var gfs3day = GFS0P25_3day    
      .filterDate(today.advance(-1, 'day'), today)
      .median(); // make a composite of the collection
var layer3day = ui.Map.Layer(gfs3day.sldStyle(visRainForecastSLD),{},'GFS 3-day', false);
// var layer3day = ui.Map.Layer(gfs3day,visRainForecast,'GFS 3-day', false);

var gfs4day = GFS0P25_4day    
      .filterDate(today.advance(-1, 'day'), today)
      .median(); // make a composite of the collection
var layer4day = ui.Map.Layer(gfs4day.sldStyle(visRainForecastSLD),{},'GFS 4-day', false);
// var layer4day = ui.Map.Layer(gfs4day,visRainForecast,'GFS 4-day', false);

var gfs5day = GFS0P25_5day    
      .filterDate(today.advance(-1, 'day'), today)
      .median(); // make a composite of the collection
var layer5day = ui.Map.Layer(gfs5day.sldStyle(visRainForecastSLD),{},'GFS 5-day', false);
// var layer5day = ui.Map.Layer(gfs5day,visRainForecast,'GFS 5-day', false);
  
// Reset all layers
Map.layers().reset([layer1day,layer2day,layer3day,layer4day,layer5day]);



// Render date range function
function renderDateRange(dateRange) {
  var gfs1day = GFS0P25_1day
      .filterDate(dateRange.start(), dateRange.end())
      .median(); // make a composite of the collection
  
  var gfs2day = GFS0P25_2day
      .filterDate(dateRange.start(), dateRange.end())
      .median(); // make a composite of the collection      

  var gfs3day = GFS0P25_3day
      .filterDate(dateRange.start(), dateRange.end())
      .median(); // make a composite of the collection
      
  var gfs4day = GFS0P25_4day
      .filterDate(dateRange.start(), dateRange.end())
      .median(); // make a composite of the collection
      
  var gfs5day = GFS0P25_5day
      .filterDate(dateRange.start(), dateRange.end())
      .median(); // make a composite of the collection      
  
  // Load the image into map
  var layer1day = ui.Map.Layer(gfs1day.sldStyle(visRainForecastSLD),{},'GFS 1-day', true);
  var layer2day = ui.Map.Layer(gfs2day.sldStyle(visRainForecastSLD),{},'GFS 2-day', false);
  var layer3day = ui.Map.Layer(gfs3day.sldStyle(visRainForecastSLD),{},'GFS 3-day', false);
  var layer4day = ui.Map.Layer(gfs4day.sldStyle(visRainForecastSLD),{},'GFS 4-day', false);
  var layer5day = ui.Map.Layer(gfs5day.sldStyle(visRainForecastSLD),{},'GFS 5-day', false);
  
  // Load the image into map
  // var layer1day = ui.Map.Layer(gfs1day,visRainForecast,'GFS 1-day', true);
  // var layer2day = ui.Map.Layer(gfs2day,visRainForecast,'GFS 2-day', false);
  // var layer3day = ui.Map.Layer(gfs3day,visRainForecast,'GFS 3-day', false);
  // var layer4day = ui.Map.Layer(gfs4day,visRainForecast,'GFS 4-day', false);
  // var layer5day = ui.Map.Layer(gfs5day,visRainForecast,'GFS 5-day', false);
  
  // Reset all layers
  Map.layers().reset([layer1day,layer2day,layer3day,layer4day,layer5day]);
}



// DATE SLIDER CONFIG
//---
// UI widgets needs client-side data .evaluate() to get client-side values of start and end period
ee.Dictionary({start: start_period, end: today.advance(1, 'day')})
  .evaluate(renderSlider);

// Slider function
function renderSlider(dates) {
  var slider = ui.DateSlider({
    start: dates.start.value, 
    end: dates.end.value, 
    period: 1, // Every 5 days
    style: {width: '300px', padding: '10px'},
    onChange: renderDateRange
  });
  Map.add(slider);
  slider.setValue(today);
}



// Legend
// Set position of panel
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});
 
// Create legend title
var legendTitle = ui.Label({
  value: 'Rainfall forecast',
  style: {
    fontWeight: 'bold',
    fontSize: '14px',
    margin: '0 0 4px 0',
    padding: '0'
    }
});
 
// Add the title to the panel
legend.add(legendTitle);
 
// Creates and styles 1 row of the legend.
var makeRow = function(color, name) {
 
      // Create the label that is actually the colored box.
      var colorBox = ui.Label({
        style: {
          backgroundColor: '#' + color,
          // Use padding to give the box height and width.
          padding: '8px',
          margin: '0 0 4px 0'
        }
      });
 
      // Create the label filled with the description text.
      var description = ui.Label({
        value: name,
        style: {margin: '0 0 4px 6px'}
      });
 
      // return the panel
      return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
      });
};



// Visualization palette for total precipitation - Color-codes based on Color-Brewer https://colorbrewer2.org/
// Palette with the colors for legend in UI Panel
var palette =['ffffff','cccccc','f9f3d5','dce2a8','a8c58d','77a87d','ace8f8','4cafd9','1d5ede','001bc0','9131f1','e983f3','f6c7ec']; 

// Name of the legend for legend in UI Panel
var names = ['No Rain ~ No color','1 - 3 milimeters','4 - 10','11 - 20','21 - 30','31 - 40','41 - 60','61 - 80','81 - 100','101 - 120','121 - 150','151 - 200','> 200'];

// Add color and and names
for (var i = 0; i < 13; i++) {
  legend.add(makeRow(palette[i], names[i]));
  }  
 

 
// Add legend to map 
Map.add(legend);



// Subset for downloading data
var rectangle_RBB = ee.Geometry.Rectangle(60, -80, 180, 80);
var bbox_RBB = ee.Feature(rectangle_RBB).geometry();



// Export the result to Google Drive
Export.image.toDrive({
  image:gfs1day,
  description:'GFS-1day',
  folder:'GEE_GFS',
  scale:5600,
  region:bbox_RBB,
  maxPixels:1e12
});

Export.image.toDrive({
  image:gfs2day,
  description:'GFS-2day',
  folder:'GEE_GFS',
  scale:5600,
  region:bbox_RBB,
  maxPixels:1e12
});

Export.image.toDrive({
  image:gfs3day,
  description:'GFS-3day',
  folder:'GEE_GFS',
  scale:5600,
  region:bbox_RBB,
  maxPixels:1e12
});

Export.image.toDrive({
  image:gfs4day,
  description:'GFS-4day',
  folder:'GEE_GFS',
  scale:5600,
  region:bbox_RBB,
  maxPixels:1e12
});

Export.image.toDrive({
  image:gfs5day,
  description:'GFS-5day',
  folder:'GEE_GFS',
  scale:5600,
  region:bbox_RBB,
  maxPixels:1e12
});

// End of script
