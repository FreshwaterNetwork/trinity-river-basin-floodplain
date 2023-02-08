function mapClick() {
  require(['esri/layers/FeatureLayer', 'esri/rest/support/Query'], function (
    FeatureLayer,
    Query
  ) {
    app.view.on('click', function (event) {
      app.view.popup.close();
      // create query
      const fl = new FeatureLayer({
        url:
          'https://services2.coastalresilience.org/arcgis/rest/services/Floodplain/Trinity_Basin_TX/MapServer/' +
          app.obj.hucLayer,
      });
      let query = fl.createQuery();
      query.returnGeometry = true;
      query.outFields = ['*'];
      query.geometry = app.view.toMap(event);
      fl.queryFeatures(query).then(function (response) {
        app.resultsLayer.removeAll();
        if (response.features[0]) {
          var features = response.features.map(function (graphic) {
            graphic.symbol = {
              type: 'simple-fill',
              color: [0, 0, 0, 0],
              style: 'solid',
              outline: {
                color: 'blue',
                width: 1,
              },
            };
            return graphic;
          });
          app.resultsLayer.addMany(features);

          let a = response.features[0].attributes;
          console.log(a);
          let unit_ac = a.AreaKM2;
          if (unit_ac < 1) {
            unit_ac = unit_ac.toFixed(4);
          } else {
            unit_ac = commaSeparateNumber(Math.round(unit_ac));
          }

          let acres = a['Acres_' + app.obj.floodFreq];
          if (acres < 1) {
            acres = acres.toFixed(2);
          } else {
            acres = commaSeparateNumber(Math.round(acres));
          }

          let pop = commaSeparateNumber(
            Math.round(a['popnow_' + app.obj.floodFreq])
          );
          let damages = commaSeparateNumber(
            Math.round(a['damages_' + app.obj.floodFreq])
          );

          let SVI = "N/A (no people in floodplain)"
          if (a['SVI_' + app.obj.floodFreq]) {
            SVI = (a['SVI_' + app.obj.floodFreq]).toFixed(3);
          }
          //let SVI = (a['SVI_' + app.obj.floodFreq]).toFixed(3);
          let incroppc = (a['incroppc_' + app.obj.floodFreq]).toFixed(2);
          let inrangpc = (a['inrangpc_' + app.obj.floodFreq]).toFixed(2);

          let acresLabel = '';
          let popLabel = '';
          let damagesLabel = '';
          let sviLabel = '';
          let cropLabel = '';
          let rangLabel = '';

          if (app.obj.floodFreq == 1) {
            acresLabel = 'Acres of 5-year floodplain';
            popLabel = 'Current population in 5-year floodplain';
            damagesLabel =
              'Projected 2050 damage value ($) in 5-year floodplain';
            sviLabel = 'Social vulnerability index in 5-year floodplain';
            cropLabel = 'Percent of 5-year floodplain in cultivated cropland';
            rangLabel = 'Percent of 5-year floodplain in rangeland';
          }
          if (app.obj.floodFreq == 2) {
            acresLabel = 'Acres of 100-year floodplain';
            popLabel = 'Current population in 100-year floodplain';
            damagesLabel =
              'Projected 2050 damage value ($) in 100-year floodplain';
            sviLabel = 'Social vulnerability index in 100-year floodplain';
            cropLabel = 'Percent of 100-year floodplain in cultivated cropland';
            rangLabel = 'Percent of 100-year floodplain in rangeland';
          }
          if (app.obj.floodFreq == 3) {
            acresLabel = 'Acres of 500-year floodplain';
            popLabel = 'Current population in 500-year floodplain';
            damagesLabel =
              'Projected 2050 damage value ($) in 500-year floodplain';
            sviLabel = 'Social vulnerability index in 500-year floodplain';
            cropLabel = 'Percent of 500-year floodplain in cultivated cropland';
            rangLabel = 'Percent of 500-year floodplain in rangeland';
          }

           //let IY_TN = commaSeparateNumber(Math.round(a.iy_tn));
           let IY_TN = a.iy_tn.toFixed(2);
           let IY_TP = a.iy_tp.toFixed(2);
           let IY_SS = a.iy_ss.toFixed(2);
           let IY_TN_DEL = a.iy_tn_del.toFixed(2);
           let IY_TP_DEL = a.iy_tp_del.toFixed(2);
           let IY_SS_DEL = a.iy_ss_del.toFixed(2);

           // let IY_TP = commaSeparateNumber(Math.round(a.iy_tp));
           // let IY_SS = commaSeparateNumber(Math.round(a.iy_ss));
           // let IY_TN_DEL = commaSeparateNumber(Math.round(a.iy_tn_del));
           // let IY_TP_DEL = commaSeparateNumber(Math.round(a.iy_tp_del));
           // let IY_SS_DEL = commaSeparateNumber(Math.round(a.iy_ss_del));
           // let TN_farm = a.TN_farm.toFixed(1);
          // console.log(a.TN_farm);
           //let IL_TP_DEL = commaSeparateNumber(Math.round(a.il_tp_del));
           // let TP_farm = a.TP_farm.toFixed(1);
           //let SOVI = a.SOVI.toFixed(3);
           //let cropacres = commaSeparateNumber(Math.round(a.crop_acres));
           //let pastacres = commaSeparateNumber(Math.round(a.past_acres));

          app.view.popup.set('dockOptions', {
            breakpoint: false,
            buttonEnabled: false,
            position: 'top-left',
          });

          app.view.popup.open({
            // Set the popup's title to the coordinates of the location
            title: a.Name,
            content: `
             	Watershed area (km2): <b>${unit_ac}</b><br>
             	${acresLabel}: <b>${acres}</b><br>
              Nitrogen yield at outflow (kg/km2/yr): <b>${IY_TN}</b><br>
              Phosphorus yield at outflow (kg/km2/yr): <b>${IY_TP}</b><br>
              Suspended sediment yield at outflow (MT/km2/yr): <b>${IY_SS}</b><br>
              Nitrogen yield to Gulf of Mexico (kg/km2/yr): <b>${IY_TN_DEL}</b><br>
              Phosphorus yield to Gulf of Mexico (kg/km2/yr): <b>${IY_TP_DEL}</b><br>
              Suspended sediment yield to Gulf of Mexico (MT/km2/yr): <b>${IY_SS_DEL}</b><br>
              ${popLabel}: <b>${pop}</b><br>
              ${damagesLabel}: <b>$${damages}</b><br>
              ${sviLabel}: <b>${SVI}</b><br>
              ${cropLabel}: <b>${incroppc}</b><br>
              ${rangLabel}: <b>${inrangpc}</b><br>
             `
          });
        }
      });
    });
  });
}
