import {RegisterFormData, RegisterResponse} from "@/app/auth/register/type";
import {signIn} from "next-auth/react";
import {LoginFormData, LoginResponse} from "@/app/auth/login/types";
import {getAccessToken} from "@/utils/token";
import {CALL_LOGIN_GG} from "./api.service";

const register = async (
    formData: RegisterFormData
): Promise<RegisterResponse> => {
    const response = await fetch(`/api/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
        return {success: false, mess: data.mess || "Đăng ký thất bại"};
    }

    return {success: true, mess: "Đăng ký thành công!", data: data.result};
};

const login = async (formData: LoginFormData): Promise<LoginResponse> => {
    const response = await fetch(`/api/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.mess || "Đăng nhập thất bại");
    }
    return data;
};

const logout = async (): Promise<void> => {
    const accessToken = getAccessToken();
    if (!accessToken) {
        return;
    }

    await fetch(`/api/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({accessToken}),
    });
};

const loginWithSocial = (provider: "google" | "facebook") => {
    if (provider === "google") {
        window.location.href = CALL_LOGIN_GG;
        return Promise.resolve();
    }
    return signIn(provider);
};

const loginWithGoogle = async (code: string): Promise<LoginResponse> => {
    const response = await fetch(
        `http://localhost:8080/project/oauth2/callback?code=${code}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const data = await response.json();


    if (!response.ok) {
        throw new Error(data.mess || data.message || "Authentication failed");
    }
    const data1 = data.data
    return {
        mess: data1.message || "Login successful",
        user: data1.user,
        accessToken: data1.token.accessToken,
        refreshToken: data1.token.refreshToken,
    };
};

export const AuthService = {
    register,
    login,
    logout,
    loginWithSocial,
    loginWithGoogle,
};
