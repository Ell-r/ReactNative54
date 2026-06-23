import "@/global.css";
import { View, Text, TextInput, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import {useRouter} from "expo-router";
import {authService} from "@/service/AuthService";
import {useState} from "react";
import {useAppDispatch} from "@/hooks/redux";
import IRegisterModel from "@/models/User/IRegisterModel";
import {loginSuccess} from "@/store/reducers/AuthSlice";
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from "expo-image-picker"
import {LinearGradient} from "expo-linear-gradient";
import {ImagePickerButton} from "@/components/form/ImagePickerButton";
import AuthTab from "@/components/auth/AuthTab";
import {serialize} from "object-to-formdata";

export default function RegisterScreen() {

    const {control, setValue, watch, handleSubmit} = useForm<IRegisterModel>();
    const [register] = authService.useRegisterMutation();
    const [serverError, setServerError] = useState<string | null>(null);
    const image = watch("imageFile");
    const router = useRouter();

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Доступ до галереї потрібен для вибору фото.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];

            setValue("imageFile", {
                uri: asset.uri,
                name: "avatar.jpg",
                type: "image/jpeg",
            });
        }

    }

    const onSubmit = async (data: IRegisterModel) => {
        const name = data.firstName.trim().split(" ");

        const sendData = {
            firstName: name[0],
            lastName: name.slice(1).join(" ") || "",
            email: data.email,
            password: data.password,
            imageFile: data.imageFile,
        };

        try{
            const result = await register(sendData).unwrap();

            if (result.token) {
                router.push("/login");
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
                    <Text className={"color-gray-300 mb-2"}>Already have an account?</Text>
                    <AuthTab label={"Sign in"} onPress={() => router.replace("/login")} className={"p-3 rounded-xl items-center bg-white/20 mb-2 me-4 cursor-pointer"} />
                </View>

                <View className="wSS-full h-3/2 bg-white p-6 rounded-t-3xl items-center">
                    <Text className="text-3xl m-3 font-bold">
                        Get started
                    </Text>
                    <Text className="text-1xl color-gray-400 m-3">
                        Enter your details below
                    </Text>


                    <View>

                        <View className={"items-center my-8"}>
                            <ImagePickerButton
                                imageUri = {image?.uri ?? null}
                                onPress = {pickImage}
                            />
                            <Text className="text-zinc-400 dark:text-zinc-500 mt-2">
                                Click to choose a photo
                            </Text>
                        </View>

                        <Controller control={control}
                                    name = "firstName"
                                    rules={{ required: "FullName is required" }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            placeholder="FullName"
                                            value={value}
                                            onChangeText={onChange}
                                            className={"border border-neutral-300 rounded-xl w-96 p-5 color-black mt-3"}
                                        />
                                    )}/>

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
                                    Sign up
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

