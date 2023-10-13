var search = window.location.search;
// check for save and share data in URL
if (search) {
  let searchslice = search.slice(8);
  let so = JSON.parse(decodeURIComponent(searchslice));
  app.obj = JSON.parse(so);
  console.log(app.obj);
} else {
  // if no save and share, use obj.json file
  fetch('obj.json')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      app.obj = data;
    });
}
// build top level controls
app.topObj = {
  introP:
    'The Trinity Floodplain Prioritization Tool (FPPT) is designed to help identify key opportunities for floodplain protection and restoration in the Trinity River Basin. Use the selector widgets below to specify criteria related to current and future flood risk, current and projected land use characteristics, water quality, wildlife habitat, and carbon storage. The map on the right will change in response to your selections to identify sites that meet all the selected criteria and help identify the geographies where floodplain conservation is likely to have the greatest positive impact for the conservation and community priorities selected.',
  toggleBtns: {
    tb1: {
      header: 'Select Flood Frequency',
      name: 'floodFreq',
      btns: {
        b1: {
          id: 'ff-1',
          value: '1',
          label: '1-in-5-year',
        },
        b2: {
          id: 'ff-2',
          value: '2',
          label: '1-in-100-year',
        },
        b3: {
          id: 'ff-3',
          value: '3',
          label: '1-in-500-year',
        },
      },
      info: 'The delineation of the 1-in-5-year, 1-in-100-year, or 1-in-500-year floodplain is based on the FEMA base-level engineering (BLE) flood risk data, supplemented with Fathom floodplain data developed for the Texas Water Development Board (TWDB).<br><br>To learn more about the FEMA BLE dataset, visit <a target="_blank" href="https://webapps.usgs.gov/infrm/estBFE/">here</a>.<br>To learn more about the supplementary TWDB Fathom dataset, visit <a target="_blank" href="https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/ac16256918db4e188807b3a2c30b0f72">here</a>.'
    },
    tb2: {
      header: 'View Floodplains By Watershed Size',
      name: 'huc',
      btns: {
        b1: {
          id: '-h8',
          value: '0',
          label: 'HUC-8',
        },
        b2: {
          id: '-h12',
          value: '1',
          label: 'HUC-12',
        },
        b3: {
          id: '-catch',
          value: '2',
          label: 'Catchment',
        },
      },
      info: 'The granularity of the watersheds (HUC zone) used in the analysis includes HUC-8, HUC-12, and catchment scales. <a target="_blank" href="https://water.usgs.gov/GIS/huc.html">More info</a>'
    },
  },
};
// object to build filter controls
app.filterObj = {
  group0: {
    header: 'Available Floodplain Area',
    controls: {
      con0: {
        type: 'slider',
        field: 'Acres',
        label:
          'Available floodplain area for the currently specified flood frequency',
        unit: 'acres',
      },
      con1: {
        type: 'slider',
        field: 'AcresUnp',
        label:
          'Available unprotected floodplain area for the currently specified flood frequency',
        unit: 'acres',
      },
    },
  },
  group1: {
    header: 'Water Quality & Soils',
    controls: {
      con0: {
        type: 'slider',
        field: 'iy_tn_p',
        label: 'Nitrogen yield to local waterway',
        unit: '',
      },
      con1: {
        type: 'slider',
        field: 'iy_tn_del_p',
        label: 'Nitrogen yield to Gulf of Mexico',
        unit: '',
      },
      con2: {
        type: 'slider',
        field: 'iy_tp_p',
        label: 'Phosphorus yield to local waterway',
        unit: '',
      },
      con3: {
        type: 'slider',
        field: 'iy_tp_del_p',
        label: 'Phosphorus yield to Gulf of Mexico',
        unit: '',
      },
      con4: {
        type: 'slider',
        field: 'iy_ss_p',
        label: 'Suspended sediment yield to local waterway',
        unit: '',
      },
      con5: {
        type: 'slider',
        field: 'iy_ss_del_p',
        label: 'Suspended sediment yield to Gulf of Mexico',
        unit: '',
      },
      con6: {
        type: 'radio',
        field: 'bacteria',
        label:
          'Does the watershed contain a stream 303d-listed as impaired for bacteria?',
        unit: '',
      },
      con7: {
        type: 'slider',
        field: 'pdsoilpc',
        label:
          'Percent of floodplain in somewhat poorly, poorly, & very poorly drained soils',
        unit: '%',
      },
      con8: {
        type: 'slider',
        field: 'kfact',
        label: 'Soil erodibility index in the floodplain (K factor)',
        unit: '',
      },
    },
  },
  group2: {
    header: 'Habitat',
    controls: {
      con0: {
        type: 'radio',
        field: 'TXTerr',
        label:
          'Does the floodplain contain a Texas terrestrial conservation priority area?',
        unit: '',
      },
      con1: {
        type: 'radio',
        field: 'TXFresh',
        label:
          'Does the floodplain contain a Texas freshwater conservation priority area?',
        unit: '',
      },
      con2: {
        type: 'slider',
        field: 'resil',
        label: 'Terrestrial resilience index within the floodplain',
        unit: '',
      },
      con3: {
        type: 'slider',
        field: 'nearProt',
        label: 'Connectivity -- Acres of floodplain near protected land',
        unit: 'acres',
      },
    },
  },
  group3: {
    header: 'Carbon Storage',
    controls: {
      con0: {
        type: 'slider',
        field: 'abovegrC',
        label: 'Mean above-ground carbon in the floodplain',
        unit: 'tons C/ha',
      },
      con1: {
        type: 'slider',
        field: 'belowgrC',
        label: 'Mean below-ground carbon in the floodplain',
        unit: 'tons C/ha',
      },
    },
  },
  group4: {
    header: 'Flood Risk -- Community',
    controls: {
      con0: {
        type: 'slider',
        field: 'popnow',
        label: 'Population exposure to floods (present-day)',
        unit: '',
      },
      con1: {
        type: 'slider',
        field: 'pop2050',
        label: 'Population exposure to floods (2050)',
        unit: '',
      },
      con2: {
        type: 'radio',
        field: 'builddir',
        label: 'Watershed is in a county with high estimated direct building losses in the 100-year floodplain',
        unit: '',
      },
      con3: {
        type: 'slider',
        field: 'damages',
        label: 'Projected future flood damages (2050) ($)',
        unit: '$',
      },
      con4: {
        type: 'slider',
        field: 'SVI',
        label: 'CDC Social Vulnerability Index',
        unit: '',
      },
    },
  },
  group5: {
    header: 'Flood Risk -- Agriculture',
    controls: {
      con0: {
        type: 'slider',
        field: 'inCDLp',
        label: 'Percent of floodplain in cropland or grassland/pasture',
        unit: ''
      },
      con1: {
        type: 'radio',
        field: 'agnow',
        label: 'Watershed is in a county with high estimated current & future agricultural losses in the 100-year floodplain',
        info: ''
      },
      con2: {
        type: 'slider',
        field: 'nccpi',
        label: 'Agricultural productivity potential of soils in the floodplain',
        unit: '',
      }
    },
  },
  group6: {
    header: 'Development Pressure',
    controls: {
      con0: {
        type: 'slider',
        field: 'devpr_fp',
        label: 'Development pressure in the floodplain by 2050 (index)',
        unit: '',
      },
      con1: {
        type: 'slider',
        field: 'devpres',
        label: 'Development pressure in the watershed by 2050 (index)',
        unit: '',
      },
    },
  },
};
// define if app has supporting layers
app.hasSupportingLayers = true;
// feature layers obj
app.mapImageLayers = [
  {
    id: 0,
    visible: true,
    title: 'HUC 8s',
    opacity: 0.5,
  },
  {
    id: 1,
    visible: false,
    title: 'HUC 12s',
    opacity: 0.5,
  },
  {
    id: 2,
    visible: false,
    title: 'Catchments',
    opacity: 0.5,
  },
  {
    id: 3,
    visible: false,
    title: '5-Year Floodplain (unprotected)',
    opacity: 0.8,
    supporting: true,
    info: "<b>Texas Water Development Board cursory floodplain</b><br><a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/ac16256918db4e188807b3a2c30b0f72' target='_blank'>More info</a>"
  },
  {
    id: 4,
    visible: false,
    title: '100-Year Floodplain (unprotected)',
    opacity: 0.8,
    supporting: true,
    info:"<b>FEMA base-level engineering (BLE) floodplain</b><br><a href='https://webapps.usgs.gov/infrm/estBFE/' target='_blank'>More info</a><br><br>Floodplain in the HUC8 'Lower West Fork Trinity' is represented by <b>Texas Water Development Board cursory floodplain</b><br><a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/ac16256918db4e188807b3a2c30b0f72' target='_blank'>More info</a>"
  },
  {
    id: 5,
    visible: false,
    title: '500-Year Floodplain (unprotected)',
    opacity: 0.8,
    supporting: true,
    info: "<b>FEMA base-level engineering (BLE) floodplain</b><br><a href='https://webapps.usgs.gov/infrm/estBFE/' target='_blank'>More info</a><br><br>Floodplain in the HUC8 'Lower West Fork Trinity' is represented by <b>Texas Water Development Board cursory floodplain</b><br><a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/ac16256918db4e188807b3a2c30b0f72' target='_blank'>More info</a>"
  },
  {
    id: 8,
    visible: false,
    title: 'TNC freshwater conservation priority areas',
    opacity: 0.8,
    supporting: true,
  },
  {
    id: 7,
    visible: false,
    title: 'TNC terrestrial conservation priority areas',
    opacity: 0.8,
    supporting: true,
  },
  {
    id: 10,
    visible: false,
    title: 'Land cover (2019)',
    opacity: 0.8,
    supporting: true,
    info: "<b>Multi-Resolution Land Characteristics Consortium (MRLC) National Land Cover Dataset (NLCD) 2019</b><br><a href='https://www.mrlc.gov/data/nlcd-2019-land-cover-conus' target='_blank'>More info</a>"
  },
  {
    id: 6,
    visible: false,
    title: 'Protected Areas Database of the U.S.',
    opacity: 0.8,
    supporting: true,
    info: "PAD-US is America’s official national inventory of U.S. terrestrial and marine protected areas that are dedicated to the preservation of biological diversity and to other natural, recreational, and cultural uses, managed for these purposes through legal or other effective means. <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
  },
  {
    id: 12,
    visible: false,
    title: 'Development pressure index',
    opacity: 0.8,
    supporting: true,
    info: "This index was calculated by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of those land use types based on the National Structure Inventory (NSI).<br><br>A higher (more red) index value indicates a more extreme projected transition by 2050 (e.g. non-urban to very urban) and a lower (more green) index value indicates a less extreme projected transition by 2050 (e.g. suburban-low to suburban-high). Where no color is present, no development is expected. <a href='https://iclus.epa.gov/' target='_blank'>More info</a>"
  },
  {
    id: 13,
    visible: false,
    title: 'Estimated direct building losses in the 100-year floodplain (millions of $)',
    opacity: 0.8,
    supporting: true,
    info: "County-level information is taken from Table 2.9 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>"
  },
  {
    id: 11,
    visible: false,
    title: 'Estimated crop & livestock production losses in the 100-year floodplain (millions of $)',
    opacity: 0.8,
    supporting: true,
    info: "County-level information is taken from Table 2.8 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>"
  }
];

