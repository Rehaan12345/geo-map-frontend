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
import { Modal, Spinner } from 'flowbite-svelte';
import MapModal from './MapModal.svelte';
import {HomeOutline} from "flowbite-svelte-icons"

export let useCategory = "tech-companies";

let ready = writable(false);

let showMapModal = writable(false);

const cambridge = fromLonLat([-71.10366950263109, 42.36596281768288]);
const home = fromLonLat([-71.09893937618445, 42.366479045735595]);

let map;
let docs;

let mapData;

onMount(async () => {

  docs = await getDocuments(useCategory);

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
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background-color: rgb(83, 126, 255);
  opacity: .9;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.dot {
  border: 1px solid black;
  background-color: rgb(196, 210, 252);
  text-decoration: none;
  color: rgb(0, 0, 0);
  font-size: 11pt;
  font-family: "Serif";
  letter-spacing: .5px;
  padding-left: .5rem;
  padding-right: .5rem
}

</style>

<Modal class="min-w-full" open={$showMapModal} on:close={() => {showMapModal.set(false); }} size="xl">

  <MapModal mapData={mapData}></MapModal>

</Modal>

<div id="map"></div>

{#if $ready}

  <div style="display: none;">

    <div class="overlay dot" id="home">Home</div>
    <div id="marker" title="Marker"></div>

    {#each docs as d}

      <button class="overlay dot" id={d.id}>{d.title}</button>
      <button class="marker" aria-label={d.id} id="marker-{d.id}" title="Marker" on:click={() => {console.log(d); mapData = d; showMapModal.set(true); }}>
      <HomeOutline ></HomeOutline>
      </button>
      
    {/each}
    

  </div>

{:else}

<div class="NOTREADY">Loading .. <Spinner color="red" size={4}/> </div>

{/if}