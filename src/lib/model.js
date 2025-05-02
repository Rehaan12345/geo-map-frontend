import { collection, addDoc } from "firebase/firestore"; 
import { db } from "./firebase";

const URL = import.meta.env.VITE_URL;

/**
 * @param {any} data
 */
export async function addDocument(data) {

  try {
    const res = await fetch(URL + 'add-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }), // collection is always inside this data dict.
    });

    return 0;
  } catch (error) {
    console.log(error);
    return -1;
  }
  
}

/**
 * @param {any} collection
 */
export async function getDocuments(collection) {
  try {

    const toSend = {
      "collection": collection
    }

    let res = await fetch(URL + "read-collection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({toSend})
    })
    res = await res.json();
    return res;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

// @ts-nocheck
/**
 * @param {undefined} [data]
 */
export async function getScrape(data) {
  try {
    console.log(JSON.stringify({data}))
    const res = await fetch(URL + 'scrape-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data })
    });

    console.log(res);

    const resp = await res.json();

    console.log(resp.data);

    return {"status": 0, "data": resp.data};
  } catch (error) {
    console.log(error);
    return -1;
  }
}