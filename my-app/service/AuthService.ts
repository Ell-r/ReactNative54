import {createApi} from "@reduxjs/toolkit/query/react";
import {fetchBaseQuery} from "@reduxjs/toolkit/query";
import {BASE_URL_API} from "@/api";
// import {serialize} from "object-to-formdata";
import type IRegisterModel from "../models/User/IRegisterModel.ts";
import type ILoginModel from "../models/User/ILoginModel.ts";
import {serialize} from "object-to-formdata";
import IAccountModel from "@/models/User/IAccountModel";
import * as SecureStore from "expo-secure-store";
import {IEditProfileModel} from "@/models/User/IEditProfileModel";

export const authService = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL_API}/Account/`,
        prepareHeaders: async  (headers) => {
            const token = await SecureStore.getItemAsync("accessToken");
            headers.set('Content-Type', 'application/json');
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Auth'],
    endpoints: (build) => ({
        register: build.mutation<{token : string}, IRegisterModel>({
            query: (model)=>{
                const formData = serialize(model)
                return {
                    url: "Register",
                    method: "POST",
                    body: formData,
                }
            },
            invalidatesTags: ["Auth"]
        }),
        login: build.mutation<{token : string}, ILoginModel>({
            query: (model)=>{
                // const formData = serialize(model)
                return{
                    url: "Login",
                    method: "POST",
                    body: model,
                }
            }
        }),
        account: build.query<IAccountModel, void>({
            query: () => {
                return {
                    url: "Me",
                    method: "GET",
                }
            },
            providesTags: ["Auth"]
        }),
        editProfile: build.mutation<{token : string}, IEditProfileModel>({
            query: (model) => {
                const formData = serialize(model)
                return {
                    url: "EditProfile",
                    method: "PUT",
                    body: formData,
                }
            },
            invalidatesTags: ["Auth"],
        })
    })
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useAccountQuery,
    useEditProfileMutation,
} = authService;