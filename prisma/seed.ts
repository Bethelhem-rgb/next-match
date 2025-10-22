import { PrismaClient } from "@prisma/client";
import { membersData } from "./membersDate";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();
async function seedMembers(){
    for(const member of membersData){
        const user = await prisma.user.create({

   
            data:{
                email: member.email,
                emailVerified: new Date(),
                name: member.name,
                passwordHash: await hash("password",10),
                image:member.image,
                member:{
                    create: {
                        name: member.name,
                        gender: member.gender,
                        
                        dateOfBirth: new Date(member.dateOfBirth),
                        description: member.description||"",
                        city: member.city,
                        country: member.country,
                        image:member.image,
                        createdAt: new Date(member.created),
                        updatedAt: new Date(member.lastActive),
                        
                        photos: {
                            create: [
                               { url: member.image,
                                
                            },
                        ],
                         } ,
                    },
                    },
                },
            
} );
console.log(`Created user ${user.name}with member ${member.name}`);
}
}
async function main() {
    await seedMembers();
}
main().catch((e )=>{
     console.error(e);
    process.exit(1);
}).finally(async()=>{
    await prisma.$disconnect();
}) ;