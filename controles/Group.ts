import { Groups } from '../DB/entities/Groups.js';
import  dataSource from '../DB/dataSource.js';
import { User } from '../DB/entities/User.js';
import { Contact } from '../DB/entities/Contact.js';

const createGroup = async (groupName: string , userId: string) =>{
    
    return dataSource.manager.transaction(async transaction => {
        try{
            const newGroup = new Groups;
        const user = await User.findOneBy({ id: userId });
        if(user){
            newGroup.Admin.push(user)
            newGroup.Group_id.user.push(user);
            newGroup.created_by = userId;
        }
        
        await transaction.save(newGroup);
        return(newGroup);
        }catch(error){
            throw(error);
        }
    })
}

const deleteUser = async (group: Groups, contact: Contact) => {
    return dataSource.manager.transaction(async transaction => {
      try {
        // Update the Contact entity
        const cont = contact.contacts.filter(values => values.id !== group.id);
        const mute = contact.mutecontact.filter(values => values.id !== group.id);
        contact.contacts = cont;
        contact.mutecontact = mute;
  
        // Update the Group entity
        const user = group.Group_id.user.filter(user => user.id !== contact.id);
        const Admin = group.Admin.filter(user => user.id !== contact.id);
        group.Group_id.user = user;
        group.Admin = Admin;
  
        // Save the changes to both entities within the same transaction
        await transaction.save(contact);
        await transaction.save(group);
        await transaction.save(group.Group_id);
  
        return 'User removed from the group';
      } catch (error) {
        // Rollback the transaction if an error occurs
        throw new Error(`Failed to delete user from the group: ${error}`);
      }
    });
  };

export{
    createGroup,
    deleteUser
}