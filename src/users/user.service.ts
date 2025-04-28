import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async findByEmail(email: string): Promise<UserDocument> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<UserDocument> {
        const user = await this.userModel.findById(id).exec();
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async create(userData: Partial<User>): Promise<UserDocument> {
        const newUser = new this.userModel(userData);
        return newUser.save();
    }

    async updateStatus(userId: string, status: UpdateUserStatusDto['status']): Promise<UserDocument> {
        return this.userModel.findByIdAndUpdate(
            userId,
            { status, lastActive: new Date() },
            { new: true }
        ).exec();
    }

    async findAllUsers(): Promise<UserDocument[]> {
        return this.userModel.find().exec();
    }

    async searchUsers(query: string): Promise<UserDocument[]> {
        return this.userModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).exec();
    }
}