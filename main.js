// Initialize the map
var map = L.map('map').setView([12.9716, 77.5946], 7);  // Set the view over Karnataka

// Add OpenStreetMap basemap by default
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Define satellite basemap
var satelliteLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenTopoMap contributors'
});

// Switch between basemaps
document.getElementById('osm-basemap').addEventListener('click', function () {
    map.addLayer(osmLayer);
    map.removeLayer(satelliteLayer);
});

document.getElementById('satellite-basemap').addEventListener('click', function () {
    map.addLayer(satelliteLayer);
    map.removeLayer(osmLayer);
});

// Repository of shapefiles (from your folder structure)
// Add the path of your shapefiles here in the repository
var shapefileRepository = [
    { name: "Assembly Boundary of Karnataka", file: "F:\EXECUTED\asset_mapping_portal\layers\ASSEMBLY BOUNDARY OF KARNATAKA.zip" },
    { name: "Bangalore Parliment", file: "F:\EXECUTED\asset_mapping_portal\layers\BANAGALORE PARLIMENTARY.zip" },
    { name: "DistrictsBangalore Assembly", file: "F:\EXECUTED\asset_mapping_portal\layers\BANGALORE ASSEMBLY.zip" },
    { name: "Bangalore BMRDA", file: "F:\EXECUTED\asset_mapping_portal\layers\BANGALORE BMRDA.zip" },
    { name: "Bangalore District", file: "F:\EXECUTED\asset_mapping_portal\layers\BANGALORE DISTRICT.zip" },
    { name: "Bangalore Taluk", file: "F:\EXECUTED\asset_mapping_portal\layers\BANGALORE TALUK.zip" },
    { name: "Bangalore Town BBMP", file: "F:\EXECUTED\asset_mapping_portal\layers\BANGALORE TOWN_BBMP.zip" },
    { name: "Bangalore Zone", file: "F:\EXECUTED\asset_mapping_portal\layers\BANGALORE ZONE.zip" },
    { name: "District of KARNATAKA", file: "F:\EXECUTED\asset_mapping_portal\layers\DISTRICTS OF KARNATAKA.zip" },
    { name: "GP of Gadag", file: "F:\EXECUTED\asset_mapping_portal\layers\GP OF GADAG.zip" },
    { name: "GP with Names", file: "F:\EXECUTED\asset_mapping_portal\layers\GP WITH NAMES OF GADAG.zip" },
    { name: "Hobli of Gadag", file: "F:\EXECUTED\asset_mapping_portal\layers\HOBLI OF GADAG.zip" },
    { name: "Karnataka State", file: "F:\EXECUTED\asset_mapping_portal\layers\KARNATAKA STATE.zip" },
    { name: "Parlimentary boundary of Karnataka", file: "F:\EXECUTED\asset_mapping_portal\layers\PARLIMENTARY BOUNDARY OF KARNATAKA.zip" },
    { name: "Taluk of Karnataka", file: "F:\EXECUTED\asset_mapping_portal\layers\TALUKS OF KARNATAKA.zip" },
    { name: "Town/Ward of Gadag", file: "F:\EXECUTED\asset_mapping_portal\layers\TOWN_WARD OF GADAG.zip" },
    { name: "Village of Gadag", file: "F:\EXECUTED\asset_mapping_portal\layers\VILLAGE OF GADAG.zip" },
    // Add more shapefiles as needed
];

// Dynamically generate checkboxes for shapefiles
function loadShapefileCheckboxes() {
    var checkboxContainer = document.getElementById('layer-checkboxes');
    shapefileRepository.forEach(function (shapefile, index) {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'shapefile-' + index;
        checkbox.dataset.file = shapefile.file;
        checkbox.addEventListener('change', toggleShapefile);

        var label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = shapefile.name;

        var br = document.createElement('br');

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(br);
    });
}

// Load shapefile onto the map
var loadedLayers = {};  // Store references to the layers loaded on the map

function toggleShapefile(event) {
    var checkbox = event.target;
    var shapefile = checkbox.dataset.file;

    if (checkbox.checked) {
        // Load the shapefile and add it to the map
        fetchShapefile(shapefile);
    } else {
        // Remove the shapefile from the map
        if (loadedLayers[shapefile]) {
            map.removeLayer(loadedLayers[shapefile]);
            delete loadedLayers[shapefile];
        }
    }
}

// Function to fetch shapefiles from the given folder path
function fetchShapefile(shapefile) {
    var folderPath = "F:/EXECUTED/asset_mapping_portal/layers/"; // Update this path to your folder
    var shapefilePath = folderPath + shapefile;

    // Use shp.js to fetch and convert the shapefile into GeoJSON
    shp(shapefilePath).then(function (geojson) {
        var layer = L.geoJSON(geojson, {
            style: function () {
                return { color: 'blue', weight: 2 };
            }
        }).addTo(map);

        // Store the loaded layer
        loadedLayers[shapefile] = layer;
    }).catch(function (error) {
        console.error("Error loading shapefile:", error);
    });
}

// Call the function to load the checkboxes for shapefiles
loadShapefileCheckboxes();

// Clear all layers functionality
document.getElementById('clear-tool').addEventListener('click', function () {
    for (var key in loadedLayers) {
        map.removeLayer(loadedLayers[key]);
    }
    loadedLayers = {};  // Clear the loaded layers
});
