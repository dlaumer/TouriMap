/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready


// Symbol for POI

symbols = {
    favourites: {
        type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
        url: "https://static.arcgis.com/images/Symbols/Shapes/YellowStarLargeB.png",
        width: "32px",
        height: "32px"
    },
    natural : {                          // autocasts as new SimpleMarkerSymbol()
        type: "simple-marker",
        color: "#9FE2BF"
    },
    cultural: {                          // autocasts as new SimpleMarkerSymbol()
          type: "simple-marker",
          color: "#6495ED"
    },
    historical: {                         // autocasts as new SimpleMarkerSymbol()
        type: "simple-marker",
        color: "#FFBF00"
    },
    religion: {                         // autocasts as new SimpleMarkerSymbol()
        type: "simple-marker",
        color: "#DE3163"
    },
    architecture: {                         // autocasts as new SimpleMarkerSymbol()
        type: "simple-marker",
        color: "#DFFF00"
    },
    industrial_facilities: {                         // autocasts as new SimpleMarkerSymbol()
        type: "simple-marker",
        color: "#40E0D0"
    },
    other: {                         // autocasts as new SimpleMarkerSymbol()
        type: "simple-marker",
        color: "#CCCCFF"
    }
}

var typesPoint = ["favourites", "natural","cultural", "historical", "religion", "architecture",  "industrial_facilities", "other"]

var openWikipediaAction = {
      title: "Open the corresponding wikipedia article",
      id: "wiki",
      image:
        "https://cdn.icon-icons.com/icons2/17/PNG/256/wikipedia_wiki_2102.png"
    };

var markFavAction = {
      title: "Mark/Remove as favourite",
      id: "favourite",
      image:
        "https://www.flaticon.com/svg/static/icons/svg/1828/1828884.svg"
    };

var markFavAction2 = {
      title: "Mark as favourite",
      id: "favourite",
      image:
        "https://www.flaticon.com/svg/static/icons/svg/1828/1828970.svg"
    };


var template = {
    // autocasts as new PopupTemplate()
    title: "Point of interest:",
    content: [
      {
        type: "fields",
        fieldInfos: [
        {
            fieldName: "name",
            label: "Name"
          },
         {
           fieldName: "kind",
           label: "Category"
         },
          {
            fieldName: "type",
            label: "Other categories"
          },
          {
            fieldName: "wikidata",
            label: "Wikidata ID"
          }
        ]
      }
    ],
    actions: [markFavAction]
  };

var featureLayers = {};
var visibleLayers = {}
for (var i=0;i<typesPoint.length;i++) {
    visibleLayers[typesPoint[i]] = true;
}
var legend;
var jsonFavourites ={"favourites":[]};
var fileObj;

var url = "https://api.opentripmap.com/0.1/ru/places/bbox?lon_min=-0.32856&lat_min=39.464587&lon_max=-0.30856&lat_max=39.484587&format=geojson&apikey=5ae2e3f221c38a28845f05b6aaceeb8303eb6b32050050abdc0a21ce";

var opentripURL = "https://api.opentripmap.com/0.1/ru/places/bbox?";
var opentripKEY = "5ae2e3f221c38a28845f05b6aaceeb8303eb6b32050050abdc0a21ce";

