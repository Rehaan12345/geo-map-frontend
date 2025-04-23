<script>

// @ts-nocheck

import { onMount } from 'svelte';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj.js';
import Overlay from 'ol/Overlay.js';
import { addDocument, getDocuments } from '$lib/model';
import { writable } from 'svelte/store';
import { tick } from 'svelte';

let ready = writable(false);

const cambridge = fromLonLat([-71.10366950263109, 42.36596281768288]);
const home = fromLonLat([-71.09893937618445, 42.366479045735595]);

let map;
let docs;

onMount(async () => {

  docs = await getDocuments("tech-companies");

  console.log(docs);

  try {
    map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: cambridge,
        zoom: 15,
      })
    });

    ready.set(true);

    const marker = new Overlay({
      position: home,
      positioning: "center-center",
      element: document.getElementById("marker"),
      stopEvent: false,
    })
    map.addOverlay(marker);
    console.log(marker);

    console.log("ready");

    addAllMarkers();

  } catch (error) {
    console.log("doesn't works");
  }
  
})

async function addAllMarkers() {

  await tick(); // Very important - used to only start once the {#each} block has stopped rendering.

  for (let i = 0; i < docs.length; i++) {
    
    try {
      const currId = docs[i].id;
      console.log(currId);
      const currPos = docs[i].coords;
      console.log(currPos);
      // console.log(document.getElementById("marker"));
      console.log("marker-" + currId)
      console.log(document.getElementById('marker-' + currId));
      const marker = new Overlay({
        position: fromLonLat(currPos),
        positioning: 'center-center',
        element: document.getElementById('marker-' + currId),
        stopEvent: false,
      });
      map.addOverlay(marker);

      const currEl = new Overlay({
        position: fromLonLat(currPos),
        element: document.getElementById(currId),
      });
      map.addOverlay(currEl);
      console.log("added");
    } catch (error) {
      console.log("Failed to add map element: " + error);
    }

  }
}

</script>

<style>
#map {
  margin-top: 2rem;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

.marker {
  width: 20px;
  height: 20px;
  /* border: 1px solid #088; */
  border-radius: 10px;
  background-color: rgb(255, 0, 0);
  opacity: .7;
}

.dot {
  text-decoration: none;
  color: rgb(0, 0, 0);
  font-size: 11pt;
  font-weight: bold;
  font-family: 'Courier New', Courier, monospace;
}

</style>

<div id="map"></div>

{#if $ready}

  <div style="display: none;">

    <div class="overlay dot" id="home">Home</div>
    <div id="marker" title="Marker"></div>

    {#each docs as d}

      <div class="overlay dot" id={d.id}>{d.name}</div>
      <div class="marker" id="marker-{d.id}" title="Marker"></div>
      
    {/each}
    

  </div>

{:else}

<div class="NOTREADY">not ready yet</div>

{/if}