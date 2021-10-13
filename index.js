'use strict';
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const axios = require("axios");
process.env.DEBUG = 'dialogflow:debug';
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
async function consultarTramite(agent){
  let dni=agent.parameters["dni"];
  let respuesta=await axios.get("https://sheet.best/api/sheets/6d0eaa68-ddf5-47fd-81d6-6f63eb7f8b73/dni/"+dni);
  let tramites=respuesta.data;
  if (tramites.length>0){
    let tramite=tramites[0];
    agent.add("Hola "+tramite.nombres+". Votas en la "+tramite.establecimiento+" en "+tramite.domicilio_1+" en la mesa "+tramite.mesa);
    }
  	else{
     agent.add("El número que ingresaste no es válido. Chequeá haberlo ingresado bien y escribí PADRÓN para poder volver a ingresarlo");
      agent.add("Si el número es correcto chequeá si tu escuela no se encuentra en otra comuna: 👇");
      agent.add("📌 Comuna 1 y 4: t.me/Padron_1_4_bot");
      agent.add("📌 Comuna 8 y 4: t.me/Padron_8_4_bot ");
      agent.add("📌 Comuna 7, 9, 10 y 11: t.me/Padron_7_9_10_11_bot ");
      agent.add("📌 Comuna 2, 12, 13, 14 y 15: t.me/Padron_2_12_13_14_15_bot ");
       }
  }
  let intentMap = new Map();
  intentMap.set('Tramites.consultar', consultarTramite);
  agent.handleRequest(intentMap);
});