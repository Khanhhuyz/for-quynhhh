/* Keep decoded image elements so a scene never starts with a half-loaded sticker. */
globalThis.StickerAssets = (() => {
  function createImageCache({makeImage=()=>new Image(),concurrency=4}={}) {
    const cache=new Map();
    function load(url) {
      if(cache.has(url))return cache.get(url).promise;
      const image=makeImage();
      image.decoding='sync';image.loading='eager';
      const entry={image,ready:false};cache.set(url,entry);
      entry.promise=new Promise((resolve,reject)=>{
        image.onload=resolve;
        image.onerror=()=>reject(new Error(`Cannot load sticker: ${url}`));
        image.src=url;
      }).then(async()=>{
        if(image.decode)await image.decode();
        entry.ready=true;return image;
      }).catch(error=>{cache.delete(url);throw error;});
      return entry.promise;
    }
    async function prepare(urls,onProgress=()=>{}) {
      const unique=[...new Set(urls)], pending=unique.filter(url=>!cache.get(url)?.ready);
      let completed=unique.length-pending.length, cursor=0;
      const failed=[];onProgress(completed,unique.length);
      await Promise.all(Array.from({length:Math.min(Math.max(1,concurrency),pending.length)},async()=>{
        while(cursor<pending.length){
          const url=pending[cursor++];
          try{await load(url);}catch{failed.push(url);}
          onProgress(++completed,unique.length);
        }
      }));
      return {ready:failed.length===0,failed};
    }
    function get(url) {
      const entry=cache.get(url);
      if(!entry?.ready)throw new Error(`Sticker is not ready: ${url}`);
      return entry.image;
    }
    return Object.freeze({prepare,get});
  }
  return Object.freeze({createImageCache});
})();
