<script lang="js">
	import { Section } from 'flowbite-svelte-blocks';
	import { Button, Drawer, CloseButton, Heading } from 'flowbite-svelte';
	import Map from './Map.svelte';

    export let mapData = {"title": "Loading ..."}
</script>

<style>
    .tablehead {
        display: grid;
    }

    .tablebody {
        display: grid;
    }
</style>

<Section sectionClass="h-96">

    <p class="text-3xl text-gray-900" style="margin-bottom: 1rem;"><i><u>{mapData.title}</u></i></p>
    
    <div class="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500">
                <thead class="tablehead text-lg text-gray-700 bg-gray-50">
                    <tr>
                        {#each Object.entries(mapData) as [key, value]}
                            {#if key != 'id'}
                                <th scope="col" class="px-4 py-3">{key}</th>
                            {/if}
                        {/each}
                    </tr>
                </thead>
                <tbody class="tablebody">
                    <tr class="border-b tablerow">
                        {#each Object.entries(mapData) as [key, value]}
                            {#if key != 'id'}
                                {#if key == "website"}
                                    <td class="px-4 py-3">
                                        <u><a target="_blank" href="{value}">{value}</a></u>
                                    </td>
                                {:else}
                                    <td class="px-4 py-3">
                                        {value}
                                    </td>
                                {/if}
                            {/if}
                        {/each}
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</Section>