// definition expression root field names
app.Acres = '';
app.AcresUnp = '';
app.iy_tn = '';
app.iy_tn_del = '';
app.iy_tp = '';
app.iy_tp_del = '';
app.iy_ss = '';
app.iy_ss_del = '';
app.iy_tn_p = '';
app.iy_tn_del_p = '';
app.iy_tp_p = '';
app.iy_tp_del_p = '';
app.iy_ss_p = '';
app.iy_ss_del_p = '';
app.bacteria = '';
app.TXTerr = '';
app.TXFresh = '';
app.resil = '';
app.nearProt = '';
app.abovegrC = '';
app.belowgrC = '';
app.SVI = '';
app.popnow = '';
app.pop2050 = '';
app.damages = '';
app.devpres = '';
app.devpr_fp = '';
app.nccpi = '';
app.incroppc = '';
app.inrangpc = '';
app.pdsoilpc = '';
app.kfact = '';
app.inCDLp = '';
app.builddir = '';
app.agnow = '';

// object for range slider
app.sliderObj = {
  // huc 8 + 1 in 5 year flood
  h81: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 100000,
      gtmax: false,
      info: "Acres of available floodplain including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    AcresUnp: {
      values: [],
      vis: true,
      min: 0,
      max: 100000,
      gtmax: false,
      info: "Acres of available floodplain <b>not</b> including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    iy_tn_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to local waterway</b><br>Kg/yr of nitrogen from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tn_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to Gulf of Mexico</b><br>Kg/yr of nitrogen from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to local waterway</b><br>Kg/yr of phosphorus from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to Gulf of Mexico</b><br>Kg/yr of phosphorus from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>",
    },
    iy_ss_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to local waterway</b><br>MT/yr of suspended sediment from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_ss_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to Gulf of Mexico</b><br>MT/yr of suspended sediment from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    resil: {
      values: [],
      vis: true,
      min: -0.362,
      max: 1.431,
      step: 0.001,
      info: "<b>Terrestrial resilience</b><br> The terrestrial resilience score estimates the climate resilience of an area of land based on: a). its landscape diversity (estimated microclimates) and b). local connectedness (lack of fragmentation). Each site is scored relative to all other sites in its ecoregion that have the same geophysical setting based on soils, bedrock geology, and elevation zone. Scores are standard deviations above the average score. Least resilient = -3.5 to -2.0; less resilient = -2.0 to -1.0; slightly less resilient = -1.0 to -0.5; average/median resilient = -0.5 to +0.5; slightly more resilient = +0.5 to +1.0; more resilient = +1.0 to +2.0; most resilient = +2.0 to +3.5. <a href='https://maps.tnc.org/resilientland/' target='_blank'>More info</a>",
    },
    nearProt: {
      values: [],
      vis: true,
      min: 0,
      max: 600,
      gtmax: false,
      info: "<b>Floodplains near protected lands</b><br> Acres of unprotected floodplain within 0.25 miles of Protected Areas Database of the U.S. (PAD-US) protected lands. <a href='https://www.usgs.gov/core-science-systems/science-analytics-and-synthesis/gap/science/protected-areas' target='_blank'>More info</a>",
    },
    abovegrC: {
      values: [],
      vis: true,
      min: 0,
      max: 35,
      gtmax: false,
      info: "<b>Mean above-ground carbon in the floodplain</b><br>Estimate of above-ground C stock (tons C/ha) using methods in Wilson <i>et al.</i> (2013). <a href='https://cbmjournal.biomedcentral.com/articles/10.1186/1750-0680-8-1#Sec5' target='_blank'>More info</a>"
    },
    belowgrC: {
      values: [],
      vis: true,
      min: 100,
      max: 127,
      gtmax: false,
      info: "<b>Mean below-ground carbon in the floodplain</b><br>Estimate of below-ground C stock (tons C/ha) from NRCS Rapid Carbon Assessment (RaCA). <a href='https://www.nrcs.usda.gov/resources/data-and-reports/rapid-carbon-assessment-raca' target='_blank'>More info</a>"
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 5200,
      info: "<b>Population exposure to floods (present-day)</b><br>People currently living in floodplain of the specified flood frequency. Population sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 42000,
      info: "<b>Population exposure to floods (2050)</b><br>People expected to be living in the floodplain of the selected flood frequency by 2050, determined using the methods in Wing <i>et al.</i> (2018). <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>."
    },
    damages: {
      values: [],
      vis: true,
      min: 0,
      max: 1334008534,
      info: "<b>Projected future flood damages (2050) ($)</b><br> Estimate of property damage in the floodplain corresponding to the currently selected flood frequency, given flood depth and projected 2050 land use / building type. Estimated using the methods in Wing <i>et al.</i>. <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>.",
    },
    SVI: {
      values: [],
      vis: true,
      min: 0.159,
      max: 0.663,
      step: 0.001,
      info: "<b>CDC Social Vulnerability Index (SVI)</b><br>The CDC SVI characterizes census tracts that are especially at risk during public health emergencies due to factors such as socioeconomic status, household composition, minority status, housing type, or transportation.<br><br>The value of the index is a percentile -- e.g. a value of 0.85 indicates the location is in a census tract that is more socially vulnerable than 85% of census tracts in the U.S.<br><br>Within this tool, the SVI is assessed within the floodplain of the currently selected flood frequency. SVI is sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    inCDLp: {
      values: [],
      vis: true,
      min: 12,
      max: 57,
      info: "<b>Percent of floodplain in agricultural land (crops or grassland/pasture)</b><br>The percent of the floodplain that is either in any type of cropland or in grassland/pasture, according to the 2020 USDA Cropland Data Layer (CDL). <a href='https://www.nass.usda.gov/Research_and_Science/Cropland/sarsfaqs2.php' target='_blank'>More info</a>."
    },
    devpr_fp: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      step: 0.001,
      info: "<b>Development pressure in the floodplain</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>"
    },
    devpres: {
      values: [],
      vis: true,
      shfld: true,
      min: 0,
      max: 2.236,
      step: 0.001,
      info: "<b>Development pressure in the watershed</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>" 
    },
    incroppc: {
      values: [],
      vis: true,
      min: 0,
      max: 13,
      info: "<b>% of floodplain in cropland or pasture</b><br>The percent of the floodplain in cultivated crops, according to the National Land Cover Dataset (NLCD) for 2019, available <a href='https://www.mrlc.gov/data/nlcd-2019-land-cover-conus' target='_blank'>here</a>.",
    },
    inrangpc: {
      values: [],
      vis: true,
      min: 0,
      max: 69,
      info: "<b>% of floodplain in rangeland</b><br>The percent of the floodplain in rangeland, according to U.S. Forest Service rangelands data, available <a href='https://data.fs.usda.gov/geodata/rastergateway/rangelands/index.php' target='_blank'>here</a>."
    },
    nccpi: {
      values: [],
      vis: true,
      min: 0.24,
      max: 0.38,
      step: 0.001,
      info: "<b>Agricultural productivity potential of soils in the floodplain</b><br> Uses the National Commodity Crop Productivity Index (NCCPI), an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration. <a href='https://www.nrcs.usda.gov/sites/default/files/2023-01/NCCPI-User-Guide.pdf' target='_blank'>More info</a>",
    },
    pdsoilpc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Percent of floodplain in somewhat poorly, poorly, & very poorly drained soils</b><br> The percent of floodplain area that is in somewhat poorly, poorly, & very poorly drained soils, according to the SSURGO soils database. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/Supplemental/SoilsDrainageClassDominantCondition.pdf' target='_blank'>More info</a>",
    },
    kfact: {
      values: [],
      vis: true,
      min: 0.20,
      max: 0.33,
      step: 0.001,
      info: "<b>Soil erodibility index (K factor) in the floodplain</b><br> The K factor quantifies the relative susceptibility of the soil to sheet & rill erosion. It is derived from texture, organic matter content, soil structure, and saturated hydraulic conductivity. It ranges from 0.02 (least erodible) to 0.64 (most erodible). <a href='http://www.iwr.msu.edu/rusle/kfactor.htm' target='_blank'>More info</a>",
    },
  },
  // huc 8 + 1 in 100 year flood
  h82: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 418000,
      gtmax: false,
      info: "Acres of available floodplain including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    AcresUnp: {
      values: [],
      vis: true,
      min: 0,
      max: 412000,
      gtmax: false,
      info: "Acres of available floodplain <b>not</b> including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    iy_tn_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to local waterway</b><br>Kg/yr of nitrogen from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tn_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to Gulf of Mexico</b><br>Kg/yr of nitrogen from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to local waterway</b><br>Kg/yr of phosphorus from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to Gulf of Mexico</b><br>Kg/yr of phosphorus from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>",
    },
    iy_ss_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to local waterway</b><br>MT/yr of suspended sediment from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_ss_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to Gulf of Mexico</b><br>MT/yr of suspended sediment from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    resil: {
      values: [],
      vis: true,
      min: -0.447,
      max: 1.262,
      step: 0.001,
      info: "<b>Terrestrial resilience</b><br> The terrestrial resilience score estimates the climate resilience of an area of land based on: a). its landscape diversity (estimated microclimates) and b). local connectedness (lack of fragmentation). Each site is scored relative to all other sites in its ecoregion that have the same geophysical setting based on soils, bedrock geology, and elevation zone. Scores are standard deviations above the average score. Least resilient = -3.5 to -2.0; less resilient = -2.0 to -1.0; slightly less resilient = -1.0 to -0.5; average/median resilient = -0.5 to +0.5; slightly more resilient = +0.5 to +1.0; more resilient = +1.0 to +2.0; most resilient = +2.0 to +3.5. <a href='https://maps.tnc.org/resilientland/' target='_blank'>More info</a>",
    },
    nearProt: {
      values: [],
      vis: true,
      min: 0,
      max: 2866,
      gtmax: false,
      info: "<b>Floodplains near protected lands</b><br> Acres of unprotected floodplain within 0.25 miles of Protected Areas Database of the U.S. (PAD-US) protected lands. <a href='https://www.usgs.gov/core-science-systems/science-analytics-and-synthesis/gap/science/protected-areas' target='_blank'>More info</a>",
    },
    abovegrC: {
      values: [],
      vis: true,
      min: 0,
      max: 33,
      gtmax: false,
      info: "<b>Mean above-ground carbon in the floodplain</b><br>Estimate of above-ground C stock (tons C/ha) using methods in Wilson <i>et al.</i> (2013). <a href='https://cbmjournal.biomedcentral.com/articles/10.1186/1750-0680-8-1#Sec5' target='_blank'>More info</a>"
    },
    belowgrC: {
      values: [],
      vis: true,
      min: 93,
      max: 119,
      gtmax: false,
      info: "<b>Mean below-ground carbon in the floodplain</b><br>Estimate of below-ground C stock (tons C/ha) from NRCS Rapid Carbon Assessment (RaCA). <a href='https://www.nrcs.usda.gov/resources/data-and-reports/rapid-carbon-assessment-raca' target='_blank'>More info</a>"
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 134000,
      info: "<b>Population exposure to floods (present-day)</b><br>People currently living in floodplain of the specified flood frequency. Population sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 181000,
      info: "<b>Population exposure to floods (2050)</b><br>People expected to be living in the floodplain of the selected flood frequency by 2050, determined using the methods in Wing <i>et al.</i> (2018). <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>."
    },
    damages: {
      values: [],
      vis: true,
      min: 0,
      max: 5400282027,
      info: "<b>Projected future flood damages (2050) ($)</b><br> Estimate of property damage in the floodplain corresponding to the currently selected flood frequency, given flood depth and projected 2050 land use / building type. Estimated using the methods in Wing <i>et al.</i>. <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>.",
    },
    SVI: {
      values: [],
      vis: true,
      min: 0.169,
      max: 0.644,
      step: 0.001,
      info: "<b>CDC Social Vulnerability Index (SVI)</b><br>The CDC SVI characterizes census tracts that are especially at risk during public health emergencies due to factors such as socioeconomic status, household composition, minority status, housing type, or transportation.<br><br>The value of the index is a percentile -- e.g. a value of 0.85 indicates the location is in a census tract that is more socially vulnerable than 85% of census tracts in the U.S.<br><br>Within this tool, the SVI is assessed within the floodplain of the currently selected flood frequency. SVI is sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    inCDLp: {
      values: [],
      vis: true,
      min: 26,
      max: 61,
      info: "<b>Percent of floodplain in agricultural land (crops or grassland/pasture)</b><br>The percent of the floodplain that is either in any type of cropland or in grassland/pasture, according to the 2020 USDA Cropland Data Layer (CDL). <a href='https://www.nass.usda.gov/Research_and_Science/Cropland/sarsfaqs2.php' target='_blank'>More info</a>."
    },
    devpr_fp: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      step: 0.001,
      info: "<b>Development pressure in the floodplain</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>" 
    },
    devpres: {
      values: [],
      vis: true,
      shfld: true,
      min: 0,
      max: 2.236,
      step: 0.001,
      info: "<b>Development pressure in the watershed</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>" 
    },
    incroppc: {
      values: [],
      vis: true,
      min: 0,
      max: 21,
      info: "<b>% of floodplain in cropland or pasture</b><br>The percent of the floodplain in cultivated crops, according to the National Land Cover Dataset (NLCD) for 2019, available <a href='https://www.mrlc.gov/data/nlcd-2019-land-cover-conus' target='_blank'>here</a>.",
    },
    inrangpc: {
      values: [],
      vis: true,
      min: 0,
      max: 63,
      info: "<b>% of floodplain in rangeland</b><br>The percent of the floodplain in rangeland, according to U.S. Forest Service rangelands data, available <a href='https://data.fs.usda.gov/geodata/rastergateway/rangelands/index.php' target='_blank'>here</a>."
    },
    nccpi: {
      values: [],
      vis: true,
      min: 0.29,
      max: 0.40,
      step: 0.001,
      info: "<b>Agricultural productivity potential of soils in the floodplain</b><br> Uses the National Commodity Crop Productivity Index (NCCPI), an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration. <a href='https://www.nrcs.usda.gov/sites/default/files/2023-01/NCCPI-User-Guide.pdf' target='_blank'>More info</a>",
    },
    pdsoilpc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Percent of floodplain in somewhat poorly, poorly, & very poorly drained soils</b><br> The percent of floodplain area that is in somewhat poorly, poorly, & very poorly drained soils, according to the SSURGO soils database. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/Supplemental/SoilsDrainageClassDominantCondition.pdf' target='_blank'>More info</a>",
    },
    kfact: {
      values: [],
      vis: true,
      min: 0.218,
      max: 0.339,
      step: 0.001,
      info: "<b>Soil erodibility index (K factor) in the floodplain</b><br> The K factor quantifies the relative susceptibility of the soil to sheet & rill erosion. It is derived from texture, organic matter content, soil structure, and saturated hydraulic conductivity. It ranges from 0.02 (least erodible) to 0.64 (most erodible). <a href='http://www.iwr.msu.edu/rusle/kfactor.htm' target='_blank'>More info</a>",
    },
  },
  // huc 8 + 1 in 500 year flood
  h83: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 452000,
      gtmax: false,
      info: "Acres of available floodplain including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    AcresUnp: {
      values: [],
      vis: true,
      min: 0,
      max: 445000,
      gtmax: false,
      info: "Acres of available floodplain <b>not</b> including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    iy_tn_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to local waterway</b><br>Kg/yr of nitrogen from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tn_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to Gulf of Mexico</b><br>Kg/yr of nitrogen from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to local waterway</b><br>Kg/yr of phosphorus from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to Gulf of Mexico</b><br>Kg/yr of phosphorus from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>",
    },
    iy_ss_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to local waterway</b><br>MT/yr of suspended sediment from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_ss_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to Gulf of Mexico</b><br>MT/yr of suspended sediment from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    resil: {
      values: [],
      vis: true,
      min: -0.612,
      max: 1.249,
      step: 0.001,
      info: "<b>Terrestrial resilience</b><br> The terrestrial resilience score estimates the climate resilience of an area of land based on: a). its landscape diversity (estimated microclimates) and b). local connectedness (lack of fragmentation). Each site is scored relative to all other sites in its ecoregion that have the same geophysical setting based on soils, bedrock geology, and elevation zone. Scores are standard deviations above the average score. Least resilient = -3.5 to -2.0; less resilient = -2.0 to -1.0; slightly less resilient = -1.0 to -0.5; average/median resilient = -0.5 to +0.5; slightly more resilient = +0.5 to +1.0; more resilient = +1.0 to +2.0; most resilient = +2.0 to +3.5. <a href='https://maps.tnc.org/resilientland/' target='_blank'>More info</a>",
    },
    nearProt: {
      values: [],
      vis: true,
      min: 0,
      max: 3127,
      gtmax: false,
      info: "<b>Floodplains near protected lands</b><br> Acres of unprotected floodplain within 0.25 miles of Protected Areas Database of the U.S. (PAD-US) protected lands. <a href='https://www.usgs.gov/core-science-systems/science-analytics-and-synthesis/gap/science/protected-areas' target='_blank'>More info</a>",
    },
    abovegrC: {
      values: [],
      vis: true,
      min: 10,
      max: 32,
      gtmax: false,
      info: "<b>Mean above-ground carbon in the floodplain</b><br>Estimate of above-ground C stock (tons C/ha) using methods in Wilson <i>et al.</i> (2013). <a href='https://cbmjournal.biomedcentral.com/articles/10.1186/1750-0680-8-1#Sec5' target='_blank'>More info</a>"
    },
    belowgrC: {
      values: [],
      vis: true,
      min: 91,
      max: 118,
      gtmax: false,
      info: "<b>Mean below-ground carbon in the floodplain</b><br>Estimate of below-ground C stock (tons C/ha) from NRCS Rapid Carbon Assessment (RaCA). <a href='https://www.nrcs.usda.gov/resources/data-and-reports/rapid-carbon-assessment-raca' target='_blank'>More info</a>"
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 159000,
      info: "<b>Population exposure to floods (present-day)</b><br>People currently living in floodplain of the specified flood frequency. Population sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 216000,
      info: "<b>Population exposure to floods (2050)</b><br>People expected to be living in the floodplain of the selected flood frequency by 2050, determined using the methods in Wing <i>et al.</i> (2018). <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>."
    },
    damages: {
      values: [],
      vis: true,
      min: 0,
      max: 7391108835,
      info: "<b>Projected future flood damages (2050) ($)</b><br> Estimate of property damage in the floodplain corresponding to the currently selected flood frequency, given flood depth and projected 2050 land use / building type. Estimated using the methods in Wing <i>et al.</i>. <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>.",
    },
    SVI: {
      values: [],
      vis: true,
      min: 0.165,
      max: 0.644,
      step: 0.001,
      info: "<b>CDC Social Vulnerability Index (SVI)</b><br>The CDC SVI characterizes census tracts that are especially at risk during public health emergencies due to factors such as socioeconomic status, household composition, minority status, housing type, or transportation.<br><br>The value of the index is a percentile -- e.g. a value of 0.85 indicates the location is in a census tract that is more socially vulnerable than 85% of census tracts in the U.S.<br><br>Within this tool, the SVI is assessed within the floodplain of the currently selected flood frequency. SVI is sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    inCDLp: {
      values: [],
      vis: true,
      min: 20,
      max: 61,
      info: "<b>Percent of floodplain in agricultural land (crops or grassland/pasture)</b><br>The percent of the floodplain that is either in any type of cropland or in grassland/pasture, according to the 2020 USDA Cropland Data Layer (CDL). <a href='https://www.nass.usda.gov/Research_and_Science/Cropland/sarsfaqs2.php' target='_blank'>More info</a>."
    },
    devpr_fp: {
      values: [],
      vis: true,
      min: 0,
      max: 2.023,
      step: 0.001,
      info: "<b>Development pressure in the floodplain</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>" 
    },
    devpres: {
      values: [],
      vis: true,
      shfld: true,
      min: 0,
      max: 2.236,
      step: 0.001,
      info: "<b>Development pressure in the watershed</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>" 
    },
    incroppc: {
      values: [],
      vis: true,
      min: 0,
      max: 20,
      info: "<b>% of floodplain in cropland or pasture</b><br>The percent of the floodplain in cultivated crops, according to the National Land Cover Dataset (NLCD) for 2019, available <a href='https://www.mrlc.gov/data/nlcd-2019-land-cover-conus' target='_blank'>here</a>.",
    },
    inrangpc: {
      values: [],
      vis: true,
      min: 0,
      max: 62,
      info: "<b>% of floodplain in rangeland</b><br>The percent of the floodplain in rangeland, according to U.S. Forest Service rangelands data, available <a href='https://data.fs.usda.gov/geodata/rastergateway/rangelands/index.php' target='_blank'>here</a>."
    },
    nccpi: {
      values: [],
      vis: true,
      min: 0.315,
      max: 0.396,
      step: 0.001,
      info: "<b>Agricultural productivity potential of soils in the floodplain</b><br> Uses the National Commodity Crop Productivity Index (NCCPI), an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration. <a href='https://www.nrcs.usda.gov/sites/default/files/2023-01/NCCPI-User-Guide.pdf' target='_blank'>More info</a>",
    },
    pdsoilpc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Percent of floodplain in somewhat poorly, poorly, & very poorly drained soils</b><br> The percent of floodplain area that is in somewhat poorly, poorly, & very poorly drained soils, according to the SSURGO soils database. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/Supplemental/SoilsDrainageClassDominantCondition.pdf' target='_blank'>More info</a>",
    },
    kfact: {
      values: [],
      vis: true,
      min: 0.221,
      max: 0.352,
      step: 0.001,
      info: "<b>Soil erodibility index (K factor) in the floodplain</b><br> The K factor quantifies the relative susceptibility of the soil to sheet & rill erosion. It is derived from texture, organic matter content, soil structure, and saturated hydraulic conductivity. It ranges from 0.02 (least erodible) to 0.64 (most erodible). <a href='http://www.iwr.msu.edu/rusle/kfactor.htm' target='_blank'>More info</a>",
    },
  },

  // huc 12 + 1 in 5 year flood
  h121: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 10450,
      gtmax: false,
      info: "Acres of available floodplain including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    AcresUnp: {
      values: [],
      vis: true,
      min: 0,
      max: 9784,
      gtmax: false,
      info: "Acres of available floodplain <b>not</b> including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    iy_tn_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to local waterway</b><br>Kg/yr of nitrogen from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tn_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to Gulf of Mexico</b><br>Kg/yr of nitrogen from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to local waterway</b><br>Kg/yr of phosphorus from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to Gulf of Mexico</b><br>Kg/yr of phosphorus from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>",
    },
    iy_ss_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to local waterway</b><br>MT/yr of suspended sediment from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_ss_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to Gulf of Mexico</b><br>MT/yr of suspended sediment from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    resil: {
      values: [],
      vis: true,
      min: -2.975,
      max: 2.599,
      step: 0.001,
      info: "<b>Terrestrial resilience</b><br> The terrestrial resilience score estimates the climate resilience of an area of land based on: a). its landscape diversity (estimated microclimates) and b). local connectedness (lack of fragmentation). Each site is scored relative to all other sites in its ecoregion that have the same geophysical setting based on soils, bedrock geology, and elevation zone. Scores are standard deviations above the average score. Least resilient = -3.5 to -2.0; less resilient = -2.0 to -1.0; slightly less resilient = -1.0 to -0.5; average/median resilient = -0.5 to +0.5; slightly more resilient = +0.5 to +1.0; more resilient = +1.0 to +2.0; most resilient = +2.0 to +3.5. <a href='https://maps.tnc.org/resilientland/' target='_blank'>More info</a>",
    },
    nearProt: {
      values: [],
      vis: true,
      min: 0,
      max: 116,
      gtmax: false,
      info: "<b>Floodplains near protected lands</b><br> Acres of unprotected floodplain within 0.25 miles of Protected Areas Database of the U.S. (PAD-US) protected lands. <a href='https://www.usgs.gov/core-science-systems/science-analytics-and-synthesis/gap/science/protected-areas' target='_blank'>More info</a>",
    },
    abovegrC: {
      values: [],
      vis: true,
      min: 0,
      max: 66,
      gtmax: false,
      info: "<b>Mean above-ground carbon in the floodplain</b><br>Estimate of above-ground C stock (tons C/ha) using methods in Wilson <i>et al.</i> (2013). <a href='https://cbmjournal.biomedcentral.com/articles/10.1186/1750-0680-8-1#Sec5' target='_blank'>More info</a>"
    },
    belowgrC: {
      values: [],
      vis: true,
      min: 56,
      max: 159,
      gtmax: false,
      info: "<b>Mean below-ground carbon in the floodplain</b><br>Estimate of below-ground C stock (tons C/ha) from NRCS Rapid Carbon Assessment (RaCA). <a href='https://www.nrcs.usda.gov/resources/data-and-reports/rapid-carbon-assessment-raca' target='_blank'>More info</a>"
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 150,
      gtmax: true,
      info: "<b>Population exposure to floods (present-day)</b><br>People currently living in floodplain of the specified flood frequency. Population sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 900,
      gtmax: true,
      info: "<b>Population exposure to floods (2050)</b><br>People expected to be living in the floodplain of the selected flood frequency by 2050, determined using the methods in Wing <i>et al.</i> (2018). <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>."
    },
    damages: {
      values: [],
      vis: true,
      min: 0,
      max: 407000000,
      gtmax: false,
      info: "<b>Projected future flood damages (2050) ($)</b><br> Estimate of property damage in the floodplain corresponding to the currently selected flood frequency, given flood depth and projected 2050 land use / building type. Estimated using the methods in Wing <i>et al.</i>. <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>.",
    },
    SVI: {
      values: [],
      vis: true,
      min: 0.002,
      max: 0.862,
      step: 0.001,
      info: "<b>CDC Social Vulnerability Index (SVI)</b><br>The CDC SVI characterizes census tracts that are especially at risk during public health emergencies due to factors such as socioeconomic status, household composition, minority status, housing type, or transportation.<br><br>The value of the index is a percentile -- e.g. a value of 0.85 indicates the location is in a census tract that is more socially vulnerable than 85% of census tracts in the U.S.<br><br>Within this tool, the SVI is assessed within the floodplain of the currently selected flood frequency. SVI is sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    inCDLp: {
      values: [],
      vis: true,
      min: 0,
      max: 85,
      info: "<b>Percent of floodplain in agricultural land (crops or grassland/pasture)</b><br>The percent of the floodplain that is either in any type of cropland or in grassland/pasture, according to the 2020 USDA Cropland Data Layer (CDL). <a href='https://www.nass.usda.gov/Research_and_Science/Cropland/sarsfaqs2.php' target='_blank'>More info</a>."
    },
    devpr_fp: {
      values: [],
      vis: true,
      min: 0,
      max: 10.4,
      step: 0.001,
      info: "<b>Development pressure in the floodplain</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>" 
    },
    devpres: {
      values: [],
      vis: true,
      shfld: true,
      min: 0,
      max: 6.848,
      step: 0.001,
      info: "<b>Development pressure in the watershed</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>" 
    },
    incroppc: {
      values: [],
      vis: true,
      min: 0,
      max: 73,
      info: "<b>% of floodplain in cropland or pasture</b><br>The percent of the floodplain in cultivated crops, according to the National Land Cover Dataset (NLCD) for 2019, available <a href='https://www.mrlc.gov/data/nlcd-2019-land-cover-conus' target='_blank'>here</a>.",
    },
    inrangpc: {
      values: [],
      vis: true,
      min: 0,
      max: 96,
      info: "<b>% of floodplain in rangeland</b><br>The percent of the floodplain in rangeland, according to U.S. Forest Service rangelands data, available <a href='https://data.fs.usda.gov/geodata/rastergateway/rangelands/index.php' target='_blank'>here</a>."
    },
    nccpi: {
      values: [],
      vis: true,
      min: 0.027,
      max: 0.545,
      step: 0.001,
      info: "<b>Agricultural productivity potential of soils in the floodplain</b><br> Uses the National Commodity Crop Productivity Index (NCCPI), an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration. <a href='https://www.nrcs.usda.gov/sites/default/files/2023-01/NCCPI-User-Guide.pdf' target='_blank'>More info</a>",
    },
    pdsoilpc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Percent of floodplain in somewhat poorly, poorly, & very poorly drained soils</b><br> The percent of floodplain area that is in somewhat poorly, poorly, & very poorly drained soils, according to the SSURGO soils database. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/Supplemental/SoilsDrainageClassDominantCondition.pdf' target='_blank'>More info</a>",
    },
    kfact: {
      values: [],
      vis: true,
      min: 0.142,
      max: 0.639,
      step: 0.001,
      info: "<b>Soil erodibility index (K factor) in the floodplain</b><br> The K factor quantifies the relative susceptibility of the soil to sheet & rill erosion. It is derived from texture, organic matter content, soil structure, and saturated hydraulic conductivity. It ranges from 0.02 (least erodible) to 0.64 (most erodible). <a href='http://www.iwr.msu.edu/rusle/kfactor.htm' target='_blank'>More info</a>",
    },
  },
  // huc 12 + 1 in 100 year flood
  h122: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 31068,
      gtmax: false,
      info: "Acres of available floodplain including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    AcresUnp: {
      values: [],
      vis: true,
      min: 0,
      max: 31056,
      gtmax: false,
      info: "Acres of available floodplain <b>not</b> including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    iy_tn_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to local waterway</b><br>Kg/yr of nitrogen from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tn_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to Gulf of Mexico</b><br>Kg/yr of nitrogen from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to local waterway</b><br>Kg/yr of phosphorus from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to Gulf of Mexico</b><br>Kg/yr of phosphorus from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>",
    },
    iy_ss_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to local waterway</b><br>MT/yr of suspended sediment from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_ss_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to Gulf of Mexico</b><br>MT/yr of suspended sediment from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    resil: {
      values: [],
      vis: true,
      min: -3.491,
      max: 2.012,
      step: 0.001,
      info: "<b>Terrestrial resilience</b><br> The terrestrial resilience score estimates the climate resilience of an area of land based on: a). its landscape diversity (estimated microclimates) and b). local connectedness (lack of fragmentation). Each site is scored relative to all other sites in its ecoregion that have the same geophysical setting based on soils, bedrock geology, and elevation zone. Scores are standard deviations above the average score. Least resilient = -3.5 to -2.0; less resilient = -2.0 to -1.0; slightly less resilient = -1.0 to -0.5; average/median resilient = -0.5 to +0.5; slightly more resilient = +0.5 to +1.0; more resilient = +1.0 to +2.0; most resilient = +2.0 to +3.5. <a href='https://maps.tnc.org/resilientland/' target='_blank'>More info</a>",
    },
    nearProt: {
      values: [],
      vis: true,
      min: 0,
      max: 516,
      gtmax: false,
      info: "<b>Floodplains near protected lands</b><br> Acres of unprotected floodplain within 0.25 miles of Protected Areas Database of the U.S. (PAD-US) protected lands. <a href='https://www.usgs.gov/core-science-systems/science-analytics-and-synthesis/gap/science/protected-areas' target='_blank'>More info</a>",
    },
    abovegrC: {
      values: [],
      vis: true,
      min: 0,
      max: 62,
      gtmax: false,
      info: "<b>Mean above-ground carbon in the floodplain</b><br>Estimate of above-ground C stock (tons C/ha) using methods in Wilson <i>et al.</i> (2013). <a href='https://cbmjournal.biomedcentral.com/articles/10.1186/1750-0680-8-1#Sec5' target='_blank'>More info</a>"
    },
    belowgrC: {
      values: [],
      vis: true,
      min: 59,
      max: 146,
      gtmax: false,
      info: "<b>Mean below-ground carbon in the floodplain</b><br>Estimate of below-ground C stock (tons C/ha) from NRCS Rapid Carbon Assessment (RaCA). <a href='https://www.nrcs.usda.gov/resources/data-and-reports/rapid-carbon-assessment-raca' target='_blank'>More info</a>"
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 1500,
      gtmax: true,
      info: "<b>Population exposure to floods (present-day)</b><br>People currently living in floodplain of the specified flood frequency. Population sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 4000,
      gtmax: true,
      info: "<b>Population exposure to floods (2050)</b><br>People expected to be living in the floodplain of the selected flood frequency by 2050, determined using the methods in Wing <i>et al.</i> (2018). <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>."
    },
    damages: {
      values: [],
      vis: true,
      min: 0,
      max: 977000000,
      gtmax: false,
      info: "<b>Projected future flood damages (2050) ($)</b><br> Estimate of property damage in the floodplain corresponding to the currently selected flood frequency, given flood depth and projected 2050 land use / building type. Estimated using the methods in Wing <i>et al.</i>. <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>.",
    },
    SVI: {
      values: [],
      vis: true,
      min: 0.025,
      max: 0.902,
      step: 0.001,
      info: "<b>CDC Social Vulnerability Index (SVI)</b><br>The CDC SVI characterizes census tracts that are especially at risk during public health emergencies due to factors such as socioeconomic status, household composition, minority status, housing type, or transportation.<br><br>The value of the index is a percentile -- e.g. a value of 0.85 indicates the location is in a census tract that is more socially vulnerable than 85% of census tracts in the U.S.<br><br>Within this tool, the SVI is assessed within the floodplain of the currently selected flood frequency. SVI is sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    inCDLp: {
      values: [],
      vis: true,
      min: 0,
      max: 89,
      info: "<b>Percent of floodplain in agricultural land (crops or grassland/pasture)</b><br>The percent of the floodplain that is either in any type of cropland or in grassland/pasture, according to the 2020 USDA Cropland Data Layer (CDL). <a href='https://www.nass.usda.gov/Research_and_Science/Cropland/sarsfaqs2.php' target='_blank'>More info</a>."
    },
    devpr_fp: {
      values: [],
      vis: true,
      min: 0,
      max: 8.5,
      step: 0.001,
      info: "<b>Development pressure in the floodplain</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>" 
    },
    devpres: {
      values: [],
      vis: true,
      shfld: true,
      min: 0,
      max: 6.848,
      step: 0.001,
      info: "<b>Development pressure in the watershed</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>" 
    },
    incroppc: {
      values: [],
      vis: true,
      min: 0,
      max: 74,
      info: "<b>% of floodplain in cropland or pasture</b><br>The percent of the floodplain in cultivated crops, according to the National Land Cover Dataset (NLCD) for 2019, available <a href='https://www.mrlc.gov/data/nlcd-2019-land-cover-conus' target='_blank'>here</a>.",
    },
    inrangpc: {
      values: [],
      vis: true,
      min: 0,
      max: 89,
      info: "<b>% of floodplain in rangeland</b><br>The percent of the floodplain in rangeland, according to U.S. Forest Service rangelands data, available <a href='https://data.fs.usda.gov/geodata/rastergateway/rangelands/index.php' target='_blank'>here</a>."
    },
    nccpi: {
      values: [],
      vis: true,
      min: 0.124,
      max: 0.529,
      step: 0.001,
      info: "<b>Agricultural productivity potential of soils in the floodplain</b><br> Uses the National Commodity Crop Productivity Index (NCCPI), an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration. <a href='https://www.nrcs.usda.gov/sites/default/files/2023-01/NCCPI-User-Guide.pdf' target='_blank'>More info</a>",
    },
    pdsoilpc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Percent of floodplain in somewhat poorly, poorly, & very poorly drained soils</b><br> The percent of floodplain area that is in somewhat poorly, poorly, & very poorly drained soils, according to the SSURGO soils database. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/Supplemental/SoilsDrainageClassDominantCondition.pdf' target='_blank'>More info</a>",
    },
    kfact: {
      values: [],
      vis: true,
      min: 0.166,
      max: 0.541,
      step: 0.001,
      info: "<b>Soil erodibility index (K factor) in the floodplain</b><br> The K factor quantifies the relative susceptibility of the soil to sheet & rill erosion. It is derived from texture, organic matter content, soil structure, and saturated hydraulic conductivity. It ranges from 0.02 (least erodible) to 0.64 (most erodible). <a href='http://www.iwr.msu.edu/rusle/kfactor.htm' target='_blank'>More info</a>",
    },
  },
  // huc 12 + 1 in 500 year flood
  h123: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 34015,
      gtmax: false,
      info: "Acres of available floodplain including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    AcresUnp: {
      values: [],
      vis: true,
      min: 0,
      max: 34002,
      gtmax: false,
      info: "Acres of available floodplain <b>not</b> including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    iy_tn_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to local waterway</b><br>Kg/yr of nitrogen from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tn_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to Gulf of Mexico</b><br>Kg/yr of nitrogen from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to local waterway</b><br>Kg/yr of phosphorus from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to Gulf of Mexico</b><br>Kg/yr of phosphorus from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>",
    },
    iy_ss_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to local waterway</b><br>MT/yr of suspended sediment from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_ss_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to Gulf of Mexico</b><br>MT/yr of suspended sediment from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    resil: {
      values: [],
      vis: true,
      min: -3.491,
      max: 2.009,
      step: 0.001,
      info: "<b>Terrestrial resilience</b><br> The terrestrial resilience score estimates the climate resilience of an area of land based on: a). its landscape diversity (estimated microclimates) and b). local connectedness (lack of fragmentation). Each site is scored relative to all other sites in its ecoregion that have the same geophysical setting based on soils, bedrock geology, and elevation zone. Scores are standard deviations above the average score. Least resilient = -3.5 to -2.0; less resilient = -2.0 to -1.0; slightly less resilient = -1.0 to -0.5; average/median resilient = -0.5 to +0.5; slightly more resilient = +0.5 to +1.0; more resilient = +1.0 to +2.0; most resilient = +2.0 to +3.5. <a href='https://maps.tnc.org/resilientland/' target='_blank'>More info</a>",
    },
    nearProt: {
      values: [],
      vis: true,
      min: 0,
      max: 520,
      gtmax: false,
      info: "<b>Floodplains near protected lands</b><br> Acres of unprotected floodplain within 0.25 miles of Protected Areas Database of the U.S. (PAD-US) protected lands. <a href='https://www.usgs.gov/core-science-systems/science-analytics-and-synthesis/gap/science/protected-areas' target='_blank'>More info</a>",
    },
    abovegrC: {
      values: [],
      vis: true,
      min: 0,
      max: 61,
      gtmax: false,
      info: "<b>Mean above-ground carbon in the floodplain</b><br>Estimate of above-ground C stock (tons C/ha) using methods in Wilson <i>et al.</i> (2013). <a href='https://cbmjournal.biomedcentral.com/articles/10.1186/1750-0680-8-1#Sec5' target='_blank'>More info</a>"
    },
    belowgrC: {
      values: [],
      vis: true,
      min: 59,
      max: 145,
      gtmax: false,
      info: "<b>Mean below-ground carbon in the floodplain</b><br>Estimate of below-ground C stock (tons C/ha) from NRCS Rapid Carbon Assessment (RaCA). <a href='https://www.nrcs.usda.gov/resources/data-and-reports/rapid-carbon-assessment-raca' target='_blank'>More info</a>"
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 2500,
      gtmax: true,
      info: "<b>Population exposure to floods (present-day)</b><br>People currently living in floodplain of the specified flood frequency. Population sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 5000,
      gtmax: true,
      info: "<b>Population exposure to floods (2050)</b><br>People expected to be living in the floodplain of the selected flood frequency by 2050, determined using the methods in Wing <i>et al.</i> (2018). <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>."
    },
    damages: {
      values: [],
      vis: true,
      min: 0,
      max: 1121000000,
      gtmax: false,
      info: "<b>Projected future flood damages (2050) ($)</b><br> Estimate of property damage in the floodplain corresponding to the currently selected flood frequency, given flood depth and projected 2050 land use / building type. Estimated using the methods in Wing <i>et al.</i>. <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>.",
    },
    SVI: {
      values: [],
      vis: true,
      min: 0.025,
      max: 0.900,
      step: 0.001,
      info: "<b>CDC Social Vulnerability Index (SVI)</b><br>The CDC SVI characterizes census tracts that are especially at risk during public health emergencies due to factors such as socioeconomic status, household composition, minority status, housing type, or transportation.<br><br>The value of the index is a percentile -- e.g. a value of 0.85 indicates the location is in a census tract that is more socially vulnerable than 85% of census tracts in the U.S.<br><br>Within this tool, the SVI is assessed within the floodplain of the currently selected flood frequency. SVI is sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    inCDLp: {
      values: [],
      vis: true,
      min: 0,
      max: 90,
      info: "<b>Percent of floodplain in agricultural land (crops or grassland/pasture)</b><br>The percent of the floodplain that is either in any type of cropland or in grassland/pasture, according to the 2020 USDA Cropland Data Layer (CDL). <a href='https://www.nass.usda.gov/Research_and_Science/Cropland/sarsfaqs2.php' target='_blank'>More info</a>."
    },
    devpr_fp: {
      values: [],
      vis: true,
      min: 0,
      max: 8.3,
      step: 0.001,
      info: "<b>Development pressure in the floodplain</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>" 
    },
    devpres: {
      values: [],
      vis: true,
      shfld: true,
      min: 0,
      max: 6.848,
      step: 0.001,
      info: "<b>Development pressure in the watershed</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>" 
    },
    incroppc: {
      values: [],
      vis: true,
      min: 0,
      max: 73,
      info: "<b>% of floodplain in cropland or pasture</b><br>The percent of the floodplain in cultivated crops, according to the National Land Cover Dataset (NLCD) for 2019, available <a href='https://www.mrlc.gov/data/nlcd-2019-land-cover-conus' target='_blank'>here</a>.",
    },
    inrangpc: {
      values: [],
      vis: true,
      min: 0,
      max: 89,
      info: "<b>% of floodplain in rangeland</b><br>The percent of the floodplain in rangeland, according to U.S. Forest Service rangelands data, available <a href='https://data.fs.usda.gov/geodata/rastergateway/rangelands/index.php' target='_blank'>here</a>."
    },
    nccpi: {
      values: [],
      vis: true,
      min: 0.161,
      max: 0.527,
      step: 0.001,
      info: "<b>Agricultural productivity potential of soils in the floodplain</b><br> Uses the National Commodity Crop Productivity Index (NCCPI), an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration. <a href='https://www.nrcs.usda.gov/sites/default/files/2023-01/NCCPI-User-Guide.pdf' target='_blank'>More info</a>",
    },
    pdsoilpc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Percent of floodplain in somewhat poorly, poorly, & very poorly drained soils</b><br> The percent of floodplain area that is in somewhat poorly, poorly, & very poorly drained soils, according to the SSURGO soils database. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/Supplemental/SoilsDrainageClassDominantCondition.pdf' target='_blank'>More info</a>",
    },
    kfact: {
      values: [],
      vis: true,
      min: 0.168,
      max: 0.537,
      step: 0.001,
      info: "<b>Soil erodibility index (K factor) in the floodplain</b><br> The K factor quantifies the relative susceptibility of the soil to sheet & rill erosion. It is derived from texture, organic matter content, soil structure, and saturated hydraulic conductivity. It ranges from 0.02 (least erodible) to 0.64 (most erodible). <a href='http://www.iwr.msu.edu/rusle/kfactor.htm' target='_blank'>More info</a>",
    },
  },

  // catchment + 1 in 5 year flood
  catch1: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 1500,
      gtmax: true,
      info: "Acres of available floodplain including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    AcresUnp: {
      values: [],
      vis: true,
      min: 0,
      max: 1200,
      gtmax: true,
      info: "Acres of available floodplain <b>not</b> including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    iy_tn_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to local waterway</b><br>Kg/yr of nitrogen from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tn_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to Gulf of Mexico</b><br>Kg/yr of nitrogen from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to local waterway</b><br>Kg/yr of phosphorus from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to Gulf of Mexico</b><br>Kg/yr of phosphorus from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>",
    },
    iy_ss_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to local waterway</b><br>MT/yr of suspended sediment from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_ss_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to Gulf of Mexico</b><br>MT/yr of suspended sediment from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    resil: {
      values: [],
      vis: true,
      min: -3.503,
      max: 2.881,
      step: 0.001,
      info: "<b>Terrestrial resilience</b><br> The terrestrial resilience score estimates the climate resilience of an area of land based on: a). its landscape diversity (estimated microclimates) and b). local connectedness (lack of fragmentation). Each site is scored relative to all other sites in its ecoregion that have the same geophysical setting based on soils, bedrock geology, and elevation zone. Scores are standard deviations above the average score. Least resilient = -3.5 to -2.0; less resilient = -2.0 to -1.0; slightly less resilient = -1.0 to -0.5; average/median resilient = -0.5 to +0.5; slightly more resilient = +0.5 to +1.0; more resilient = +1.0 to +2.0; most resilient = +2.0 to +3.5. <a href='https://maps.tnc.org/resilientland/' target='_blank'>More info</a>",
    },
    nearProt: {
      values: [],
      vis: true,
      min: 0,
      max: 20,
      gtmax: true,
      info: "<b>Floodplains near protected lands</b><br> Acres of unprotected floodplain within 0.25 miles of Protected Areas Database of the U.S. (PAD-US) protected lands. <a href='https://www.usgs.gov/core-science-systems/science-analytics-and-synthesis/gap/science/protected-areas' target='_blank'>More info</a>",
    },
    abovegrC: {
      values: [],
      vis: true,
      min: 0,
      max: 75,
      gtmax: true,
      info: "<b>Mean above-ground carbon in the floodplain</b><br>Estimate of above-ground C stock (tons C/ha) using methods in Wilson <i>et al.</i> (2013). <a href='https://cbmjournal.biomedcentral.com/articles/10.1186/1750-0680-8-1#Sec5' target='_blank'>More info</a>"
    },
    belowgrC: {
      values: [],
      vis: true,
      min: 35,
      max: 162,
      gtmax: false,
      info: "<b>Mean below-ground carbon in the floodplain</b><br>Estimate of below-ground C stock (tons C/ha) from NRCS Rapid Carbon Assessment (RaCA). <a href='https://www.nrcs.usda.gov/resources/data-and-reports/rapid-carbon-assessment-raca' target='_blank'>More info</a>"
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: true,
      info: "<b>Population exposure to floods (present-day)</b><br>People currently living in floodplain of the specified flood frequency. Population sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 500,
      gtmax: true,
      info: "<b>Population exposure to floods (2050)</b><br>People expected to be living in the floodplain of the selected flood frequency by 2050, determined using the methods in Wing <i>et al.</i> (2018). <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>."
    },
    damages: {
      values: [],
      vis: true,
      min: 0,
      max: 35000000,
      gtmax: true,
      info: "<b>Projected future flood damages (2050) ($)</b><br> Estimate of property damage in the floodplain corresponding to the currently selected flood frequency, given flood depth and projected 2050 land use / building type. Estimated using the methods in Wing <i>et al.</i>. <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>.",
    },
    SVI: {
      values: [],
      vis: true,
      min: 0,
      max: 0.943,
      step: 0.001,
      info: "<b>CDC Social Vulnerability Index (SVI)</b><br>The CDC SVI characterizes census tracts that are especially at risk during public health emergencies due to factors such as socioeconomic status, household composition, minority status, housing type, or transportation.<br><br>The value of the index is a percentile -- e.g. a value of 0.85 indicates the location is in a census tract that is more socially vulnerable than 85% of census tracts in the U.S.<br><br>Within this tool, the SVI is assessed within the floodplain of the currently selected flood frequency. SVI is sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    inCDLp: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Percent of floodplain in agricultural land (crops or grassland/pasture)</b><br>The percent of the floodplain that is either in any type of cropland or in grassland/pasture, according to the 2020 USDA Cropland Data Layer (CDL). <a href='https://www.nass.usda.gov/Research_and_Science/Cropland/sarsfaqs2.php' target='_blank'>More info</a>."
    },
    devpr_fp: {
      values: [],
      vis: true,
      min: 0,
      max: 10,
      step: 0.001,
      gtmax: true,
      info: "<b>Development pressure in the floodplain</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>" 
    },
    devpres: {
      values: [],
      vis: true,
      shfld: true,
      min: 0,
      max: 10,
      step: 0.001,
      gtmax: true,
      info: "<b>Development pressure in the watershed</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>" 
    },
    incroppc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>% of floodplain in cropland or pasture</b><br>The percent of the floodplain in cultivated crops, according to the National Land Cover Dataset (NLCD) for 2019, available <a href='https://www.mrlc.gov/data/nlcd-2019-land-cover-conus' target='_blank'>here</a>.",
    },
    inrangpc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>% of floodplain in rangeland</b><br>The percent of the floodplain in rangeland, according to U.S. Forest Service rangelands data, available <a href='https://data.fs.usda.gov/geodata/rastergateway/rangelands/index.php' target='_blank'>here</a>."
    },
    nccpi: {
      values: [],
      vis: true,
      min: 0,
      max: 0.655,
      step: 0.001,
      info: "<b>Agricultural productivity potential of soils in the floodplain</b><br> Uses the National Commodity Crop Productivity Index (NCCPI), an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration. <a href='https://www.nrcs.usda.gov/sites/default/files/2023-01/NCCPI-User-Guide.pdf' target='_blank'>More info</a>",
    },
    pdsoilpc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Percent of floodplain in somewhat poorly, poorly, & very poorly drained soils</b><br> The percent of floodplain area that is in somewhat poorly, poorly, & very poorly drained soils, according to the SSURGO soils database. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/Supplemental/SoilsDrainageClassDominantCondition.pdf' target='_blank'>More info</a>",
    },
    kfact: {
      values: [],
      vis: true,
      min: 0.02,
      max: 0.64,
      step: 0.001,
      info: "<b>Soil erodibility index (K factor) in the floodplain</b><br> The K factor quantifies the relative susceptibility of the soil to sheet & rill erosion. It is derived from texture, organic matter content, soil structure, and saturated hydraulic conductivity. It ranges from 0.02 (least erodible) to 0.64 (most erodible). <a href='http://www.iwr.msu.edu/rusle/kfactor.htm' target='_blank'>More info</a>",
    },
  },
  // catchment + 1 in 100 year flood
  catch2: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 4000,
      gtmax: true,
      info: "Acres of available floodplain including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    AcresUnp: {
      values: [],
      vis: true,
      min: 0,
      max: 3500,
      gtmax: true,
      info: "Acres of available floodplain <b>not</b> including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    iy_tn_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to local waterway</b><br>Kg/yr of nitrogen from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tn_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to Gulf of Mexico</b><br>Kg/yr of nitrogen from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to local waterway</b><br>Kg/yr of phosphorus from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to Gulf of Mexico</b><br>Kg/yr of phosphorus from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>",
    },
    iy_ss_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to local waterway</b><br>MT/yr of suspended sediment from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_ss_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to Gulf of Mexico</b><br>MT/yr of suspended sediment from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    resil: {
      values: [],
      vis: true,
      min: -3.503,
      max: 2.811,
      step: 0.001,
      info: "<b>Terrestrial resilience</b><br> The terrestrial resilience score estimates the climate resilience of an area of land based on: a). its landscape diversity (estimated microclimates) and b). local connectedness (lack of fragmentation). Each site is scored relative to all other sites in its ecoregion that have the same geophysical setting based on soils, bedrock geology, and elevation zone. Scores are standard deviations above the average score. Least resilient = -3.5 to -2.0; less resilient = -2.0 to -1.0; slightly less resilient = -1.0 to -0.5; average/median resilient = -0.5 to +0.5; slightly more resilient = +0.5 to +1.0; more resilient = +1.0 to +2.0; most resilient = +2.0 to +3.5. <a href='https://maps.tnc.org/resilientland/' target='_blank'>More info</a>",
    },
    nearProt: {
      values: [],
      vis: true,
      min: 0,
      max: 50,
      gtmax: true,
      info: "<b>Floodplains near protected lands</b><br> Acres of unprotected floodplain within 0.25 miles of Protected Areas Database of the U.S. (PAD-US) protected lands. <a href='https://www.usgs.gov/core-science-systems/science-analytics-and-synthesis/gap/science/protected-areas' target='_blank'>More info</a>",
    },
    abovegrC: {
      values: [],
      vis: true,
      min: 0,
      max: 114,
      gtmax: true,
      info: "<b>Mean above-ground carbon in the floodplain</b><br>Estimate of above-ground C stock (tons C/ha) using methods in Wilson <i>et al.</i> (2013). <a href='https://cbmjournal.biomedcentral.com/articles/10.1186/1750-0680-8-1#Sec5' target='_blank'>More info</a>"
    },
    belowgrC: {
      values: [],
      vis: true,
      min: 35,
      max: 162,
      gtmax: false,
      info: "<b>Mean below-ground carbon in the floodplain</b><br>Estimate of below-ground C stock (tons C/ha) from NRCS Rapid Carbon Assessment (RaCA). <a href='https://www.nrcs.usda.gov/resources/data-and-reports/rapid-carbon-assessment-raca' target='_blank'>More info</a>"
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 2000,
      gtmax: true,
      info: "<b>Population exposure to floods (present-day)</b><br>People currently living in floodplain of the specified flood frequency. Population sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 2300,
      gtmax: true,
      info: "<b>Population exposure to floods (2050)</b><br>People expected to be living in the floodplain of the selected flood frequency by 2050, determined using the methods in Wing <i>et al.</i> (2018). <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>."
    },
    damages: {
      values: [],
      vis: true,
      min: 0,
      max: 130000000,
      gtmax: true,
      info: "<b>Projected future flood damages (2050) ($)</b><br> Estimate of property damage in the floodplain corresponding to the currently selected flood frequency, given flood depth and projected 2050 land use / building type. Estimated using the methods in Wing <i>et al.</i>. <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>.",
    },
    SVI: {
      values: [],
      vis: true,
      min: 0.002,
      max: 0.980,
      step: 0.001,
      info: "<b>CDC Social Vulnerability Index (SVI)</b><br>The CDC SVI characterizes census tracts that are especially at risk during public health emergencies due to factors such as socioeconomic status, household composition, minority status, housing type, or transportation.<br><br>The value of the index is a percentile -- e.g. a value of 0.85 indicates the location is in a census tract that is more socially vulnerable than 85% of census tracts in the U.S.<br><br>Within this tool, the SVI is assessed within the floodplain of the currently selected flood frequency. SVI is sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    inCDLp: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Percent of floodplain in agricultural land (crops or grassland/pasture)</b><br>The percent of the floodplain that is either in any type of cropland or in grassland/pasture, according to the 2020 USDA Cropland Data Layer (CDL). <a href='https://www.nass.usda.gov/Research_and_Science/Cropland/sarsfaqs2.php' target='_blank'>More info</a>."
    },
    devpr_fp: {
      values: [],
      vis: true,
      min: 0,
      max: 10,
      step: 0.001,
      gtmax: true,
      info: "<b>Development pressure in the floodplain</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>" 
    },
    devpres: {
      values: [],
      vis: true,
      shfld: true,
      min: 0,
      max: 10,
      step: 0.001,
      gtmax: true,
      info: "<b>Development pressure in the watershed</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>" 
    },
    incroppc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>% of floodplain in cropland or pasture</b><br>The percent of the floodplain in cultivated crops, according to the National Land Cover Dataset (NLCD) for 2019, available <a href='https://www.mrlc.gov/data/nlcd-2019-land-cover-conus' target='_blank'>here</a>.",
    },
    inrangpc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>% of floodplain in rangeland</b><br>The percent of the floodplain in rangeland, according to U.S. Forest Service rangelands data, available <a href='https://data.fs.usda.gov/geodata/rastergateway/rangelands/index.php' target='_blank'>here</a>."
    },
    nccpi: {
      values: [],
      vis: true,
      min: 0,
      max: 0.645,
      step: 0.001,
      info: "<b>Agricultural productivity potential of soils in the floodplain</b><br> Uses the National Commodity Crop Productivity Index (NCCPI), an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration. <a href='https://www.nrcs.usda.gov/sites/default/files/2023-01/NCCPI-User-Guide.pdf' target='_blank'>More info</a>",
    },
    pdsoilpc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Percent of floodplain in somewhat poorly, poorly, & very poorly drained soils</b><br> The percent of floodplain area that is in somewhat poorly, poorly, & very poorly drained soils, according to the SSURGO soils database. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/Supplemental/SoilsDrainageClassDominantCondition.pdf' target='_blank'>More info</a>",
    },
    kfact: {
      values: [],
      vis: true,
      min: 0.02,
      max: 0.64,
      step: 0.001,
      info: "<b>Soil erodibility index (K factor) in the floodplain</b><br> The K factor quantifies the relative susceptibility of the soil to sheet & rill erosion. It is derived from texture, organic matter content, soil structure, and saturated hydraulic conductivity. It ranges from 0.02 (least erodible) to 0.64 (most erodible). <a href='http://www.iwr.msu.edu/rusle/kfactor.htm' target='_blank'>More info</a>",
    },
  },
  // catchment + 1 in 500 year flood
  catch3: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 4300,
      gtmax: true,
      info: "Acres of available floodplain including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    AcresUnp: {
      values: [],
      vis: true,
      min: 0,
      max: 4000,
      gtmax: true,
      info: "Acres of available floodplain <b>not</b> including areas within the Protected Areas Database of the U.S. (PAD-US). <a href='https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas' target='_blank'>More info</a>"
    },
    iy_tn_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to local waterway</b><br>Kg/yr of nitrogen from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tn_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Nitrogen yield to Gulf of Mexico</b><br>Kg/yr of nitrogen from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to local waterway</b><br>Kg/yr of phosphorus from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_tp_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Phosphorus yield to Gulf of Mexico</b><br>Kg/yr of phosphorus from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>",
    },
    iy_ss_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to local waterway</b><br>MT/yr of suspended sediment from within a given watershed exported at the mouth of that watershed, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    iy_ss_del_p: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: false,
      shfld: true,
      info: "<b>Suspended sediment yield to Gulf of Mexico</b><br>MT/yr of suspended sediment from within a given watershed that reaches the Gulf of Mexico, divided by the watershed's area, and normalized to 0-100 scale.<br><a href='https://sparrow.wim.usgs.gov/sparrow-southwest-2012/' target='_blank'>More info</a>"
    },
    resil: {
      values: [],
      vis: true,
      min: -3.503,
      max: 2.811,
      step: 0.001,
      info: "<b>Terrestrial resilience</b><br> The terrestrial resilience score estimates the climate resilience of an area of land based on: a). its landscape diversity (estimated microclimates) and b). local connectedness (lack of fragmentation). Each site is scored relative to all other sites in its ecoregion that have the same geophysical setting based on soils, bedrock geology, and elevation zone. Scores are standard deviations above the average score. Least resilient = -3.5 to -2.0; less resilient = -2.0 to -1.0; slightly less resilient = -1.0 to -0.5; average/median resilient = -0.5 to +0.5; slightly more resilient = +0.5 to +1.0; more resilient = +1.0 to +2.0; most resilient = +2.0 to +3.5. <a href='https://maps.tnc.org/resilientland/' target='_blank'>More info</a>",
    },
    nearProt: {
      values: [],
      vis: true,
      min: 0,
      max: 65,
      gtmax: true,
      info: "<b>Floodplains near protected lands</b><br> Acres of unprotected floodplain within 0.25 miles of Protected Areas Database of the U.S. (PAD-US) protected lands. <a href='https://www.usgs.gov/core-science-systems/science-analytics-and-synthesis/gap/science/protected-areas' target='_blank'>More info</a>",
    },
    abovegrC: {
      values: [],
      vis: true,
      min: 0,
      max: 75,
      gtmax: true,
      info: "<b>Mean above-ground carbon in the floodplain</b><br>Estimate of above-ground C stock (tons C/ha) using methods in Wilson <i>et al.</i> (2013). <a href='https://cbmjournal.biomedcentral.com/articles/10.1186/1750-0680-8-1#Sec5' target='_blank'>More info</a>"
    },
    belowgrC: {
      values: [],
      vis: true,
      min: 35,
      max: 162,
      gtmax: false,
      info: "<b>Mean below-ground carbon in the floodplain</b><br>Estimate of below-ground C stock (tons C/ha) from NRCS Rapid Carbon Assessment (RaCA). <a href='https://www.nrcs.usda.gov/resources/data-and-reports/rapid-carbon-assessment-raca' target='_blank'>More info</a>"
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 2700,
      gtmax: true,
      info: "<b>Population exposure to floods (present-day)</b><br>People currently living in floodplain of the specified flood frequency. Population sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 3000,
      gtmax: true,
      info: "<b>Population exposure to floods (2050)</b><br>People expected to be living in the floodplain of the selected flood frequency by 2050, determined using the methods in Wing <i>et al.</i> (2018). <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>."
    },
    damages: {
      values: [],
      vis: true,
      min: 0,
      max: 175000000,
      gtmax: true,
      info: "<b>Projected future flood damages (2050) ($)</b><br> Estimate of property damage in the floodplain corresponding to the currently selected flood frequency, given flood depth and projected 2050 land use / building type. Estimated using the methods in Wing <i>et al.</i>. <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>.",
    },
    SVI: {
      values: [],
      vis: true,
      min: 0.002,
      max: 0.980,
      step: 0.001,
      info: "<b>CDC Social Vulnerability Index (SVI)</b><br>The CDC SVI characterizes census tracts that are especially at risk during public health emergencies due to factors such as socioeconomic status, household composition, minority status, housing type, or transportation.<br><br>The value of the index is a percentile -- e.g. a value of 0.85 indicates the location is in a census tract that is more socially vulnerable than 85% of census tracts in the U.S.<br><br>Within this tool, the SVI is assessed within the floodplain of the currently selected flood frequency. SVI is sourced from Texas Water Development Board (TWDB) buildings data. <a href='https://twdb-flood-planning-resources-twdb.hub.arcgis.com/pages/fb15d02ff1864017bc066c6570f82403' target='_blank'>More info</a>.",
    },
    inCDLp: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Percent of floodplain in agricultural land (crops or grassland/pasture)</b><br>The percent of the floodplain that is either in any type of cropland or in grassland/pasture, according to the 2020 USDA Cropland Data Layer (CDL). <a href='https://www.nass.usda.gov/Research_and_Science/Cropland/sarsfaqs2.php' target='_blank'>More info</a>."
    },
    devpr_fp: {
      values: [],
      vis: true,
      min: 0,
      max: 10,
      step: 0.001,
      gtmax: true,
      info: "<b>Development pressure in the floodplain</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>" 
    },
    devpres: {
      values: [],
      vis: true,
      shfld: true,
      min: 0,
      max: 10,
      step: 0.001,
      gtmax: true,
      info: "<b>Development pressure in the watershed</b><br>Development pressure is characterized by comparing ICLUS EPA land use data for 2020 versus 2050 to identify projected land use transitions from less developed to more developed.<br><br>A weighting scheme was developed to assign higher weights to more developed land use types (e.g. urban-high) vs. less developed land use types (e.g. exurban-low), in accordance with dollar valuation estimates of these land use types based on the National Structure Inventory (NSI).<br><br>A higher index value indicates more extreme transitions (e.g. non-urban to very urban) in more places and a lower index value indicates less extreme transitions (e.g. suburban-low to suburban-high) and in fewer places. <a href='https://www.epa.gov/gcx/about-iclus' target='_blank'>More info</a>" 
    },
    incroppc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>% of floodplain in cropland or pasture</b><br>The percent of the floodplain in cultivated crops, according to the National Land Cover Dataset (NLCD) for 2019, available <a href='https://www.mrlc.gov/data/nlcd-2019-land-cover-conus' target='_blank'>here</a>.",
    },
    inrangpc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>% of floodplain in rangeland</b><br>The percent of the floodplain in rangeland, according to U.S. Forest Service rangelands data, available <a href='https://data.fs.usda.gov/geodata/rastergateway/rangelands/index.php' target='_blank'>here</a>."
    },
    nccpi: {
      values: [],
      vis: true,
      min: 0,
      max: 0.645,
      step: 0.001,
      info: "<b>Agricultural productivity potential of soils in the floodplain</b><br> Uses the National Commodity Crop Productivity Index (NCCPI), an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration. <a href='https://www.nrcs.usda.gov/sites/default/files/2023-01/NCCPI-User-Guide.pdf' target='_blank'>More info</a>",
    },
    pdsoilpc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Percent of floodplain in somewhat poorly, poorly, & very poorly drained soils</b><br> The percent of floodplain area that is in somewhat poorly, poorly, & very poorly drained soils, according to the SSURGO soils database. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/Supplemental/SoilsDrainageClassDominantCondition.pdf' target='_blank'>More info</a>",
    },
    kfact: {
      values: [],
      vis: true,
      min: 0.02,
      max: 0.64,
      step: 0.001,
      info: "<b>Soil erodibility index (K factor) in the floodplain</b><br> The K factor quantifies the relative susceptibility of the soil to sheet & rill erosion. It is derived from texture, organic matter content, soil structure, and saturated hydraulic conductivity. It ranges from 0.02 (least erodible) to 0.64 (most erodible). <a href='http://www.iwr.msu.edu/rusle/kfactor.htm' target='_blank'>More info</a>",
    },
  },
};

