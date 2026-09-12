import { PrismaClient, ContactConfidence, ListingStatus } from "@prisma/client";
const prisma = new PrismaClient();
const fixtures = [
 ["OH-20","411 Riverstone Ave","Dayton",342000,20,18,0,false],
 ["OH-52","29 Fairwood Ct","Miamisburg",385000,52,24,1,false],
 ["OH-75","907 Meadow Run","Springboro",519000,75,28,1,false],
 ["OH-110","1842 Lantern Ridge Dr","Centerville",625000,110,36,2,false],
 ["OH-TOUR","72 Orchard View Ln","Beavercreek",475000,83,31,1,true]
] as const;
async function main(){const source=await prisma.listingSource.upsert({where:{name:"fictional-seed"},update:{authorized:true},create:{name:"fictional-seed",type:"MOCK",authorized:true}});for(const [externalId,address,city,price,daysOnMarket,photoCount,priceReductionCount,has3DTour] of fixtures){const agent=await prisma.agent.create({data:{name:`Demo Agent ${externalId}`,email:`${externalId.toLowerCase()}@example.invalid`,source:"fictional-seed",contactConfidence:ContactConfidence.PUBLIC_BUSINESS_CONTACT}});await prisma.listing.upsert({where:{sourceId_externalId:{sourceId:source.id,externalId}},update:{daysOnMarket},create:{externalId,sourceId:source.id,address,city,state:"OH",zip:city==="Miamisburg"?"45342":"45000",price,currentPrice:price,originalPrice:price+priceReductionCount*15000,daysOnMarket,photoCount,priceReductionCount,has3DTour,hasVirtualTour:has3DTour,status:ListingStatus.ACTIVE,agentId:agent.id}})}}
main().finally(()=>prisma.$disconnect());
