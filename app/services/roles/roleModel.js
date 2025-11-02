import mongoose from 'mongoose';
import { MongoDB, Redis } from '../../global.js';
import RoleSchema from './roleSchema.js';
import { getEnv, log, random, toObjectId } from '../../core/utils.js';
import datetime from '../../core/datetime.js';

export default class RoleModel {
    constructor() {
        this.model = MongoDB.db.model('role', RoleSchema);
    }
    async index() {
        try{
            const result = await this.model.find();
            
            return result;
        }catch(e){
            return e.toString();
        }
        


    }

    async getRoleId(roleName){
        return await this.model.findOne({name:roleName},'_id') ?? null;
    }
    
    async add(name,permissions) {
        try{
            const resultCheckName = await this.checkName(name);
            if(resultCheckName > 0){
                return -1;
            }
            const data = {
                "name": name,
                "permissions": permissions,
                "createdAt": datetime.toJalaali()
            };
            const row = await new this.model(data);
            const result = await row.save();
            return result;
        }catch(e){
            return e.toString();
        }
        


    }

    async delete(id){
        const currentRole = await this.view(id);
        if(!currentRole)       
            //user is not exist!
            return -1
        await this.model.deleteOne({'_id' : id})
        return 1
    }

    async view(roleId) {
        roleId = toObjectId(roleId);
        if (roleId) {
            return await this.model.findOne({ '_id': roleId })
        } else {
            return null;
        }
    }

    async checkTille(name) {
        return this.model.findOne({ 'name': name }).countDocuments();
    }

    async edit(userId, firstName, lastName, phone) {
        const currentUser = await this.getProfile(userId);
        const data = {
            'firstName': firstName,
            'lastName': lastName,
            'modifiedAt': datetime.toJalaali(),
        }
        if (phone !== '' && phone !== currentUser?.phone) {
            const phoneIsDup = await this.checkPhone(phone);
            if (phoneIsDup > 0)
                return -1;//phone is already!
            else
                data['phone'] = phone;
        }
        const resultUpdate = await this.model.updateOne({ '_id': userId }, {
            '$set': data
        })

        return 1; //update successful


    }

}


