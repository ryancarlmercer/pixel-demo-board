const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('puppet.js','utf8').split('MOODS.forEach((m,i)=>')[0];
const context=vm.createContext({document:{getElementById:()=>({})},setTimeout,console});
vm.runInContext(source+`;globalThis.api={pixels,scenePixels,pixelPackets,crc32,gifPackets,asset};`,context);
const {pixels,scenePixels,pixelPackets,crc32,gifPackets,asset}=context.api;
let previous=null,count=0;
for(const mood of ['curious','happy','suspicious','angry','sleepy','shocked','love','freeze'])for(let f=0;f<8;f++){
  const next=pixels(mood,f),painted=previous?Uint8Array.from(previous):new Uint8Array(1024).fill(255);
  for(const p of pixelPackets(next,previous)){
    assert.equal(p[0]+256*p[1],p.length);assert.deepEqual([...p.slice(2,5)],[5,1,0]);assert.ok((p.length-8)/2<=120);
    const palette=[[0,0,0],[171,255,201],[255,89,83],[119,207,255],[255,108,164],[255,226,112],[255,255,255],[49,91,67]];
    const c=palette.findIndex(rgb=>rgb.every((v,i)=>v===p[5+i]));assert.ok(c>=0);
    for(let k=8;k<p.length;k+=2){assert.ok(p[k]<32&&p[k+1]<32);painted[p[k+1]*32+p[k]]=c;}count++;
  }
  assert.deepEqual([...painted],[...next]);previous=next;
}
assert.equal(crc32(Buffer.from('123456789')),0xcbf43926);
for(let i=0;i<8;i++){const gif=asset(i).gif;const packets=gifPackets(gif);assert.equal(packets[0][15],12);const body=Buffer.concat(packets.map(p=>Buffer.from(p.slice(16))));assert.deepEqual(body,Buffer.from(gif));}
console.log('PASS: 64 animation frames reconstructed exactly from '+count+' bounded pixel commands; CRC32 and GIF packet reconstruction passed.');
for(const [scene,length] of [['maze',80],['barrels',88],['tetris',104],['asteroids',96],['invaders',88],['pong',96],['fireworks',96],['warp',96],['lava',96],['bounce',96],['pipes',96],['windows',96],['starfield',96],['mystify',96],['winmaze',96],['doom',96],['ryan',1],['aquarium',96],['campfire',96],['rainwindow',96],['rocket',96],['train',96]]){
  previous=null;let changes=0;
  for(let f=0;f<length;f++){
    const frame=scenePixels(scene,f),painted=previous?Uint8Array.from(previous):new Uint8Array(1024).fill(255);
    assert.equal(frame.length,1024);assert.ok((scene==='pipes'&&f===95)||[...frame].some(c=>c!==0));assert.ok([...frame].every(c=>c<8));
    const palette=[[0,0,0],[171,255,201],[255,89,83],[119,207,255],[255,108,164],[255,226,112],[255,255,255],[49,91,67]];
    for(const p of pixelPackets(frame,previous)){assert.ok((p.length-8)/2<=120);const c=palette.findIndex(rgb=>rgb.every((v,i)=>v===p[5+i]));for(let k=8;k<p.length;k+=2)painted[p[k+1]*32+p[k]]=c;}
    assert.deepEqual([...painted],[...frame]);if(previous&&frame.some((v,i)=>v!==previous[i]))changes++;previous=frame;
  }assert.ok(length===1||changes>length/2);console.log('PASS: '+scene+' — '+length+' frames and exact pixel-delta reconstruction.');
}


