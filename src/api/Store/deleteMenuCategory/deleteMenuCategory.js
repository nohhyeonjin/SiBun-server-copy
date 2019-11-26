import { prisma } from "../../../../generated/prisma-client";

export default{
    Mutation: {
        deleteMenuCategory: async(_, args)=>{
            const {storeId, name}=args;

            const categoryFilterOptions = {
                AND: [ 
                    {store : {id : storeId }},
                    {name : name}
                ]
            };

            const getMenuCategory = await prisma.menuCategories({
                    where : categoryFilterOptions
                });

            const getMenuList = await prisma.menus({
                where : {menuCategory:{id:getMenuCategory[0].id}}
            }) 
            
            if(getMenuList.length > 0)
            {
                for(var i = 0; i < getMenuList.length; i++){
                    await prisma.deleteMenu({
                        id: getMenuList[i].id
                });
              }
            }

            await prisma.deleteMenu({
                id: getMenuCategory[0].id
            })

            return "메뉴카테고리와 메뉴들이 삭제되었습니다.";
        }
    }
}