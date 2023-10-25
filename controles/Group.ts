import { Groups } from '../DB/entities/Groups.js';
import  dataSource from '../DB/dataSource.js';
import { User } from '../DB/entities/User.js';

const createGroup = async (groupName: string , userId: string) =>{
    return dataSource.manager.transaction(async transaction => {
        const newGroup = new Groups;
        const user = await User.findOneBy({ id: userId });
        if(user){
            newGroup.Admin.push(user)
            newGroup.Group_id.user.push(user);
            newGroup.created_by = userId;
        }

        await transaction.save(newGroup);
        return(newGroup);
    })
}

export{
    createGroup
}