var urlwiki = "https://cors-anywhere.herokuapp.com/https://cors-anywhere.herokuapp.com/https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks/urls&ids="

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    $(document).ready(function() {
        
        
        console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

        require([
             "esri/widgets/Track",
             "esri/Map",
             "esri/views/MapView",
             "esri/Graphic",
             "esri/layers/FeatureLayer",
             "esri/core/watchUtils",
             "esri/geometry/support/webMercatorUtils",
             "esri/renderers/UniqueValueRenderer",
             "esri/widgets/Legend",
             "esri/widgets/Expand",
             "esri/widgets/LayerList",
             "esri/widgets/Search",
            "esri/widgets/Locate",
             "dojo/domReady!"
        ], function(Track, Map, MapView, Graphic, FeatureLayer, watchUtils, webMercatorUtils,UniqueValueRenderer,Legend, Expand, LayerList, Search, Locate) {
            
            var map = new Map({
              basemap: "streets",
            });
            
            var view = new MapView({
              container: "viewDiv",
              map: map,
              zoom: 13,
              center: [-0.32856, 39.464587]
            });
            
            apiCall(true);
            
            // Watch view's stationary property for becoming true.
            watchUtils.whenTrue(view, "stationary", function() {
              // Get the new center of the view only when view is stationary.
              
              // Get the new extent of the view only when view is stationary.
              if (view.extent) {
                  if (view.zoom > 8){

                      for (var i=0;i<typesPoint.length;i++) {
                          visibleLayers[typesPoint[i]] = featureLayers[typesPoint[i]].visible
                      }
                          
                      var min = webMercatorUtils.xyToLngLat(view.extent.xmin,view.extent.ymin);
                      var max = webMercatorUtils.xyToLngLat(view.extent.xmax,view.extent.ymax);
                      console.log(min);
                     
                      url = opentripURL +  "lon_min="+min[0]+"&lat_min="+min[1]+"&lon_max="+max[0]+"&lat_max="+max[1]+"&format=geojson&apikey=" + opentripKEY;
                      apiCall(false); // False stands for if it is the first call or not
                  }
                  else {
                      for (var i=0;i<typesPoint.length;i++) {
                          map.layers.remove(featureLayers[typesPoint[i]]);    // Remove the existing featureLayer
                      }
                  }
              }
            });
            
                       
            // Create an instance of the Track widget
                // and add it to the view's UI
                var track = new Track({
                  view: view
                });
                view.ui.add(track, "top-left");

                // The sample will start tracking your location
                // once the view becomes ready
                view.when(function () {
                  track.start();
                });
            
            view.ui.add("titleDiv", "top-right");

            
            
            list = new Expand({
              content: new LayerList({
              view: view,
              listItemCreatedFunction: function(event) {
                        const item = event.item;
                        if (item.layer.type != "group") { // don't show legend twice
                          item.panel = {
                            content: "legend",
                          };
                        }
                      }
            }),
              view: view,
              expanded: false
            });
            view.ui.add(list, "top-right");
            
            
            var search = new Expand({
              content: new Search({
              view: view
            }),
              view: view,
              expanded: false
            });
            
         
            // Adds the search widget below other elements in
            // the top left corner of the view
            view.ui.add(search, {
              position: "top-left",
              index: 0
            });

                        var element = document.createElement('div');
            element.className = "esri-icon-trash esri-widget--button esri-widget esri-interactive home";
            element.addEventListener('click', function (event) {
                
                if (confirm("Are you sure you want to delete all favourites?")) {
                  
                    jsonFavourites["favourites"] = [];
                    writeJSON();
                    for (var i=0;i<typesPoint.length;i++) {
                        visibleLayers[typesPoint[i]] = featureLayers[typesPoint[i]].visible
                    }
                    apiCall(false);
                    
                    alert("The favourites were deleted");
                } else {
                  alert("Nothing was deleted");
                }
                    });
            view.ui.add(element, "top-right");
            
            
            
            var bgExpand = new Expand({
            expandIconClass: "esri-icon-question",
            expanded: false,
            expandTooltip: "Get information",
            view: view,
              content: document.getElementById('alerts'),
            });
            view.ui.add(bgExpand, "top-right");
            
            
            
            /*
            view.when(function(){
              startGeolocation();
            }, function(err){
              console.error("There was a problem loading the map: ", err);
            });
             */
            
            // Event handler that fires each time an action is clicked.
            view.popup.on("trigger-action", function (event) {
              // Execute the measureThis() function if the measure-this action is clicked
              if (event.action.id === "favourite") {
                markAsFavourite();
              }
            if (event.action.id === "wiki") {
                openWikipedia();
            }
                
                
            });
            
            
            function openWikipedia() {
                wikidataId = view.popup.selectedFeature.attributes.wikidata;
                if (wikidataId == null) {
                    alert("There is no wikipedia information for this feature")
                }
                else {
                    var url = urlwiki + wikidataId;

                    $.ajax({url: url, success: function(result){
                        entities = data["entities"];
                        sitelinks = entities[Object.keys(entities)[0]].sitelinks;
                        var urlwiki;
                        if ("eswiki" in Object.keys(sitelinks)) {
                            urlwiki = sitelinks.eswiki.url;
                        }
                        else {
                            urlwiki = sitelinks[Object.keys(sitelinks)[0]].url
                        }
                        
                        var ref = cordova.InAppBrowser.open(urlwiki, '_blank', 'location=yes');

                    }});
                }
            }
            
            
            function markAsFavourite() {
                
                //view.popup.title =  view.popup.title + " (Favourite)"
                
                selectedId = parseInt(view.popup.selectedFeature.attributes.ObjectId);
                if (!(jsonFavourites["favourites"].includes(selectedId))) {
                    jsonFavourites["favourites"].push(selectedId);
                }
                else {
                    jsonFavourites["favourites"] = arrayRemove(jsonFavourites["favourites"],selectedId);
                }
                view.popup.close();
                for (var i=0;i<typesPoint.length;i++) {
                    visibleLayers[typesPoint[i]] = featureLayers[typesPoint[i]].visible
                }
                apiCall(false);
                writeJSON();

                //onsole.log(view.popup.actions.getItemAt(0))
                //view.popup.actions.removeAt(2)
                //view.popup.selectedFeature.attributes.name
            }
            
            function arrayRemove(arr, value) {
                
                    return arr.filter(function(ele){
                        return ele != value;
                    });
                }
            
            function readJson() {
                var fileName = "favourites.json";
                    
                    
                var storageLocation = "";
                switch (device.platform) {
                        case "Android":
                          storageLocation = cordova.file.externalDataDirectory;
                          break;

                        case "iOS":
                          storageLocation = cordova.file.documentsDirectory;
                          break;
                      }
                    
                window.resolveLocalFileSystemURL(storageLocation, function(dir) {
                    dir.getFile(fileName, {create:true}, function(fileEntry) {
                        fileEntry.file(gotFile, fail);
                    });
                });
                
            }
            
            function gotFile(file) {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    //console.log("Read as text");
                    //console.log(evt.target.result);
                    jsonFavourites = JSON.parse(evt.target.result);
                };
                reader.readAsText(file);
            }
            
            function fail(evt) {
                    console.log(evt.target.error.code);
                }
            
            function writeJSON() {
                
                var fileName = "favourites.json";
                    
                var storageLocation = "";
                switch (device.platform) {
                        case "Android":
                          storageLocation = cordova.file.externalDataDirectory;
                          break;

                        case "iOS":
                          storageLocation = cordova.file.documentsDirectory;
                          break;
                      }
                    
                window.resolveLocalFileSystemURL(storageLocation, function(dir) {
                    dir.getFile(fileName, {create:true}, function(fileEntry) {
                        fileObj = fileEntry;
                        writeFile(JSON.stringify(jsonFavourites, null, 2));
                    });
                });
            }

            
            function writeFile(jsonString){
                if(!fileObj) {
                    return;
                }

                fileObj.createWriter(function(fileWriter) {
                    var blob = new Blob([jsonString], {type:'text/json'});
                    fileWriter.write(blob);
                }, writeFileError);

            }

            function writeFileError(e) {
                navigator.notification.alert(
                    "FileSystem Error\n" + JSON.stringify(e, null, 2), function(){},
                    "G2",
                    "Ok"
                    );
                return;
            }
            
            function startGeolocation(){
              console.log("Starting geolocation...");
              let location = navigator.geolocation.getCurrentPosition(
                  locationSuccess,
                  locationError,
                  {
                    maxAge: 250000,
                    timeout: 15000,
                    enableHighAccuracy:true
                  }
              );
            }
            
            // Handle location success
            function locationSuccess(position){
              if(position.coords.latitude != null || position.coords.longitude != null){
                console.log("long: " + position.coords.longitude + ", lat: " + position.coords.latitude);
                view.center = [position.coords.longitude,position.coords.latitude];
              }
            }
            
            function locationError(error){
              console.log("locationError code: " + error.code);

              switch(error.code) {
                case error.PERMISSION_DENIED:
                  alert("User denied request for geolocation.");
                  break;
                case error.POSITION_UNAVAILABLE:
                  alert("Location information is unavailable. Check application settings, make sure location permissions have been granted");
                  break;
                case error.TIMEOUT:
                  alert( "The request to get user location timed out.");
                  break;
                case error.UNKNOWN_ERROR:
                  alert("An unknown error occurred.");
                  break;
              }
            }
            
            
            function apiCall(firstTime) {
                // Read the favourites
                readJson();
                console.log(jsonFavourites);
                // Get the new data from the OpenTrip API
                $.ajax({url: url, success: function(result){
                    
                                        
                    graphics ={};
                    for (var i=0;i<typesPoint.length;i++) {
                        graphics[typesPoint[i]] = [];
                    }
                    for (var i=0;i < result.features.length;i++) {
                        var feature = result.features[i]
                        var kinds = feature.properties.kinds.split(",");
                        if (kinds.includes("interesting_places")){
                            
                            var grapic = new Graphic({
                              attributes: {
                                ObjectId: feature.id,
                                name: feature.properties.name,
                                type: feature.properties.kinds,
                                wikidata:feature.properties.wikidata,
                              },
                              geometry: {
                              type: "point",
                                longitude: feature.geometry.coordinates[0],
                                latitude: feature.geometry.coordinates[1]
                              }
                            });
                            
                            
                            if (jsonFavourites.favourites.includes(parseInt(feature.id))) {
                                grapic.attributes.favourite = true;
                            }
                            else {
                                grapic.attributes.favourite = false;
                            }
                            
                            var kind;
                            if (jsonFavourites.favourites.includes(parseInt(feature.id))) {
                                grapic.attributes.kind = "favourites"
                                graphics["favourites"].push(grapic);
                            }
                            else if (kinds.includes("natural")){
                                grapic.attributes.kind = "natural"
                                graphics["natural"].push(grapic)
                            }
                            else if (kinds.includes("cultural")){
                                grapic.attributes.kind = "cultural"
                                graphics["cultural"].push(grapic)
                            }
                            else if (kinds.includes("historical")){
                                grapic.attributes.kind = "historical"
                                graphics["historical"].push(grapic)
                            }
                            else if (kinds.includes("religion")){
                                grapic.attributes.kind = "religion"
                                graphics["religion"].push(grapic)
                            }
                            else if (kinds.includes("architecture")){
                                grapic.attributes.kind = "architecture"
                                graphics["architecture"].push(grapic)
                            }
                            else if (kinds.includes("industrial_facilities")){
                                grapic.attributes.kind = "industrial_facilities"
                                graphics["industrial_facilities"].push(grapic)
                            }
                            else {
                                grapic.attributes.kind = "other"
                                graphics["other"].push(grapic)
                            }
                            
                        }
                    };

                    for (var i=typesPoint.length-1;i>=0;i--) {
                        map.layers.remove(featureLayers[typesPoint[i]]);    // Remove the existing featureLayer
                        featureLayers[typesPoint[i]] = new FeatureLayer({
                          geometryType:  "point",
                          source: graphics[typesPoint[i]],
                          title: typesPoint[i],
                          visible: visibleLayers[typesPoint[i]],
                          renderer: {
                              type: "simple", // autocasts as new SimpleRenderer()
                              symbol: symbols[typesPoint[i]]},
                          popupTemplate: template,
                          objectIdField: "ObjectID",           // This must be defined when creating a layer from `Graphic` objects
                          fields: [
                            {
                              name: "ObjectID",
                              alias: "ObjectID",
                              type: "oid"
                            },
                            {
                              name: "name",
                              alias: "name",
                              type: "string"
                            },
                           {
                             name: "kind",
                             alias: "kind",
                             type: "string"
                           }
                          ],
                        outFields: ["*"],
                        });
                        
                        featureLayers[typesPoint[i]].opacity = 0.7;
                        map.layers.add(featureLayers[typesPoint[i]]);
                        
                    }
                                    
                   
            
                    // Add the legend, but only one time (the first time)
                    if (legend == null) {

                        legend = new Expand({
                          content: new Legend({
                            view: view,
                           
                          }),
                          view: view,
                          expanded: false
                        });
                        view.ui.add(legend, "bottom-left");
                    }

                    
                }});
            }
        });
        
        
    });
}
