<script lang="js">
    // @ts-nocheck

	import { Section } from 'flowbite-svelte-blocks';
	import { Label, Input, Button, Select, Textarea, Spinner, Toggle } from 'flowbite-svelte';
    import { addDocument, getScrape } from "$lib/model";
    import { writable } from 'svelte/store';
	import { load } from 'ol/Image';

    let loading = writable(false);

    let category;
    let location;
    let searchAmount;
    let scrape;
    let headless = false;

    let data;
    let info;
	
    const handleGetScrape = async () => {
        loading.set(true);
        try {
            const toSend = {
                category: category,
                location: location,
                searchamount: searchAmount,
                headless: headless
            }
            scrape = await getScrape(toSend);
            console.log(scrape);
            if (scrape.status == 0) {
                data = scrape.data;
                console.log(data);
                info = data.info;
                console.log(info);
            }
        } catch (error) {
            console.log("error scraping: " + error);
        } finally {
            loading.set(false);
        }
    }
</script>

<Section name="crudcreateform">
	<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Scrape New Data</h2>
	<form onsubmit={handleGetScrape}>
		<div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
			<div class="sm:col-span-2">
				<Label for="category" class="mb-2">Category</Label>
				<Input type="text" id="category" placeholder="Real Estate" required bind:value={category}/>
			</div>
			<div class="w-full">
				<Label for="location" class="mb-2">Location</Label>
				<Input type="text" id="location" placeholder="Location" required bind:value={location}/>
			</div>
			<div class="w-full">
				<Label for="searchamount" class="mb-2">Search Amount</Label>
				<Input type="number" id="searchamount" placeholder="10" required bind:value={searchAmount}/>
			</div>
			<!-- <div class="w-full"> -->
                <Toggle checked={headless} on:change={() => {headless = !headless}}>Watch it happen</Toggle>
			<!-- </div> -->
            <div class="sm:col-span-2">
                {#if $loading}
                    <Button type="submit" class="w-32" disabled>
                        <Spinner color="primary" size={6}/>
                    </Button>
                {:else}
                    <Button type="submit" class="w-32">
                        Scrape Data
                    </Button>
                {/if}
            </div>
		</div>
	</form>
</Section>

{#if scrape}

    {#each info as i}

        {i.name}

    {/each}

{/if}