<script>
    // @ts-nocheck
    import Map from "./Map.svelte";
    import { addDocument, getScrape } from "$lib/model";
	import { ButtonGroup, Button, Modal, Alert } from "flowbite-svelte";
    import { writable } from "svelte/store";
    import ScrapeForm from "./ScrapeForm.svelte";

    let showScrapeModal = writable(false);

    let name = "";
    let coords = ""

    let scrape;
    let category = "realestate";
    let location = "boston";
    let searchAmount = 1;

    let data;

    const submit = async () => {
        const xcord = coords.substring(0, coords.indexOf(","));
        const ycord = coords.substring(coords.indexOf(",") + 1);
        const wholeCords = [parseFloat(ycord), parseFloat(xcord)]
        console.log(wholeCords);
        // const newycord = parseFloat(ycord)
        const data = {
            collection: "tech-companies",
            name: name,
            coords: wholeCords
        }
        try {
            const res = await addDocument(data);
            console.log(res);
            name = "";
            coords = "";
        } catch (error) {
            console.log(error);
        }
    }

    const handleGetScrape = async () => {
        try {
            const toSend = {
                category: category,
                location: location,
                searchamount: searchAmount
            }
            scrape = await getScrape(toSend);
            console.log(scrape);
            if (scrape.status == 0) {
                data = scrape.data;
                console.log(data);
            }
        } catch (error) {
            console.log("error scraping: " + error);
        }
    }

</script>

<style>
    .mapcontainer {
        margin-top: 5rem;
    }

    .buttongroup {
        z-index: 100;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 2rem;
    }
</style>

<!-- 
<form on:submit={submit}>
    <label for="name">Name</label>
    <input type="text" id="name" placeholder="name" bind:value={name}>
    <label for="cords">cords</label>
    <input type="text" id="coords" placeholder="coords" bind:value={coords}>
    <input type="submit">
</form> -->

<Modal class="min-w-full" open={$showScrapeModal} on:close={() => {showScrapeModal.set(false); }}>

    <ScrapeForm></ScrapeForm>
    
</Modal>

<div class="buttongroup">
    <ButtonGroup class="space-x-px">
        <Button pill color="purple" on:click={() => {
            // handleGetScrape();
            showScrapeModal.set(true);
        }}>Profile</Button>
        <Button pill color="purple">Settings</Button>
        <Button pill color="purple">Messages</Button>
    </ButtonGroup>
</div>

<div class="mapcontainer">
    <Map></Map>
</div>