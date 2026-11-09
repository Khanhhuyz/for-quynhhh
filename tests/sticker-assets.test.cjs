const {test}=require('node:test');
const assert=require('node:assert/strict');
require('../sticker-assets.js');
const tick=()=>new Promise(resolve=>setImmediate(resolve));

test('a sticker cannot be displayed until its image has finished decoding',async()=>{
  let release,created=0;
  const decoded=new Promise(resolve=>{release=resolve;});
  const cache=StickerAssets.createImageCache({makeImage:()=>{
    created++;
    return {set src(value){this.url=value;queueMicrotask(()=>this.onload());},decode:()=>decoded};
  }});
  const ready=cache.prepare(['cry.png','cry.png']);
  await tick();
  assert.throws(()=>cache.get('cry.png'),/not ready/);
  release();
  assert.equal((await ready).ready,true);
  assert.equal(created,1);
  const image=cache.get('cry.png');
  await cache.prepare(['cry.png']);
  assert.equal(cache.get('cry.png'),image);
  assert.equal(created,1);
});

test('preparing a story limits concurrent downloads and reports all unique images',async()=>{
  const started=[],releases=[],progress=[];
  const cache=StickerAssets.createImageCache({concurrency:2,makeImage:()=>({
    set src(value){started.push(value);queueMicrotask(()=>this.onload());},
    decode:()=>new Promise(resolve=>releases.push(resolve))
  })});
  const ready=cache.prepare(['one','two','three','four','one'],(done,total)=>progress.push([done,total]));
  await tick();
  assert.equal(started.length,2);
  releases.splice(0).forEach(resolve=>resolve());
  await tick();
  assert.equal(started.length,4);
  releases.splice(0).forEach(resolve=>resolve());
  assert.equal((await ready).ready,true);
  assert.deepEqual(progress.at(-1),[4,4]);
});

test('a failed image can be retried without downloading ready images again',async()=>{
  const attempts={};
  const cache=StickerAssets.createImageCache({makeImage:()=>({
    set src(value){
      attempts[value]=(attempts[value]||0)+1;
      queueMicrotask(()=>value==='retry'&&attempts[value]===1?this.onerror():this.onload());
    },decode:async()=>{}
  })});
  const first=await cache.prepare(['ready','retry']);
  assert.deepEqual(first,{ready:false,failed:['retry']});
  assert.throws(()=>cache.get('retry'),/not ready/);
  assert.equal((await cache.prepare(['ready','retry'])).ready,true);
  assert.deepEqual(attempts,{ready:1,retry:2});
});