// object for radio groups
app.radioObj = {
  // huc 8 + 1 in 5 year flood
  h81: {
    bacteria: {
      vis: true,
      shfld: true
    },
    TXTerr: {
      vis: true,
    },
    TXFresh: {
      vis: true,
    },
    builddir: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $115.37 million dollars of estimated direct building losses from a 100-year flood. The county-level information is taken from Table 2.9 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    },
    agnow: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $11.26 million (current) or $11.90 million (future) crop and livestock production dollar losses from a 100-year flood. The county-level information is taken from Table 2.8 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    }
  },
  // huc 8 + 1 in 100 year flood
  h82: {
    bacteria: {
      vis: true,
      shfld: true
    },
    TXTerr: {
      vis: true,
    },
    TXFresh: {
      vis: true,
    },
    builddir: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $115.37 million dollars of estimated direct building losses from a 100-year flood. The county-level information is taken from Table 2.9 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    },
    agnow: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $11.26 million (current) or $11.90 million (future) crop and livestock production dollar losses from a 100-year flood. The county-level information is taken from Table 2.8 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    }
  },
  // huc 8 + 1 in 500 year flood
  h83: {
    bacteria: {
      vis: true,
      shfld: true
    },
    TXTerr: {
      vis: true,
    },
    TXFresh: {
      vis: true,
    },
    builddir: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $115.37 million dollars of estimated direct building losses from a 100-year flood. The county-level information is taken from Table 2.9 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    },
    agnow: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $11.26 million (current) or $11.90 million (future) crop and livestock production dollar losses from a 100-year flood. The county-level information is taken from Table 2.8 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    }
  },
  // huc 12 + 1 in 5 year flood
  h121: {
    bacteria: {
      vis: true,
      shfld: true
    },
    TXTerr: {
      vis: true,
    },
    TXFresh: {
      vis: true,
    },
    builddir: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $115.37 million dollars of estimated direct building losses from a 100-year flood. The county-level information is taken from Table 2.9 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    },
    agnow: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $11.26 million (current) or $11.90 million (future) crop and livestock production dollar losses from a 100-year flood. The county-level information is taken from Table 2.8 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    }
  },
  // huc 12 + 1 in 100 year flood
  h122: {
    bacteria: {
      vis: true,
      shfld: true
    },
    TXTerr: {
      vis: true,
    },
    TXFresh: {
      vis: true,
    },
    builddir: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $115.37 million dollars of estimated direct building losses from a 100-year flood. The county-level information is taken from Table 2.9 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    },
    agnow: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $11.26 million (current) or $11.90 million (future) crop and livestock production dollar losses from a 100-year flood. The county-level information is taken from Table 2.8 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    }
  },
  // huc 12 + 1 in 500 year flood
  h123: {
    bacteria: {
      vis: true,
      shfld: true
    },
    TXTerr: {
      vis: true,
    },
    TXFresh: {
      vis: true,
    },
    builddir: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $115.37 million dollars of estimated direct building losses from a 100-year flood. The county-level information is taken from Table 2.9 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    },
    agnow: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $11.26 million (current) or $11.90 million (future) crop and livestock production dollar losses from a 100-year flood. The county-level information is taken from Table 2.8 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    }
  },
  // catchment + 1 in 5 year flood
  catch1: {
    bacteria: {
      vis: true,
      shfld: true
    },
    TXTerr: {
      vis: true,
    },
    TXFresh: {
      vis: true,
    },
    builddir: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $115.37 million dollars of estimated direct building losses from a 100-year flood. The county-level information is taken from Table 2.9 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    },
    agnow: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $11.26 million (current) or $11.90 million (future) crop and livestock production dollar losses from a 100-year flood. The county-level information is taken from Table 2.8 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    }
  },
  // catchment + 1 in 100 year flood
  catch2: {
    bacteria: {
      vis: true,
      shfld: true
    },
    TXTerr: {
      vis: true,
    },
    TXFresh: {
      vis: true,
    },
    builddir: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $115.37 million dollars of estimated direct building losses from a 100-year flood. The county-level information is taken from Table 2.9 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    },
    agnow: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $11.26 million (current) or $11.90 million (future) crop and livestock production dollar losses from a 100-year flood. The county-level information is taken from Table 2.8 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    }
  },
  // catchment + 1 in 500 year flood
  catch3: {
    bacteria: {
      vis: true,
      shfld: true
    },
    TXTerr: {
      vis: true,
    },
    TXFresh: {
      vis: true,
    },
    builddir: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $115.37 million dollars of estimated direct building losses from a 100-year flood. The county-level information is taken from Table 2.9 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    },
    agnow: {
      vis: true,
      shfld: true,
      info: "Selecting 'present' will show watersheds located mostly within a county containing more than $11.26 million (current) or $11.90 million (future) crop and livestock production dollar losses from a 100-year flood. The county-level information is taken from Table 2.8 in the Trinity Regional Flood Plan. <a href='https://trinityrfpg.org/wp-content/uploads/2023/01/Trinity-RFP-Chapter-2.pdf' target='_blank'>More info</a>."
    }
  },
};
buildElements();
