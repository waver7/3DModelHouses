import test from "node:test";
import assert from "node:assert/strict";
import { buildTopFive, qualify, scoreListing } from "../scripts/run-top5.mjs";
const lead = { sourceAuthorized:true,address:"1 Test Ave",city:"Miamisburg",state:"OH",zip:"45342",price:600000,daysOnMarket:90,photoCount:20,priceReductionCount:1,has3DTour:false,hasVirtualTour:false,status:"ACTIVE",agent:{name:"Test Agent",email:"agent@example.invalid",contactConfidence:"VERIFIED"} };
test("selects an authorized verified candidate and drafts but does not send",()=>{const [result]=buildTopFive([lead]);assert.equal(result.action,"DRAFT_ONLY_PERMISSION_REQUIRED");assert.match(result.email.text,/No images will be processed before/);assert.equal(result.listing.score,100)});
test("rejects unauthorized sources",()=>assert.equal(qualify({...lead,sourceAuthorized:false}),false));
test("rejects unverified contact details",()=>assert.equal(qualify({...lead,agent:{...lead.agent,contactConfidence:"UNVERIFIED"}}),false));
test("rejects listings with an existing tour",()=>assert.equal(qualify({...lead,has3DTour:true}),false));
test("score normalizes to 100",()=>assert.equal(scoreListing(lead),100));
