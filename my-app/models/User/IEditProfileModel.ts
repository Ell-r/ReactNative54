import {IImageFile} from "@/models/common/IImageFile";

export interface IEditProfileModel {
    firstName: string;
    lastName: string;
    email: string;
    imageFile?: IImageFile;
}