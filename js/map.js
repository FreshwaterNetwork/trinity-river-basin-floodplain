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
  'esri/layers/FeatureLayer',
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
  FeatureLayer,
  GraphicsLayer,
  reactiveUtils,
) {
  const VECTOR_SERVICE =
    'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/Cirrus_TrinityRiver/FeatureServer';
  const RASTER_SERVICE =
    'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer';

  // Wrapper providing findSublayerById() and sublayers.forEach() across FeatureLayers and MapImageLayer
  app.layers = {
    _featureLayers: {},
    _rasterLayer: null,
    sublayers: {
      forEach: (fn) => {
        Object.values(app.layers._featureLayers).forEach(fn);
        if (app.layers._rasterLayer)
          app.layers._rasterLayer.sublayers.forEach(fn);
      },
    },
    findSublayerById: (id) => {
      id = parseInt(id);
      if (app.layers._featureLayers[id] !== undefined)
        return app.layers._featureLayers[id];
      return app.layers._rasterLayer
        ? app.layers._rasterLayer.findSublayerById(id)
        : null;
    },
  };

  // Raster supporting layers (IDs 600+) from CCS_Rasters_1/MapServer
  app.layers._rasterLayer = new MapImageLayer({
    url: RASTER_SERVICE,
    sublayers: app.mapImageLayers
      .filter((l) => l.id >= 100)
      .map((l) => ({
        id: l.id,
        title: l.title,
        visible: l.visible,
        opacity: l.opacity,
      })),
  });

  // HUC FeatureLayers (IDs 0-2) — inserted first so they sit at the bottom of the stack
  app.mapImageLayers
    .filter((l) => l.id < 3)
    .forEach((def) => {
      app.layers._featureLayers[def.id] = new FeatureLayer({
        url: `${VECTOR_SERVICE}/${def.id}`,
        title: def.title,
        visible: def.visible,
        opacity: def.opacity,
      });
    });

  // Supporting vector FeatureLayers (IDs 3-9) — inserted after HUC so they render above
  app.mapImageLayers
    .filter((l) => l.id >= 3 && l.id < 100)
    .forEach((def) => {
      app.layers._featureLayers[def.id] = new FeatureLayer({
        url: `${VECTOR_SERVICE}/${def.id}`,
        title: def.title,
        visible: def.visible,
        opacity: def.opacity,
      });
    });

  // Portal IDs for TNC Basemaps. Use any id to set basemap for map.
  const tncLightMapId = 'dfe65251dac240a19c8edb892a3ea664';
  const tncDarkMapId = '1f48b2b2456c44ad9c58d6741378c2ba';
  const tncOutdoorMapId = 'd10c378e8a8d46998e1d248827855c69';
  const tncTopoMapId = '1dde97af802846f597a03d04050bad5b';

  // Create map. Use one ID from above to set the default basemap
  // Layer order: HUC (bottom) → raster → supporting vector (top)
  const _allFL = Object.values(app.layers._featureLayers);
  app.map = new Map({
    layers: [
      ..._allFL.slice(0, 3),
      app.layers._rasterLayer,
      ..._allFL.slice(3),
    ],
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
    },
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
        () => app.resultsLayer.removeAll(),
      ),
  );

  app.view
    .whenLayerView(app.layers._featureLayers[0])
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
