const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const nodes=new Map(),intervals=[],events={};
function element(){return {value:'live',checked:false,textContent:'',children:[],attributes:{},setAttribute(k,v){this.attributes[k]=v;},classList:{toggle(){}},append(b){this.children.push(b);},querySelector(){return element();},getContext(){return {createImageData(){return {data:new Uint8ClampedArray(4096)};},putImageData(){}};}};}
const doc={getElementById(id){if(!nodes.has(id))nodes.set(id,element());return nodes.get(id);},createElement:element,querySelectorAll(sel){return sel==='.mood'?nodes.get('moods')?.children||[]:['scenes','playground','screensavers','worlds'].flatMap(id=>nodes.get(id)?.children||[]);},addEventListener(k,fn){events[k]=fn;}};
const c=vm.createContext({document:doc,navigator:{},setInterval(fn){intervals.push(fn);return intervals.length;},clearInterval(){},setTimeout,console});
vm.runInContext(fs.readFileSync('puppet.js','utf8')+';globalThis.state=()=>({selected,frameIndex,previewPaused});',c);
assert.equal(nodes.get('moods').children.length,8);assert.equal(nodes.get('scenes').children.length,7);
assert.equal(nodes.get('playground').children.length,5);
assert.equal(nodes.get('screensavers').children.length,5);
for(let i=0;i<2;i++){
 nodes.get('scenes').children[i].onclick();assert.equal(c.state().selected,8+i);assert.equal(nodes.get('transport').value,'live');
 for(let j=0;j<100;j++)intervals[0]();assert.equal(c.state().previewPaused,true);assert.ok(nodes.get('status').textContent.includes('finished'));
 nodes.get('scenes').children[i].onclick();assert.equal(c.state().frameIndex,0);
}
nodes.get('loopScenes').checked=true;nodes.get('scenes').children[0].onclick();for(let j=0;j<100;j++)intervals[0]();assert.equal(c.state().previewPaused,false);
nodes.get('moods').children[2].onclick();assert.equal(c.state().selected,2);
events.keydown({key:'w',code:'KeyW',target:{tagName:'BUTTON'},preventDefault(){}});assert.equal(c.state().selected,9);
nodes.get('stop').onclick();assert.equal(c.state().previewPaused,true);nodes.get('stop').onclick();assert.equal(c.state().previewPaused,false);
nodes.get('loopScenes').checked=false;
events.keydown({key:'e',code:'KeyE',target:{tagName:'BUTTON'},preventDefault(){}});assert.equal(c.state().selected,10);
for(let j=0;j<250;j++)intervals[0]();assert.equal(c.state().previewPaused,false);
nodes.get('moods').children[0].onclick();assert.equal(c.state().selected,0);
events.keydown({key:'r',code:'KeyR',target:{tagName:'BUTTON'},preventDefault(){}});assert.equal(c.state().selected,11);
for(let j=0;j<210;j++)intervals[0]();assert.equal(c.state().previewPaused,false);
nodes.get('stop').onclick();assert.equal(c.state().previewPaused,true);nodes.get('stop').onclick();assert.equal(c.state().previewPaused,false);
nodes.get('scenes').children[3].onclick();assert.equal(c.state().frameIndex,0);
nodes.get('moods').children[0].onclick();assert.equal(c.state().selected,0);
for(const [key,index] of [['t',12],['y',13]]){
 events.keydown({key,code:'Key'+key.toUpperCase(),target:{tagName:'BUTTON'},preventDefault(){}});assert.equal(c.state().selected,index);
 for(let j=0;j<210;j++)intervals[0]();assert.equal(c.state().previewPaused,false);
 nodes.get('stop').onclick();assert.equal(c.state().previewPaused,true);nodes.get('stop').onclick();assert.equal(c.state().previewPaused,false);
 nodes.get('scenes').children[index-8].onclick();assert.equal(c.state().frameIndex,0);
 nodes.get('moods').children[0].onclick();assert.equal(c.state().selected,0);
}
for(const [key,index] of [['a',14],['s',15],['d',16],['f',17]]){
 events.keydown({key,code:'Key'+key.toUpperCase(),target:{tagName:'BUTTON'},preventDefault(){}});assert.equal(c.state().selected,index);
 assert.equal(nodes.get('panel-playground').hidden,false);assert.equal(nodes.get('panel-faces').hidden,true);assert.equal(nodes.get('tab-playground').attributes['aria-selected'],'true');
 for(let j=0;j<200;j++)intervals[0]();assert.equal(c.state().previewPaused,false);
 nodes.get('resend').onclick();assert.equal(c.state().frameIndex,0);
}
nodes.get('tab-arcade').onclick();assert.equal(nodes.get('panel-arcade').hidden,false);assert.equal(nodes.get('panel-playground').hidden,true);
nodes.get('moods').children[0].onclick();assert.equal(nodes.get('panel-faces').hidden,false);
for(const [i,key] of ['z','x','c','v','b'].entries()){
 events.keydown({key,code:'Key'+key.toUpperCase(),target:{tagName:'BUTTON'},preventDefault(){}});assert.equal(c.state().selected,18+i);
 assert.equal(nodes.get('panel-screensavers').hidden,false);assert.equal(nodes.get('panel-playground').hidden,true);
 for(let j=0;j<200;j++)intervals[0]();assert.equal(c.state().previewPaused,false);
 nodes.get('resend').onclick();assert.equal(c.state().frameIndex,0);
}
nodes.get('moods').children[0].onclick();assert.equal(nodes.get('panel-screensavers').hidden,true);
for(const [key,index,panel] of [['u',23,'arcade'],['g',24,'playground']]){
 events.keydown({key,code:'Key'+key.toUpperCase(),target:{tagName:'BUTTON'},preventDefault(){}});assert.equal(c.state().selected,index);
 assert.equal(nodes.get('panel-'+panel).hidden,false);
 for(let j=0;j<200;j++)intervals[0]();assert.equal(c.state().previewPaused,false);
}
assert.equal(nodes.get('worlds').children.length,5);
for(const [i,key] of ['h','j','k','l','n'].entries()){
 events.keydown({key,code:'Key'+key.toUpperCase(),target:{tagName:'BUTTON'},preventDefault(){}});assert.equal(c.state().selected,25+i);
 assert.equal(nodes.get('panel-worlds').hidden,false);assert.equal(nodes.get('panel-playground').hidden,true);
 for(let j=0;j<200;j++)intervals[0]();assert.equal(c.state().previewPaused,false);
 nodes.get('resend').onclick();assert.equal(c.state().frameIndex,0);
}
nodes.get('moods').children[0].onclick();assert.equal(nodes.get('panel-worlds').hidden,true);
console.log('PASS: all 30 demos, five categories, hotkeys, restart, finite playback, looping and pause/resume work.');

