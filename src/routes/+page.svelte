<script>
    import Map from "./Map.svelte";
    import { addDocument } from "$lib/model";

    let name = "";
    let coords = ""

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

</script>
<!-- 
<form on:submit={submit}>
    <label for="name">Name</label>
    <input type="text" id="name" placeholder="name" bind:value={name}>
    <label for="cords">cords</label>
    <input type="text" id="coords" placeholder="coords" bind:value={coords}>
    <input type="submit">
</form> -->

<Map></Map>