#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const vertices = []; const faces = []; const groups = [];
function vertex(x,y,z){ vertices.push([x,y,z]); return vertices.length; }
function box(name,x1,y1,z1,x2,y2,z2,material){const v=[vertex(x1,y1,z1),vertex(x2,y1,z1),vertex(x2,y2,z1),vertex(x1,y2,z1),vertex(x1,y1,z2),vertex(x2,y1,z2),vertex(x2,y2,z2),vertex(x1,y2,z2)];groups.push({name,material,start:faces.length});faces.push([v[0],v[1],v[2],v[3]],[v[4],v[7],v[6],v[5]],[v[0],v[4],v[5],v[1]],[v[1],v[5],v[6],v[2]],[v[2],v[6],v[7],v[3]],[v[4],v[0],v[3],v[7]]);}
function roof(){const a=vertex(-5,3,3),b=vertex(5,3,3),c=vertex(5,3,9),d=vertex(-5,3,9),e=vertex(-5,5,6),f=vertex(5,5,6);groups.push({name:"gable_roof",material:"Roof",start:faces.length});faces.push([a,b,f,e],[d,e,f,c],[a,e,d],[b,c,f],[a,d,c,b]);}
export function buildModel(){
  vertices.length = 0; faces.length = 0; groups.length = 0;
  box("house_body",-4.6,0,-1.8,4.6,3,8.8,"Siding"); roof();
  box("front_door",-0.8,0,-1.86,0.8,2.3,-1.7,"Door");
  box("window_left",-3.7,1,-1.87,-1.8,2.25,-1.69,"Glass"); box("window_right",1.8,1,-1.87,3.7,2.25,-1.69,"Glass");
  box("garage",-4.2,0,8.82,0.8,2.35,9.2,"Garage");
  box("foundation",-5,-0.25,-2.2,5,0,9.3,"Foundation");
  box("porch",-1.5,0,-3.5,1.5,0.22,-1.9,"Wood");
  const header=["# Listing Revival synthetic example house","# Units are illustrative; not architecturally accurate","mtllib example-house.mtl","o example_house"];
  let out=header.join("\n")+"\n"+vertices.map(v=>`v ${v.join(" ")}`).join("\n")+"\n";
  groups.forEach((g,index)=>{const end=groups[index+1]?.start??faces.length;out+=`g ${g.name}\nusemtl ${g.material}\n`;for(let i=g.start;i<end;i++)out+=`f ${faces[i].join(" ")}\n`;});
  return {obj:out,vertexCount:vertices.length,faceCount:faces.length};
}
const mtl=`newmtl Siding\nKd 0.78 0.72 0.60\nnewmtl Roof\nKd 0.16 0.20 0.18\nnewmtl Door\nKd 0.18 0.34 0.27\nnewmtl Glass\nKd 0.32 0.58 0.68\nd 0.72\nnewmtl Garage\nKd 0.70 0.68 0.61\nnewmtl Foundation\nKd 0.35 0.36 0.34\nnewmtl Wood\nKd 0.52 0.34 0.20\n`;
async function main(){const dir=resolve("public/models");await mkdir(dir,{recursive:true});const model=buildModel();await writeFile(resolve(dir,"example-house.obj"),model.obj);await writeFile(resolve(dir,"example-house.mtl"),mtl);await writeFile(resolve(dir,"example-house.json"),JSON.stringify({title:"Synthetic Listing Revival Example House",format:"Wavefront OBJ",vertexCount:model.vertexCount,faceCount:model.faceCount,source:"Procedurally generated; no listing photographs used",permissionRequired:false,commercialListingUse:false,disclosure:"AI-assisted synthetic visualization. Not based on a real property and not intended for measurements or architectural accuracy."},null,2)+"\n");console.log(`Generated OBJ: ${model.vertexCount} vertices, ${model.faceCount} faces`);}
if(process.argv[1]&&import.meta.url===new URL(`file://${resolve(process.argv[1])}`).href)main().catch(e=>{console.error(e);process.exitCode=1});
