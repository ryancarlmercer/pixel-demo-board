/* Cold Open — original procedural art; iDotMatrix packet format based on
 * https://github.com/udivankin/idotmatrix-web (MIT).
 */
const MOODS = [
  ['curious','Curious','Just heard the snack drawer.'],
  ['happy','Happy','You brought the good stuff.'],
  ['suspicious','Suspicious','That better not be decaf.'],
  ['angry','Angry','Somebody stole the last soda.'],
  ['sleepy','Sleepy','Five more minutes.'],
  ['shocked','Shocked','You put WHAT in here?'],
  ['love','In love','A very cool crush.'],
  ['freeze','Brain freeze','Too cold. Even for me.']
];
const PALETTE = [[0,0,0],[171,255,201],[255,89,83],[119,207,255],[255,108,164],[255,226,112],[255,255,255],[49,91,67]];
const SCENES = [
  {id:'maze',name:'Midnight maze',frames:80,description:'A hungry yellow hero, two ghosts, and a power-pellet comeback.',key:'Q'},
  {id:'barrels',name:'Barrel rescue',frames:88,description:'A red-capped climber jumps rolling barrels and reaches the rooftop.',key:'W'},
  {id:'tetris',name:'Block drop',frames:104,loop:true,description:'Colorful tetrominoes stack up, then a long piece drops into the well for a four-line clear.',key:'E'},
  {id:'asteroids',name:'Asteroid patrol',frames:96,loop:true,description:'A turning vector ship fires into drifting rocks, splitting them into fragments and sparks.',key:'R'},
  {id:'invaders',name:'Alien defense',frames:88,loop:true,description:'Marching alien ranks, a sliding laser cannon, and a last-invader victory burst.',key:'T'},
  {id:'pong',name:'Neon rally',frames:96,loop:true,description:'A classic paddle rally with a glowing ball, wall rebounds, and little impact sparks.',key:'Y'},
  {id:'fireworks',name:'Pocket fireworks',category:'playground',frames:96,loop:true,description:'Tiny rockets launch into colorful bursts and falling sparks.',key:'A'},
  {id:'warp',name:'Warp drive',category:'playground',frames:96,loop:true,description:'A starfield rushes past in a miniature hyperspace tunnel.',key:'S'},
  {id:'lava',name:'Lava lamp',category:'playground',frames:96,loop:true,description:'Warm blobs stretch, merge, and drift through a pixel lava lamp.',key:'D'},
  {id:'bounce',name:'Bouncing logo',category:'playground',frames:96,loop:true,description:'A colorful retro screensaver logo bounces around the panel.',key:'F'},
  {id:'pipes',name:'3D Pipes',category:'screensavers',frames:96,loop:true,description:'Bright beveled pipes grow, bend, and rebuild across a black screen.',key:'Z'},
  {id:'windows',name:'Flying Windows',category:'screensavers',frames:96,loop:true,description:'Four-color window flags fly out of the distance in a nostalgic logo swarm.',key:'X'},
  {id:'starfield',name:'Starfield',category:'screensavers',frames:96,loop:true,description:'The classic star-flight illusion: white stars accelerate out of deep space.',key:'C'},
  {id:'mystify',name:'Mystify',category:'screensavers',frames:96,loop:true,description:'Neon polygon outlines twist and bounce with colorful trailing echoes.',key:'V'},
  {id:'winmaze',name:'3D Maze',category:'screensavers',frames:96,loop:true,description:'A first-person trip through a tiny brick maze, complete with turning corners.',key:'B'},
  {id:'doom',name:'Doom patrol',frames:96,loop:true,description:'A Doom-inspired corridor, pixel monsters, a shotgun, and muzzle flashes. An animated homage, not the game engine.',key:'U'},
  {id:'ryan',name:'Ryan Mercer',category:'playground',frames:1,loop:true,description:'A clean, static two-line name card: RYAN above MERCER.',key:'G'},
  {id:'aquarium',name:'Desktop aquarium',category:'worlds',frames:96,loop:true,description:'Little fish swim past waving plants and rising bubbles.',key:'H'},
  {id:'campfire',name:'Campfire night',category:'worlds',frames:96,loop:true,description:'A flickering fire, drifting embers, and a quiet crescent moon.',key:'J'},
  {id:'rainwindow',name:'Rainy window',category:'worlds',frames:96,loop:true,description:'Rain slides past a city window while a warm cup waits on the sill.',key:'K'},
  {id:'rocket',name:'Rocket launch',category:'worlds',frames:96,loop:true,description:'A tiny rocket lifts off through smoke and disappears into the stars.',key:'L'},
  {id:'train',name:'Midnight express',category:'worlds',frames:96,loop:true,description:'A lit passenger train rolls past mountains under a starry sky.',key:'N'}
];
const titleOf=index=>index<MOODS.length?MOODS[index][1]:SCENES[index-MOODS.length].name;
const isScene=index=>index>=MOODS.length;
const lengthOf=index=>isScene(index)?SCENES[index-MOODS.length].frames:8;
const shouldLoop=(index=selected)=>(isScene(index)&&SCENES[index-MOODS.length].loop)||$('loopScenes').checked;
function stagePixels(index,f){return isScene(index)?scenePixels(SCENES[index-MOODS.length].id,shouldLoop(index)?f%lengthOf(index):Math.min(f,lengthOf(index)-1)):pixels(MOODS[index][0],f%8);}
function scenePixels(id,f){
  const a=new Uint8Array(1024);
  const dot=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&x<32&&y>=0&&y<32)a[y*32+x]=c;};
  const rect=(x,y,w,h,c)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)dot(x+i,y+j,c);};
  const line=(x,y,x2,y2,c)=>{let n=Math.max(Math.abs(x2-x),Math.abs(y2-y));for(let i=0;i<=n;i++)dot(x+(x2-x)*i/(n||1),y+(y2-y)*i/(n||1),c);};
  const sprite=(x,y,rows)=>rows.forEach((r,j)=>[...r].forEach((c,i)=>{if(c!=='.')dot(x+i,y+j,Number(c));}));
  const spark=(x,y)=>{dot(x,y,6);dot(x-1,y,5);dot(x+1,y,5);dot(x,y-1,5);dot(x,y+1,5);};
  if(id==='aquarium'){
    rect(0,29,32,3,7);for(let x=1;x<32;x+=5)dot(x,30,5);
    for(const base of [3,8,26,29])for(let y=20;y<29;y++){const x=base+Math.round(Math.sin(f*Math.PI/12+y*.7));dot(x,y,1);if(y%3===0)dot(x+(y%2?1:-1),y,7);}
    const fish=(x,y,c,flip)=>{const rows=['...cc...','..ccccc.','cccccc6c','..ccccc.','...cc...'];sprite(Math.round(x),y,rows.map(r=>(flip?[...r].reverse().join(''):r).replaceAll('c',String(c))));};
    fish((f*.5)%48-8,9,5,false);fish(36-((f*.5+20)%48),18,4,true);
    for(let i=0;i<3;i++){const y=29-((f+i*32)%96)*.25,x=20+i*3;dot(x,y,3);dot(x+1,y-1,6);}
  }else if(id==='campfire'){
    for(const [x,y] of [[3,4],[13,2],[28,10],[8,10]])dot(x,y,f%12<8?6:7);
    for(let y=-3;y<=3;y++)for(let x=-3;x<=3;x++)if(x*x+y*y<=10&&(x-2)**2+(y+1)**2>8)dot(25+x,5+y,5);
    rect(0,29,32,3,7);line(9,28,23,26,5);line(10,26,22,28,2);
    for(let y=15;y<27;y++){const height=27-y,width=Math.max(1,6-height*.4),center=16+Math.sin(f*.8+y)*height*.13;
      for(let x=10;x<=22;x++)if(Math.abs(x-center)<width){dot(x,y,2);if(y>19&&Math.abs(x-16)<width*.6)dot(x,y,5);if(y>23&&Math.abs(x-16)<1.5)dot(x,y,6);}}
    for(let i=0;i<3;i++){const age=(f+i*11)%32;dot(14+i*2+Math.sin(age*.5)*2,24-age*.6,age<16?5:2);}
  }else if(id==='rainwindow'){
    for(let i=0;i<7;i++)rect(3+i*4,18-(i*7)%9,3,12,7);
    for(let i=0;i<12;i++){const x=4+(i*7)%24,y=((f*(i%2+1)+i*11)%32)-3;line(x,y,x-1,y+3,3);if(i%3===0)dot(x,y,6);}
    rect(1,1,30,1,6);rect(1,1,1,28,3);rect(30,1,1,28,3);rect(15,1,2,27,3);rect(1,14,30,1,3);rect(0,28,32,2,6);
    rect(22,24,5,4,4);line(27,25,29,25,4);line(29,25,29,27,4);line(27,27,29,27,4);
    for(let i=0;i<3;i++)dot(23+((f+i)%3),22-i,7);
  }else if(id==='rocket'){
    for(const [i,x,y] of [[0,3,3],[1,26,6],[2,7,13],[3,28,19],[4,19,2]])dot(x,y,f%12===i?3:6);
    rect(4,29,24,2,7);rect(9,27,14,2,3);line(8,27,8,16,7);
    const y=Math.round(17-Math.max(0,f-12)*.6);
    if(f>10&&f<70)for(let i=0;i<8;i++){const age=(f+i*7)%24,x=16+(i%2?1:-1)*(age*.5);dot(x,27-Math.sin(age/24*Math.PI)*3,age<10?6:7);}
    if(y>-12){sprite(13,y,['...2...','..262..','..666..','..636..','..666..','..666..','.26662.','2266622','...5...']);
      if(f>10){line(15,y+9,15,y+10+f%3,5);line(16,y+9,16,y+12+f%2,2);}}
    if(f>65){const travel=(f-66)*.5;dot(22-travel*.3,12-travel*.3,6);dot(23-travel*.3,13-travel*.3,3);}
  }else if(id==='train'){
    for(const [x,y] of [[2,3],[15,2],[28,4],[9,7]])dot(x,y,6);
    for(let x=0;x<32;x++){const height=6+Math.round(Math.sin(x*.3)*3);rect(x,20-height,1,height,7);}
    rect(0,28,32,1,3);for(let x=0;x<32;x+=4)rect(x,29,2,1,7);
    const lead=38-f*.75;
    for(let i=0;i<4;i++){const x=Math.round(lead+i*10);rect(x,20,9,6,i===0?2:3);rect(x+1,19,7,1,6);for(let k=1;k<8;k+=3)rect(x+k,21,2,2,5);rect(x+1,26,2,2,7);rect(x+6,26,2,2,7);dot(x+9,25,6);}
    if(lead>-10&&lead<33){rect(Math.round(lead)-1,23,1,2,6);for(let i=0;i<3;i++)dot(lead+3+i*3,17-((f+i)%4),7);}
  }else if(id==='ryan'){
    const font={R:['110','101','110','101','101'],Y:['101','101','010','010','010'],A:['010','101','111','101','101'],N:['101','111','111','111','101'],M:['101','111','111','101','101'],E:['111','100','110','100','111'],C:['111','100','100','100','111']};
    const text=(word,x,y,scale,color)=>[...word].forEach((letter,i)=>font[letter].forEach((row,j)=>[...row].forEach((v,k)=>{if(v==='1')rect(x+i*4*scale+k*scale,y+j*scale,scale,scale,color);}))); 
    text('RYAN',1,4,2,3);text('MERCER',4,21,1,6);
  }else if(id==='doom'){
    const t=f%32,room=Math.floor((f%96)/32),bob=t<18?Math.round(Math.sin(t*Math.PI/4)):0;
    // Perspective corridor: textured side walls, distant doorway, floor tiles.
    rect(0,0,32,28,7);rect(11,7,10,13,0);
    for(let x=0;x<32;x++){
      const edge=Math.min(x,31-x),top=Math.round(edge*.64),bottom=27-Math.round(edge*.6);
      if(x<11||x>20)for(let y=top;y<bottom;y++){const mortar=(y+Math.floor(edge/3))%5===0||((x+(Math.floor(y/5)%2)*3)%6===0);dot(x,y,mortar?7:(x<11?2:5));}
    }
    for(let y=20;y<28;y++){const spacing=Math.max(2,y-17);for(let x=0;x<32;x++)if((Math.floor(x/spacing)+Math.floor((y+t*.25)/2))%2===0)dot(x,y,0);}
    line(0,0,11,7,6);line(31,0,20,7,6);line(0,27,11,20,0);line(31,27,20,20,0);
    if(t<21){
      const scale=t<7?1:2,rows=['.2...2.','..222..','.25252.','2222222','2.666.2','..222..','.22.22.'];
      rows.forEach((row,y)=>[...row].forEach((c,x)=>{if(c!=='.')rect(Math.round(16-3.5*scale)+x*scale,8+y*scale,scale,scale,c==='2'?[2,4,1][room]:Number(c));}));
    }
    if(t>=21&&t<25){for(let i=0;i<8;i++){const angle=i*Math.PI/4,r=2+(t-21)*2;dot(16+Math.cos(angle)*r,14+Math.sin(angle)*r,5);}}
    const recoil=t>=20&&t<23?2:0;
    rect(13,23+bob+recoil,7,5,5);rect(14,20+bob+recoil,5,6,7);rect(15,19+bob+recoil,3,7,6);rect(16,20+bob+recoil,1,6,0);
    if(t===20||t===21){sprite(11,13,['..5.5..','.55555.','5556555','.55555.','..555..','...5...']);}
    rect(0,28,32,4,7);rect(1,29,7,2,2);rect(24,29,7,2,3);sprite(14,28,['555','505','555','5.5']);
  }else if(id==='pipes'){
    rect(3,26,3,3,3);dot(3,26,6);
    const path=[[4,27],[4,10],[13,10],[13,22],[25,22],[25,5],[8,5],[8,15],[19,15],[19,28]];
    const amount=Math.min(9,f/8);
    for(let i=0;i<Math.ceil(amount);i++){
      const [x,y]=path[i],[tx,ty]=path[i+1],portion=Math.min(1,amount-i),ex=x+(tx-x)*portion,ey=y+(ty-y)*portion,c=[3,2,5,4,1][i%5];
      for(let d=-1;d<=1;d++)line(x+d,y,ex+d,ey,c);
      for(let d=-1;d<=1;d++)line(x,y+d,ex,ey+d,c);
      line(x-1,y-1,ex-1,ey-1,6);rect(Math.round(ex)-1,Math.round(ey)-1,3,3,c);dot(ex-1,ey-1,6);
    }
    if(f>=88)rect(0,0,32,(f-87)*4,0);
  }else if(id==='windows'){
    for(let i=0;i<7;i++){
      const phase=(f+i*14)%96,angle=i*2.4+.4,size=1+Math.floor(phase/32),distance=phase*.25;
      const x=Math.round(14+Math.cos(angle)*distance),y=Math.round(14+Math.sin(angle)*distance);
      for(let k=1;k<=3;k++)dot(x-k*2,y+(k%2),[2,1,3][(i+k)%3]);
      rect(x,y,size,size,2);rect(x+size+1,y-1,size,size,1);rect(x,y+size+1,size,size,3);rect(x+size+1,y+size,size,size,5);
    }
  }else if(id==='starfield'){
    for(let i=0;i<40;i++){
      const p=(f+i*17)%48,angle=i*2.399963,rad=.5+p*p/86;
      const x=15.5+Math.cos(angle)*rad,y=15.5+Math.sin(angle)*rad;
      dot(x,y,p<15?7:6);if(p>35)dot(x-Math.cos(angle),y-Math.sin(angle),6);
    }
  }else if(id==='mystify'){
    for(let trail=5;trail>=0;trail--){
      const phase=(f-trail*2)*Math.PI*2/96,points=[];
      for(let i=0;i<4;i++)points.push([15.5+Math.sin(phase*(i%2+1)+i*1.7)*14,15.5+Math.cos(phase*((i+1)%2+1)+i*2.1)*14]);
      for(let i=0;i<4;i++)line(...points[i],...points[(i+1)%4],trail===0?6:[3,4,1,5,2][(trail-1)%5]);
    }
  }else if(id==='winmaze'){
    const leg=Math.floor((f%96)/24),phase=f%24,points=[[1.5,1.5],[7.5,1.5],[7.5,7.5],[1.5,7.5]],start=points[leg],end=points[(leg+1)%4];
    const progress=Math.min(1,phase/18),px=start[0]+(end[0]-start[0])*progress,py=start[1]+(end[1]-start[1])*progress;
    const heading=leg*Math.PI/2+Math.max(0,(phase-18)/6)*Math.PI/2;
    const wall=(x,y)=>x<=0||y<=0||x>=8||y>=8||(x>=3&&x<=5&&y>=3&&y<=5);
    for(let x=0;x<32;x++){
      const ray=heading+(x-15.5)/32*1.1,dx=Math.cos(ray),dy=Math.sin(ray);let distance=.05;
      while(distance<12&&!wall(Math.floor(px+dx*distance),Math.floor(py+dy*distance)))distance+=.05;
      const height=Math.min(32,Math.round(24/(distance*Math.cos(ray-heading)))),top=Math.floor((32-height)/2);
      const hx=px+dx*distance,hy=py+dy*distance,texture=Math.abs(hx-Math.round(hx))<.08?hy:hx;
      for(let y=0;y<32;y++){
        if(y>=top&&y<top+height){const row=Math.floor((y-top)/Math.max(2,height/4)),mortar=(y-top)%Math.max(2,Math.round(height/4))===0||Math.floor(texture*7+row%2*3)%7===0;dot(x,y,mortar?7:distance<2?5:2);}
        else if(y>=16&&(x+y)%3===0)dot(x,y,7);
      }
    }
  }else if(id==='fireworks'){
    for(let k=0;k<3;k++){
      const t=(f+k*11)%32,c=[4,3,5][k],cx=[8,23,16][k],cy=[9,12,6][k];
      if(t<11){const y=30-(30-cy)*t/11;rect(cx,Math.round(y),1,2,6);dot(cx,y+3,c);}
      else{const age=t-11,r=age*.44;for(let j=0;j<12;j++){const angle=j*Math.PI/6+k*.4;const x=cx+Math.cos(angle)*r,y=cy+Math.sin(angle)*r+age*age*.012;if(t<26||j%2===0){dot(x,y,t<15?6:c);if(t<22)dot(cx+Math.cos(angle)*(r-.8),cy+Math.sin(angle)*(r-.8)+age*age*.012,c);}}}
    }
    for(let x=0;x<32;x+=4)rect(x,30-(x%3),3,2+x%3,7);
  }else if(id==='warp'){
    for(let i=0;i<30;i++){
      const phase=(f+i*13)%48,angle=i*2.399963,r=1+phase*phase/92;
      const x=15.5+Math.cos(angle)*r,y=15.5+Math.sin(angle)*r;
      if(phase>30)line(15.5+Math.cos(angle)*(r-2),15.5+Math.sin(angle)*(r-2),x,y,3);
      dot(x,y,phase>28?6:phase>14?3:7);
    }
  }else if(id==='lava'){
    const theta=f*Math.PI*2/96;
    const blobs=[[12+Math.sin(theta)*4,13+Math.cos(theta)*7,5],[19+Math.cos(theta)*3,16+Math.sin(theta)*8,6],[15+Math.sin(theta*2)*4,21+Math.cos(theta)*5,4]];
    for(let y=4;y<28;y++)for(let x=6;x<26;x++){
      let energy=0;for(const [bx,by,r] of blobs)energy+=r*r/(2+(x-bx)**2+(y-by)**2);
      if(energy>1.4)dot(x,y,energy>4?5:energy>2.5?4:2);
    }
    line(10,1,21,1,3);line(8,3,23,3,7);line(5,5,5,27,7);line(26,5,26,27,7);rect(7,28,18,2,3);rect(10,30,12,2,7);
  }else if(id==='bounce'){
    const fold=(n,r)=>{const p=n%(r*2);return p<=r?p:r*2-p;};
    const x=Math.round(4+fold(f*.5,12)),y=Math.round(fold(f*.5+7,24)),c=[3,4,5,1][Math.floor(f/24)%4];
    sprite(x,y,['cc..c.c.cc.','c.c.c.c.c.c','c.c.c.c.c.c','c.c.c.c.c.c','cc...c..cc.'].map(row=>row.replaceAll('c',String(c))));
    line(x,y+6,x+10,y+6,c);dot(x+5,y+7,c);
  }else if(id==='invaders'){
    const t=f%88,order=[3,4,5,0,1,2],shot=Math.min(5,Math.floor(t/12)),phase=t%12;
    const drift=Math.round(Math.sin(t*Math.PI/12)*2);
    const position=i=>[4+(i%3)*9+drift,4+Math.floor(i/3)*7];
    const current=position(order[shot]),previous=position(order[Math.max(0,shot-1)]);
    const cannon=t<72?Math.round(previous[0]+2+(current[0]-previous[0])*Math.min(1,phase/3)):14;
    for(let i=0;i<6;i++){
      const hit=order.indexOf(i)*12+8,[x,y]=position(i),color=i<3?1:4;
      if(t<hit){sprite(x,y,(Math.floor(t/2)%2?['.c.c.','ccccc','c.c.c','.c.c.']:['.c.c.','ccccc','.c.c.','c...c']).map(r=>r.replaceAll('c',String(color))));}
      else if(t<hit+3)spark(x+2,y+2);
    }
    for(const x of [3,14,25]){sprite(x,23,['.111.','11111','11.11']);}
    if(t<72&&phase>=3&&phase<=8){const y=Math.round(27-(27-current[1]-2)*(phase-3)/5);rect(cannon,y,1,2,6);}
    if(t<68){const y=12+(t%17),x=27-Math.floor(t/17)*6;if(y<27)dot(x,y,2);}
    sprite(cannon-2,28,['..3..','.333.','33333','33333']);
    if(t>=72){for(let i=0;i<4;i++){const x=5+i*7,y=5+(i%2)*6,r=1+(t-72)%5;for(let j=0;j<4;j++){const angle=j*Math.PI/2+(t%3)*.3;dot(x+Math.cos(angle)*r,y+Math.sin(angle)*r,[5,1,4,6][i]);}}}
  }else if(id==='pong'){
    const t=f%96,fold=(n,range)=>{const p=((n%(range*2))+range*2)%(range*2);return p<=range?p:range*2-p;};
    // Both trajectories close exactly after 96 frames. Paddle centers align
    // with the ball at contact, rather than pretending to hit a missed ball.
    const bx=3+fold(t,24),by=5+fold(t*.5+5,24),sway=Math.sin(t*Math.PI/24)*3;
    const paddleY=v=>Math.max(4,Math.min(24,Math.round(v)-3));
    const leftY=paddleY(by+sway),rightY=paddleY(by-sway);
    rect(0,2,32,1,7);rect(0,31,32,1,7);
    for(let y=4;y<30;y+=4)rect(15,y,1,2,7);
    rect(1,leftY,2,7,3);rect(29,rightY,2,7,4);
    const movingRight=t%48<24,trailX=bx+(movingRight?-2:2);
    dot(trailX,by,7);rect(Math.round(bx),Math.round(by),2,2,6);
    if(t%24<2){const x=movingRight?3:28;dot(x,by-2,5);dot(x,by+3,5);}
    if(t===38||t===39||t===86||t===87){dot(bx-2,by,3);dot(bx+3,by,3);}
    // Tiny score lamps keep the scene legible without text at this size.
    for(let i=0;i<3;i++){dot(8+i*2,0,3);dot(20+i*2,0,4);}
  }else if(id==='asteroids'){
    const t=f%96,phase=t%32,encounter=Math.floor(t/32),aim=-Math.PI/2+encounter*Math.PI*2/3;
    const ux=Math.cos(aim),uy=Math.sin(aim),impact=[16+ux*10,16+uy*10];
    const wrap=v=>((v%40)+40)%40-4;
    const rock=(x,y,r,spin,color=6)=>{
      const outline=[];for(let i=0;i<8;i++){const angle=spin+i*Math.PI/4,rr=r*[1,.72,1,.85,.7,1,.78,.9][i];outline.push([x+Math.cos(angle)*rr,y+Math.sin(angle)*rr]);}
      for(let i=0;i<8;i++)line(...outline[i],...outline[(i+1)%8],color);
    };
    // Sparse fixed stars leave room for the bright, original vector sprites.
    for(const [x,y] of [[2,4],[27,3],[5,21],[29,25],[14,30],[1,13]])dot(x,y,7);
    rock(wrap(5+t*.35),wrap(27-t*.2),2.5,t*.07,3);
    rock(wrap(30-t*.27),wrap(7+t*.31),2,t*.09,6);
    if(phase<=16){const distance=24-phase*.875;rock(16+ux*distance,16+uy*distance,3.5,t*.12);}
    if(phase>=12&&phase<=16){const distance=5+(phase-12)*1.25;dot(16+ux*distance,16+uy*distance,5);dot(16+ux*(distance-1),16+uy*(distance-1),6);}
    if(phase>=17&&phase<=22){
      const radius=1+(phase-17)*.6;
      for(let i=0;i<8;i++){const angle=i*Math.PI/4+t*.08;dot(impact[0]+Math.cos(angle)*radius,impact[1]+Math.sin(angle)*radius,phase%2?5:6);}
    }
    if(phase>=20){const age=phase-20;for(const side of [-1,1]){
      const x=impact[0]+ux*age*.3-uy*side*(2+age*.55),y=impact[1]+uy*age*.3+ux*side*(2+age*.55);
      rock(x,y,1.7,t*.18*side,6);
    }}
    // Slew toward each target, then fire. The 96-frame loop repeats the turn.
    const angle=phase<8?aim-(1-phase/8)*Math.PI*2/3:aim;
    const point=(r,offset=0)=>[16+Math.cos(angle+offset)*r,16+Math.sin(angle+offset)*r];
    const tip=point(4),left=point(3,2.45),right=point(3,-2.45),notch=point(-1);
    line(...tip,...left,6);line(...left,...notch,6);line(...notch,...right,6);line(...right,...tip,6);
    if(phase<11&&phase%2===0){const exhaust=point(-5);line(...notch,...exhaust,5);}
  }else if(id==='tetris'){
    // A 10-column playfield with 2x2-pixel cells. Every landing is supported;
    // the final vertical I piece fills a four-cell well and clears four rows.
    const t=f%104,board=Array.from({length:14},()=>Array(10).fill(0));
    const pieces=[
      {x:1,y:8,c:4,xy:[[1,0],[0,1],[1,1],[2,1]]},
      {x:7,y:8,c:5,xy:[[0,0],[1,0],[0,1],[1,1]]},
      {x:5,y:7,c:2,xy:[[0,0],[0,1],[0,2],[1,2]]},
      {x:4,y:10,c:3,xy:[[0,0],[0,1],[0,2],[0,3]]}
    ];
    const put=(piece,y)=>piece.xy.forEach(([dx,dy])=>{if(y+dy>=0&&y+dy<14)board[y+dy][piece.x+dx]=piece.c;});
    for(let y=10;y<14;y++)for(let x=0;x<10;x++)if(x!==4)board[y][x]=[1,2,3,5][(Math.floor(x/2)+y)%4];
    const active=Math.min(3,Math.floor(t/20));
    for(let i=0;i<active;i++)put(pieces[i],pieces[i].y);
    if(t<80){const p=pieces[active],step=t%20;const y=step>=17?p.y:Math.min(p.y,-4+Math.floor((p.y+4)*step/16));put(p,y);}
    else{put(pieces[3],pieces[3].y);}
    if(t>=88){const shift=Math.min(4,1+Math.floor((t-88)/2));for(let y=13;y>=0;y--)board[y]=y>=shift&&y-shift<10?board[y-shift].slice():Array(10).fill(0);}
    rect(0,0,23,1,7);rect(0,0,1,31,7);rect(22,0,1,31,7);rect(0,30,23,2,7);
    for(let y=0;y<14;y++)for(let x=0;x<10;x++){
      const c=board[y][x];if(c){rect(2+x*2,2+y*2,2,2,c);dot(3+x*2,3+y*2,7);}
    }
    if(t>=80&&t<88){const flash=(t%2)===0?6:3;rect(2,22,20,8,flash);}
    // Next-piece window and a four-line tally along the right edge.
    rect(24,1,8,9,7);rect(25,2,6,7,0);
    const next=pieces[(active+1)%pieces.length];next.xy.forEach(([x,y])=>rect(26+x,3+y,1,1,next.c));
    for(let i=0;i<4;i++)rect(25,16+i*3,5,1,t>=88?1:7);
    if(t>=96){spark(27,12);}
  }else if(id==='maze'){
    // Two wide corridors keep the silhouettes readable on a real 32-pixel panel.
    rect(0,0,32,2,3);rect(0,30,32,2,3);rect(0,0,2,5,3);rect(30,0,2,5,3);rect(0,12,2,8,3);rect(30,12,2,8,3);rect(0,27,2,5,3);rect(30,27,2,5,3);
    for(const x of [4,19]){rect(x,13,9,6,3);rect(x+1,14,7,4,0);}rect(14,12,3,8,3);
    const powered=f>=38,top=f<36,y=top?7:24;
    const x=top?-4+f*1.15:35-(f-36)*1.05;
    for(let p=3;p<30;p+=4){if(!top||p>x+3)dot(p,7,6);if(top||p<x-3)dot(p,24,6);}
    if(f<38){rect(26,22,3,3,f%4<2?5:6);}
    const ghost=(gx,gy,color)=>{sprite(Math.round(gx)-2,gy-3,['.ccc.','ccccc','c6c6c','ccccc',f%2?'c.c.c':'.c.c.'].map(r=>r.replaceAll('c',String(color))));};
    if(f<36){ghost(x-9,y,2);ghost(x-17,y,4);}else if(f<71){ghost(x-9,y,powered?3:2);ghost(x-17,y,powered?3:4);}
    if(f<73){for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++)if(dx*dx+dy*dy<=10){const dir=top?1:-1;const mouth=f%4<2&&dx*dir>=0&&Math.abs(dy)<=Math.abs(dx);if(!mouth)dot(x+dx,y+dy,5);}dot(x+(top?0:-1),y-2,0);}
    if(f>=71){sprite(10,21,['.55...55.','5555.5555','555555555','.5555555.','..55555..','...555...','....5....']);spark(5,23);spark(26,24);}
  }else{
    // Three girders, two ladders, one very small rescue mission.
    for(const y of [10,20,30]){rect(1,y,30,2,2);for(let x=2;x<30;x+=4)dot(x,y+1,5);}
    const ladder=(x,y)=>{rect(x,y,1,9,3);rect(x+3,y,1,9,3);for(let j=1;j<9;j+=3)rect(x,y+j,4,1,3);};ladder(25,21);ladder(4,11);
    sprite(2,2,['.55555.','5555555','5050505','5555555','.55555.','55...55','55...55']);
    sprite(24,3,['.44.','.55.','4444','.44.','4..4']);
    const barrel=(x,y)=>sprite(x,y,[f%2?'555':'575','757',f%2?'575':'555']);
    let hx,hy,jump=0;
    if(f<28){hx=2+f*.85;hy=24;const p=(f-11)/8;if(p>=0&&p<=1)jump=Math.round(Math.sin(p*Math.PI)*5);}
    else if(f<40){hx=25;hy=24-(f-28)*.84;}
    else if(f<65){hx=25-(f-40)*.84;hy=14;const p=(f-48)/8;if(p>=0&&p<=1)jump=Math.round(Math.sin(p*Math.PI)*5);}
    else if(f<76){hx=4;hy=14-(f-65)*.91;}
    else{hx=4+(f-76)*1.45;hy=4;}
    if(f<28)barrel(30-f*.9,27);if(f>=39&&f<66)barrel(1+(f-39)*.9,17);if(f<76)barrel(12+(f%16),7);
    const walk=f%4<2;const rows=['.222.','22222','.550.','.55..','22322','.333.',walk?'33.33':'.3.3.'];sprite(Math.round(hx),Math.round(hy-jump)-1,rows);
    if(f>=82){spark(18,2);spark(29,1);sprite(19,0,['4.4','444','.4.']);}
  }
  return a;
}
const $ = id => document.getElementById(id);
let selected=0,frameIndex=0,previewPaused=false,device=null,characteristic=null;
let sending=false,wanted=null,epoch=0,demoTimer=null,demoIndex=0,lastSent=null,brightnessPending=false;
let previousPixels=null,liveFrame=0,activeTransport=null;
const cache=new Map();
function pixels(mood,f){
  const a=new Uint8Array(1024), blink=f===6, gaze=[0,0,1,1,0,-1,-1,0][f];
  const set=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<32&&y<32)a[y*32+x]=c;};
  const rect=(x,y,w,h,c)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)set(i,j,c);};
  const line=(x,y,x2,y2,c)=>{const n=Math.max(Math.abs(x2-x),Math.abs(y2-y));for(let i=0;i<=n;i++)set(x+(x2-x)*i/(n||1),y+(y2-y)*i/(n||1),c);};
  const eye=(x,y,w,h,c)=>{rect(x+1,y,w-2,h,c);rect(x,y+1,w,h-2,c);};
  const heart=(x,y,c)=>{['0110110','1111111','1111111','0111110','0011100','0001000'].forEach((r,j)=>[...r].forEach((v,i)=>{if(v==='1')set(x+i,y+j,c);}));};
  const eyes=(color=1,h=9,y=9)=>{for(const x of [5,20]){eye(x,y,7,h,color);if(h>3)rect(x+2+gaze,y+3,2,Math.max(1,h-5),0);}};
  if(mood==='curious'){eyes(1,blink?2:9,blink?13:9);line(5,6,11,5,1);line(20,5,26,6,1);rect(14,23,4,2,1);}
  if(mood==='happy'){for(const x of [5,20]){line(x,13,x+3,10,1);line(x+3,10,x+6,13,1);}line(10,23,13,26,1);line(13,26,19,26,1);line(19,26,22,23,1);if(f%4<2){rect(2,18,3,2,4);rect(27,18,3,2,4);}}
  if(mood==='suspicious'){eyes(5,blink?2:5,12);line(4,7,12,10,5);line(19,10,27,7,5);line(13,25,19,23,5);}
  if(mood==='angry'){eyes(2,blink?2:6,12);for(let i=0;i<9;i++){rect(4+i,6+Math.floor(i/2),1,2,2);rect(19+i,10-Math.floor(i/2),1,2,2);}line(11,26,15,23,2);line(15,23,20,26,2);if(f%2===0){rect(28,3,2,2,2);rect(27,5,2,2,2);}}
  if(mood==='sleepy'){for(const x of [5,20]){line(x,14,x+6,14,3);line(x+1,15,x+5,15,3);}rect(14,23,f%4<2?4:3,f%4<2?3:2,3);const y=4-(f%3);line(23,y,27,y,3);line(27,y,23,y+4,3);line(23,y+4,27,y+4,3);}
  if(mood==='shocked'){eyes(6,blink?3:12,7);eye(13,23,6,7,6);rect(15,25,2,3,0);}
  if(mood==='love'){heart(4,10,4);heart(21,10,4);line(11,23,14,25,4);line(14,25,18,25,4);line(18,25,21,23,4);if(f%4<2){set(15,4,4);set(16,3,4);set(17,4,4);set(16,5,4);}}
  if(mood==='freeze'){const d=f%2;for(const x of [5,20]){line(x,10,x+6,16,3);line(x+6,10,x,16,3);}rect(9+d,23,14,5,6);for(let x=11;x<22;x+=3)rect(x+d,23,1,5,0);line(9+d,25,22+d,25,0);for(let k=0;k<4;k++){let x=2+k*8,y=(f*2+k*5)%21;set(x,y,3);set(x-1,y+1,3);set(x+1,y+1,3);set(x,y+2,3);}}
  return a;
}
// GIF89a encoder. Frequent clear codes keep LZW at a fixed 4-bit width.
function encodeGif(frames,delay=18){
  const out=[];const byte=(...v)=>out.push(...v);const word=n=>byte(n&255,n>>8&255);const ascii=s=>byte(...[...s].map(c=>c.charCodeAt(0)));
  ascii('GIF89a');word(32);word(32);byte(0xf2,0,0);for(const rgb of PALETTE)byte(...rgb);
  byte(0x21,0xff,11);ascii('NETSCAPE2.0');byte(3,1,0,0,0);
  for(const frame of frames){byte(0x21,0xf9,4,4);word(delay);byte(0,0);byte(0x2c);word(0);word(0);word(32);word(32);byte(0,3);
    const codes=[];for(let p=0;p<frame.length;p+=6){codes.push(8);for(let j=p;j<Math.min(p+6,frame.length);j++)codes.push(frame[j]);}codes.push(9);
    const packed=new Uint8Array(Math.ceil(codes.length/2));codes.forEach((c,i)=>packed[i>>1]|=c<<((i%2)*4));
    for(let p=0;p<packed.length;p+=255){let chunk=packed.slice(p,p+255);byte(chunk.length,...chunk);}byte(0);
  }byte(0x3b);return Uint8Array.from(out);
}
function asset(index){if(!cache.has(index)){const frames=Array.from({length:lengthOf(index)},(_,f)=>isScene(index)?scenePixels(SCENES[index-MOODS.length].id,f):pixels(MOODS[index][0],f));cache.set(index,{frames,gif:encodeGif(frames,isScene(index)?25:18)});}return cache.get(index);}
function crc32(data){let crc=0xffffffff;for(const b of data){crc^=b;for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
function gifPackets(data){const result=[];for(let p=0;p<data.length;p+=4096){const body=data.slice(p,p+4096),packet=new Uint8Array(16+body.length),v=new DataView(packet.buffer);v.setUint16(0,packet.length,true);packet[2]=1;packet[4]=p?2:0;v.setUint32(5,data.length,true);v.setUint32(9,crc32(data),true);packet.set([0,0,12],13);packet.set(body,16);result.push(packet);}return result;}
// Pixel updates avoid the device's GIF decoder. Never exceed 120 pixels per
// command (some panel firmware crashes above 255). Erasures are black pixels.
function pixelPackets(next,previous){const packets=[];for(let color=0;color<PALETTE.length;color++){let coords=[];for(let i=0;i<1024;i++)if(next[i]===color&&(!previous||previous[i]!==color))coords.push(i);for(let p=0;p<coords.length;p+=120){const group=coords.slice(p,p+120),packet=new Uint8Array(8+group.length*2);new DataView(packet.buffer).setUint16(0,packet.length,true);packet.set([5,1,0,...PALETTE[color]],2);group.forEach((i,j)=>packet.set([i%32,Math.floor(i/32)],8+j*2));packets.push(packet);}}return packets;}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function log(text){$('log').textContent=(new Date().toLocaleTimeString()+' '+text+'\n'+$('log').textContent).slice(0,4000);}
function status(text){$('status').textContent=text;log(text);}
function connected(){return !!(device?.gatt?.connected&&characteristic);}
async function write(packet,token){const size=Number($('chunk').value);for(let p=0;p<packet.length;p+=size){if(token!==epoch||!connected())throw new Error('Connection changed.');const part=packet.slice(p,p+size);if(characteristic.properties.write)await characteristic.writeValueWithResponse(part);else await characteristic.writeValueWithoutResponse(part);if(p+size<packet.length)await wait(30);}}
async function pump(){if(sending||!connected())return;sending=true;const token=epoch;
  try{while(connected()&&token===epoch&&(wanted!==null||brightnessPending)){if(brightnessPending){brightnessPending=false;await write(Uint8Array.of(5,0,4,128,Number($('brightness').value)),token);}if(wanted!==null){const next=wanted;wanted=null;const transport=$('transport').value;const changed=lastSent!==next||activeTransport!==transport;
    if(activeTransport!==transport){await write(Uint8Array.of(5,0,7,1,1),token);await write(Uint8Array.of(5,0,4,1,transport==='live'?1:0),token);await wait(150);previousPixels=null;activeTransport=transport;}
    if(transport==='live'){const frame=stagePixels(next,liveFrame);for(const p of pixelPackets(frame,previousPixels))await write(p,token);previousPixels=frame;liveFrame++;}
    else{status('Uploading '+titleOf(next)+' GIF…');for(const p of gifPackets(asset(next).gif)){await write(p,token);await wait(200);}}
    lastSent=next;if(changed)status(titleOf(next)+' sent via '+(transport==='live'?'direct pixels':'GIF')+'. Check the display.');}}}
  catch(e){wanted=null;brightnessPending=false;stopDemo();status('Send failed: '+e.message+' Try a smaller chunk size, reconnect, then Send again.');}
  finally{sending=false;update();if(connected()&&(wanted!==null||brightnessPending))pump();}
}
function update(){$('connect').disabled=connected()||sending;$('disconnect').disabled=!connected();$('mode').textContent=connected()?'Bluetooth connected':'Preview only';$('moodName').textContent=titleOf(selected);document.querySelectorAll('.mood').forEach((b,i)=>b.classList.toggle('active',i===selected));document.querySelectorAll('.sceneCard').forEach(b=>b.classList.toggle('active',b.demoIndex===selected));}
function selectCategory(category){for(const id of ['faces','arcade','playground','screensavers','worlds']){$('panel-'+id).hidden=id!==category;$('tab-'+id).setAttribute('aria-selected',String(id===category));}}
function choose(index,manual=true){if(manual)stopDemo();selected=index;frameIndex=0;liveFrame=0;previewPaused=false;selectCategory(isScene(index)?SCENES[index-MOODS.length].category||'arcade':'faces');if(isScene(index))$('transport').value='live';update();if(connected()){wanted=index;pump();}}
function stopDemo(){clearInterval(demoTimer);demoTimer=null;$('demo').textContent='Cycle faces';}
function disconnected(){epoch++;characteristic=null;wanted=null;brightnessPending=false;lastSent=null;activeTransport=null;previousPixels=null;stopDemo();status('Disconnected. Preview still works.');update();}
async function connect(){if(!navigator.bluetooth){status('Web Bluetooth is unavailable. Open this page in Chrome or Edge on localhost.');return;}$('connect').disabled=true;try{device=await navigator.bluetooth.requestDevice({acceptAllDevices:true,optionalServices:['000000fa-0000-1000-8000-00805f9b34fb']});device.addEventListener('gattserverdisconnected',disconnected);const server=await device.gatt.connect();const service=await server.getPrimaryService('000000fa-0000-1000-8000-00805f9b34fb');characteristic=await service.getCharacteristic('0000fa02-0000-1000-8000-00805f9b34fb');epoch++;status('Connected to '+device.name);brightnessPending=true;wanted=selected;update();pump();}catch(e){if(device?.gatt?.connected)device.gatt.disconnect();characteristic=null;status(e.name==='NotFoundError'?'No device selected.':e.message);update();}}
MOODS.forEach((m,i)=>{const b=document.createElement('button');b.className='mood';b.innerHTML='<span><strong>'+m[1]+'</strong><br><small>'+m[2]+'</small></span><kbd>'+(i+1)+'</kbd>';b.onclick=()=>choose(i);$('moods').append(b);});
SCENES.forEach((s,i)=>{const b=document.createElement('button');b.className='sceneCard';b.demoIndex=MOODS.length+i;b.innerHTML='<canvas width="32" height="32" aria-hidden="true"></canvas><div><div class="row"><strong>'+s.name+'</strong><kbd>'+s.key+'</kbd></div><p>'+s.description+'</p><small>'+(s.frames===1?'Static name card':s.loop?'Continuous loop':'Plays once · about '+Math.round(s.frames/4)+' seconds')+'</small></div>';b.onclick=()=>choose(MOODS.length+i);$(s.category||'scenes').append(b);paint(b.querySelector('canvas').getContext('2d'),scenePixels(s.id,i?16:20));});
for(const id of ['faces','arcade','playground','screensavers','worlds'])$('tab-'+id).onclick=()=>selectCategory(id);
$('connect').onclick=connect;$('disconnect').onclick=()=>{stopDemo();device?.gatt?.disconnect();};
$('brightness').oninput=()=>{$('brightValue').textContent=$('brightness').value+'%';};$('brightness').onchange=()=>{brightnessPending=true;pump();};
$('download').onclick=()=>{const url=URL.createObjectURL(new Blob([asset(selected).gif],{type:'image/gif'}));const a=document.createElement('a');a.href=url;a.download='fridge-'+(isScene(selected)?SCENES[selected-MOODS.length].id:MOODS[selected][0])+'.gif';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);};
$('resend').onclick=()=>choose(selected);
$('transport').onchange=()=>{stopDemo();wanted=selected;pump();};
$('test').onclick=async()=>{if(!connected()){status('Connect the display first.');return;}if(sending){status('Wait for the current transfer, then try the pixel test again.');return;}stopDemo();previewPaused=true;wanted=null;sending=true;const token=epoch;try{await write(Uint8Array.of(5,0,7,1,1),token);await write(Uint8Array.of(5,0,4,128,60),token);await write(Uint8Array.of(5,0,4,1,1),token);await wait(150);const frame=new Uint8Array(1024);for(let y=8;y<24;y++)for(let x=8;x<24;x++)frame[y*32+x]=2;for(const p of pixelPackets(frame,null))await write(p,token);previousPixels=frame;activeTransport='live';status('Pixel test sent: look for a red square in the center. Choose a demo to resume.');}catch(e){status('Pixel test failed: '+e.message);}finally{sending=false;update();}};
$('demo').onclick=()=>{if(demoTimer){stopDemo();return;}demoIndex=0;choose(0,false);$('demo').textContent='Stop face cycle';demoTimer=setInterval(()=>{demoIndex++;if(demoIndex>=MOODS.length){stopDemo();return;}choose(demoIndex,false);},3000);};
$('stop').onclick=()=>{stopDemo();wanted=null;previewPaused=!previewPaused;status(previewPaused?'Paused. Direct pixel playback holds the last frame.':'Playback resumed.');};
document.addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.altKey||e.metaKey||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;if(e.key>='1'&&e.key<='8'){e.preventDefault();choose(Number(e.key)-1);}const scene=SCENES.findIndex(s=>s.key.toLowerCase()===e.key.toLowerCase());if(scene>=0){e.preventDefault();choose(MOODS.length+scene);}if(e.code==='Space'&&e.target.tagName!=='BUTTON'){e.preventDefault();$('stop').click();}});
function paint(ctx,data){const image=ctx.createImageData(32,32);data.forEach((c,i)=>{image.data.set([...PALETTE[c],255],i*4);});ctx.putImageData(image,0,0);}
const ctx=$('preview').getContext('2d');function render(){const f=connected()?Math.max(0,liveFrame-1):frameIndex;paint(ctx,stagePixels(selected,f));if(!connected()&&!previewPaused){frameIndex++;if(isScene(selected)&&!shouldLoop()&&frameIndex>=lengthOf(selected)){frameIndex=lengthOf(selected)-1;previewPaused=true;status(titleOf(selected)+' finished. Click its card to replay.');}}}render();setInterval(render,250);update();
setInterval(()=>{if(connected()&&$('transport').value==='live'&&!sending&&!previewPaused){if(isScene(selected)&&!shouldLoop()&&liveFrame>=lengthOf(selected)){previewPaused=true;status(titleOf(selected)+' finished. Click its card to replay.');return;}wanted=selected;pump();}},250);

