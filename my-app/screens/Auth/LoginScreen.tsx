import "@/global.css";
import { View, Text, TextInput, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import {useRouter} from "expo-router";
import {authService} from "@/service/AuthService";
import {useState} from "react";
import {useAppDispatch} from "@/hooks/redux";
import ILoginModel from "@/models/User/ILoginModel";
import {loginSuccess} from "@/store/reducers/AuthSlice";
import * as SecureStore from 'expo-secure-store';
import {LinearGradient} from "expo-linear-gradient";
import AuthTab from "@/components/auth/AuthTab";

export default function LoginScreen() {

    const {control, handleSubmit} = useForm<ILoginModel>();
    const [login, { isLoading }] = authService.useLoginMutation();
    const [serverError, setServerError] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const onSubmit = async (data: ILoginModel) => {
        console.log("Form data:", data);
        try{
            const result = await login(data).unwrap();

            if (result.token) {
                console.log(result.token);
                dispatch(loginSuccess(result.token));
                await SecureStore.setItemAsync('accessToken',  result.token);
                router.push("/explore");
            }
        }
        catch(error: any){
            console.error("Error: ", error);

            if (error?.data) {
                setServerError(error.data);
                console.log(error.data);
            }

            else if (error?.status === 'FETCH_ERROR') {
                setServerError("There is no connection to the server. Check the internet.");
            }
            else{
                setServerError("Unknown error. Try again later.");
            }
        }
    };

    return (
        <>
            <LinearGradient
                colors={['#3127e8', '#cccdf8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.5, y: 0 }}
                className="flex-1"
            >
                <View className="flex-row items-center justify-end flex-1 gap-3">
                    <Text className={"color-gray-300 mb-16"}>Dont have an account?</Text>
                    <AuthTab label={"Get Started"} onPress={() => router.replace("/register")} className={"p-3 rounded-xl items-center bg-white/20 mb-16 me-4 cursor-pointer"}/>
                </View>
                <View className="w-full h-2/3 bg-white p-6 rounded-t-3xl items-center">
                    <Text className="text-3xl m-3 font-bold">
                        Welcome back
                    </Text>
                    <Text className="text-1xl color-gray-400 m-3">
                        Enter your details below
                    </Text>


                    <View>

                        <Controller control={control}
                                    name = "email"
                                    rules={{ required: "Email is required" }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            placeholder="Email"
                                            value={value}
                                            onChangeText={onChange}
                                            className={"border border-neutral-300 rounded-xl w-96 p-5 color-black mt-3"}
                                        />
                                    )}/>

                        <Controller control={control}
                                    name = "password"
                                    rules={{ required: "Password is required" }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            placeholder="Password"
                                            value={value}
                                            textContentType={"password"}
                                            onChangeText={onChange}
                                            className={"border border-neutral-300 rounded-xl w-96 p-5 color-black mt-3"}
                                        />
                                    )}/>

                        <Pressable onPress={() => handleSubmit(onSubmit)()}>
                            <LinearGradient
                                colors={['#3127e8', 'rgb(212,141,253)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    paddingVertical: 16,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    marginTop: 12,
                                    width: '100%',
                                    overflow: 'hidden',
                                }}
                            >
                                <Text className="text-white font-semibold text-lg">
                                    Sign in
                                </Text>
                            </LinearGradient>
                        </Pressable>

                        {serverError && (
                            <Text className="text-red-700 text-sm font-medium mt-1">
                                {serverError}
                            </Text>
                        )}
                    </View>
                </View>

            </LinearGradient>
        </>
    );
}

