var canvas,ctx,width,height,interval,frameRate=1E3,frameCount=0,mouseX=0,mouseY=0,stats,showStats=!1;window.addEventListener("load",loadEvent);function loadEvent(){canvas=document.getElementById("Sketch");canvas.addEventListener("mousemove",mouseMoveEvent);canvas.addEventListener("click",mouseClickEvent);ctx=canvas.getContext("2d");width=canvas.width;height=canvas.height;setup();showStats&&setupStats();interval=setInterval(loop,1E3/frameRate)}
function findOffset(a){var b=curY=0;if(a.offsetParent){do b+=a.offsetLeft,curY+=a.offsetTop;while(a=a.offsetParent);return{x:b,y:curY}}}function mouseMoveEvent(a){var b=findOffset(canvas);mouseX=a.pageX-b.x;mouseY=a.pageY-b.y;"undefined"!=typeof mouseMoved&&mouseMoved()}function mouseClickEvent(){"undefined"!=typeof mousePressed&&mousePressed()}function loop(){showStats&&stats.begin();draw();showStats&&stats.end();frameCount++}
function setupStats(){stats=new Stats;stats.setMode(0);stats.domElement.style.position="absolute";stats.domElement.style.top=".5em";stats.domElement.style.left=".5em";document.body.appendChild(stats.domElement)}function millis(){return Date.now()}function smoothStep(a){return 3*a*a-2*a*a*a}function constrain(a,b,c){return a<b?b:a>c?c:a}function print(a){console.log(a)}function dist(a,b,c,k){dx=c-a;dy=k-b;return Math.sqrt(dx*dx+dy*dy)}
function random(a,b){return"undefined"===typeof a?Math.random():"undefined"===typeof b?Math.random()*a:Math.random()*(b-a)+a}function pow(a,b){return Math.pow(a,b)}function floor(a){return a|0}function lerp(a,b,c){return a+(b-a)*c}function abs(a){return 0>a?-a:a}function pick(a){if("undefined"===typeof a)return 0.5<Math.random();var b=random(a)|0;return b<a?b:a}function rgb(a){return"rgb("+a+","+a+","+a+")"}
function fill(a,b){"undefined"===typeof b&&(b=this.ctx);b.strokeStyle=b.fillStyle=rgb(a|0)}function triangle(a,b,c,k,p,m,e){"undefined"===typeof e&&(e=this.ctx);e.beginPath();e.moveTo(a|0,b|0);e.lineTo(c|0,k|0);e.lineTo(p|0,m|0);e.fill();e.stroke();e.closePath()}function loadImages(a){var b=[];for(i in a){var c=new Image;c.src=a[i];b.push(c)}return b}function createCanvas(a,b){var c=document.createElement("canvas");c.width=a;c.height=b;return c}
function imageToRaw(a){a=imageToCanvas(a);return getImageData(a).data}function imageToCanvas(a,b,c){"undefined"===typeof b&&(b=a.width);"undefined"===typeof c&&(c=a.height);buffer=createCanvas(b,c);buffer.getContext("2d").drawImage(a,0,0,b,c);return buffer}function getImageData(a){return getContext(a).getImageData(0,0,a.width,a.height)}function getContext(a){return a.getContext("2d")}
function background(a,b){"undefined"===typeof b&&(b=this.ctx);b.save();b.fillStyle=rgb(a);b.fillRect(0,0,width,height);b.restore()};var base,target,baseSmall,targetSmall,screenImageData,baseCanvas,baseImageData,positions,states,pw,ph,pn,pieceSize=10,moveRadius=16,moveTime=2E3,piecePositions,backwards=!1,lastBackwards=!1,backwardsStart=0,idleTime=4E3,lastMouseMoved=millis();
function setupMosaic(){pw=floor(width/pieceSize);ph=floor(height/pieceSize);pn=pw*ph;baseSmall=resizeArea(base,pw,ph);targetSmall=resizeArea(target,pw,ph);positions=findMosaic(baseSmall,targetSmall);states=Array(pn);for(i=0;i<pn;i++)states[i]=0;piecePositions=Array(pn);screenImageData=ctx.createImageData(width,height);baseCanvas=imageToCanvas(base);baseImageData=getImageData(baseCanvas)}
function drawMosaic(){sw=floor(width/pw);sh=floor(height/ph);pi=0;src=baseImageData.data;dst=screenImageData.data;stepSize=4*(width-sw);var a,b,c,k;for(py=0;py<ph;py++)for(px=0;px<pw;px++){a=piecePositions[pi];b=px*sw;c=py*sh;k=a.x;a=a.y;b=4*(c*width+b);k=4*(a*width+k);for(a=0;a<sh;a++){for(c=0;c<sw;c++)dst[k++]=src[b++],dst[k++]=src[b++],dst[k++]=src[b++],dst[k++]=255,b++;b+=stepSize;k+=stepSize}pi++}ctx.putImageData(screenImageData,0,0)}
function resizeArea(a,b,c){sw=a.width;sh=a.height;w=floor(sw/b);h=floor(sh/c);dstCanvas=createCanvas(b,c);srcImageData=getImageData(a);dstImageData=dstCanvas.getContext("2d").createImageData(b,c);srcData=srcImageData.data;dstData=dstImageData.data;i=0;n=w*h;var k,p,m,e,d;sum=Array(3);for(k=0;k<c;k++)for(a=0;a<b;a++){sum[0]=0;sum[1]=0;sum[2]=0;p=4*(k*h*sw+a*w);m=4*(sw-w);for(d=0;d<h;d++){for(e=0;e<w;e++)sum[0]+=srcData[p++],sum[1]+=srcData[p++],sum[2]+=srcData[p++],p++;p+=m}dstData[i]=sum[0]/n;dstData[i+
1]=sum[1]/n;dstData[i+2]=sum[2]/n;dstData[i+3]=255;i+=4}dstCanvas.getContext("2d").putImageData(dstImageData,0,0);return dstCanvas}function getLightness(a,b){b*=4;return(a[b]+a[b+1]+a[b+2])/3}function flatten(a){flat=[];for(i=0;i<a.length;++i)for(j=0;j<a[i].length;++j)flat.push(a[i][j]);return flat}
function findMosaic(a,b){positions=Array(pn);srcData=getImageData(a).data;dstData=getImageData(b).data;binCount=256;srcBins=Array(binCount);dstBins=Array(binCount);for(i=0;i<binCount;++i)srcBins[i]=[],dstBins[i]=[];for(i=0;i<pn;++i)srcBins[getLightness(srcData,i)|0].push(i),dstBins[getLightness(dstData,i)|0].push(i);flatSrc=flatten(srcBins);flatDst=flatten(dstBins);for(i=0;i<pn;++i)positions[flatSrc[i]]=flatDst[i];return positions}
function trigger(a,b){var c=b*pw+a;0==states[c]&&(states[c]=millis())}function mouseMoved(){var a=mouseX/pieceSize,b=mouseY/pieceSize;if(0<=a&&0<=b&&a<pw&&b<ph)for(i=0;i<pw;i++)for(j=0;j<ph;j++)dist(i,j,a,b)<moveRadius*random(0.1,1)&&trigger(i,j);lastMouseMoved=millis()}function mousePressed(){backwards||(backwards=!0,backwardsStart=millis())}
function updateMosaic(){var a=height,b=floor(width/pw),a=floor(a/ph),c=millis(),k=0,p,m,e,d,f,g,l,o,r,B=c-backwardsStart;c-lastMouseMoved>idleTime&&trigger(pick(pw),pick(ph));if(lastBackwards&&B>moveTime){backwards=!1;for(i=0;i<states.length;i++)states[i]=0;"undefined"!=typeof regenerate&&regenerate()}lastBackwards=backwards;for(m=0;m<ph;m++)for(p=0;p<pw;p++)e=positions[k],d=floor(e/pw),f=e-d*pw,g=p*b,e=m*a,f*=b,d*=a,l=backwards?constrain(backwardsStart-states[k],0,moveTime)-B:constrain(c-states[k],
0,moveTime),l=0==states[k]?0:constrain(l/moveTime,0,1),l=smoothStep(l),o=floor(abs(f-g)),r=floor(abs(d-e)),l*=o+r,o>r?(g=floor(0==o?f:lerp(g,f,constrain(l,0,o)/o)),e=floor(0==r?d:lerp(e,d,constrain(l-o,0,r)/r))):(g=floor(0==o?f:lerp(g,f,constrain(l-r,0,o)/o)),e=floor(0==r?d:lerp(e,d,constrain(l,0,r)/r))),piecePositions[k]={x:g,y:e},k++};var files="data/pdfglitch.png data/building.png data/bytebeat.png data/cmdtab.png data/gpunoise.png data/infinitefill.png data/interface.png data/stacks.png data/street.png".split(" "),images=loadImages(files),dataWidth,dataHeight;function flipnib(a){return(a&15)<<4|(a&240)>>4}function flipopp(a){return(a&170)>>1|(a&85)<<1}
function decode(a){for(var b,c=0,k=4*dataWidth*dataHeight;c<k;)b=(c>>2)%256,a[c]=b^flipopp(b^flipnib(b^a[c++])),a[c]=b^flipopp(b^flipnib(b^a[c++])),a[c]=b^flipopp(b^flipnib(b^a[c++])),c++}var imagesData,regionMap,modeMap,blendMap;
function setupBaseGenerator(){dataWidth=images[0].width;dataHeight=images[0].height;imagesData=Array(images.length);for(i in images)imagesData[i]=imageToRaw(images[i]),-1!=files[i].indexOf("noise")&&decode(imagesData[i]);base=createCanvas(width,height);regionMap=createCanvas(width,height);modeMap=createCanvas(width,height);blendMap=createCanvas(width,height)}function generateBase(){passes=1+pick(2);for(i=0;i<passes;i++)createSingle();saturate()}
function createSingle(){buildTriangleField(regionMap,images.length,random(8,1024));buildTriangleField(modeMap,255,random(8,64));buildTriangleField(blendMap,4,random(32,512));var a=getImageData(base),b=getImageData(regionMap),c=getImageData(modeMap),k=getImageData(blendMap),p=dataWidth*dataHeight,m=width*height,e=0,d=-1,f=0,g=1,l=floor(pow(2,random(1,6))),o=0.2>random(),r=a.data,b=b.data,c=c.data,k=k.data,B,s=0,t=0,E=0==frameCount,u,q,C,D,v,z,A;for(B=0;B<m;B++,t+=4){e=b[t]%images.length;1==g?s++:o?
0==B%g&&s++:0==B%width%g&&s++;if(e!=d)if(f=c[t],g=0<(f&1)?l:1,0<(f&2)&&0<(f&4))s=0;else{if(0<(f&8)||0<(f&16))s=floor(floor(B/width)/g)*dataWidth;0<(f&32)&&(s+=B%width)}s%=p;q=imagesData[e][4*s];C=imagesData[e][4*s+1];D=imagesData[e][4*s+2];if(E)v=q,z=C,A=D;else switch(d=r[t],f=r[t+1],u=r[t+2],k[t]%4){case 0:v=q;z=C;A=D;break;case 1:v=255-((255-d)*(255-q)>>8);z=255-((255-f)*(255-C)>>8);A=255-((255-u)*(255-D)>>8);q=128;v=d+((v-d)*q>>8);z=f+((z-f)*q>>8);A=u+((A-u)*q>>8);break;case 2:v=d*q>>8;z=f*C>>
8;A=u*D>>8;q=128;v=d+((v-d)*q>>8);z=f+((z-f)*q>>8);A=u+((A-u)*q>>8);break;case 3:v=128>d?d*q>>7:255-((255-d)*(255-q)>>7),z=128>f?f*C>>7:255-((255-f)*(255-C)>>7),A=128>u?u*D>>7:255-((255-u)*(255-D)>>7),q=128,v=d+((v-d)*q>>8),z=f+((z-f)*q>>8),A=u+((A-u)*q>>8)}r[t]=v;r[t+1]=z;r[t+2]=A;r[t+3]=255;d=e}getContext(base).putImageData(a,0,0)}
function saturate(){buildTriangleField(blendMap,160,random(16,1024));var a=getImageData(base),b=getImageData(blendMap),c=a.data,b=b.data,k=width*height,p,m=0,e,d,f,g,l,o;for(p=0;p<k;p++,m+=4)if(e=c[m],d=c[m+1],f=c[m+2],l=g=e,d>g&&(g=d),f>g&&(g=f),d<l&&(l=d),f<l&&(l=f),l!=g){l=g-l;e==g?(d=(d-f)/l,0>d&&(d+=6)):d=d==g?2+(f-e)/l:4+(e-d)/l;e=d|0;mode=b[m];if(100>mode)switch(d-=e,o=mode/100,f=(1-o)*g,l=(1-o*d)*g,o=(1-o*(1-d))*g,e){case 0:e=g;d=o;break;case 1:e=l;d=g;break;case 2:e=f;d=g;f=o;break;case 3:e=
f;d=l;f=g;break;case 4:e=o;d=f;f=g;break;default:e=g,d=f,f=l}else if(150>mode)switch(e){case 0:e=g;f=d=255;break;case 1:e=255;d=g;f=255;break;case 2:e=255;d=g;f=255;break;case 3:d=e=255;f=g;break;case 4:d=e=255;f=g;break;default:e=g,f=d=255}else e=d=f=g;c[m]=e;c[m+1]=d;c[m+2]=f}getContext(base).putImageData(a,0,0)}
function buildTriangleField(a,b,c){a=getContext(a);ox=-random(c);for(y=py=oy=-random(c);py<height;){x=px=ox;for(y+=c;px<width;)px=x,x+=c,off=pick()?0:random(c/4),pick()?(fill(pick(b),a),triangle(px,py,px-off,y+off,x,py,a),fill(pick(b),a),triangle(x,py,x,y,px-off,y+off,a)):(fill(pick(b),a),triangle(px-off,py-off,px,y,x,y,a),fill(pick(b),a),triangle(x,py,x,y,px-off,py-off,a));py=y}};var translationLatin="datu;veril\u0259nl\u0259r;podatak;dada;datumo;datu;donn\u00e9e;podatak;dato;g\u00f6gn;dati;duomenys;adat;gegeven;dados;dat\u0103;podatek;podatak;datos;veri;d\u1eef li\u1ec7u".split(";"),translationOther="\u03b4\u03b5\u03b4\u03bf\u03bc\u03ad\u03bd\u03b1 \u0434\u0430\u043d\u044b\u044f \u0434\u0430\u043d\u043d\u0438 \u6570\u636e \ub370\uc774\ud130 \u0628\u064a\u0627\u0646\u0627\u062a \u0989\u09aa\u09be\u09a4\u09cd\u09a4 \u062f\u0627\u062f\u0647 \u0434\u0435\u0440\u0435\u043a \u05e0\u05ea\u05d5\u05e0\u05d9\u05dd \u0431\u0435\u0440\u0438\u043b\u0438\u0448\u0442\u0435\u0440 \u043f\u043e\u0434\u0430\u0442\u043e\u043a \u0935\u093f\u0926\u093e \u30c7\u30fc\u30bf \u044b\u04a5\u043f\u0430\u043b\u0435 \u0434\u0430\u0442\u0430 \u0434\u0430\u043d\u043d\u044b\u0435 \u0627\u0639\u062f\u0627\u062f \u062f\u0631\u0627\u0648\u06d5 \u043f\u043e\u0434\u0430\u0442\u0430\u043a \u0ba4\u0bb0\u0bb5\u0bc1 \u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25 \u0434\u0430\u043d\u0456 \u0645\u0639\u0637\u06cc\u0627\u062a \u6570\u636e \u05d3\u05d0\u05d8\u05df".split(" "),
baseTranslation="data";function randomTranslation(){var a=random(5);return 3>a?translationOther[pick(translationOther.length)]:4>a?translationLatin[pick(translationLatin.length)]:baseTranslation}function setupText(a){"undefined"===typeof a&&(a=this.ctx);a.font="100px sans-serif";a.textAlign="center";a.textBaseline="middle"}
function drawCenteredText(a,b,c){"undefined"===typeof c&&(c=this.ctx);var k=c.measureText(a),b=b/k.width;c.save();c.translate(width/2,height/2);c.scale(b,b);c.fillText(a,0,0);c.restore()};function setup(){setupBaseGenerator();generateBase();generateTarget();setupMosaic()}function draw(){updateMosaic();drawMosaic()}function generateTarget(){target=createCanvas(width,height);targetCtx=getContext(target);setupText(targetCtx);background(255,targetCtx);drawCenteredText(randomTranslation(),750,targetCtx)}function regenerate(){generateBase();generateTarget();setupMosaic()};
