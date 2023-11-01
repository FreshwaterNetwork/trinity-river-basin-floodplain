// create map and layers for app
require([
  'esri/Map',
  'esri/views/MapView',
  'esri/portal/Portal',
  'esri/widgets/BasemapGallery',
  'esri/widgets/Expand',
  'esri/widgets/BasemapGallery/support/PortalBasemapsSource',
  'esri/widgets/Search',
  'esri/widgets/Legend',
  'esri/layers/MapImageLayer',
  'esri/layers/GraphicsLayer',
  'esri/core/reactiveUtils',
], function (
  Map,
  MapView,
  Portal,
  BasemapGallery,
  Expand,
  PortalBasemapsSource,
  Search,
  Legend,
  MapImageLayer,
  GraphicsLayer,
  reactiveUtils
) {
  // create map layers - the source can be a map service or an AGO web map - sublayers are defined in variables.js
  app.layers = new MapImageLayer({
    url: 'https://cumulus.tnc.org/arcgis/rest/services/nascience/Trinity_Basin_TX/MapServer',
    sublayers: app.mapImageLayers,
  });

  // Portal IDs for TNC Basemaps. Use any id to set basemap for map.
  const tncLightMapId = 'dfe65251dac240a19c8edb892a3ea664';
  const tncDarkMapId = '1f48b2b2456c44ad9c58d6741378c2ba';
  const tncOutdoorMapId = 'd10c378e8a8d46998e1d248827855c69';
  const tncTopoMapId = '1dde97af802846f597a03d04050bad5b';

  // Create map. Use one ID from above to set the default basemap
  app.map = new Map({
    layers: [app.layers],
    basemap: {
      portalItem: {
        id: tncTopoMapId,
      },
    },
  });

  //create map view
  app.view = new MapView({
    container: 'viewDiv',
    center: [-96.6, 31.7],
    zoom: 6,
    map: app.map,
    // add popup window to map view for map clicks
    popup: {
      collapseEnabled: false,
      dockEnabled: true,
      dockOptions: {
        buttonEnabled: false,
        breakpoint: false,
      },
    },
  });
  const portal = new Portal();
  const allowedBasemapTitles = [
    'TNC World Topographic Map',
    'TNC Outdoor Map',
    'TNC Light Map',
    'TNC Dark Gray Map',
    'Imagery Hybrid',
  ];
  const source = new PortalBasemapsSource({
    portal,
    query: {
      id: 'defa1b2287604d069c70af515331e30f',
    },
    filterFunction: (basemap) =>
      allowedBasemapTitles.indexOf(basemap.portalItem.title) > -1,
  });

  var basemapGallery = new BasemapGallery({
    view: app.view,
    source: source,
    container: document.createElement('div'),
  });
  var bgExpand = new Expand({
    view: app.view,
    content: basemapGallery,
  });
  app.view.ui.add(bgExpand, {
    position: 'top-right',
  });
  // close expand when basemap is changed
  app.map.watch(
    'basemap.title',
    function (newValue, oldValue, property, object) {
      bgExpand.collapse();
    }
  );

  //create search widget
  const searchWidget = new Search({
    view: app.view,
    locationEnabled: false,
    container: document.createElement('div'),
  });
  var srExpand = new Expand({
    view: app.view,
    content: searchWidget,
  });
  app.view.ui.add(srExpand, {
    position: 'top-right',
  });

  // move zoom controls to top right
  app.view.ui.move(['zoom'], 'top-right');

  // graphics layer for map click graphics
  app.resultsLayer = new GraphicsLayer();
  // add layers to map
  app.map.add(app.resultsLayer);

  // create legend
  app.legend = new Legend({
    view: app.view,
    container: document.createElement('div'),
  });
  app.lgExpand = new Expand({
    view: app.view,
    content: app.legend,
  });
  app.view.ui.add(app.lgExpand, {
    position: 'bottom-left',
  });
  app.lgExpand.expand();
  // change legend based on window size
  var x = window.matchMedia('(max-width: 700px)');
  mobilePortrait(x); // Call listener function at run time
  x.addListener(mobilePortrait); // Attach listener function on state changes

  // change legend based on window size
  var y = window.matchMedia('(orientation:landscape)');
  mobileLandscape(y); // Call listener function at run time
  y.addListener(mobileLandscape); // Attach listener function on state changes

  // listen for poup close button
  reactiveUtils.when(
    () => app.view.popup?.visible,
    () =>
      reactiveUtils.whenOnce(
        () => app.view.popup?.visible === undefined,
        () => app.resultsLayer.removeAll()
      )
  );

  app.view
    .whenLayerView(app.layers)
    .then((result) => {
      // call event listener for map clicks
      mapClick();
      //trigger button clicks on startup
      document
        .querySelectorAll("#top-controls input[name='huc']")
        .forEach((input) => {
          if (input.value == app.obj.hucLayer) {
            input.click();
          }
        });
      document
        .querySelectorAll("#top-controls input[name='floodFreq']")
        .forEach((input) => {
          if (input.value == app.obj.floodFreq) {
            input.click();
          }
        });
      // trigger control clicks from app.obj
      buildFromState();
    })
    .catch((err) => {
      console.log(err);
    });
});

function clearGraphics() {
  app.map.layers.removeAll();
}

function mobilePortrait(x) {
  if (x.matches) {
    app.lgExpand.collapse();
    app.mobile = true;
    if (document.querySelector(`#side-nav`).clientWidth == 0) {
      document
        .querySelector(`#side-nav`)
        .classList.toggle('hide-side-nav-width');
      document.querySelectorAll(`#map-toggle span`).forEach((span) => {
        span.classList.toggle('hide');
      });
    }
  } else {
    app.lgExpand.expand();
    app.mobile = false;
  }
}
function mobileLandscape(y) {
  if (y.matches) {
    app.lgExpand.expand();
    if (document.querySelector(`#side-nav`).clientHeight == 0) {
      document
        .querySelector(`#side-nav`)
        .classList.toggle('hide-side-nav-height');
      document.querySelectorAll(`#map-toggle span`).forEach((span) => {
        span.classList.toggle('hide');
      });
    }
  } else {
  }
}
