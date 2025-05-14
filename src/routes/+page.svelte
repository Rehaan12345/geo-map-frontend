<script>
    // @ts-nocheck
    import Map from "./Map.svelte";
    import { addDocument, getScrape } from "$lib/model";
	import { ButtonGroup, Button, Modal, Alert, Dropdown, DropdownItem, DropdownDivider, DropdownHeader } from "flowbite-svelte";
    import { writable } from "svelte/store";
    import ScrapeForm from "./ScrapeForm.svelte";
    import { ChevronDownOutline } from "flowbite-svelte-icons";
	import { onMount } from "svelte";
	import { collection } from "firebase/firestore";
	import { read } from "$app/server";

    let ready = writable(false);

    let showScrapeModal = writable(false);
    let currCategory = "";

    let name = "";
    let coords = ""

    let scrape;
    let category = "realestate";
    let location = "boston";
    let searchAmount = 1;

    let data;

    let categories = []

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

    onMount(async () => {
        ready.set(false);
        if (categories.length > 1) { currCategory = categories[0]; }
        const URL = import.meta.env.VITE_URL;
        try {
            const res = await fetch(URL + 'get-colls');
        if (!res.ok) throw new Error('Failed to fetch');
            categories = await res.json();
            currCategory = categories[0];
        } catch (err) {
            console.log(err);
        }
        ready.set(true);
    })

</script>

<style>

    .buttongroup {
        z-index: 100;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 5rem;
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

{#if $ready}

    <Modal class="min-w-full" open={$showScrapeModal} on:close={() => {showScrapeModal.set(false); }} size="xl">
        
        {#each categories as c}
            {#if c == currCategory}
            <ScrapeForm useCategory={c}></ScrapeForm>
            {/if}
        {/each}

    </Modal>

    <div class="buttongroup">
        <ButtonGroup class="space-x-px">
            <Button pill color="purple" on:click={() => {
                showScrapeModal.set(true);
            }}>Scrape</Button>
            <Button pill color="green">Category<ChevronDownOutline class="ms-2 h-6 w-6 text-white dark:text-white" /></Button>
            <Dropdown>
                {#each categories as c}
                    <DropdownItem on:click={() => {currCategory = c}}>{c}</DropdownItem>
                {/each}
            </Dropdown>
        </ButtonGroup>
    </div>

    <div class="mapcontainer">
        {#each categories as c}
            {#if c == currCategory}
                <Map useCategory={c}></Map>
            {/if}
        {/each}
    </div>

{/if}